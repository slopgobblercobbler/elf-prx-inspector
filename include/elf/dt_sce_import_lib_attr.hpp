#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibAttrDef {
    static constexpr std::uint64_t d_tag = 0x61000017;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB_ATTR";
    static constexpr std::string_view desc = "PlayStation PRX imported library attribute flags";
};
}
