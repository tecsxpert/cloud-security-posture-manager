 OWASP ZAP Security Scan

1 Findings
Server leaks version information via HTTP response header

2 Actions Taken

Added custom Server header handling in app.py
Re-scanned backend using OWASP ZAP

3 Notes

Flask development server may still expose Werkzeug server details in local environment.
Additional hardening can be done in production deployment using Gunicorn or Nginx.
