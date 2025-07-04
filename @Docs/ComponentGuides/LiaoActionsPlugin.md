# LiaoActionsPlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-1.4.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--13-green.svg)

## 组件介绍

LiaoActionsPlugin 是一个功能强大的操作按钮插件组件，支持网格和列表两种布局模式，可以展示多个操作按钮，适用于订单操作、快捷功能等场景。

## 功能特性

- 🎯 **多种布局模式**：支持网格（grid）和列表（list）布局
- 📐 **灵活的列数控制**：网格模式下可自定义列数（1-4列）
- 🏷️ **徽章支持**：支持热门、新品、紧急、促销等徽章标识
- 📝 **详细描述**：列表模式下支持显示操作描述
- 🎨 **多种图标类型**：支持 LiaoIcon、图片URL、SVG字符串和文本图标
- ⚠️ **确认操作**：支持需要确认的危险操作样式
- 📱 **响应式设计**：移动端自动优化布局
- 🔒 **状态控制**：支持只读和禁用状态
- ✨ **交互动画**：平滑的悬停、点击和图标动画效果
- 🎨 **自定义样式**：支持自定义背景、颜色、图片等样式

## 基础用法

### 网格布局（默认）

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="actionsData"
    @action="handleAction"
  />
</template>

<script setup>
const actionsData = {
  title: '⚡ 订单快捷操作',
  subtitle: '选择您要执行的操作',
  description: '订单号：#ORD20250611001 | 商品：Sony WH-1000XM5 耳机',
  layout: 'grid',
  columns: 2,
  actions: [
    { 
      id: 'urgent', 
      text: '🚀 加急处理', 
      icon: 'rocket',
      type: 'primary',
      badge: 'hot'
    },
    { 
      id: 'modify_address', 
      text: '📍 修改地址', 
      icon: 'location',
      type: 'default'
    }
  ]
};

const handleAction = (data) => {
  console.log('操作点击:', data);
};
</script>
```

### 列表布局

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="listActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const listActionsData = {
  title: '📋 订单管理操作',
  subtitle: '选择要执行的操作',
  layout: 'list',
  actions: [
    { 
      id: 'view_detail', 
      text: '查看详情', 
      icon: 'eye',
      description: '查看订单的详细信息和状态'
    },
    { 
      id: 'cancel_order', 
      text: '取消订单', 
      icon: 'close',
      description: '取消订单并申请退款',
      type: 'danger',
      confirm: true
    }
  ]
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginData | Object | {} | 插件数据配置对象 |
| status | String | 'normal' | 组件状态 |
| loading | Boolean | false | 是否显示加载状态 |
| readonly | Boolean | false | 是否为只读模式 |

### pluginData 配置项

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | - | 插件标题 |
| subtitle | String | - | 插件副标题 |
| description | String | - | 插件描述信息 |
| layout | String | 'grid' | 布局模式：'grid' 或 'list' |
| columns | Number | 2 | 网格模式下的列数（1-4） |
| actions | Array | [] | 操作按钮数组 |

### actions 配置项

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| id | String | - | 操作唯一标识符（必填） |
| text | String | - | 操作按钮文本（必填） |
| icon | String | - | 图标（LiaoIcon名称、图片URL或SVG） |
| description | String | - | 操作描述（仅列表模式显示） |
| type | String | 'default' | 按钮类型：'primary'、'default'、'danger' |
| badge | String | - | 徽章类型：'hot'、'new'、'urgent'、'sale' |
| disabled | Boolean | false | 是否禁用 |
| confirm | Boolean | false | 是否需要确认（危险操作） |
| extend | Object | {} | 扩展数据 |
| backgroundColor | String | - | 按钮背景色（支持渐变） |
| backgroundImage | String | - | 按钮背景图片URL |
| textColor | String | - | 按钮文字颜色 |
| iconColor | String | - | 按钮图标颜色 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | data | 操作按钮点击事件 |

### action 事件参数

```typescript
{
  type: 'action-click',
  data: {
    id: string,           // 操作ID
    actionText: string,   // 操作文本
    actionType: string,   // 操作类型
    confirm: boolean,     // 是否需要确认
    index: number,        // 按钮索引
    extend: object        // 扩展数据
  }
}
```

## 高级用法

### 自定义样式的网格布局

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="customStyleActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const customStyleActionsData = {
  title: '⚡ 订单快捷操作',
  subtitle: '选择您要执行的操作',
  layout: 'grid',
  columns: 2,
  actions: [
    { 
      id: 'urgent', 
      text: '🚀 加急处理', 
      icon: 'rocket',
      description: '优先处理，预计2小时内发货',
      type: 'primary',
      badge: 'hot',
      backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff'
    },
    { 
      id: 'contact_seller', 
      text: '💬 联系商家', 
      icon: 'message',
      description: '直接与商家沟通产品问题',
      type: 'default',
      backgroundImage: 'https://picsum.photos/200/100?random=bg1',
      textColor: '#ffffff'
    },
    { 
      id: 'cancel_order', 
      text: '❌ 取消订单', 
      icon: 'close',
      description: '取消订单并申请退款',
      type: 'danger',
      confirm: true,
      backgroundColor: '#ff6b6b',
      textColor: '#ffffff',
      iconColor: '#ffffff'
    },
    { 
      id: 'add_note', 
      text: '📝 添加备注', 
      icon: 'edit',
      description: '为订单添加特殊要求',
      type: 'default',
      backgroundColor: 'linear-gradient(45deg, #ffeaa7, #fab1a0)',
      textColor: '#2d3436'
    }
  ]
};

const handleAction = (data) => {
  console.log('操作点击:', data);
};
</script>
```

### 自定义列数的网格布局

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="gridActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const gridActionsData = {
  title: '📋 订单管理操作',
  subtitle: '选择要执行的操作',
  layout: 'grid',
  columns: 3, // 3列布局
  actions: [
    { id: 'view', text: '查看', icon: 'eye' },
    { id: 'edit', text: '编辑', icon: 'edit' },
    { id: 'delete', text: '删除', icon: 'delete', type: 'danger' },
    { id: 'copy', text: '复制', icon: 'copy' },
    { id: 'share', text: '分享', icon: 'share' },
    { id: 'export', text: '导出', icon: 'download' }
  ]
};
</script>
```

### 带徽章和确认的操作

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="badgeActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const badgeActionsData = {
  title: '🎯 特殊操作',
  layout: 'grid',
  columns: 2,
  actions: [
    { 
      id: 'hot_feature', 
      text: '热门功能', 
      icon: 'fire',
      badge: 'hot',
      type: 'primary'
    },
    { 
      id: 'new_feature', 
      text: '新功能', 
      icon: 'star',
      badge: 'new'
    },
    { 
      id: 'urgent_action', 
      text: '紧急处理', 
      icon: 'warning',
      badge: 'urgent',
      type: 'danger'
    },
    { 
      id: 'delete_all', 
      text: '删除全部', 
      icon: 'trash',
      type: 'danger',
      confirm: true // 需要确认的危险操作
    }
  ]
};

const handleAction = (data) => {
  if (data.data.confirm) {
    // 处理需要确认的操作
    if (confirm(`确定要执行"${data.data.actionText}"操作吗？`)) {
      console.log('确认执行:', data);
    }
  } else {
    console.log('直接执行:', data);
  }
};
</script>
```

### 混合图标类型

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="mixedIconsData"
    @action="handleAction"
  />
</template>

<script setup>
const mixedIconsData = {
  title: '🎨 混合图标示例',
  layout: 'list',
  actions: [
    { 
      id: 'liao_icon', 
      text: 'LiaoIcon图标', 
      icon: 'home', // LiaoIcon名称
      description: '使用内置的LiaoIcon图标'
    },
    { 
      id: 'image_icon', 
      text: '图片图标', 
      icon: 'https://example.com/icon.png', // 图片URL
      description: '使用外部图片作为图标'
    },
    { 
      id: 'svg_icon', 
      text: 'SVG图标', 
      icon: '<svg>...</svg>', // SVG字符串
      description: '使用SVG字符串作为图标'
    },
    { 
      id: 'emoji_icon', 
      text: 'Emoji图标', 
      icon: '🎉', // 文本/Emoji
      description: '使用Emoji或文本作为图标'
    }
  ]
};
</script>
```

### 自定义样式和动画效果

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="customStyledActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const customStyledActionsData = {
  title: '🎨 自定义样式操作',
  subtitle: '体验丰富的视觉效果',
  layout: 'grid',
  columns: 2,
  actions: [
    { 
      id: 'gradient_button', 
      text: '渐变按钮', 
      icon: 'star',
      // 渐变背景
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff'
    },
    { 
      id: 'image_button', 
      text: '图片背景', 
      icon: 'image',
      // 背景图片
      background: 'url(https://picsum.photos/200/100)',
      textColor: '#ffffff'
    },
    { 
      id: 'solid_color', 
      text: '纯色背景', 
      icon: 'palette',
      // 纯色背景
      background: '#ff6b6b',
      textColor: '#ffffff',
      iconColor: '#ffeb3b'
    },
    { 
      id: 'multiple_gradient', 
      text: '复杂渐变', 
      icon: 'rainbow',
      // 多色渐变
      background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      textColor: '#ffffff'
    }
  ]
};

const handleAction = (data) => {
  console.log('自定义样式操作:', data);
};
</script>
```

#### 背景样式支持

`background` 字段支持以下类型的背景：

1. **纯色背景**
   ```javascript
   background: '#ff6b6b'           // 十六进制颜色
   background: 'rgb(255, 107, 107)' // RGB颜色
   background: 'rgba(255, 107, 107, 0.8)' // 带透明度的颜色
   ```

2. **渐变背景**
   ```javascript
   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
   background: 'radial-gradient(circle, #ff6b6b, #feca57)'
   background: 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb)'
   ```

3. **背景图片**
   ```javascript
   background: 'url(https://example.com/image.jpg)'
   background: 'url(/local/image.png)'
   ```

4. **复合背景**
   ```javascript
   background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(image.jpg)'
   ```

#### 向后兼容性

为了保持向后兼容，组件仍然支持旧的字段，但建议使用新的 `background` 字段：

```javascript
// ✅ 推荐：使用统一的 background 字段
{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textColor: '#ffffff'
}

// ⚠️ 兼容：旧的字段仍然有效，但不推荐
{
  backgroundColor: '#ff6b6b',  // 会自动转换为 background
  backgroundImage: 'https://example.com/bg.jpg', // 会自动转换为 background
  textColor: '#ffffff'
}
```

### 动画控制

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="animationControlData"
    @action="handleAction"
  />
</template>

<script setup>
const animationControlData = {
  title: '🎭 动画控制示例',
  layout: 'grid',
  columns: 3,
  // 精细化动画控制
  animations: {
    hover: true,    // 启用悬停动画
    click: false,   // 禁用点击动画
    icon: true      // 启用图标动画
  },
  actions: [
    { id: 'hover_only', text: '仅悬停动画', icon: 'mouse' },
    { id: 'icon_only', text: '仅图标动画', icon: 'star' },
    { id: 'no_animation', text: '无动画', icon: 'stop' }
  ]
};
</script>
```

## 样式定制

### CSS 变量

组件使用以下 CSS 变量，可以通过覆盖这些变量来自定义样式：

```scss
.liao-actions-plugin {
  // 间距
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  
  // 颜色
  --primary-color: #1890ff;
  --text-primary: #333333;
  --text-secondary: #666666;
  --text-tertiary: #999999;
  --bg-primary: #ffffff;
  --bg-secondary: #fafafa;
  --border-color-card: #e8e8e8;
  
  // 字体
  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-md: 16px;
  --font-size-lg: 18px;
  
  // 圆角
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
}
```

### 自定义样式示例

```vue
<template>
  <LiaoActionsPlugin
    :plugin-data="customStyledActionsData"
    @action="handleAction"
  />
</template>

<script setup>
const customStyledActionsData = {
  title: '🎨 自定义样式操作',
  subtitle: '体验丰富的视觉效果',
  layout: 'grid',
  columns: 2,
  actions: [
    { 
      id: 'gradient_button', 
      text: '渐变按钮', 
      icon: 'star',
      // 渐变背景
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      textColor: '#ffffff'
    },
    { 
      id: 'image_button', 
      text: '图片背景', 
      icon: 'image',
      // 背景图片
      background: 'url(https://picsum.photos/200/100)',
      textColor: '#ffffff'
    },
    { 
      id: 'solid_color', 
      text: '纯色背景', 
      icon: 'palette',
      // 纯色背景
      background: '#ff6b6b',
      textColor: '#ffffff',
      iconColor: '#ffeb3b'
    },
    { 
      id: 'multiple_gradient', 
      text: '复杂渐变', 
      icon: 'rainbow',
      // 多色渐变
      background: 'linear-gradient(45deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)',
      textColor: '#ffffff'
    }
  ]
};

const handleAction = (data) => {
  console.log('自定义样式操作:', data);
};
</script>
```

#### 背景样式支持

`background` 字段支持以下类型的背景：

1. **纯色背景**
   ```javascript
   background: '#ff6b6b'           // 十六进制颜色
   background: 'rgb(255, 107, 107)' // RGB颜色
   background: 'rgba(255, 107, 107, 0.8)' // 带透明度的颜色
   ```

2. **渐变背景**
   ```javascript
   background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
   background: 'radial-gradient(circle, #ff6b6b, #feca57)'
   background: 'conic-gradient(from 0deg, #ff6b6b, #feca57, #48dbfb)'
   ```

3. **背景图片**
   ```javascript
   background: 'url(https://example.com/image.jpg)'
   background: 'url(/local/image.png)'
   ```

4. **复合背景**
   ```javascript
   background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(image.jpg)'
   ```

#### 向后兼容性

为了保持向后兼容，组件仍然支持旧的字段，但建议使用新的 `background` 字段：

```javascript
// ✅ 推荐：使用统一的 background 字段
{
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  textColor: '#ffffff'
}

// ⚠️ 兼容：旧的字段仍然有效，但不推荐
{
  backgroundColor: '#ff6b6b',  // 会自动转换为 background
  backgroundImage: 'https://example.com/bg.jpg', // 会自动转换为 background
  textColor: '#ffffff'
}
```

## 注意事项

1. **操作ID唯一性**：确保每个操作的 `id` 在同一个插件中是唯一的
2. **图标兼容性**：使用图片URL时，确保图片资源可访问
3. **移动端适配**：在移动端，网格布局会自动限制最大列数为2列
4. **确认操作**：设置 `confirm: true` 的操作建议在事件处理中添加确认逻辑
5. **徽章显示**：徽章仅在网格布局中显示，列表布局中不显示徽章
6. **描述文本**：操作描述仅在列表布局中显示

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### 1.5.0 (2025-06-13)
- 🎨 新增统一的 `background` 字段支持所有背景类型（纯色、渐变、图片）
- 🔧 优化背景样式处理逻辑，智能检测背景类型并应用正确的CSS属性
- 📖 更新文档和示例，展示统一背景字段的使用方法
- ✅ 保持向后兼容性，旧的 `backgroundColor` 和 `backgroundImage` 字段仍然有效

### 1.4.0 (2025-06-13)
- 🔧 移除了全局样式配置（buttonStyle）和动画配置（animations）
- 🎨 简化了组件配置，只保留单个按钮的自定义样式支持
- 🐛 修复了自定义backgroundColor和textColor样式优先级问题
- 📝 更新了组件文档，移除废弃配置说明

### 1.3.0 (2025-06-13)
- ✨ 新增交互动画效果（悬停上浮、点击缩放、图标放大）
- ✨ 新增自定义样式支持（背景色、背景图片、文字颜色、图标颜色）
- ✨ 新增全局样式配置（borderRadius、padding等）

### 1.2.0 (2025-06-13)
- ✨ 新增 subtitle 和 description 属性支持
- ✨ 新增 layout 属性，支持网格和列表两种布局模式
- ✨ 新增 columns 属性，支持自定义网格列数
- ✨ 新增 badge 属性，支持徽章标识
- ✨ 新增 confirm 属性，支持确认操作样式
- ✨ 列表模式下支持显示操作描述
- 🎨 优化移动端响应式布局
- 🐛 修复图标显示问题

### 1.1.0 (2025-06-05)
- ✨ 新增多种图标类型支持
- ✨ 新增只读模式
- 🎨 优化按钮样式和交互效果

### 1.0.0 (2025-06-01)
- 🎉 初始版本发布
- ✨ 基础操作按钮功能
- ✨ 网格布局支持 