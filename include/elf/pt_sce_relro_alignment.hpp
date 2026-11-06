#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroAlignmentDef {
    static constexpr std::uint64_t PAGE_ALIGN = 0x4000;
    static constexpr std::string_view name = "PT_SCE_RELRO_ALIGN";
    static constexpr std::string_view desc = "PlayStation 16KB virtual memory page alignment requirement for RELRO segments";
};
}
