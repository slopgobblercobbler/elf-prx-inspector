#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbGnuUniqueDef {
    static constexpr std::uint8_t binding = 10;
    static constexpr std::string_view name = "STB_GNU_UNIQUE";
    static constexpr std::string_view desc = "Unique symbol binding across all loaded shared objects";
};
}
