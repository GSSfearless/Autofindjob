# AI面试系统 - 多代理协同项目

## 🎯 项目概述

这是一个基于多代理AI架构的智能面试系统，能够进行智能技术面试，为求职者提供真实的面试体验。

### 核心特性

- 🤖 **多代理AI系统**：四个专业代理协同工作
- 🎨 **现代化前端**：React + TypeScript + shadcn/ui
- ⚡ **实时通信**：WebSocket/SSE实时面试体验
- 📊 **智能评估**：多维度评估算法
- 🔄 **模块化设计**：易于维护和扩展

## 🏗️ 系统架构

### 前端架构
- **React 18** + **TypeScript** - 现代化前端框架
- **Vite** - 快速构建工具
- **Tailwind CSS** - 实用优先的CSS框架
- **shadcn/ui** - 高质量UI组件库
- **React Router** - 客户端路由

### 后端架构
- **FastAPI** - 高性能Python Web框架
- **多代理系统** - 模块化AI代理架构
- **WebSocket/SSE** - 实时通信
- **Pydantic** - 数据验证和序列化

### 多代理系统

#### 1. InterviewerAgent (面试官代理)
- **职责**：生成上下文相关的面试问题
- **功能**：根据简历和职位描述生成个性化问题
- **技术实现**：基于LLM的问题生成算法

#### 2. TopicManagerAgent (话题管理代理)
- **职责**：控制面试话题的流转和深度
- **功能**：确保面试话题的自然转换
- **技术实现**：话题状态机和转换逻辑

#### 3. EvaluatorAgent (评估代理)
- **职责**：实时评估候选人的回答质量
- **功能**：提供详细的评分和反馈
- **技术实现**：多维度评估算法

#### 4. OrchestratorAgent (协调代理)
- **职责**：协调所有代理的工作流程
- **功能**：管理面试会话状态和代理间通信
- **技术实现**：状态管理和事件驱动架构

## 🚀 快速开始

### 环境要求
- Node.js 18+
- Python 3.8+
- npm 或 yarn

### 安装依赖

#### 前端
```bash
npm install
```

#### 后端
```bash
cd backend
pip install -r requirements.txt
```

### 启动服务

#### 启动后端服务
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 启动前端服务
```bash
npm run dev
```

### 访问应用
- 前端应用：http://localhost:5173
- 后端API：http://localhost:8000
- API文档：http://localhost:8000/docs

## 🧪 测试和演示

### 运行Agent系统测试
```bash
cd backend
python test_agents.py
```

### 访问Agent协同演示
访问 http://localhost:5173/agent-demo 查看多代理协同工作的可视化演示。

### 测试结果示例
```
🚀 开始运行Agent系统测试...

🧪 测试 InterviewerAgent...
✅ InterviewerAgent 测试通过
   生成问题: 请介绍一下您的技术背景和经验？

🧪 测试 TopicManagerAgent...
✅ TopicManagerAgent 测试通过
   当前话题: 技术背景

🧪 测试 EvaluatorAgent...
✅ EvaluatorAgent 测试通过
   评分: 100/100
   反馈: 回答详细，展现了良好的技术理解能力

🧪 测试 OrchestratorAgent...
✅ OrchestratorAgent 开始面试测试通过
   会话ID: test-session-001
   问题: 请介绍一下您的技术背景和经验？
   话题: 技术背景
   使用代理: InterviewerAgent, TopicManagerAgent

🎉 所有测试通过！Agent系统运行正常。
```

## 📁 项目结构

```
Autofindjob/
├── backend/                 # 后端服务
│   ├── app/
│   │   ├── main.py         # FastAPI主应用
│   │   ├── agents/         # 代理系统
│   │   ├── api/           # API路由
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据模型
│   │   └── services/      # 业务服务
│   ├── test_agents.py     # Agent系统测试
│   └── requirements.txt   # Python依赖
├── src/                    # 前端源码
│   ├── components/        # React组件
│   │   ├── AgentDemo.tsx  # Agent演示组件
│   │   └── ui/           # UI组件库
│   ├── pages/            # 页面组件
│   │   └── AgentDemo.tsx # Agent演示页面
│   └── App.tsx           # 主应用组件
├── docs/                  # 项目文档
│   ├── Core Requirements.txt
│   ├── Objective.txt
│   └── Video_Demo_Script.md
└── README.md
```

## 🎬 视频演示

项目包含完整的视频演示脚本，位于 `docs/Video_Demo_Script.md`，用于录制项目讲解视频。

### 演示要点
1. **项目概述** - 系统架构和技术栈
2. **多代理系统详解** - 四个代理的职责和协同
3. **Agent协同演示** - 实时可视化演示
4. **技术实现细节** - 关键代码展示
5. **测试和验证** - 系统测试运行

## 🔧 API接口

### 代理信息
```http
GET /api/agents/info
```

### 面试流程
```http
POST /api/interview/start
POST /api/interview/response?session_id={id}&response={text}
POST /api/interview/end?session_id={id}
```

### 流式面试
```http
GET /api/interview/stream/{session_id}
```

### 文件上传
```http
POST /api/upload/resume
POST /api/upload/job-description
```

## 🎯 核心功能

### 1. 智能问题生成
- 基于简历和职位描述生成个性化问题
- 上下文感知的问题序列
- 动态调整问题难度

### 2. 话题管理
- 自然的话题流转
- 深度控制机制
- 话题相关性保证

### 3. 实时评估
- 多维度评分算法
- 即时反馈机制
- 详细评估报告

### 4. 协同工作
- 代理间状态同步
- 事件驱动架构
- 容错和恢复机制

## 🚀 部署

### 开发环境
```bash
# 前端
npm run dev

# 后端
python -m uvicorn app.main:app --reload
```

### 生产环境
```bash
# 前端构建
npm run build

# 后端部署
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 🤝 贡献

欢迎提交Issue和Pull Request来改进项目。

## 📄 许可证

MIT License

## 📞 联系方式

如有问题，请通过GitHub Issues联系。
