import json
import os
import unittest

class TestBarrierNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_barrier_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['scePthreadBarrierInit'], '0x8920194820194820')

if __name__ == '__main__':
    unittest.main()
