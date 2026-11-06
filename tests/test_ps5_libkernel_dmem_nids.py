import json
import os
import unittest

class TestDmemNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_dmem_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['sceKernelAllocateDirectMemory'], '0x321948AC439210DF')

if __name__ == '__main__':
    unittest.main()
