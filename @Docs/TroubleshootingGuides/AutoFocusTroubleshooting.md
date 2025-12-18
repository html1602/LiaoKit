# LiaoKit 自动聚焦功能排查指南

## 问题描述
用户反映在其他项目中更新到LiaoKit最新版本后，AI回复结束后输入框没有自动聚焦。

## 功能原理
LiaoKit的自动聚焦功能基于以下机制：
1. AI回复时，LiaoWindow组件会锁定输入（`lockInput('AI_REPLYING')`）
2. AI回复完成后，调用`unlockInput()`解锁输入
3. `unlockInput()`方法会触发`auto-focus-input`事件
4. 父组件监听此事件并调用LiaoInputArea的`focusInput()`方法

## 排查步骤

### 1. 检查版本
确认已安装LiaoKit v2.8.7或更高版本：
```bash
npm list @yuandezuohua/liaokit
```

### 2. 检查事件监听
确保LiaoWindow组件正确监听了`auto-focus-input`事件：
```vue
<template>
  <LiaoWindow
    @auto-focus-input="handleAutoFocusInput"
  >
    <LiaoInputArea ref="inputAreaRef" />
  </LiaoWindow>
</template>

<script setup>
const inputAreaRef = ref();

// 关键：必须监听auto-focus-input事件
const handleAutoFocusInput = () => {
  if (inputAreaRef.value) {
    inputAreaRef.value.focusInput();
  }
};
</script>
```

### 3. 检查AI回复流程
确保AI回复流程正确使用了锁定/解锁机制：

```javascript
// 开始AI回复时
const startAIReply = () => {
  // 锁定输入
  windowRef.value.lockInput('AI_REPLYING');
  
  // 开始流式回复...
};

// AI回复完成时
const finishAIReply = () => {
  // 更新消息状态
  message.status = 'sent';
  
  // 解锁输入（这会触发自动聚焦）
  windowRef.value.unlockInput();
};
```

### 4. 检查组件引用
确保正确设置了组件引用：
```vue
<template>
  <LiaoWindow ref="windowRef">
    <LiaoInputArea ref="inputAreaRef" />
  </LiaoWindow>
</template>

<script setup>
const windowRef = ref();
const inputAreaRef = ref();
</script>
```

### 5. 调试日志
添加调试日志来跟踪事件流：
```javascript
const handleAutoFocusInput = () => {
  console.log('🎯 收到自动聚焦事件');
  if (inputAreaRef.value) {
    inputAreaRef.value.focusInput();
    console.log('✅ 已调用focusInput方法');
  } else {
    console.error('❌ inputAreaRef未找到');
  }
};
```

## 常见问题

### 问题1：事件监听器缺失
**症状**：AI回复完成后没有任何聚焦行为
**解决**：确保在LiaoWindow组件上添加`@auto-focus-input`监听器

### 问题2：组件引用错误
**症状**：控制台显示"inputAreaRef未找到"
**解决**：检查LiaoInputArea组件的ref设置是否正确

### 问题3：锁定/解锁流程错误
**症状**：输入框状态异常，聚焦时机不对
**解决**：确保AI回复流程正确调用了lockInput和unlockInput

### 问题4：版本不兼容
**症状**：使用旧版本的LiaoKit
**解决**：升级到v2.8.7或更高版本

## 完整示例

```vue
<template>
  <div class="chat-app">
    <LiaoWindow
      ref="windowRef"
      title="AI助手"
      @auto-focus-input="handleAutoFocusInput"
      @input-lock-change="handleLockChange"
    >
      <LiaoMessageList :messages="messages" />
      <LiaoInputArea
        ref="inputAreaRef"
        v-model="inputText"
        @send="handleSendMessage"
      />
    </LiaoWindow>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import LiaoWindow from '@yuandezuohua/liaokit/LiaoWindow';
import LiaoMessageList from '@yuandezuohua/liaokit/LiaoMessageList';
import LiaoInputArea from '@yuandezuohua/liaokit/LiaoInputArea';

const windowRef = ref();
const inputAreaRef = ref();
const inputText = ref('');
const messages = ref([]);

// 处理自动聚焦事件
const handleAutoFocusInput = () => {
  console.log('🎯 收到自动聚焦事件');
  if (inputAreaRef.value) {
    inputAreaRef.value.focusInput();
    console.log('✅ 已执行自动聚焦');
  } else {
    console.error('❌ 无法找到输入区域引用');
  }
};

// 处理锁定状态变化
const handleLockChange = (lockInfo) => {
  console.log('🔒 锁定状态变化:', lockInfo);
};

// 处理发送消息
const handleSendMessage = async (message) => {
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
  
  // 更新用户消息状态
  nextTick(() => {
    userMessage.status = 'sent';
  });
  
  // 开始AI回复
  await simulateAIReply();
};

// 模拟AI回复
const simulateAIReply = async () => {
  // 1. 锁定输入
  windowRef.value.lockInput('AI_REPLYING');
  
  // 2. 添加AI消息
  const aiMessage = {
    id: `ai-${Date.now()}`,
    content: '',
    isSelf: false,
    name: 'AI助手',
    time: new Date(),
    status: 'streaming'
  };
  messages.value.push(aiMessage);
  
  // 3. 模拟流式回复
  const response = '这是AI的回复内容';
  for (let i = 0; i <= response.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    aiMessage.content = response.slice(0, i);
  }
  
  // 4. 完成回复
  aiMessage.status = 'sent';
  
  // 5. 解锁输入（触发自动聚焦）
  windowRef.value.unlockInput();
};
</script>
```

## 测试方法

1. 创建上述完整示例
2. 发送一条消息触发AI回复
3. 观察AI回复完成后输入框是否自动获得焦点
4. 检查浏览器控制台是否有相关日志

## 联系支持

如果按照上述步骤仍无法解决问题，请提供：
1. LiaoKit版本号
2. 完整的组件代码
3. 浏览器控制台日志
4. 问题复现步骤

通过GitHub Issues或其他支持渠道联系我们。