---
title: 流式渲染与 SSE (Streaming & SSE)
description: 实现打字机效果、SSE 连接管理与流式消息更新
updated: 2025-12-18
version: ^2.7.0
category: feature
tags: [Streaming, SSE, Typewriter]
---

# 流式渲染与 SSE (Streaming & SSE)

## 简介

在 AI 对话场景中，流式输出（Streaming）是提升用户体验的关键。LiaoKit 提供了完整的流式消息管理机制，支持 Server-Sent Events (SSE) 协议，能够轻松实现类似 ChatGPT 的打字机效果。

## 核心概念

- **StreamingMessageManager**: 管理流式消息的状态（streaming, sent, failed）和内容追加。
- **SSEStreamingManager**: 封装 SSE 连接，处理重连、事件解析和状态管理。
- **StreamingHelper**: 提供辅助工具，如模拟打字机效果、分块输出等。

## 快速接入

### 1. 使用 SSE 连接 (推荐)

如果你的后端支持 SSE，可以使用 `createSSEStreaming` 快速建立连接。

```typescript
import { createStreamingManager, createSSEStreaming } from '@yuandezuohua/liaokit';
import { ref } from 'vue';

const messages = ref([]);
// 1. 创建流式管理器
const streamingManager = createStreamingManager(messages);

// 2. 创建 SSE 管理器
const sseManager = createSSEStreaming(streamingManager, {
  retryDelay: 1000,
  maxRetries: 3
});

// 3. 开始流式输出
const startChat = (messageId) => {
  // 先创建一个空的流式消息
  const msg = streamingManager.createStreamingMessage({
    id: messageId,
    type: 'text',
    isSelf: false
  });
  streamingManager.addStreamingMessage(msg);
  
  // 连接 SSE 端点
  sseManager.startStreaming('/api/chat/stream', messageId);
};
```

### 2. 手动追加内容 (WebSocket 或自定义协议)

如果你使用 WebSocket 或其他协议，可以直接调用 `StreamingMessageManager` 的 API。

```typescript
// 追加内容
streamingManager.appendToMessage(messageId, 'Hello');

// 完成输出
streamingManager.completeStreaming(messageId);

// 标记错误
streamingManager.setStreamingError(messageId, 'Connection failed');
```

## 模拟打字机效果

在开发或演示阶段，你可以使用 `StreamingHelper` 模拟流式输出。

```typescript
import { StreamingHelper } from '@yuandezuohua/liaokit';

await StreamingHelper.typewriterEffect(
  streamingManager,
  messageId,
  '这是一段模拟的流式文本...',
  50 // 打字速度 (ms/char)
);
```

## SSE 数据格式规范

为了配合 LiaoKit 的 SSE 管理器，建议后端返回如下格式的事件流：

```text
event: message
data: {"content": "Hello", "done": false}

event: message
data: {"content": " World", "done": false}

event: message
data: {"done": true}
```

或者简单的文本流：

```text
data: Hello

data:  World

data: [DONE]
```

## 结合 AI 适配器

流式渲染可以与 AI 适配器无缝结合。当 `LiaoMessageList` 检测到流式消息完成（状态变为 `sent`）时，会自动触发 AI 适配器（如果启用且未跳过），对最终内容进行格式化处理（如 Markdown 渲染）。

## 最佳实践

1. **状态管理**：始终通过 `streamingManager` 更新消息，不要直接修改 `messages` 数组中的 content，以保证响应式更新。
2. **连接保活**：`SSEStreamingManager` 内置了页面可见性监听，当页面隐藏时会自动暂停连接，恢复时重连（可配置）。
3. **错误处理**：监听 `onError` 回调，在连接断开或发生错误时给予用户反馈。

```typescript
const sseManager = createSSEStreaming(streamingManager, {}, {
  onError: (err) => {
    console.error('SSE Error:', err);
    // 显示重试按钮或错误提示
  }
});
```
