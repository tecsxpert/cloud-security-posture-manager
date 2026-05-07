# AI Demo Script

## Demo Objective

Demonstrate how the AI service analyzes cloud security risks and generates security-focused responses.

---

# Demo 1 — Describe Endpoint

## Input

```json
{
  "resource": "Public S3 bucket"
}
```

## Expected Output

* AI explains why public S3 access is risky
* Security findings are generated
* Risk level returned as HIGH or CRITICAL

---

# Demo 2 — Recommend Endpoint

## Input

```json
{
  "resource": "Weak password policy"
}
```

## Expected Output

* AI recommends enabling strong password policies
* Suggests MFA and password complexity improvements

---

# Demo 3 — Health Endpoint

## Request

GET /health

## Expected Output

* Service health status returned successfully
* Confirms backend availability

---

# 60sec Technical Explanation

This project is an AI-powered Cloud Security Posture Management backend service built using Flask and Groq AI integration. The application analyzes cloud security issues such as public storage exposure, weak IAM configurations, and insecure infrastructure settings. Security protections like rate limiting, input sanitization, prompt injection rejection, and OWASP testing were implemented to improve API security. Docker environment setup and automated API testing were also reviewed during development.
