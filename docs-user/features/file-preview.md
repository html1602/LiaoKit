---
title: 文件预览 (File Preview)
description: 内置的统一文件预览组件，支持图片、视频、音频和文本
updated: 2025-12-18
version: ^2.7.0
category: feature
tags: [File, Preview, Media]
---

# 文件预览 (File Preview)

## 简介

LiaoKit 提供了一个功能强大的文件预览组件 `LiaoFilePreview`，用于展示文件列表、上传进度以及进行全屏预览。它内置了对图片、视频、音频和文本文件的支持，并提供了下载、移除等交互功能。

## 核心特性

- **多格式支持**：
  - 图片：`image/*` (jpg, png, gif, webp, svg 等)
  - 视频：`video/*` (mp4, webm, ogg 等)
  - 音频：`audio/*` (mp3, wav, ogg 等)
  - 文本：`text/*` (txt, json, md, js, css 等，支持高亮显示)
  - 文档：显示对应的图标 (pdf, word, excel, ppt, zip 等)
- **智能加载**：
  - 支持 `File` 对象和 URL 字符串。
  - 自动为本地媒体文件创建 Object URL 进行预览。
  - 自动清理 Object URL 防止内存泄漏。
  - 文本文件自动加载内容预览。
- **全屏预览**：
  - 点击图片/文本/预览按钮可进入全屏模式。
  - 支持键盘导航 (左右切换、Esc 关闭)。
  - 全屏模式下支持媒体播放控件。

## 快速上手

### 基础用法

```vue
<template>
  <LiaoFilePreview
    :files="fileList"
    @remove="handleRemove"
    @download="handleDownload"
  />
</template>

<script setup>
import { ref } from 'vue';
import { LiaoFilePreview } from '@yuandezuohua/liaokit';

const fileList = ref([
  {
    name: 'photo.jpg',
    type: 'image/jpeg',
    url: 'https://example.com/photo.jpg',
    size: 1024 * 50
  },
  {
    name: 'document.pdf',
    type: 'application/pdf',
    size: 1024 * 1024 * 2
  }
]);

const handleRemove = (index) => {
  fileList.value.splice(index, 1);
};

const handleDownload = (file) => {
  console.log('Downloading:', file.name);
};
</script>
```

### 上传场景

在文件上传过程中，可以利用 `progress` 属性显示进度条。

```javascript
const uploadingFile = {
  name: 'big-video.mp4',
  type: 'video/mp4',
  size: 1024 * 1024 * 50,
  file: rawFileObj, // 传入原始 File 对象以生成本地预览
  progress: 45,     // 显示进度条
  loading: true     // 显示加载/处理状态
};
```

## API Reference

### Props

| 名称 | 类型 | 默认值 | 说明 |
| ---- | ---- | ------ | ---- |
| `files` | `PreviewFile[]` | `[]` | 文件列表 |
| `showRemove` | `boolean` | `true` | 是否显示移除按钮 |
| `showDownload` | `boolean` | `true` | 是否显示下载按钮 |
| `showPreview` | `boolean` | `true` | 是否显示预览按钮 |
| `emptyText` | `string` | `'暂无文件'` | 空列表时的提示文本 |
| `loading` | `boolean` | `false` | 组件整体加载状态 |

### PreviewFile 接口

```typescript
interface PreviewFile {
  name: string;
  size: number;
  type: string;
  url?: string;        // 远程地址
  preview?: string;    // 预览地址 (blob:...)
  file?: File;         // 原始文件对象
  progress?: number;   // 上传进度 (0-100)
  error?: string;      // 错误信息
  loading?: boolean;   // 单个文件加载状态
  poster?: string;     // 视频封面图
  textContent?: string;// 文本内容缓存
}
```

### Events

| 事件名 | 回调签名 | 说明 |
| ------ | -------- | ---- |
| `remove` | `(index: number) => void` | 点击移除按钮时触发 |
| `download` | `(file: PreviewFile) => void` | 点击下载按钮时触发 |
| `preview` | `(event: { file, index }) => void` | 打开全屏预览时触发 |
| `error` | `(event: { file, error }) => void` | 加载或预览出错时触发 |

## 最佳实践

1. **大文件处理**：对于超大文本文件，建议在服务端截断或限制 `LiaoFilePreview` 内部加载的长度（组件内部已有限制，但传入前处理更好）。
2. **内存管理**：组件会自动处理 `URL.createObjectURL` 和 `URL.revokeObjectURL`，但如果你手动创建了 Object URL 并传入 `url` 属性，请确保在组件销毁或文件移除时手动释放。
3. **样式定制**：组件使用了 BEM 命名规范，可以通过 CSS 覆盖轻松定制外观。例如覆盖 `.liao-file-preview-item` 的背景色。
