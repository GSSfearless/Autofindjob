#!/usr/bin/env python3
import json
from pathlib import Path
import sys

def show_debug_log():
    log_file = Path("backend/debug_errors.json")
    
    if not log_file.exists():
        print("❌ 调试日志文件不存在")
        return
    
    try:
        with open(log_file, 'r', encoding='utf-8') as f:
            logs = json.load(f)
        
        if not logs:
            print("📋 暂无调试日志")
            return
        
        print(f"📊 共有 {len(logs)} 条调试日志\n")
        
        for i, log in enumerate(logs[-10:], 1):  # 显示最近10条
            print(f"🔍 日志 #{i}")
            print(f"   时间: {log['timestamp']}")
            print(f"   类型: {log['error_type']}")
            print(f"   错误: {log['error_message']}")
            
            if log.get('request_data'):
                req = log['request_data']
                print(f"   请求: {req.get('model', 'N/A')} - {len(req.get('messages', []))} 条消息")
                if req.get('messages'):
                    first_msg = req['messages'][0]
                    content_preview = first_msg.get('content', '')[:100]
                    print(f"   内容预览: {content_preview}...")
            
            if log.get('response_data') and log['error_type'] != 'SUCCESS':
                resp = log['response_data']
                if isinstance(resp, dict) and 'status_code' in resp:
                    print(f"   响应状态: {resp['status_code']}")
                    if resp.get('response_text'):
                        print(f"   响应内容: {resp['response_text'][:200]}...")
            
            print("-" * 50)
    
    except Exception as e:
        print(f"❌ 读取日志失败: {e}")

if __name__ == "__main__":
    show_debug_log()