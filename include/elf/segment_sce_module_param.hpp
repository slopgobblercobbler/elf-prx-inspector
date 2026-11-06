#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceModuleParamDef {
    static constexpr std::uint32_t segment_type = 0x6fffff00;
    static constexpr std::string_view name = "PT_SCE_MODULE_PARAM";
    static constexpr std::string_view desc = "PlayStation module initialization parameter block";
};
}
