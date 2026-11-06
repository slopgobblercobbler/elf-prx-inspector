#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceRelroFlagsDef {
    static constexpr std::uint32_t PF_R_ONLY = 0x4;
    static constexpr std::string_view name = "PT_SCE_RELRO_FLAGS";
    static constexpr std::string_view desc = "Read-only access permission bits for PlayStation RELRO segments";
};
}
