import json
import os
import unittest

class TestSymbolTypes(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'symbol_types.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_types(self):
        self.assertEqual(self.data['STT_FUNC'], 2)
        self.assertEqual(self.data['STT_OBJECT'], 1)
        self.assertEqual(self.data['STT_TLS'], 6)

if __name__ == '__main__':
    unittest.main()
