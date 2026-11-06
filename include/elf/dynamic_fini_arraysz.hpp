#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtFiniArraySzDef {
    static constexpr std::int64_t tag = 28;
    static constexpr std::string_view name = "DT_FINI_ARRAYSZ";
    static constexpr std::string_view desc = "Total byte size of termination functions array";
};
}
