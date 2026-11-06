import json
import os
import unittest

class TestProcessNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_process_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_process_nids(self):
        self.assertEqual(len(self.data['sceKernelGetProcessId']), 18)
        self.assertTrue(self.data['sceKernelGetProcessId'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
