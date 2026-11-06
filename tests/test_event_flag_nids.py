import json
import os
import unittest

class TestEventFlagNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_event_flag_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_event_flag_nids(self):
        self.assertEqual(len(self.data['sceKernelCreateEventFlag']), 18)
        self.assertTrue(self.data['sceKernelCreateEventFlag'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
