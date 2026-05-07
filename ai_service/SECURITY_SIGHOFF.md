# OWASP ZAP Security Scan

## Findings

* Server leaks version information via HTTP response header

### Actions Taken

* Added custom Server header handling in app.py
* Re-scanned backend using OWASP ZAP

### Security Measures Present

* Input validation
* Prompt injection rejection
* Rate limiting using Flask-Limiter
* Security headers applied

##### Notes

* Flask development server may still expose Werkzeug details during local development.
* Production deployment can use Gunicorn or Nginx for stronger hardening.
