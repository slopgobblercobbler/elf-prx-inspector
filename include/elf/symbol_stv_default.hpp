#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StvDefaultDef {
    static constexpr std::uint8_t visibility = 0;
    static constexpr std::string_view name = "STV_DEFAULT";
    static constexpr std::string_view desc = "Default symbol visibility across components";
};
}
