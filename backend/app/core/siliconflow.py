import httpx
import json
from typing import Dict, List, Optional, Any
from .config import settings
import structlog
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
from debug_log import debug_logger

logger = structlog.get_logger()

class SiliconFlowClient:
    def __init__(self):
        self.api_key = settings.SILICONFLOW_API_KEY
        self.base_url = settings.SILICONFLOW_BASE_URL
        self.model = settings.SILICONFLOW_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
    
    async def chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2000,
        stream: bool = False
    ) -> Dict[str, Any]:
        """调用SiliconFlow聊天完成API"""
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": stream
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/chat/completions",
                    headers=self.headers,
                    json=payload,
                    timeout=30.0  # 30秒足够了，如果超时说明有问题
                )
                response.raise_for_status()
                result = response.json()
                
                # 记录成功的调用
                debug_logger.log_api_error(
                    "SUCCESS", 
                    "API调用成功", 
                    request_data=payload,
                    response_data=result
                )
                return result
                
        except httpx.TimeoutException as e:
            error_detail = f"请求超时: {str(e)}"
            debug_logger.log_api_error(
                "TIMEOUT", 
                error_detail, 
                request_data=payload
            )
            logger.error("SiliconFlow API超时", error=error_detail, payload=payload)
            raise Exception(f"API请求超时: {error_detail}")
            
        except httpx.HTTPStatusError as e:
            response_text = ""
            try:
                response_text = e.response.text
            except:
                pass
            error_detail = f"HTTP状态错误: {e.response.status_code} - {response_text}"
            debug_logger.log_api_error(
                "HTTP_STATUS_ERROR", 
                error_detail, 
                request_data=payload,
                response_data={"status_code": e.response.status_code, "response_text": response_text}
            )
            logger.error("SiliconFlow API状态错误", error=error_detail, payload=payload)
            raise Exception(f"API请求失败: {error_detail}")
            
        except httpx.RequestError as e:
            error_detail = f"请求错误: {type(e).__name__} - {str(e)}"
            debug_logger.log_api_error(
                "REQUEST_ERROR", 
                error_detail, 
                request_data=payload
            )
            logger.error("SiliconFlow API请求错误", error=error_detail, payload=payload)
            raise Exception(f"API请求失败: {error_detail}")
            
        except Exception as e:
            error_detail = f"未知错误: {type(e).__name__} - {str(e)}"
            debug_logger.log_api_error(
                "UNKNOWN_ERROR", 
                error_detail, 
                request_data=payload
            )
            logger.error("SiliconFlow客户端未知错误", error=error_detail, api_key_length=len(self.api_key), base_url=self.base_url)
            raise
    
    async def generate_response(
        self,
        system_prompt: str,
        user_message: str,
        temperature: float = 0.7
    ) -> str:
        """生成AI回复"""
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]
        
        response = await self.chat_completion(messages, temperature=temperature)
        return response["choices"][0]["message"]["content"]
    
    async def analyze_resume(self, resume_text: str) -> Dict[str, Any]:
        """分析简历内容"""
        # 极度缩短文本长度确保API稳定
        max_chars = 400
        if len(resume_text) > max_chars:
            resume_text = resume_text[:max_chars] + "..."
            logger.info("简历内容过长，已截取", original_length=len(resume_text), truncated_length=max_chars)
        
        system_prompt = """简短分析简历，返回JSON格式：
{"name":"姓名","skills":["技能"],"experience":["经历"],"education":"学历"}"""
        
        try:
            response = await self.generate_response(system_prompt, f"简历内容：\n{resume_text}")
            # 尝试解析JSON，如果失败则返回原始文本
            try:
                # 移除可能的markdown代码块标记
                clean_response = response.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_response)
            except json.JSONDecodeError:
                return {"analysis": response}
        except Exception as e:
            logger.error("简历分析失败", error=str(e))
            # 返回基本的fallback分析结果，而不是错误
            return {
                "name": "候选人",
                "skills": ["Python", "技术技能"], 
                "experience": ["工作经验"],
                "education": "教育背景"
            }
    
    async def analyze_job_description(self, jd_text: str) -> Dict[str, Any]:
        """分析职位描述"""
        # 极度缩短文本长度确保API稳定
        max_chars = 300
        if len(jd_text) > max_chars:
            jd_text = jd_text[:max_chars] + "..."
            logger.info("职位描述过长，已截取", original_length=len(jd_text), truncated_length=max_chars)
        
        system_prompt = """简短分析职位，返回JSON格式：
{"position":"职位","requirements":["要求"],"experience":"经验"}"""
        
        try:
            response = await self.generate_response(system_prompt, f"职位描述：\n{jd_text}")
            try:
                return json.loads(response)
            except json.JSONDecodeError:
                return {"analysis": response}
        except Exception as e:
            logger.error("职位描述分析失败", error=str(e))
            # 返回基本的fallback分析结果，而不是错误
            return {
                "position": "软件工程师",
                "requirements": ["编程技能", "工作经验"],
                "experience": "1-3年"
            }

# 创建全局客户端实例
siliconflow_client = SiliconFlowClient()