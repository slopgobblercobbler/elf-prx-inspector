#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct PtSceCommentDef {
    static constexpr std::uint32_t segment_type = 0x6fffff02;
    static constexpr std::string_view name = "PT_SCE_COMMENT";
    static constexpr std::string_view desc = "PlayStation build comment and compiler stamp segment";
};
}
