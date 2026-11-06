#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_GotPc32_Def {
    static constexpr std::uint32_t type = 26;
    static constexpr std::string_view name = "R_X86_64_GOTPC32";
    static constexpr std::string_view calc = "GOT - P + A";
};
}
