# LiaoQuickActionBar 组件使用指南

![版本](https://img.shields.io/badge/版本-1.2.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoQuickActionBar 是一个灵活的快捷操作栏组件，支持水平和垂直布局，提供丰富的交互功能。组件支持横向滚动、拖拽操作、触摸滑动等现代化交互体验。

## 功能特性

- ✅ 支持水平和垂直布局
- ✅ 横向滚动支持（防止卡片超出容器）
- ✅ 鼠标拖拽滚动（桌面端）
- ✅ 触摸滑动滚动（移动端）
- ✅ 鼠标滚轮支持
- ✅ 滚动指示器（左右箭头按钮）
- ✅ 多种操作类型和状态
- ✅ 图标和徽章支持
- ✅ 响应式设计
- ✅ 自定义样式支持

## 基础用法

```vue
<template>
  <LiaoQuickActionBar
    :actions="quickActions"
    @action-click="handleActionClick"
  />
</template>

<script setup>
import { ref } from 'vue';
import LiaoQuickActionBar from '@/components/LiaoQuickActionBar/LiaoQuickActionBar.vue';

const quickActions = ref([
  { id: 'search', text: '搜索', icon: 'search' },
  { id: 'filter', text: '筛选', icon: 'filter', badge: '3' },
  { id: 'sort', text: '排序', icon: 'sort' },
  { id: 'export', text: '导出', icon: 'download', type: 'primary' }
]);

const handleActionClick = (data) => {
  console.log('操作点击:', data.action, data.index);
};
</script>
```

## 横向滚动用法

当快捷操作卡片较多时，组件会自动启用横向滚动功能：

```vue
<template>
  <LiaoQuickActionBar
    :actions="manyActions"
    :showScrollIndicators="true"
    :scrollStep="200"
    @action-click="handleActionClick"
  />
</template>

<script setup>
const manyActions = ref([
  { id: 'action1', text: '操作1', icon: 'home' },
  { id: 'action2', text: '操作2', icon: 'user' },
  { id: 'action3', text: '操作3', icon: 'settings' },
  { id: 'action4', text: '操作4', icon: 'message' },
  { id: 'action5', text: '操作5', icon: 'bell' },
  { id: 'action6', text: '操作6', icon: 'heart' },
  { id: 'action7', text: '操作7', icon: 'star' },
  { id: 'action8', text: '操作8', icon: 'bookmark' }
]);
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| actions | QuickAction[] | [] | 快捷操作数组 |
| vertical | boolean | false | 是否垂直布局 |
| fixed | boolean | false | 是否固定定位 |
| showLabel | boolean | true | 是否显示标签 |
| customClass | string | '' | 自定义CSS类名 |
| showScrollIndicators | boolean | true | 是否显示滚动指示器 |
| scrollStep | number | 200 | 滚动步长（像素） |

## QuickAction 接口

```typescript
interface QuickAction {
  id?: string | number;           // 唯一标识
  icon?: string;                  // 图标名称
  iconSize?: 'small' | 'medium' | 'large'; // 图标大小
  text: string;                   // 显示文本
  label?: string;                 // 标签文本
  badge?: string | number;        // 徽章内容
  active?: boolean;               // 是否激活状态
  disabled?: boolean;             // 是否禁用
  type?: 'default' | 'primary' | 'warning' | 'danger' | 'success'; // 类型
  [key: string]: any;             // 其他自定义属性
}
```

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action-click | { action: QuickAction, index: number } | 操作点击事件 |

## 滚动交互

### 桌面端交互
- **鼠标拖拽**: 按住鼠标左键拖拽进行滚动
- **滚轮滚动**: 支持水平和垂直滚轮滚动
- **指示器按钮**: 点击左右箭头按钮进行滚动

### 移动端交互
- **触摸滑动**: 手指按住左右滑动进行滚动
- **指示器按钮**: 触摸左右箭头按钮进行滚动

### 滚动特性
- 自动隐藏滚动条，保持界面简洁
- 平滑滚动动画效果
- 智能显示/隐藏滚动指示器
- 防止拖拽时误触发点击事件

## 垂直布局

```vue
<template>
  <LiaoQuickActionBar
    :actions="actions"
    :vertical="true"
    @action-click="handleActionClick"
  />
</template>
```

## 固定定位

```vue
<template>
  <LiaoQuickActionBar
    :actions="actions"
    :fixed="true"
    @action-click="handleActionClick"
  />
</template>
```

## 自定义样式

```vue
<template>
  <LiaoQuickActionBar
    :actions="actions"
    customClass="my-custom-bar"
    @action-click="handleActionClick"
  />
</template>

<style>
.my-custom-bar {
  background-color: #f0f0f0;
  border-radius: 8px;
}

.my-custom-bar .liao-quick-action-bar-item {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}
</style>
```

## 暴露的方法

组件通过 `defineExpose` 暴露以下方法：

```typescript
// 获取组件实例
const quickActionBarRef = ref();

// 调用方法
quickActionBarRef.value.scrollLeft();      // 向左滚动
quickActionBarRef.value.scrollRight();     // 向右滚动
quickActionBarRef.value.checkScrollState(); // 检查滚动状态
```

## 样式定制

### CSS 变量

组件使用以下 SCSS 变量，可以通过覆盖这些变量来定制样式：

```scss
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$border-radius-sm: 4px;
$border-color: #d9d9d9;
$primary-color: #1890ff;
$danger-color: #ff4d4f;
$warning-color: #faad14;
$success-color: #52c41a;
$text-color-secondary: #666666;
$shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
$transition-duration: 0.3s;
$transition-timing-function: ease;
```

### 自定义滚动指示器

```scss
.liao-quick-action-bar-scroll-indicator {
  background-color: rgba(0, 0, 0, 0.8) !important;
  color: white !important;
  
  &:hover {
    background-color: #1890ff !important;
  }
}
```

## 注意事项

1. **性能优化**: 当操作数量很多时，组件会自动启用虚拟滚动优化
2. **触摸设备**: 在触摸设备上，滚动指示器会保持可见状态
3. **拖拽冲突**: 拖拽滚动时会自动阻止点击事件，避免误操作
4. **响应式**: 组件在移动端会自动调整卡片大小和间距
5. **无障碍**: 支持键盘导航和屏幕阅读器

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- iOS Safari 12+
- Android Chrome 60+

## 更新日志

### 1.2.0 (2025-06-16)
- ✨ 新增横向滚动功能，防止卡片超出聊天窗口
- ✨ 新增鼠标拖拽滚动支持（桌面端）
- ✨ 新增触摸滑动滚动支持（移动端）
- ✨ 新增鼠标滚轮滚动支持
- ✨ 新增滚动指示器（左右箭头按钮）
- ✨ 新增 `showScrollIndicators` 属性控制指示器显示
- ✨ 新增 `scrollStep` 属性控制滚动步长
- 🔧 优化移动端响应式布局
- 🔧 优化拖拽时的用户体验
- 🔧 优化滚动条隐藏和平滑滚动
- 🐛 修复拖拽时误触发点击事件的问题
- 📚 完善组件文档和使用示例

### 1.1.0 (2025-05-20)
- ✨ 新增垂直布局支持
- ✨ 新增固定定位功能
- ✨ 新增徽章显示功能
- 🔧 优化样式和交互效果

### 1.0.0 (2025-05-01)
- 🎉 初始版本发布
- ✨ 基础快捷操作栏功能
- ✨ 多种操作类型支持
- ✨ 图标和文本显示 