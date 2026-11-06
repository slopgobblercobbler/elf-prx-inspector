#pragma once
#include <string_view>

namespace elf {
struct StbGlobalExportDef {
    static constexpr std::string_view name = "STB_GLOBAL_EXPORT";
    static constexpr std::string_view desc = "Global symbol exported across dynamic module boundary";
};
}
