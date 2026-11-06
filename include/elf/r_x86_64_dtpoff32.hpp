#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664DtpOff32Def {
    static constexpr std::uint32_t r_type = 21;
    static constexpr std::string_view name = "R_X86_64_DTPOFF32";
    static constexpr std::string_view desc = "32-bit signed TLS block offset relocation";
};
}
