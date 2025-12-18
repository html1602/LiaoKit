---
title: LiaoInputArea（输入区域）
description: 提供文本输入与附件操作的交互区域
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoInputArea, Component]
---

# LiaoInputArea（输入区域）

## 简介
- 支持文本输入、快捷操作与附件上传等交互能力

## 使用示例

### 基础用法

最简单的用法，只需绑定 `v-model` 和 `@send` 事件。

```vue
<template>
  <LiaoInputArea 
    v-model="inputValue" 
    @send="handleSend" 
  />
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');

const handleSend = (text) => {
  console.log('发送消息:', text);
  // 发送后通常需要手动清空输入框（虽然组件内部也会清空，但双向绑定需要同步）
  inputValue.value = '';
};
</script>
```

### 全功能用法（文件、录音、表情）

开启所有功能，并处理各种事件回调。

```vue
<template>
  <LiaoInputArea 
    v-model="inputValue"
    placeholder="请输入消息..."
    :enable-voice-input="true"
    :enable-emoji-input="true"
    :enable-file-upload="true"
    @send="handleSend"
    @voice-record="handleVoiceRecord"
    @file-upload="handleFileUpload"
    @emoji-select="handleEmojiSelect"
  />
</template>

<script setup>
import { ref } from 'vue';

const inputValue = ref('');

// 发送文本
const handleSend = (text) => {
  // 添加到消息列表...
};

// 处理语音录制状态
const handleVoiceRecord = ({ status }) => {
  if (status === 'start') {
    console.log('开始录音...');
  } else if (status === 'stop') {
    console.log('停止录音，开始上传/识别...');
  } else if (status === 'cancel') {
    console.log('取消录音');
  }
};

// 处理文件上传
const handleFileUpload = (fileList) => {
  const files = Array.from(fileList);
  files.forEach(file => {
    console.log('上传文件:', file.name);
    // 执行上传逻辑...
  });
};

// 选择表情
const handleEmojiSelect = (emoji) => {
  console.log('选择了表情:', emoji);
  // 组件会自动将表情插入到输入框中，这里可以做额外处理
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoInputArea\LiaoInputArea.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| modelValue | `string` | 否 | `` |  |
| placeholder | `string` | 否 | `输入消息...` |  |
| disabled | `boolean` | 否 | `false` |  |
| locked | `boolean` | 否 | `false` |  |
| lockReason | `LockReason` | 否 | `null` |  |
| expanded | `boolean` | 否 | `false` |  |
| accept | `string` | 否 | `*/*` |  |
| multiple | `boolean` | 否 | `false` |  |
| showVoice | `boolean` | 否 | `true` |  |
| enableVoiceInput | `boolean` | 否 | `true` |  |
| enableEmojiInput | `boolean` | 否 | `true` |  |
| enableFileUpload | `boolean` | 否 | `true` |  |
| enableCamera | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| deviceType | `string` | 否 | `` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| update:modelValue | `(value: string) => void` |
| send | `(text: string) => void` |
| focus | `(...) => void` |
| blur | `(...) => void` |
| file-upload | `(files: FileList) => void` |
| voice-record | `(event: { status: 'start' | 'stop' | 'cancel' }) => void` |
| emoji-select | `(emoji: Emoji) => void` |
| camera-capture | `(...) => void` |

<!-- @auto-api-end -->

## Slots
| 名称 | 作用域 | 用途 | 示例 |
| ---- | ------ | ---- | ---- |
| actions | - | 自定义操作区 | 组合按钮 |

## 主题与样式（Theme/Vars）
| 变量名 | 默认值 | 影响范围 | 示例 |
| ------ | ------ | -------- | ---- |
| --liao-input-height | `40px` | 输入框高度 | 布局控制 |

## 无障碍（A11y）
- 提供键盘快捷与可访问标签

## 性能与最佳实践
- 避免在输入过程中产生重计算

## 疑难排查
- 事件不触发：检查冒泡与修饰符

## 关联与示例
- 快捷操作栏：`LiaoQuickActionBar`\n- 文件上传：`LiaoFileUpload`\n

