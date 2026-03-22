from fastapi import Request, HTTPException
import time

RATE_LIMIT = 10  # requests
WINDOW = 60  # seconds

requests_log = {}

async def rate_limiter(request: Request):
    ip = request.client.host
    now = time.time()

    if ip not in requests_log:
        requests_log[ip] = []

    requests_log[ip] = [t for t in requests_log[ip] if now - t < WINDOW]

    if len(requests_log[ip]) >= RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests")

    requests_log[ip].append(now)
