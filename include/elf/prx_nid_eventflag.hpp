#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelEventFlagNids {
    static constexpr std::uint64_t sceKernelCreateEventFlag = 0xd4c2c5100ba03e08ULL;
    static constexpr std::uint64_t sceKernelSetEventFlag = 0x6e9f168fbc387063ULL;
    static constexpr std::uint64_t sceKernelClearEventFlag = 0x4e6bc0ee182db072ULL;
    static constexpr std::uint64_t sceKernelWaitEventFlag = 0xf552bfdbca04c7b8ULL;
};
}
