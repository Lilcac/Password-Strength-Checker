
import unittest
from password_checker import check_password


class TestPasswordChecker(unittest.TestCase):

    def test_common_password_is_flagged(self):
        score, strength, feedback = check_password(
            "password123"
        )

        self.assertEqual(strength, "Weak")
        self.assertLessEqual(score, 1)
        self.assertTrue(
            any("common-password" in item for item in feedback)
        )

    def test_predictable_sequence_is_flagged(self):
        score, strength, feedback = check_password(
            "MyExample123456!"
        )

        self.assertTrue(
            any("predictable sequences" in item for item in feedback)
        )
        self.assertLessEqual(score, 3)

    def test_repeated_characters_are_flagged(self):
        score, strength, feedback = check_password(
            "Abcd!1234XXXX"
        )

        self.assertTrue(
            any("repeating" in item for item in feedback)
        )

    def test_long_password_can_score_high(self):
        score, strength, feedback = check_password(
            "River!Cloud7Forest#92"
        )

        self.assertEqual(score, 5)
        self.assertEqual(strength, "Strong by this checklist")

    def test_empty_password_is_weak(self):
        score, strength, feedback = check_password("")

        self.assertEqual(score, 0)
        self.assertEqual(strength, "Weak")

    def test_short_password_gets_feedback(self):
        score, strength, feedback = check_password("abc")

        self.assertTrue(
            any("at least 12 characters" in item for item in feedback)
        )

    def test_normal_password_does_not_trigger_common_warning(self):
        score, strength, feedback = check_password(
            "River!Cloud7Forest#92"
        )

        self.assertFalse(
            any("common-password" in item for item in feedback)
        )


if __name__ == "__main__":
    unittest.main()
