from pydantic_settings import BaseSettings
from pydantic import validator
import os
from functools import lru_cache
from enum import Enum
from typing import List
from .logging_config import setup_logging

logger = setup_logging()

class DatabaseType(str, Enum):
    SQLITE = "sqlite"
    MYSQL = "mysql"
    POSTGRES = "postgres"

class Settings(BaseSettings):
    # Gemini Configuration
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
    
    # Database Type
    DB_TYPE: DatabaseType = DatabaseType(os.getenv("DB_TYPE", "sqlite"))
    
    # MySQL Configuration
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "")
    MYSQL_DATABASE: str = os.getenv("MYSQL_DATABASE", "travel_queries")
    MYSQL_DRIVER: str = os.getenv("MYSQL_DRIVER", "pymysql")
    
    # PostgreSQL Configuration
    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", "5432"))
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "")
    POSTGRES_DATABASE: str = os.getenv("POSTGRES_DATABASE", "travel_queries")
    POSTGRES_SSL_MODE: str = os.getenv("POSTGRES_SSL_MODE", "prefer")
    
    # Server Configuration
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # CORS Configuration
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
    
    @property
    def allowed_origins_list(self) -> List[str]:
        """Convert ALLOWED_ORIGINS string to list."""
        return self.ALLOWED_ORIGINS.split(",")
    
    @property
    def DATABASE_URL(self) -> str:
        if self.DB_TYPE == DatabaseType.SQLITE:
            return f"sqlite:///./travel_queries.db"
        elif self.DB_TYPE == DatabaseType.MYSQL:
            return f"mysql+{self.MYSQL_DRIVER}://{self.MYSQL_USER}:{self.MYSQL_PASSWORD}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DATABASE}"
        elif self.DB_TYPE == DatabaseType.POSTGRES:
            return f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DATABASE}?sslmode={self.POSTGRES_SSL_MODE}"
        else:
            raise ValueError(f"Unsupported database type: {self.DB_TYPE}")
    
    class Config:
        env_file = ".env"
        case_sensitive = True

@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    logger.info("Loading application settings")
    return Settings() 