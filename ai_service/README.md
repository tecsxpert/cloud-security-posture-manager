# Tool-59 — Cloud Security Posture Manager — AI Service

AI microservice built with Flask and Groq LLaMA-3.3-70b.
Runs on **port 5000**.

---

## Overview

This AI microservice provides 3 AI-powered endpoints that
analyse cloud resources and generate security reports.

Built by: **Harshith K S — AI Developer 1**
Sprint: 14 April – 9 May 2026

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Python 3.11 | Language |
| Flask 3.x | Web framework |
| Groq LLaMA-3.3-70b | AI model |
| Redis 7 | AI response cache |
| ChromaDB | Vector knowledge base |
| sentence-transformers | Text embeddings |
| flask-limiter | Rate limiting 30 req/min |

---

## Setup

### Step 1 — Clone repo
```bash
git clone https://github.com/harshi19-2004/cloud-security-posture-manager.git
cd cloud-security-posture-manager/ai_service
```

### Step 2 — Create virtual environment
```bash
python -m venv venv
venv\Scripts\activate
```

### Step 3 — Install dependencies
```bash
pip install -r requirements.txt
```

### Step 4 — Create .env file
```bash
cp .env.example .env
```
Add your Groq API key from console.groq.com

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| GROQ_API_KEY | YES | Free key at console.groq.com |
| GROQ_MODEL | NO | Default: llama-3.3-70b-versatile |
| AI_PORT | NO | Default: 5000 |
| FLASK_DEBUG | NO | Default: false |
| REDIS_URL | NO | Default: redis://localhost:6379/1 |
| RATELIMIT_DEFAULT | NO | Default: 30 per minute |
| CHROMA_PATH | NO | Default: ./chroma_data |

---

## Run Instructions

### Run locally
```bash
python app.py
```
Service starts at: http://localhost:5000

### Run with Docker
```bash
docker build -t tool59-ai .
docker run -p 5000:5000 --env-file .env tool59-ai
```

### Run with Docker Compose
```bash
docker-compose up --build
```

### Check service is running
```bash
curl http://localhost:5000/health
```

### Run all tests
```bash
python test_describe.py
python test_recommend.py
python test_report.py
python test_health.py
python test_security.py
python test_optimisation.py
python test_dry_run.py
```

---

## API Reference

Base URL: `http://localhost:5000`

---

### GET /health
```json
{
  "status": "ok",
  "model": "llama-3.3-70b-versatile",
  "uptime_seconds": 3600,
  "uptime_human": "1h 0m 0s",
  "avg_response_ms": 637.0
}
```

---

### POST /describe
```json
Request:
{ "resource": "AWS S3 bucket with public read ACL." }

Response:
{
  "description": "This S3 bucket is publicly readable.",
  "risk_level": "CRITICAL",
  "findings": ["Public read ACL enabled"],
  "generated_at": "2026-05-05T10:30:00+00:00",
  "is_fallback": false
}
```

---

### POST /recommend
```json
Request:
{ "resource": "Redis on port 6379 with no password." }

Response:
{
  "recommendations": [
    {"action_type": "RESTRICT", "description": "Block port 6379.", "priority": "HIGH"},
    {"action_type": "CONFIGURE", "description": "Enable Redis AUTH.", "priority": "MEDIUM"},
    {"action_type": "ENABLE", "description": "Enable TLS encryption.", "priority": "LOW"}
  ],
  "generated_at": "2026-05-05T10:30:00+00:00",
  "is_fallback": false
}
```

---

### POST /generate-report
```json
Request:
{ "environment": "AWS production with public RDS and S3." }

Response:
{
  "title": "Cloud Security Posture Report — Production AWS",
  "summary": "Critical misconfigurations found.",
  "overview": "RDS publicly accessible. S3 has public ACL.",
  "key_items": [...],
  "recommendations": [...],
  "generated_at": "2026-05-05T10:30:00+00:00",
  "is_fallback": false
}
```

---

## Security Features

| Feature | Details |
|---|---|
| Rate Limiting | 30 requests per minute per IP |
| Input Sanitisation | HTML, SQL, prompt injection blocked |
| Security Headers | X-Frame-Options, CSP, HSTS, Cache-Control |
| Fallback Response | is_fallback: true when AI unavailable |
| Redis Cache | SHA256 key, 15 min TTL |
| Non-root Docker | Runs as appuser not root |

---

## Dry Run Results

Latest dry run results (Day 14):

| Endpoint | Response Time | Status |
|---|---|---|
| GET /health | 1.59ms | PASS ✅ |
| POST /describe | 637.21ms | PASS ✅ |
| POST /recommend | 596.40ms | PASS ✅ |
| POST /generate-report | 1409.94ms | PASS ✅ |

All endpoints under 2000ms target! ✅

---

## Folder Structure

```
ai_service/
├── app.py
├── requirements.txt
├── Dockerfile
├── README.md
├── .env.example
├── routes/
│   ├── health.py
│   ├── describe.py
│   ├── recommend.py
│   └── report.py
├── services/
│   ├── groq_client.py
│   ├── sanitiser.py
│   ├── cache.py
│   ├── security_headers.py
│   ├── embeddings.py
│   ├── chroma_seeder.py
│   └── ai_integration.py
└── prompts/
    ├── describe_system.txt
    ├── recommend_system.txt
    └── report_system.txt
```

---

## Developer

**Harshith K S** — AI Developer 1
Tool-59 Cloud Security Posture Manager
CampusPe Internship — Sprint: 14 April – 9 May 2026

GitHub: https://github.com/harshi19-2004/cloud-security-posture-manager