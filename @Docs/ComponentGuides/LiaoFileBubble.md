# LiaoFileBubble 文件气泡组件使用手册

![版本](https://img.shields.io/badge/版本-2.7.5-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--25-green.svg)

## 🎯 组件概述

`LiaoFileBubble` 是 LiaoKit 中专门用于展示文件类型消息的气泡组件。它提供了丰富的文件展示功能，支持多种文件类型、状态管理和交互操作。

### 核心特性

- 🎨 **美观设计**: 现代化卡片式设计，支持不同布局模式
- 📁 **多文件类型**: 支持图片、视频、音频、文档、压缩包等各种文件类型
- 🔄 **状态管理**: 完整的文件上传/下载状态追踪（等待、进行中、成功、失败）
- 🎯 **丰富操作**: 预览、下载、重试等交互功能
- 📱 **响应式**: 完美适配桌面端和移动端
- 🔧 **高度可配置**: 支持消息气泡模式和独立展示模式

## 📦 安装和导入

```typescript
import { LiaoFileBubble } from '@yuandezuohua/liaokit'
import '@yuandezuohua/liaokit/dist/liaokit.css'
```

## 🏗️ 基础用法

### 最简单的文件气泡

```vue
<template>
  <LiaoFileBubble
    fileName="示例文档.pdf"
    :fileSize="2048576"
    fileType="application/pdf"
    fileUrl="https://example.com/document.pdf"
    fileStatus="success"
  />
</template>
```

### 在消息列表中使用

```vue
<template>
  <LiaoFileBubble
    fileName="重要报告.docx"
    :fileSize="5242880"
    fileType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    fileUrl="https://example.com/report.docx"
    fileStatus="success"
    messageType="other"
    avatar="https://example.com/avatar.jpg"
    userName="张三"
    :time="new Date()"
    @preview="handlePreview"
    @download="handleDownload"
  />
</template>
```

## 🔧 Props 配置详解

### 文件信息属性

| 属性名 | 类型 | 默认值 | 描述 | 兼容属性 |
|---------|------|--------|------|----------|
| `fileName` | `string` | `''` | 文件名称 | `name` |
| `fileSize` | `number` | `0` | 文件大小（字节） | `size` |
| `fileType` | `string` | `''` | 文件MIME类型 | `type` |
| `fileUrl` | `string` | `''` | 文件下载链接 | `url` |
| `fileStatus` | `FileMessageStatus` | `'waiting'` | 文件状态 | `status` |
| `fileProgress` | `number` | `0` | 上传/下载进度（0-100） | `progress` |
| `fileError` | `string` | `''` | 错误信息 | `errorMessage` |
| `maxNameLength` | `number` | `30` | 文件名最大显示长度 | - |

### 消息气泡属性

| 属性名 | 类型 | 默认值 | 描述 |
|---------|------|--------|------|
| `messageType` | `'self' \| 'other'` | `'other'` | 消息类型（自己/对方） |
| `avatar` | `string` | `''` | 头像URL |
| `showAvatar` | `boolean` | `true` | 是否显示头像 |
| `showAvatarSelf` | `boolean` | `false` | 是否显示自己的头像 |
| `userName` | `string` | `''` | 用户名称 |
| `showName` | `boolean` | `true` | 是否显示用户名 |
| `time` | `string \| Date \| number` | - | 消息时间 |
| `showTime` | `boolean` | `true` | 是否显示时间 |
| `messageStatus` | `'sending' \| 'sent' \| 'failed' \| 'streaming'` | `'sent'` | 消息状态 |

### 布局和操作属性

| 属性名 | 类型 | 默认值 | 描述 |
|---------|------|--------|------|
| `layout` | `'bubble' \| 'list' \| 'card'` | `'bubble'` | 布局模式 |
| `position` | `'left' \| 'right'` | `'right'` | 位置（向后兼容） |
| `showMainAction` | `boolean` | `true` | 是否显示主操作按钮 |
| `showRetry` | `boolean` | `true` | 是否显示重试按钮 |
| `showMoreActions` | `boolean` | `false` | 是否显示更多操作 |
| `clickable` | `boolean` | `true` | 是否可点击 |

## 📊 文件状态类型

### FileMessageStatus 枚举

```typescript
type FileMessageStatus = 'waiting' | 'uploading' | 'success' | 'error'
```

| 状态 | 描述 | 图标 | 颜色 |
|------|------|------|------|
| `waiting` | 等待上传/处理 | ⏰ | 灰色 |
| `uploading` | 正在上传 | 🔄 | 橙色 |
| `success` | 上传成功 | ✅ | 蓝色 |
| `error` | 上传失败 | ❌ | 红色 |

### 状态示例

```vue
<template>
  <!-- 等待上传 -->
  <LiaoFileBubble
    fileName="待上传.jpg"
    :fileSize="1024000"
    fileStatus="waiting"
  />

  <!-- 上传中 -->
  <LiaoFileBubble
    fileName="上传中.mp4"
    :fileSize="10240000"
    fileStatus="uploading"
    :fileProgress="45"
  />

  <!-- 上传成功 -->
  <LiaoFileBubble
    fileName="成功上传.pdf"
    :fileSize="2048000"
    fileStatus="success"
    fileUrl="https://example.com/file.pdf"
  />

  <!-- 上传失败 -->
  <LiaoFileBubble
    fileName="失败文件.docx"
    :fileSize="5120000"
    fileStatus="error"
    fileError="网络连接超时"
    :showRetry="true"
  />
</template>
```

## 🎨 布局模式详解

### 1. Bubble 模式（默认）

消息气泡模式，适用于聊天界面。

```vue
<template>
  <LiaoFileBubble
    layout="bubble"
    fileName="聊天文件.pdf"
    :fileSize="1024000"
    messageType="other"
    avatar="https://example.com/avatar.jpg"
    userName="用户名"
    :time="new Date()"
  />
</template>
```

### 2. List 模式

列表模式，适用于文件管理界面。

```vue
<template>
  <LiaoFileBubble
    layout="list"
    fileName="列表文件.xlsx"
    :fileSize="2048000"
    fileStatus="success"
    :showMoreActions="true"
  />
</template>
```

### 3. Card 模式

卡片模式，适用于文件预览网格。

```vue
<template>
  <LiaoFileBubble
    layout="card"
    fileName="卡片文件.jpg"
    :fileSize="512000"
    fileStatus="success"
  />
</template>
```

## 📁 支持的文件类型

### 图片文件

```vue
<LiaoFileBubble
  fileName="美景.jpg"
  :fileSize="2048000"
  fileType="image/jpeg"
  fileUrl="https://example.com/image.jpg"
  fileStatus="success"
/>
```

**支持格式**: `jpg`, `jpeg`, `png`, `gif`, `bmp`, `webp`, `svg`

### 视频文件

```vue
<LiaoFileBubble
  fileName="演示视频.mp4"
  :fileSize="20480000"
  fileType="video/mp4"
  fileUrl="https://example.com/video.mp4"
  fileStatus="success"
/>
```

**支持格式**: `mp4`, `avi`, `mov`, `wmv`, `flv`, `webm`, `mkv`

### 音频文件

```vue
<LiaoFileBubble
  fileName="背景音乐.mp3"
  :fileSize="5120000"
  fileType="audio/mpeg"
  fileUrl="https://example.com/audio.mp3"
  fileStatus="success"
/>
```

**支持格式**: `mp3`, `wav`, `flac`, `aac`, `ogg`, `wma`

### 文档文件

```vue
<!-- PDF -->
<LiaoFileBubble
  fileName="报告.pdf"
  :fileSize="3072000"
  fileType="application/pdf"
  fileUrl="https://example.com/report.pdf"
  fileStatus="success"
/>

<!-- Word -->
<LiaoFileBubble
  fileName="文档.docx"
  :fileSize="1536000"
  fileType="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  fileUrl="https://example.com/document.docx"
  fileStatus="success"
/>
```

### 压缩文件

```vue
<LiaoFileBubble
  fileName="资源包.zip"
  :fileSize="10240000"
  fileType="application/zip"
  fileUrl="https://example.com/package.zip"
  fileStatus="success"
/>
```

**支持格式**: `zip`, `rar`, `7z`, `tar`, `gz`, `bz2`

## 🎪 事件处理

### 事件类型

| 事件名 | 参数 | 描述 |
|--------|------|------|
| `preview` | `file: FileMeta` | 预览文件时触发 |
| `download` | `file: FileMeta` | 下载文件时触发 |
| `click` | `file: FileMeta` | 点击气泡时触发 |
| `retry` | `file: FileMeta` | 重试上传时触发 |
| `more` | `file: FileMeta` | 点击更多操作时触发 |

### 事件处理示例

```vue
<template>
  <LiaoFileBubble
    fileName="示例文件.pdf"
    :fileSize="2048000"
    fileStatus="success"
    fileUrl="https://example.com/file.pdf"
    @preview="handlePreview"
    @download="handleDownload"
    @click="handleClick"
    @retry="handleRetry"
    @more="handleMore"
  />
</template>

<script setup>
import type { FileMeta } from '@yuandezuohua/liaokit'

const handlePreview = (file: FileMeta) => {
  console.log('预览文件:', file)
  // 实现文件预览逻辑
}

const handleDownload = (file: FileMeta) => {
  console.log('下载文件:', file)
  // 实现文件下载逻辑
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }
}

const handleClick = (file: FileMeta) => {
  console.log('点击文件:', file)
  // 根据文件类型决定默认操作
}

const handleRetry = (file: FileMeta) => {
  console.log('重试上传:', file)
  // 重新上传文件
}

const handleMore = (file: FileMeta) => {
  console.log('更多操作:', file)
  // 显示操作菜单
}
</script>
```

## 🎨 样式自定义

### CSS 变量

```css
.liao-file-bubble {
  /* 气泡尺寸 */
  --file-bubble-max-width: 320px;
  --file-bubble-min-width: 240px;
  --file-bubble-padding: 16px;
  
  /* 图标尺寸 */
  --file-icon-size: 48px;
  --file-icon-border-radius: 12px;
  
  /* 按钮尺寸 */
  --action-button-size: 32px;
  --action-button-border-radius: 8px;
  
  /* 颜色主题 */
  --success-color: #1890ff;
  --error-color: #ff4d4f;
  --warning-color: #fa8c16;
  --text-primary: #333;
  --text-secondary: #666;
  --border-color: #e6e6e6;
}
```

### 自定义类名

```vue
<template>
  <LiaoFileBubble
    fileName="自定义样式.pdf"
    :fileSize="1024000"
    custom-class="my-custom-file-bubble"
  />
</template>

<style>
.my-custom-file-bubble {
  border: 2px solid #1890ff;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.my-custom-file-bubble .liao-file-bubble-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}
</style>
```

## 📱 响应式适配

### 移动端优化

```vue
<template>
  <div class="mobile-file-list">
    <LiaoFileBubble
      v-for="file in files"
      :key="file.id"
      :fileName="file.name"
      :fileSize="file.size"
      :fileType="file.type"
      :fileStatus="file.status"
      layout="list"
      class="mobile-file-item"
    />
  </div>
</template>

<style>
@media (max-width: 768px) {
  .mobile-file-list {
    padding: 8px;
  }
  
  .mobile-file-item {
    margin-bottom: 8px;
  }
  
  .mobile-file-item .liao-file-bubble {
    max-width: none;
    width: 100%;
  }
}
</style>
```

## 🔧 高级功能

### 文件预览功能

```vue
<template>
  <LiaoFileBubble
    fileName="预览文档.pdf"
    :fileSize="2048000"
    fileType="application/pdf"
    fileUrl="https://example.com/document.pdf"
    fileStatus="success"
    @preview="openPreview"
  />
  
  <!-- 预览弹窗会自动显示 -->
</template>

<script setup>
const openPreview = (file) => {
  // 组件内部会自动处理预览功能
  // 支持图片、视频、音频、文本文件的预览
}
</script>
```

### 进度显示

```vue
<template>
  <LiaoFileBubble
    fileName="上传中.mp4"
    :fileSize="10240000"
    fileStatus="uploading"
    :fileProgress="uploadProgress"
  />
</template>

<script setup>
import { ref } from 'vue'

const uploadProgress = ref(0)

// 模拟上传进度
const simulateUpload = () => {
  const timer = setInterval(() => {
    uploadProgress.value += 10
    if (uploadProgress.value >= 100) {
      clearInterval(timer)
    }
  }, 500)
}
</script>
```

### 错误处理

```vue
<template>
  <LiaoFileBubble
    fileName="失败文件.docx"
    :fileSize="5120000"
    fileStatus="error"
    fileError="上传失败：文件过大"
    :showRetry="true"
    @retry="retryUpload"
  />
</template>

<script setup>
const retryUpload = (file) => {
  console.log('重试上传:', file)
  // 重新上传逻辑
  // 1. 重置状态为 'uploading'
  // 2. 重新开始上传流程
  // 3. 更新进度
}
</script>
```

## 🔗 与其他组件配合

### 在 LiaoMessageList 中使用

```vue
<template>
  <LiaoMessageList
    :messages="messages"
    @file-preview="handleFilePreview"
    @file-download="handleFileDownload"
    @file-retry="handleFileRetry"
  />
</template>

<script setup>
const messages = ref([
  {
    id: '1',
    type: 'file',
    fileName: '重要文档.pdf',
    fileSize: 2048000,
    fileType: 'application/pdf',
    fileUrl: 'https://example.com/document.pdf',
    fileStatus: 'success',
    isSelf: false,
    avatar: 'https://example.com/avatar.jpg',
    name: '张三',
    time: new Date()
  }
])
</script>
```

### 在文件上传中使用

```vue
<template>
  <div class="file-upload-area">
    <input
      type="file"
      multiple
      @change="handleFileSelect"
      ref="fileInput"
      style="display: none"
    />
    
    <button @click="selectFiles">选择文件</button>
    
    <div class="file-list">
      <LiaoFileBubble
        v-for="file in uploadFiles"
        :key="file.id"
        :fileName="file.name"
        :fileSize="file.size"
        :fileType="file.type"
        :fileStatus="file.status"
        :fileProgress="file.progress"
        :fileError="file.error"
        layout="list"
        @retry="retryUpload"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import type { FileMeta } from '@yuandezuohua/liaokit'

const fileInput = ref()
const uploadFiles = ref<FileMeta[]>([])

const selectFiles = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  files.forEach(file => {
    const fileMeta: FileMeta = {
      id: Date.now().toString() + Math.random().toString(36),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'waiting',
      progress: 0,
      file
    }
    
    uploadFiles.value.push(fileMeta)
    uploadFile(fileMeta)
  })
}

const uploadFile = async (fileMeta: FileMeta) => {
  fileMeta.status = 'uploading'
  
  try {
    // 模拟上传过程
    for (let i = 0; i <= 100; i += 10) {
      fileMeta.progress = i
      await new Promise(resolve => setTimeout(resolve, 200))
    }
    
    fileMeta.status = 'success'
    fileMeta.url = 'https://example.com/uploaded-file'
  } catch (error) {
    fileMeta.status = 'error'
    fileMeta.error = '上传失败'
  }
}

const retryUpload = (file: FileMeta) => {
  uploadFile(file)
}
</script>
```

## 🎯 最佳实践

### 1. 性能优化

```vue
<template>
  <!-- 使用 v-memo 优化大量文件渲染 -->
  <LiaoFileBubble
    v-for="file in files"
    :key="file.id"
    v-memo="[file.status, file.progress]"
    :fileName="file.name"
    :fileSize="file.size"
    :fileStatus="file.status"
    :fileProgress="file.progress"
  />
</template>
```

### 2. 无障碍支持

```vue
<template>
  <LiaoFileBubble
    fileName="重要文档.pdf"
    :fileSize="2048000"
    fileStatus="success"
    :aria-label="`文件: ${fileName}, 大小: ${formattedSize}`"
    role="button"
    tabindex="0"
  />
</template>
```

### 3. 国际化支持

```vue
<template>
  <LiaoFileBubble
    :fileName="file.name"
    :fileSize="file.size"
    :fileStatus="file.status"
    :loadingText="$t('file.uploading')"
    :errorText="$t('file.uploadFailed')"
  />
</template>
```

### 4. 错误边界处理

```vue
<template>
  <div class="file-bubble-container">
    <LiaoFileBubble
      v-if="fileData"
      :fileName="fileData.name"
      :fileSize="fileData.size"
      :fileStatus="fileData.status"
      @error="handleFileError"
    />
    <div v-else class="file-bubble-error">
      文件数据加载失败
    </div>
  </div>
</template>
```

## 🐛 常见问题

### Q: 为什么文件图标不显示？

**A**: 检查文件类型映射，确保 `fileType` 正确或文件扩展名被支持。

```vue
<!-- 确保提供正确的 MIME 类型 -->
<LiaoFileBubble
  fileName="document.pdf"
  fileType="application/pdf"  <!-- 正确的 MIME 类型 -->
  :fileSize="1024000"
/>
```

### Q: 如何自定义文件类型图标？

**A**: 修改 `fileUtils.ts` 中的 `FILE_TYPE_CONFIGS`:

```typescript
// 在 fileUtils.ts 中添加自定义配置
FILE_TYPE_CONFIGS.myCustomType = {
  category: 'document',
  icon: 'my-custom-icon',
  color: '#ff6b35',
  extensions: ['mycustom'],
  mimeTypes: ['application/x-mycustom']
}
```

### Q: 预览功能不工作？

**A**: 确保文件 URL 可访问且支持预览的文件类型：

```vue
<LiaoFileBubble
  fileName="image.jpg"
  fileType="image/jpeg"  <!-- 支持预览的类型 -->
  fileUrl="https://accessible-url.com/image.jpg"  <!-- 可访问的URL -->
  fileStatus="success"  <!-- 必须是成功状态 -->
/>
```

### Q: 移动端样式问题？

**A**: 使用响应式布局和移动端优化：

```css
@media (max-width: 768px) {
  .liao-file-bubble {
    max-width: calc(100vw - 32px);
    min-width: 200px;
  }
}
```

## 📚 相关组件

- [LiaoMessageBubble](./LiaoMessageBubble.md) - 基础消息气泡
- [LiaoMessageList](./LiaoMessageList.md) - 消息列表
- [LiaoFilePreview](./LiaoFilePreview.md) - 文件预览
- [LiaoIcon](./LiaoIcon.md) - 图标组件

## 🔄 更新日志

### v2.7.5
- ✅ 完善文件预览功能
- ✅ 优化移动端适配
- ✅ 增强错误处理
- ✅ 改进进度显示

### v2.7.0
- ✅ 重构组件架构
- ✅ 新增布局模式
- ✅ 优化交互体验
- ✅ 完善类型定义

---

📄 **更多信息**: 如需了解更多详细信息，请参考 [组件源码](../../src/components/LiaoMessageBubble/LiaoFileBubble.vue) 或 [在线示例](https://liaokit.example.com/components/file-bubble) 