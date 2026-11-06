import json
import os
import unittest

class TestPrxImportLib(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'prx_import_library_entry.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_import_lib(self):
        self.assertEqual(self.data['entry_size_bytes'], 32)
        self.assertEqual(self.data['max_nid_count'], 4096)

if __name__ == '__main__':
    unittest.main()
