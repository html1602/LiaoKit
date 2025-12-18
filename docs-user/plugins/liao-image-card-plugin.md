---
title: LiaoImageCardPlugin（图片卡片插件）
description: 以卡片形式展示图片与说明
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoImageCardPlugin, Plugin]
---

# LiaoImageCardPlugin（图片卡片插件）

## 简介
- 展示图片卡片与描述文案，支持操作按钮

## 使用示例

### 基础用法

展示单张图片卡片，常用于商品推荐或活动宣传。

```vue
<template>
  <LiaoImageCardPlugin 
    :plugin-data="cardData" 
    @action="handleAction" 
  />
</template>

<script setup>
import { ref } from 'vue';

const cardData = ref({
  image: 'https://example.com/banner.jpg',
  title: '双11超级大促',
  desc: '全场5折起，限时抢购！',
  actions: [
    { id: 'view', label: '立即查看' },
    { id: 'share', label: '分享给好友' }
  ]
});

const handleAction = ({ action }) => {
  if (action.id === 'view') {
    window.open('https://example.com/promotion');
  }
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoImageCardPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      image: string;
      title?: string;
      desc?: string;
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

## 参考
- 源码：`src/components/LiaoPlugins/LiaoImageCardPlugin.vue`

