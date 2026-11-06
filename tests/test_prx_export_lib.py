import json
import os
import unittest

class TestPrxExportLib(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_prx_export_library.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_lib_metadata(self):
        self.assertEqual(self.data['library_name_max_len'], 38)
        self.assertEqual(self.data['max_exported_symbols'], 65536)

if __name__ == '__main__':
    unittest.main()
