---
title: LiaoMessageList（消息列表）
description: 渲染与管理消息的列表组件，支持多类型气泡
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoMessageList, Component]
---

# LiaoMessageList（消息列表）

## 简介
- 用于渲染文本/图片/文件/插件等不同类型的消息气泡

## 使用示例

### 基础用法

传入消息数组即可渲染。

```vue
<template>
  <LiaoMessageList 
    :messages="messages" 
    :show-avatar="true"
    :show-time="true"
  />
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([
  {
    id: 1,
    type: 'text',
    content: '你好，请问有什么可以帮你？',
    isSelf: false,
    name: '客服助手',
    avatar: 'https://example.com/avatar.png',
    time: Date.now()
  },
  {
    id: 2,
    type: 'text',
    content: '我想查询一下订单状态。',
    isSelf: true,
    time: Date.now()
  }
]);
</script>
```

### AI 适配器与流式响应

结合 AI 适配器自动处理格式，并支持流式输出。

```vue
<template>
  <LiaoMessageList 
    :messages="messages"
    :use-ai-adapter="true"
    :ai-adapter-options="adapterOptions"
    :skip-user-message-adapter="true"
    @load-more="handleLoadMore"
    @quick-action-click="handleQuickAction"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const messages = ref([]);

// AI 适配器配置
const adapterOptions = computed(() => ({
  apiKey: 'your-api-key', // 建议通过后端转发，不要在前端硬编码
  model: 'qwen-plus',
  enableCache: true
}));

// 加载更多历史消息
const handleLoadMore = async () => {
  // fetch history...
};

// 处理快捷操作点击（如“重新生成”、“复制”等）
const handleQuickAction = (action) => {
  console.log('快捷操作:', action);
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoMessageList\LiaoMessageList.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| messages | `Message[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| loadingMore | `boolean` | 否 | `false` |  |
| autoDetectHistoryLoading | `boolean` | 否 | `true` |  |
| emptyText | `string` | 否 | `暂无消息` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showAvatarSelf | `boolean` | 否 | `true` |  |
| showName | `boolean` | 否 | `false` |  |
| showTime | `boolean` | 否 | `false` |  |
| hasMore | `boolean` | 否 | `false` |  |
| loadMoreText | `string` | 否 | `加载更多` |  |
| scrollToBottom | `boolean` | 否 | `true` |  |
| scrollThreshold | `number` | 否 | `100` |  |
| showDateDivider | `boolean` | 否 | `true` |  |
| dateDividerFormat | `string` | 否 | `YYYY年MM月DD日` |  |
| unreadCount | `number` | 否 | `0` |  |
| useAiAdapter | `boolean` | 否 | `false` |  |
| aiAdapterOptions | `AiAdapterOptions` | 否 | `() => ({})` |  |
| customFormat | `CustomFormatFunction` | 否 | `undefined` |  |
| enableAdapterCache | `boolean` | 否 | `true` |  |
| adapterTimeout | `number` | 否 | `5000` |  |
| skipUserMessageAdapter | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| load-more | `(...) => void` |
| scroll | `(event: { scrollTop: number; scrollHeight: number; clientHeight: number }) => void` |
| scroll-to-top | `(...) => void` |
| scroll-to-bottom | `(...) => void` |
| read-all | `(...) => void` |
| quick-action-click | `(action: any) => void` |
| plugin-action | `(payload: { action: any; message: Message }) => void` |
| plugin-complete | `(payload: { message: Message; data: any }) => void` |
| plugin-cancel | `(payload: { message: Message; data: any }) => void` |
| plugin-error | `(payload: { message: Message; data: any }) => void` |
| file-preview | `(payload: { message: Message; file: any }) => void` |
| file-download | `(payload: { message: Message; file: any }) => void` |
| file-click | `(payload: { message: Message; file: any }) => void` |
| file-retry | `(payload: { message: Message; file: any }) => void` |
| file-more | `(payload: { message: Message; file: any }) => void` |
| adapter-success | `(event: { processed: number; cached: number; skipped: number; streaming: number; stats: any }) => void` |
| adapter-error | `(event: { error: string; originalMessages: Message[] }) => void` |
| adapter-fallback | `(event: { failedCount: number; total: number }) => void` |

<!-- @auto-api-end -->

## Slots
| 名称 | 作用域 | 用途 | 示例 |
| ---- | ------ | ---- | ---- |
| item | `{ message }` | 自定义消息项 | 自定义渲染 |

## 主题与样式（Theme/Vars）
| 变量名 | 默认值 | 影响范围 | 示例 |
| ------ | ------ | -------- | ---- |
| --liao-message-gap | `8px` | 气泡间距 | 控制布局 |

## 无障碍（A11y）
- 提供键盘导航与语义化结构建议

## 性能与最佳实践
- 长列表建议开启虚拟滚动或分页

## 疑难排查
- 列表不刷新：检查数据引用与键值

## 关联与示例
- 气泡组件：`LiaoMessageBubble` / `LiaoTextBubble` / `LiaoImageBubble` 等\n

