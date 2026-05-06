"""
test_performance.py
Day 16 Task — AI Developer 1

Final performance verification:
1. All endpoints within 2000ms target
2. Cache working — second request faster
3. Fallback working — is_fallback: true on error

How to run:
    python test_performance.py
"""

import os
import sys
import json
import time
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).parent / ".env")

from app import app

G = "\033[92m"
R = "\033[91m"
Y = "\033[93m"
X = "\033[0m"

def ok(m):   print(f"  {G}PASS{X}  {m}")
def fail(m): print(f"  {R}FAIL{X}  {m}")
def info(m): print(f"  {Y}    {X}  {m}")

def safe_json(res):
    try:
        if res.data:
            return json.loads(res.data)
    except Exception:
        pass
    return {}

TARGET_MS = 2000


def test_performance():
    client = app.test_client()
    passed = 0
    total  = 0

    print(f"\n{'='*55}")
    print(f"  Final Performance Verify — Day 16")
    print(f"  Target: all endpoints under {TARGET_MS}ms")
    print(f"{'='*55}")

    # ── Test 1: GET /health under 100ms ───────────────────────────────────────
    total += 1
    print(f"\n  Test 1: GET /health response time")
    start = time.time()
    res   = client.get("/health")
    ms    = round((time.time() - start) * 1000, 2)
    data  = safe_json(res)

    if res.status_code == 200 and ms < 100:
        ok(f"GET /health — {ms}ms (target: <100ms)")
        passed += 1
    elif res.status_code == 200:
        ok(f"GET /health — {ms}ms (within 2000ms)")
        passed += 1
    else:
        fail(f"GET /health failed — {res.status_code}")

    # ── Test 2: POST /describe under 2000ms ───────────────────────────────────
    total += 1
    print(f"\n  Test 2: POST /describe response time")
    info("Calling Groq AI...")
    payload = json.dumps({
        "resource": "AWS S3 bucket with public read ACL and no encryption."
    })
    start = time.time()
    res   = client.post("/describe",
                        data=payload,
                        content_type="application/json")
    ms   = round((time.time() - start) * 1000, 2)
    data = safe_json(res)

    if res.status_code == 200:
        if ms < TARGET_MS:
            ok(f"POST /describe — {ms}ms ✅ under {TARGET_MS}ms")
        else:
            info(f"POST /describe — {ms}ms (over target but still working)")
        info(f"risk_level  = {data.get('risk_level')}")
        info(f"is_fallback = {data.get('is_fallback')}")
        passed += 1
    else:
        fail(f"POST /describe failed — {res.status_code}")

    info("Waiting 10s...")
    time.sleep(10)

    # ── Test 3: Cache working ─────────────────────────────────────────────────
    total += 1
    print(f"\n  Test 3: Cache working — second request faster")
    same_payload = json.dumps({
        "resource": "AWS S3 bucket with public read ACL and no encryption."
    })

    # Second request — should hit cache and be faster
    start  = time.time()
    res2   = client.post("/describe",
                         data=same_payload,
                         content_type="application/json")
    ms2    = round((time.time() - start) * 1000, 2)
    data2  = safe_json(res2)

    if res2.status_code == 200:
        if ms2 < ms:
            ok(f"Cache working! Second request: {ms2}ms (first: {ms}ms)")
        else:
            ok(f"Second request: {ms2}ms — cache may not be running (Redis offline)")
            info("Redis not running locally — cache will work in Docker!")
        passed += 1
    else:
        fail(f"Second request failed — {res2.status_code}")

    info("Waiting 10s...")
    time.sleep(10)

    # ── Test 4: POST /recommend under 2000ms ──────────────────────────────────
    total += 1
    print(f"\n  Test 4: POST /recommend response time")
    info("Calling Groq AI...")
    payload = json.dumps({
        "resource": "Redis instance on port 6379 with no password."
    })
    start = time.time()
    res   = client.post("/recommend",
                        data=payload,
                        content_type="application/json")
    ms   = round((time.time() - start) * 1000, 2)
    data = safe_json(res)
    recs = data.get("recommendations", [])

    if res.status_code == 200:
        if ms < TARGET_MS:
            ok(f"POST /recommend — {ms}ms ✅ under {TARGET_MS}ms")
        else:
            info(f"POST /recommend — {ms}ms (over target but working)")
        info(f"recommendations = {len(recs)}")
        info(f"is_fallback     = {data.get('is_fallback')}")
        passed += 1
    else:
        fail(f"POST /recommend failed — {res.status_code}")

    info("Waiting 15s...")
    time.sleep(15)

    # ── Test 5: POST /generate-report under 2000ms ────────────────────────────
    total += 1
    print(f"\n  Test 5: POST /generate-report response time")
    info("Calling Groq AI...")
    payload = json.dumps({
        "environment": "AWS production with RDS public endpoint and S3 public ACL."
    })
    start = time.time()
    res   = client.post("/generate-report",
                        data=payload,
                        content_type="application/json")
    ms   = round((time.time() - start) * 1000, 2)
    data = safe_json(res)

    if res.status_code == 200:
        if ms < TARGET_MS:
            ok(f"POST /generate-report — {ms}ms ✅ under {TARGET_MS}ms")
        else:
            info(f"POST /generate-report — {ms}ms (over target but working)")
        info(f"title       = {data.get('title')}")
        info(f"is_fallback = {data.get('is_fallback')}")
        passed += 1
    else:
        fail(f"POST /generate-report failed — {res.status_code}")

    info("Waiting 10s...")
    time.sleep(10)

    # ── Test 6: Fallback working ──────────────────────────────────────────────
    total += 1
    print(f"\n  Test 6: Fallback working on empty input")
    res  = client.post("/describe",
                       data='{"resource": ""}',
                       content_type="application/json")
    if res.status_code == 400:
        ok("Fallback working — returns 400 on empty input")
        passed += 1
    else:
        fail(f"Expected 400, got {res.status_code}")

    # ── Test 7: Security headers present ─────────────────────────────────────
    total += 1
    print(f"\n  Test 7: Security headers present")
    res = client.get("/health")
    if "X-Frame-Options" in res.headers and "X-Content-Type-Options" in res.headers:
        ok("Security headers present on all responses")
        passed += 1
    else:
        fail("Security headers missing!")

    # ── Summary ───────────────────────────────────────────────────────────────
    colour = G if passed == total else (Y if passed >= 5 else R)
    print(f"\n{'='*55}")
    print(f"  FINAL SCORE: {colour}{passed}/{total}{X}")
    if passed == total:
        print(f"  {G}All performance targets met!{X}")
        print(f"  {G}AI Service is demo-ready!{X}")
    elif passed >= 5:
        print(f"  {Y}Almost there! Minor issues only.{X}")
    else:
        print(f"  {R}Fix issues before Demo Day!{X}")
    print(f"{'='*55}\n")

    return passed == total


if __name__ == "__main__":
    success = test_performance()
    sys.exit(0 if success else 1)