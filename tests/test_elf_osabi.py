import json
import os
import unittest

class TestElfOsabi(unittest.TestCase):
    def setUp(self):
        p = os.path.join(os.path.dirname(__file__), '..', 'src', 'elf_osabi.json')
        with open(p, 'r') as f:
            self.data = json.load(f)

    def test_osabi(self):
        self.assertEqual(self.data['ELFOSABI_SYSV'], 0)
        self.assertEqual(self.data['ELFOSABI_FREEBSD'], 9)
        self.assertEqual(self.data['ELFOSABI_LINUX'], 3)

if __name__ == '__main__':
    unittest.main()
