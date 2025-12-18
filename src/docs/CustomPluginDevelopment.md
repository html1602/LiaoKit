# LiaoKit 自定义插件开发指南

本文档详细介绍如何为LiaoKit开发和注册自定义插件，帮助您扩展聊天界面的功能。

## 目录

1. [插件系统概述](#插件系统概述)
2. [开发自定义插件](#开发自定义插件)
3. [注册自定义插件](#注册自定义插件)
4. [在消息中使用插件](#在消息中使用插件)
5. [插件通信机制](#插件通信机制)
6. [插件样式指南](#插件样式指南)
7. [最佳实践](#最佳实践)
8. [常见问题](#常见问题)

## 插件系统概述

LiaoKit的插件系统允许您创建自定义的交互式UI组件，这些组件可以嵌入到消息气泡中。每个插件都是一个Vue组件，接收数据并可以触发操作事件。

插件系统的主要特点：

- **组件化**: 每个插件都是独立的Vue组件
- **数据驱动**: 通过`pluginData`属性接收数据
- **事件通信**: 通过`action`事件向上传递用户操作
- **中央注册**: 使用全局注册表管理所有插件
- **自动加载**: 内置插件自动注册，自定义插件需手动注册

## 开发自定义插件

### 步骤1: 创建插件组件文件

创建一个Vue单文件组件（.vue文件），例如`MyCustomPlugin.vue`：

```vue
<template>
  <div class="my-custom-plugin">
    <!-- 插件UI -->
    <h3 class="my-custom-plugin-title">{{ pluginData.title }}</h3>
    <p class="my-custom-plugin-content">{{ pluginData.content }}</p>
    <button 
      class="my-custom-plugin-button"
      @click="handleAction"
      :disabled="loading || readonly"
    >
      {{ pluginData.buttonText || '确认' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
// 定义Props
const props = defineProps({
  // 必需的Props
  pluginData: {
    type: Object,
    default: () => ({})
  },
  
  // 可选的Props（由LiaoPluginBubble传入）
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['action']);

// 处理用户操作
const handleAction = () => {
  // 触发action事件，传递操作类型和相关数据
  emit('action', {
    type: 'button-click',         // 操作类型
    data: {                        // 操作相关数据
      id: props.pluginData.id,
      value: props.pluginData.value
    }
  });
};
</script>

<style lang="scss" scoped>
.my-custom-plugin {
  padding: 16px;
  
  &-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  &-content {
    font-size: 14px;
    margin-bottom: 12px;
    color: #666;
  }
  
  &-button {
    padding: 6px 12px;
    background-color: #1890ff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background-color: #40a9ff;
    }
    
    &:disabled {
      background-color: #d9d9d9;
      cursor: not-allowed;
    }
  }
}
</style>
```

### 步骤2: 定义插件接口

您的插件必须实现以下接口：

#### 必需的Props

```typescript
// 插件数据，包含插件显示和行为所需的所有信息
pluginData: {
  type: Object,
  default: () => ({})
}
```

#### 可选的Props

```typescript
// 插件状态，可用于显示不同的UI状态
status: {
  type: String,  // 'normal' | 'success' | 'error' | 'warning' | 'info'
  default: 'normal'
},

// 加载状态，表示插件是否正在加载数据
loading: {
  type: Boolean,
  default: false
},

// 只读状态，表示插件是否可交互
readonly: {
  type: Boolean,
  default: false
}
```

#### 必需的事件

```typescript
// action事件，用于向上传递用户操作
emit('action', {
  type: string,    // 操作类型，如'click', 'submit', 'select'等
  data: any        // 操作相关数据
});
```

## 注册自定义插件

开发完插件后，需要将其注册到LiaoKit的插件系统中。有两种注册方式：

### 方式1: 使用registerPlugin函数

```typescript
import { registerPlugin } from 'liao-kit';
import MyCustomPlugin from './MyCustomPlugin.vue';

// 注册插件，第一个参数是插件类型名称，第二个参数是插件组件
registerPlugin('my-custom', MyCustomPlugin);
```

### 方式2: 通过Vue插件系统

```typescript
import { createApp } from 'vue';
import App from './App.vue';
import LiaoKit from 'liao-kit';
import MyCustomPlugin from './MyCustomPlugin.vue';

const app = createApp(App);

// 安装LiaoKit
app.use(LiaoKit);

// 注册自定义插件
LiaoKit.registerPlugin('my-custom', MyCustomPlugin);

app.mount('#app');
```

> **注意**: 注册时的插件类型名称（如'my-custom'）将用于在消息中引用该插件。

## 在消息中使用插件

注册插件后，您可以在消息数据中使用该插件：

```typescript
// 创建使用自定义插件的消息
const message = {
  id: 'msg-123',
  type: 'plugin',           // 指定消息类型为plugin
  pluginType: 'my-custom',  // 指定插件类型名称
  pluginData: {             // 传递给插件的数据
    title: '确认操作',
    content: '您确定要执行此操作吗？',
    buttonText: '确认',
    id: 'action-123',
    value: 'someValue'
  },
  time: new Date(),
  isSelf: false
};

// 添加到消息列表
messages.value.push(message);
```

## 插件通信机制

### 发送事件

插件可以通过`action`事件向父组件传递用户操作：

```typescript
// 在插件内部
const handleClick = () => {
  emit('action', {
    type: 'button-click',
    data: { id: 'btn-1', value: 'clicked' }
  });
};
```

### 接收事件

在LiaoMessageList组件中，您可以监听插件事件：

```vue
<template>
  <LiaoMessageList 
    :messages="messages"
    @plugin-action="handlePluginAction"
  />
</template>

<script setup>
const handlePluginAction = (event) => {
  console.log('Plugin action:', event);
  // event包含:
  // - action: 插件触发的原始事件 {type, data}
  // - message: 包含该插件的完整消息对象
  
  // 根据事件类型和数据执行相应操作
  if (event.action.type === 'button-click') {
    // 处理按钮点击事件
  }
};
</script>
```

## 插件样式指南

为保持UI一致性，建议您的插件遵循以下样式指南：

### 颜色

- 使用LiaoKit的变量系统
- 主色：`$primary-color`（蓝色）
- 成功色：`$success-color`（绿色）
- 警告色：`$warning-color`（黄色）
- 错误色：`$danger-color`（红色）
- 文本颜色：`$text-primary`（深色）和`$text-secondary`（浅色）

### 尺寸

- 内边距：16px
- 字体大小：标题16px，正文14px，小文本12px
- 圆角：4px

### SCSS混入

您可以使用LiaoKit提供的混入：

```scss
@import '../../styles/mixins.scss';

.my-custom-plugin {
  @include hover-effect;
  @include card-shadow;
  
  // ...其他样式
}
```

## 最佳实践

1. **组件轻量化**: 保持插件组件轻量，避免大量依赖
2. **响应式设计**: 确保插件在不同尺寸屏幕上正常显示
3. **错误处理**: 添加适当的错误处理和默认值
4. **加载状态**: 处理`loading`属性，显示适当的加载状态
5. **状态反馈**: 使用`status`属性反映不同状态
6. **数据验证**: 验证`pluginData`，防止缺少必要数据时出错
7. **命名规范**: 为避免冲突，使用特定前缀命名插件类型

## 常见问题

### 我的插件未显示或显示"未知插件类型"

- 检查插件是否已正确注册
- 确认消息中的`pluginType`与注册时使用的名称完全一致
- 确保在使用插件前完成注册

### 插件事件未触发

- 确认已正确实现`emit('action', ...)`
- 检查LiaoMessageList组件是否绑定了`@plugin-action`事件
- 查看控制台是否有错误

### 如何添加插件交互动画

```vue
<template>
  <div class="my-custom-plugin" :class="{ 'is-active': isActive }">
    <!-- 内容 -->
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isActive = ref(false);

const toggleActive = () => {
  isActive.value = !isActive.value;
};
</script>

<style lang="scss" scoped>
.my-custom-plugin {
  transition: all 0.3s ease;
  
  &.is-active {
    transform: scale(1.02);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}
</style>
```

### 如何在插件中使用异步数据

```vue
<script lang="ts" setup>
import { ref, watchEffect } from 'vue';

const props = defineProps({
  pluginData: Object
});

const data = ref(null);
const loading = ref(false);

watchEffect(async () => {
  if (props.pluginData?.dataUrl) {
    loading.value = true;
    try {
      const response = await fetch(props.pluginData.dataUrl);
      data.value = await response.json();
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      loading.value = false;
    }
  }
});
</script>
```

---

## 下一步

查看[插件示例集合](./PluginExamples.md)获取更多示例和灵感。

如有任何问题，请联系开发团队或提交Issue。 

---

> 使用者提示：如果你是在寻找“组件库使用文档”（快速开始、组件/插件说明、场景组合与 FAQ），请前往 `../../docs-user/README.md`。
