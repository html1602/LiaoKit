---
title: LiaoFaqCardPlugin（FAQ 卡片插件）
description: 以卡片形式展示常见问题与答案
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoFaqCardPlugin, Plugin]
---

# LiaoFaqCardPlugin（FAQ 卡片插件）

## 简介
- 以卡片形式展示常见问题，支持展开/跳转等交互

## 使用示例

### 基础用法

展示常见问题列表，点击问题触发回调（通常用于自动发送问题）。

```vue
<template>
  <LiaoFaqCardPlugin 
    :plugin-data="faqData" 
    @action="handleFaqClick" 
  />
</template>

<script setup>
import { ref } from 'vue';

const faqData = ref({
  title: '猜你想问',
  items: [
    { id: 'q1', question: '如何修改密码？' },
    { id: 'q2', question: '退款流程是怎样的？' },
    { id: 'q3', question: '联系人工客服' }
  ]
});

const handleFaqClick = ({ action, item }) => {
  console.log('点击了问题:', item.question);
  // 这里通常调用发送消息方法
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoFaqCardPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      items?: FaqItem[];
      footerText?: string;
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoFaqCardPlugin.vue`

