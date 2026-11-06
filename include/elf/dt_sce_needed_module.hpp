#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSceNeededModuleDef {
    static constexpr std::uint64_t d_tag = 0x61000029;
    static constexpr std::string_view name = "DT_SCE_NEEDED_MODULE";
    static constexpr std::string_view desc = "PlayStation PRX dependent module specification tag";
};
}
