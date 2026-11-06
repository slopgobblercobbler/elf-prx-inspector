#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_Size64_Def {
    static constexpr std::uint32_t type = 33;
    static constexpr std::string_view name = "R_X86_64_SIZE64";
    static constexpr std::string_view calc = "Z + A";
};
}
