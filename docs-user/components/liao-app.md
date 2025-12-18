---
title: LiaoApp（应用容器）
description: 企业级应用根容器，整合窗口与全局状态
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoApp, Component]
---

# LiaoApp（应用容器）

## 简介
- 作为应用根容器，管理多窗口与全局状态、路由等

## 使用示例

### 基础用法（单窗口模式）

LiaoApp 作为一个高度集成的组件，可以直接提供完整的聊天界面。

```vue
<template>
  <LiaoApp
    v-model="inputValue"
    :messages="messageList"
    @send="handleSend"
    @load-more="fetchHistory"
  />
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');
const messageList = ref([
  // ... 初始消息
]);

const handleSend = (text) => {
  // 发送逻辑
  messageList.value.push({
    id: Date.now(),
    type: 'text',
    content: text,
    isSelf: true
  });
  inputValue.value = '';
};

const fetchHistory = () => {
  // 加载历史消息
};
</script>
```

### 多窗口布局（Window Mode）

如果需要构建类似微信/Slack 的多窗口应用，可以将 `windowMode` 设置为 `true`，此时它作为一个布局容器，你需要手动组合 `LiaoWindowList` 和 `LiaoWindow`。

```vue
<template>
  <LiaoApp :window-mode="true" class="my-chat-app">
    <template #sidebar>
      <LiaoWindowList 
        :windows="sessions"
        :active-id="currentSessionId"
        @select="handleSessionSelect"
      />
    </template>
    
    <template #main>
      <LiaoWindow v-if="currentSessionId">
        <LiaoWindowHeader :title="currentSession.name" />
        <LiaoMessageList :messages="currentSession.messages" />
        <LiaoInputArea @send="handleSend" />
      </LiaoWindow>
      <div v-else class="empty-state">请选择一个会话</div>
    </template>
  </LiaoApp>
</template>

<style scoped>
.my-chat-app {
  height: 100vh;
  /* 自定义布局样式 */
}
</style>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoApp\LiaoApp.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| windowMode | `boolean` | 否 | `false` |  |
| customClass | `string` | 否 | `` |  |
| messages | `Message[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| emptyText | `string` | 否 | `暂无消息` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showName | `boolean` | 否 | `false` |  |
| showTime | `boolean` | 否 | `true` |  |
| hasMore | `boolean` | 否 | `false` |  |
| loadMoreText | `string` | 否 | `加载更多` |  |
| scrollToBottom | `boolean` | 否 | `true` |  |
| showInput | `boolean` | 否 | `true` |  |
| modelValue | `string` | 否 | `` |  |
| inputPlaceholder | `string` | 否 | `请输入...` |  |
| inputDisabled | `boolean` | 否 | `false` |  |
| inputReadonly | `boolean` | 否 | `false` |  |
| inputRows | `number` | 否 | `2` |  |
| inputMaxLength | `number` | 否 | `0` |  |
| showInputLength | `boolean` | 否 | `true` |  |
| inputExpanded | `boolean` | 否 | `false` |  |
| sendOnEnter | `boolean` | 否 | `true` |  |
| sendOnCtrlEnter | `boolean` | 否 | `false` |  |
| sendEmpty | `boolean` | 否 | `false` |  |
| showQuickActions | `boolean` | 否 | `false` |  |
| quickActions | `QuickAction[]` | 否 | `() => []` |  |
| quickActionsVertical | `boolean` | 否 | `false` |  |
| quickActionsFixed | `boolean` | 否 | `false` |  |
| showQuickActionLabel | `boolean` | 否 | `true` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(...) => void` |
| send | `(...) => void` |
| load-more | `(...) => void` |
| scroll | `(...) => void` |
| scroll-to-top | `(...) => void` |
| scroll-to-bottom | `(...) => void` |
| input-focus | `(...) => void` |
| input-blur | `(...) => void` |
| input-keydown | `(...) => void` |
| quick-action | `(...) => void` |

<!-- @auto-api-end -->

## 主题与样式（Theme/Vars）
- 统一管理页面级样式与主题变量的注入与覆盖

## A11y
- 建议提供主导航的键盘可达性与语义标签

## 最佳实践
- 将跨窗口的状态上移至应用层，避免深层级通信

## 参考
- 源码：`src/components/LiaoApp/LiaoApp.vue`

