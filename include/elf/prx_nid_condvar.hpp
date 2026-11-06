#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelCondVarNids {
    static constexpr std::uint64_t sceKernelCreateCond = 0xd583151eb4281747ULL;
    static constexpr std::uint64_t sceKernelSignalCond = 0xea8dbda09fb8b1cfULL;
    static constexpr std::uint64_t sceKernelBroadcastCond = 0x4f7f5256e0aa37c5ULL;
    static constexpr std::uint64_t sceKernelWaitCond = 0x1d3c7ea1bfa00c14ULL;
};
}
