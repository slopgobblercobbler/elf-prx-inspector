import json
import os
import unittest

class TestCondVarNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_cond_var_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_cond_nids(self):
        self.assertEqual(len(self.data['scePthreadCondInit']), 18)
        self.assertTrue(self.data['scePthreadCondInit'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
