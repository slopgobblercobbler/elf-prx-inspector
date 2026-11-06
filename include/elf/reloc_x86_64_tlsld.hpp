#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct R_X86_64_TlsLd_Def {
    static constexpr std::uint32_t type = 19;
    static constexpr std::string_view name = "R_X86_64_TLSLD";
    static constexpr std::string_view calc = "Direct TLS local dynamic relocation";
};
}
