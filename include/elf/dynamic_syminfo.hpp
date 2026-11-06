#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct DtSymInfoDef {
    static constexpr std::int64_t tag = 0x6ffffdfd;
    static constexpr std::string_view name = "DT_SYMINFO";
    static constexpr std::string_view desc = "Address of additional symbol information table";
};
}
