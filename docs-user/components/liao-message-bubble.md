---
title: LiaoMessageBubble（消息气泡基础）
description: 文本/Markdown 等消息的基础气泡组件
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoMessageBubble, Component]
---

# LiaoMessageBubble（消息气泡基础）

## 简介
- 用于承载常规文本与 Markdown 内容的基础消息气泡

## 快速示例
```vue
<template>
  <!-- 基础消息气泡 -->
  <!-- <LiaoMessageBubble :message="message" /> -->
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoMessageBubble\LiaoMessageBubble.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| content | `string` | 否 | `` |  |
| type | `'self' | 'other' | 'system'` | 否 | `other` |  |
| avatar | `string` | 否 | `` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showAvatarSelf | `boolean` | 否 | `true` |  |
| name | `string` | 否 | `` |  |
| showName | `boolean` | 否 | `false` |  |
| time | `[...]` | 否 | `` |  |
| showTime | `boolean` | 否 | `false` |  |
| timeFormat | `string` | 否 | `HH:mm` |  |
| highlight | `boolean` | 否 | `false` |  |
| status | `MessageStatus` | 否 | `sent` |  |
| enableMarkdown | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| click | `(...) => void` |
| context-menu | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoMessageBubble/LiaoMessageBubble.vue`

