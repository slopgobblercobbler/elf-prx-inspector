// test/relinker_auditor.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { ElfInspector } from "../js/elf_inspector.js";
import { RelinkerAuditor } from "../js/relinker_auditor.js";
import { SAMPLES } from "../js/samples.js";

test("RelinkerAuditor passes clean ELF binaries (Sample 1 & Sample 2)", () => {
  const binary1 = SAMPLES.SAMPLE_1_LINUX_X86_64.generate();
  const inspector1 = new ElfInspector(binary1);
  const data1 = inspector1.inspect();

  const auditor1 = new RelinkerAuditor(data1);
  const report1 = auditor1.audit();

  assert.equal(report1.overallScore, "PASS");
  assert.equal(report1.failCount, 0);

  const binary2 = SAMPLES.SAMPLE_2_PS5_PRX.generate();
  const inspector2 = new ElfInspector(binary2);
  const data2 = inspector2.inspect();

  const auditor2 = new RelinkerAuditor(data2);
  const report2 = auditor2.audit();

  assert.equal(report2.overallScore, "PASS");
  assert.ok(report2.checks.some(c => c.id === "RELINKER-PRX-001"));
});

test("RelinkerAuditor catches out-of-bounds PHT and invalid headers (Sample 4)", () => {
  const binary4 = SAMPLES.SAMPLE_4_CORRUPT_BOUNDS.generate();
  const inspector4 = new ElfInspector(binary4);
  const data4 = inspector4.inspect();

  const auditor4 = new RelinkerAuditor(data4);
  const report4 = auditor4.audit();

  assert.equal(report4.overallScore, "FAIL");
  assert.ok(report4.failCount >= 2);

  // Must fail Check 1 (PHT bounds)
  const phtCheck = report4.checks.find(c => c.id === "RELINKER-ELF-001");
  assert.ok(phtCheck);
  assert.equal(phtCheck.status, "FAIL");

  // Must fail Check 5 (e_shstrndx out of bounds)
  const shstrCheck = report4.checks.find(c => c.id === "RELINKER-ELF-005");
  assert.ok(shstrCheck);
  assert.equal(shstrCheck.status, "FAIL");
});
