import json
import os
import unittest

class TestVersionDependency(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'version_dependency.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_offsets(self):
        self.assertEqual(self.data['VER_NEED_CURRENT'], 1)
        self.assertEqual(self.data['vn_file_offset'], 4)

if __name__ == '__main__':
    unittest.main()
