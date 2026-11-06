#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceLibVersionDef {
    static constexpr std::uint32_t segment_type = 0x6fffff01;
    static constexpr std::string_view name = "PT_SCE_LIBVERSION";
    static constexpr std::string_view desc = "PlayStation proprietary PRX library version segment";
};
}
