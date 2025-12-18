---
title: 订单处理工作流
description: 使用 Timeline + Stats + FilePreview 组合实现订单流程追踪
updated: 2025-12-18
version: ^1.x
category: recipe
tags: [OrderWorkflow, Recipe]
---

# 订单处理工作流

## 背景与目标
- 在对话中呈现订单状态、统计与附件，提升处理效率

## 所需组件/插件
- 组件：`LiaoWindow`、`LiaoMessageList`、`LiaoFilePreview`\n- 插件：`LiaoTimelinePlugin`、`LiaoStatsPlugin`\n

## 步骤拆解
1. 订单创建：推送时间线事件“已创建”\n2. 支付与发货：更新时间线并展示统计指标（支付率/时效）\n3. 售后附件：通过 FilePreview 展示单据与截图\n

## 关键交互与事件流
- 后端事件订阅 → 更新 `Timeline` 与 `Stats`\n- 用户上传附件 → `FilePreview` 展示并归档到消息流\n

## 样式与主题协调
- 时间线与统计卡保持统一色系与间距\n

## 扩展与变体
- 接入物流轨迹与地图\n- 与表单插件协作完成售后申请\n

## 常见问题
- 指标不刷新：检查数据来源与事件订阅\n- 附件无法预览：校验文件类型与访问权限\n

