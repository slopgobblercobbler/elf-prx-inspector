#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtInitArraySzDef {
    static constexpr std::int64_t tag = 27;
    static constexpr std::string_view name = "DT_INIT_ARRAYSZ";
    static constexpr std::string_view desc = "Total byte size of the initialization functions array";
};
}
