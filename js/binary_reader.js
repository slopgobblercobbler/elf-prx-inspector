// js/binary_reader.js - Bounds-checked binary reader supporting ELF64, ELF32, and PRX structures

export class BinaryReader {
  /**
   * @param {Uint8Array|ArrayBuffer} buffer
   * @param {number} [byteOffset=0]
   * @param {number} [byteLength]
   * @param {boolean} [littleEndian=true]
   */
  constructor(buffer, byteOffset = 0, byteLength, littleEndian = true) {
    if (buffer instanceof ArrayBuffer) {
      this.buffer = new Uint8Array(buffer, byteOffset, byteLength ?? (buffer.byteLength - byteOffset));
    } else if (buffer instanceof Uint8Array) {
      const start = buffer.byteOffset + byteOffset;
      const len = byteLength ?? (buffer.byteLength - byteOffset);
      this.buffer = new Uint8Array(buffer.buffer, start, len);
    } else {
      throw new TypeError("BinaryReader expects Uint8Array or ArrayBuffer");
    }

    this.view = new DataView(this.buffer.buffer, this.buffer.byteOffset, this.buffer.byteLength);
    this.offset = 0;
    this.littleEndian = littleEndian;
    this.baseVirtualAddress = 0n;
  }

  get length() {
    return this.buffer.byteLength;
  }

  get remaining() {
    return Math.max(0, this.buffer.byteLength - this.offset);
  }

  isEOF() {
    return this.offset >= this.buffer.byteLength;
  }

  seek(newOffset) {
    if (newOffset < 0 || newOffset > this.buffer.byteLength) {
      throw new RangeError(`Seek offset ${newOffset} out of bounds [0, ${this.buffer.byteLength}]`);
    }
    this.offset = newOffset;
  }

  skip(bytes) {
    this.seek(this.offset + bytes);
  }

  checkBounds(size) {
    if (this.offset + size > this.buffer.byteLength) {
      throw new RangeError(
        `Buffer overrun: attempted to read ${size} bytes at offset ${this.offset}, total length ${this.buffer.byteLength}`
      );
    }
  }

  readUint8() {
    this.checkBounds(1);
    const val = this.view.getUint8(this.offset);
    this.offset += 1;
    return val;
  }

  readInt8() {
    this.checkBounds(1);
    const val = this.view.getInt8(this.offset);
    this.offset += 1;
    return val;
  }

  readUint16(littleEndian = this.littleEndian) {
    this.checkBounds(2);
    const val = this.view.getUint16(this.offset, littleEndian);
    this.offset += 2;
    return val;
  }

  readInt16(littleEndian = this.littleEndian) {
    this.checkBounds(2);
    const val = this.view.getInt16(this.offset, littleEndian);
    this.offset += 2;
    return val;
  }

  readUint32(littleEndian = this.littleEndian) {
    this.checkBounds(4);
    const val = this.view.getUint32(this.offset, littleEndian);
    this.offset += 4;
    return val;
  }

  readInt32(littleEndian = this.littleEndian) {
    this.checkBounds(4);
    const val = this.view.getInt32(this.offset, littleEndian);
    this.offset += 4;
    return val;
  }

  readUint64(littleEndian = this.littleEndian) {
    this.checkBounds(8);
    const val = this.view.getBigUint64(this.offset, littleEndian);
    this.offset += 8;
    return val;
  }

  readInt64(littleEndian = this.littleEndian) {
    this.checkBounds(8);
    const val = this.view.getBigInt64(this.offset, littleEndian);
    this.offset += 8;
    return val;
  }

  readBytes(count) {
    this.checkBounds(count);
    const slice = this.buffer.subarray(this.offset, this.offset + count);
    this.offset += count;
    return new Uint8Array(slice);
  }

  readNullTerminatedString(maxLen = 1024) {
    const start = this.offset;
    let end = start;
    while (end < this.buffer.byteLength && (end - start) < maxLen && this.buffer[end] !== 0) {
      end++;
    }
    const bytes = this.buffer.subarray(start, end);
    this.offset = (end < this.buffer.byteLength && this.buffer[end] === 0) ? end + 1 : end;
    return new TextDecoder().decode(bytes);
  }

  slice(start, length) {
    const subLength = length ?? (this.buffer.byteLength - start);
    if (start < 0 || subLength < 0 || start + subLength > this.buffer.byteLength) {
      throw new RangeError(
        `Slice range [${start}, ${start + subLength}] exceeds buffer size ${this.buffer.byteLength}`
      );
    }
    const subReader = new BinaryReader(this.buffer, start, subLength, this.littleEndian);
    subReader.baseVirtualAddress = this.baseVirtualAddress + BigInt(start);
    return subReader;
  }
}
