#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664GotOff64Def {
    static constexpr std::uint32_t r_type = 27;
    static constexpr std::string_view name = "R_X86_64_GOTOFF64";
    static constexpr std::string_view desc = "64-bit signed offset relative to Global Offset Table base";
};
}
