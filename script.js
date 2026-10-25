
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("toggle-password");
const ratingElement = document.getElementById("rating");
const scoreElement = document.getElementById("score");
const strengthBar = document.getElementById("strength-bar");
const strengthTrack = document.getElementById("strength-track");
const checklistElement = document.getElementById("checklist");
const feedbackElement = document.getElementById("feedback");

const commonPasswords = new Set([
    "password",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "1234567890",
    "qwerty",
    "qwerty123",
    "admin",
    "admin123",
    "letmein",
    "welcome",
    "iloveyou",
    "abc123",
    "football",
    "monkey",
    "dragon",
    "changeme"
]);

const predictablePatterns = [
    "123456",
    "abcdef",
    "qwerty",
    "asdfgh",
    "zxcvbn",
    "password",
    "letmein"
];

function assessPassword(password) {
    let score = 0;
    const feedback = [];
    const checks = [];

    const length12 = password.length >= 12;
    const length16 = password.length >= 16;
    const length20 = password.length >= 20;

    checks.push({
        label: "At least 12 characters",
        passed: length12
    });

    if (length12) {
        score += 1;
    } else {
        feedback.push("Use at least 12 characters.");
    }

    if (length16) score += 1;
    if (length20) score += 1;

    const categories = [
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9\s]/.test(password)
    ];

    const categoryCount = categories.filter(Boolean).length;

    checks.push({
        label: "At least three character types",
        passed: categoryCount >= 3
    });

    checks.push({
        label: "All four character types",
        passed: categoryCount === 4
    });

    if (categoryCount >= 3) {
        score += 1;
    } else {
        feedback.push(
            "Consider using a wider variety of character types."
        );
    }

    if (categoryCount === 4) {
        score += 1;
    }

    const lowered = password.toLowerCase();
    const isCommon = commonPasswords.has(lowered);

    checks.push({
        label: "Not on the local common-password list",
        passed: !isCommon
    });

    if (isCommon) {
        feedback.push(
            "This password is on the local common-password list."
        );
    }

    const hasSequence = predictablePatterns.some(
        pattern => lowered.includes(pattern)
    );

    checks.push({
        label: "No listed predictable sequences",
        passed: !hasSequence
    });

    if (hasSequence) {
        feedback.push(
            "Avoid predictable sequences or common password patterns."
        );
    }

    const hasRepetition = /(.)\1{3,}/.test(password);

    checks.push({
        label: "No four or more consecutive repeated characters",
        passed: !hasRepetition
    });

    if (hasRepetition) {
        feedback.push(
            "Avoid repeating the same character many times."
        );
    }

    if (isCommon) {
        score = Math.min(score, 1);
    } else if (hasSequence || hasRepetition) {
        score = Math.min(score, 3);
    }

    score = Math.min(score, 5);

    let strength;

    if (score <= 2) {
        strength = "Weak";
    } else if (score <= 4) {
        strength = "Moderate";
    } else {
        strength = "Strong by this checklist";
    }

    if (feedback.length === 0) {
        feedback.push(
            "No issues detected by these basic checks."
        );
    }

    return { score, strength, feedback, checks };
}

function addListItem(list, text, passed = false) {
    const item = document.createElement("li");
    item.textContent = text;

    if (passed) {
        item.classList.add("pass");
    }

    list.appendChild(item);
}

function updateAssessment() {
    const password = passwordInput.value;

    checklistElement.replaceChildren();
    feedbackElement.replaceChildren();

    if (password.length === 0) {
        ratingElement.textContent = "Not checked";
        ratingElement.className = "rating";
        scoreElement.textContent = "Score: — / 5";
        strengthBar.style.width = "0%";
        strengthBar.className = "strength-bar";
        strengthTrack.setAttribute("aria-valuenow", "0");

        addListItem(
            checklistElement,
            "Enter a password to begin your assessment."
        );

        addListItem(
            feedbackElement,
            "Your results will appear here as you type."
        );

        return;
    }

    const result = assessPassword(password);

    ratingElement.textContent = result.strength;
    ratingElement.className = "rating";

    if (result.score <= 2) {
        ratingElement.classList.add("weak");
        strengthBar.className = "strength-bar";
    } else if (result.score <= 4) {
        ratingElement.classList.add("moderate");
        strengthBar.className = "strength-bar moderate";
    } else {
        ratingElement.classList.add("strong");
        strengthBar.className = "strength-bar strong";
    }

    scoreElement.textContent = `Score: ${result.score} / 5`;
    strengthBar.style.width = `${result.score * 20}%`;
    strengthTrack.setAttribute(
        "aria-valuenow",
        String(result.score)
    );

    result.checks.forEach(check => {
        addListItem(
            checklistElement,
            check.label,
            check.passed
        );
    });

    result.feedback.forEach(message => {
        addListItem(feedbackElement, message);
    });
}

passwordInput.addEventListener("input", updateAssessment);

toggleButton.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";

    passwordInput.type = isHidden ? "text" : "password";
    toggleButton.textContent = isHidden ? "Hide" : "Show";
    toggleButton.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
    );
    toggleButton.setAttribute(
        "aria-pressed",
        String(isHidden)
    );
});

updateAssessment();
