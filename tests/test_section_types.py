import json
import os
import unittest

class TestSectionTypes(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'section_types.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_canonical_sht(self):
        self.assertEqual(self.data['SHT_PROGBITS'], 1)
        self.assertEqual(self.data['SHT_RELA'], 4)
        self.assertEqual(self.data['SHT_DYNAMIC'], 6)
        self.assertEqual(self.data['SHT_NOBITS'], 8)

if __name__ == '__main__':
    unittest.main()
