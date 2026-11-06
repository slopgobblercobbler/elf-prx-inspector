def parse_dt_sce_needed_module(dyn_entry, strtab):
    return strtab.get_string(dyn_entry.d_val)
