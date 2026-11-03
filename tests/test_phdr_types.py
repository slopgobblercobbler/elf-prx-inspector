import json
import os
import unittest

class TestProgramHeaders(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'program_headers.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_sce_custom_headers(self):
        self.assertEqual(self.data['PT_SCE_PROCPARAM'], 0x61000001)
        self.assertEqual(self.data['PT_SCE_MODULE_PARAM'], 0x61000002)

if __name__ == '__main__':
    unittest.main()
