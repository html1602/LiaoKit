# LiaoVotePlugin 投票插件组件使用指南

![版本](https://img.shields.io/badge/版本-2.0.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--13-green.svg)

## 组件介绍

LiaoVotePlugin 是一个功能完整的投票插件组件，支持单选和多选投票模式，提供美观的投票界面和结果展示功能。组件支持复杂的选项数据结构，包括图标、描述文本等，并提供丰富的交互动画效果。

## 功能特性

- ✅ **多种投票模式**: 支持单选和多选投票
- ✅ **丰富的选项格式**: 支持图标、描述文本、简单字符串等多种选项格式
- ✅ **投票结果展示**: 提供进度条、百分比、票数等多种结果展示方式
- ✅ **状态管理**: 完整的投票状态流转（未投票→投票中→已投票→查看结果）
- ✅ **用户体验优化**: 丰富的交互动画和视觉反馈
- ✅ **响应式设计**: 适配桌面和移动端设备
- ✅ **无障碍访问**: 支持键盘导航和屏幕阅读器
- ✅ **主题定制**: 基于SCSS变量系统，支持主题色彩定制

## 基础用法

### 简单投票

```vue
<template>
  <LiaoVotePlugin
    :plugin-data="simpleVoteData"
    @action="handleVoteAction"
  />
</template>

<script setup>
import { ref } from 'vue';
import LiaoVotePlugin from '@/components/LiaoPlugins/LiaoVotePlugin.vue';

const simpleVoteData = ref({
  title: '您最喜欢的前端框架是？',
  options: ['Vue.js', 'React', 'Angular', 'Svelte']
});

const handleVoteAction = (action) => {
  console.log('投票操作:', action);
};
</script>
```

### 复杂投票（带图标和描述）

```vue
<template>
  <LiaoVotePlugin
    :plugin-data="complexVoteData"
    @action="handleVoteAction"
  />
</template>

<script setup>
const complexVoteData = ref({
  title: '🗳️ 技术栈偏好调研',
  subtitle: '帮助我们了解开发者的技术选择',
  question: '您在前端开发中最常使用的技术栈是什么？',
  description: '请选择您在日常开发工作中使用频率最高的技术组合',
  options: [
    { 
      id: 'vue_ts', 
      text: '🌟 Vue 3 + TypeScript + Vite',
      description: '现代化Vue生态，组合式API + 类型安全',
      icon: 'vue'
    },
    { 
      id: 'react_ts', 
      text: '⚛️ React + TypeScript + Next.js',
      description: '企业级React方案，SSR + 静态生成',
      icon: 'react'
    },
    { 
      id: 'angular', 
      text: '🅰️ Angular + TypeScript',
      description: '大型应用框架，完整的开发生态',
      icon: 'angular'
    }
  ],
  allowMultiple: false,
  showResults: false,
  votingEnabled: true,
  submitText: '提交投票'
});
</script>
```

### 投票结果展示

```vue
<template>
  <LiaoVotePlugin
    :plugin-data="voteResultsData"
    @action="handleVoteAction"
  />
</template>

<script setup>
const voteResultsData = ref({
  title: '🗳️ 技术栈偏好调研结果',
  subtitle: '基于620位开发者的投票',
  options: [
    { id: 'vue_ts', text: '🌟 Vue 3 + TypeScript + Vite', icon: 'vue' },
    { id: 'react_ts', text: '⚛️ React + TypeScript + Next.js', icon: 'react' },
    { id: 'angular', text: '🅰️ Angular + TypeScript', icon: 'angular' },
    { id: 'svelte', text: '🧡 Svelte + SvelteKit', icon: 'svelte' }
  ],
  results: [
    { id: 'vue_ts', count: 245 },
    { id: 'react_ts', count: 198 },
    { id: 'angular', count: 87 },
    { id: 'svelte', count: 90 }
  ],
  totalVotes: 620,
  userVote: 'vue_ts', // 用户的投票选择
  showResults: true,
  showPercentage: true,
  votingEnabled: false
});
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginData | Object | `{}` | 投票数据配置对象 |
| readonly | Boolean | `false` | 是否为只读模式 |
| disabled | Boolean | `false` | 是否禁用组件 |
| loading | Boolean | `false` | 是否显示加载状态 |

### pluginData 配置项

| 字段名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| title | String | `'投票'` | 投票标题 |
| subtitle | String | - | 投票副标题 |
| question | String | - | 投票问题 |
| description | String | - | 投票描述 |
| options | Array | `[]` | 投票选项数组 |
| allowMultiple | Boolean | `false` | 是否允许多选 |
| showResults | Boolean | `false` | 是否显示投票结果 |
| showPercentage | Boolean | `true` | 是否显示百分比 |
| results | Array | `[]` | 投票结果数据 |
| totalVotes | Number | `0` | 总投票数 |
| userVote | String/Array | `null` | 用户的投票选择 |
| votingEnabled | Boolean | `true` | 是否允许投票 |
| submitText | String | `'提交投票'` | 提交按钮文本 |

### 选项数据格式

#### 简单格式（字符串数组）
```javascript
options: ['选项1', '选项2', '选项3']
```

#### 复杂格式（对象数组）
```javascript
options: [
  {
    id: 'option1',           // 选项唯一标识
    text: '选项显示文本',      // 选项文本
    description: '选项描述',   // 选项描述（可选）
    icon: 'icon-name'        // 图标名称（可选）
  }
]
```

### 投票结果数据格式
```javascript
results: [
  {
    id: 'option1',    // 对应选项的ID
    count: 123        // 该选项的票数
  }
]
```

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | `{ type, data }` | 投票操作事件 |

### 事件类型

#### vote-change
选项变更时触发
```javascript
{
  type: 'vote-change',
  data: {
    selectedOption: { id, text, description, icon }, // 单选模式
    selectedOptions: [...],                          // 多选模式
    value: 'option_id' // 或 ['option1', 'option2']
  }
}
```

#### vote-submit
提交投票时触发
```javascript
{
  type: 'vote-submit',
  data: {
    selectedOption: { id, text, description, icon }, // 单选模式
    selectedOptions: [...],                          // 多选模式
    value: 'option_id', // 或 ['option1', 'option2']
    totalVotes: 620,
    choice: 'option_id' // 或 ['option1', 'option2']
  }
}
```

#### vote-change-request
请求修改投票时触发
```javascript
{
  type: 'vote-change-request',
  data: {
    currentVote: 'option_id' // 或 ['option1', 'option2']
  }
}
```

## 高级用法

### 多选投票

```vue
<template>
  <LiaoVotePlugin
    :plugin-data="multiSelectData"
    @action="handleMultiSelectAction"
  />
</template>

<script setup>
const multiSelectData = ref({
  title: '您使用过哪些前端工具？',
  description: '可以选择多个选项',
  allowMultiple: true,
  options: [
    { id: 'webpack', text: 'Webpack', icon: 'package' },
    { id: 'vite', text: 'Vite', icon: 'lightning' },
    { id: 'rollup', text: 'Rollup', icon: 'box' },
    { id: 'parcel', text: 'Parcel', icon: 'gift' }
  ]
});

const handleMultiSelectAction = (action) => {
  if (action.type === 'vote-submit') {
    console.log('选择的工具:', action.data.selectedOptions);
  }
};
</script>
```

### 实时投票结果

```vue
<template>
  <LiaoVotePlugin
    :plugin-data="liveVoteData"
    @action="handleLiveVote"
  />
</template>

<script setup>
import { ref, computed } from 'vue';

const votes = ref({
  option1: 45,
  option2: 32,
  option3: 23
});

const liveVoteData = computed(() => ({
  title: '实时投票',
  options: [
    { id: 'option1', text: '选项 A' },
    { id: 'option2', text: '选项 B' },
    { id: 'option3', text: '选项 C' }
  ],
  results: [
    { id: 'option1', count: votes.value.option1 },
    { id: 'option2', count: votes.value.option2 },
    { id: 'option3', count: votes.value.option3 }
  ],
  totalVotes: Object.values(votes.value).reduce((a, b) => a + b, 0),
  showResults: true,
  showPercentage: true
}));

const handleLiveVote = (action) => {
  if (action.type === 'vote-submit') {
    // 更新投票数据
    votes.value[action.data.value]++;
  }
};
</script>
```

### 投票状态控制

```vue
<template>
  <div>
    <div class="vote-controls">
      <button @click="toggleVoting">
        {{ votingEnabled ? '关闭投票' : '开启投票' }}
      </button>
      <button @click="toggleResults">
        {{ showResults ? '隐藏结果' : '显示结果' }}
      </button>
      <button @click="resetVote">重置投票</button>
    </div>
    
    <LiaoVotePlugin
      :plugin-data="controlledVoteData"
      :readonly="!votingEnabled"
      @action="handleControlledVote"
    />
  </div>
</template>

<script setup>
const votingEnabled = ref(true);
const showResults = ref(false);
const userVote = ref(null);

const controlledVoteData = computed(() => ({
  title: '受控投票组件',
  options: [
    { id: 'yes', text: '赞成', icon: 'thumbs-up' },
    { id: 'no', text: '反对', icon: 'thumbs-down' },
    { id: 'abstain', text: '弃权', icon: 'minus' }
  ],
  userVote: userVote.value,
  votingEnabled: votingEnabled.value,
  showResults: showResults.value,
  results: [
    { id: 'yes', count: 67 },
    { id: 'no', count: 23 },
    { id: 'abstain', count: 10 }
  ],
  totalVotes: 100
}));

const toggleVoting = () => {
  votingEnabled.value = !votingEnabled.value;
};

const toggleResults = () => {
  showResults.value = !showResults.value;
};

const resetVote = () => {
  userVote.value = null;
  votingEnabled.value = true;
  showResults.value = false;
};

const handleControlledVote = (action) => {
  if (action.type === 'vote-submit') {
    userVote.value = action.data.value;
    showResults.value = true;
  }
};
</script>
```

## 样式定制

### CSS 变量

组件使用以下 SCSS 变量，可以通过覆盖这些变量来定制样式：

```scss
// 主题色彩
$primary-color: #1890ff;
$success-color: #52c41a;
$text-disabled: #bfbfbf;

// 背景色
$bg-primary: #ffffff;
$bg-secondary: #fafafa;

// 文字色
$text-primary: #262626;
$text-secondary: #8c8c8c;

// 边框色
$border-color: #d9d9d9;
$border-color-card: #f0f0f0;

// 间距系统
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 12px;
$spacing-lg: 16px;
$spacing-xl: 24px;

// 字体大小
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-md: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;

// 字体粗细
$font-weight-medium: 500;
$font-weight-bold: 600;

// 圆角
$border-radius-sm: 4px;
$border-radius-md: 6px;
$border-radius-lg: 8px;
```

### 自定义样式示例

```scss
// 自定义投票插件样式
.liao-vote-plugin {
  // 自定义头部背景
  &-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  // 自定义选项样式
  &-option {
    &:hover {
      border-color: #ff6b6b;
      box-shadow: 0 4px 12px rgba(255, 107, 107, 0.15);
    }
    
    &-selected {
      border-color: #ff6b6b;
      background-color: rgba(255, 107, 107, 0.05);
    }
  }
  
  // 自定义提交按钮
  &-submit {
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    
    &:hover {
      background: linear-gradient(135deg, #ff5252 0%, #ffb74d 100%);
    }
  }
  
  // 自定义进度条
  &-result-progress {
    background: linear-gradient(90deg, #ff6b6b 0%, #feca57 100%);
  }
}
```

## 注意事项

1. **图标依赖**: 组件依赖 `LiaoIcon` 组件，确保图标名称正确
2. **数据一致性**: 投票结果的 `id` 必须与选项的 `id` 对应
3. **状态管理**: 组件内部管理投票状态，外部可通过 props 控制
4. **事件处理**: 所有用户操作都通过 `action` 事件向外传递
5. **响应式**: 组件支持响应式设计，在移动端会自动适配

## 最佳实践

1. **数据结构**: 使用对象格式的选项数据，提供更丰富的展示效果
2. **状态控制**: 合理使用 `votingEnabled` 和 `showResults` 控制投票流程
3. **用户反馈**: 监听 `action` 事件，提供适当的用户反馈
4. **无障碍**: 为选项提供清晰的描述文本，支持键盘导航
5. **性能优化**: 大量选项时考虑虚拟滚动或分页

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 更新日志

### 2.0.0 (2025-06-13)
- 🎉 重构组件架构，支持复杂选项数据结构
- ✨ 新增投票结果展示功能
- ✨ 新增图标支持和描述文本
- ✨ 新增投票状态管理
- 🎨 全新的UI设计和交互动画
- 🐛 修复样式优先级问题
- 📱 优化移动端适配
- ♿ 改进无障碍访问支持

### 1.0.0 (2025-06-01)
- 🎉 初始版本发布
- ✨ 基础投票功能
- ✨ 单选和多选支持
- 🎨 基础样式设计 