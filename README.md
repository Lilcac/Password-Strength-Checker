# Password Strength Checker

A beginner-to-intermediate cybersecurity project built with Python, HTML, CSS, and JavaScript. This project evaluates password characteristics and provides feedback to help users understand basic password-strength principles.

## Features

### Python CLI
- Evaluates password length and character variety.
- Checks a local list of common passwords.
- Detects selected predictable sequences.
- Detects four or more consecutive repeated characters.
- Provides a score from 0 to 5 with recommendations.
- Includes automated unit tests.

### Browser Website
- Clean, responsive light-themed interface.
- Live password-strength assessment.
- Show/hide password control.
- Security checklist and improvement suggestions.
- Browser-based assessment without sending passwords to a Python server.

## Project Structure

```text
Password-checker/
├── password_checker.py
├── common_passwords.txt
├── test_password_checker.py
├── README.md
└── web/
    ├── index.html
    ├── style.css
    └── script.js
```

## Requirements

- Python 3.10 or later recommended.
- A modern web browser.
- Visual Studio Code or another text editor (optional).

The Python CLI uses Python's standard library, so no additional packages are required.

## Running the Python Version

1. Open a terminal in the project folder.
2. Run:

   ```bash
   python password_checker.py
   ```

3. Enter a fictional or test password when prompted.

Password input is hidden in supported terminals when using `getpass()`.

## Running the Website

1. Open the `web` folder.
2. Open `index.html` in a modern web browser.
3. Enter a fictional test password and review the results.

The website uses HTML, CSS, and JavaScript. It does not require a Python server.

## Running Automated Tests

From the main project folder, run:

```bash
python -m unittest -v
```

The test suite covers common-password detection, predictable sequences, repeated characters, long passwords, empty input, and feedback for short passwords.

## Security and Privacy

- The website evaluates passwords locally in the browser and does not intentionally transmit them to a backend.
- The Python CLI uses hidden input where the terminal supports `getpass()`.
- The included common-password list is small and intended for demonstration.
- Passwords are not checked against external breach databases.
- The score is a basic heuristic and is not a guarantee that a password is secure.

For testing, use fictional passwords rather than passwords used for real accounts.

## Future Improvements

- Expand password-pattern detection.
- Add more automated tests for edge cases.
- Improve the accessibility and usability of the interface.
- Publish the website using static hosting.
- Explore a more comprehensive password-strength estimation method.

## Author

Created as a personal cybersecurity and web-development portfolio project.
