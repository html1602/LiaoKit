---
title: LiaoProgressPlugin（进度插件）
description: 展示任务或流程进度，支持与消息/操作联动
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoProgressPlugin, Plugin]
---

# LiaoProgressPlugin（进度插件）

## 简介
- 以进度条/步骤条形式展现当前任务状态，与事件联动更新

## 快速示例
```vue
<template>
  <!-- 在窗口中挂载进度插件 -->
  <!-- <LiaoProgressPlugin :value=\"value\" /> -->
</template>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoProgressPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      type?: 'bar' | 'circle' | 'steps';
      percentage?: number;
      percent?: number; // 兼容旧字段名
      status?: 'normal' | 'success' | 'warning' | 'error';
      label?: string;
      description?: string;
      steps?: Step[];
      currentStep?: number;
      estimatedTime?: string;
      actions?: Action[];
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## Slots
| 名称 | 作用域 | 用途 | 示例 |
| ---- | ------ | ---- | ---- |
| label | `{ value }` | 自定义文案 | 展示百分比 |

## 主题与样式（Theme/Vars）
| 变量名 | 默认值 | 影响范围 | 示例 |
| ------ | ------ | -------- | ---- |
| --liao-progress-height | `8px` | 高度 | 外观控制 |

## 无障碍（A11y）
- 提供 ARIA 属性与键盘可达性建议

## 性能与最佳实践
- 避免高频无意义更新，按需节流或合并

## 疑难排查
- 进度不更新：检查数据流与事件抛出

## 组合建议
- 与 `LiaoActionsPlugin`/消息列表联动，形成“操作→反馈”的闭环\n

