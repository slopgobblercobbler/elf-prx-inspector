// test/nid_dictionary.test.js - PRX NID Dictionary Unit Test Suite
import test from "node:test";
import assert from "node:assert/strict";
import { KNOWN_PRX_NIDS, resolveNid } from "../js/nid_dictionary.js";

test("Dictionary contains known PRX NIDs", () => {
  assert.ok(Object.keys(KNOWN_PRX_NIDS).length > 10, "Dictionary contains known PRX NIDs");
});

test("Lookup verification resolves known NIDs", () => {
  assert.equal(resolveNid("0x0B819662C92C0F27"), "sceKernelAllocateDirectMemory");
  assert.equal(resolveNid("0x44D76722C4372F76"), "scePadInit");
  assert.equal(resolveNid("0x61FA8D6F72733A0B"), "sceVideoOutOpen");
});

test("Unknown NID rejection returns null", () => {
  assert.equal(resolveNid("0x0000000000000000"), null);
});
