def parse_dt_sce_module_attr(dyn_entry):
    return {'attributes': dyn_entry.d_val, 'is_prx': bool(dyn_entry.d_val & 0x1)}
