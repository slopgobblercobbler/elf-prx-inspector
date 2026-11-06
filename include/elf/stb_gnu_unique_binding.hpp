#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbGnuUniqueBindingDef {
    static constexpr std::uint8_t bind_type = 10;
    static constexpr std::string_view name = "STB_GNU_UNIQUE";
    static constexpr std::string_view desc = "GNU unique singleton object binding across shared objects";
};
}
