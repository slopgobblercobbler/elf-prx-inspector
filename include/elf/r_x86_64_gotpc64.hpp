#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664GotPc64Def {
    static constexpr std::uint32_t r_type = 29;
    static constexpr std::string_view name = "R_X86_64_GOTPC64";
    static constexpr std::string_view desc = "64-bit signed PC-relative offset to Global Offset Table";
};
}
