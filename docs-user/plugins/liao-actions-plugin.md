---
title: LiaoActionsPlugin（操作栏插件）
description: 提供常用操作入口，配合输入与消息交互
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoActionsPlugin, Plugin]
---

# LiaoActionsPlugin（操作栏插件）

## 简介
- 在窗口或输入区域附近提供一组可配置的操作入口

## 使用示例

### 基础用法

该插件通常作为消息体的一部分，由 `LiaoMessageList` 自动渲染（当消息类型匹配且数据结构符合时）。也可以单独使用。

```vue
<template>
  <LiaoActionsPlugin 
    :plugin-data="data" 
    @action="handleAction" 
  />
</template>

<script setup>
import { ref } from 'vue';

const data = ref({
  title: '请选择操作',
  actions: [
    { id: 'track', label: '查询物流', icon: 'truck' },
    { id: 'refund', label: '申请退款', icon: 'money' }
  ],
  layout: 'grid',
  columns: 2
});

const handleAction = ({ action }) => {
  console.log('触发操作:', action.id);
};
</script>
```

### 消息中的数据结构

如果在 `LiaoMessageList` 中使用，消息对象应如下构造：

```javascript
const message = {
  id: 1,
  type: 'plugin',
  content: 'plugin-actions', // 插件类型标识
  data: {
    title: '热门服务',
    actions: [...]
  }
};
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoActionsPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      description?: string;
      actions: Action[];
      layout?: 'grid' | 'list';
      columns?: number;
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## Slots
| 名称 | 作用域 | 用途 | 示例 |
| ---- | ------ | ---- | ---- |
| item | `{ action }` | 自定义操作项 | 自定义展示 |

## 主题与样式（Theme/Vars）
| 变量名 | 默认值 | 影响范围 | 示例 |
| ------ | ------ | -------- | ---- |
| --liao-action-gap | `8px` | 操作间距 | 布局控制 |

## 无障碍（A11y）
- 提供可聚焦与键盘触发能力

## 性能与最佳实践
- 操作项按需渲染，避免过多 DOM

## 疑难排查
- 操作不响应：检查事件绑定与回调签名

## 组合建议
- 与 `LiaoInputArea`/`LiaoMessageList` 协作，实现快捷输入与反馈\n

