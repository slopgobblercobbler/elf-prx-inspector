import json
import os
import unittest

class TestRwlockNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_rwlock_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['scePthreadRwlockInit'], '0x981240FE11029471')

if __name__ == '__main__':
    unittest.main()
