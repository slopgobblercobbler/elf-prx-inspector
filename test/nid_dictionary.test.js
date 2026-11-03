/**
 * PRX NID Dictionary Unit Test Suite
 */

const { KNOWN_PRX_NIDS, resolveNid } = require('../js/nid_dictionary.js');

function runNidTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      passed++;
      console.log(`  ✓ ${message}`);
    } else {
      failed++;
      console.error(`  ✗ FAIL: ${message}`);
    }
  }

  console.log("Running PRX NID Dictionary Tests...");

  assert(Object.keys(KNOWN_PRX_NIDS).length > 10, "Dictionary contains known PRX NIDs");

  // Lookup verification
  assert(resolveNid("0x0B819662C92C0F27") === "sceKernelAllocateDirectMemory", "Resolves sceKernelAllocateDirectMemory");
  assert(resolveNid("0x44D76722C4372F76") === "scePadInit", "Resolves scePadInit");
  assert(resolveNid("0x61FA8D6F72733A0B") === "sceVideoOutOpen", "Resolves sceVideoOutOpen");

  // Unknown NID rejection
  assert(resolveNid("0x0000000000000000") === null, "Returns null for unknown NID");

  console.log(`NID Dictionary Results: ${passed} passed, ${failed} failed.`);
  return failed === 0;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { runNidTests };
}
