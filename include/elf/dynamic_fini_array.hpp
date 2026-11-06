#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtFiniArrayDef {
    static constexpr std::int64_t tag = 26;
    static constexpr std::string_view name = "DT_FINI_ARRAY";
    static constexpr std::string_view desc = "Pointer to array of termination functions";
};
}
