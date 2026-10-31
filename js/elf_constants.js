// js/elf_constants.js - ELF and Sony PlayStation SCE constants and mappings

export const ELF_MAGIC = [0x7F, 0x45, 0x4C, 0x46]; // \x7fELF

export const ELF_CLASSES = {
  1: "32-bit (ELF32)",
  2: "64-bit (ELF64)"
};

export const ELF_DATA_ENDIAN = {
  1: "Little-Endian (ELFDATA2LSB)",
  2: "Big-Endian (ELFDATA2MSB)"
};

export const ELF_OSABI = {
  0: "System V (UNIX - System V)",
  1: "HP-UX",
  2: "NetBSD",
  3: "Linux",
  6: "Solaris",
  7: "AIX",
  8: "IRIX",
  9: "FreeBSD",
  12: "OpenBSD",
  0x90: "PlayStation 4 / 5 (Sony Orbis/Prospero)"
};

export const ELF_TYPES = {
  0: "ET_NONE (No file type)",
  1: "ET_REL (Relocatable object file)",
  2: "ET_EXEC (Executable file)",
  3: "ET_DYN (Shared object / Sony PRX)",
  4: "ET_CORE (Core dump)",
  0xFE00: "ET_SCE_EXEC (Sony Executable)",
  0xFE10: "ET_SCE_RELEXEC (Sony Relocatable Executable)",
  0xFE18: "ET_SCE_STUBLIB (Sony Stub Library)",
  0xFE0C: "ET_SCE_DYNAMIC (Sony Dynamic Library / PRX)"
};

export const ELF_MACHINES = {
  3: "Intel 80386 (i386)",
  40: "ARM (32-bit)",
  62: "AMD x86-64",
  183: "AArch64 (ARM 64-bit)",
  243: "RISC-V"
};

export const SEGMENT_TYPES = {
  0: "PT_NULL",
  1: "PT_LOAD",
  2: "PT_DYNAMIC",
  3: "PT_INTERP",
  4: "PT_NOTE",
  5: "PT_SHLIB",
  6: "PT_PHDR",
  7: "PT_TLS",
  0x6474e550: "PT_GNU_EH_FRAME",
  0x6474e551: "PT_GNU_STACK",
  0x6474e552: "PT_GNU_RELRO",
  0x61000000: "PT_SCE_RELA (Sony Relocations)",
  0x61000001: "PT_SCE_DYNLIBDATA (Sony Dynamic Library Data)",
  0x61000002: "PT_SCE_PROGLIB (Sony Program Library)",
  0x61000005: "PT_SCE_VERSION (Sony SDK Version)",
  0x6FFFFF00: "PT_SCE_COMMENT (Sony Compiler Comment)",
  0x6FFFFF01: "PT_SCE_LIBVERSION (Sony Library Version)"
};

export const SEGMENT_FLAGS = {
  1: "PF_X (Execute)",
  2: "PF_W (Write)",
  4: "PF_R (Read)"
};

export function formatSegmentFlags(flags) {
  const parts = [];
  parts.push((flags & 4) ? "R" : "-");
  parts.push((flags & 2) ? "W" : "-");
  parts.push((flags & 1) ? "E" : "-");
  return parts.join("");
}

export const SECTION_TYPES = {
  0: "SHT_NULL",
  1: "SHT_PROGBITS",
  2: "SHT_SYMTAB",
  3: "SHT_STRTAB",
  4: "SHT_RELA",
  5: "SHT_HASH",
  6: "SHT_DYNAMIC",
  7: "SHT_NOTE",
  8: "SHT_NOBITS",
  9: "SHT_REL",
  10: "SHT_SHLIB",
  11: "SHT_DYNSYM",
  14: "SHT_INIT_ARRAY",
  15: "SHT_FINI_ARRAY",
  16: "SHT_PREINIT_ARRAY",
  0x6ffffff6: "SHT_GNU_HASH",
  0x6ffffffd: "SHT_GNU_verdef",
  0x6ffffffe: "SHT_GNU_verneed",
  0x6fffffff: "SHT_GNU_versym",
  0x70000001: "SHT_X86_64_UNWIND"
};

export const SECTION_FLAGS = {
  0x1: "SHF_WRITE",
  0x2: "SHF_ALLOC",
  0x4: "SHF_EXECINSTR",
  0x10: "SHF_MERGE",
  0x20: "SHF_STRINGS",
  0x40: "SHF_INFO_LINK",
  0x80: "SHF_LINK_ORDER",
  0x100: "SHF_OS_NONCONFORMING",
  0x200: "SHF_GROUP",
  0x400: "SHF_TLS"
};

export function formatSectionFlags(flags) {
  const flagsNum = Number(flags);
  const parts = [];
  if (flagsNum & 0x2) parts.push("A"); // ALLOC
  if (flagsNum & 0x1) parts.push("W"); // WRITE
  if (flagsNum & 0x4) parts.push("X"); // EXEC
  if (flagsNum & 0x10) parts.push("M"); // MERGE
  if (flagsNum & 0x20) parts.push("S"); // STRINGS
  if (flagsNum & 0x400) parts.push("T"); // TLS
  return parts.length > 0 ? parts.join("") : "-";
}

export const DYNAMIC_TAGS = {
  0: "DT_NULL",
  1: "DT_NEEDED",
  2: "DT_PLTRELSZ",
  3: "DT_PLTGOT",
  4: "DT_HASH",
  5: "DT_STRTAB",
  6: "DT_SYMTAB",
  7: "DT_RELA",
  8: "DT_RELASZ",
  9: "DT_RELAENT",
  10: "DT_STRSZ",
  11: "DT_SYMENT",
  12: "DT_INIT",
  13: "DT_FINI",
  14: "DT_SONAME",
  15: "DT_RPATH",
  16: "DT_SYMBOLIC",
  17: "DT_REL",
  18: "DT_RELSZ",
  19: "DT_RELENT",
  20: "DT_PLTREL",
  21: "DT_DEBUG",
  22: "DT_TEXTREL",
  23: "DT_JMPREL",
  24: "DT_BIND_NOW",
  25: "DT_INIT_ARRAY",
  26: "DT_FINI_ARRAY",
  27: "DT_INIT_ARRAYSZ",
  28: "DT_FINI_ARRAYSZ",
  29: "DT_RUNPATH",
  30: "DT_FLAGS",
  0x6ffffef5: "DT_GNU_HASH",
  0x6ffffffb: "DT_FLAGS_1",
  0x6ffffff9: "DT_RELACOUNT",
  0x6ffffff0: "DT_VERSYM",
  0x6ffffffc: "DT_VERDEF",
  0x6ffffffd: "DT_VERDEFNUM",
  0x6ffffffe: "DT_VERNEED",
  0x6fffffff: "DT_VERNEEDNUM",

  // Sony SCE Extensions
  0x61000001: "DT_SCE_FINGERPRINT",
  0x61000003: "DT_SCE_ORIGINAL_FILENAME",
  0x61000005: "DT_SCE_MODULE_INFO",
  0x61000007: "DT_SCE_NEEDED_MODULE",
  0x61000009: "DT_SCE_MODULE_ATTR",
  0x6100000B: "DT_SCE_EXPORT_LIB",
  0x6100000D: "DT_SCE_IMPORT_LIB",
  0x6100000F: "DT_SCE_EXPORT_LIB_ATTR",
  0x61000011: "DT_SCE_IMPORT_LIB_ATTR",
  0x61000013: "DT_SCE_STUB_MODULE_NAME",
  0x61000015: "DT_SCE_STUB_MODULE_VERSION",
  0x61000017: "DT_SCE_STUB_LIBRARY_NAME",
  0x61000019: "DT_SCE_STUB_LIBRARY_VERSION",
  0x6100001B: "DT_SCE_HASH",
  0x6100001D: "DT_SCE_PLTGOT",
  0x6100001F: "DT_SCE_JMPREL",
  0x61000021: "DT_SCE_PLTREL",
  0x61000023: "DT_SCE_PLTRELSZ",
  0x61000025: "DT_SCE_RELA",
  0x61000027: "DT_SCE_RELASZ",
  0x61000029: "DT_SCE_RELAENT",
  0x6100002B: "DT_SCE_STRTAB",
  0x6100002D: "DT_SCE_STRSZ",
  0x6100002F: "DT_SCE_SYMTAB",
  0x61000031: "DT_SCE_SYMENT",
  0x61000033: "DT_SCE_HASHSZ",
  0x61000035: "DT_SCE_SYMTABSZ"
};

export const X86_64_RELOCATIONS = {
  0: "R_X86_64_NONE",
  1: "R_X86_64_64",
  2: "R_X86_64_PC32",
  3: "R_X86_64_GOT32",
  4: "R_X86_64_PLT32",
  5: "R_X86_64_COPY",
  6: "R_X86_64_GLOB_DAT",
  7: "R_X86_64_JUMP_SLOT",
  8: "R_X86_64_RELATIVE",
  9: "R_X86_64_GOTPCREL",
  10: "R_X86_64_32",
  11: "R_X86_64_32S",
  12: "R_X86_64_16",
  13: "R_X86_64_PC16",
  14: "R_X86_64_8",
  15: "R_X86_64_PC8",
  24: "R_X86_64_PC64",
  41: "R_X86_64_GOTPCRELX",
  42: "R_X86_64_REX_GOTPCRELX"
};

export function getRelocationTypeName(type, machine = 62) {
  if (machine === 62) {
    return X86_64_RELOCATIONS[type] || `0x${type.toString(16)}`;
  }
  return `0x${type.toString(16)}`;
}
