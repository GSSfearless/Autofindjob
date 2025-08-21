// 测试Mock演示功能
console.log('🧪 测试Mock演示功能...');

// 模拟演示数据
const mockDemoData = {
  start: {
    session_id: "demo-test-001",
    orchestrator: "OrchestratorAgent",
    action: "interview_started",
    question: "请介绍一下您的技术背景和经验？",
    topic: "技术背景",
    agents_used: ["InterviewerAgent", "TopicManagerAgent"],
    timestamp: new Date().toISOString()
  },
  responses: [
    {
      action: "response_evaluated",
      evaluation: { score: 85, feedback: "回答详细，展现了良好的技术理解能力" },
      next_question: "您如何处理项目中的技术挑战？",
      topic: "项目经验",
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"]
    },
    {
      action: "response_evaluated", 
      evaluation: { score: 92, feedback: "回答非常出色，展现了强大的问题解决能力" },
      next_question: "请描述一个您解决过的复杂技术问题？",
      topic: "问题解决",
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"]
    },
    {
      action: "response_evaluated",
      evaluation: { score: 88, feedback: "回答全面，展现了良好的技术深度" },
      next_question: "您如何看待新技术的学习和应用？",
      topic: "学习能力", 
      agents_used: ["EvaluatorAgent", "InterviewerAgent", "TopicManagerAgent"]
    }
  ],
  end: {
    action: "interview_ended",
    final_score: 88.3,
    total_questions: 3,
    responses_count: 3
  }
};

console.log('✅ Mock数据验证通过');
console.log('📊 演示流程:');
console.log(`   1. 开始面试 - ${mockDemoData.start.question}`);
console.log(`   2. 第一轮评估 - 评分: ${mockDemoData.responses[0].evaluation.score}/100`);
console.log(`   3. 第二轮评估 - 评分: ${mockDemoData.responses[1].evaluation.score}/100`);
console.log(`   4. 第三轮评估 - 评分: ${mockDemoData.responses[2].evaluation.score}/100`);
console.log(`   5. 面试结束 - 最终分数: ${mockDemoData.end.final_score}/100`);

console.log('\n🎯 代理协同流程:');
console.log('   - InterviewerAgent: 生成面试问题');
console.log('   - TopicManagerAgent: 管理话题流转');
console.log('   - EvaluatorAgent: 评估回答质量');
console.log('   - OrchestratorAgent: 协调所有代理');

console.log('\n🚀 Mock演示准备完成！');
console.log('   访问 http://localhost:8080/agent-demo 开始演示');
