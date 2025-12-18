---
title: LiaoImageBubble（图片气泡）
description: 图片消息气泡组件，支持预览与尺寸控制
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoImageBubble, Component]
---

# LiaoImageBubble（图片气泡）

## 简介
- 显示图片消息，支持预览、懒加载与尺寸控制

## 快速示例
```vue
<template>
  <!-- 图片消息气泡 -->
  <!-- <LiaoImageBubble :message="message" /> -->
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoMessageBubble\LiaoImageBubble.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| imageUrl | `string` | 是 | `` |  |
| alt | `string` | 否 | `Image` |  |
| type | `'self' | 'other' | 'system'` | 否 | `other` |  |
| avatar | `string` | 否 | `` |  |
| showAvatar | `boolean` | 否 | `true` |  |
| showAvatarSelf | `boolean` | 否 | `true` |  |
| name | `string` | 否 | `` |  |
| showName | `boolean` | 否 | `false` |  |
| time | `[...]` | 否 | `` |  |
| showTime | `boolean` | 否 | `true` |  |
| timeFormat | `string` | 否 | `HH:mm` |  |
| highlight | `boolean` | 否 | `false` |  |
| status | `'sending' | 'sent' | 'failed' | 'streaming'` | 否 | `sent` |  |
| maxWidth | `number` | 否 | `240` |  |
| maxHeight | `number` | 否 | `240` |  |
| minWidth | `number` | 否 | `100` |  |
| minHeight | `number` | 否 | `100` |  |
| loading | `boolean` | 否 | `false` |  |
| error | `boolean` | 否 | `false` |  |
| loadingText | `string` | 否 | `图片加载中...` |  |
| errorText | `string` | 否 | `图片加载失败` |  |
| showInfo | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| click | `(...) => void` |
| image-click | `(...) => void` |
| context-menu | `(...) => void` |
| preview | `(...) => void` |
| preview-close | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoMessageBubble/LiaoImageBubble.vue`

