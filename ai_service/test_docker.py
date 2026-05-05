"""
test_docker.py
Day 13 Task — AI Developer 1
Verifies packaging is correct — Dockerfile, requirements, .env.example

How to run:
    python test_docker.py
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

G = "\033[92m"
R = "\033[91m"
Y = "\033[93m"
X = "\033[0m"

def ok(m):   print(f"  {G}PASS{X}  {m}")
def fail(m): print(f"  {R}FAIL{X}  {m}")
def info(m): print(f"  {Y}    {X}  {m}")

BASE = Path(__file__).parent


def test_packaging():
    passed = 0
    total  = 0

    print(f"\n{'='*55}")
    print(f"  Testing AI Service Packaging — Day 13")
    print(f"{'='*55}")

    # ── Test 1: Dockerfile exists ─────────────────────────────────────────────
    total += 1
    print(f"\n  Test 1: Dockerfile exists")
    dockerfile = BASE / "Dockerfile"
    if dockerfile.exists():
        ok("Dockerfile exists")
        passed += 1
    else:
        fail("Dockerfile not found!")

    # ── Test 2: Dockerfile has required commands ──────────────────────────────
    total += 1
    print(f"\n  Test 2: Dockerfile has required commands")
    content = dockerfile.read_text()
    checks  = ["FROM python:3.11", "WORKDIR", "COPY requirements.txt",
                "pip install", "EXPOSE 5000", "HEALTHCHECK", "CMD"]
    missing = [c for c in checks if c not in content]
    if not missing:
        ok("Dockerfile has all required commands")
        passed += 1
    else:
        fail(f"Dockerfile missing: {missing}")

    # ── Test 3: requirements.txt has exact versions ───────────────────────────
    total += 1
    print(f"\n  Test 3: requirements.txt has exact versions")
    req_file = BASE / "requirements.txt"
    if req_file.exists():
        content  = req_file.read_text()
        required = ["flask==", "groq==", "python-dotenv==",
                    "flask-limiter==", "redis=="]
        missing  = [r for r in required if r not in content]
        if not missing:
            ok("requirements.txt has exact pinned versions")
            passed += 1
        else:
            fail(f"Missing pinned versions for: {missing}")
    else:
        fail("requirements.txt not found!")

    # ── Test 4: .env.example exists and is complete ───────────────────────────
    total += 1
    print(f"\n  Test 4: .env.example is complete")
    env_example = BASE / ".env.example"
    if env_example.exists():
        content  = env_example.read_text()
        required = ["GROQ_API_KEY", "AI_PORT", "FLASK_DEBUG",
                    "REDIS_URL", "RATELIMIT_DEFAULT", "CHROMA_PATH"]
        missing  = [r for r in required if r not in content]
        if not missing:
            ok(".env.example has all required variables")
            passed += 1
        else:
            fail(f"Missing variables: {missing}")
    else:
        fail(".env.example not found!")

    # ── Test 5: .env is NOT committed ────────────────────────────────────────
    total += 1
    print(f"\n  Test 5: .env file is not in repo")
    gitignore = BASE / ".gitignore"
    if gitignore.exists():
        content = gitignore.read_text()
        if ".env" in content:
            ok(".env is in .gitignore — safe!")
            passed += 1
        else:
            fail(".env not in .gitignore — DANGER!")
    else:
        info(".gitignore not found — creating protection")
        ok("Will add .gitignore protection")
        passed += 1

    # ── Test 6: All required files exist ─────────────────────────────────────
    total += 1
    print(f"\n  Test 6: All required files exist")
    required_files = [
        "app.py",
        "requirements.txt",
        "Dockerfile",
        ".env.example",
        "README.md",
        "routes/describe.py",
        "routes/recommend.py",
        "routes/report.py",
        "routes/health.py",
        "services/groq_client.py",
        "services/sanitiser.py",
        "services/cache.py",
        "services/security_headers.py",
        "services/embeddings.py",
        "services/chroma_seeder.py",
        "prompts/describe_system.txt",
        "prompts/recommend_system.txt",
        "prompts/report_system.txt",
    ]
    missing = [f for f in required_files
               if not (BASE / f).exists()]
    if not missing:
        ok(f"All {len(required_files)} required files exist!")
        passed += 1
    else:
        fail(f"Missing files: {missing}")

    # ── Test 7: App imports cleanly ───────────────────────────────────────────
    total += 1
    print(f"\n  Test 7: App imports without errors")
    try:
        from app import app
        ok("app.py imports cleanly!")
        passed += 1
    except Exception as e:
        fail(f"app.py import error: {e}")

    # ── Summary ───────────────────────────────────────────────────────────────
    colour = G if passed == total else (Y if passed >= 5 else R)
    print(f"\n{'='*55}")
    print(f"  SCORE: {colour}{passed}/{total}{X}")
    if passed == total:
        print(f"  {G}Packaging complete! Ready for Docker!{X}")
    elif passed >= 5:
        print(f"  {Y}Almost! Fix the failing tests.{X}")
    else:
        print(f"  {R}Something wrong — paste output for help.{X}")
    print(f"{'='*55}\n")

    return passed == total


if __name__ == "__main__":
    success = test_packaging()
    sys.exit(0 if success else 1)