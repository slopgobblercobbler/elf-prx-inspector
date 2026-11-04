import json
import os
import unittest

class TestArchTags(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'dynamic_tags_mips_arm.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_tags(self):
        self.assertEqual(self.data['DT_ARM_SYMTABSZ'], 0x70000001)

if __name__ == '__main__':
    unittest.main()
