#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceExportLibAttrDef {
    static constexpr std::uint64_t d_tag = 0x61000014;
    static constexpr std::string_view name = "DT_SCE_EXPORT_LIB_ATTR";
    static constexpr std::string_view desc = "PlayStation PRX exported library attribute flags";
};
}
