def check_self_flags(flags):
    return {'is_encrypted': bool(flags & 0x1), 'is_signed': bool(flags & 0x2)}
