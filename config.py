from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    # DB 연결 정보
    DATABASE_URL: str = "postgresql+psycopg2://dbmasteruser:Hallym01%5E@ls-ec7b7415987c22ce317ca541f4744888bf08708c.cniw28i2sxpr.ap-northeast-2.rds.amazonaws.com:5432/gamsa_db"
    
    # S3 관련 설정 (.env에서 자동 로드)
    aws_access_key_id: str = Field(alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: str = Field(alias="AWS_SECRET_ACCESS_KEY")
    aws_default_region: str = Field(alias="AWS_DEFAULT_REGION")
    s3_bucket_name: str = Field(alias="S3_BUCKET_NAME")

    # 설정파일
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )

settings = Settings()
