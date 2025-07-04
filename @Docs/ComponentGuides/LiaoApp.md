# LiaoApp 组件使用指南

![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--06-green.svg)

## 组件介绍

LiaoApp 是 LiaoKit 的核心容器组件，提供了完整的聊天应用布局和功能整合。它集成了消息列表、输入区域和快捷操作栏等组件，作为整个聊天应用的入口点，简化了开发流程，同时提供了高度的自定义能力。

## 功能特性

- 🖼️ **完整布局**：提供标准聊天应用的布局结构
- 🧩 **组件整合**：集成消息列表、输入区域和快捷操作栏
- 🌐 **窗口模式**：支持独立窗口样式，适合弹窗场景
- 🚀 **事件传递**：统一管理各子组件的事件
- 🎨 **插槽定制**：提供丰富的插槽实现高度自定义
- 📱 **响应式设计**：适配不同屏幕尺寸

## 基础用法

```vue
<template>
  <LiaoApp
    :messages="messages"
    :loading="loading"
    :has-more="hasMore"
    @send="handleSend"
    @load-more="loadMoreMessages"
  >
    <template #header>
      <div class="custom-header">
        <h3>客户服务</h3>
      </div>
    </template>
  </LiaoApp>
</template>

<script setup>
import { ref } from 'vue';
import { LiaoApp } from 'liaokat';

const messages = ref([
  {
    id: '1',
    content: '您好，有什么可以帮助您的？',
    isSelf: false,
    time: new Date(Date.now() - 60000)
  },
  {
    id: '2',
    content: '我想了解一下产品功能',
    isSelf: true,
    time: new Date()
  }
]);

const loading = ref(false);
const hasMore = ref(true);

const handleSend = (message) => {
  // 处理发送消息的逻辑
  messages.value.push({
    id: Date.now().toString(),
    content: message,
    isSelf: true,
    time: new Date()
  });
};

const loadMoreMessages = () => {
  // 加载更多历史消息的逻辑
  loading.value = true;
  setTimeout(() => {
    // 模拟加载更多消息
    loading.value = false;
  }, 1000);
};
</script>
```

## 属性 (Props)

LiaoApp 组件支持大量属性，可分为以下几类：

### 基础配置

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| windowMode | `Boolean` | `false` | 是否使用窗口模式（添加边框、圆角和阴影） |
| customClass | `String` | `''` | 自定义CSS类名 |

### 消息列表相关

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| messages | `Array<Message>` | `[]` | 消息数据数组 |
| loading | `Boolean` | `false` | 是否正在加载消息 |
| emptyText | `String` | `'暂无消息'` | 消息列表为空时显示的文本 |
| showAvatar | `Boolean` | `true` | 是否显示头像 |
| showName | `Boolean` | `false` | 是否显示发送者名称 |
| showTime | `Boolean` | `true` | 是否显示消息时间 |
| hasMore | `Boolean` | `false` | 是否还有更多历史消息可加载 |
| loadMoreText | `String` | `'加载更多'` | 加载更多按钮的文本 |
| scrollToBottom | `Boolean` | `true` | 新消息到达时是否自动滚动到底部 |

### 输入区域相关

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| showInput | `Boolean` | `true` | 是否显示输入区域 |
| modelValue | `String` | `''` | 输入框内容，支持v-model |
| inputPlaceholder | `String` | `'请输入...'` | 输入框占位文本 |
| inputDisabled | `Boolean` | `false` | 是否禁用输入框 |
| inputReadonly | `Boolean` | `false` | 是否只读 |
| inputRows | `Number` | `2` | 输入框默认行数 |
| inputMaxLength | `Number` | `0` | 最大输入字数，0表示不限制 |
| showInputLength | `Boolean` | `true` | 是否显示字数统计 |
| inputExpanded | `Boolean` | `false` | 是否处于展开状态 |
| sendOnEnter | `Boolean` | `true` | 是否按Enter键发送消息 |
| sendOnCtrlEnter | `Boolean` | `false` | 是否按Ctrl+Enter键发送消息 |
| sendEmpty | `Boolean` | `false` | 是否允许发送空消息 |

### 快捷操作栏相关

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| showQuickActions | `Boolean` | `false` | 是否显示快捷操作栏 |
| quickActions | `Array<QuickAction>` | `[]` | 快捷操作按钮数组 |
| quickActionsVertical | `Boolean` | `false` | 快捷操作栏是否使用垂直布局 |
| quickActionsFixed | `Boolean` | `false` | 快捷操作栏是否固定在底部 |
| showQuickActionLabel | `Boolean` | `true` | 是否显示快捷操作按钮的文本标签 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| update:modelValue | `value: string` | 输入内容变化时触发 |
| send | `message: string` | 发送消息时触发 |
| load-more | - | 点击加载更多按钮时触发 |
| scroll | `{ scrollTop, scrollHeight, clientHeight }` | 滚动消息列表时触发 |
| scroll-to-top | - | 滚动到顶部时触发 |
| scroll-to-bottom | - | 滚动到底部时触发 |
| input-focus | `event: FocusEvent` | 输入框获得焦点时触发 |
| input-blur | `event: FocusEvent` | 输入框失去焦点时触发 |
| input-keydown | `event: KeyboardEvent` | 输入框按键按下时触发 |
| quick-action | `{ action, index }` | 点击快捷操作按钮时触发 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|--------|------|
| header | 顶部区域内容 |
| footer | 底部区域内容 |
| message | 自定义消息渲染，参数：`{ message, index, isLastMessage }` |
| empty | 消息列表为空时的内容 |
| loading | 加载中状态的内容 |
| load-more | 加载更多按钮的内容 |
| input-before | 输入区域前的内容 |
| input-actions | 输入区域操作按钮 |
| input-after | 输入区域后的内容 |

## 方法 (Methods)

LiaoApp 组件通过 ref 暴露以下方法：

| 方法名 | 参数 | 返回值 | 说明 |
|--------|------|--------|------|
| focusInput | - | - | 使输入框获得焦点 |
| clearInput | - | - | 清空输入框内容 |
| send | - | - | 发送当前输入框内容 |

## 高级用法

### 窗口模式

```vue
<template>
  <div class="app-container">
    <LiaoApp
      :window-mode="true"
      :messages="messages"
      @send="handleSend"
    >
      <template #header>
        <div class="window-header">
          <img src="/logo.png" alt="Logo" class="logo" />
          <h3>客户服务</h3>
        </div>
      </template>
    </LiaoApp>
  </div>
</template>
```

### 自定义消息渲染

```vue
<template>
  <LiaoApp :messages="messages" @send="handleSend">
    <template #message="{ message, isLastMessage }">
      <div 
        class="custom-message" 
        :class="[
          message.isSelf ? 'self' : 'other',
          { 'last-message': isLastMessage }
        ]"
      >
        <img 
          v-if="message.avatar" 
          :src="message.avatar" 
          class="avatar" 
        />
        
        <div class="message-content">
          <div v-if="message.type === 'text'" class="text-content">
            {{ message.content }}
          </div>
          <div v-else-if="message.type === 'image'" class="image-content">
            <img :src="message.content" :alt="message.alt || '图片'" />
          </div>
        </div>
        
        <div class="message-time">
          {{ formatTime(message.time) }}
        </div>
      </div>
    </template>
  </LiaoApp>
</template>

<script setup>
import { LiaoApp } from 'liaokat';

// 格式化时间函数
const formatTime = (time) => {
  if (!time) return '';
  const date = new Date(time);
  return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};
</script>
```

### 添加快捷操作栏

```vue
<template>
  <LiaoApp
    :messages="messages"
    :show-quick-actions="true"
    :quick-actions="quickActions"
    @send="handleSend"
    @quick-action="handleQuickAction"
  />
</template>

<script setup>
import { ref } from 'vue';
import { LiaoApp } from 'liaokat';

const messages = ref([/* ... */]);

const quickActions = ref([
  {
    id: 'faq',
    icon: 'mdi:help-circle',
    label: '常见问题'
  },
  {
    id: 'feedback',
    icon: 'mdi:thumb-up',
    label: '评价'
  }
]);

const handleQuickAction = ({ action }) => {
  if (action.id === 'faq') {
    // 展示常见问题
  } else if (action.id === 'feedback') {
    // 显示评价表单
  }
};
</script>
```

### 使用引用获取组件方法

```vue
<template>
  <div>
    <button @click="focusChat">开始聊天</button>
    
    <LiaoApp
      ref="chatAppRef"
      :messages="messages"
      @send="handleSend"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LiaoApp } from 'liaokat';

const chatAppRef = ref(null);
const messages = ref([/* ... */]);

const focusChat = () => {
  if (chatAppRef.value) {
    chatAppRef.value.focusInput();
  }
};

const sendPresetMessage = (text) => {
  if (chatAppRef.value) {
    // 设置预设文本并发送
    chatAppRef.value.setInputValue(text);
    chatAppRef.value.send();
  }
};
</script>
```

## 样式定制

```scss
// 自定义应用样式
:root {
  --app-bg: #ffffff;
  --app-border-color: #eceef2;
  --app-border-radius: 12px;
  --app-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  --window-default-width: 380px;
  --window-default-height: 600px;
  --header-bg: #f5f7fa;
  --footer-bg: #f5f7fa;
}
```

## 与UI框架集成

LiaoApp 组件可以轻松集成到各种 UI 框架中，例如：

### 与 Element Plus 集成

```vue
<template>
  <el-dialog
    v-model="chatVisible"
    title="客户服务"
    width="400px"
    custom-class="chat-dialog"
  >
    <LiaoApp
      :messages="messages"
      :show-avatar="true"
      :has-more="hasMore"
      @send="handleSend"
      @load-more="loadMoreMessages"
    />
  </el-dialog>
  
  <el-button type="primary" @click="chatVisible = true">
    打开聊天窗口
  </el-button>
</template>

<script setup>
import { ref } from 'vue';
import { LiaoApp } from 'liaokat';

const chatVisible = ref(false);
const messages = ref([/* ... */]);
const hasMore = ref(true);

// 处理方法...
</script>

<style>
.chat-dialog .el-dialog__body {
  padding: 0;
  height: 500px;
  overflow: hidden;
}
</style>
```

## 注意事项

1. LiaoApp 组件通常作为整个聊天功能的入口点，避免在同一页面使用多个实例
2. 窗口模式下，建议提供适当的容器，以便组件可以自适应布局
3. 消息数组中的每个消息对象必须包含唯一的 `id` 属性
4. 使用自定义消息渲染时，注意保持与默认渲染一致的用户体验

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge最新版本）
- 不支持 IE 浏览器

## 更新日志

### 1.0.0 (2025-06-06)
- 初始版本发布
- 实现基础聊天应用布局
- 集成消息列表、输入区域和快捷操作栏
- 支持窗口模式和自定义插槽 