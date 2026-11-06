#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceMsgDialogNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x7E31AB01;
    static constexpr std::uint64_t OPEN = 0x821946DE;
    static constexpr std::uint64_t GET_STATUS = 0x1102A654;
    static constexpr std::uint64_t CLOSE = 0x5D48E729;
};
}
