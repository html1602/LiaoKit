---
title: LiaoPluginBubble（插件气泡容器）
description: 容纳插件型消息的容器，承载交互能力
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoPluginBubble, Component]
---

# LiaoPluginBubble（插件气泡容器）

## 简介
- 用于在消息中承载插件型内容，与插件事件联动

## 快速示例
```vue
<template>
  <!-- 插件气泡容器 -->
  <!-- <LiaoPluginBubble :message="message" /> -->
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoMessageBubble\LiaoPluginBubble.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginType | `string` | 否 | `` |  |
| pluginData | `object` | 否 | `() => ({})` |  |
| status | `'normal' | 'success' | 'error' | 'warning' | 'info'` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |
| errorMessage | `string` | 否 | `` |  |
| id | `[...]` | 否 | `null` |  |
| messageId | `[...]` | 否 | `null` |  |
| pluginRequired | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
| click | `(...) => void` |
| context-menu | `(...) => void` |
| complete | `(...) => void` |
| cancel | `(...) => void` |
| error | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoMessageBubble/LiaoPluginBubble.vue`

