#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceDynlibDataDef {
    static constexpr std::uint32_t p_type = 0x61000000;
    static constexpr std::string_view name = "PT_SCE_DYNLIBDATA";
    static constexpr std::string_view desc = "PlayStation PRX dynamic library metadata and relocation segment";
};
}
