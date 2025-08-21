from pydantic_settings import BaseSettings
from typing import Optional
import os
from pathlib import Path
from dotenv import load_dotenv

# 手动加载.env文件
env_path = Path(__file__).parent.parent.parent.parent / ".env"
load_dotenv(env_path)

class Settings(BaseSettings):
    # API Keys
    SILICONFLOW_API_KEY: str = os.getenv("SILICONFLOW_API_KEY", "")
    OPENAI_API_KEY: Optional[str] = None
    TAVILY_API_KEY: Optional[str] = None
    SERPAPI_KEY: Optional[str] = None
    
    # Server Settings
    API_HOST: str = "0.0.0.0"
    API_PORT: int = 8000
    DEBUG: bool = True
    
    # CORS Settings
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"]
    
    # Database
    DATABASE_URL: str = "sqlite:///./interview_system.db"
    
    # File Upload
    UPLOAD_DIR: str = "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS: set = {".pdf", ".doc", ".docx"}
    
    # SiliconFlow API
    SILICONFLOW_BASE_URL: str = "https://api.siliconflow.cn/v1"
    SILICONFLOW_MODEL: str = "deepseek-ai/DeepSeek-V2.5"
    
    # Interview Settings
    MAX_QUESTIONS: int = 10
    DEFAULT_INTERVIEW_DURATION: int = 3600  # 1 hour in seconds
    
    class Config:
        env_file = str(Path(__file__).parent.parent.parent / ".env")
        env_file_encoding = "utf-8"

# 创建配置实例
settings = Settings()

# 确保上传目录存在
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(exist_ok=True)