---
title: LiaoQuickActionBar（快捷操作栏）
description: 提供一组快捷操作按钮，配合输入与消息
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoQuickActionBar, Component]
---

# LiaoQuickActionBar（快捷操作栏）

## 简介
- 将常用操作以按钮形式集中展示，提升输入与消息处理效率

## 使用示例

### 基础用法

定义一个操作数组，传入组件。

```vue
<template>
  <LiaoQuickActionBar 
    :actions="quickActions" 
    @action-click="handleClick" 
  />
</template>

<script setup>
import { ref } from 'vue';

const quickActions = ref([
  { id: 'retry', label: '重试', icon: 'refresh' },
  { id: 'copy', label: '复制', icon: 'copy' },
  { id: 'feedback', label: '反馈', icon: 'thumb-up' }
]);

const handleClick = (action) => {
  console.log('点击了:', action.label);
  if (action.id === 'retry') {
    // 执行重试逻辑
  }
};
</script>
```

### 垂直布局

适用于侧边工具栏场景。

```vue
<LiaoQuickActionBar 
  :actions="actions" 
  :vertical="true" 
  :show-label="false"
/>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoQuickActionBar\LiaoQuickActionBar.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| actions | `QuickAction[]` | 否 | `() => []` |  |
| vertical | `boolean` | 否 | `false` |  |
| fixed | `boolean` | 否 | `false` |  |
| showLabel | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| showScrollIndicators | `boolean` | 否 | `true` |  |
| scrollStep | `number` | 否 | `200` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action-click | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoQuickActionBar/LiaoQuickActionBar.vue`

