---
title: LiaoIcon（图标）
description: 图标显示组件，配合图标系统使用
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoIcon, Component]
---

# LiaoIcon（图标）

## 简介
- 显示已注册图标，支持 `name`/`size`/`color` 等属性

## 使用示例

### 基础用法

```vue
<template>
  <!-- 本地 SVG (src/assets/icons/home.svg) -->
  <LiaoIcon name="home" />

  <!-- Iconify 图标 -->
  <LiaoIcon name="mdi:account-circle" />
</template>
```

### 尺寸与颜色

```vue
<template>
  <div class="icons">
    <LiaoIcon name="star" size="small" color="#aaa" />
    <LiaoIcon name="star" size="medium" color="#fadb14" />
    <LiaoIcon name="star" size="large" color="#fadb14" />
    
    <!-- 加载中动画 -->
    <LiaoIcon name="loading" spin />
  </div>
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoIcon\LiaoIcon.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| name | `string` | 否 | `` |  |
| svg | `string` | 否 | `` |  |
| size | `'small' | 'medium' | 'large' | 'xlarge' | 'auto'` | 否 | `medium` |  |
| color | `string` | 否 | `` |  |
| spin | `boolean` | 否 | `false` |  |
| customClass | `string` | 否 | `` |  |


### Events
无

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoIcon/LiaoIcon.vue`

