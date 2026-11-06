#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelaDef {
    static constexpr std::uint32_t segment_type = 0x60000001;
    static constexpr std::string_view name = "PT_SCE_RELA";
    static constexpr std::string_view desc = "PlayStation proprietary relocations table segment";
};
}
