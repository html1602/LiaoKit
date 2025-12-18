---
title: LiaoEmojiPicker（表情选择器）
description: 选择与插入表情的交互组件
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoEmojiPicker, Component]
---

# LiaoEmojiPicker（表情选择器）

## 简介
- 提供常用表情选择并插入至输入区域

## 使用示例

### 基础用法

通常配合 `Popover` 或作为浮层使用。

```vue
<template>
  <div class="chat-footer">
    <button @click="showEmoji = !showEmoji">😊</button>
    
    <div v-if="showEmoji" class="emoji-popover">
      <LiaoEmojiPicker @select="handleSelect" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showEmoji = ref(false);

const handleSelect = (emoji) => {
  console.log('选中表情:', emoji); 
  // emoji 对象结构: { char: '😀', name: 'grinning face', ... }
  
  showEmoji.value = false;
};
</script>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoEmojiPicker\LiaoEmojiPicker.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| visible | `boolean` | 否 | `true` |  |
| maxRecent | `number` | 否 | `20` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| select | `(...) => void` |
| close | `(...) => void` |

<!-- @auto-api-end -->

## 主题与样式（Theme/Vars）
- 支持面板尺寸与颜色主题调整

## 参考
- 源码：`src/components/LiaoEmojiPicker/LiaoEmojiPicker.vue`

