#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceKernelMsgPipeNids {
    static constexpr std::uint64_t sceKernelCreateMsgPipe = 0x8a923fc7b8201a44ULL;
    static constexpr std::uint64_t sceKernelSendMsgPipe = 0x1cf92a348b0a99ffULL;
    static constexpr std::uint64_t sceKernelReceiveMsgPipe = 0x5d21a990fcb34821ULL;
    static constexpr std::uint64_t sceKernelDeleteMsgPipe = 0x738cbff2901a5522ULL;
};
}
