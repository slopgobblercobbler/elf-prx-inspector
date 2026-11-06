#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibMinorDef {
    static constexpr std::uint64_t d_tag = 0x61000019;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB_MINOR";
    static constexpr std::string_view desc = "PlayStation PRX imported library minor version constraint";
};
}
