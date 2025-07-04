# LiaoWindowHeader 组件使用指南

![版本](https://img.shields.io/badge/版本-1.1.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--23-green.svg)

## 组件介绍

LiaoWindowHeader 是一个用于创建聊天窗口头部的组件，提供了标准的标题、操作按钮布局，常与 LiaoWindow 组件配合使用。组件支持自定义左侧、标题和操作区域内容，灵活适应不同的应用场景。

## 功能特性

- 🎯 **标准窗口头部**：符合桌面应用窗口规范的头部布局
- 🎨 **现代化操作按钮**：内置优化的最小化、最大化和关闭按钮，具有精美的hover效果
- 🔧 **自定义插槽**：支持左侧、标题和操作区域的自定义内容
- 💼 **事件回调**：提供操作按钮的事件回调函数
- 🎯 **简洁易用**：简单的API，易于集成
- ✨ **视觉优化**：按钮具有现代化的交互效果和动画

## 基础用法

```vue
<template>
  <LiaoWindowHeader
    title="聊天窗口"
    @close="handleClose"
    @minimize="handleMinimize"
    @maximize="handleMaximize"
  />
</template>

<script setup>
import { LiaoWindowHeader } from 'liaokat';

const handleClose = () => {
  // 处理关闭窗口逻辑
};

const handleMinimize = () => {
  // 处理最小化窗口逻辑
};

const handleMaximize = () => {
  // 处理最大化窗口逻辑
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | `String` | `''` | 窗口标题 |
| showClose | `Boolean` | `true` | 是否显示关闭按钮 |
| showMinimize | `Boolean` | `true` | 是否显示最小化按钮 |
| showMaximize | `Boolean` | `true` | 是否显示最大化按钮 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| close | - | 点击关闭按钮时触发 |
| minimize | - | 点击最小化按钮时触发 |
| maximize | - | 点击最大化按钮时触发 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|--------|------|
| left | 头部左侧内容，如返回按钮、图标等 |
| title | 自定义标题内容，会替换默认的标题文本 |
| actions | 自定义操作按钮区域，会替换默认的最小化、最大化和关闭按钮 |

## 高级用法

### 自定义左侧内容

```vue
<template>
  <LiaoWindowHeader title="聊天窗口">
    <template #left>
      <button class="back-button" @click="goBack">
        <LiaoIcon name="arrow-left" />
      </button>
      <img src="/logo.png" alt="Logo" class="header-logo" />
    </template>
  </LiaoWindowHeader>
</template>

<script setup>
import { LiaoWindowHeader, LiaoIcon } from 'liaokat';

const goBack = () => {
  // 返回逻辑
};
</script>
```

### 自定义标题内容

```vue
<template>
  <LiaoWindowHeader>
    <template #title>
      <div class="custom-title">
        <h3>客户服务</h3>
        <span class="online-status">在线</span>
      </div>
    </template>
  </LiaoWindowHeader>
</template>
```

### 自定义操作按钮

```vue
<template>
  <LiaoWindowHeader title="聊天窗口">
    <template #actions>
      <button class="action-button" @click="toggleTheme">
        <LiaoIcon name="theme" />
      </button>
      <button class="action-button" @click="toggleFullscreen">
        <LiaoIcon name="fullscreen" />
      </button>
      <button class="action-button danger" @click="closeWindow">
        <LiaoIcon name="close" />
      </button>
    </template>
  </LiaoWindowHeader>
</template>

<script setup>
import { LiaoWindowHeader, LiaoIcon } from 'liaokat';

const toggleTheme = () => {
  // 切换主题逻辑
};

const toggleFullscreen = () => {
  // 切换全屏逻辑
};

const closeWindow = () => {
  // 关闭窗口逻辑
};
</script>
```

### 与LiaoWindow组件配合使用

```vue
<template>
  <LiaoWindow>
    <template #header>
      <LiaoWindowHeader 
        title="客户服务"
        @close="handleClose"
      >
        <template #left>
          <div class="user-avatar">
            <img src="/avatar.png" alt="User Avatar" />
            <span class="status-badge"></span>
          </div>
        </template>
      </LiaoWindowHeader>
    </template>
    
    <!-- 窗口内容 -->
  </LiaoWindow>
</template>

<script setup>
import { LiaoWindow, LiaoWindowHeader } from 'liaokat';

const handleClose = () => {
  // 处理关闭窗口逻辑
};
</script>
```

## 样式定制

```scss
// 自定义窗口头部样式
:root {
  --header-bg: #f5f7fa;
  --header-text-color: #333333;
  --header-border-color: #eceef2;
  --header-height: 48px;
  --header-padding: 12px;
  --header-action-hover-bg: rgba(0, 0, 0, 0.05);
  --header-close-hover-bg: #ff4d4f;
  --header-close-hover-color: #ffffff;
}
```

## 注意事项

1. 窗口头部的高度是固定的，以保持一致的视觉效果
2. 如果需要使窗口可拖动，可以在头部区域添加拖拽相关逻辑
3. 确保自定义内容不会超出头部区域的高度，以避免布局问题

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge最新版本）
- 不支持 IE 浏览器

## 更新日志

### 1.0.0 (2025-06-06)
- 初始版本发布
- 实现基础窗口头部功能
- 支持自定义标题和操作按钮
- 提供最小化、最大化和关闭功能

### 1.1.0 (2025-06-23)
- 🎨 **按钮样式优化**：移除默认按钮边框和背景，采用现代化的透明背景设计
- ✨ **交互效果增强**：添加按钮hover、active和focus状态的视觉反馈
- 🔧 **尺寸调整**：将按钮尺寸从24x24增加到28x28，提升点击体验
- 🎯 **动画效果**：添加微妙的缩放动画（hover: scale(1.05), active: scale(0.95)）
- 🚨 **关闭按钮特化**：关闭按钮hover时显示危险色背景(#ff4757)，提供更好的视觉提示
- 🌟 **颜色优化**：按钮默认透明度调整为0.8，hover时变为完全不透明 