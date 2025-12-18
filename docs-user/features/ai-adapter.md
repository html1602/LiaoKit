---
title: AI 适配器 (AI Adapter)
description: 统一的 AI 消息格式适配层，连接大模型与 UI 组件
updated: 2025-12-18
version: ^2.7.0
category: feature
tags: [AI, Adapter, Qwen, ChatGPT]
---

# AI 适配器 (AI Adapter)

## 简介

LiaoKit 内置了强大的 AI 适配器层，旨在解决前端 UI 组件与不同 AI 模型（如通义千问、ChatGPT）之间的数据格式差异。通过适配器，你可以轻松将原始的 AI 响应转换为组件可渲染的标准格式，支持流式输出、Markdown 渲染、代码高亮等特性。

## 核心特性

- **统一接口**：屏蔽不同模型 API 的差异，提供一致的消息格式。
- **流式支持**：完美支持 SSE (Server-Sent Events) 和打字机效果。
- **自动格式化**：自动处理 Markdown、代码块、表格等复杂内容。
- **缓存机制**：内置消息缓存，避免重复请求和处理。
- **选择性适配**：支持跳过用户消息适配，大幅提升性能。

## 快速上手

### 1. 组件级使用 (推荐)

最简单的使用方式是直接在 `LiaoMessageList` 组件中启用适配器。

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    :use-ai-adapter="true"
    :ai-adapter-options="adapterOptions"
    :skip-user-message-adapter="true"
    @adapter-success="handleSuccess"
    @adapter-error="handleError"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const messages = ref([]);

const adapterOptions = computed(() => ({
  apiKey: 'sk-xxxxxxxx', // 建议通过后端代理或环境变量注入
  model: 'qwen-plus',    // 支持的模型
  enableCache: true,     // 启用缓存
  timeoutMs: 10000       // 超时时间
}));

const handleSuccess = (event) => {
  console.log('适配成功:', event);
};

const handleError = (error) => {
  console.error('适配失败:', error);
};
</script>
```

### 2. Hook 方式使用

如果你需要更细粒度的控制，或者在组件外部使用适配逻辑，可以使用 `useAiMessageAdapter` Hook。

```typescript
import { useAiMessageAdapter } from '@yuandezuohua/liaokit';

const { 
  adaptMessage, 
  adaptMessages, 
  loading, 
  error 
} = useAiMessageAdapter({
  apiKey: 'your-api-key',
  model: 'qwen-plus'
});

// 适配单条消息
const processMessage = async (rawMsg) => {
  const result = await adaptMessage(rawMsg);
  if (result.success) {
    return result.message;
  }
};
```

## 配置选项 (AiAdapterOptions)

| 选项名 | 类型 | 默认值 | 说明 |
| ------ | ---- | ------ | ---- |
| `apiKey` | `string` | - | AI 服务的 API Key |
| `model` | `string` | `'qwen-turbo'` | 使用的模型名称 |
| `enabled` | `boolean` | `true` | 是否启用适配器 |
| `enableCache` | `boolean` | `true` | 是否启用消息缓存 |
| `timeoutMs` | `number` | `10000` | 请求超时时间 (毫秒) |
| `retryCount` | `number` | `1` | 失败重试次数 |
| `promptTemplate` | `string` | - | 自定义 Prompt 模板 |

## 高级用法

### 自定义格式化函数

你可以提供一个 `customFormat` 函数，在适配器处理之前或之后对消息进行自定义处理。

```typescript
const customFormat = (rawMessage) => {
  // 自定义逻辑：如果消息包含 specificField，则特殊处理
  if (rawMessage.specificField) {
    return {
      id: rawMessage.id,
      content: `[特殊消息] ${rawMessage.content}`,
      isSelf: false,
      type: 'text'
    };
  }
  // 返回 null 继续使用默认适配逻辑
  return null;
};
```

### 性能优化：跳过用户消息

在大多数对话场景中，用户发送的消息格式是固定的，不需要经过 AI 适配。开启 `skipUserMessageAdapter` 可以显著减少 API 调用和处理时间。

```vue
<LiaoMessageList
  :skip-user-message-adapter="true"
  ...
/>
```

## 常见问题

### Q: API Key 应该放在哪里？
**A:** 出于安全考虑，**切勿在前端代码中硬编码 API Key**。建议通过后端代理转发请求，或者在开发环境中使用环境变量。

### Q: 如何处理流式响应？
**A:** 适配器内部已对流式消息进行了处理。只需确保你的后端接口返回标准的 SSE 格式，组件会自动识别并渲染打字机效果。详见 [流式渲染指南](./streaming.md)。
