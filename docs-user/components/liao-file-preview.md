---
title: LiaoFilePreview（文件预览）
description: 统一的文件预览组件，支持图片/文档/多媒体
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoFilePreview, Component]
---

# LiaoFilePreview（文件预览）

## 简介
- 结合消息或插件为文件提供统一预览能力

## 使用示例

### 基础用法

展示文件列表，支持移除和点击预览。

```vue
<template>
  <LiaoFilePreview 
    :files="fileList" 
    @remove="handleRemove"
    @preview="handlePreview"
  />
</template>

<script setup>
import { ref } from 'vue';

const fileList = ref([
  { 
    name: 'photo.jpg', 
    type: 'image/jpeg', 
    url: 'https://example.com/p.jpg',
    size: 20480 
  },
  {
    name: 'report.pdf',
    type: 'application/pdf',
    size: 102400
  }
]);

const handleRemove = (index) => {
  fileList.value.splice(index, 1);
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoFilePreview\LiaoFilePreview.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| files | `PreviewFile[]` | 否 | `() => []` |  |
| loading | `boolean` | 否 | `false` |  |
| showDownload | `boolean` | 否 | `true` |  |
| showPreview | `boolean` | 否 | `true` |  |
| showRemove | `boolean` | 否 | `true` |  |
| emptyText | `string` | 否 | `暂无文件` |  |
| maxPreviewSize | `number` | 否 | `10 * 1024 * 1024` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| remove | `(...) => void` |
| download | `(...) => void` |
| preview | `(...) => void` |
| error | `(...) => void` |

<!-- @auto-api-end -->

## 最佳实践
- 大文件与私有资源需处理加载态与鉴权

## 参考
- 源码：`src/components/LiaoFilePreview/LiaoFilePreview.vue`

