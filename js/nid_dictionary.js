/**
 * Known PlayStation PRX NID Symbol Dictionary
 * Maps 64-bit NID hashes to canonical C API symbol names across core userland libraries.
 */

export const KNOWN_PRX_NIDS = {
  // libkernel
  "0x0B819662C92C0F27": "sceKernelAllocateDirectMemory",
  "0x2B99E758DAA8785E": "sceKernelReleaseDirectMemory",
  "0x6854CAFAEC29A629": "sceKernelMapDirectMemory",
  "0x3500350B426D7C81": "scePthreadCreate",
  "0x51E281FA272E5D57": "scePthreadExit",
  "0x7BC52B1E64DA9570": "scePthreadJoin",
  "0x8EF13BEFEE881E98": "scePthreadMutexInit",
  "0x96BA6113A6E5DE62": "scePthreadMutexLock",
  "0x42E5E4E36BB0A752": "scePthreadMutexUnlock",

  // libScePad
  "0x44D76722C4372F76": "scePadInit",
  "0x7B9C9BB11762CD4B": "scePadOpen",
  "0x651CBE5F0E77457A": "scePadClose",
  "0x3BB241477F3EFD2E": "scePadReadState",
  "0x4981C9DECE19865B": "scePadSetVibration",

  // libSceVideoOut
  "0x61FA8D6F72733A0B": "sceVideoOutOpen",
  "0x2C485A52A6E9419F": "sceVideoOutClose",
  "0x1E059EDF8C7F048E": "sceVideoOutGetResolutionStatus",
  "0x550FE620EF3E8941": "sceVideoOutConfigureOutput"
};

export function resolveNid(nidHex) {
  const normalized = nidHex.toLowerCase();
  for (const [hash, name] of Object.entries(KNOWN_PRX_NIDS)) {
    if (hash.toLowerCase() === normalized) {
      return name;
    }
  }
  return null;
}
