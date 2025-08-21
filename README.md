# AI智能面试系统 (Autofindjob)

🚀 基于多智能体架构的AI驱动技术面试系统，为求职者提供个性化的模拟面试体验。

## 🎯 项目概述

本系统是一个生产级的AI面试平台，能够：

- 📄 **智能简历分析**: 自动解析PDF/Word简历，提取关键信息
- 💼 **职位匹配**: 分析职位描述，匹配相关技能和经验要求  
- 🤖 **动态问题生成**: 根据候选人背景和职位要求生成个性化面试问题
- ⚡ **实时评估反馈**: AI智能评估回答质量，提供即时反馈和改进建议
- 🎥 **沉浸式面试体验**: 现代化界面支持音频/视频交互

## 🏗️ 系统架构

### 后端 (Python + FastAPI)
```
backend/
├── app/
│   ├── agents/              # 4个核心智能体
│   │   ├── interviewer_agent.py      # 面试官 - 生成问题
│   │   ├── evaluator_agent.py        # 评估师 - 评估回答
│   │   ├── topic_manager_agent.py    # 话题管理 - 控制流程
│   │   └── orchestrator_agent.py     # 协调器 - 统筹管理
│   ├── api/                 # REST API接口
│   ├── core/                # 核心配置和服务
│   ├── models/              # 数据模型
│   └── services/            # 业务逻辑服务
└── main.py                  # FastAPI应用入口
```

### 前端 (React + TypeScript)
```
src/
├── components/              # UI组件
├── pages/                   # 页面组件
├── services/                # API服务
├── hooks/                   # React Hooks
└── types/                   # TypeScript类型定义
```

## 🔧 技术栈

### 后端技术
- **FastAPI**: 高性能异步API框架
- **SiliconFlow API**: LLM服务提供商
- **Python**: 多智能体系统实现
- **WebSocket**: 实时通信
- **SQLAlchemy**: 数据库ORM
- **Pydantic**: 数据验证
- **Structlog**: 结构化日志

### 前端技术  
- **React 18**: 用户界面框架
- **TypeScript**: 类型安全开发
- **Vite**: 构建工具
- **Tailwind CSS**: 样式框架
- **Shadcn/ui**: 组件库
- **React Router**: 路由管理

### AI集成
- **SiliconFlow API**: 主要LLM服务
- **DeepSeek-V2.5**: 默认模型
- **文档解析**: PyPDF2 + pdfplumber + python-docx

## 🚀 快速开始

### 1. 环境要求
- Python 3.8+
- Node.js 16+
- npm/yarn

### 2. 初始化系统
```bash
# 克隆项目
git clone <repository-url>
cd Autofindjob

# 运行初始化脚本
chmod +x setup.sh
./setup.sh
```

### 3. 配置API密钥
在项目根目录的 `.env` 文件中配置：
```bash
# SiliconFlow API Key (必需)
SILICONFLOW_API_KEY=your_siliconflow_key

# 其他可选API密钥
OPENAI_API_KEY=your_openai_key
TAVILY_API_KEY=your_tavily_key
SERPAPI_KEY=your_serpapi_key
```

### 4. 启动系统
```bash
# 一键启动前后端服务
chmod +x start_system.sh
./start_system.sh
```

## 🌐 访问地址

启动成功后，访问以下地址：

- **前端界面**: http://localhost:8080
- **后端API**: http://localhost:8000  
- **API文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

## 📱 使用流程

1. **上传简历**: 支持PDF、Word格式文件上传
2. **填写职位描述**: 输入目标职位的详细要求
3. **AI分析处理**: 系统自动分析简历和职位匹配度
4. **开始面试**: 进入AI面试间，回答个性化问题
5. **实时反馈**: 获得即时评估和改进建议
6. **查看报告**: 面试结束后查看详细评估报告

## 🤖 核心智能体

### 1. InterviewerAgent (面试官)
- 根据候选人背景生成相关问题
- 支持技术、行为、情境、经验四种问题类型
- 考虑问题难度递进和逻辑关联

### 2. EvaluatorAgent (评估师)  
- 实时评估回答质量(1-10分)
- 分析内容完整性、技术准确性、表达清晰度
- 提供具体改进建议和亮点总结

### 3. TopicManagerAgent (话题管理器)
- 控制面试话题深度和转换
- 智能判断是否需要追问或深入
- 管理面试节奏和流程控制

### 4. OrchestratorAgent (协调器)
- 统筹管理整个面试流程
- 协调各智能体协作
- 处理会话状态和数据流转

## 📊 API接口

### 上传接口
- `POST /api/upload/resume` - 上传简历和职位描述
- `POST /api/upload/analyze-text` - 仅分析职位描述

### 面试接口  
- `POST /api/interview/create-session` - 创建面试会话
- `POST /api/interview/start` - 开始面试
- `POST /api/interview/submit-answer` - 提交答案
- `POST /api/interview/next-question` - 获取下一问题
- `POST /api/interview/finish` - 完成面试
- `WebSocket /api/interview/ws/{session_id}` - 实时通信

## 🛠️ 开发指南

### 后端开发
```bash
# 激活虚拟环境
source backend_venv/bin/activate

# 安装开发依赖
pip install -r backend/requirements.txt

# 启动开发服务器
cd backend && python main.py
```

### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 📈 性能特性

- **异步处理**: FastAPI异步架构，高并发支持
- **实时通信**: WebSocket双向通信，低延迟反馈
- **智能缓存**: 合理的缓存策略，减少API调用
- **错误处理**: 完善的异常处理和降级机制
- **日志监控**: 结构化日志，便于问题排查

## 🔒 安全特性

- **输入验证**: Pydantic严格数据验证
- **文件安全**: 文件类型和大小限制
- **API限流**: 防止恶意请求
- **密钥管理**: 环境变量安全存储
- **CORS配置**: 跨域请求安全控制

## 🚦 系统状态

- ✅ **后端框架**: 完成 - FastAPI + 多智能体架构
- ✅ **前端界面**: 完成 - React + TypeScript
- ✅ **AI集成**: 完成 - SiliconFlow API
- ✅ **文件处理**: 完成 - PDF/Word解析
- ✅ **实时通信**: 完成 - WebSocket
- ✅ **错误处理**: 完成 - 完善的异常机制
- ✅ **部署脚本**: 完成 - 一键启动脚本

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [SiliconFlow](https://siliconflow.cn/) - 提供优质的LLM API服务
- [FastAPI](https://fastapi.tiangolo.com/) - 出色的Python Web框架
- [React](https://reactjs.org/) - 强大的前端框架
- [Shadcn/ui](https://ui.shadcn.com/) - 美观的组件库

---

💼 **这个项目对我非常重要，它关系到我的生存发展。如果你觉得这个项目有价值，请给个⭐️支持一下！**