import json
import os
import unittest

class TestTimedjoinNids(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'ps5_libkernel_timedjoin_nids.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_timedjoin(self):
        self.assertEqual(len(self.data['scePthreadTimedjoinNp']), 18)
        self.assertTrue(self.data['scePthreadTimedjoinNp'].startswith("0x"))

if __name__ == '__main__':
    unittest.main()
