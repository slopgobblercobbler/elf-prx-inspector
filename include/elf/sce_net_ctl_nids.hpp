#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceNetCtlNidDefs {
    static constexpr std::uint64_t INIT = 0x86EB4742;
    static constexpr std::uint64_t TERM = 0x5D3E8362;
    static constexpr std::uint64_t GET_STATE = 0x48967676;
    static constexpr std::uint64_t GET_INFO = 0xB4D56363;
};
}
