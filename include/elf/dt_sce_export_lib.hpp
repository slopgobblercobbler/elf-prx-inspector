#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceExportLibDef {
    static constexpr std::uint64_t d_tag = 0x61000013;
    static constexpr std::string_view name = "DT_SCE_EXPORT_LIB";
    static constexpr std::string_view desc = "PlayStation PRX exported library identifier tag";
};
}
