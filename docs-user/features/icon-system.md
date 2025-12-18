---
title: 图标系统 (Icon System)
description: 统一的图标管理、按需加载与 SVG 支持
updated: 2025-12-18
version: ^2.7.0
category: feature
tags: [Icon, SVG, Iconify]
---

# 图标系统 (Icon System)

## 简介

LiaoKit 的图标系统旨在提供一种灵活且高性能的方式来管理和使用图标。它结合了本地 SVG 图标和 Iconify 的在线图标库，支持按需加载、颜色控制、旋转动画以及统一的尺寸管理。

## 核心特性

- **双源支持**：
  - **本地 SVG**：自动加载 `src/assets/icons/*.svg`，构建时优化。
  - **Iconify**：支持使用 Iconify 提供的海量图标集。
- **智能渲染**：优先使用本地 SVG，未找到时回退到 Iconify。
- **样式统一**：通过 CSS 变量和 Props 控制颜色、尺寸和动画。
- **按需加载**：避免打包整个图标库，减小应用体积。

## 快速上手

### 基础用法

使用 `LiaoIcon` 组件，通过 `name` 属性指定图标名称。

```vue
<template>
  <!-- 使用本地图标 (assets/icons/home.svg) -->
  <LiaoIcon name="home" />
  
  <!-- 使用 Iconify 图标 (Material Design Icons) -->
  <LiaoIcon name="mdi:account" />
  
  <!-- 自定义尺寸和颜色 -->
  <LiaoIcon name="settings" size="large" color="#1890ff" />
  
  <!-- 旋转动画 -->
  <LiaoIcon name="loading" spin />
</template>
```

### 注册自定义图标

除了自动加载 `assets/icons` 目录下的 SVG，你也可以在运行时动态注册 SVG 图标。

```typescript
import { registerSvgIcon } from '@yuandezuohua/liaokit';

const mySvg = `<svg viewBox="0 0 24 24">...</svg>`;
registerSvgIcon('my-custom-icon', mySvg);
```

## API Reference

### Props

| 名称 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `name` | `string` | - | 图标名称。如果是本地图标，对应文件名（不含扩展名）；如果是 Iconify 图标，使用 `prefix:name` 格式。 |
| `svg` | `string` | - | 直接传入 SVG 字符串进行渲染（优先级高于 `name`）。 |
| `size` | `'small' \| 'medium' \| 'large' \| 'xlarge' \| 'auto'` | `'medium'` | 图标尺寸。 |
| `color` | `string` | - | 图标颜色 (CSS 颜色值)。 |
| `spin` | `boolean` | `false` | 是否开启旋转动画。 |
| `customClass` | `string` | - | 自定义 CSS 类名。 |

### 预设尺寸

| 尺寸名 | 大小 |
| ------ | ---- |
| `small` | 18px |
| `medium` | 20px |
| `large` | 24px |
| `xlarge` | 32px |
| `auto` | 1em (跟随字体大小) |

## 最佳实践

1. **优先使用本地 SVG**：对于项目中常用的核心图标，建议下载 SVG 文件并放入 `src/assets/icons` 目录。这样可以确保图标在离线环境下可用，且渲染性能最佳。
2. **SVG 优化**：在放入 `assets` 目录前，建议使用 SVGO 等工具优化 SVG 代码，去除无用的属性和元数据。
3. **颜色控制**：为了让图标颜色能够随 `color` 属性或 CSS `color` 变化，请确保 SVG 源码中的 `fill` 或 `stroke` 属性设置为 `currentColor`，或者移除这些属性（组件会自动处理一部分，但手动确保更可靠）。

## 目录结构示例

```text
src/
  assets/
    icons/
      home.svg
      settings.svg
      user.svg
```

使用时直接引用文件名：

```vue
<LiaoIcon name="home" />
<LiaoIcon name="settings" />
```
