// js/samples.js - Built-in synthetic ELF and PlayStation PRX binaries for testing and inspection

export const SAMPLES = {
  SAMPLE_1_LINUX_X86_64: {
    id: "sample_1",
    name: "Linux x86-64 Executable (ET_EXEC)",
    description: "Standard 64-bit Linux executable with PT_LOAD, PT_DYNAMIC, .text, .dynamic, and .rela.plt sections.",
    generate: createSample1LinuxExec
  },
  SAMPLE_2_PS5_PRX: {
    id: "sample_2",
    name: "PlayStation 5 / Orbis PRX (Sony ET_DYN)",
    description: "Sony Orbis/Prospero dynamic library module with PT_SCE_RELA, PT_SCE_PROGLIB, and DT_SCE_MODULE_INFO.",
    generate: createSample2Ps5Prx
  },
  SAMPLE_3_SHARED_OBJECT: {
    id: "sample_3",
    name: "Dynamic Shared Object with Relocations (.so)",
    description: "ELF64 shared library with .rela.dyn (R_X86_64_RELATIVE, R_X86_64_GLOB_DAT, R_X86_64_JUMP_SLOT).",
    generate: createSample3SharedObject
  },
  SAMPLE_4_CORRUPT_BOUNDS: {
    id: "sample_4",
    name: "Relinker Bounds Violation Vector (Negative Test)",
    description: "Corrupted binary with out-of-bounds Program Header Table and invalid DT_RELAENT sizing to verify auditor.",
    generate: createSample4CorruptBounds
  }
};

/**
 * Creates Sample 1: Standard Linux x86-64 Executable
 */
export function createSample1LinuxExec() {
  const totalSize = 0x380;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // 1. ELF Header (64 bytes at 0x00)
  buffer[0] = 0x7F; buffer[1] = 0x45; buffer[2] = 0x4C; buffer[3] = 0x46; // \x7fELF
  buffer[4] = 2; // ELFCLASS64
  buffer[5] = 1; // ELFDATA2LSB
  buffer[6] = 1; // EV_CURRENT
  buffer[7] = 3; // ELFOSABI_LINUX

  view.setUint16(0x10, 2, true);              // e_type = ET_EXEC
  view.setUint16(0x12, 62, true);             // e_machine = EM_X86_64
  view.setUint32(0x14, 1, true);              // e_version = 1
  view.setBigUint64(0x18, 0x401000n, true);   // e_entry = 0x401000
  view.setBigUint64(0x20, 0x40n, true);       // e_phoff = 0x40 (immediately following ELF header)
  view.setBigUint64(0x28, 0x240n, true);      // e_shoff = 0x240
  view.setUint32(0x30, 0, true);              // e_flags = 0
  view.setUint16(0x34, 64, true);             // e_ehsize = 64
  view.setUint16(0x36, 56, true);             // e_phentsize = 56
  view.setUint16(0x38, 3, true);              // e_phnum = 3 (PT_LOAD RX, PT_LOAD RW, PT_DYNAMIC)
  view.setUint16(0x3A, 64, true);             // e_shentsize = 64
  view.setUint16(0x3C, 5, true);              // e_shnum = 5
  view.setUint16(0x3E, 4, true);              // e_shstrndx = 4 (.shstrtab)

  // 2. Program Headers (3 entries * 56 bytes = 168 bytes, 0x40 .. 0xE8)
  // Segment 0: PT_LOAD RX (Executable code)
  const ph0 = 0x40;
  view.setUint32(ph0 + 0x00, 1, true);        // p_type = PT_LOAD
  view.setUint32(ph0 + 0x04, 5, true);        // p_flags = PF_R | PF_X
  view.setBigUint64(ph0 + 0x08, 0n, true);    // p_offset = 0
  view.setBigUint64(ph0 + 0x10, 0x400000n, true); // p_vaddr
  view.setBigUint64(ph0 + 0x18, 0x400000n, true); // p_paddr
  view.setBigUint64(ph0 + 0x20, 0x150n, true); // p_filesz = 336
  view.setBigUint64(ph0 + 0x28, 0x150n, true); // p_memsz = 336
  view.setBigUint64(ph0 + 0x30, 0x1000n, true); // p_align = 4KB

  // Segment 1: PT_LOAD RW (Data & Dynamic)
  const ph1 = ph0 + 56;
  view.setUint32(ph1 + 0x00, 1, true);        // p_type = PT_LOAD
  view.setUint32(ph1 + 0x04, 6, true);        // p_flags = PF_R | PF_W
  view.setBigUint64(ph1 + 0x08, 0x150n, true); // p_offset = 0x150
  view.setBigUint64(ph1 + 0x10, 0x402150n, true); // p_vaddr
  view.setBigUint64(ph1 + 0x18, 0x402150n, true); // p_paddr
  view.setBigUint64(ph1 + 0x20, 0xF0n, true);  // p_filesz = 240
  view.setBigUint64(ph1 + 0x28, 0xF0n, true);  // p_memsz = 240
  view.setBigUint64(ph1 + 0x30, 0x1000n, true);

  // Segment 2: PT_DYNAMIC
  const ph2 = ph1 + 56;
  view.setUint32(ph2 + 0x00, 2, true);        // p_type = PT_DYNAMIC
  view.setUint32(ph2 + 0x04, 6, true);        // p_flags = PF_R | PF_W
  view.setBigUint64(ph2 + 0x08, 0x150n, true); // p_offset = 0x150
  view.setBigUint64(ph2 + 0x10, 0x402150n, true); // p_vaddr
  view.setBigUint64(ph2 + 0x18, 0x402150n, true); // p_paddr
  view.setBigUint64(ph2 + 0x20, 0x60n, true);  // p_filesz = 96 (6 tags * 16 bytes)
  view.setBigUint64(ph2 + 0x28, 0x60n, true);
  view.setBigUint64(ph2 + 0x30, 8n, true);

  // 3. .text section at 0x100 (dummy instructions)
  const textOffset = 0x100;
  buffer[textOffset + 0] = 0x48; buffer[textOffset + 1] = 0x31; buffer[textOffset + 2] = 0xC0; // xor %rax, %rax
  buffer[textOffset + 3] = 0xC3; // ret

  // 4. .dynamic section at 0x150 (6 entries * 16 bytes = 96 bytes)
  const dynOffset = 0x150;
  // DT_NEEDED (libc.so.6, string offset 1)
  view.setBigInt64(dynOffset + 0x00, 1n, true);
  view.setBigUint64(dynOffset + 0x08, 1n, true);
  // DT_STRTAB (0x4021B0)
  view.setBigInt64(dynOffset + 0x10, 5n, true);
  view.setBigUint64(dynOffset + 0x18, 0x4021B0n, true);
  // DT_STRSZ (32 bytes)
  view.setBigInt64(dynOffset + 0x20, 10n, true);
  view.setBigUint64(dynOffset + 0x28, 32n, true);
  // DT_RELAENT (24 bytes)
  view.setBigInt64(dynOffset + 0x30, 9n, true);
  view.setBigUint64(dynOffset + 0x38, 24n, true);
  // DT_DEBUG
  view.setBigInt64(dynOffset + 0x40, 21n, true);
  view.setBigUint64(dynOffset + 0x48, 0n, true);
  // DT_NULL
  view.setBigInt64(dynOffset + 0x50, 0n, true);
  view.setBigUint64(dynOffset + 0x58, 0n, true);

  // 5. .dynstr section at 0x1B0 (32 bytes)
  const dynstrOffset = 0x1B0;
  const dynstr = "\0libc.so.6\0printf\0puts\0";
  buffer.set(new TextEncoder().encode(dynstr), dynstrOffset);

  // 6. .shstrtab section at 0x1E0 (64 bytes)
  const shstrOffset = 0x1E0;
  const shstr = "\0.text\0.dynamic\0.dynstr\0.shstrtab\0";
  buffer.set(new TextEncoder().encode(shstr), shstrOffset);

  const textNameOff = 1;
  const dynamicNameOff = 7;
  const dynstrNameOff = 16;
  const shstrNameOff = 24;

  // 7. Section Header Table at 0x240 (5 entries * 64 bytes = 320 bytes)
  const shTable = 0x240;

  // Section 0: SHT_NULL
  // (zeros)

  // Section 1: .text
  const s1 = shTable + 64;
  view.setUint32(s1 + 0x00, textNameOff, true);
  view.setUint32(s1 + 0x04, 1, true); // SHT_PROGBITS
  view.setBigUint64(s1 + 0x08, 0x06n, true); // SHF_ALLOC | SHF_EXECINSTR
  view.setBigUint64(s1 + 0x10, 0x401000n, true);
  view.setBigUint64(s1 + 0x18, BigInt(textOffset), true);
  view.setBigUint64(s1 + 0x20, 64n, true);
  view.setBigUint64(s1 + 0x30, 16n, true);

  // Section 2: .dynamic
  const s2 = shTable + 128;
  view.setUint32(s2 + 0x00, dynamicNameOff, true);
  view.setUint32(s2 + 0x04, 6, true); // SHT_DYNAMIC
  view.setBigUint64(s2 + 0x08, 0x03n, true); // SHF_WRITE | SHF_ALLOC
  view.setBigUint64(s2 + 0x10, 0x402150n, true);
  view.setBigUint64(s2 + 0x18, BigInt(dynOffset), true);
  view.setBigUint64(s2 + 0x20, 96n, true);
  view.setBigUint64(s2 + 0x30, 8n, true);
  view.setBigUint64(s2 + 0x38, 16n, true); // sh_entsize = 16

  // Section 3: .dynstr
  const s3 = shTable + 192;
  view.setUint32(s3 + 0x00, dynstrNameOff, true);
  view.setUint32(s3 + 0x04, 3, true); // SHT_STRTAB
  view.setBigUint64(s3 + 0x08, 0x02n, true); // SHF_ALLOC
  view.setBigUint64(s3 + 0x10, 0x4021B0n, true);
  view.setBigUint64(s3 + 0x18, BigInt(dynstrOffset), true);
  view.setBigUint64(s3 + 0x20, 32n, true);
  view.setBigUint64(s3 + 0x30, 1n, true);

  // Section 4: .shstrtab
  const s4 = shTable + 256;
  view.setUint32(s4 + 0x00, shstrNameOff, true);
  view.setUint32(s4 + 0x04, 3, true); // SHT_STRTAB
  view.setBigUint64(s4 + 0x08, 0n, true);
  view.setBigUint64(s4 + 0x10, 0n, true);
  view.setBigUint64(s4 + 0x18, BigInt(shstrOffset), true);
  view.setBigUint64(s4 + 0x20, 64n, true);
  view.setBigUint64(s4 + 0x30, 1n, true);

  return buffer;
}

/**
 * Creates Sample 2: PlayStation 5 / Orbis PRX (Sony ET_DYN)
 */
export function createSample2Ps5Prx() {
  const totalSize = 0x380;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // 1. ELF Header with Sony OSABI = 0x90
  buffer[0] = 0x7F; buffer[1] = 0x45; buffer[2] = 0x4C; buffer[3] = 0x46;
  buffer[4] = 2; // ELFCLASS64
  buffer[5] = 1; // ELFDATA2LSB
  buffer[6] = 1;
  buffer[7] = 0x90; // Sony PlayStation OSABI!

  view.setUint16(0x10, 3, true);              // e_type = ET_DYN (PRX)
  view.setUint16(0x12, 62, true);             // e_machine = EM_X86_64
  view.setUint32(0x14, 1, true);
  view.setBigUint64(0x18, 0n, true);          // e_entry = 0 (library)
  view.setBigUint64(0x20, 0x40n, true);       // e_phoff = 0x40
  view.setBigUint64(0x28, 0x260n, true);      // e_shoff = 0x260
  view.setUint16(0x34, 64, true);
  view.setUint16(0x36, 56, true);             // e_phentsize = 56
  view.setUint16(0x38, 4, true);              // e_phnum = 4 (PT_LOAD, PT_DYNAMIC, PT_SCE_RELA, PT_SCE_PROGLIB)
  view.setUint16(0x3A, 64, true);             // e_shentsize = 64
  view.setUint16(0x3C, 4, true);              // e_shnum = 4
  view.setUint16(0x3E, 3, true);              // e_shstrndx = 3

  // 2. Program Headers (4 entries)
  // Segment 0: PT_LOAD RX
  const ph0 = 0x40;
  view.setUint32(ph0 + 0x00, 1, true);        // PT_LOAD
  view.setUint32(ph0 + 0x04, 5, true);        // PF_R | PF_X
  view.setBigUint64(ph0 + 0x08, 0n, true);
  view.setBigUint64(ph0 + 0x10, 0x1000n, true);
  view.setBigUint64(ph0 + 0x20, 0x120n, true);
  view.setBigUint64(ph0 + 0x28, 0x120n, true);
  view.setBigUint64(ph0 + 0x30, 0x1000n, true);

  // Segment 1: PT_DYNAMIC
  const ph1 = ph0 + 56;
  view.setUint32(ph1 + 0x00, 2, true);        // PT_DYNAMIC
  view.setUint32(ph1 + 0x04, 6, true);
  view.setBigUint64(ph1 + 0x08, 0x120n, true);
  view.setBigUint64(ph1 + 0x10, 0x2120n, true);
  view.setBigUint64(ph1 + 0x20, 0x80n, true);
  view.setBigUint64(ph1 + 0x28, 0x80n, true);

  // Segment 2: PT_SCE_RELA (0x61000000)
  const ph2 = ph1 + 56;
  view.setUint32(ph2 + 0x00, 0x61000000, true); // PT_SCE_RELA
  view.setUint32(ph2 + 0x04, 4, true);          // PF_R
  view.setBigUint64(ph2 + 0x08, 0x1A0n, true);
  view.setBigUint64(ph2 + 0x10, 0x21A0n, true);
  view.setBigUint64(ph2 + 0x20, 0x40n, true);
  view.setBigUint64(ph2 + 0x28, 0x40n, true);

  // Segment 3: PT_SCE_PROGLIB (0x61000002)
  const ph3 = ph2 + 56;
  view.setUint32(ph3 + 0x00, 0x61000002, true); // PT_SCE_PROGLIB
  view.setUint32(ph3 + 0x04, 4, true);
  view.setBigUint64(ph3 + 0x08, 0x1E0n, true);
  view.setBigUint64(ph3 + 0x10, 0x21E0n, true);
  view.setBigUint64(ph3 + 0x20, 0x20n, true);
  view.setBigUint64(ph3 + 0x28, 0x20n, true);

  // 3. Dynamic Section at 0x120 with Sony SCE Tags:
  const dynOffset = 0x120;
  // DT_SCE_MODULE_INFO (0x61000005)
  view.setBigInt64(dynOffset + 0x00, 0x61000005n, true);
  view.setBigUint64(dynOffset + 0x08, 0x21A0n, true);
  // DT_SCE_NEEDED_MODULE (0x61000007)
  view.setBigInt64(dynOffset + 0x10, 0x61000007n, true);
  view.setBigUint64(dynOffset + 0x18, 0x1n, true);
  // DT_SCE_EXPORT_LIB (0x6100000B)
  view.setBigInt64(dynOffset + 0x20, 0x6100000Bn, true);
  view.setBigUint64(dynOffset + 0x28, 0x21E0n, true);
  // DT_RELAENT (24 bytes)
  view.setBigInt64(dynOffset + 0x30, 9n, true);
  view.setBigUint64(dynOffset + 0x38, 24n, true);
  // DT_NULL
  view.setBigInt64(dynOffset + 0x40, 0n, true);
  view.setBigUint64(dynOffset + 0x48, 0n, true);

  // 4. .shstrtab at 0x200
  const shstrOffset = 0x200;
  const shstr = "\0.text\0.sce_proglib\0.dynamic\0.shstrtab\0";
  buffer.set(new TextEncoder().encode(shstr), shstrOffset);

  // 5. Section Header Table at 0x260 (4 entries)
  const shTable = 0x260;
  // Sec 1: .text
  const s1 = shTable + 64;
  view.setUint32(s1 + 0x00, 1, true);
  view.setUint32(s1 + 0x04, 1, true); // SHT_PROGBITS
  view.setBigUint64(s1 + 0x08, 6n, true);
  view.setBigUint64(s1 + 0x10, 0x1000n, true);
  view.setBigUint64(s1 + 0x18, 0x100n, true);
  view.setBigUint64(s1 + 0x20, 32n, true);

  // Sec 2: .dynamic
  const s2 = shTable + 128;
  view.setUint32(s2 + 0x00, 20, true);
  view.setUint32(s2 + 0x04, 6, true);
  view.setBigUint64(s2 + 0x08, 3n, true);
  view.setBigUint64(s2 + 0x10, 0x2120n, true);
  view.setBigUint64(s2 + 0x18, BigInt(dynOffset), true);
  view.setBigUint64(s2 + 0x20, 80n, true);

  // Sec 3: .shstrtab
  const s3 = shTable + 192;
  view.setUint32(s3 + 0x00, 29, true);
  view.setUint32(s3 + 0x04, 3, true);
  view.setBigUint64(s3 + 0x18, BigInt(shstrOffset), true);
  view.setBigUint64(s3 + 0x20, 48n, true);

  return buffer;
}

/**
 * Creates Sample 3: Dynamic Shared Object with Relocations (.so)
 */
export function createSample3SharedObject() {
  const totalSize = 0x380;
  const buffer = new Uint8Array(totalSize);
  const view = new DataView(buffer.buffer);

  // ELF Header (ET_DYN)
  buffer[0] = 0x7F; buffer[1] = 0x45; buffer[2] = 0x4C; buffer[3] = 0x46;
  buffer[4] = 2; buffer[5] = 1; buffer[6] = 1; buffer[7] = 0;
  view.setUint16(0x10, 3, true); // ET_DYN
  view.setUint16(0x12, 62, true); // AMD x86-64
  view.setUint32(0x14, 1, true);
  view.setBigUint64(0x20, 0x40n, true); // e_phoff = 0x40
  view.setBigUint64(0x28, 0x220n, true); // e_shoff = 0x220
  view.setUint16(0x34, 64, true);
  view.setUint16(0x36, 56, true);
  view.setUint16(0x38, 2, true);
  view.setUint16(0x3A, 64, true);
  view.setUint16(0x3C, 4, true);
  view.setUint16(0x3E, 3, true);

  // Program Headers
  const ph0 = 0x40;
  view.setUint32(ph0, 1, true); view.setUint32(ph0 + 4, 5, true);
  view.setBigUint64(ph0 + 0x20, 0x100n, true); view.setBigUint64(ph0 + 0x28, 0x100n, true);

  const ph1 = ph0 + 56;
  view.setUint32(ph1, 2, true); view.setUint32(ph1 + 4, 6, true);
  view.setBigUint64(ph1 + 0x08, 0x160n, true);
  view.setBigUint64(ph1 + 0x20, 0x40n, true); view.setBigUint64(ph1 + 0x28, 0x40n, true);

  // Relocations at 0x100 (.rela.dyn: 3 entries * 24 bytes = 72 bytes)
  const relaOffset = 0x100;
  // Rel 1: R_X86_64_RELATIVE (type 8, sym 0, offset 0x2000, addend +0x400)
  view.setBigUint64(relaOffset + 0x00, 0x2000n, true);
  view.setBigUint64(relaOffset + 0x08, 8n, true); // r_info = (0 << 32) | 8
  view.setBigInt64(relaOffset + 0x10, 0x400n, true);

  // Rel 2: R_X86_64_GLOB_DAT (type 6, sym 1, offset 0x2008, addend 0)
  view.setBigUint64(relaOffset + 0x18, 0x2008n, true);
  view.setBigUint64(relaOffset + 0x20, (1n << 32n) | 6n, true);
  view.setBigInt64(relaOffset + 0x28, 0n, true);

  // Rel 3: R_X86_64_JUMP_SLOT (type 7, sym 2, offset 0x2010, addend 0)
  view.setBigUint64(relaOffset + 0x30, 0x2010n, true);
  view.setBigUint64(relaOffset + 0x38, (2n << 32n) | 7n, true);
  view.setBigInt64(relaOffset + 0x40, 0n, true);

  // .dynamic at 0x160 (DT_RELA, DT_RELASZ 72, DT_RELAENT 24, DT_NULL)
  const dynOffset = 0x160;
  view.setBigInt64(dynOffset + 0x00, 7n, true); // DT_RELA
  view.setBigUint64(dynOffset + 0x08, 0x2100n, true);
  view.setBigInt64(dynOffset + 0x10, 8n, true); // DT_RELASZ
  view.setBigUint64(dynOffset + 0x18, 72n, true);
  view.setBigInt64(dynOffset + 0x20, 9n, true); // DT_RELAENT
  view.setBigUint64(dynOffset + 0x28, 24n, true);
  view.setBigInt64(dynOffset + 0x30, 0n, true); // DT_NULL
  view.setBigUint64(dynOffset + 0x38, 0n, true);

  // .shstrtab at 0x1C0
  const shstrOffset = 0x1C0;
  const shstr = "\0.rela.dyn\0.dynamic\0.shstrtab\0";
  buffer.set(new TextEncoder().encode(shstr), shstrOffset);

  // Section Headers at 0x220 (4 entries)
  const shTable = 0x220;
  // Sec 1: .rela.dyn
  const s1 = shTable + 64;
  view.setUint32(s1, 1, true);
  view.setUint32(s1 + 4, 4, true); // SHT_RELA
  view.setBigUint64(s1 + 0x08, 2n, true);
  view.setBigUint64(s1 + 0x18, BigInt(relaOffset), true);
  view.setBigUint64(s1 + 0x20, 72n, true);
  view.setBigUint64(s1 + 0x38, 24n, true);

  // Sec 2: .dynamic
  const s2 = shTable + 128;
  view.setUint32(s2, 11, true);
  view.setUint32(s2 + 4, 6, true);
  view.setBigUint64(s2 + 0x18, BigInt(dynOffset), true);
  view.setBigUint64(s2 + 0x20, 64n, true);

  // Sec 3: .shstrtab
  const s3 = shTable + 192;
  view.setUint32(s3, 20, true);
  view.setUint32(s3 + 4, 3, true);
  view.setBigUint64(s3 + 0x18, BigInt(shstrOffset), true);
  view.setBigUint64(s3 + 0x20, 32n, true);

  return buffer;
}

/**
 * Creates Sample 4: Boundary Violation Vector (Negative Test)
 * Tests RelinkerAuditor with deliberate out-of-bounds PHT and invalid DT_RELAENT
 */
export function createSample4CorruptBounds() {
  const buffer = new Uint8Array(128);
  const view = new DataView(buffer.buffer);

  buffer[0] = 0x7F; buffer[1] = 0x45; buffer[2] = 0x4C; buffer[3] = 0x46;
  buffer[4] = 2; buffer[5] = 1; buffer[6] = 1; buffer[7] = 0;

  view.setUint16(0x10, 2, true); // ET_EXEC
  view.setUint16(0x12, 62, true);
  view.setUint32(0x14, 1, true);
  // Deliberate corruption: PHT claims to start at 0x60 with 5 entries of 56 bytes (0x60 + 280 = 376 > 128)
  view.setBigUint64(0x20, 0x60n, true); // e_phoff = 0x60
  view.setBigUint64(0x28, 0x200n, true); // e_shoff = 0x200 (out of bounds)
  view.setUint16(0x34, 64, true);
  view.setUint16(0x36, 56, true);
  view.setUint16(0x38, 5, true);         // 5 entries
  view.setUint16(0x3A, 64, true);
  view.setUint16(0x3C, 3, true);
  view.setUint16(0x3E, 10, true);        // invalid e_shstrndx (10 >= 3)

  return buffer;
}
