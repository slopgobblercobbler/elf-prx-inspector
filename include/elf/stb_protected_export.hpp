#pragma once
#include <string_view>

namespace elf {
struct StbProtectedExportDef {
    static constexpr std::string_view name = "STB_PROTECTED_EXPORT";
    static constexpr std::string_view desc = "Protected symbol resolution requiring local binding in module";
};
}
