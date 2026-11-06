#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StvProtectedDef {
    static constexpr std::uint8_t visibility = 3;
    static constexpr std::string_view name = "STV_PROTECTED";
    static constexpr std::string_view desc = "Symbol is visible outside module but cannot be overridden";
};
}
