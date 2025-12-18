---
title: LiaoPluginDebugger（插件调试器）
description: 可视化调试插件状态与事件流
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoPluginDebugger, Plugin]
---

# LiaoPluginDebugger（插件调试器）

## 简介
- 用于在开发过程中观察插件状态与事件，便于诊断问题

## 使用示例

### 基础用法

仅在开发环境使用，用于查看插件原始数据。

```vue
<template>
  <LiaoPluginDebugger :plugin-data="rawPluginData" />
</template>

<script setup>
const rawPluginData = {
  foo: 'bar',
  nested: { a: 1, b: 2 }
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoPluginDebugger.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `object` | 否 | `() => ({})` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoPluginDebugger.vue`

