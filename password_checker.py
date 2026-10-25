
import re
from getpass import getpass
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
COMMON_PASSWORD_FILE = BASE_DIR / "common_passwords.txt"

PREDICTABLE_PATTERNS = [
    "123456",
    "abcdef",
    "qwerty",
    "asdfgh",
    "zxcvbn",
    "password",
    "letmein",
]


def load_common_passwords():
    """Load the local list of common passwords."""
    try:
        with open(COMMON_PASSWORD_FILE, "r", encoding="utf-8") as file:
            return {
                line.strip().lower()
                for line in file
                if line.strip()
            }
    except FileNotFoundError:
        return set()


def check_password(password, common_passwords=None):
    """Assess a password and return its score, rating, and feedback."""
    if common_passwords is None:
        common_passwords = load_common_passwords()

    score = 0
    feedback = []
    lowered = password.lower()

    # Check length
    if len(password) >= 12:
        score += 1
    else:
        feedback.append("Use at least 12 characters.")

    if len(password) >= 16:
        score += 1

    if len(password) >= 20:
        score += 1

    # Count character categories
    categories = [
        bool(re.search(r"[a-z]", password)),
        bool(re.search(r"[A-Z]", password)),
        bool(re.search(r"[0-9]", password)),
        bool(re.search(r"[^A-Za-z0-9\s]", password)),
    ]

    category_count = sum(categories)

    if category_count >= 3:
        score += 1
    else:
        feedback.append(
            "Consider using a wider variety of character types."
        )

    if category_count == 4:
        score += 1

    # Check for common passwords
    is_common = lowered in common_passwords

    if is_common:
        feedback.append(
            "This password is on the local common-password list."
        )

    # Check for predictable sequences
    has_sequence = any(
        pattern in lowered for pattern in PREDICTABLE_PATTERNS
    )

    if has_sequence:
        feedback.append(
            "Avoid predictable sequences or common password patterns."
        )

    # Check for four or more repeated characters
    has_repetition = bool(re.search(r"(.)\1{3,}", password))

    if has_repetition:
        feedback.append(
            "Avoid repeating the same character many times."
        )

    # Penalise predictable choices
    if is_common:
        score = min(score, 1)
    elif has_sequence or has_repetition:
        score = min(score, 3)

    # Keep score within the range 0-5
    score = min(score, 5)

    if score <= 2:
        strength = "Weak"
    elif score <= 4:
        strength = "Moderate"
    else:
        strength = "Strong by this checklist"

    if not feedback:
        feedback.append(
            "No issues detected by these basic checks."
        )

    return score, strength, feedback


def main():
    print("=== Password Strength Checker ===")
    print("Your password is not saved by this program.")
    print()

    password = getpass("Enter a fictional or test password: ")

    score, strength, feedback = check_password(password)

    print("\n=== Assessment Results ===")
    print(f"Score: {score}/5")
    print(f"Rating: {strength}")

    print("\nFeedback:")
    for item in feedback:
        print(f"- {item}")

    print(
        "\nNote: This is a basic heuristic, not a guarantee "
        "of password security."
    )


if __name__ == "__main__":
    main()
