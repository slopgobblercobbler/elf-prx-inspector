#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroFlagsExtDef {
    static constexpr std::uint32_t PF_RELRO_ARMED = 0x8;
    static constexpr std::string_view name = "PT_SCE_RELRO_FLAGS_EXT";
    static constexpr std::string_view desc = "Armed state descriptor for PlayStation write-protected RELRO pages";
};
}
