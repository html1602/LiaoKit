---
title: LiaoWindow（窗口容器）
description: 承载业务内容的窗口级容器，组合组件与插件
updated: 2025-12-18
version: ^1.x
category: component
tags: [LiaoWindow, Component]
---

# LiaoWindow（窗口容器）

## 简介
- 用于承载业务内容与交互组件，支持与各类插件组合

## 使用示例

### 基础用法

创建一个带有标题和控制按钮（关闭、最小化）的窗口。

```vue
<template>
  <LiaoWindow
    title="在线客服"
    width="400px"
    height="600px"
    @close="handleClose"
    @minimize="handleMinimize"
  >
    <!-- 窗口内容通常包含消息列表和输入区 -->
    <div class="window-content">
      <LiaoMessageList :messages="messages" />
      <LiaoInputArea @send="handleSend" />
    </div>
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([]);

const handleClose = () => {
  console.log('窗口关闭');
};

const handleMinimize = () => {
  console.log('窗口最小化');
};

const handleSend = (text) => {
  // ...
};
</script>

<style scoped>
.window-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
```

### 自定义头部插槽

如果需要更复杂的头部（如显示头像、状态点），可以使用 `#header` 插槽。

```vue
<template>
  <LiaoWindow>
    <template #header>
      <div class="custom-header">
        <div class="status-dot online"></div>
        <span>技术支持 (Online)</span>
        <button class="settings-btn">设置</button>
      </div>
    </template>
    
    <div class="content">...</div>
  </LiaoWindow>
</template>

<style scoped>
.custom-header {
  display: flex;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
}
.status-dot.online {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
```

## API Reference

<!-- @auto-api-start -->
> Source: `src\components\LiaoWindow\LiaoWindow.vue`

### Props
| 名称 | 类型 | 必填 | 默认值 | 说明 |
| ---- | ---- | ---- | ------ | ---- |
| title | `string` | 否 | `` |  |
| width | `[...]` | 否 | `400px` |  |
| height | `[...]` | 否 | `600px` |  |
| maxWidth | `[...]` | 否 | `800px` |  |
| maxHeight | `[...]` | 否 | `800px` |  |
| minWidth | `[...]` | 否 | `320px` |  |
| minHeight | `[...]` | 否 | `500px` |  |
| rounded | `boolean` | 否 | `true` |  |
| shadow | `boolean` | 否 | `true` |  |
| showClose | `boolean` | 否 | `true` |  |
| showMinimize | `boolean` | 否 | `true` |  |
| showMaximize | `boolean` | 否 | `true` |  |
| customClass | `string` | 否 | `` |  |
| defaultSessionMode | `SessionMode` | 否 | `human` |  |
| enableEmergencyUnlock | `boolean` | 否 | `true` |  |
| autoUnlockTimeout | `number` | 否 | `30000` |  |


### Events
| 事件名 | 回调签名 |
| ------ | -------- |
| close | `(...) => void` |
| minimize | `(...) => void` |
| maximize | `(...) => void` |
| session-mode-change | `(...) => void` |
| input-lock-change | `(...) => void` |
| plugin-complete | `(...) => void` |
| plugin-cancel | `(...) => void` |
| plugin-error | `(...) => void` |
| emergency-unlock | `(...) => void` |
| auto-focus-input | `(...) => void` |

<!-- @auto-api-end -->

## Slots
| 名称 | 作用域 | 用途 | 示例 |
| ---- | ------ | ---- | ---- |
| default | - | 窗口内容区 | 放置消息/插件 |
| header | - | 窗口头部 | 标题/操作 |

## 主题与样式（Theme/Vars）
| 变量名 | 默认值 | 影响范围 | 示例 |
| ------ | ------ | -------- | ---- |
| --liao-window-bg | `#fff` | 背景 | 容器背景色 |

## 无障碍（A11y）
- 提供可聚焦区域与键盘操作建议

## 性能与最佳实践
- 内容尽量按需渲染，避免过度嵌套

## 疑难排查
- 样式不生效：检查主样式与变量引入

## 关联与示例
- 头部组件：`LiaoWindowHeader`\n- 列表组件：`LiaoMessageList`\n

