# LiaoKit - 现代化Vue3组件库

[![NPM Version](https://img.shields.io/npm/v/@yuandezuohua/liaokit)](https://www.npmjs.com/package/@yuandezuohua/liaokit)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-green.svg)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)

LiaoKit 是一个现代化的 Vue3 组件库，专注于提供高质量的 UI 组件和智能消息适配功能。

## ✨ 特性

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

## 📖 快速开始

### 完整引入

```typescript
import { createApp } from 'vue'
import LiaoKit from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/style.css'

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
import '@yuandezuohua/liaokit/dist/style.css'

// 你的逻辑代码
</script>
```

## 🏗️ 组件架构

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

## 🤖 AI智能适配

LiaoKit 的核心特色功能，支持自动将各种格式的消息转换为组件可用的标准格式：

```vue
<template>
  <LiaoMessageList 
    :messages="rawMessages"
    :use-ai-adapter="true"
    :ai-adapter-options="{
      apiKey: 'your-tongyi-api-key',
      model: 'qwen-plus',
      enableCache: true
    }"
    @adapter-success="handleAdapterSuccess"
    @adapter-error="handleAdapterError"
  />
</template>
```

### 支持的适配场景
- 客服系统消息格式转换
- 电商平台订单消息适配
- 社交应用聊天记录格式化
- 企业内部系统消息统一

## 📦 包信息

- **当前版本**: v2.7.0
- **包大小**: 3.5MB
- **组件数量**: 27个
- **插件数量**: 12个
- **TypeScript**: 完整支持
- **Vue版本**: 3.3+

## 🔗 相关链接

- [NPM 包](https://www.npmjs.com/package/@yuandezuohua/liaokit)
- [GitHub 仓库](https://github.com/html1602/LiaoKit)
- [更新日志](CHANGELOG.md)
- [许可证](LICENSE)

## 🤝 贡献

欢迎贡献代码！请阅读我们的贡献指南。

## 📄 许可证

本项目采用 [MIT 许可证](LICENSE)。

---

© 2025 LiaoKit Team. 保留所有权利。
