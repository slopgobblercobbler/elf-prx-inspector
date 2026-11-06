#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceSaveDataDialogNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x68EF12AA;
    static constexpr std::uint64_t OPEN = 0x3F615174;
    static constexpr std::uint64_t GET_STATUS = 0x82AB5683;
    static constexpr std::uint64_t CLOSE = 0x8DAE6290;
};
}
