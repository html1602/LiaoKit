---
title: LiaoListPlugin（列表插件）
description: 列表项选择与“更多”操作，常用于导航与选项
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoListPlugin, Plugin]
---

# LiaoListPlugin（列表插件）

## 简介
- 列表展示并支持选择、加载更多等交互

## 使用示例

### 基础用法

展示一个带图片和描述的列表，支持搜索。

```vue
<template>
  <LiaoListPlugin 
    :plugin-data="listData" 
    @action="handleItemClick" 
  />
</template>

<script setup>
import { ref } from 'vue';

const listData = ref({
  title: '搜索结果',
  enableSearch: true,
  searchPlaceholder: '过滤结果...',
  items: [
    { 
      id: 'p1', 
      title: 'iPhone 15 Pro', 
      description: '钛金属原色 | 256GB',
      image: 'https://example.com/iphone.jpg',
      badge: '新品'
    },
    { 
      id: 'p2', 
      title: 'AirPods Pro 2', 
      description: '主动降噪 | USB-C',
      image: 'https://example.com/airpods.jpg'
    }
  ]
});

const handleItemClick = ({ action, item }) => {
  if (action === 'select') {
    console.log('选择了商品:', item.title);
  }
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoListPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      subtitle?: string;
      items: ListItem[];
      actions?: ItemAction[];
      showImages?: boolean;
      showBadges?: boolean;
      // 搜索相关配置
      enableSearch?: boolean;
      searchPlaceholder?: string;
      searchFields?: string[]; // 指定搜索的字段，为空则搜索所有字段
      searchCaseSensitive?: boolean; // 是否区分大小写
      searchHighlight?: boolean; // 是否高亮搜索结果
    }` | 否 | `() => ({})` |  |
| status | `string` | 否 | `normal` |  |
| loading | `boolean` | 否 | `false` |  |
| readonly | `boolean` | 否 | `false` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| action | `(...) => void` |
| search | `(...) => void` |

<!-- @auto-api-end -->

## 参考
- 源码：`src/components/LiaoPlugins/LiaoListPlugin.vue`

