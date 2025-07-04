# LiaoProgressPlugin 组件使用指南

![版本](https://img.shields.io/badge/版本-1.2.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoProgressPlugin 是一个功能丰富的进度展示插件组件，支持多种进度展示类型，包括进度条、圆形进度和步骤进度。组件特别适用于订单处理、任务进度、学习进度等场景。

## 功能特性

- 🎯 **多种类型**：支持进度条、圆形进度、步骤进度三种展示类型
- 📊 **状态管理**：支持多种状态（正常、成功、警告、错误）
- 🔄 **动态更新**：支持实时进度更新和状态变更
- 🎨 **视觉效果**：丰富的动画效果和状态指示
- 📱 **响应式布局**：桌面端自动切换为横向布局，移动端保持纵向布局
- 🔧 **操作支持**：支持自定义操作按钮
- 📝 **详细信息**：支持步骤详情、预计时间等扩展信息

## 基础用法

### 步骤进度（推荐）

```vue
<template>
  <LiaoProgressPlugin
    :plugin-data="progressData"
    @action="handleAction"
  />
</template>

<script setup>
const progressData = {
  title: '📋 订单处理进度',
  subtitle: '订单号：#ORD20250611001',
  type: 'steps',
  description: '实时跟踪您的订单处理状态',
  steps: [
    {
      id: 'order_placed',
      title: '📝 订单确认',
      description: '订单提交成功',
      detail: '2025-06-16 10:30:45',
      status: 'finished'
    },
    {
      id: 'payment_confirmed',
      title: '💰 支付确认',
      description: '支付成功，等待商家处理',
      detail: '2025-06-16 10:31:23',
      status: 'finished'
    },
    {
      id: 'preparing',
      title: '📦 商品准备',
      description: '商家正在准备您的商品',
      detail: '预计2小时内完成',
      status: 'processing'
    },
    {
      id: 'shipped',
      title: '🚚 已发货',
      description: '商品已发出，物流配送中',
      detail: '预计今日发货',
      status: 'waiting'
    }
  ],
  currentStep: 2,
  estimatedTime: '预计今日18:00前发货',
  actions: [
    { id: 'view_detail', text: '📋 查看详情', type: 'primary' },
    { id: 'contact_seller', text: '💬 联系商家', type: 'default' }
  ]
}

const handleAction = (action) => {
  console.log('操作事件:', action)
}
</script>
```

### 进度条类型

```vue
<template>
  <LiaoProgressPlugin
    :plugin-data="{
      title: '任务完成进度',
      type: 'bar',
      percentage: 75,
      status: 'success',
      label: '已完成',
      description: '当前任务进度良好',
      estimatedTime: '预计1小时内完成'
    }"
  />
</template>
```

### 圆形进度类型

```vue
<template>
  <LiaoProgressPlugin
    :plugin-data="{
      title: '学习进度',
      type: 'circle',
      percentage: 60,
      status: 'normal',
      label: '前端开发',
      description: '持续学习中...'
    }"
  />
</template>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginData | Object | {} | 进度数据配置对象 |
| status | String | 'normal' | 组件状态 |
| loading | Boolean | false | 加载状态 |
| readonly | Boolean | false | 只读模式 |

### pluginData 配置项

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | - | 主标题 |
| subtitle | String | - | 副标题 |
| type | String | 'steps' | 进度类型：'bar' \| 'circle' \| 'steps' |
| percentage | Number | 0 | 进度百分比（0-100） |
| percent | Number | - | 进度百分比（兼容字段） |
| status | String | 'normal' | 状态：'normal' \| 'success' \| 'warning' \| 'error' |
| label | String | - | 进度标签 |
| description | String | - | 描述信息 |
| steps | Array | [] | 步骤数组（仅 type='steps' 时有效） |
| currentStep | Number | 0 | 当前步骤索引 |
| estimatedTime | String | - | 预计时间 |
| actions | Array | [] | 操作按钮数组 |

### Step 对象结构

| 属性名 | 类型 | 必需 | 说明 |
|-----|---|-----|---|
| id | String | 否 | 步骤唯一标识 |
| title | String | 是 | 步骤标题 |
| description | String | 否 | 步骤描述 |
| detail | String | 否 | 步骤详细信息 |
| status | String | 否 | 步骤状态：'finished' \| 'processing' \| 'waiting' |

### Action 对象结构

| 属性名 | 类型 | 必需 | 说明 |
|-----|---|-----|---|
| id | String | 是 | 操作唯一标识 |
| text | String | 是 | 按钮文本 |
| type | String | 否 | 按钮类型：'primary' \| 'default' \| 'danger' |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | { type: 'progress-action', data: ActionData } | 操作按钮点击事件 |

### ActionData 结构

```typescript
{
  actionId: string;      // 操作ID
  actionText: string;    // 操作文本
  actionType?: string;   // 操作类型
  currentStep: number;   // 当前步骤
  percent: number;       // 当前进度
}
```

## 高级用法

### 响应式布局

组件会根据屏幕宽度自动切换布局：
- **桌面端（≥768px）**：步骤进度使用横向布局，更适合宽屏显示
- **移动端（<768px）**：步骤进度使用纵向布局，更适合窄屏显示

```vue
<template>
  <!-- 组件会自动根据屏幕宽度切换布局 -->
  <LiaoProgressPlugin
    :plugin-data="{
      type: 'steps',
      title: '订单处理进度',
      steps: [
        { title: '订单确认', status: 'finished' },
        { title: '支付确认', status: 'finished' },
        { title: '商品准备', status: 'processing' },
        { title: '已发货', status: 'waiting' },
        { title: '确认收货', status: 'waiting' }
      ]
    }"
  />
</template>
```

### 动态更新进度

```vue
<template>
  <div>
    <LiaoProgressPlugin :plugin-data="progressData" />
    <button @click="nextStep">下一步</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const progressData = ref({
  type: 'steps',
  title: '任务进度',
  currentStep: 0,
  steps: [
    { title: '开始', status: 'processing' },
    { title: '进行中', status: 'waiting' },
    { title: '完成', status: 'waiting' }
  ]
})

const nextStep = () => {
  if (progressData.value.currentStep < progressData.value.steps.length - 1) {
    // 更新当前步骤状态为完成
    progressData.value.steps[progressData.value.currentStep].status = 'finished'
    // 移动到下一步
    progressData.value.currentStep++
    // 设置新步骤为进行中
    progressData.value.steps[progressData.value.currentStep].status = 'processing'
  }
}
</script>
```

### 自定义状态样式

```vue
<template>
  <LiaoProgressPlugin
    :plugin-data="{
      type: 'bar',
      title: '上传进度',
      percentage: uploadProgress,
      status: getProgressStatus(),
      description: getProgressDescription()
    }"
  />
</template>

<script setup>
import { computed } from 'vue'

const uploadProgress = ref(0)

const getProgressStatus = computed(() => {
  if (uploadProgress.value === 100) return 'success'
  if (uploadProgress.value > 80) return 'warning'
  return 'normal'
})

const getProgressDescription = computed(() => {
  if (uploadProgress.value === 100) return '上传完成！'
  if (uploadProgress.value > 0) return `正在上传... ${uploadProgress.value}%`
  return '准备上传'
})
</script>
```

## 样式定制

### CSS 变量

```scss
.liao-progress-plugin {
  --progress-primary-color: #1890ff;
  --progress-success-color: #52c41a;
  --progress-warning-color: #faad14;
  --progress-error-color: #f5222d;
  --progress-bg-color: #f5f5f5;
  --progress-text-color: #333;
}
```

### 自定义样式

```scss
.custom-progress {
  .liao-progress-plugin {
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    &-step-icon {
      width: 40px;
      height: 40px;
      font-size: 16px;
    }
    
    &-action-btn-primary {
      background: linear-gradient(45deg, #1890ff, #36cfc9);
      border: none;
    }
  }
}
```

## 注意事项

1. **类型选择**：根据使用场景选择合适的进度类型
   - `steps`：适用于有明确步骤的流程（如订单处理）
   - `bar`：适用于连续性进度（如文件上传）
   - `circle`：适用于空间受限的场景

2. **状态管理**：
   - 步骤状态可以通过 `step.status` 明确指定
   - 如果不指定，会根据 `currentStep` 自动计算

3. **性能优化**：
   - 大量步骤时建议使用虚拟滚动
   - 避免频繁更新进度值

4. **无障碍访问**：
   - 组件支持键盘导航
   - 提供了适当的 ARIA 标签

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### 1.2.1 (2025-06-16)
- ✨ 新增响应式布局：桌面端自动切换为横向布局
- 🎨 优化横向布局的视觉效果和间距
- 📱 改进移动端适配，确保在小屏幕上正常显示
- 🔧 添加窗口大小变化监听，实时响应布局切换

### 1.2.0 (2025-06-16)
- ✨ 新增 subtitle 支持
- ✨ 新增 estimatedTime 预计时间显示
- ✨ 新增 actions 操作按钮支持
- ✨ 扩展 Step 对象，支持 detail 和 status 字段
- ✨ 新增步骤状态动画效果
- 🐛 修复 percentage/percent 字段兼容性
- 🎨 优化步骤进度的视觉效果
- 📝 完善组件文档和示例

### 1.1.0 (2025-06-10)
- ✨ 新增圆形进度类型
- ✨ 新增多种状态支持
- 🎨 优化进度条样式

### 1.0.0 (2025-06-01)
- 🎉 初始版本发布
- ✨ 支持基础进度条和步骤进度 