// test/binary_reader.test.js
import test from "node:test";
import assert from "node:assert/strict";
import { BinaryReader } from "../js/binary_reader.js";

test("BinaryReader parses primitives and enforces bounds", () => {
  const buf = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08]);
  const reader = new BinaryReader(buf);

  assert.equal(reader.readUint8(), 1);
  assert.equal(reader.readUint16(), 0x0302);
  assert.equal(reader.readUint32(), 0x07060504);
  assert.equal(reader.remaining, 1);
  assert.equal(reader.readUint8(), 8);
  assert.equal(reader.isEOF(), true);
  assert.throws(() => reader.readUint8(), RangeError);
});

test("BinaryReader reads null-terminated strings and slices cleanly", () => {
  const buf = new TextEncoder().encode("Hello\0World\0");
  const reader = new BinaryReader(buf);

  assert.equal(reader.readNullTerminatedString(), "Hello");
  assert.equal(reader.readNullTerminatedString(), "World");

  const slice = reader.slice(0, 5);
  assert.equal(slice.length, 5);
});
