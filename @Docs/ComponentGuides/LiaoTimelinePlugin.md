# LiaoTimelinePlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-2.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--13-green.svg)

## 组件介绍

LiaoTimelinePlugin 是一个高度通用的时间线组件，专为多种场景设计，包括物流追踪、活动进度、工作任务推进、项目开发历程等。组件提供丰富的配置选项和视觉效果，支持图标、进度条、标签、操作按钮等多种元素。

## 功能特性

- 📋 **多场景支持** - 物流追踪、活动进度、任务管理、项目开发等
- 🎨 **丰富的视觉元素** - 图标、进度条、标签、徽章、详细信息
- 📱 **响应式设计** - 支持桌面端和移动端自适应
- 🎯 **灵活配置** - 多种尺寸、布局选项和自定义样式
- 🔗 **富文本内容** - 支持文本、链接、标签等混合内容
- 📊 **统计信息** - 可选的底部统计数据展示
- ⚡ **交互操作** - 支持节点级操作按钮和事件回调

## 基础用法

### 简单时间线

```vue
<template>
  <LiaoTimelinePlugin :plugin-data="simpleTimeline" @action="handleAction" />
</template>

<script setup>
import { LiaoTimelinePlugin } from '@/components/LiaoPlugins';

const simpleTimeline = {
  title: '📦 订单处理流程',
  items: [
    {
      id: 'step1',
      title: '订单确认',
      content: '您的订单已确认，正在准备处理',
      time: '2025-06-13 10:30',
      status: 'success'
    },
    {
      id: 'step2', 
      title: '商品准备',
      content: '正在为您准备商品',
      time: '2025-06-13 11:00',
      status: 'processing',
      pending: true
    }
  ]
};

const handleAction = (data) => {
  console.log('时间线操作:', data);
};
</script>
```

### 活动进度跟踪

```vue
<template>
  <LiaoTimelinePlugin :plugin-data="activityTimeline" @action="handleAction" />
</template>

<script setup>
const activityTimeline = {
  title: '🎉 2025年度技术大会',
  subtitle: '前沿技术·创新分享·深度交流',
  description: '跟踪活动各个阶段的准备和执行进度',
  size: 'default',
  items: [
    {
      id: 'activity_final',
      title: '🎊 活动圆满结束',
      subtitle: '感谢所有参与者的支持',
      content: [
        { type: 'text', value: '本次技术大会圆满落幕！共有 ' },
        { type: 'tag', text: '500+', color: 'success' },
        { type: 'text', value: ' 位技术专家参与，收获了 ' },
        { type: 'tag', text: '50+', color: 'primary' },
        { type: 'text', value: ' 个精彩议题分享。期待明年再相聚！' }
      ],
      time: '2025-06-15 18:00',
      duration: '活动周期：3天',
      status: 'success',
      icon: 'trophy',
      iconColor: '#fff',
      highlighted: true,
      badge: { text: '已完成', type: 'success' },
      details: [
        { label: '参与人数', value: '512人' },
        { label: '演讲议题', value: '52个' },
        { label: '满意度', value: '98.5%' },
        { label: '网络直播', value: '2.8万观看' }
      ],
      actions: [
        { text: '📊 查看总结', action: 'view_summary', type: 'primary', icon: 'chart' },
        { text: '📷 活动相册', action: 'view_photos', type: 'default', icon: 'image' }
      ]
    }
  ],
  showStats: true,
  stats: [
    { label: '参与人数', value: '512', color: '#1890ff' },
    { label: '演讲主题', value: '52', color: '#52c41a' },
    { label: '活动天数', value: '3', color: '#722ed1' },
    { label: '满意度', value: '98.5%', color: '#fa8c16' }
  ]
};
</script>
```

### 任务开发进度

```vue
<template>
  <LiaoTimelinePlugin :plugin-data="taskTimeline" @action="handleAction" />
</template>

<script setup>
const taskTimeline = {
  title: '📋 LiaoKit v2.0 开发计划',
  subtitle: '新一代组件库开发进度跟踪',
  description: '持续跟踪项目各个里程碑的完成情况',
  items: [
    {
      id: 'task_testing',
      title: '🧪 最终测试验收',
      subtitle: '全面功能测试与性能优化',
      content: '完成所有功能模块的集成测试，性能基准测试，兼容性验证',
      time: '2025-06-25 - 2025-06-30',
      duration: '6天',
      status: 'processing',
      icon: 'check-circle',
      iconColor: '#fff',
      highlighted: true,
      progress: 75,
      progressColor: '#1890ff',
      details: [
        { label: '单元测试', value: '95% 通过' },
        { label: '集成测试', value: '进行中' },
        { label: '性能测试', value: '待开始' },
        { label: '兼容性测试', value: '待开始' }
      ],
      actions: [
        { text: '📊 测试报告', action: 'view_test_report', type: 'primary', icon: 'file-text' },
        { text: '🐛 问题列表', action: 'view_issues', type: 'default', icon: 'bug' }
      ]
    }
  ],
  showStats: true,
  stats: [
    { label: '总进度', value: '75%', color: '#1890ff' },
    { label: '已完成', value: '8/12', color: '#52c41a' },
    { label: '进行中', value: '3', color: '#faad14' },
    { label: '剩余天数', value: '15', color: '#f5222d' }
  ],
  showMore: true,
  loadMoreText: '查看历史记录'
};
</script>
```

## 属性 (Props)

### pluginData

| 属性名 | 类型 | 默认值 | 说明 |
|-----|-----|-----|-----|
| title | string | - | 时间线标题 |
| subtitle | string | - | 时间线副标题 |
| description | string | - | 时间线描述 |
| items | TimelineItem[] | [] | 时间线节点列表 |
| layout | 'vertical' \| 'horizontal' | 'vertical' | 布局方向（暂支持垂直） |
| size | 'small' \| 'default' \| 'large' | 'default' | 组件尺寸 |
| showMore | boolean | false | 是否显示"加载更多"按钮 |
| loadMoreText | string | '加载更多' | 加载更多按钮文本 |
| showStats | boolean | false | 是否显示统计信息 |
| stats | TimelineStats[] | [] | 统计信息列表 |

### TimelineItem 数据结构

| 属性名 | 类型 | 默认值 | 说明 |
|-----|-----|-----|-----|
| id | string \| number | - | 节点唯一标识 |
| title | string | - | 节点标题（必填） |
| subtitle | string | - | 节点副标题 |
| time | string | - | 时间信息 |
| duration | string | - | 持续时间 |
| content | string \| ContentItem[] | - | 内容，支持富文本 |
| status | StatusType | 'default' | 节点状态 |
| color | string | - | 自定义节点颜色 |
| lineColor | string | - | 自定义连接线颜色 |
| lineStyle | 'solid' \| 'dashed' \| 'dotted' | 'solid' | 连接线样式 |
| icon | string | - | 节点图标名称 |
| iconColor | string | '#fff' | 图标颜色 |
| badge | BadgeConfig | - | 徽章配置 |
| progress | number | - | 进度百分比 (0-100) |
| progressColor | string | - | 进度条颜色 |
| details | DetailItem[] | - | 详细信息列表 |
| actions | TimelineAction[] | - | 操作按钮列表 |
| pending | boolean | false | 是否为待定状态 |
| highlighted | boolean | false | 是否高亮显示 |

### 状态类型

```typescript
type StatusType = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'processing'
```

### 富文本内容

```typescript
interface ContentItem {
  type: 'text' | 'link' | 'tag';
  value?: string;    // text类型使用
  text?: string;     // link和tag类型使用
  url?: string;      // link类型使用
  color?: string;    // tag类型使用
}
```

### 操作按钮

```typescript
interface TimelineAction {
  text: string;
  action: string;
  type?: 'default' | 'primary' | 'danger' | 'success';
  icon?: string;
  disabled?: boolean;
  extend?: Record<string, any>;
}
```

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|-----|-----|
| action | ActionEvent | 当用户点击操作按钮或加载更多时触发 |

### ActionEvent 类型

```typescript
interface ActionEvent {
  type: 'timeline-action' | 'timeline-load-more';
  data?: {
    action?: string;
    actionText?: string;
    item?: TimelineItem;
    index?: number;
    extend?: Record<string, any>;
  };
}
```

## 高级用法

### 混合内容展示

```vue
<script setup>
const mixedContentTimeline = {
  title: '📈 项目里程碑',
  items: [
    {
      title: '🚀 产品发布',
      content: [
        { type: 'text', value: '正式发布了 ' },
        { type: 'tag', text: 'v2.0', color: 'primary' },
        { type: 'text', value: ' 版本，新增了 ' },
        { type: 'link', text: '50+ 个新功能', url: '/features' },
        { type: 'text', value: '，获得了用户的 ' },
        { type: 'tag', text: '广泛好评', color: 'success' }
      ],
      time: '2025-06-13',
      status: 'success',
      icon: 'rocket'
    }
  ]
};
</script>
```

### 进度跟踪时间线

```vue
<script setup>
const progressTimeline = {
  title: '📊 开发进度',
  items: [
    {
      title: '前端开发',
      content: '用户界面和交互逻辑开发',
      progress: 85,
      progressColor: '#52c41a',
      status: 'processing',
      details: [
        { label: '组件开发', value: '90%' },
        { label: '页面集成', value: '80%' },
        { label: '测试覆盖', value: '75%' }
      ]
    },
    {
      title: '后端API',
      content: '服务端接口开发',
      progress: 60,
      progressColor: '#1890ff',
      status: 'processing'
    }
  ]
};
</script>
```

### 多尺寸展示

```vue
<template>
  <!-- 小尺寸 -->
  <LiaoTimelinePlugin :plugin-data="{ ...timeline, size: 'small' }" />
  
  <!-- 默认尺寸 -->
  <LiaoTimelinePlugin :plugin-data="{ ...timeline, size: 'default' }" />
  
  <!-- 大尺寸 -->
  <LiaoTimelinePlugin :plugin-data="{ ...timeline, size: 'large' }" />
</template>
```

## 样式定制

### 自定义主题色

```scss
.liao-timeline-plugin {
  --timeline-primary-color: #1890ff;
  --timeline-success-color: #52c41a;
  --timeline-warning-color: #faad14;
  --timeline-danger-color: #ff4d4f;
  --timeline-info-color: #13c2c2;
  --timeline-processing-color: #722ed1;
}
```

### 自定义节点样式

```scss
.liao-timeline-plugin-item-dot {
  // 自定义节点圆点
  border-width: 3px;
  
  &.liao-timeline-plugin-item-dot-icon {
    // 自定义图标节点
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
```

### 连接线自定义

```scss
.liao-timeline-plugin-item-tail {
  // 自定义连接线
  border-left-width: 3px;
  opacity: 0.8;
}
```

## 应用场景

### 1. 物流追踪
- 包裹状态跟踪
- 配送进度展示
- 签收确认流程

### 2. 活动管理
- 活动筹备进度
- 执行阶段跟踪
- 效果评估反馈

### 3. 项目开发
- 开发里程碑
- 功能完成度
- 测试和发布

### 4. 工作流程
- 审批流程
- 任务分配
- 完成状态

### 5. 学习进度
- 课程学习
- 技能掌握
- 认证获得

## 注意事项

1. **数据结构** - 确保每个时间线项目都有唯一的 `id` 或合理的数组索引
2. **图标资源** - 使用的图标需要在项目中已注册，建议使用 LiaoIcon 组件支持的图标
3. **响应式设计** - 在移动端，操作按钮会自动调整布局
4. **性能考虑** - 大量数据时建议使用分页加载，通过 `showMore` 实现
5. **无障碍访问** - 组件支持键盘导航和屏幕阅读器

## 最佳实践

1. **合理使用颜色** - 不同状态使用不同颜色，保持一致性
2. **内容简洁** - 时间线节点内容应简洁明了，详细信息可放在 `details` 中
3. **操作引导** - 为重要操作提供明确的按钮和说明
4. **时间格式** - 保持时间格式的一致性，建议使用相对时间或标准格式
5. **加载状态** - 对于异步操作，提供适当的加载状态反馈

## 浏览器兼容性

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 更新日志

### 2.0.0 (2025-06-13)
- ✨ 新增多场景支持（活动、任务、项目等）
- ✨ 新增图标支持和富文本内容
- ✨ 新增进度条和详细信息展示
- ✨ 新增徽章、标签和统计信息
- ✨ 新增多种尺寸和高亮模式
- ✨ 新增操作按钮图标和类型支持
- 🎨 优化响应式设计和样式系统
- 🐛 修复连接线样式问题
- 📚 完善文档和示例

### 1.0.0 (2025-06-10)
- ✨ 初始版本，基础时间线功能
- ✨ 支持物流追踪场景
- ✨ 基础操作按钮和事件处理 