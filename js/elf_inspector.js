// js/elf_inspector.js - Interactive ELF & PlayStation PRX binary inspector and structure extractor

import { BinaryReader } from "./binary_reader.js";
import {
  ELF_MAGIC,
  ELF_CLASSES,
  ELF_DATA_ENDIAN,
  ELF_OSABI,
  ELF_TYPES,
  ELF_MACHINES,
  SEGMENT_TYPES,
  formatSegmentFlags,
  SECTION_TYPES,
  formatSectionFlags,
  DYNAMIC_TAGS,
  getRelocationTypeName
} from "./elf_constants.js";

export class ElfInspector {
  /**
   * @param {Uint8Array|ArrayBuffer} buffer
   */
  constructor(buffer) {
    this.buffer = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    this.reader = new BinaryReader(this.buffer);

    this.isElf = false;
    this.isPrx = false;
    this.header = null;
    this.programHeaders = [];
    this.sections = [];
    this.dynamicTags = [];
    this.relocations = [];
    this.symbols = [];
    this.shstrtab = null;
    this.dynstr = null;
    this.strtab = null;

    this.warnings = [];
    this.errors = [];
  }

  static isElf(buffer) {
    if (!buffer || buffer.byteLength < 4) return false;
    const view = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
    return view[0] === ELF_MAGIC[0] &&
           view[1] === ELF_MAGIC[1] &&
           view[2] === ELF_MAGIC[2] &&
           view[3] === ELF_MAGIC[3];
  }

  inspect() {
    if (!ElfInspector.isElf(this.buffer)) {
      throw new Error("Invalid binary: Missing standard ELF magic header (0x7F 'ELF')");
    }
    this.isElf = true;

    this.parseHeader();
    this.parseProgramHeaders();
    this.parseSectionHeaders();
    this.parseDynamicSection();
    this.parseRelocations();
    this.parseSymbols();
    this.detectPrxMetadata();

    return {
      isElf: this.isElf,
      isPrx: this.isPrx,
      header: this.header,
      programHeaders: this.programHeaders,
      sections: this.sections,
      dynamicTags: this.dynamicTags,
      relocations: this.relocations,
      symbols: this.symbols,
      warnings: this.warnings,
      errors: this.errors
    };
  }

  parseHeader() {
    this.reader.seek(0);
    this.reader.skip(4); // Skip magic

    const eiClass = this.reader.readUint8();
    const eiData = this.reader.readUint8();
    const eiVersion = this.reader.readUint8();
    const eiOsAbi = this.reader.readUint8();
    const eiAbiVersion = this.reader.readUint8();
    this.reader.skip(7); // Padding

    const is64Bit = (eiClass === 2);
    const isLittleEndian = (eiData === 1);
    this.reader.littleEndian = isLittleEndian;

    const eType = this.reader.readUint16();
    const eMachine = this.reader.readUint16();
    const eVersion = this.reader.readUint32();

    const eEntry = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
    const ePhoff = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
    const eShoff = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());

    const eFlags = this.reader.readUint32();
    const eEhsize = this.reader.readUint16();
    const ePhentsize = this.reader.readUint16();
    const ePhnum = this.reader.readUint16();
    const eShentsize = this.reader.readUint16();
    const eShnum = this.reader.readUint16();
    const eShstrndx = this.reader.readUint16();

    this.header = {
      is64Bit,
      isLittleEndian,
      eiClass,
      eiClassName: ELF_CLASSES[eiClass] || `Unknown (${eiClass})`,
      eiData,
      eiDataName: ELF_DATA_ENDIAN[eiData] || `Unknown (${eiData})`,
      eiVersion,
      eiOsAbi,
      eiOsAbiName: ELF_OSABI[eiOsAbi] || `Unknown (0x${eiOsAbi.toString(16)})`,
      eiAbiVersion,
      eType,
      eTypeName: ELF_TYPES[eType] || `0x${eType.toString(16)}`,
      eMachine,
      eMachineName: ELF_MACHINES[eMachine] || `Unknown (${eMachine})`,
      eVersion,
      eEntry,
      formattedEntry: `0x${eEntry.toString(16)}`,
      ePhoff: Number(ePhoff),
      eShoff: Number(eShoff),
      eFlags,
      eEhsize,
      ePhentsize,
      ePhnum,
      eShentsize,
      eShnum,
      eShstrndx,
      fileSize: this.buffer.byteLength
    };
  }

  parseProgramHeaders() {
    const { ePhoff, ePhentsize, ePhnum, is64Bit, fileSize } = this.header;
    if (ePhoff === 0 || ePhnum === 0) return;

    const tableBytes = ePhnum * ePhentsize;
    if (ePhoff + tableBytes > fileSize) {
      this.errors.push(`Program header table (offset 0x${ePhoff.toString(16)}, size ${tableBytes}) exceeds binary bounds (${fileSize})`);
      return;
    }

    for (let i = 0; i < ePhnum; i++) {
      const entryOffset = ePhoff + (i * ePhentsize);
      this.reader.seek(entryOffset);

      const pType = this.reader.readUint32();
      let pFlags = 0;
      let pOffset = 0n;
      let pVaddr = 0n;
      let pPaddr = 0n;
      let pFilesz = 0n;
      let pMemsz = 0n;
      let pAlign = 0n;

      if (is64Bit) {
        pFlags = this.reader.readUint32();
        pOffset = this.reader.readUint64();
        pVaddr = this.reader.readUint64();
        pPaddr = this.reader.readUint64();
        pFilesz = this.reader.readUint64();
        pMemsz = this.reader.readUint64();
        pAlign = this.reader.readUint64();
      } else {
        pOffset = BigInt(this.reader.readUint32());
        pVaddr = BigInt(this.reader.readUint32());
        pPaddr = BigInt(this.reader.readUint32());
        pFilesz = BigInt(this.reader.readUint32());
        pMemsz = BigInt(this.reader.readUint32());
        pFlags = this.reader.readUint32();
        pAlign = BigInt(this.reader.readUint32());
      }

      const pOffsetNum = Number(pOffset);
      const pFileszNum = Number(pFilesz);

      this.programHeaders.push({
        index: i,
        type: pType,
        typeName: SEGMENT_TYPES[pType] || `0x${pType.toString(16)}`,
        flags: pFlags,
        formattedFlags: formatSegmentFlags(pFlags),
        offset: pOffsetNum,
        vaddr: pVaddr,
        formattedVaddr: `0x${pVaddr.toString(16)}`,
        paddr: pPaddr,
        filesz: pFileszNum,
        memsz: Number(pMemsz),
        align: Number(pAlign),
        isOutOfBounds: (pOffsetNum + pFileszNum > fileSize),
        mappedSections: []
      });
    }
  }

  parseSectionHeaders() {
    const { eShoff, eShentsize, eShnum, eShstrndx, is64Bit, fileSize } = this.header;
    if (eShoff === 0 || eShnum === 0) return;

    const tableBytes = eShnum * eShentsize;
    if (eShoff + tableBytes > fileSize) {
      this.errors.push(`Section header table (offset 0x${eShoff.toString(16)}, size ${tableBytes}) exceeds binary bounds (${fileSize})`);
      return;
    }

    const rawSections = [];
    for (let i = 0; i < eShnum; i++) {
      const entryOffset = eShoff + (i * eShentsize);
      this.reader.seek(entryOffset);

      const shNameOffset = this.reader.readUint32();
      const shType = this.reader.readUint32();
      const shFlags = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
      const shAddr = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
      const shOffset = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
      const shSize = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
      const shLink = this.reader.readUint32();
      const shInfo = this.reader.readUint32();
      const shAddralign = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());
      const shEntsize = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());

      const offsetNum = Number(shOffset);
      const sizeNum = Number(shSize);
      const isNobits = (shType === 8); // SHT_NOBITS (bss)

      rawSections.push({
        index: i,
        nameOffset: shNameOffset,
        name: "",
        type: shType,
        typeName: SECTION_TYPES[shType] || `0x${shType.toString(16)}`,
        flags: shFlags,
        formattedFlags: formatSectionFlags(shFlags),
        addr: shAddr,
        formattedAddr: `0x${shAddr.toString(16)}`,
        offset: offsetNum,
        size: sizeNum,
        link: shLink,
        info: shInfo,
        addralign: Number(shAddralign),
        entsize: Number(shEntsize),
        isOutOfBounds: !isNobits && (offsetNum + sizeNum > fileSize)
      });
    }

    // Resolve section names via shstrtab
    if (eShstrndx < rawSections.length) {
      const strtabSec = rawSections[eShstrndx];
      if (strtabSec.offset + strtabSec.size <= fileSize) {
        this.shstrtab = this.buffer.subarray(strtabSec.offset, strtabSec.offset + strtabSec.size);
        for (const sec of rawSections) {
          if (sec.nameOffset < this.shstrtab.byteLength) {
            let end = sec.nameOffset;
            while (end < this.shstrtab.byteLength && this.shstrtab[end] !== 0) {
              end++;
            }
            sec.name = new TextDecoder().decode(this.shstrtab.subarray(sec.nameOffset, end));
          }
        }
      }
    }

    // Map sections into program segments
    for (const ph of this.programHeaders) {
      if (ph.type === 1) { // PT_LOAD
        const segStart = ph.vaddr;
        const segEnd = ph.vaddr + BigInt(ph.memsz);
        for (const sec of rawSections) {
          if (sec.addr >= segStart && sec.addr < segEnd && sec.size > 0) {
            ph.mappedSections.push(sec.name || `#${sec.index}`);
          }
        }
      }
    }

    this.sections = rawSections;

    // Cache string tables
    const dynstrSec = this.findSection(".dynstr");
    if (dynstrSec && dynstrSec.offset + dynstrSec.size <= fileSize) {
      this.dynstr = this.buffer.subarray(dynstrSec.offset, dynstrSec.offset + dynstrSec.size);
    }
    const strtabSec = this.findSection(".strtab");
    if (strtabSec && strtabSec.offset + strtabSec.size <= fileSize) {
      this.strtab = this.buffer.subarray(strtabSec.offset, strtabSec.offset + strtabSec.size);
    }
  }

  parseDynamicSection() {
    // Locate .dynamic section or PT_DYNAMIC segment
    let dynamicOffset = 0;
    let dynamicSize = 0;

    const dynSec = this.findSection(".dynamic");
    if (dynSec) {
      dynamicOffset = dynSec.offset;
      dynamicSize = dynSec.size;
    } else {
      const dynPh = this.programHeaders.find(p => p.type === 2); // PT_DYNAMIC
      if (dynPh) {
        dynamicOffset = dynPh.offset;
        dynamicSize = dynPh.filesz;
      }
    }

    if (dynamicOffset === 0 || dynamicSize === 0) return;
    if (dynamicOffset + dynamicSize > this.buffer.byteLength) {
      this.warnings.push("Dynamic section extends beyond binary boundary");
      return;
    }

    const is64Bit = this.header.is64Bit;
    const entrySize = is64Bit ? 16 : 8;
    const count = Math.floor(dynamicSize / entrySize);

    this.reader.seek(dynamicOffset);
    for (let i = 0; i < count; i++) {
      const tag = is64Bit ? this.reader.readInt64() : BigInt(this.reader.readInt32());
      const val = is64Bit ? this.reader.readUint64() : BigInt(this.reader.readUint32());

      const tagNum = Number(tag);
      let stringVal = null;

      // Resolve strings from dynstr if tag is string offset
      if (this.dynstr && (tagNum === 1 || tagNum === 14 || tagNum === 15 || tagNum === 29 || tagNum === 0x61000003)) {
        const strOffset = Number(val);
        if (strOffset < this.dynstr.byteLength) {
          let end = strOffset;
          while (end < this.dynstr.byteLength && this.dynstr[end] !== 0) end++;
          stringVal = new TextDecoder().decode(this.dynstr.subarray(strOffset, end));
        }
      }

      this.dynamicTags.push({
        index: i,
        tag: tagNum,
        tagName: DYNAMIC_TAGS[tagNum] || `0x${tagNum.toString(16)}`,
        val,
        formattedVal: `0x${val.toString(16)}`,
        stringVal
      });

      if (tagNum === 0) break; // DT_NULL terminator
    }
  }

  parseRelocations() {
    const relaSections = this.sections.filter(s => s.type === 4); // SHT_RELA
    const is64Bit = this.header.is64Bit;

    for (const sec of relaSections) {
      if (sec.isOutOfBounds || sec.size === 0) continue;
      const entrySize = is64Bit ? 24 : 12; // sizeof(Elf64_Rela) = 24
      const count = Math.floor(sec.size / entrySize);

      this.reader.seek(sec.offset);
      for (let i = 0; i < count; i++) {
        let rOffset = 0n;
        let rInfo = 0n;
        let rAddend = 0n;

        if (is64Bit) {
          rOffset = this.reader.readUint64();
          rInfo = this.reader.readUint64();
          rAddend = this.reader.readInt64();
        } else {
          rOffset = BigInt(this.reader.readUint32());
          rInfo = BigInt(this.reader.readUint32());
          rAddend = BigInt(this.reader.readInt32());
        }

        const symIdx = is64Bit ? Number(rInfo >> 32n) : Number(rInfo >> 8n);
        const relType = is64Bit ? Number(rInfo & 0xFFFFFFFFn) : Number(rInfo & 0xFFn);

        this.relocations.push({
          sectionName: sec.name,
          offset: rOffset,
          formattedOffset: `0x${rOffset.toString(16)}`,
          symIdx,
          symbolName: `sym_${symIdx}`,
          type: relType,
          typeName: getRelocationTypeName(relType, this.header.eMachine),
          addend: rAddend,
          formattedAddend: rAddend >= 0n ? `+0x${rAddend.toString(16)}` : `-0x${(-rAddend).toString(16)}`
        });
      }
    }
  }

  parseSymbols() {
    const symSections = this.sections.filter(s => s.type === 2 || s.type === 11); // SHT_SYMTAB, SHT_DYNSYM
    const is64Bit = this.header.is64Bit;

    for (const sec of symSections) {
      if (sec.isOutOfBounds || sec.size === 0) continue;
      const strtab = (sec.name === ".dynsym") ? this.dynstr : this.strtab;
      const entrySize = is64Bit ? 24 : 16;
      const count = Math.min(250, Math.floor(sec.size / entrySize)); // Cap preview to 250 symbols

      this.reader.seek(sec.offset);
      for (let i = 0; i < count; i++) {
        let stName = 0;
        let stInfo = 0;
        let stOther = 0;
        let stShndx = 0;
        let stValue = 0n;
        let stSize = 0n;

        if (is64Bit) {
          stName = this.reader.readUint32();
          stInfo = this.reader.readUint8();
          stOther = this.reader.readUint8();
          stShndx = this.reader.readUint16();
          stValue = this.reader.readUint64();
          stSize = this.reader.readUint64();
        } else {
          stName = this.reader.readUint32();
          stValue = BigInt(this.reader.readUint32());
          stSize = BigInt(this.reader.readUint32());
          stInfo = this.reader.readUint8();
          stOther = this.reader.readUint8();
          stShndx = this.reader.readUint16();
        }

        let name = "";
        if (strtab && stName < strtab.byteLength) {
          let end = stName;
          while (end < strtab.byteLength && strtab[end] !== 0) end++;
          name = new TextDecoder().decode(strtab.subarray(stName, end));
        }

        const symBind = stInfo >> 4;
        const symType = stInfo & 0x0F;

        this.symbols.push({
          index: i,
          name: name || `(null)`,
          sectionName: sec.name,
          value: stValue,
          formattedValue: `0x${stValue.toString(16)}`,
          size: Number(stSize),
          shndx: stShndx,
          bind: symBind === 1 ? "GLOBAL" : (symBind === 0 ? "LOCAL" : "WEAK"),
          type: symType === 2 ? "FUNC" : (symType === 1 ? "OBJECT" : (symType === 0 ? "NOTYPE" : `${symType}`))
        });
      }
    }
  }

  detectPrxMetadata() {
    // Detect PlayStation Orbis / Prospero PRX characteristics:
    // 1. OSABI is 0x90
    // 2. Contains Sony segments: PT_SCE_RELA, PT_SCE_PROGLIB, PT_SCE_DYNLIBDATA
    // 3. Contains Sony dynamic tags: DT_SCE_MODULE_INFO, etc.
    const hasSceSegments = this.programHeaders.some(p => p.type >= 0x61000000 && p.type <= 0x6FFFFFFF);
    const hasSceTags = this.dynamicTags.some(t => t.tag >= 0x61000000 && t.tag <= 0x610000FF);
    const isSceAbi = (this.header.eiOsAbi === 0x90);

    this.isPrx = isSceAbi || hasSceSegments || hasSceTags;
  }

  findSection(name) {
    return this.sections.find(s => s.name === name) || null;
  }

  getSectionData(name) {
    const sec = this.findSection(name);
    if (!sec || sec.isOutOfBounds) return null;
    return this.buffer.subarray(sec.offset, sec.offset + sec.size);
  }
}
