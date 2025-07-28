from pydantic_settings import BaseSettings, SettingsConfigDict



class Settings(BaseSettings):
    # DATABASE_URL: str
    DATABASE_URL: str ="sqlite:///./gamsa.db"
    # class Config:
    #     env_file = ".env"
    #     env_file_encoding = "utf-8"
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()
