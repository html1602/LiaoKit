---
title: LiaoStatsPlugin（统计插件）
description: 展示统计数据与趋势，可联动图表
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoStatsPlugin, Plugin]
---

# LiaoStatsPlugin（统计插件）

## 简介
- 展示关键指标与趋势，支持与图表库协作

## 使用示例

### 基础用法

展示一组关键指标，如日活、转化率等。

```vue
<template>
  <LiaoStatsPlugin :plugin-data="statsData" />
</template>

<script setup>
import { ref } from 'vue';

const statsData = ref({
  title: '今日数据概览',
  items: [
    { 
      label: '访问量 (PV)', 
      value: '12,345', 
      trend: 'up', 
      trendValue: '12%' 
    },
    { 
      label: '转化率', 
      value: '2.5%', 
      trend: 'down', 
      trendValue: '0.3%' 
    }
  ]
});
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoStatsPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      items: StatsItem[];
      layout?: 'default' | 'compact';
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
- 源码：`src/components/LiaoPlugins/LiaoStatsPlugin.vue`

