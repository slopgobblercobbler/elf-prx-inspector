#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct StbGnuUniqueExtDef {
    static constexpr std::string_view name = "STB_GNU_UNIQUE_EXT";
    static constexpr std::string_view desc = "Extended unique singleton resolution across dynamically opened modules";
};
}
