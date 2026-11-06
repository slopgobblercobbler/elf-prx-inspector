import json
import os
import unittest

class TestPs5DynamicSce(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_dynamic_sce_rel.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_tags(self):
        self.assertEqual(self.data['DT_SCE_RELA'], "0x6100002F")
        self.assertEqual(self.data['DT_SCE_SYMTAB'], "0x61000039")

if __name__ == '__main__':
    unittest.main()
