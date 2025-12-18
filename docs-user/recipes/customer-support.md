---
title: 客服咨询流程
description: 使用 Actions + MessageList + Progress 组合实现客服咨询闭环
updated: 2025-12-18
version: ^1.x
category: recipe
tags: [CustomerSupport, Recipe]
---

# 客服咨询流程

## 背景与目标
- 引导用户在对话中发起与完成客服咨询：选择问题 → 收集信息 → 回复与跟进

## 所需组件/插件
- 组件：`LiaoWindow`、`LiaoMessageList`、`LiaoInputArea`
- 插件：`LiaoActionsPlugin`、`LiaoProgressPlugin`

## 步骤拆解
1. 在 `LiaoWindow` 中挂载 `LiaoMessageList` 与 `LiaoInputArea`\n2. 用 `LiaoActionsPlugin` 提供常见问题分类与快捷入口\n3. 根据用户选择更新 `LiaoProgressPlugin` 的进度\n4. 收集必要信息（表单/附件），完成后给出结果与后续建议\n

## 关键交互与事件流
- `LiaoActionsPlugin@trigger` → 追加指引消息 → 更新进度\n- `LiaoInputArea@send` → 推入用户消息 → 调用客服服务/AI → 推送回复\n- 结合 `Progress` 的 `value`，在关键节点给出可视化反馈\n

## 样式与主题协调
- 统一按钮与气泡的主题色，以增强流程一致性\n

## 扩展与变体
- 接入工单系统：在关键节点创建/更新工单\n- 关联 FAQ 卡片：常见问题直接跳转到解决方案\n

## 常见问题
- 进度不更新：检查进度值与事件抛出\n- 操作不响应：检查 `actions` 配置与事件绑定\n

