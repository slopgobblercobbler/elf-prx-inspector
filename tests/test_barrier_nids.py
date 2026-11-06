import json
import os
import unittest

class TestBarrierNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_barrier_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_barrier_nids(self):
        self.assertEqual(len(self.data['scePthreadBarrierInit']), 18)
        self.assertTrue(self.data['scePthreadBarrierInit'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
