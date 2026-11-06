#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbWeakDef {
    static constexpr std::uint8_t binding = 2;
    static constexpr std::string_view name = "STB_WEAK";
    static constexpr std::string_view desc = "Weak symbol binding specification";
};
}
