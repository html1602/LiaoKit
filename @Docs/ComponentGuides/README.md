# LiaoKit 组件指南目录

> 提示：如果你是“组件库使用者”，请前往使用文档模块（User Guide）：`./../../docs-user/README.md`，该模块从使用视角提供快速开始、组件/插件说明、场景组合与 FAQ 等内容。本目录主要面向“开发向”与内部调试说明。

![版本](https://img.shields.io/badge/版本-2.8.5-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--07--03-green.svg)

本目录包含 LiaoKit 组件库中所有组件的详细使用指南。每个组件都有独立的文档，包括属性、事件、插槽和使用示例。

## 最近更新

- **2025-07-03**: 修复了组件库导入错误和版本号一致性问题
- **2025-06-26**: 添加了历史消息加载文档
- **2025-06-25**: 完善了会话状态管理指南
- **2025-06-24**: 添加了 AI 消息适配器文档

## 组件分类

### 核心组件
- [LiaoApp](./LiaoApp.md) - 应用容器组件
- [LiaoWindow](./LiaoWindow.md) - 窗口组件
- [LiaoWindowHeader](./LiaoWindowHeader.md) - 窗口标题栏组件

### 消息组件
- [LiaoMessageList](./LiaoMessageList.md) - 消息列表组件
- [LiaoMessageBubble](./LiaoMessageBubble.md) - 消息气泡基础组件
- [LiaoTextBubble](./LiaoTextBubble.md) - 文本消息气泡
- [LiaoImageBubble](./LiaoImageBubble.md) - 图片消息气泡
- [LiaoFileBubble](./LiaoFileBubble.md) - 文件消息气泡
- [LiaoPluginBubble](./LiaoPluginBubble.md) - 插件消息气泡

### 输入组件
- [LiaoInputArea](./LiaoInputArea.md) - 输入区域组件
- [LiaoQuickActionBar](./LiaoQuickActionBar.md) - 快捷操作栏

### 插件组件
- [LiaoInfoPlugin](./LiaoInfoPlugin.md) - 信息插件
- [LiaoActionsPlugin](./LiaoActionsPlugin.md) - 操作按钮插件
- [LiaoProgressPlugin](./LiaoProgressPlugin.md) - 进度条插件
- [LiaoMediaCarouselPlugin](./LiaoMediaCarouselPlugin.md) - 媒体轮播插件
- [LiaoTimelinePlugin](./LiaoTimelinePlugin.md) - 时间线插件
- [LiaoVotePlugin](./LiaoVotePlugin.md) - 投票插件
- [LiaoStatsPlugin](./LiaoStatsPlugin.md) - 统计数据插件

### 工具组件
- [LiaoIcon](./LiaoIcon.md) - 图标组件
- [LiaoFilePreview](./LiaoFilePreview.md) - 文件预览组件

### 功能指南
- [LiaoSessionStateManagement](./LiaoSessionStateManagement.md) - 会话状态管理
- [StreamingWithAIAdapter](./StreamingWithAIAdapter.md) - 流式输出与AI适配器
- [AiMessageAdapter](./AiMessageAdapter.md) - AI消息适配器

## 如何使用这些文档

每个组件文档都遵循统一的结构，包括：

1. 组件介绍和功能特性
2. 基础用法示例
3. 属性、事件和插槽表格
4. 高级用法示例
5. 样式定制指南
6. 注意事项和最佳实践
7. 更新日志

## 版本管理

所有组件文档都遵循语义化版本规范，版本号与组件库保持一致：

- **主版本号（Major）**：不兼容的API变更
- **次版本号（Minor）**：向下兼容的功能性新增
- **修订号（Patch）**：向下兼容的问题修正 
