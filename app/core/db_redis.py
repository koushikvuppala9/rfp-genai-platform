import redis

from app.core.config import settings

redis_client = redis.from_url(settings.redis_url)


def check_redis():
    redis_client.ping()
    return True
