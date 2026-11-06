#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroAttrDef {
    static constexpr std::uint32_t p_flags = 0x00100000;
    static constexpr std::string_view name = "PT_SCE_RELRO_ATTR";
    static constexpr std::string_view desc = "PlayStation RELRO segment execution protection attribute flags";
};
}
