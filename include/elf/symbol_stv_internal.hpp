#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StvInternalDef {
    static constexpr std::uint8_t visibility = 1;
    static constexpr std::string_view name = "STV_INTERNAL";
    static constexpr std::string_view desc = "Processor-specific hidden symbol visibility";
};
}
