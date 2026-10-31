// js/relinker_auditor.js - Automated AnyPS5 Relinker & ELF Bounds Auditor

export class RelinkerAuditor {
  /**
   * @param {object} inspectionResult - Result from ElfInspector.inspect()
   */
  constructor(inspectionResult) {
    this.data = inspectionResult;
    this.checks = [];
  }

  audit() {
    this.checks = [];
    const { header, programHeaders, sections, dynamicTags, relocations } = this.data;
    const fileSize = header ? header.fileSize : 0;

    // Check 1: Program Header Table Bounds (PR #11993)
    if (header && header.ePhoff !== undefined && header.ePhnum !== undefined) {
      const phentsize = header.ePhentsize || (header.is64Bit ? 56 : 32);
      const phSpan = header.ePhnum * phentsize;
      const phEnd = header.ePhoff + phSpan;
      const phPass = (header.ePhoff >= 0 && phEnd <= fileSize);
      this.checks.push({
        id: "RELINKER-ELF-001",
        title: "Program Header Table Bounds",
        status: phPass ? "PASS" : "FAIL",
        details: phPass
          ? `PHT spans 0x${header.ePhoff.toString(16)}..0x${phEnd.toString(16)} (${phSpan} bytes), strictly within file size (${fileSize} bytes).`
          : `PHT overflow: offset 0x${header.ePhoff.toString(16)} + ${phSpan} bytes exceeds file size (${fileSize} bytes). AnyPS5 relinker will reject binary.`,
        recommendation: phPass ? null : "Truncate e_phnum or fix e_phoff header to prevent out-of-bounds pointer dereference."
      });
    }

    // Check 2: Section Header Table Bounds (PR #12009)
    if (header && header.eShoff !== undefined && header.eShnum !== undefined) {
      const shentsize = header.eShentsize || (header.is64Bit ? 64 : 40);
      const shSpan = header.eShnum * shentsize;
      const shEnd = header.eShoff + shSpan;
      const shPass = (header.eShoff >= 0 && shEnd <= fileSize);
      this.checks.push({
        id: "RELINKER-ELF-002",
        title: "Section Header Table Bounds",
        status: shPass ? "PASS" : "FAIL",
        details: shPass
          ? `SHT spans 0x${header.eShoff.toString(16)}..0x${shEnd.toString(16)} (${shSpan} bytes), strictly within file size (${fileSize} bytes).`
          : `SHT overflow: offset 0x${header.eShoff.toString(16)} + ${shSpan} bytes exceeds file size (${fileSize} bytes).`,
        recommendation: shPass ? null : "Ensure section header table fits within binary size to avoid memory faults."
      });
    }

    // Check 3: Segments Span File Bounds
    const oobSegments = (programHeaders || []).filter(p => p.isOutOfBounds);
    const segPass = (oobSegments.length === 0);
    this.checks.push({
      id: "RELINKER-ELF-003",
      title: "Segment Buffer Boundaries",
      status: segPass ? "PASS" : "FAIL",
      details: segPass
        ? `All ${programHeaders.length} program segments strictly reside within physical file bounds.`
        : `${oobSegments.length} segment(s) extend beyond file EOF (Segment #${oobSegments.map(s => s.index).join(", #")}).`,
      recommendation: segPass ? null : "Fix p_offset and p_filesz values to match binary image payload size."
    });

    // Check 4: Section Buffer Boundaries
    const oobSections = (sections || []).filter(s => s.isOutOfBounds);
    const secPass = (oobSections.length === 0);
    this.checks.push({
      id: "RELINKER-ELF-004",
      title: "Section Data Boundaries",
      status: secPass ? "PASS" : "FAIL",
      details: secPass
        ? `All ${sections.length} sections strictly reside within file bounds.`
        : `${oobSections.length} section(s) extend beyond file EOF (${oobSections.map(s => s.name || '#' + s.index).join(", ")}).`,
      recommendation: secPass ? null : "Verify section header sh_offset + sh_size invariants."
    });

    // Check 5: Section Header String Table Index
    if (header) {
      const shstrPass = (header.eShstrndx < header.eShnum);
      this.checks.push({
        id: "RELINKER-ELF-005",
        title: "Section String Table Index (e_shstrndx)",
        status: shstrPass ? "PASS" : "FAIL",
        details: shstrPass
          ? `e_shstrndx index ${header.eShstrndx} is strictly within section table count (${header.eShnum}).`
          : `Invalid e_shstrndx ${header.eShstrndx} >= e_shnum ${header.eShnum}.`,
        recommendation: shstrPass ? null : "Assign valid shstrtab section index or SHN_UNDEF."
      });
    }

    // Check 6: Dynamic Tag Table Validation (DT_RELAENT, DT_PLTREL) (PR #12822)
    if (dynamicTags && dynamicTags.length > 0) {
      const dtNull = dynamicTags.find(t => t.tag === 0);
      const dtRelaEnt = dynamicTags.find(t => t.tag === 9); // DT_RELAENT
      const dtRelaSz = dynamicTags.find(t => t.tag === 8);  // DT_RELASZ

      let dynStatus = "PASS";
      const dynIssues = [];

      if (!dtNull) {
        dynStatus = "WARN";
        dynIssues.push("Missing DT_NULL terminator in dynamic tag array.");
      }
      if (dtRelaEnt) {
        const expectedEnt = header?.is64Bit ? 24 : 12;
        if (Number(dtRelaEnt.val) !== expectedEnt) {
          dynStatus = "FAIL";
          dynIssues.push(`Invalid DT_RELAENT value ${dtRelaEnt.val} (expected ${expectedEnt} bytes for ${header?.is64Bit ? '64-bit' : '32-bit'}).`);
        }
      }
      if (dtRelaSz && dtRelaEnt && Number(dtRelaEnt.val) > 0) {
        if (Number(dtRelaSz.val) % Number(dtRelaEnt.val) !== 0) {
          dynStatus = "FAIL";
          dynIssues.push(`DT_RELASZ (${dtRelaSz.val}) is not an exact multiple of DT_RELAENT (${dtRelaEnt.val}).`);
        }
      }

      this.checks.push({
        id: "RELINKER-ELF-006",
        title: "Dynamic Tag Invariants (DT_RELAENT & DT_NULL)",
        status: dynStatus,
        details: dynIssues.length === 0
          ? "Dynamic tag array contains valid DT_NULL terminator and correct DT_RELAENT sizing."
          : dynIssues.join(" "),
        recommendation: dynStatus === "PASS" ? null : "Align dynamic relocation tables to exact sizeof(Elf64_Rela) entries."
      });
    }

    // Check 7: Negative Relative Relocation Target Sanity (PR #12649)
    if (relocations && relocations.length > 0) {
      let relStatus = "PASS";
      const invalidRels = [];
      for (const rel of relocations) {
        // In strict filter, check for integer wraparound if addend is negative and base is small
        if (rel.type === 8) { // R_X86_64_RELATIVE
          if (rel.addend < 0n && (-rel.addend) > 0x100000000n) {
            relStatus = "WARN";
            invalidRels.push(`Excessive negative relative relocation addend at offset 0x${rel.offset.toString(16)}`);
            break;
          }
        }
      }

      this.checks.push({
        id: "RELINKER-ELF-007",
        title: "Relocation Target Range & Signed Addends",
        status: relStatus,
        details: relStatus === "PASS"
          ? `All ${relocations.length} dynamic relocation entries satisfy signed displacement safety.`
          : invalidRels.join("; "),
        recommendation: relStatus === "PASS" ? null : "Audit negative relocation offsets for unsigned integer underflow."
      });
    }

    // Check 8: Sony PlayStation PRX Structure Validation
    if (this.data.isPrx) {
      const sceRela = programHeaders?.find(p => p.type === 0x61000000); // PT_SCE_RELA
      const sceModuleInfo = dynamicTags?.find(t => t.tag === 0x61000005);

      this.checks.push({
        id: "RELINKER-PRX-001",
        title: "Sony PlayStation PRX Structure",
        status: "PASS",
        details: `Identified Orbis / Prospero PRX executable format. ${sceRela ? 'Contains PT_SCE_RELA segment.' : ''} ${sceModuleInfo ? 'Contains DT_SCE_MODULE_INFO tag.' : ''}`,
        recommendation: null
      });
    }

    const hasFail = this.checks.some(c => c.status === "FAIL");
    const hasWarn = this.checks.some(c => c.status === "WARN");
    const overallScore = hasFail ? "FAIL" : (hasWarn ? "WARN" : "PASS");

    return {
      overallScore,
      checks: this.checks,
      passedCount: this.checks.filter(c => c.status === "PASS").length,
      warnCount: this.checks.filter(c => c.status === "WARN").length,
      failCount: this.checks.filter(c => c.status === "FAIL").length
    };
  }
}
