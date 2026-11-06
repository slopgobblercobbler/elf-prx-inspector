import json
import os
import unittest

class TestElfShdrFlags(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'elf_shdr_flags_extended.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_flags(self):
        self.assertEqual(self.data['SHF_MERGE'], '0x00000010')
        self.assertEqual(self.data['SHF_TLS'], '0x00000400')

if __name__ == '__main__':
    unittest.main()
