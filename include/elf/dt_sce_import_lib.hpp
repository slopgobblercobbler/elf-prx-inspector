#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibDef {
    static constexpr std::uint64_t d_tag = 0x61000015;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB";
    static constexpr std::string_view desc = "PlayStation PRX imported library identifier tag";
};
}
