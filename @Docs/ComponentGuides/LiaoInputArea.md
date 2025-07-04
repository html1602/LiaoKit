# LiaoInputArea 组件使用指南

![版本](https://img.shields.io/badge/版本-2.5.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoInputArea 是一个智能输入区域组件，提供丰富的输入功能，包括文本输入、语音录制、文件上传、表情选择、相机拍摄等。组件具备智能锁定机制和响应式设计，能够根据全局状态自动调整交互状态。

## 功能特性

- **智能输入控制**：支持全局状态管理的输入锁定/解锁
- **多种输入方式**：文本、语音、文件、相机、表情
- **响应式设计**：适配桌面端和移动端不同交互模式
- **状态感知**：自动响应会话状态变化，显示友好提示
- **高度自适应**：文本区域根据内容自动调整高度
- **设备识别**：智能检测设备类型，提供差异化体验

## 基础用法

### 简单文本输入

```vue
<template>
  <LiaoInputArea
    v-model="inputText"
    placeholder="请输入消息..."
    @send="handleSend"
  />
</template>

<script setup>
import { ref } from 'vue';
import LiaoInputArea from '@/components/LiaoInputArea/LiaoInputArea.vue';

const inputText = ref('');

const handleSend = (text) => {
  console.log('发送消息:', text);
  // 处理发送逻辑
};
</script>
```

### 完整功能配置

```vue
<template>
  <LiaoInputArea
    v-model="inputText"
    placeholder="输入消息..."
    :disabled="isDisabled"
    :locked="isLocked"
    :lock-reason="lockReason"
    :enable-voice-input="true"
    :enable-emoji-input="true"
    :enable-file-upload="true"
    :enable-camera="true"
    :accept="'image/*,video/*'"
    :multiple="true"
    device-type="auto"
    custom-class="my-input-area"
    @send="handleSend"
    @focus="handleFocus"
    @blur="handleBlur"
    @file-upload="handleFileUpload"
    @voice-record="handleVoiceRecord"
    @emoji-select="handleEmojiSelect"
    @camera-capture="handleCameraCapture"
  />
</template>

<script setup>
import { ref } from 'vue';
import type { LockReason } from '@/types/session';

const inputText = ref('');
const isDisabled = ref(false);
const isLocked = ref(false);
const lockReason = ref<LockReason>(null);

const handleSend = (text) => {
  console.log('发送消息:', text);
};

const handleFileUpload = (files) => {
  console.log('文件上传:', files);
};

const handleVoiceRecord = (event) => {
  console.log('语音录制:', event);
};

const handleEmojiSelect = (emoji) => {
  console.log('选择表情:', emoji);
};

const handleCameraCapture = (files) => {
  console.log('相机拍摄:', files);
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| modelValue | String | '' | 输入框的值（v-model绑定） |
| placeholder | String | '输入消息...' | 占位符文本 |
| disabled | Boolean | false | 是否禁用组件 |
| locked | Boolean | false | 外部锁定状态控制 |
| lockReason | String | null | 锁定原因（AI_REPLYING/PLUGIN_PENDING等） |
| expanded | Boolean | false | 是否展开状态 |
| accept | String | '*/*' | 文件上传接受的文件类型 |
| multiple | Boolean | false | 是否支持多文件上传 |
| showVoice | Boolean | true | 是否显示语音功能 |
| enableVoiceInput | Boolean | true | 是否启用语音输入 |
| enableEmojiInput | Boolean | true | 是否启用表情选择 |
| enableFileUpload | Boolean | true | 是否启用文件上传 |
| enableCamera | Boolean | true | 是否启用相机功能 |
| customClass | String | '' | 自定义CSS类名 |
| deviceType | String | '' | 设备类型（'desktop'/'mobile'/''自动检测） |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| update:modelValue | (value: string) | 输入值变化时触发 |
| send | (text: string) | 发送消息时触发 |
| focus | () | 输入框获得焦点时触发 |
| blur | () | 输入框失去焦点时触发 |
| file-upload | (files: FileList) | 文件上传时触发 |
| voice-record | (event: object) | 语音录制事件 |
| emoji-select | (emoji: object) | 表情选择时触发 |
| camera-capture | (files: FileList) | 相机拍摄时触发 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|-----|---|---|
| before | - | 输入区域前置内容 |
| after | - | 输入区域后置内容 |

## 高级用法

### 状态管理集成

组件与全局状态管理系统深度集成，可以自动响应会话状态变化：

```vue
<template>
  <LiaoWindow
    :default-session-mode="'human'"
    :auto-unlock-timeout="30000"
    @input-lock-change="handleLockChange"
  >
    <LiaoInputArea
      v-model="inputText"
      @send="handleSend"
    />
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';

const inputText = ref('');

const handleLockChange = (lockInfo) => {
  console.log('锁定状态变化:', lockInfo);
  // { locked: boolean, reason: LockReason, plugin: ActivePlugin }
};
</script>
```

### 设备适配

```vue
<template>
  <!-- 自动检测设备类型 -->
  <LiaoInputArea
    v-model="inputText"
    device-type=""
    @send="handleSend"
  />
  
  <!-- 强制桌面端模式 -->
  <LiaoInputArea
    v-model="inputText"
    device-type="desktop"
    @send="handleSend"
  />
  
  <!-- 强制移动端模式 -->
  <LiaoInputArea
    v-model="inputText"
    device-type="mobile"
    @send="handleSend"
  />
</template>
```

### 文件上传处理

```vue
<template>
  <LiaoInputArea
    v-model="inputText"
    :accept="'image/*,video/*,.pdf,.doc,.docx'"
    :multiple="true"
    @file-upload="handleFileUpload"
  />
</template>

<script setup>
const handleFileUpload = (files) => {
  Array.from(files).forEach(file => {
    console.log('文件信息:', {
      name: file.name,
      size: file.size,
      type: file.type
    });
    
    // 处理文件上传逻辑
    uploadFile(file);
  });
};

const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    const result = await response.json();
    console.log('上传成功:', result);
  } catch (error) {
    console.error('上传失败:', error);
  }
};
</script>
```

### 语音录制处理

```vue
<template>
  <LiaoInputArea
    v-model="inputText"
    :enable-voice-input="true"
    @voice-record="handleVoiceRecord"
  />
</template>

<script setup>
const handleVoiceRecord = (event) => {
  switch (event.status) {
    case 'start':
      console.log('开始录音');
      // 显示录音状态
      break;
    case 'stop':
      console.log('录音结束');
      // 处理录音结果
      processVoiceData(event.data);
      break;
    case 'cancel':
      console.log('录音取消');
      // 清理录音状态
      break;
  }
};

const processVoiceData = (audioData) => {
  // 处理语音数据，如发送到语音识别服务
  console.log('处理语音数据:', audioData);
};
</script>
```

## 样式定制

### CSS 变量

组件支持通过CSS变量进行样式定制：

```scss
.liao-input-area {
  --input-bg-color: #ffffff;
  --input-border-color: #d9d9d9;
  --input-border-radius: 8px;
  --input-padding: 12px;
  --button-primary-color: #1890ff;
  --button-hover-color: #40a9ff;
}
```

### 自定义样式类

```vue
<template>
  <LiaoInputArea
    v-model="inputText"
    custom-class="my-custom-input"
  />
</template>

<style scoped>
.my-custom-input {
  .liao-input-area-container {
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
  
  .liao-input-area-send-active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
```

## 锁定原因说明

组件支持多种锁定原因，会显示相应的友好提示：

| 锁定原因 | 显示文本 | 使用场景 |
|---------|---------|---------|
| AI_REPLYING | AI正在回复中... | AI处理消息时 |
| PLUGIN_PENDING | 请先完成当前操作... | 插件操作进行中 |
| FORM_REQUIRED | 请先完成表单填写... | 必须完成表单时 |
| VOTE_REQUIRED | 请先完成投票选择... | 必须完成投票时 |
| CUSTOM | 输入已锁定... | 自定义锁定场景 |

## 响应式设计

### 桌面端特性

- 支持快捷键（Enter发送，Shift+Enter换行）
- 完整的文件上传功能
- 丰富的hover交互效果
- 多行文本自适应高度

### 移动端特性

- 触摸优化的交互方式
- 语音长按录制功能
- 相机/相册选择功能
- 聚焦时的界面布局调整
- 防止虚拟键盘遮挡

## 注意事项

1. **语音功能限制**：需要HTTPS环境才能使用语音录制功能
2. **文件上传安全**：建议在服务端验证文件类型和大小
3. **移动端兼容性**：相机功能需要现代浏览器支持
4. **性能考虑**：大文件上传时建议显示进度条
5. **状态同步**：与LiaoWindow组件配合使用时，状态会自动同步

## 浏览器兼容性

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- 移动端：iOS Safari 12+, Android Chrome 70+

## 更新日志

### 2.5.0 (2025-06-16)
- 🔧 修复Vue Script Setup导出错误
- 🔄 重构类型系统，使用独立的session.ts类型文件
- ✨ 完善状态管理集成，支持全局锁定控制
- 📱 优化移动端交互体验
- 🎯 改进锁定原因显示逻辑

### 2.4.0 (2025-06-15)
- ✨ 新增语音录制功能
- 📷 新增相机拍摄功能
- 🎨 优化表情选择器交互
- 📱 改进移动端布局适配

### 2.3.0 (2025-06-14)
- 🔒 新增输入锁定机制
- 🎯 集成全局状态管理
- ✨ 支持设备类型检测
- 🎨 优化响应式设计

### 2.2.0 (2025-06-13)
- ✨ 新增文件上传功能
- 🎨 改进样式定制能力
- 📱 优化移动端体验
- 🔧 修复高度自适应问题 