# ELF & PS5 PRX Inspector

[![Live Demo](https://img.shields.io/badge/demo-GitHub%20Pages-brightgreen?style=for-the-badge&logo=github)](https://slopgobblercobbler.github.io/elf-prx-inspector/)
[![Tests](https://img.shields.io/badge/tests-12%2F12%20passing-success?style=for-the-badge)](https://github.com/slopgobblercobbler/elf-prx-inspector/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

An interactive, production-grade, 100% client-side web application for inspecting and analyzing Executable and Linkable Format (ELF) and Sony PlayStation 4/5 (Orbis & Prospero) PRX binaries, visualizing segment virtual memory layouts, and running automated AnyPS5 relinker bounds audits.

Hosted live at: **[https://slopgobblercobbler.github.io/elf-prx-inspector/](https://slopgobblercobbler.github.io/elf-prx-inspector/)**

---

## Key Features

- **100% Client-Side Execution**: Runs entirely in modern web browsers. Zero backend server or remote binary uploads required.
- **Drag-and-Drop ELF & PRX Support**: Inspect standard ELF64, ELF32, or Sony PlayStation PRX executables (`ET_DYN` with OSABI `0x90`).
- **Interactive Segment Virtual Memory Map**: Color-coded memory bar visualizing virtual address space allocation across code (`RX`), data (`RW`), read-only (`R`), dynamic (`PT_DYNAMIC`), and Sony PlayStation segments (`PT_SCE_*`).
- **Program Header Table (PHT) Inspector**: `readelf -l` style inspection with virtual and physical memory addresses, file spans, memory spans, flags (`PF_R`, `PF_W`, `PF_X`), alignments, and mapped section names.
- **Section Header Table (SHT) Inspector**: `readelf -S` style layout with instant search, section type badges, memory flags (`SHF_ALLOC`, `SHF_WRITE`, `SHF_EXECINSTR`), file offsets, and alignment.
- **Dynamic Section & Sony SCE Tags**: Full breakdown of `.dynamic` tags (`DT_NEEDED`, `DT_SONAME`, `DT_STRTAB`, `DT_RELA`, `DT_RELASZ`, `DT_RELAENT`) with automatic string table resolution, plus PlayStation-specific dynamic tags (`DT_SCE_MODULE_INFO`, `DT_SCE_NEEDED_MODULE`, `DT_SCE_EXPORT_LIB`).
- **Dynamic Relocations Engine**: Decodes `.rela.dyn` and `.rela.plt` entries (`Elf64_Rela`) into relocation types (`R_X86_64_RELATIVE`, `R_X86_64_GLOB_DAT`, `R_X86_64_JUMP_SLOT`), target virtual offsets, symbol indices, and signed addends.
- **AnyPS5 Relinker Bounds Auditor**: Built-in verification engine implementing critical relinker invariants:
  - **Program Header Bounds** (PR #11993): Verifies `e_phoff + e_phnum * e_phentsize <= fileSize`.
  - **Section Header Bounds** (PR #12009): Verifies `e_shoff + e_shnum * e_shentsize <= fileSize`.
  - **Segment Buffer Bounds**: Ensures all segment file offsets and file spans reside strictly within the physical binary.
  - **Dynamic Relocation Entry Sizing** (PR #12822): Verifies `DT_RELAENT == 24` for 64-bit binaries and `DT_RELASZ % DT_RELAENT == 0`.
  - **Negative Relocation Target Sanity** (PR #12649): Flags integer wrap risks on negative relative targets in strict relinker mode.
  - **Section String Table Bounds**: Ensures `e_shstrndx < e_shnum`.
- **Interactive Hex Inspector**: Synchronized 16-byte hex dump with ASCII column.
- **Export Toolbar**:
  - Export Decoded Inspection as **JSON**
  - Export Sections as **CSV**
  - Export Relocations as **CSV**
  - Export complete **readelf-style ASCII Report**

---

## Built-In Sample Presets

| Sample | Name | Description |
|---|---|---|
| **Sample 2** | PlayStation 5 PRX (Sony ET_DYN) | Sony Orbis/Prospero dynamic library module with `PT_SCE_RELA`, `PT_SCE_PROGLIB`, and `DT_SCE_MODULE_INFO` |
| **Sample 1** | Linux x86-64 Executable (ET_EXEC) | Standard 64-bit dynamic executable with `PT_LOAD`, `PT_DYNAMIC`, `.text`, `.dynamic`, and `.dynstr` |
| **Sample 3** | Shared Object with Relocations (.so) | ELF64 dynamic library with `.rela.dyn` (`R_X86_64_RELATIVE`, `R_X86_64_GLOB_DAT`, `R_X86_64_JUMP_SLOT`) |
| **Sample 4** | Bounds Violation Vector (Negative Test) | Corrupted binary with out-of-bounds Program Header Table and invalid `DT_RELAENT` sizing to audit failure rejection |

---

## Architecture

```
elf-prx-inspector/
├── index.html                   # Semantic HTML5 single-page application
├── css/
│   └── style.css                # Dark-mode developer aesthetic styling
├── js/
│   ├── app.js                   # Application bootstrap and export controller
│   ├── binary_reader.js         # Bounds-checked binary reader (LE/BE, 32/64-bit)
│   ├── elf_constants.js         # Standard ELF and Sony SCE constants & mappings
│   ├── elf_inspector.js         # Core binary parser (headers, segments, sections, dynamic, relocs)
│   ├── relinker_auditor.js      # Relinker bounds checking engine (PR #11993, #12009, #12822, #12649)
│   ├── samples.js               # Synthetic ELF and PlayStation PRX sample generators
│   └── ui.js                    # Reactive DOM rendering, memory map bar, tables
├── test/
│   ├── binary_reader.test.js    # Binary reader unit tests
│   ├── elf_inspector.test.js    # ELF parsing and relocation tests
│   ├── extended_audits.test.js  # Relinker invariants and flag formatting tests
│   ├── prx_detection.test.js    # PlayStation 5 PRX and Sony segment tests
│   └── relinker_auditor.test.js # Positive and negative boundary audit tests
├── .github/
│   └── workflows/
│       └── deploy-pages.yml     # Automated test & GitHub Pages deployment workflow
├── package.json                 # Project manifest with npm test script
├── LICENSE                      # MIT License
└── README.md
```

---

## Local Development & Testing

```bash
# Clone the repository
git clone https://github.com/slopgobblercobbler/elf-prx-inspector.git
cd elf-prx-inspector

# Run unit tests (Node.js 20+ built-in test runner)
npm test
```

To run the web application locally, open `index.html` in any browser or start a local server:

```bash
python -m http.server 8000
```

---

## License

This project is licensed under the [MIT License](LICENSE).
