import json
import os
import unittest

class TestAuxiliaryVector(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'auxiliary_vector_types.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_types(self):
        self.assertEqual(self.data['AT_NULL'], 0)
        self.assertEqual(self.data['AT_PHDR'], 3)
        self.assertEqual(self.data['AT_ENTRY'], 9)

if __name__ == '__main__':
    unittest.main()
