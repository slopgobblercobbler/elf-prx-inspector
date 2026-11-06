#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceErrorDialogNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x1A28469C;
    static constexpr std::uint64_t OPEN = 0x7E412A30;
    static constexpr std::uint64_t GET_STATUS = 0x4386BE21;
    static constexpr std::uint64_t TERMINATE = 0x8DAE26B0;
};
}
