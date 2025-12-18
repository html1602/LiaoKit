---
title: LiaoTextBubble（文本气泡）
description: 文本消息气泡组件，支持基础格式化
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoTextBubble, Component]
---

# LiaoTextBubble（文本气泡）

## 简介
- 展示纯文本或简单格式文本消息

## 快速示例
```vue
<template>
  <!-- 文本消息气泡 -->
  <!-- <LiaoTextBubble :message="message" /> -->
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoMessageBubble\LiaoTextBubble.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| content | `string` | 是 | `` |  |
| linkify | `boolean` | 否 | `true` |  |
| emoji | `boolean` | 否 | `true` |  |
| highlight | `string | string[]` | 否 | `null` |  |
| editable | `boolean` | 否 | `false` |  |
| collapsed | `boolean` | 否 | `false` |  |
| maxLines | `number` | 否 | `5` |  |
| error | `boolean` | 否 | `false` |  |
| status | `'sending' | 'failed' | 'recalled' | 'reported' | null` | 否 | `null` |  |
| theme | `'auto' | 'light' | 'dark' | 'brand'` | 否 | `auto` |  |
| sender | `{
      id?: string | number;
      name?: string;
      avatar?: string;
    }` | 否 | `() => ({})` |  |
| customStyle | `[...]` | 否 | `null` |  |
| id | `[...]` | 否 | `null` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| copy | `(...) => void` |
| link-click | `(...) => void` |
| bubble-click | `(...) => void` |
| bubble-longpress | `(...) => void` |
| expand | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoMessageBubble/LiaoTextBubble.vue`

