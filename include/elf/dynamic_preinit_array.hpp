#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtPreInitArrayDef {
    static constexpr std::int64_t tag = 32;
    static constexpr std::string_view name = "DT_PREINIT_ARRAY";
    static constexpr std::string_view desc = "Array of pre-initialization functions invoked before constructors";
};
}
