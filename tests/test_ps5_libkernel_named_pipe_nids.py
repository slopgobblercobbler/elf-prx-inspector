import json
import os
import unittest

class TestNamedPipeNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_named_pipe_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_nids(self):
        self.assertEqual(self.data['sceKernelCreatePipe'], '0x1248A9BF4321EF56')

if __name__ == '__main__':
    unittest.main()
