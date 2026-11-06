#pragma once
#include <cstdint>
#include <string_view>

namespace elf {
struct SceSysmoduleNidDefs {
    static constexpr std::uint64_t LOAD_MODULE = 0x4896263B;
    static constexpr std::uint64_t UNLOAD_MODULE = 0xB6F11CEB;
    static constexpr std::uint64_t IS_LOADED = 0x8DFD7528;
};
}
