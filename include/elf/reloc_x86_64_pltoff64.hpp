#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_PltOff64_Def {
    static constexpr std::uint32_t type = 31;
    static constexpr std::string_view name = "R_X86_64_PLTOFF64";
    static constexpr std::string_view calc = "L + A";
};
}
