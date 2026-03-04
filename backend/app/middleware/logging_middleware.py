import logging
import time

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = logging.getLogger("topinvestment")


class LoggingMiddleware(BaseHTTPMiddleware):
    """Log every incoming request and the time it takes to respond."""

    async def dispatch(self, request: Request, call_next) -> Response:
        start = time.perf_counter()
        logger.info("%s %s", request.method, request.url.path)

        response: Response = await call_next(request)

        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            "%s %s → %s (%.1f ms)",
            request.method,
            request.url.path,
            response.status_code,
            elapsed_ms,
        )
        return response
