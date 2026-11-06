#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct RelocX8664IRelativeDef {
    static constexpr std::uint32_t r_type = 37;
    static constexpr std::string_view name = "R_X86_64_IRELATIVE";
    static constexpr std::string_view desc = "Indirect function relative relocation resolved at runtime";
};
}
