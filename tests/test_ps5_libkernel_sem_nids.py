import json
import os
import unittest

class TestSemaNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_sem_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['sceKernelCreateSema'], '0x441029AC38192055')

if __name__ == '__main__':
    unittest.main()
