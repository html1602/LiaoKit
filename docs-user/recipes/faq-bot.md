---
title: FAQ 问答机器人
description: 使用 AI Adapter + MessageBubble 组合实现常见问题自动回复
updated: 2025-12-18
version: ^1.x
category: recipe
tags: [FAQBot, Recipe]
---

# FAQ 问答机器人

## 背景与目标
- 自动识别问题并返回标准答案，支持追问与上下文

## 所需组件/插件
- 组件：`LiaoMessageList`、`LiaoMessageBubble`/`LiaoTextBubble`\n- 功能：`AI 适配器` 与 `流式渲染`\n

## 步骤拆解
1. 用户提问 → 推入消息列表\n2. 通过 `AI 适配器` 请求 FAQ 服务（可本地/远端）\n3. 流式渲染答案并支持追问与上下文关联\n

## 关键交互与事件流
- `InputArea@send` → 触发 AI 请求 → `MessageList` 接收流式增量 → 渲染\n

## 样式与主题协调
- 答案气泡采用 info 风格，追问采用强调样式\n

## 扩展与变体
- FAQ 卡片插件作为导航入口\n- 结合列表插件，提供“相似问题”推荐\n

## 常见问题
- 流式卡顿：检查 SSE 配置与错误处理\n- 答案不准确：校验提示词与知识库质量\n

