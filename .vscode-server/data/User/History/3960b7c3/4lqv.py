from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # DATABASE_URL: str
    DATABASE_URL="sqlite:///./gamsa.db"
    class Config:
        env_file = ".env"


settings = Settings()
