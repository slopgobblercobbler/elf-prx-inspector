#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_Size32_Def {
    static constexpr std::uint32_t type = 32;
    static constexpr std::string_view name = "R_X86_64_SIZE32";
    static constexpr std::string_view calc = "Z + A";
};
}
