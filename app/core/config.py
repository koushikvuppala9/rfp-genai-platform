from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "RFP GenAI"
    env: str = "local"
    log_level: str = "INFO"

    postgres_dsn: str
    mongo_uri: str
    mongo_db_name: str

    redis_url: str

    gmail_sender: str | None = None
    gmail_app_password: str | None = None

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
