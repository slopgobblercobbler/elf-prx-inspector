#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664PltOff32Def {
    static constexpr std::uint32_t r_type = 32;
    static constexpr std::string_view name = "R_X86_64_PLTOFF32";
    static constexpr std::string_view desc = "32-bit signed offset relative to Procedure Linkage Table base";
};
}
