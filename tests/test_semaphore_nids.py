import json
import os
import unittest

class TestSemaphoreNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_semaphore_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_sema_nids(self):
        self.assertEqual(len(self.data['sceKernelCreateSema']), 18)
        self.assertTrue(self.data['sceKernelCreateSema'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
