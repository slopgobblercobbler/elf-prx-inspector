#pragma once
#include <string_view>

namespace elf {
struct StbGlobalOverrideDef {
    static constexpr std::string_view name = "STB_GLOBAL_OVERRIDE";
    static constexpr std::string_view desc = "Explicit global symbol override attribute for dynamically loaded modules";
};
}
