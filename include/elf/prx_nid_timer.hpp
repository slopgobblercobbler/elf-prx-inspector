#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelTimerNids {
    static constexpr std::uint64_t sceKernelCreateTimer = 0x7b198da1bc720a45ULL;
    static constexpr std::uint64_t sceKernelStartTimer = 0x3d41a77038914bcaULL;
    static constexpr std::uint64_t sceKernelStopTimer = 0xa481cb94318c66e2ULL;
    static constexpr std::uint64_t sceKernelDeleteTimer = 0xf52bca100192e457ULL;
};
}
