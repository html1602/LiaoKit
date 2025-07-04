# LiaoStatsPlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-1.1.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--12-green.svg)

## 组件介绍

LiaoStatsPlugin 是一个用于显示统计数据的智能插件组件，支持**数字卡片**和**趋势图表**两种展示模式。组件会根据数据类型自动选择最适合的显示方式：单天数据显示数字卡片，多天数据显示趋势图表。采用现代化卡片设计，集成AntV G2Plot图表库，具备优秀的移动端兼容性。

## 功能特性

- ✅ **智能模式切换**：自动根据数据类型选择显示模式
- ✅ **数字卡片模式**：适合单天数据，显示大数字和变化趋势
- ✅ **图表模式**：适合多天数据，支持折线图、面积图、柱状图
- ✅ 支持多种图标类型（文本图标/emoji、SVG图标、图片URL）
- ✅ 支持数值变化趋势（正向/负向）带视觉箭头指示
- ✅ 支持自定义颜色主题
- ✅ 支持网格布局和紧凑布局
- ✅ 现代化卡片设计（渐变背景、阴影效果、悬停动画）
- ✅ 优秀的移动端兼容性（响应式设计、触摸友好）
- ✅ 图表交互功能（工具提示、动画效果）
- ✅ 支持深色模式、高对比度模式和动画减少偏好
- ✅ 可访问性友好设计

## 基础用法

### 数字卡片模式（单天数据）

适合展示当前时点的关键指标数据：

```vue
<template>
  <LiaoStatsPlugin :plugin-data="singleDayStats" />
</template>

<script setup>
const singleDayStats = {
  title: '今日业务数据',
  items: [
    { 
      label: '今日订单', 
      value: '128单', 
      icon: '📋', 
      change: 12.5, 
      color: '#1890ff' 
    },
    { 
      label: '今日销售额', 
      value: '35.6万元', 
      icon: '💰', 
      change: 8.3, 
      color: '#52c41a' 
    },
    { 
      label: '用户满意度', 
      value: '98.5%', 
      icon: '⭐', 
      change: 1.2, 
      color: '#fadb14' 
    }
  ],
  layout: 'default'
}
</script>
```

### 图表模式（多天趋势数据）

适合展示一段时间内的数据变化趋势：

```vue
<template>
  <LiaoStatsPlugin :plugin-data="trendStats" />
</template>

<script setup>
const trendStats = {
  title: '业务趋势分析',
  items: [
    {
      label: '销售趋势',
      icon: '💰',
      color: '#52c41a',
      chartType: 'area', // 面积图
      unit: '万元',
      chartData: [
        { date: '6/7', value: 31.5 },
        { date: '6/8', value: 28.2 },
        { date: '6/9', value: 33.8 },
        { date: '6/10', value: 29.7 },
        { date: '6/11', value: 35.6 },
        { date: '6/12', value: 38.2 }
      ]
    },
    {
      label: '订单趋势',
      icon: '📋',
      color: '#1890ff',
      chartType: 'line', // 折线图
      unit: '单',
      chartData: [
        { date: '6/7', value: 142 },
        { date: '6/8', value: 128 },
        { date: '6/9', value: 156 },
        { date: '6/10', value: 134 },
        { date: '6/11', value: 149 },
        { date: '6/12', value: 162 }
      ]
    },
    {
      label: '用户增长',
      icon: '👥',
      color: '#722ed1',
      chartType: 'column', // 柱状图
      unit: '人',
      chartData: [
        { date: '6/7', value: 78 },
        { date: '6/8', value: 89 },
        { date: '6/9', value: 95 },
        { date: '6/10', value: 82 },
        { date: '6/11', value: 91 },
        { date: '6/12', value: 97 }
      ]
    }
  ]
}
</script>
```

### 混合模式展示

可以在同一个组件中混合展示数字卡片和图表：

```vue
<template>
  <LiaoStatsPlugin :plugin-data="mixedStats" />
</template>

<script setup>
const mixedStats = {
  title: '综合数据看板',
  items: [
    // 图表数据
    {
      label: '销售趋势',
      icon: '💰',
      color: '#52c41a',
      chartType: 'area',
      unit: '万元',
      chartData: [
        { date: '6/7', value: 31.5 },
        { date: '6/8', value: 28.2 },
        { date: '6/9', value: 33.8 },
        { date: '6/10', value: 29.7 },
        { date: '6/11', value: 35.6 },
        { date: '6/12', value: 38.2 }
      ]
    },
    // 数字卡片数据
    { 
      label: '今日退款率', 
      value: '2.1%', 
      icon: '📉', 
      change: -0.5, 
      color: '#f5222d' 
    },
    { 
      label: '客服响应时间', 
      value: '2.3分钟', 
      icon: '⏱️', 
      change: -12.8, 
      color: '#fa8c16' 
    }
  ]
}
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| pluginData | Object | {} | 插件数据对象 |
| status | String | 'normal' | 组件状态 |
| loading | Boolean | false | 加载状态 |
| readonly | Boolean | false | 只读状态 |

### pluginData 数据结构

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| title | String | - | 标题 |
| items | Array | [] | 数据项数组 |
| layout | String | 'default' | 布局模式：'default' 或 'compact' |

### items 数据项结构

| 字段名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| label | String | - | 数据项标签 |
| value | String/Number | - | 数据项数值（数字卡片模式使用） |
| icon | String | - | 图标（文本图标或图片URL） |
| color | String | - | 数值颜色/图表主题色 |
| change | Number | - | 变化值（百分比，正数为上升，负数为下降） |
| bordered | Boolean | false | 是否显示边框 |
| chartData | Array | - | 图表数据数组（图表模式） |
| chartType | String | 'line' | 图表类型：'line'、'area'、'column' |
| unit | String | - | 数值单位（图表模式显示用） |

### chartData 数组结构（图表模式）

| 字段名 | 类型 | 说明 |
|--------|------|------|
| date | String | 日期标签（X轴） |
| value | Number | 数值（Y轴） |

**示例：**
```javascript
chartData: [
  { date: '6/7', value: 31.5 },
  { date: '6/8', value: 28.2 },
  { date: '6/9', value: 33.8 }
]
```

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|--------|------|------|
| action | { type: 'stats-interaction', data: Object } | 数据交互事件 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|--------|------|------|
| default | - | 自定义内容，会替换默认的数据展示 |
| footer | - | 底部内容 |

## 高级用法

### 图标类型支持

LiaoStatsPlugin 支持三种类型的图标：

```vue
<template>
  <LiaoStatsPlugin :plugin-data="iconsData" />
</template>

<script setup>
const iconsData = {
  title: '图标类型示例',
  items: [
    // 文本图标（emoji）
    { 
      label: '今日订单', 
      value: '128单', 
      icon: '📋',  // emoji 文本
      change: 12.5 
    },
    // SVG 图标
    { 
      label: '系统状态', 
      value: '正常', 
      icon: '<svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>',
      change: 0 
    },
    // 图片 URL
    { 
      label: '品牌图标', 
      value: '活跃', 
      icon: 'https://example.com/icon.png',
      change: 5.2 
    }
  ]
}
</script>
```

### 自定义布局

```vue
<template>
  <LiaoStatsPlugin :plugin-data="compactStatsData" />
</template>

<script setup>
const compactStatsData = {
  title: '核心指标',
  layout: 'compact', // 紧凑布局
  items: [
    { label: '订单数', value: '128', icon: '📋', change: 12.5, bordered: true },
    { label: '销售额', value: '35.6万', icon: '💰', change: 8.3, bordered: true },
    { label: '用户数', value: '89', icon: '👥', change: 15.2, bordered: true },
    { label: '退款率', value: '2.1%', icon: '📉', change: -0.5, bordered: true }
  ]
}
</script>
```

## 模式判断逻辑

组件会根据以下规则自动选择显示模式：

- **图表模式**：当 `chartData` 数组存在且长度 > 1 时
- **数字卡片模式**：当没有 `chartData` 或数组长度 ≤ 1 时

## 图表类型说明

| 类型 | 适用场景 | 视觉效果 |
|------|---------|---------|
| **line** | 趋势分析 | 折线图，清晰展示数据走势 |
| **area** | 数量展示 | 面积图，突出数据量级和趋势 |
| **column** | 对比分析 | 柱状图，适合不同时间点数值对比 |

## 图表功能技术特性

### 集成技术
- **图表库**：AntV G2Plot - 专业的统计图表库
- **渲染引擎**：Canvas/SVG 混合渲染，性能优异
- **动画系统**：内置流畅的图表动画效果

### 图表特性
- **响应式设计**：图表自动适配容器尺寸
- **交互功能**：鼠标悬停显示数据详情
- **主题集成**：图表色彩自动继承组件主题
- **性能优化**：按需渲染，内存管理优良

### 移动端优化
- **触摸友好**：支持移动设备的触摸交互
- **尺寸适配**：不同屏幕尺寸下的图表高度自动调整
- **加载优化**：图表库按需加载，减少初始包体积

## 注意事项

1. **数据格式**：
   - 数字卡片模式：需要 `label` 和 `value` 字段
   - 图表模式：需要 `label` 和 `chartData` 数组
2. **图表数据**：
   - `chartData` 数组长度至少2个数据点才会显示图表
   - `date` 字段建议使用简短的日期格式（如 '6/12'）
   - `value` 必须为数字类型
3. **图表类型选择**：
   - **line**：适合连续数据的趋势展示
   - **area**：强调数据累积效果和趋势
   - **column**：适合离散数据的对比分析
4. **性能考虑**：
   - 图表组件会在数据变化时自动销毁和重建
   - 建议避免频繁更新chartData数组
   - 大数据集（>50个数据点）时考虑数据抽样
5. **依赖要求**：
   - 需要安装 `@antv/g2plot` 依赖
   - 建议Node.js >= 14，现代浏览器环境

## 浏览器兼容性

- Chrome >= 88
- Firefox >= 86  
- Safari >= 14
- Edge >= 88
- **图表功能**额外要求：Canvas/SVG 支持

## 更新日志

### 1.1.0 (2025-06-12)
- 🚀 **重大功能升级**：新增智能图表展示功能
  - 集成AntV G2Plot图表库，支持专业统计图表
  - 实现智能模式切换：单天数据显示数字卡片，多天数据显示趋势图表  
  - 支持三种图表类型：折线图(line)、面积图(area)、柱状图(column)
  - 图表自动计算趋势变化，显示最新数值和变化百分比
- 📊 **图表功能特性**：
  - 响应式图表设计，自适应容器尺寸
  - 流畅的动画效果和交互体验
  - 自定义工具提示，显示详细数据信息
  - 主题色彩集成，图表色彩与组件主题保持一致
- 📱 **移动端图表优化**：
  - 多级响应式图表高度（桌面120px，平板100px，手机80px）
  - 触摸友好的交互设计，支持移动设备操作
  - 图表文字和标识的移动端适配
- 🔧 **技术架构升级**：
  - Vue 3组合式API，更好的类型安全和性能
  - 自动图表实例管理，内存泄漏防护
  - 数据变化监听，图表自动更新机制

### 1.0.3 (2025-06-12)
- 🎨 **重大样式优化**：全面升级卡片视觉设计
  - 添加现代化渐变背景和阴影效果
  - 实现流畅的悬停动画和过渡效果
  - 增加顶部彩色指示条，增强视觉层次
- 📱 **移动端优化**：大幅改善移动设备体验
  - 添加多级响应式断点（768px、576px）
  - 优化触摸目标尺寸和间距
  - 超小屏幕特别优化，支持紧凑布局
- 🚀 **趋势可视化增强**：
  - 添加趋势箭头图标（↗ ↘ →）
  - 实现趋势图标的背景色块高亮
  - 优化change字段的视觉表现
- ♿ **可访问性改进**：
  - 支持深色模式自动适配
  - 支持高对比度模式
  - 支持动画减少偏好设置
  - 改善颜色对比度和可读性

### 1.0.2 (2025-06-12)
- 🐛 修复图标显示问题：支持文本图标（emoji）的正确渲染
- ✨ 优化图标支持：智能识别文本图标、SVG图标和图片URL
- 🎨 改进图标样式：为文本图标添加合适的字体大小和行高
- 📝 完善图标使用说明和示例

### 1.0.1 (2025-06-12)
- 🐛 修复数据结构不匹配问题，将 `kpis` 字段统一为 `items`
- 🔧 优化数据格式，`change` 字段改为数字类型
- 📝 更新组件文档和使用示例

### 1.0.0 (2025-06-11)
- ✨ 初始版本发布
- ✅ 支持基础统计数据展示
- ✅ 支持图标和变化趋势显示
- ✅ 支持自定义布局和样式