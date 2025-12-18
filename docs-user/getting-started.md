---
title: 快速开始
description: 安装、引入与最小可运行示例
updated: 2025-12-18
version: ^1.x
category: guide
tags: [LiaoKit, GettingStarted]
---

# 快速开始

## 前置条件
- Node.js 与包管理器（建议 `npm`/`pnpm`）
- 构建工具与框架兼容（示例以 Vite + Vue 为主）

## 安装与引入
```bash
# 安装（根据你的包名与发布方式调整）
npm install liaokit
```

在应用入口中引入基础样式与核心组件：
```ts
// 示例：在 main.ts 中引入（按实际导出路径调整）
// import { LiaoWindow } from 'liaokit'
// import 'liaokit/styles/main.css'
```

## 最小示例
```vue
<!-- 运行于你的页面或路由组件中 -->
<template>
  <!-- 根据你的导出选择对应组件 -->
  <!-- <LiaoWindow /> -->
  <!-- <LiaoMessageList /> -->
</template>

<script setup lang="ts">
// 此处按你的实际包导出路径引入组件
// import { LiaoWindow } from 'liaokit'
</script>
```

## 常见落坑预防
- 样式未生效：确认主样式与变量文件已引入，避免与项目 Reset 冲突
- 图标/资源：如使用内置图标系统，确保正确注册与按需导入
- 流式/适配器：若开启 SSE/流式渲染，校验服务端响应与前端事件订阅

## 下一步
- 阅读 [核心概念](./core-concepts.md)\n- 按需选择 [组件总览](./components/README.md) 或 [插件总览](./plugins/README.md)\n- 直接进入 [场景组合索引](./recipes/README.md) 开始实战\n

