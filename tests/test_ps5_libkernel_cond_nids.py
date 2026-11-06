import json
import os
import unittest

class TestCondNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_cond_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['scePthreadCondInit'], '0x89104AEC31902047')

if __name__ == '__main__':
    unittest.main()
