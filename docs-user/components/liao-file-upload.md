---
title: LiaoFileUpload（文件上传）
description: 提供文件选择与上传，支持进度与错误反馈
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoFileUpload, Component]
---

# LiaoFileUpload（文件上传）

## 简介
- 支持多文件选择、上传进度展示与错误处理

## 使用示例

### 基础用法（手动上传）

用户选择文件后，通过 `change` 事件获取文件列表，然后手动执行上传逻辑。

```vue
<template>
  <LiaoFileUpload 
    accept="image/*,application/pdf"
    :max-size="5 * 1024 * 1024" 
    @change="handleFileChange"
    @error="handleError"
  />
</template>

<script setup>
const handleFileChange = (files) => {
  console.log('用户选择了文件:', files);
  // 可以在这里调用上传 API
};

const handleError = (error) => {
  alert(`文件错误: ${error.message}`);
};
</script>
```

### 自动上传

配置 `upload-url` 和 `auto-upload`，组件会自动处理上传请求。

```vue
<LiaoFileUpload 
  :auto-upload="true"
  upload-url="/api/upload"
  :upload-headers="{ Authorization: 'Bearer xxx' }"
  @upload-success="handleSuccess"
/>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoFileUpload\LiaoFileUpload.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| accept | `string` | 否 | `*/*` |  |
| multiple | `boolean` | 否 | `true` |  |
| disabled | `boolean` | 否 | `false` |  |
| maxFiles | `number` | 否 | `10` |  |
| maxSize | `number` | 否 | `10 * 1024 * 1024` |  |
| maxTotalSize | `number` | 否 | `100 * 1024 * 1024` |  |
| primaryText | `string` | 否 | `点击或拖拽文件到此处上传` |  |
| secondaryText | `string` | 否 | `支持单个或批量上传` |  |
| acceptText | `string` | 否 | `` |  |
| showUploadButton | `boolean` | 否 | `true` |  |
| showClearButton | `boolean` | 否 | `true` |  |
| showDownload | `boolean` | 否 | `false` |  |
| showPreview | `boolean` | 否 | `true` |  |
| showRemove | `boolean` | 否 | `true` |  |
| showStats | `boolean` | 否 | `true` |  |
| autoUpload | `boolean` | 否 | `false` |  |
| uploadUrl | `string` | 否 | `` |  |
| uploadHeaders | `Record<string, string>` | 否 | `() => ({})` |  |
| uploadData | `Record<string, any>` | 否 | `() => ({})` |  |
| modelValue | `PreviewFile[]` | 否 | `() => []` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(...) => void` |
| change | `(...) => void` |
| upload-start | `(...) => void` |
| upload-progress | `(...) => void` |
| upload-success | `(...) => void` |
| upload-error | `(...) => void` |
| upload-complete | `(...) => void` |
| file-add | `(...) => void` |
| file-remove | `(...) => void` |
| file-preview | `(...) => void` |
| error | `(...) => void` |

<!-- @auto-api-end -->

## 最佳实践
- 控制选择文件类型与大小，避免无效请求

## 参考
- 源码：`src/components/LiaoFileUpload/LiaoFileUpload.vue`

