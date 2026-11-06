#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceAppContentNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0xC263DC8C;
    static constexpr std::uint64_t GET_DATA_PATH = 0x5D849479;
    static constexpr std::uint64_t ADD_CONT_ENQUEUE_DOWNLOAD = 0xA38C61E5;
};
}
