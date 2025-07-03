# LiaoKit - 现代化Vue3组件库

[![NPM Version](https://img.shields.io/npm/v/@yuandezuohua/liaokit)](https://www.npmjs.com/package/@yuandezuohua/liaokit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

LiaoKit 是一个现代化的Vue3 组件库，专注于提供高质量的UI 组件和智能消息适配功能。

## 🎨 特性

- 🎨 **现代化设计** - 精美的UI设计和动画效果
- 🤖 **AI智能适配** - 支持通义千问大模型自动适配消息格式
- 🪟 **多窗口系统** - 强大的窗口管理和布局功能
- 📱 **响应式设计** - 完美适配移动端和桌面端
- 🔧 **TypeScript支持** - 完整的类型定义
- 🎭 **主题定制** - 灵活的主题配置系统
- 📦 **按需引入** - 支持树摇优化
- 🧩 **丰富插件** - 12个功能插件，支持投票、图表、时间线等

## 🚀 安装

```bash
npm install @yuandezuohua/liaokit
# 或
yarn add @yuandezuohua/liaokit
# 或
pnpm add @yuandezuohua/liaokit
```

## 🚀 快速开始

### 完整引入

```typescript
import { createApp } from 'vue'
import LiaoKit from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/liaokit.css'

const app = createApp(App)
app.use(LiaoKit)
app.mount('#app')
```

### 按需引入

```vue
<template>
  <div>
    <!-- 基础聊天功能 -->
    <LiaoWindow title="聊天窗口">
      <LiaoMessageList 
        :messages="messages"
        :use-ai-adapter="true"
        :ai-adapter-options="{ apiKey: 'your-key' }"
      />
      <LiaoInputArea 
        v-model="newMessage"
        @send="sendMessage"
        :enable-file-upload="true"
        :enable-emoji-input="true"
      />
    </LiaoWindow>
    
    <!-- 企业级多窗口应用 -->
    <LiaoApp>
      <LiaoWindowList>
        <LiaoWindow title="客服聊天">
          <LiaoMessageList :messages="chatMessages" />
          <LiaoInputArea v-model="input" @send="handleSend" />
        </LiaoWindow>
        <LiaoWindow title="数据统计">
          <LiaoStatsPlugin :data="statsData" />
        </LiaoWindow>
      </LiaoWindowList>
    </LiaoApp>
  </div>
</template>

<script setup>
import { 
  LiaoApp,
  LiaoWindowList, 
  LiaoWindow, 
  LiaoMessageList, 
  LiaoInputArea,
  LiaoStatsPlugin
} from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/liaokit.css'

// 你的逻辑代码
</script>
```

### 基础用法

```vue
<template>
  <!-- 基础消息列表 -->
  <LiaoMessageList :messages="messages" />
  
  <!-- 启用AI适配器，自动统一消息格式 -->
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :ai-adapter-options="{
      enabled: true,
      apiKey: 'your-tongyi-api-key',
      model: 'qwen-plus'
    }"
  />
  
  <!-- 🔥 v2.7.0+ 性能优化：跳过用户消息适配 -->
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :ai-adapter-options="aiOptions"
    :skip-user-message-adapter="true"
  />
</template>
```

## 🏗️组件架构

### 核心组件（4个）
- **LiaoButton** - 交互按钮
- **LiaoIcon** - 图标系统
- **LiaoMessageList** - 消息列表核心
- **LiaoWindow** - 窗口基础

### 应用容器（3个）
- **LiaoApp** - 企业级应用根容器
- **LiaoWindowList** - 多窗口管理系统
- **LiaoWindowHeader** - 窗口控制栏

### 消息系统（7个）
- **LiaoMessageBubble** - 文本消息气泡
- **LiaoImageBubble** - 图片消息气泡
- **LiaoPluginBubble** - 插件消息容器
- **LiaoFileBubble** - 文件消息气泡
- **LiaoInputArea** - 消息输入区域
- **LiaoEmojiPicker** - 表情选择器
- **LiaoQuickActionBar** - 快捷操作栏

### 文件处理（3个）
- **LiaoFileUpload** - 文件上传组件
- **LiaoFileChipList** - 文件预览列表
- **LiaoFilePreview** - 文件预览功能

### 插件生态（12个）
- **LiaoProgressPlugin** - 进度展示
- **LiaoMediaCarouselPlugin** - 媒体轮播
- **LiaoTimelinePlugin** - 时间线展示
- **LiaoFaqCardPlugin** - FAQ问答
- **LiaoActionsPlugin** - 动作按钮
- **LiaoStatsPlugin** - 统计图表（G2Plot集成）
- **LiaoVotePlugin** - 投票交互
- **LiaoListPlugin** - 列表展示
- **LiaoImageCardPlugin** - 图片卡片
- **LiaoInfoPlugin** - 信息展示
- **LiaoFormPlugin** - 表单收集
- **LiaoPluginDebugger** - 调试工具

## 📚 详细文档

### 🎯 重点推荐
- [📁 **LiaoFileBubble 完整使用手册**](@Docs/ComponentGuides/LiaoFileBubble.md) - 文件气泡组件详细指南
- [📁 **LiaoSessionStateManagement 完整使用说明**](@Docs/ComponentGuides/LiaoSessionStateManagement.md) - 会话状态管理完整指南
- [🔄 **历史消息加载开发文档**](@Docs/TechGuides/History-Message-Loading.md) - 完整的历史消息加载实现指南

### 组件文档
- [💬 LiaoMessageBubble](@Docs/ComponentGuides/LiaoMessageBubble.md) - 基础消息气泡
- [📋 LiaoMessageList](@Docs/ComponentGuides/LiaoMessageList.md) - 消息列表
- [🪟 LiaoWindow](@Docs/ComponentGuides/LiaoWindow.md) - 窗口组件
- [✏️ LiaoInputArea](@Docs/ComponentGuides/LiaoInputArea.md) - 输入区域
- [🖼️LiaoImageBubble](@Docs/ComponentGuides/LiaoImageBubble.md) - 图片消息
- [🔌 LiaoPluginBubble](@Docs/ComponentGuides/LiaoPluginBubble.md) - 插件消息

### 插件文档
- [📊 LiaoProgressPlugin](@Docs/ComponentGuides/LiaoProgressPlugin.md) - 进度插件
- [🎯 LiaoActionsPlugin](@Docs/ComponentGuides/LiaoActionsPlugin.md) - 操作插件
- [ℹ️ LiaoInfoPlugin](@Docs/ComponentGuides/LiaoInfoPlugin.md) - 信息插件
- [📈 LiaoStatsPlugin](@Docs/ComponentGuides/LiaoStatsPlugin.md) - 统计插件
- [🗳️LiaoVotePlugin](@Docs/ComponentGuides/LiaoVotePlugin.md) - 投票插件
- [📅 LiaoTimelinePlugin](@Docs/ComponentGuides/LiaoTimelinePlugin.md) - 时间线插件
- [🎬 LiaoMediaCarouselPlugin](@Docs/ComponentGuides/LiaoMediaCarouselPlugin.md) - 媒体轮播插件

### 功能规则
- [会话状态管理规则](@Docs/Feature/LiaoSessionStateManagement_rules.md)
- [全局状态管理规则](@Docs/Feature/LiaoGlobalStateManagement_rules.md)
- [LiaoWindow 窗口规则](@Docs/Feature/LiaoWindow_rules.md)

### 开发文档
- [📖 使用指南](@Docs/Feature/HowToUse_guide.md)
- [🔧 开发环境配置](@Docs/DevEnvConfig.md)
- [📋 功能地图](@Docs/FeatureMap.md)
- [❓常见问题](@Docs/FAQ.md)

## 🤖 AI智能适配

LiaoKit 的核心特色功能，支持自动将各种格式的消息转换为组件可用的标准格式。

### 基础AI适配

```vue
<template>
  <LiaoMessageList 
    :messages="businessMessages"
    :use-ai-adapter="true"
    :ai-adapter-options="{
      apiKey: 'your-tongyi-qwen-key',
      model: 'qwen-plus',
      enableCache: true
    }"
  />
</template>

<script setup>
// 业务侧的非标准消息格式
const businessMessages = [
  {
    id: 1,
    text: '用户查询内容',  // 非标准字符
    sender: 'customer',
    timestamp: 1703001234
  },
  {
    id: 2,
    msg_content: 'AI回复内容',  // 非标准字符
    from: 'bot',
    created_at: '2023-12-19'
  }
]
// AI适配器会自动转换为标准格式并显示
</script>
```

### 🔥 v2.7.0+ 性能优化：跳过用户消息适配

```vue
<template>
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :skip-user-message-adapter="true"
    :ai-adapter-options="adapterOptions"
    @adapter-success="handleAdapterSuccess"
  />
</template>

<script setup>
// 性能优化配置
const adapterOptions = {
  apiKey: 'your-qwen-api-key',
  model: 'qwen-plus',
  enableCache: true,
  timeoutMs: 8000
}

// 监听适配结果
const handleAdapterSuccess = (event) => {
  console.log('📊 适配统计:', {
    processed: event.processed,    // 已处理消息数
    skipped: event.skipped,        // 跳过消息数
    cached: event.cached           // 缓存命中数
  })
  
  console.log(`跳过率: ${(event.skipped / (event.processed + event.skipped) * 100).toFixed(1)}%`)
}
</script>
```

### 🚀 v2.7.6+ 流式输入 + AI适配

完美解决流式输出与AI适配的时机协调问题：

```vue
<template>
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :skip-user-message-adapter="true"
    :enable-adapter-cache="true"
    :ai-adapter-options="adapterOptions"
    @adapter-success="handleAdapterSuccess"
  />
</template>

<script setup>
import { ref } from 'vue'
import { createStreamingManager, StreamingHelper } from '@yuandezuohua/liaokit'

const messages = ref([])
const streamingManager = createStreamingManager(messages)

// 创建流式AI回复
const createStreamingReply = async (userInput) => {
  // 1. 添加用户消息（会被智能跳过适配）
  messages.value.push({
    id: generateId(),
    content: userInput,
    isSelf: true,
    status: 'sent'
  })
  
  // 2. 创建AI流式回复
  const aiMessageId = generateId()
  const aiMessage = streamingManager.createStreamingMessage({
    id: aiMessageId,
    isSelf: false,
    name: 'AI助手'
  })
  
  streamingManager.addStreamingMessage(aiMessage)
  
  // 3. 模拟流式输出
  await StreamingHelper.simulateStreaming(
    streamingManager,
    aiMessageId,
    'AI正在实时回复...',
    {
      chunkSize: 2,
      delay: 50,
      onComplete: () => {
        console.log('🎉 流式完成，自动触发AI适配')
      }
    }
  )
  
  // 流式完成后会自动触发AI适配，确保消息格式标准化
}

const handleAdapterSuccess = (event) => {
  console.log('📊 智能适配统计:', {
    processed: event.processed,      // AI消息适配数
    skipped: event.skipped,          // 跳过总数（用于流式）
    streaming: event.streaming,      // 流式跳过数
    cached: event.cached,            // 缓存命中数
    efficiency: `${(event.skipped / (event.processed + event.skipped) * 100).toFixed(1)}%`
  })
}
</script>
```

**流式+AI适配特性：**
- 🎯 **智能状态感知**：自动识别流式消息状态，避免无效适配
- 🔧 **性能极致优化**：减少0%+ API调用，降低0%+ 成本
- 🎨 **实时流畅体验**：流式过程不卡顿，完成后自动适配
- 🎛️**分层跳过策略**：用户消息与流式消息与AI消息
- 🎨 **缓存增强利用**：完整内容适配结果有效缓存

详细使用方法请参考：[📚 流式输入+AI适配使用指南](@Docs/ComponentGuides/StreamingWithAIAdapter.md)

## 📦 包信息

- **当前版本**: v2.7.10
- **包大小**: 3.5MB
- **组件数量**: 27个
- **插件数量**: 12个
- **TypeScript**: 完整支持
- **Vue版本**: 3.3+

## 🎨 最新更新 (v2.7.10)

### 🐛 Markdown行间距根本问题修复
彻底解决用户反馈的Markdown渲染行间距过大的根本原因：

- 🎯 **根本问题发现**：用户调试发现`white-space: pre-wrap`是导致行间距过大的真正原因
- 🔧 **精准修复**：为`.liao-markdown-content`单独设置`white-space: normal`，覆盖父级设置
- 📈 **用户验证**：基于用户在浏览器调试台的实际验证结果
- ✅ **功能保持**：纯文本消息的换行功能完全不受影响
- 🎨 **标准化显示**：Markdown内容恢复GitHub风格的标准间距和格式

**核心修复代码**：
```scss
:deep(.liao-markdown-content) {
  // 关键修复：覆盖父级的 white-space 设置
  white-space: normal;
}
```

**修复原理**：
- `.liao-message-bubble-text`使用`white-space: pre-wrap`保持纯文本换行
- 但这也影响了内部Markdown的HTML渲染，导致标签间空白被保留
- 通过CSS选择器优先级，单独为Markdown内容设置正常的空白处理

### 📊 修复效果对比
```css
/* 修复前：所有内容都受pre-wrap影响 */
.liao-message-bubble-text {
  white-space: pre-wrap;  /* 影响纯文本和Markdown */
}

/* 修复后：分别处理 */
.liao-message-bubble-text {
  white-space: pre-wrap;  /* 只影响纯文本 */
}
.liao-markdown-content {
  white-space: normal;    /* Markdown恢复正常处理 */
}
```

### 🎯 解决问题
- ❌ **修复前**：Markdown内容行间距过大，HTML标签间空白被错误保留
- ✅ **修复后**：标准的紧凑Markdown显示，符合GitHub等主流平台效果
- 🧪 **用户验证**：基于真实用户调试台验证的解决方案
- 📱 **全平台兼容**：桌面端和移动端都获得最佳显示效果

### 📦 兼容性
- **完全向下兼容**：现有代码无需任何修改
- **自动生效**：升级版本即可享受修复效果
- **功能独立**：不影响现有的纯文本消息显示

```vue
<!-- 使用修复后的完美Markdown显示 -->
<LiaoMessageBubble 
  :content="markdownContent" 
  type="ai"
  format="markdown" 
/>
```

## 🔧 控制台日志控制

LiaoKit 提供智能的日志管理系统，确保生产环境控制台干净。

### 自动环境检测

组件会自动检测运行环境：
- **开发环境**：显示完整调试信息
- **生产环境**：自动禁用所有日志输出

### 手动控制方法

如需强制禁用日志，可使用以下方法：

```javascript
// 方法1：全局标识禁用
window.__LIAO_KIT_DEV__ = false;

// 方法2：API禁用
import { logger } from '@yuandezuohua/liaokit';
logger.setEnabled(false);

// 方法3：配置禁用
logger.configure({
  enabled: false,
  level: 'ERROR'  // 只显示错误日志
});
```

### 技术说明

- **双重保障**：运行时环境检测 + 构建时代码清理
- **零性能损失**：生产环境下完全静默
- **智能判断**：基于域名、端口、环境变量自动识别

详细信息请参考：[Logger环境控制技术指南](@Docs/TechGuides/Logger-Environment-Control.md)

## 🔗 相关链接

- [NPM 包](https://www.npmjs.com/package/@yuandezuohua/liaokit)
- [GitHub 仓库](https://github.com/html1602/LiaoKit)
- [更新日志](CHANGELOG.md)
- [许可证](LICENSE)

## 🤝 贡献

欢迎贡献代码！请阅读我们的贡献指南。

## 📄 许可

本项目采用[MIT 许可证](LICENSE)。

---

© 2025 LiaoKit Team. 保留所有权利。

#### 消息列表组件 (LiaoMessageList)
- 🔥 **智能消息渲染**: 支持文本、图片、文件、插件等多种消息类型
- 📁 **完整文件支持**: 四种状态管理(waiting/uploading/success/error)，三种布局模式(bubble/list/card)
- 🔧 **文件预览功能**: 内置图片、视频、音频、文本等多种文件类型预览
- 📤 **文件上传集成**: 与输入组件无缝集成，支持进度监控和错误处理
- 🎛️**灵活事件系统**: 完整的文件操作事件预览、下载、重试、更多操作
- 🤖 **AI智能适配**: 自动转换各种业务消息格式为标准格式(v2.6.0+)
- 💬 **消息分组**: 按日期自动分组，支持自定义分组逻辑
- 🔄 **实时滚动**: 智能滚动控制，新消息自动滚动到底部
- 🎨 **高度定制**: 支持自定义消息渲染、空状态、加载状态等

## 🔧 最近更新

### v2.6.3 - 文件预览功能修复 (2025-06-25)

**修复问题**:
- 🐛 修复文件预览弹窗中文本格式解析问题
- 🔧 增强Data URL解码支持，兼容Base64和普通格式
- 🎨 改进UTF-8字符编码处理
- 🎯 添加详细的调试日志输出

**新增功能**:
- 🎯 文件预览调试工具 (`FilePreviewDebugger.vue`)
- 📊 实时URL解析过程监控
- 🔍 多格式文件预览测试

**支持的文件格式**:
```javascript
// Base64 Data URL
'data:text/plain;base64,SGVsbG8gV29ybGQ='

// 普通Data URL  
'data:text/plain;charset=utf-8,Hello%20World'

// HTTP URL
'https://example.com/file.txt'
```

### v2.6.4 - 流式输入完整使用指南 (2025-06-25)

**新增功能**:
- 🎯 **完整流式输入解决方案**：详细的流式场景使用指南
- 🌐 **SSE集成方案**：Server-Sent Events完整支持
- 🤖 **智能状态管理**：流式消息状态自动同步
- 🎨 **实战案例**：完整聊天界面实现示例

**技术特点**:
```typescript
// 基础流式用法
const streamingManager = createStreamingManager(messages)
await StreamingHelper.typewriterEffect(manager, messageId, text, 80)

// SSE实时推送
const sseManager = createSSEStreaming(streamingManager)
sseManager.startStreaming('/api/chat/stream', messageId)

// 智能错误处理
manager.setStreamingError(messageId, error.message)
```

**应用场景**:
- 🤖 AI聊天应用的流式回复
- 📡 实时内容推送和通知
- 💬 在线客服系统
- 📝 代码演示和教学工具

### v2.7.0 (2025-06-25) - 性能优化版本
#### 🔥 新增功能
- **skipUserMessageAdapter**: 组件级跳过用户消息适配，显著提升性能
- **性能统计**: 新增适配器性能监控和统计功能
- **成本优化**: 根据用户消息比例减少50-80%的AI API调用

#### 💡 使用示例
```vue
<template>
  <!-- 性能优化配置：只对AI回复使用适配器-->
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :skip-user-message-adapter="true"
    @adapter-success="handleAdapterSuccess"
  />
</template>

<script setup>
const handleAdapterSuccess = (event) => {
  console.log('性能统计:', {
    processed: event.processed,    // 处理的AI消息数
    skipped: event.skipped,       // 跳过的用户消息数  
    cached: event.cached,         // 缓存命中数
    efficiency: `${Math.round(event.skipped/(event.processed + event.skipped)*100)}%`
  })
}
</script>
```

#### 📊 性能收益
- **API调用减少**: 50-80%（取决于用户消息比例）
- **响应速度提升**: 40-70%
- **成本节省**: 50-80%
- **内存使用降低**: 20-40%

### v2.6.4 (2025-06-25) - 流式输入完整指南
#### 💡 优化功能
- 完善流式消息管理文档和示例
- 优化SSE流式传输性能
- 增强移动端适配效果

### v2.6.3 (2025-06-25) - 文件预览修复
#### 🐛 修复问题
- 修复文件预览Data URL解码问题
- 增强Base64和UTF-8字符处理
- 添加文件预览调试工具

## 🎯 主要功能

### 🎨 丰富的消息类型
- **文本消息**：支持Markdown 渲染、代码高亮
- **图片消息**：自动适配尺寸、支持预览
- **文件消息**：文件上传、下载、预览功能
- **插件消息**：可扩展的插件系统

### 🤖 AI消息格式适配
- **智能格式转换**：自动适配不同业务方的消息格式
- **缓存机制**：减少重复调用，提升性能
- **兜底方案**：适配失败时的本地格式化
- 🔥 **性能优化**：v2.7.0+ 支持跳过用户消息适配，显著提升性能

### 📡 流式消息支持
- **打字机效果**：逐字符显示，模拟真实打字
- **逐词输出**：按单词分组显示，适合长文本
- **分块流式**：可自定义分块大小和延迟
- **SSE集成**：完整的Server-Sent Events支持

### 🎯 智能消息管理
- **消息状态**：发送中、已发送、失败状态
- **已读回执**：消息阅读状态管理
- **新消息提示**：智能的新消息提示
- **自动滚动**：智能滚动到底部
