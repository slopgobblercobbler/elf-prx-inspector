#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroMaskDef {
    static constexpr std::uint32_t mask = 0x00F00000;
    static constexpr std::string_view name = "PT_SCE_RELRO_MASK";
    static constexpr std::string_view desc = "PlayStation RELRO segment bitmask for loader validation";
};
}
