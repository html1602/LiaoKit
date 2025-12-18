---
title: LiaoMediaCarouselPlugin（媒体轮播插件）
description: 图片/视频等媒体轮播展示
updated: 2025-12-18
version: ^1.x
category: plugin
tags: [LiaoMediaCarouselPlugin, Plugin]
---

# LiaoMediaCarouselPlugin（媒体轮播插件）

## 简介
- 轮播展示多媒体内容，支持自动播放与切换事件

## 使用示例

### 基础用法

展示一组轮播图片，支持自动播放。

```vue
<template>
  <LiaoMediaCarouselPlugin 
    :plugin-data="carouselData" 
    @action="handleClick" 
  />
</template>

<script setup>
import { ref } from 'vue';

const carouselData = ref({
  autoplay: true,
  interval: 3000,
  items: [
    { type: 'image', url: 'img1.jpg', caption: '风景 1' },
    { type: 'image', url: 'img2.jpg', caption: '风景 2' }
  ]
});

const handleClick = ({ action, item }) => {
  // 点击图片后的逻辑，如全屏预览
  console.log('点击:', item);
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoPlugins\LiaoMediaCarouselPlugin.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| pluginData | `{
      title?: string;
      items: MediaItem[];
      autoplay?: boolean;
      interval?: number;
      showControls?: boolean;
      showIndicators?: boolean;
      enableItemClick?: boolean; // 是否启用项目点击
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
- 源码：`src/components/LiaoPlugins/LiaoMediaCarouselPlugin.vue`

