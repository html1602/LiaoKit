# LiaoKit - 现代化 Vue3 AI 消息组件库

[![NPM Version](https://img.shields.io/npm/v/@yuandezuohua/liaokit)](https://www.npmjs.com/package/@yuandezuohua/liaokit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

LiaoKit 是一个专为 AI 对话场景设计的现代化 Vue3 组件库。它不仅提供高质量的 UI 组件，更内置了强大的 AI 消息适配器和流式响应处理能力，帮助开发者快速构建企业级 AI 聊天应用。

## ✨ 核心特性

- 🎨 **现代化设计** - 精美的 UI 设计，完美适配移动端和桌面端
- 🤖 **AI 智能适配** - 内置 AI 适配器，自动标准化通义千问等大模型输出
- 🌊 **流式响应引擎** - 强大的流式输出支持（打字机效果、SSE、Markdown 实时渲染）
- 🪟 **多窗口系统** - 完整的企业级多窗口管理和布局方案
- 📁 **全能消息体** - 支持文本、Markdown、图片、文件、图表、插件等多种消息类型
- 🔧 **开发者友好** - 完整 TypeScript 支持，支持按需引入和 Tree Shaking

## 📦 安装

```bash
npm install @yuandezuohua/liaokit
# 或
yarn add @yuandezuohua/liaokit
# 或
pnpm add @yuandezuohua/liaokit
```

## 🚀 快速开始

### 完整引入

适合快速开发和原型验证。

```typescript
import { createApp } from 'vue'
import LiaoKit from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/liaokit.css'

const app = createApp(App)
app.use(LiaoKit)
app.mount('#app')
```

### 按需引入 (推荐)

配合 Tree Shaking 减小打包体积。

```vue
<template>
  <LiaoWindow title="AI 助手">
    <LiaoMessageList 
      :messages="messages"
      :use-ai-adapter="true"
    />
    <LiaoInputArea v-model="input" @send="handleSend" />
  </LiaoWindow>
</template>

<script setup>
import { 
  LiaoWindow, 
  LiaoMessageList, 
  LiaoInputArea 
} from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/liaokit.css'

// 你的业务逻辑
</script>
```

## 🧩 组件体系

### 核心组件
- **LiaoMessageList** - 消息列表核心，支持多种消息类型和 AI 适配
- **LiaoInputArea** - 智能输入区域，集成文件上传和表情
- **LiaoWindow** - 窗口基础容器
- **LiaoButton / LiaoIcon** - 基础交互元件

### 消息系统
- **LiaoMessageBubble** - 文本/Markdown 消息气泡
- **LiaoFileBubble** - 文件消息（支持预览、下载、状态管理）
- **LiaoImageBubble** - 图片消息（智能尺寸、预览）
- **LiaoPluginBubble** - 插件消息容器

### 应用容器
- **LiaoApp** - 企业级应用根容器
- **LiaoWindowList** - 多窗口管理系统
- **LiaoWindowHeader** - 窗口控制栏

### 插件生态 (12+)
- **图表统计**: LiaoStatsPlugin (G2Plot 集成)
- **交互组件**: LiaoVotePlugin (投票), LiaoActionsPlugin (动作按钮)
- **信息展示**: LiaoTimelinePlugin (时间线), LiaoMediaCarouselPlugin (轮播)
- **其他**: 进度条、表单、FAQ 卡片等

## 💡 核心功能深度解析

### 🤖 AI 智能适配 (AI Adapter)

LiaoKit 的核心功能之一，能够自动将非标准的大模型响应转换为组件标准格式。

```vue
<LiaoMessageList 
  :messages="rawMessages"
  :use-ai-adapter="true"
  :ai-adapter-options="{
    apiKey: 'your-api-key',
    model: 'qwen-plus',
    enableCache: true
  }"
  :skip-user-message-adapter="true" <!-- v2.7.0+ 性能优化 -->
/>
```

### 🌊 流式输出与 SSE

提供开箱即用的流式渲染能力，支持打字机效果和 Server-Sent Events (SSE)。

**v2.8.8 新特性**: 集成 `markstream-vue`，在 AI 模式下提供极致的 Markdown 流式渲染体验，支持平滑的打字机效果和复杂的 Markdown 实时解析。

```typescript
// SSE 示例
const sseManager = createSSEStreaming(streamingManager)
sseManager.startStreaming('/api/chat/stream', messageId)
```

[📚 查看流式输入完整指南](@Docs/ComponentGuides/StreamingWithAIAdapter.md)

### 📁 文件与多媒体

- **状态管理**: 完整支持 waiting / uploading / success / error 状态
- **预览功能**: 内置图片、视频、音频、文本及 Data URL 预览
- **交互事件**: 预览、下载、重试等完整回调

## 📚 文档导航

### 重点推荐
- [📖 **使用指南**](@Docs/Feature/HowToUse_guide.md)
- [📁 **LiaoFileBubble 完整手册**](@Docs/ComponentGuides/LiaoFileBubble.md)
- [🔄 **历史消息加载指南**](@Docs/TechGuides/History-Message-Loading.md)
- [🔧 **开发环境配置**](@Docs/DevEnvConfig.md)

### 组件文档
- [LiaoMessageList](@Docs/ComponentGuides/LiaoMessageList.md) | [LiaoInputArea](@Docs/ComponentGuides/LiaoInputArea.md) | [LiaoWindow](@Docs/ComponentGuides/LiaoWindow.md)

### 🧭 使用文档（User Guide）
- [总览与导航](./docs-user/README.md)
- 入门：[`快速开始`](./docs-user/getting-started.md) · [`安装与环境`](./docs-user/installation.md) · [`核心概念`](./docs-user/core-concepts.md)
- 组件：[`组件总览`](./docs-user/components/README.md)
- 插件：[`插件总览`](./docs-user/plugins/README.md)
- 功能主题：[`功能总览`](./docs-user/features/README.md)
- 场景组合：[`场景组合索引`](./docs-user/recipes/README.md)
- 重要事项与常见问题：[`FAQ`](./docs-user/faq.md)
- 扩展方向：[`Roadmap`](./docs-user/roadmap.md)

## 📅 更新日志

### v2.8.8 (2025-12-18)
- 🚀 **Markdown 流式引擎升级**: 集成 `markstream-vue`，提供更流畅的 AI 打字机效果。
- 📦 **零代码升级**: 样式自动打包进 `liaokit.css`，旧项目无缝切换。
- ⚡ **性能优化**: 优化长文本流式输出时的滚动性能。

### v2.8.5
- 🐛 修复 `src/index.ts` 导入错误及样式路径修正。

### v2.7.10
- 💄 **Markdown 渲染修复**: 彻底解决 Markdown 行间距过大问题，恢复 GitHub 风格标准显示。

### v2.7.0 - 性能里程碑
- ⚡ **跳过用户适配**: 新增 `skipUserMessageAdapter`，减少 50-80% API 调用。
- 📊 **性能监控**: 新增适配器性能统计事件。

[📄 查看完整更新日志](CHANGELOG.md)

## 🔧 调试与日志

组件会自动根据环境控制日志输出（生产环境静默）。如需手动控制：

```javascript
import { logger } from '@yuandezuohua/liaokit';
// 强制禁用日志
logger.setEnabled(false);
```

## 🔗 链接

- [NPM 包](https://www.npmjs.com/package/@yuandezuohua/liaokit)
- [GitHub 仓库](https://github.com/html1602/LiaoKit)

## 📄 许可

本项目采用 [MIT 许可证](LICENSE)。

---
© 2025 LiaoKit Team. 保留所有权利。
