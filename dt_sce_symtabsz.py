def parse_dt_sce_symtabsz(entry):
    return {'tag': 'DT_SCE_SYMTABSZ', 'size': entry.d_val}
