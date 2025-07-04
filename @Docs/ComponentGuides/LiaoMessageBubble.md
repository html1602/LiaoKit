# LiaoMessageBubble 组件使用指南

![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--06-green.svg)

## 组件介绍

LiaoMessageBubble 是一个用于展示聊天消息的气泡组件，支持多种样式和类型，可用于显示文本、Markdown格式内容等。

## 功能特性

- 🎨 **多种气泡类型**：支持自己发送、他人发送和系统消息等不同类型
- 👤 **头像显示**：可选择性显示发送者头像
- ✨ **Markdown 支持**：支持 Markdown 格式文本渲染
- 🕒 **时间显示**：灵活的时间格式化显示
- 📊 **消息状态**：支持发送中、已发送、发送失败等状态显示
- 🎯 **高亮效果**：支持消息高亮显示

## 基础用法

```vue
<template>
  <!-- 他人发送的消息 -->
  <LiaoMessageBubble
    type="other"
    content="你好，这是一条来自他人的消息"
    :time="new Date()"
  />
  
  <!-- 自己发送的消息 -->
  <LiaoMessageBubble
    type="self"
    content="这是我发送的消息"
    :time="new Date()"
  />
  
  <!-- 系统消息 -->
  <LiaoMessageBubble
    type="system"
    content="系统通知：新成员加入聊天"
    :time="new Date()"
  />
</template>

<script setup>
import { LiaoMessageBubble } from 'liaokat';
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| content | `String` | `''` | 消息内容 |
| type | `'self' \| 'other' \| 'system'` | `'other'` | 消息气泡类型 |
| avatar | `String` | `''` | 发送者头像URL |
| showAvatar | `Boolean` | `true` | 是否显示头像 |
| showAvatarSelf | `Boolean` | `true` | 是否显示自己消息的头像 |
| name | `String` | `''` | 发送者名称 |
| showName | `Boolean` | `false` | 是否显示发送者名称 |
| time | `String \| Date \| Number` | `''` | 消息发送时间 |
| showTime | `Boolean` | `true` | 是否显示发送时间 |
| timeFormat | `String` | `'HH:mm'` | 时间格式化模板 |
| highlight | `Boolean` | `false` | 是否高亮显示 |
| status | `'sending' \| 'sent' \| 'failed'` | `'sent'` | 消息发送状态 |
| enableMarkdown | `Boolean` | `true` | 是否启用 Markdown 渲染 |
| customClass | `String` | `''` | 自定义 CSS 类名 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| click | `{ event, type }` | 点击消息气泡时触发 |
| context-menu | `{ event, type }` | 右键点击消息气泡时触发 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | - | 自定义消息内容 |
| avatar | - | 自定义头像内容 |
| name | - | 自定义名称显示 |
| time | - | 自定义时间显示 |

## 高级用法

### Markdown 内容渲染

```vue
<template>
  <LiaoMessageBubble
    type="other"
    content="支持 **粗体**、*斜体* 和 `代码块`\n\n```js\nconsole.log('Hello LiaoKit');\n```"
    :enableMarkdown="true"
  />
</template>
```

### 自定义头像和内容

```vue
<template>
  <LiaoMessageBubble type="other" :time="new Date()">
    <template #avatar>
      <div class="custom-avatar">
        <img src="/path/to/avatar.jpg" alt="Custom Avatar" />
      </div>
    </template>
    
    <div class="custom-content">
      这是自定义消息内容
      <span class="emoji">👍</span>
    </div>
  </LiaoMessageBubble>
</template>
```

### 消息状态展示

```vue
<template>
  <!-- 发送中状态 -->
  <LiaoMessageBubble
    type="self"
    content="正在发送的消息..."
    status="sending"
  />
  
  <!-- 发送失败状态 -->
  <LiaoMessageBubble
    type="self"
    content="发送失败的消息"
    status="failed"
  />
</template>
```

## 样式定制

```scss
// 自定义气泡样式
:root {
  --bubble-bg-self: #2669FF;  // 自己消息的背景色
  --bubble-text-self: #FFFFFF;  // 自己消息的文本色
  --bubble-bg-other: #FFFFFF;  // 他人消息的背景色
  --bubble-border-other: #ECEEF2;  // 他人消息的边框色
  --bubble-radius: 12px;  // 气泡圆角
}
```

## 注意事项

1. Markdown 渲染默认启用，但需要注意 XSS 安全问题
2. 时间格式化遵循简单规则，复杂格式化建议使用自定义时间插槽
3. 系统消息没有头像和名称显示

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge最新版本）
- 不支持 IE 浏览器

## 更新日志

### 1.0.0 (2025-06-06)
- 初始版本发布
- 支持三种基本消息类型
- 添加 Markdown 渲染支持
- 实现消息状态和时间显示 