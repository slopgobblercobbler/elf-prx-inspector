def parse_dt_sce_strtab(entry):
    return {'tag': 'DT_SCE_STRTAB', 'offset': entry.d_ptr}
