#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibAttrCompatDef {
    static constexpr std::uint64_t d_tag = 0x6100001B;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB_ATTR_COMPAT";
    static constexpr std::string_view desc = "Backward compatibility constraints for imported PlayStation PRX libraries";
};
}
