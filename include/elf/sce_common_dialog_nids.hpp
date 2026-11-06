#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceCommonDialogNidDefs {
    static constexpr std::uint64_t INITIALIZE = 0x5E2B9611;
    static constexpr std::uint64_t IS_USED_TO_SYSTEM_GESTURE = 0x82AB16D4;
    static constexpr std::uint64_t UPDATE_STATUS = 0x38AF291C;
};
}
