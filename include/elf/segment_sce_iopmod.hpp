#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceIopModDef {
    static constexpr std::uint32_t segment_type = 0x70000080;
    static constexpr std::string_view name = "PT_SCE_IOPMOD";
    static constexpr std::string_view desc = "PlayStation IO Processor module metadata segment";
};
}
