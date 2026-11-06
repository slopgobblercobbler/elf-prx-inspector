#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroDef {
    static constexpr std::uint32_t p_type = 0x60000010;
    static constexpr std::string_view name = "PT_SCE_RELRO";
    static constexpr std::string_view desc = "PlayStation proprietary read-only after relocation segment";
};
}
