#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtRunpathDef {
    static constexpr std::int64_t tag = 29;
    static constexpr std::string_view name = "DT_RUNPATH";
    static constexpr std::string_view desc = "Dynamic library search path string table offset";
};
}
