# LiaoTextBubble 组件使用指南

![版本](https://img.shields.io/badge/版本-1.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--06-green.svg)

## 组件介绍

LiaoTextBubble 是 LiaoKit 的基础消息气泡组件，专用于文本消息的美观渲染和交互。它支持自动 emoji 渲染、超链接识别、长消息折叠、复制和高亮等常见 IM 需求，适配多行业标准社交和 AI 对话场景。

## 功能特性

- 📝 **纯文本与富文本消息渲染**：自适应展示短消息、长段落、代码片段
- 😊 **emoji 渲染**：支持 emoji utf8 表情自动识别与可视化展示
- 🔗 **自动超链接化**：自动检测 URL、邮箱、电话等，转为可点击超链
- 📄 **长文本处理**：超长消息自动折叠，支持"展开/收起"
- ✨ **高亮内容显示**：关键字、@提及、AI 标识等高亮配置
- 🌐 **多语言/RTL 兼容**：全支持国际文本方向与功能
- 📋 **复制、选择、长按菜单**：支持消息快速复制、转发等操作
- ✏️ **编辑态展示**：对"可编辑"消息使用专属渲染态
- ⚠️ **错误/状态提示**：如发送失败、撤回、被举报等状态呈现
- 🎨 **主题适配**：自动跟随暗黑/亮色主题切换

## 基础用法

```vue
<template>
  <LiaoTextBubble
    content="这是一条普通文本消息，包含 emoji 😊 和链接 https://example.com"
    :linkify="true"
    :emoji="true"
  />
</template>

<script setup>
import { LiaoTextBubble } from 'liaokat';
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| content | `String` | - | 消息文本内容（必填） |
| linkify | `Boolean` | `true` | 是否自动识别和渲染超链接 |
| emoji | `Boolean` | `true` | 是否启用 emoji 渲染 |
| highlight | `String/Array` | `null` | 需高亮的关键字或正则（支持多关键词） |
| editable | `Boolean` | `false` | 是否处于编辑态 |
| collapsed | `Boolean` | `false` | 是否默认折叠长文本 |
| maxLines | `Number` | `5` | 超过该行数触发折叠 |
| error | `Boolean` | `false` | 是否高亮为"异常/失败"气泡 |
| status | `String` | `null` | 展示特殊气泡状态（如 sending/failed/recalled/report 等） |
| theme | `String` | `'auto'` | 主题风格（auto/light/dark/brand） |
| sender | `Object` | `{}` | 发送者信息（显示头像、昵称等场景专用） |
| customStyle | `Object/String` | `null` | 应用于气泡的自定义样式字段 |
| id | `String/Number` | `null` | 消息ID，用于标识和事件回调 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| copy | `{ content, id }` | 触发复制气泡内容 |
| link-click | `{ url, type, event }` | 用户点击超链接/电话等 |
| bubble-click | `{ content, id }` | 点击整个气泡区域 |
| bubble-longpress | `{ content, id, sourceEvent }` | 气泡区域长按 |
| expand | `{ collapsed, id }` | 折叠/展开气泡时 |

## 插槽 (Slots)

| 插槽名 | 说明 |
|--------|------|
| prefix | 内容区前缀插槽，便于展示头像、标签等 |
| content | 内容区自定义渲染（覆盖默认文本渲染） |
| suffix | 内容区后缀插槽，例如状态图标 |
| expanded | 展开/收起区域自定义渲染 |

## 高级用法

### 关键词高亮

```vue
<template>
  <LiaoTextBubble
    content="Vue 是一个用于构建用户界面的 JavaScript 框架。Vue 可以很好地处理组件化开发。"
    :highlight="['Vue', '组件化']"
  />
</template>
```

### 长文本折叠控制

```vue
<template>
  <LiaoTextBubble
    :content="longText"
    :collapsed="true"
    :maxLines="3"
    @expand="handleExpand"
  />
</template>

<script setup>
import { ref } from 'vue';
import { LiaoTextBubble } from 'liaokat';

const longText = ref(`这是一段非常长的文本内容，可能会超过多行显示。
在实际应用中，用户发送的长消息、系统通知或者AI回答都可能是很长的文本。
为了避免占用过多的屏幕空间，我们可以设置maxLines属性来限制默认显示的行数，
并通过collapsed属性控制是否默认折叠。
用户可以通过点击"展开/收起"按钮来查看完整内容或再次折叠。`);

const handleExpand = (data) => {
  console.log('折叠状态变化:', data.collapsed);
};
</script>
```

### 使用不同主题和状态

```vue
<template>
  <div class="bubbles-container">
    <!-- 普通消息 -->
    <LiaoTextBubble
      content="这是普通主题的消息"
      theme="light"
    />
    
    <!-- 暗色主题 -->
    <LiaoTextBubble
      content="这是暗色主题的消息"
      theme="dark"
    />
    
    <!-- 品牌主题 -->
    <LiaoTextBubble
      content="这是品牌主题的消息"
      theme="brand"
    />
    
    <!-- 错误状态 -->
    <LiaoTextBubble
      content="这条消息发送失败"
      :error="true"
    />
    
    <!-- 发送中状态 -->
    <LiaoTextBubble
      content="消息发送中..."
      status="sending"
    />
    
    <!-- 撤回状态 -->
    <LiaoTextBubble
      content="此消息已被撤回"
      status="recalled"
    />
  </div>
</template>

<style scoped>
.bubbles-container > * {
  margin-bottom: 12px;
}
</style>
```

### 使用自定义前缀和后缀

```vue
<template>
  <LiaoTextBubble content="这是一条带有头像和状态的消息">
    <!-- 前缀插槽（如头像） -->
    <template #prefix>
      <div class="avatar-container">
        <img src="/path/to/avatar.jpg" alt="用户头像" class="avatar" />
      </div>
    </template>
    
    <!-- 后缀插槽（如状态图标） -->
    <template #suffix>
      <div class="status-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 6L9 17l-5-5"></path>
        </svg>
      </div>
    </template>
  </LiaoTextBubble>
</template>

<style scoped>
.avatar-container {
  width: 32px;
  height: 32px;
  margin-right: 8px;
}

.avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.status-icon {
  color: #00b578;
  margin-left: 8px;
  display: flex;
  align-items: center;
}
</style>
```

## 样式定制

LiaoTextBubble 组件支持自定义样式，您可以通过以下方式定制外观：

### 使用 customStyle 属性

```vue
<template>
  <LiaoTextBubble
    content="这是自定义样式的消息"
    :customStyle="{
      backgroundColor: '#f0f9ff',
      borderColor: '#bae6fd',
      borderRadius: '8px',
      fontWeight: 'bold'
    }"
  />
</template>
```

### 通过CSS变量覆盖默认样式

```css
:root {
  --liao-text-bubble-bg: #f8f9fa;
  --liao-text-bubble-color: #212529;
  --liao-text-bubble-border-radius: 12px;
  --liao-text-bubble-padding: 8px 16px;
  --liao-text-bubble-border: 1px solid #dee2e6;
  --liao-text-bubble-highlight-bg: rgba(13, 110, 253, 0.2);
  --liao-text-bubble-link-color: #0d6efd;
}
```

## 注意事项

1. **内容安全**：组件内置了 XSS 防护，会自动转义潜在的危险 HTML 代码
2. **自动检测**：超链接识别功能会自动处理 URL、邮箱和电话号码格式
3. **性能考虑**：对于超长文本（如大段AI回复），建议启用折叠功能以优化性能
4. **主题适配**：当 theme 设置为 "auto" 时，组件会根据系统主题自动切换亮/暗模式
5. **移动端兼容**：在移动设备上长按会触发气泡长按事件，可用于实现移动端菜单

## 浏览器兼容性

- 支持所有现代浏览器（Chrome、Firefox、Safari、Edge最新版本）
- 不支持 IE 浏览器

## 更新日志

### 1.0.0 (2025-06-05)
- 初始版本发布
- 支持文本消息渲染、Emoji显示、链接自动识别
- 支持长文本折叠/展开功能
- 支持关键词高亮
- 提供多种主题和状态 