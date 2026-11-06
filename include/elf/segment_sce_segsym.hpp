#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceSegSymDef {
    static constexpr std::uint32_t segment_type = 0x6fffff03;
    static constexpr std::string_view name = "PT_SCE_SEGSYM";
    static constexpr std::string_view desc = "PlayStation segmented symbol mapping table";
};
}
