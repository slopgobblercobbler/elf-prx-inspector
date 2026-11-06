def parse_dt_sce_module_info(dyn_entry):
    return {'type': 'DT_SCE_MODULE_INFO', 'offset': dyn_entry.d_ptr}
