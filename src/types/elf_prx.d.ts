export interface Elf64Ehdr {
    e_ident: Uint8Array;
    e_type: number;
    e_machine: number;
    e_version: number;
    e_entry: bigint;
    e_phoff: bigint;
    e_shoff: bigint;
    e_flags: number;
    e_ehsize: number;
    e_phentsize: number;
    e_phnum: number;
    e_shentsize: number;
    e_shnum: number;
    e_shstrndx: number;
}

export interface Elf64Phdr {
    p_type: number;
    p_flags: number;
    p_offset: bigint;
    p_vaddr: bigint;
    p_paddr: bigint;
    p_filesz: bigint;
    p_memsz: bigint;
    p_align: bigint;
}
