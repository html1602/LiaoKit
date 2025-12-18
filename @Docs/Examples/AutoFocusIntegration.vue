<template>
  <div class="chat-container">
    <!-- 关键点1: 必须监听 @auto-focus-input 事件 -->
    <LiaoWindow
      ref="windowRef"
      title="AI智能助手"
      :width="'600px'"
      :height="'500px'"
      @auto-focus-input="handleAutoFocusInput"
      @input-lock-change="handleLockChange"
    >
      <LiaoMessageList :messages="messages" />
      
      <!-- 关键点2: 必须设置 ref 引用 -->
      <LiaoInputArea
        ref="inputAreaRef"
        v-model="inputText"
        placeholder="输入消息开始对话..."
        @send="handleSendMessage"
      />
    </LiaoWindow>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
// 确保从正确的路径导入组件
import LiaoWindow from '@yuandezuohua/liaokit/LiaoWindow';
import LiaoMessageList from '@yuandezuohua/liaokit/LiaoMessageList';
import LiaoInputArea from '@yuandezuohua/liaokit/LiaoInputArea';

// 组件引用
const windowRef = ref();
const inputAreaRef = ref();

// 数据状态
const inputText = ref('');
const messages = ref([]);
const isAIReplying = ref(false);

// 关键点3: 正确实现自动聚焦处理函数
const handleAutoFocusInput = () => {
  console.log('🎯 [AutoFocus] 收到自动聚焦事件');
  
  if (inputAreaRef.value) {
    // 调用LiaoInputArea的focusInput方法
    inputAreaRef.value.focusInput();
    console.log('✅ [AutoFocus] 已执行自动聚焦');
  } else {
    console.error('❌ [AutoFocus] 无法找到输入区域引用');
  }
};

// 监听锁定状态变化（可选，用于调试）
const handleLockChange = (lockInfo) => {
  console.log('🔒 [Lock] 锁定状态变化:', lockInfo);
};

// 处理发送消息
const handleSendMessage = async (message) => {
  if (!message.trim() || isAIReplying.value) return;
  
  console.log('📤 [Message] 发送用户消息:', message);
  
  // 添加用户消息
  const userMessage = {
    id: `user-${Date.now()}`,
    content: message,
    isSelf: true,
    time: new Date(),
    status: 'sending'
  };
  
  messages.value.push(userMessage);
  inputText.value = '';
  
  // 更新用户消息状态为已发送
  await nextTick();
  userMessage.status = 'sent';
  console.log('✅ [Message] 用户消息状态更新为已发送');
  
  // 开始AI回复
  await handleAIReply(message);
};

// 关键点4: 正确的AI回复流程
const handleAIReply = async (userMessage) => {
  if (isAIReplying.value) return;
  
  isAIReplying.value = true;
  console.log('🤖 [AI] 开始AI回复流程');
  
  try {
    // 步骤1: 锁定输入
    if (windowRef.value) {
      windowRef.value.lockInput('AI_REPLYING');
      console.log('🔒 [AI] 已锁定输入 - AI回复中');
    }
    
    // 步骤2: 创建AI消息
    const aiMessage = {
      id: `ai-${Date.now()}`,
      content: '',
      isSelf: false,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'AI助手',
      time: new Date(),
      status: 'streaming'
    };
    
    messages.value.push(aiMessage);
    console.log('📝 [AI] 已创建AI消息，开始流式回复');
    
    // 步骤3: 模拟流式回复（替换为实际的AI API调用）
    await simulateStreamingReply(aiMessage, userMessage);
    
    // 步骤4: 完成回复，更新状态
    aiMessage.status = 'sent';
    console.log('✅ [AI] AI回复完成，状态更新为sent');
    
    // 步骤5: 解锁输入（这会触发自动聚焦）
    if (windowRef.value) {
      windowRef.value.unlockInput();
      console.log('🔓 [AI] 已解锁输入 - 应该触发自动聚焦');
    }
    
  } catch (error) {
    console.error('❌ [AI] AI回复过程中出错:', error);
    
    // 出错时也要解锁输入
    if (windowRef.value) {
      windowRef.value.unlockInput();
    }
  } finally {
    isAIReplying.value = false;
  }
};

// 模拟流式回复（替换为实际的AI API调用）
const simulateStreamingReply = async (aiMessage, userMessage) => {
  // 这里应该是实际的AI API调用
  // 例如: OpenAI API, Claude API, 或其他AI服务
  
  const responses = [
    '我理解您的问题。',
    '让我为您详细解答一下。',
    '根据您提到的情况，我建议...',
    '希望这个回答对您有帮助！'
  ];
  
  const selectedResponse = responses[Math.floor(Math.random() * responses.length)];
  
  // 模拟逐字输出
  for (let i = 0; i <= selectedResponse.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 30));
    aiMessage.content = selectedResponse.slice(0, i);
  }
};

// 实际项目中的AI API调用示例
const callRealAIAPI = async (aiMessage, userMessage) => {
  try {
    // 示例: OpenAI API调用
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        stream: true
      })
    });
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      // 处理流式数据
      aiMessage.content += chunk;
    }
    
  } catch (error) {
    console.error('AI API调用失败:', error);
    aiMessage.content = '抱歉，我现在无法回复您的消息。';
  }
};

// 组件挂载时的初始化
const initializeChat = () => {
  console.log('🚀 [Init] 聊天组件初始化完成');
  console.log('📋 [Init] 自动聚焦功能已启用');
  
  // 添加欢迎消息
  messages.value.push({
    id: 'welcome',
    content: '您好！我是AI助手，有什么可以帮助您的吗？',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(),
    status: 'sent'
  });
};

// 组件挂载后初始化
import { onMounted } from 'vue';
onMounted(() => {
  initializeChat();
});
</script>

<style scoped>
.chat-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}
</style>

<!-- 
使用说明:

1. 安装LiaoKit v2.8.7或更高版本:
   npm install @yuandezuohua/liaokit@latest

2. 确保正确导入组件:
   import LiaoWindow from '@yuandezuohua/liaokit/LiaoWindow';
   import LiaoMessageList from '@yuandezuohua/liaokit/LiaoMessageList';
   import LiaoInputArea from '@yuandezuohua/liaokit/LiaoInputArea';

3. 关键配置:
   - LiaoWindow必须监听@auto-focus-input事件
   - LiaoInputArea必须设置ref引用
   - AI回复流程必须正确调用lockInput和unlockInput

4. 调试方法:
   - 打开浏览器控制台查看日志
   - 确认看到"🎯 收到自动聚焦事件"和"✅ 已执行自动聚焦"日志
   - 如果没有看到这些日志，检查事件监听器和组件引用

5. 常见问题:
   - 忘记监听@auto-focus-input事件
   - 组件ref设置错误
   - AI回复流程没有调用unlockInput
   - 版本过低，不支持自动聚焦功能
-->