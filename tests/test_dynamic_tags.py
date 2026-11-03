import json
import os
import unittest

class TestDynamicTags(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'dynamic_tags.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_core_tags(self):
        self.assertEqual(self.data['DT_NEEDED'], 1)
        self.assertEqual(self.data['DT_STRTAB'], 5)
        self.assertEqual(self.data['DT_SYMTAB'], 6)

if __name__ == '__main__':
    unittest.main()
