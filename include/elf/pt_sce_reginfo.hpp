#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRegInfoDef {
    static constexpr std::uint32_t p_type = 0x60000000;
    static constexpr std::string_view name = "PT_SCE_REGINFO";
    static constexpr std::string_view desc = "PlayStation proprietary hardware register configuration segment";
};
}
