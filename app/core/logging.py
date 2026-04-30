import logging

from app.core.config import settings


def setup_logging():
    logging.basicConfig(
        level=getattr(logging, settings.log_level.upper(), "INFO"),
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )

    logger = logging.getLogger("app")
    logger.info(f"Starting {settings.app_name} in {settings.env} environment")

    return logger

