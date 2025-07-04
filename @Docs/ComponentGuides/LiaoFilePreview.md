# LiaoFilePreview 组件使用指南

![版本](https://img.shields.io/badge/版本-1.1.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--18-green.svg)

## 组件介绍

LiaoFilePreview 是一个功能完整的文件预览组件，支持图片、视频、音频等多种文件类型的预览，并提供下载、移除等操作功能。

## 功能特性

- 📁 **多文件类型支持** - 支持图片、视频、音频、文档等多种文件格式
- 🖼️ **全屏预览** - 点击文件可全屏预览，支持键盘导航
- 📥 **下载功能** - 提供文件下载按钮，hover时显示主题色背景和白色图标
- 🗑️ **移除操作** - 可移除不需要的文件
- 📱 **响应式设计** - 适配桌面端和移动端
- 🔄 **加载状态** - 显示文件处理进度和状态

## 基础用法

```vue
<template>
  <LiaoFilePreview
    :files="fileList"
    :loading="false"
    @remove="handleRemove"
    @download="handleDownload"
    @preview="handlePreview"
  />
</template>

<script>
import { ref } from 'vue'
import LiaoFilePreview from '@/components/LiaoFilePreview/LiaoFilePreview.vue'

export default {
  components: {
    LiaoFilePreview
  },
  setup() {
    const fileList = ref([
      {
        id: '1',
        name: 'example.jpg',
        type: 'image/jpeg',
        size: 1024000,
        url: 'https://example.com/image.jpg',
        preview: 'https://example.com/thumb.jpg'
      }
    ])

    const handleRemove = (index) => {
      fileList.value.splice(index, 1)
    }

    const handleDownload = (file) => {
      console.log('下载文件:', file)
    }

    const handlePreview = (file, index) => {
      console.log('预览文件:', file)
    }

    return {
      fileList,
      handleRemove,
      handleDownload,
      handlePreview
    }
  }
}
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| files | Array | `[]` | 文件列表数组 |
| loading | Boolean | `false` | 是否显示加载状态 |
| showDownload | Boolean | `true` | 是否显示下载按钮 |
| showPreview | Boolean | `true` | 是否显示预览按钮 |
| showRemove | Boolean | `true` | 是否显示移除按钮 |
| emptyText | String | `'暂无文件'` | 空状态提示文字 |
| maxPreviewSize | Number | `10485760` | 最大预览文件大小（10MB） |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| remove | `(index: number)` | 移除文件时触发 |
| download | `(file: PreviewFile)` | 下载文件时触发 |
| preview | `(file: PreviewFile, index: number)` | 预览文件时触发 |
| error | `(error: string)` | 文件处理错误时触发 |

## 文件对象格式

```typescript
interface PreviewFile {
  id: string | number
  name: string
  type: string
  size: number
  url?: string
  preview?: string
  loading?: boolean
  error?: string
}
```

## 高级用法

### 自定义操作按钮

```vue
<LiaoFilePreview
  :files="files"
  :showDownload="false"
  :showRemove="false"
>
  <!-- 可以通过控制props来隐藏默认按钮，实现自定义操作 -->
</LiaoFilePreview>
```

### 文件类型处理

```vue
<template>
  <LiaoFilePreview
    :files="processedFiles"
    @download="customDownload"
  />
</template>

<script>
const processedFiles = computed(() => {
  return rawFiles.value.map(file => ({
    ...file,
    preview: file.type.startsWith('image/') ? file.url : null
  }))
})

const customDownload = (file) => {
  // 自定义下载逻辑
  const link = document.createElement('a')
  link.href = file.url
  link.download = file.name
  link.click()
}
</script>
```

## 样式定制

### 按钮样式

组件提供了不同操作按钮的特殊样式：

- **下载按钮** (`.liao-file-preview-download`): hover时背景变为主题色，图标变为白色
- **预览按钮**: hover时变为主题色
- **移除按钮** (`.liao-file-preview-remove`): hover时变为红色

```scss
// 自定义下载按钮样式
.liao-file-preview-download {
  &:hover {
    background-color: #your-theme-color;
    color: white;
  }
}
```

### 布局调整

```scss
// 调整文件项间距
.liao-file-preview-list {
  gap: 16px; // 默认间距
}

// 自定义文件预览尺寸
.liao-file-preview-content {
  width: 100px;
  height: 100px;
}
```

## 支持的文件类型

### 可预览类型
- **图片**: JPG, PNG, GIF, WebP, SVG
- **视频**: MP4, WebM, OGV
- **音频**: MP3, WAV, OGG

### 文档类型图标
- **PDF**: 显示PDF图标
- **Word**: DOC, DOCX 显示Word图标
- **Excel**: XLS, XLSX 显示Excel图标
- **PowerPoint**: PPT, PPTX 显示PowerPoint图标
- **压缩包**: ZIP, RAR, 7Z 显示压缩包图标
- **文本**: TXT 显示文本图标
- **其他**: 显示通用文件图标

## 注意事项

1. **文件大小限制**: 超过 `maxPreviewSize` 的文件不会显示预览
2. **跨域问题**: 确保文件URL支持跨域访问
3. **移动端适配**: 在小屏幕设备上会自动调整布局
4. **键盘导航**: 全屏预览模式下支持左右箭头键切换文件

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 更新日志

### 1.1.0 (2025-06-18)
- ✨ 优化下载按钮hover效果，图标变为白色
- 🔧 改进CSS选择器兼容性
- 📝 完善组件文档和使用示例

### 1.0.0 (2025-06-01)
- 🎉 初始版本发布
- 📁 支持多种文件类型预览
- 🖼️ 实现全屏预览功能
- 📱 响应式设计适配 