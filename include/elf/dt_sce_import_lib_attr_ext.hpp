#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceImportLibAttrExtDef {
    static constexpr std::uint64_t d_tag = 0x6100001A;
    static constexpr std::string_view name = "DT_SCE_IMPORT_LIB_ATTR_EXT";
    static constexpr std::string_view desc = "Extended attribute constraints for PlayStation PRX imported libraries";
};
}
