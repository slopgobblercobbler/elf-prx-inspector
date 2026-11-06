#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StvHiddenDef {
    static constexpr std::uint8_t visibility = 2;
    static constexpr std::string_view name = "STV_HIDDEN";
    static constexpr std::string_view desc = "Symbol is not exported outside the current shared module";
};
}
