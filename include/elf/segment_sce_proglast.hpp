#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceProgLastDef {
    static constexpr std::uint32_t segment_type = 0x6fffffff;
    static constexpr std::string_view name = "PT_SCE_PROGLAST";
    static constexpr std::string_view desc = "PlayStation proprietary PRX trailing metadata segment";
};
}
