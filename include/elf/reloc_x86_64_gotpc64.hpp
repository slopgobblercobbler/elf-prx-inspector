#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_GotPc64_Def {
    static constexpr std::uint32_t type = 29;
    static constexpr std::string_view name = "R_X86_64_GOTPC64";
    static constexpr std::string_view calc = "GOT - P + A";
};
}
