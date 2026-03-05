from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = 'WOLFz API'
    APP_ENV: str = 'development'
    API_V1_PREFIX: str = '/api/v1'
    AUTO_CREATE_TABLES: bool = True

    SECRET_KEY: str = 'change_me'
    ALGORITHM: str = 'HS256'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    DATABASE_URL: str = 'sqlite:///./wolfz.db'
    REDIS_URL: str = 'redis://localhost:6379/0'
    BACKEND_CORS_ORIGINS: str = 'http://localhost:5173,http://127.0.0.1:5173'
    ENABLE_GZIP: bool = True
    GZIP_MINIMUM_SIZE: int = 1024
    PRODUCTS_CACHE_MAX_AGE_SECONDS: int = 60

    model_config = SettingsConfigDict(env_file='.env', case_sensitive=True)

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(',') if origin.strip()]


settings = Settings()
