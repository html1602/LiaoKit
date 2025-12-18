---
title: LiaoTimelinePlugin（时间线插件）
description: 以时间线形式展示事件流与状态
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoTimelinePlugin, Plugin]
---

# LiaoTimelinePlugin（时间线插件）

## 简介
- 展示关键事件按时间排序，并标注状态与说明

## 使用示例

### 基础用法

展示物流追踪、操作日志等时间流信息。

```vue
<template>
  <LiaoTimelinePlugin :plugin-data="timelineData" />
</template>

<script setup>
import { ref } from 'vue';

const timelineData = ref({
  title: '物流详情',
  items: [
    { 
      time: '2023-12-18 10:00', 
      title: '已签收', 
      description: '您的包裹已由前台签收',
      status: 'success'
    },
    { 
      time: '2023-12-18 08:00', 
      title: '派送中', 
      description: '快递员正在为您派送',
      status: 'processing'
    }
  ]
});
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoTimelinePlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      description?: string;
      items: TimelineItem[];
      layout?: 'vertical' | 'horizontal';
      size?: 'small' | 'default' | 'large';
      showMore?: boolean;
      loadMoreText?: string;
      showStats?: boolean;
      stats?: TimelineStats[];
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoTimelinePlugin.vue`

