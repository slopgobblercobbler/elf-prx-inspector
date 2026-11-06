#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelSemaphoreNids {
    static constexpr std::uint64_t sceKernelCreateSema = 0x9330a13346e9cb2bULL;
    static constexpr std::uint64_t sceKernelWaitSema = 0xb479ffceaa563b72ULL;
    static constexpr std::uint64_t sceKernelSignalSema = 0x3d35aa70327f2f53ULL;
    static constexpr std::uint64_t sceKernelDeleteSema = 0x2e061801c40ea468ULL;
};
}
