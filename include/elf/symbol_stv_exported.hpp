#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StvExportedDef {
    static constexpr std::uint8_t visibility = 13;
    static constexpr std::string_view name = "STV_EXPORTED";
    static constexpr std::string_view desc = "PlayStation explicit PRX library exported symbol attribute";
};
}
