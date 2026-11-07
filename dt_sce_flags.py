def parse_dt_sce_flags(entry):
    return {'tag': 'DT_SCE_FLAGS', 'flags': hex(entry.d_val)}
