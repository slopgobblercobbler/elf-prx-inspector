#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelMutexNids {
    static constexpr std::uint64_t sceKernelCreateMutex = 0x6e788eb59bf6bcf4ULL;
    static constexpr std::uint64_t sceKernelLockMutex = 0xbc3585f67dfbf907ULL;
    static constexpr std::uint64_t sceKernelUnlockMutex = 0xc55ff48cb6c72e27ULL;
    static constexpr std::uint64_t sceKernelDeleteMutex = 0x1f5cfb5d0337b019ULL;
};
}
