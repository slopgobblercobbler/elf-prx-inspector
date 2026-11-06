def detect_nid_collisions(nid_list):
    seen = set()
    return [nid for nid in nid_list if nid in seen or seen.add(nid)]
