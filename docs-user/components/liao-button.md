---
title: LiaoButton（按钮）
description: 基础交互元件，支持多种尺寸与状态
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoButton, Component]
---

# LiaoButton（按钮）

## 简介
- 提供基础交互按钮，适配不同场景与主题

## 使用示例

### 基础用法

```vue
<template>
  <div class="btn-group">
    <LiaoButton>默认按钮</LiaoButton>
    <LiaoButton type="primary">主按钮</LiaoButton>
    <LiaoButton type="default">次按钮</LiaoButton>
  </div>
</template>
```

### 图标与禁用状态

```vue
<template>
  <LiaoButton disabled>禁用状态</LiaoButton>
  
  <LiaoButton>
    <template #icon>
      <LiaoIcon name="settings" />
    </template>
    设置
  </LiaoButton>
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoButton\LiaoButton.vue`

### Props
无


### Events
无

<!-- @auto-api-end -->

## 主题与样式（Theme/Vars）
- 按主题变量控制尺寸、颜色与边框

## A11y
- 提供键盘触发与可达性建议

## 参考
- 源码：`src/components/LiaoButton/LiaoButton.vue`
