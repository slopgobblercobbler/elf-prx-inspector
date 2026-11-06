#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibVersionDef {
    static constexpr std::uint64_t d_tag = 0x61000018;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB_VERSION";
    static constexpr std::string_view desc = "PlayStation PRX imported library API version constraint";
};
}
