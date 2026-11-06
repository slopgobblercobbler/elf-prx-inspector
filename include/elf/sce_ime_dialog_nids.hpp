#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceImeDialogNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x2A197D6E;
    static constexpr std::uint64_t GET_STATUS = 0x6E105C94;
    static constexpr std::uint64_t GET_RESULT = 0x481E9765;
    static constexpr std::uint64_t TERMINATE = 0x7E3B68A2;
};
}
