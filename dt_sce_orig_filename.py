def parse_dt_sce_orig_filename(dyn_entry, strtab):
    return strtab.get_string(dyn_entry.d_val)
