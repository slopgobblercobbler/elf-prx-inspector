#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelEventFlagGroupNids {
    static constexpr std::uint64_t sceKernelPollEventFlag = 0x9e6a0df0e55cb8bfULL;
    static constexpr std::uint64_t sceKernelCancelEventFlag = 0xb4a4f89d3810f63bULL;
};
}
