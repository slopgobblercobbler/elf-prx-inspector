// test/extended_audits.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { formatSegmentFlags, formatSectionFlags, getRelocationTypeName } from "../js/elf_constants.js";
import { RelinkerAuditor } from "../js/relinker_auditor.js";

test("elf_constants formats segment and section flags properly", () => {
  assert.equal(formatSegmentFlags(5), "R-E"); // PF_R | PF_X
  assert.equal(formatSegmentFlags(6), "RW-"); // PF_R | PF_W
  assert.equal(formatSegmentFlags(7), "RWE"); // PF_R | PF_W | PF_X
  assert.equal(formatSegmentFlags(0), "---");

  assert.equal(formatSectionFlags(0x06n), "AX"); // SHF_ALLOC | SHF_EXECINSTR
  assert.equal(formatSectionFlags(0x03n), "AW"); // SHF_WRITE | SHF_ALLOC
  assert.equal(formatSectionFlags(0n), "-");
});

test("elf_constants maps x86-64 relocation types", () => {
  assert.equal(getRelocationTypeName(8, 62), "R_X86_64_RELATIVE");
  assert.equal(getRelocationTypeName(6, 62), "R_X86_64_GLOB_DAT");
  assert.equal(getRelocationTypeName(7, 62), "R_X86_64_JUMP_SLOT");
  assert.equal(getRelocationTypeName(1, 62), "R_X86_64_64");
});

test("RelinkerAuditor catches invalid DT_RELAENT size", () => {
  const badData = {
    header: { is64Bit: true, fileSize: 1000, ePhnum: 0, eShoff: 0, eShnum: 0 },
    programHeaders: [],
    sections: [],
    dynamicTags: [
      { tag: 9, val: 16n }, // DT_RELAENT = 16 (expected 24 for 64-bit)
      { tag: 8, val: 32n }, // DT_RELASZ
      { tag: 0, val: 0n }   // DT_NULL
    ],
    relocations: []
  };

  const auditor = new RelinkerAuditor(badData);
  const report = auditor.audit();

  assert.equal(report.overallScore, "FAIL");
  const relaEntCheck = report.checks.find(c => c.id === "RELINKER-ELF-006");
  assert.ok(relaEntCheck);
  assert.equal(relaEntCheck.status, "FAIL");
  assert.match(relaEntCheck.details, /Invalid DT_RELAENT value/);
});

test("RelinkerAuditor warns on missing DT_NULL terminator in dynamic section", () => {
  const noNullData = {
    header: { is64Bit: true, fileSize: 1000, ePhnum: 0, eShoff: 0, eShnum: 0 },
    programHeaders: [],
    sections: [],
    dynamicTags: [
      { tag: 1, val: 1n } // DT_NEEDED without DT_NULL
    ],
    relocations: []
  };

  const auditor = new RelinkerAuditor(noNullData);
  const report = auditor.audit();

  assert.ok(report.checks.some(c => c.id === "RELINKER-ELF-006" && c.status === "WARN"));
});
