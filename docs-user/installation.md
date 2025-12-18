---
title: 安装与环境要求
description: 包版本、构建工具、样式与兼容性
updated: 2025-12-18
version: ^1.x
category: guide
tags: [LiaoKit, Installation]
---

# 安装与环境要求

## 包与版本
- 组件库版本：`^1.x`（请结合根目录 `CHANGELOG.md`）
- 框架与工具：建议 Vite + Vue（其他工具需自行适配）

## 样式与资源
- 引入主样式与变量文件，避免与项目 Reset/Scope 造成冲突
- 图标、图片等静态资源按需加载，避免体积膨胀

## 兼容性
- 浏览器：现代浏览器为主，低版本需自行 Polyfill
- 无障碍：遵循语义化与可访问性建议（详见各文档的 A11y 小节）

## 版本升级注意事项
- 关注 Props/Events 变更与弃用项
- 变更遵循“向后兼容优先”的策略，破坏性变更在 `CHANGELOG.md` 明确标注

