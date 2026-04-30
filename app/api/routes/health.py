from fastapi import APIRouter

from app.core.config import settings
from app.core.db_mongo import check_mongo
from app.core.db_postgres import check_postgres
from app.core.db_redis import check_redis

router = APIRouter()


@router.get("/health")
def health_check():
    checks = {
        "postgres": "ok",
        "mongo": "ok",
        "redis": "ok",
    }

    try:
        check_postgres()
    except Exception:
        checks["postgres"] = "failed"

    try:
        check_mongo()
    except Exception:
        checks["mongo"] = "failed"

    try:
        check_redis()
    except Exception:
        checks["redis"] = "failed"

    overall_status = "ok" if all(v == "ok" for v in checks.values()) else "degraded"

    return {
        "status": overall_status,
        "app": settings.app_name,
        "env": settings.env,
        "checks": checks,
    }
