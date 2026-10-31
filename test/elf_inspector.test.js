// test/elf_inspector.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { ElfInspector } from "../js/elf_inspector.js";
import { SAMPLES } from "../js/samples.js";

test("ElfInspector rejects non-ELF files", () => {
  const garbage = new Uint8Array([0x00, 0x11, 0x22, 0x33]);
  assert.equal(ElfInspector.isElf(garbage), false);

  const inspector = new ElfInspector(garbage);
  assert.throws(() => inspector.inspect(), /Missing standard ELF magic/);
});

test("ElfInspector parses Sample 1 Linux x86-64 executable cleanly", () => {
  const binary = SAMPLES.SAMPLE_1_LINUX_X86_64.generate();
  assert.equal(ElfInspector.isElf(binary), true);

  const inspector = new ElfInspector(binary);
  const result = inspector.inspect();

  assert.equal(result.isElf, true);
  assert.equal(result.isPrx, false);
  assert.equal(result.header.is64Bit, true);
  assert.equal(result.header.eTypeName, "ET_EXEC (Executable file)");
  assert.equal(result.header.eMachineName, "AMD x86-64");
  assert.equal(result.header.eEntry, 0x401000n);

  // Check segments
  assert.equal(result.programHeaders.length, 3);
  assert.equal(result.programHeaders[0].typeName, "PT_LOAD");
  assert.equal(result.programHeaders[0].formattedFlags, "R-E");

  // Check sections
  assert.equal(result.sections.length, 5);
  const textSec = result.sections.find(s => s.name === ".text");
  assert.ok(textSec);
  assert.equal(textSec.typeName, "SHT_PROGBITS");

  // Check dynamic tags
  assert.ok(result.dynamicTags.length >= 5);
  const neededTag = result.dynamicTags.find(t => t.tagName === "DT_NEEDED");
  assert.ok(neededTag);
  assert.equal(neededTag.stringVal, "libc.so.6");
});

test("ElfInspector parses Sample 3 Dynamic Shared Object with Relocations", () => {
  const binary = SAMPLES.SAMPLE_3_SHARED_OBJECT.generate();
  const inspector = new ElfInspector(binary);
  const result = inspector.inspect();

  assert.equal(result.header.eTypeName, "ET_DYN (Shared object / Sony PRX)");
  assert.equal(result.relocations.length, 3);

  const rel1 = result.relocations[0];
  assert.equal(rel1.typeName, "R_X86_64_RELATIVE");
  assert.equal(rel1.offset, 0x2000n);
  assert.equal(rel1.addend, 0x400n);

  const rel2 = result.relocations[1];
  assert.equal(rel2.typeName, "R_X86_64_GLOB_DAT");
  assert.equal(rel2.offset, 0x2008n);

  const rel3 = result.relocations[2];
  assert.equal(rel3.typeName, "R_X86_64_JUMP_SLOT");
  assert.equal(rel3.offset, 0x2010n);
});
