---
title: LiaoFileChipList（文件标签列表）
description: 以标签形式展示已选择的文件列表
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoFileChipList, Component]
---

# LiaoFileChipList（文件标签列表）

## 简介
- 以“Chip 标签”形式展示当前选择/上传的文件集合，支持移除与预览

## 使用示例

### 基础用法

通常用于输入框上方，展示已选择但未发送的文件。

```vue
<template>
  <div class="input-container">
    <LiaoFileChipList 
      v-if="files.length"
      :files="files" 
      @remove="handleRemove" 
    />
    <LiaoInputArea ... />
  </div>
</template>

<script setup>
const files = ref([
  { name: 'config.json', type: 'application/json' },
  { name: 'logo.png', type: 'image/png' }
]);

const handleRemove = (file, index) => {
  files.value.splice(index, 1);
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoFileChipList\LiaoFileChipList.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| files | `FileMeta[]` | 否 | `() => []` |  |
| maxNameLength | `number` | 否 | `16` |  |
| disabled | `boolean` | 否 | `false` |  |
| showRemove | `boolean` | 否 | `true` |  |


### Events
无

<!-- @auto-api-end -->

## 主题与样式（Theme/Vars）
- 标签大小与间距等可通过主题变量调整

## 参考
- 源码：`src/components/LiaoFileChipList/LiaoFileChipList.vue`

