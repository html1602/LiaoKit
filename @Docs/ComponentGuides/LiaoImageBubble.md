# LiaoImageBubble 组件使用指南

![版本](https://img.shields.io/badge/版本-1.0.1-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--26-green.svg)

## 组件介绍

LiaoImageBubble 是一个专门用于显示图片消息的气泡组件，基于 LiaoMessageBubble 封装，支持图片预览、加载状态、错误处理等功能，提供了良好的用户体验和灵活的定制选项。

## 功能特性

- 🖼️ **图片展示**：以聊天气泡形式展示图片消息
- 🔍 **图片预览**：支持点击放大预览图片
- ⏳ **加载状态**：显示图片加载进度和状态
- ❌ **错误处理**：优雅处理图片加载失败情况
- 🎨 **样式定制**：支持多种样式自定义选项
- 📱 **响应式设计**：自适应各种屏幕尺寸
- 📐 **智能尺寸**：自动适配图片尺寸和宽高比

## 基础用法

```vue
<template>
  <!-- 基本用法 -->
  <LiaoImageBubble
    imageUrl="https://example.com/image.jpg"
    type="other"
    :time="new Date()"
  />
  
  <!-- 带名称和头像 -->
  <LiaoImageBubble
    imageUrl="https://example.com/image.jpg"
    type="self"
    avatar="https://example.com/avatar.jpg"
    name="张三"
    :showName="true"
    :time="new Date()"
  />
  
  <!-- 自定义尺寸 -->
  <LiaoImageBubble
    imageUrl="https://example.com/image.jpg"
    type="other"
    :maxWidth="300"
    :maxHeight="400"
    :showInfo="true"
  />
</template>

<script setup>
import { LiaoImageBubble } from 'liaokat';
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| imageUrl | `String` | - | 图片URL，必填项 |
| alt | `String` | `'Image'` | 图片的alt属性，用于无法显示图片时的替代文本 |
| type | `'self' \| 'other' \| 'system'` | `'other'` | 气泡类型，控制消息显示方向和样式 |
| avatar | `String` | `''` | 发送者头像URL |
| showAvatar | `Boolean` | `true` | 是否显示头像 |
| showAvatarSelf | `Boolean` | `true` | 是否显示自己的头像 |
| name | `String` | `''` | 发送者名称 |
| showName | `Boolean` | `false` | 是否显示发送者名称 |
| time | `String \| Date \| Number` | `''` | 发送时间 |
| showTime | `Boolean` | `true` | 是否显示发送时间 |
| timeFormat | `String` | `'HH:mm'` | 时间格式化模板 |
| status | `'sending' \| 'sent' \| 'failed' \| 'streaming'` | `'sent'` | 发送状态 |
| maxWidth | `Number` | `240` | 图片最大宽度，单位px |
| maxHeight | `Number` | `240` | 图片最大高度，单位px |
| minWidth | `Number` | `100` | 图片最小宽度，单位px |
| minHeight | `Number` | `100` | 图片最小高度，单位px |
| loading | `Boolean` | `false` | 是否显示加载状态 |
| error | `Boolean` | `false` | 是否显示错误状态 |
| loadingText | `String` | `'图片加载中...'` | 加载状态文本 |
| errorText | `String` | `'图片加载失败'` | 错误状态文本 |
| showInfo | `Boolean` | `true` | 是否显示图片尺寸信息 |
| highlight | `Boolean` | `false` | 是否高亮显示消息 |
| customClass | `String` | `''` | 自定义CSS类名 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | `event` | 点击消息气泡时触发 |
| image-click | `{ error?: boolean }` | 点击图片时触发，error表示是否为错误状态 |
| context-menu | `event` | 右键菜单时触发 |
| preview | `{ url: string }` | 开始预览图片时触发 |
| preview-close | - | 关闭预览时触发 |

## 高级用法

### 在 LiaoMessageList 中使用

LiaoMessageList 组件已经内置了对图片消息的支持。在消息数据中设置 `type: 'image'` 即可：

```vue
<template>
  <LiaoMessageList :messages="messages" />
</template>

<script setup>
import { ref } from 'vue';
import { LiaoMessageList } from 'liaokat';

const messages = ref([
  {
    id: '1',
    type: 'text',
    content: '你好，请看这张图片',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    time: new Date(Date.now() - 60000)
  },
  {
    id: '2',
    type: 'image',
    content: 'https://picsum.photos/500/300', // imageUrl
    alt: '示例图片',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    time: new Date()
  },
  {
    id: '3',
    type: 'image',
    content: 'https://picsum.photos/300/400',
    alt: '我的图片',
    isSelf: true,
    time: new Date()
  }
]);
</script>
```

### 自定义加载和错误状态

```vue
<template>
  <div class="image-examples">
    <!-- 加载状态 -->
    <LiaoImageBubble
      imageUrl="https://example.com/large-image.jpg"
      type="other"
      :loading="true"
      loadingText="正在加载..."
    />
    
    <!-- 错误状态 -->
    <LiaoImageBubble
      imageUrl="https://invalid-url.jpg"
      type="self"
      :error="true"
      errorText="加载失败，请重试"
    />
    
    <!-- 动态控制状态 -->
    <LiaoImageBubble
      :imageUrl="dynamicImageUrl"
      type="other"
      :loading="isLoading"
      :error="hasError"
      @image-click="handleImageClick"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LiaoImageBubble } from 'liaokat';

const isLoading = ref(false);
const hasError = ref(false);
const dynamicImageUrl = ref('https://example.com/image.jpg');

const handleImageClick = ({ error }) => {
  if (error) {
    // 重试加载
    hasError.value = false;
    isLoading.value = true;
    // 模拟重新加载
    setTimeout(() => {
      isLoading.value = false;
    }, 2000);
  }
};
</script>
```

### 自定义尺寸和样式

```vue
<template>
  <div class="custom-image-styles">
    <!-- 小尺寸图片 -->
    <LiaoImageBubble
      imageUrl="https://via.placeholder.com/100x100"
      type="other"
      :maxWidth="120"
      :maxHeight="120"
      :minWidth="80"
      :minHeight="80"
    />
    
    <!-- 大尺寸图片 -->
    <LiaoImageBubble
      imageUrl="https://picsum.photos/800/600"
      type="self"
      :maxWidth="400"
      :maxHeight="300"
      :showInfo="true"
    />
    
    <!-- 自定义样式类 -->
    <LiaoImageBubble
      imageUrl="https://example.com/image.jpg"
      type="other"
      customClass="my-custom-image"
    />
  </div>
</template>

<style>
.my-custom-image {
  /* 自定义样式 */
}
</style>
```

### 事件处理

```vue
<template>
  <LiaoImageBubble
    imageUrl="https://example.com/image.jpg"
    type="other"
    @click="handleBubbleClick"
    @image-click="handleImageClick"
    @preview="handlePreview"
    @preview-close="handlePreviewClose"
    @context-menu="handleContextMenu"
  />
</template>

<script setup>
import { LiaoImageBubble } from 'liaokat';

const handleBubbleClick = (event) => {
  console.log('点击了消息气泡', event);
};

const handleImageClick = ({ error }) => {
  if (error) {
    console.log('图片加载失败');
  } else {
    console.log('点击了图片，即将预览');
  }
};

const handlePreview = ({ url }) => {
  console.log('开始预览图片:', url);
};

const handlePreviewClose = () => {
  console.log('关闭图片预览');
};

const handleContextMenu = (event) => {
  console.log('右键菜单', event);
  // 可以显示自定义右键菜单
};
</script>
```

## 样式定制

```scss
// 自定义图片气泡样式
:root {
  --image-bubble-bg: #FFFFFF;       // 图片气泡背景色
  --image-bubble-border: #ECEEF2;   // 图片气泡边框色
  --image-bubble-radius: 12px;      // 图片气泡圆角
  --image-info-text-color: #FFFFFF; // 图片信息文本颜色
  --image-info-bg: rgba(0, 0, 0, 0.5); // 图片信息背景色
}

// 自定义图片内容样式
.liao-image-bubble {
  .liao-image-content {
    border-radius: var(--image-bubble-radius);
    background: var(--image-bubble-bg);
    
    &:hover {
      filter: brightness(0.95);
    }
  }
  
  .liao-image {
    border-radius: var(--image-bubble-radius);
  }
  
  .liao-image-info {
    background-color: var(--image-info-bg);
    color: var(--image-info-text-color);
  }
}
```

## 图片智能尺寸处理

LiaoImageBubble 会自动处理图片尺寸：

1. **保持宽高比**：始终保持图片的原始宽高比例
2. **尺寸约束**：在 maxWidth/maxHeight 和 minWidth/minHeight 范围内调整
3. **智能适配**：根据图片的实际尺寸计算最佳显示尺寸
4. **响应式**：在不同屏幕尺寸下自动调整

```vue
<template>
  <!-- 横向图片 -->
  <LiaoImageBubble
    imageUrl="https://picsum.photos/800/400"
    :maxWidth="300"
    :maxHeight="200"
  />
  
  <!-- 纵向图片 -->
  <LiaoImageBubble
    imageUrl="https://picsum.photos/400/800"
    :maxWidth="200"
    :maxHeight="300"
  />
  
  <!-- 正方形图片 -->
  <LiaoImageBubble
    imageUrl="https://picsum.photos/400/400"
    :maxWidth="200"
    :maxHeight="200"
  />
</template>
```

## 图片预览功能

点击图片会自动触发预览功能：

1. **全屏预览**：图片在全屏模态框中显示
2. **智能缩放**：图片自动适应屏幕大小
3. **点击关闭**：点击背景或关闭按钮可关闭预览
4. **键盘支持**：支持 ESC 键关闭预览

## 在 MessageList 中的应用

如果您想在 LiaoMessageList 中控制图片的显示，可以通过消息对象的属性来实现：

```typescript
interface ImageMessage {
  id: string;
  type: 'image';
  content: string;        // 图片URL
  alt?: string;           // 图片alt文本
  isSelf: boolean;        // 是否为自己发送
  avatar?: string;        // 头像
  name?: string;          // 发送者名称
  time: Date | string;    // 发送时间
  status?: 'sending' | 'sent' | 'failed';
  
  // 以下属性目前需要通过自定义插槽来控制
  // maxWidth?: number;
  // maxHeight?: number;
  // showInfo?: boolean;
}
```

**注意**：当前 LiaoMessageList 在渲染图片消息时使用的是默认参数，如果需要自定义图片尺寸等属性，您可以使用自定义消息插槽：

```vue
<template>
  <LiaoMessageList :messages="messages">
    <template #message="{ message }">
      <LiaoImageBubble
        v-if="message.type === 'image'"
        :imageUrl="message.content"
        :type="message.isSelf ? 'self' : 'other'"
        :avatar="message.avatar"
        :time="message.time"
        :status="message.status"
        :maxWidth="getImageMaxWidth(message)"
        :maxHeight="getImageMaxHeight(message)"
        :showInfo="message.showInfo"
      />
      
      <!-- 其他类型消息使用默认渲染 -->
      <component
        v-else
        :is="getMessageComponent(message.type)"
        v-bind="getMessageProps(message)"
      />
    </template>
  </LiaoMessageList>
</template>

<script setup>
const getImageMaxWidth = (message) => {
  // 根据消息内容或其他条件返回合适的宽度
  return message.customWidth || 240;
};

const getImageMaxHeight = (message) => {
  return message.customHeight || 240;
};
</script>
```

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge 最新版本）
- 图片预览功能在所有支持的浏览器中均可正常工作
- 不支持 IE 浏览器

## 注意事项

1. **图片URL有效性**：确保提供的图片URL可访问
2. **图片尺寸**：大图片会自动调整，但建议预先优化图片尺寸
3. **跨域问题**：某些图片可能存在跨域限制
4. **性能考虑**：大量图片可能影响页面性能，建议使用懒加载
5. **无format属性**：该组件没有format属性，图片会自动适配尺寸

## 更新日志

### 1.0.1 (2025-06-26)
- **修正文档错误**：移除了不存在的 `format` 属性说明
- **完善属性说明**：补充了所有实际存在的属性详细说明
- **优化使用示例**：提供更贴近实际使用的代码示例
- **明确组件能力**：明确了在 LiaoMessageList 中的使用方式

### 1.0.0 (2025-06-06)
- 初始版本发布
- 实现基础图片气泡功能
- 添加图片预览功能
- 支持加载状态和错误处理 