import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MessageSquare, 
  Brain, 
  Target, 
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AgentInfo {
  name: string;
  role: string;
  status: 'active' | 'idle' | 'processing';
}

interface InterviewStep {
  timestamp: string;
  action: string;
  question?: string;
  topic?: string;
  evaluation?: {
    score: number;
    feedback: string;
  };
  agents_used?: string[];
  orchestrator?: string;
}

const AgentDemo: React.FC = () => {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState<InterviewStep | null>(null);
  const [interviewSteps, setInterviewSteps] = useState<InterviewStep[]>([]);
  const [sessionId, setSessionId] = useState<string>('');
  const [progress, setProgress] = useState(0);

  // 模拟代理信息
  const mockAgents: AgentInfo[] = [
    { name: 'InterviewerAgent', role: '生成面试问题', status: 'idle' },
    { name: 'TopicManagerAgent', role: '管理话题流转', status: 'idle' },
    { name: 'EvaluatorAgent', role: '评估候选人回答', status: 'idle' },
    { name: 'OrchestratorAgent', role: '协调所有代理', status: 'idle' },
  ];

  useEffect(() => {
    setAgents(mockAgents);
  }, []);

  const simulateMockDemo = async (sessionId: string) => {
    // Mock数据 - 面试开始
    const startData = {
      session_id: sessionId,
      orchestrator: "OrchestratorAgent",
      action: "interview_started",
      question: "请介绍一下您的技术背景和经验？",
      topic: "技术背景",
      agents_used: ["InterviewerAgent", "TopicManagerAgent"],
      timestamp: new Date().toISOString()
    };
    
    setCurrentStep(startData);
    setInterviewSteps([startData]);
    setProgress(20);
    
    // 更新代理状态
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: startData.agents_used.includes(agent.name) ? 'processing' : 'idle'
    })));

    // 模拟第一轮问答
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response1Data = {
      session_id: sessionId,
      orchestrator: "OrchestratorAgent",
      action: "response_evaluated",
      evaluation: {
        score: 85,
        feedback: "回答详细，展现了良好的技术理解能力"
      },
      next_question: "您如何处理项目中的技术挑战？",
      topic: "项目经验",
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"],
      timestamp: new Date().toISOString()
    };
    
    setCurrentStep(response1Data);
    setInterviewSteps(prev => [...prev, response1Data]);
    setProgress(45);
    
    // 更新代理状态
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: response1Data.agents_used.includes(agent.name) ? 'processing' : 'idle'
    })));

    // 模拟第二轮问答
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response2Data = {
      session_id: sessionId,
      orchestrator: "OrchestratorAgent",
      action: "response_evaluated",
      evaluation: {
        score: 92,
        feedback: "回答非常出色，展现了强大的问题解决能力"
      },
      next_question: "请描述一个您解决过的复杂技术问题？",
      topic: "问题解决",
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"],
      timestamp: new Date().toISOString()
    };
    
    setCurrentStep(response2Data);
    setInterviewSteps(prev => [...prev, response2Data]);
    setProgress(70);
    
    // 更新代理状态
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: response2Data.agents_used.includes(agent.name) ? 'processing' : 'idle'
    })));

    // 模拟第三轮问答
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const response3Data = {
      session_id: sessionId,
      orchestrator: "OrchestratorAgent",
      action: "response_evaluated",
      evaluation: {
        score: 88,
        feedback: "回答全面，展现了良好的技术深度"
      },
      next_question: "您如何看待新技术的学习和应用？",
      topic: "学习能力",
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"],
      timestamp: new Date().toISOString()
    };
    
    setCurrentStep(response3Data);
    setInterviewSteps(prev => [...prev, response3Data]);
    setProgress(90);
    
    // 更新代理状态
    setAgents(prev => prev.map(agent => ({
      ...agent,
      status: response3Data.agents_used.includes(agent.name) ? 'processing' : 'idle'
    })));

    // 模拟面试结束
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const endData = {
      session_id: sessionId,
      orchestrator: "OrchestratorAgent",
      action: "interview_ended",
      final_score: 88.3,
      total_questions: 3,
      responses_count: 3,
      timestamp: new Date().toISOString()
    };
    
    setCurrentStep(endData);
    setInterviewSteps(prev => [...prev, endData]);
    setProgress(100);
    setIsRunning(false);
    
    // 重置代理状态
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
  };

  const startDemo = async () => {
    setIsRunning(true);
    setInterviewSteps([]);
    setCurrentStep(null);
    setProgress(0);
    
    // 生成会话ID
    const newSessionId = `demo-${Date.now()}`;
    setSessionId(newSessionId);

    // 使用Mock数据模拟演示流程
    await simulateMockDemo(newSessionId);
  };

  const stopDemo = () => {
    setIsRunning(false);
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'idle' })));
  };

  const resetDemo = () => {
    stopDemo();
    setInterviewSteps([]);
    setCurrentStep(null);
    setProgress(0);
    setSessionId('');
  };

  const getAgentIcon = (agentName: string) => {
    switch (agentName) {
      case 'InterviewerAgent':
        return <MessageSquare className="w-4 h-4" />;
      case 'TopicManagerAgent':
        return <Target className="w-4 h-4" />;
      case 'EvaluatorAgent':
        return <Brain className="w-4 h-4" />;
      case 'OrchestratorAgent':
        return <Users className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'processing':
        return 'bg-blue-500';
      case 'idle':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* 标题和说明 */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">AI面试系统 - 多代理协同演示</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          这个演示展示了四个AI代理如何协同工作，进行智能技术面试。
          每个代理都有特定的职责，通过OrchestratorAgent进行协调。
        </p>
      </div>

      {/* 控制按钮 */}
      <div className="flex justify-center space-x-4">
        <Button 
          onClick={startDemo} 
          disabled={isRunning}
          className="flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>开始演示</span>
        </Button>
        <Button 
          onClick={stopDemo} 
          disabled={!isRunning}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Pause className="w-4 h-4" />
          <span>暂停</span>
        </Button>
        <Button 
          onClick={resetDemo} 
          variant="outline"
          className="flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>重置</span>
        </Button>
      </div>

      {/* 进度条 */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>面试进度</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* 代理状态面板 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>代理状态监控</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div key={agent.name} className="flex items-center space-x-3 p-3 border rounded-lg">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(agent.status)}`} />
                <div className="flex items-center space-x-2">
                  {getAgentIcon(agent.name)}
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-gray-500">{agent.role}</div>
                  </div>
                </div>
                <Badge variant={agent.status === 'processing' ? 'default' : 'secondary'}>
                  {agent.status === 'processing' ? '处理中' : agent.status === 'active' ? '活跃' : '空闲'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 当前步骤显示 */}
      {currentStep && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>当前执行步骤</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {new Date(currentStep.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <Badge variant="outline">{currentStep.action}</Badge>
              </div>
              
              {currentStep.question && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-900">当前问题:</div>
                  <div className="text-blue-800">{currentStep.question}</div>
                </div>
              )}
              
              {currentStep.topic && (
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-900">当前话题:</div>
                  <div className="text-green-800">{currentStep.topic}</div>
                </div>
              )}
              
              {currentStep.evaluation && (
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-900">评估结果:</div>
                  <div className="text-purple-800">
                    <div>评分: {currentStep.evaluation.score}/100</div>
                    <div>反馈: {currentStep.evaluation.feedback}</div>
                  </div>
                </div>
              )}
              
              {currentStep.agents_used && (
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="font-medium text-orange-900">参与代理:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {currentStep.agents_used.map((agent) => (
                      <Badge key={agent} variant="secondary">
                        {agent}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 执行历史 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>执行历史</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {interviewSteps.map((step, index) => (
              <div key={index} className="border-l-2 border-blue-500 pl-4 py-2">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">
                      步骤 {index + 1}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {step.action}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                {step.question && (
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">问题:</span> {step.question}
                  </div>
                )}
                
                {step.topic && (
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">话题:</span> {step.topic}
                  </div>
                )}
                
                {step.evaluation && (
                  <div className="text-sm text-gray-700 mb-1">
                    <span className="font-medium">评分:</span> {step.evaluation.score}/100
                  </div>
                )}
                
                {step.agents_used && (
                  <div className="text-sm text-gray-700">
                    <span className="font-medium">代理:</span> {step.agents_used.join(', ')}
                  </div>
                )}
              </div>
            ))}
            
            {interviewSteps.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>暂无执行历史，点击"开始演示"查看代理协同过程</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 系统架构说明 */}
      <Card>
        <CardHeader>
          <CardTitle>系统架构说明</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">代理职责分工</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>InterviewerAgent:</strong> 根据上下文生成相关面试问题</li>
                <li>• <strong>TopicManagerAgent:</strong> 控制话题流转和深度</li>
                <li>• <strong>EvaluatorAgent:</strong> 实时评估候选人回答质量</li>
                <li>• <strong>OrchestratorAgent:</strong> 协调所有代理的工作流程</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-3">协同工作流程</h4>
              <ol className="space-y-2 text-sm text-gray-600">
                <li>1. Orchestrator启动面试会话</li>
                <li>2. Interviewer生成第一个问题</li>
                <li>3. TopicManager确定当前话题</li>
                <li>4. 候选人回答问题</li>
                <li>5. Evaluator评估回答质量</li>
                <li>6. 循环直到面试结束</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentDemo;
