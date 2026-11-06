#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664DtpMod64Def {
    static constexpr std::uint32_t r_type = 16;
    static constexpr std::string_view name = "R_X86_64_DTPMOD64";
    static constexpr std::string_view desc = "Dynamic Thread-Local Storage module identifier relocation";
};
}
