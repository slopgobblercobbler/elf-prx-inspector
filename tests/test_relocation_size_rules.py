import json
import os
import unittest

class TestRelocationSizeRules(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'relocation_amd64_size_rules.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_sizes(self):
        self.assertEqual(self.data['R_X86_64_64'], 8)
        self.assertEqual(self.data['R_X86_64_PC32'], 4)
        self.assertEqual(self.data['R_X86_64_8'], 1)

if __name__ == '__main__':
    unittest.main()
