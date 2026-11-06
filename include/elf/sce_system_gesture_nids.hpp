#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceSystemGestureNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x48EF12AA;
    static constexpr std::uint64_t RECOGNIZE = 0x11AB46D2;
    static constexpr std::uint64_t RESET = 0x7E319728;
};
}
