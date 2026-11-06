#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceLibDataDef {
    static constexpr std::uint32_t p_type = 0x61000001;
    static constexpr std::string_view name = "PT_SCE_LIBDATA";
    static constexpr std::string_view desc = "PlayStation proprietary library export/import table segment";
};
}
