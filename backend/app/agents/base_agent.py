from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from ..core.siliconflow import siliconflow_client
import structlog

logger = structlog.get_logger()

class BaseAgent(ABC):
    """智能体基类"""
    
    def __init__(self, name: str, role_description: str):
        self.name = name
        self.role_description = role_description
        self.client = siliconflow_client
    
    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """处理输入数据并返回结果"""
        pass
    
    async def generate_response(
        self, 
        system_prompt: str, 
        user_message: str, 
        temperature: float = 0.7
    ) -> str:
        """生成AI回复的通用方法"""
        try:
            response = await self.client.generate_response(
                system_prompt, 
                user_message, 
                temperature
            )
            logger.info(f"{self.name} 生成回复", length=len(response))
            return response
        except Exception as e:
            logger.error(f"{self.name} 生成回复失败", error=str(e))
            raise
    
    def get_base_system_prompt(self) -> str:
        """获取基础系统提示词"""
        return f"""你是{self.name}，{self.role_description}
        
请始终保持专业、友好的态度，提供有价值的建议和反馈。
你的回复应该准确、有建设性，并且符合面试场景的需求。"""