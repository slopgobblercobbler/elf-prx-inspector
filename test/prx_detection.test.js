// test/prx_detection.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { ElfInspector } from "../js/elf_inspector.js";
import { SAMPLES } from "../js/samples.js";

test("ElfInspector detects PlayStation 5 / Orbis PRX structure and Sony segments", () => {
  const binary = SAMPLES.SAMPLE_2_PS5_PRX.generate();
  const inspector = new ElfInspector(binary);
  const result = inspector.inspect();

  assert.equal(result.isElf, true);
  assert.equal(result.isPrx, true);
  assert.equal(result.header.eiOsAbi, 0x90);
  assert.equal(result.header.eiOsAbiName, "PlayStation 4 / 5 (Sony Orbis/Prospero)");

  // Verify Sony specific segments
  const sceRelaSeg = result.programHeaders.find(p => p.type === 0x61000000);
  assert.ok(sceRelaSeg, "Must identify PT_SCE_RELA segment");
  assert.equal(sceRelaSeg.typeName, "PT_SCE_RELA (Sony Relocations)");

  const sceProgLibSeg = result.programHeaders.find(p => p.type === 0x61000002);
  assert.ok(sceProgLibSeg, "Must identify PT_SCE_PROGLIB segment");
  assert.equal(sceProgLibSeg.typeName, "PT_SCE_PROGLIB (Sony Program Library)");

  // Verify Sony dynamic tags
  const sceModInfo = result.dynamicTags.find(t => t.tagName === "DT_SCE_MODULE_INFO");
  assert.ok(sceModInfo, "Must identify DT_SCE_MODULE_INFO tag");

  const sceNeededMod = result.dynamicTags.find(t => t.tagName === "DT_SCE_NEEDED_MODULE");
  assert.ok(sceNeededMod, "Must identify DT_SCE_NEEDED_MODULE tag");
});
