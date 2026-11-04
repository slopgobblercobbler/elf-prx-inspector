import json
import os
import unittest

class TestRelocationAmd64Part3(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'relocation_amd64_part3.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_relocs(self):
        self.assertEqual(self.data['R_X86_64_GOTPC32'], 26)
        self.assertEqual(self.data['R_X86_64_PLTOFF64'], 31)

if __name__ == '__main__':
    unittest.main()
