import json
import os
import unittest

class TestRelocationAmd64Part2(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'relocation_amd64_part2.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_relocations(self):
        self.assertEqual(self.data['R_X86_64_GOTPCREL'], 9)
        self.assertEqual(self.data['R_X86_64_TLSGD'], 19)
        self.assertEqual(self.data['R_X86_64_GOTTPOFF'], 22)

if __name__ == '__main__':
    unittest.main()
