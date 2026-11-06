#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbLocalBindingDef {
    static constexpr std::uint8_t bind_type = 0;
    static constexpr std::string_view name = "STB_LOCAL";
    static constexpr std::string_view desc = "Local symbol visible only within the object file defining it";
};
}
