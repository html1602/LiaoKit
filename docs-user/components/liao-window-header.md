---
title: LiaoWindowHeader（窗口头部）
description: 窗口控制栏，显示标题与操作
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoWindowHeader, Component]
---

# LiaoWindowHeader（窗口头部）

## 简介
- 窗口顶部区域，显示标题与最小化/关闭等操作

## 使用示例

### 基础用法

一般嵌套在 `LiaoWindow` 内部使用。

```vue
<template>
  <LiaoWindow>
    <template #header>
      <LiaoWindowHeader 
        title="会话标题" 
        @close="onClose" 
        @minimize="onMinimize"
      />
    </template>
    ...
  </LiaoWindow>
</template>
```

### 自定义样式

支持修改背景色和图标颜色。

```vue
<LiaoWindowHeader 
  title="警告窗口" 
  background-color="#ff4d4f" 
  title-color="#fff"
  icons-color="#fff"
/>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoWindowHeader\LiaoWindowHeader.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| title | `string` | 否 | `` |  |
| showClose | `boolean` | 否 | `true` |  |
| showMinimize | `boolean` | 否 | `true` |  |
| showMaximize | `boolean` | 否 | `true` |  |
| backgroundColor | `string` | 否 | `` |  |
| titleColor | `string` | 否 | `` |  |
| iconsColor | `string` | 否 | `` |  |
| minimizeIconColor | `string` | 否 | `` |  |
| maximizeIconColor | `string` | 否 | `` |  |
| closeIconColor | `string` | 否 | `` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| close | `(...) => void` |
| minimize | `(...) => void` |
| maximize | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoWindowHeader/LiaoWindowHeader.vue`

