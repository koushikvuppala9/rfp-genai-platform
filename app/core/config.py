from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "RFP GenAI"
    env: str = "local"
    log_level: str = "INFO"

    postgres_dsn: str
    mongo_uri: str
    mongo_db_name: str

    redis_url: str

    class Config:
        env_file = ".env"


settings = Settings()

