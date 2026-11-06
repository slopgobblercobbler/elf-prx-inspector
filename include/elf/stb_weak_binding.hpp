#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbWeakBindingDef {
    static constexpr std::uint8_t bind_type = 2;
    static constexpr std::string_view name = "STB_WEAK";
    static constexpr std::string_view desc = "Weak symbol binding allowing override by global definition";
};
}
