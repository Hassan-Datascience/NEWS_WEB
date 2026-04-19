"""
Application configuration using pydantic-settings.
All values are read from environment variables or .env file.
"""
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # NewsAPI
    news_api_key: str = Field(..., env="NEWS_API_KEY")

    # MongoDB
    mongodb_url: str = Field(..., env="MONGODB_URL")
    db_name: str = Field(default="market_intelligence", env="DB_NAME")

    # App
    environment: str = Field(default="development", env="ENVIRONMENT")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")

    # NewsAPI endpoint
    news_api_base_url: str = "https://newsapi.org/v2"

    # Default categories to fetch
    default_categories: list[str] = ["business", "technology", "science"]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
