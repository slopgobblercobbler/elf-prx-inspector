#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSymbolicDef {
    static constexpr std::int64_t tag = 16;
    static constexpr std::string_view name = "DT_SYMBOLIC";
    static constexpr std::string_view desc = "Modifies symbol resolution algorithm to search module first";
};
}
