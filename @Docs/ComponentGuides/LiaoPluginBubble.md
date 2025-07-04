# LiaoPluginBubble 组件使用指南

![版本](https://img.shields.io/badge/版本-2.5.0-blue.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

## 组件介绍

LiaoPluginBubble 是一个智能插件气泡组件，用于在消息列表中渲染各种插件类型的内容。组件支持自动插件注册、状态管理、错误处理，并与全局会话状态深度集成，提供统一的插件运行和交互体验。

## 功能特性

- **自动插件注册**：智能识别和注册内置插件组件
- **状态管理集成**：与全局会话状态无缝集成，支持输入锁定控制
- **多种插件类型**：支持表单、投票、信息展示、统计图表等多种插件
- **错误处理机制**：完善的加载、错误状态显示和处理
- **必须完成控制**：支持设置插件为必须完成，控制用户交互流程
- **事件系统**：丰富的事件回调，便于业务逻辑集成
- **响应式设计**：适配各种屏幕尺寸和设备类型

## 基础用法

### 简单插件渲染

```vue
<template>
  <LiaoPluginBubble
    plugin-type="info"
    :plugin-data="infoData"
  />
</template>

<script setup>
import { ref } from 'vue';
import LiaoPluginBubble from '@/components/LiaoMessageBubble/LiaoPluginBubble.vue';

const infoData = ref({
  title: '系统通知',
  content: '您有一条新消息',
  type: 'success'
});
</script>
```

### 完整功能配置

```vue
<template>
  <LiaoPluginBubble
    :id="pluginId"
    :message-id="messageId"
    plugin-type="vote"
    :plugin-data="voteData"
    :plugin-required="true"
    :status="pluginStatus"
    :loading="isLoading"
    :readonly="isReadonly"
    :error-message="errorMessage"
    @action="handlePluginAction"
    @complete="handlePluginComplete"
    @cancel="handlePluginCancel"
    @error="handlePluginError"
    @click="handleBubbleClick"
    @context-menu="handleContextMenu"
  />
</template>

<script setup>
import { ref } from 'vue';
import type { LiaoPluginBubble } from '@/components/LiaoMessageBubble/LiaoPluginBubble.vue';

const pluginId = ref('vote-001');
const messageId = ref('msg-001');
const pluginStatus = ref('normal');
const isLoading = ref(false);
const isReadonly = ref(false);
const errorMessage = ref('');

const voteData = ref({
  title: '功能投票',
  question: '您希望优先开发哪个功能？',
  options: [
    { id: 'mobile', text: '移动端优化' },
    { id: 'chart', text: '图表功能' }
  ],
  allowMultiple: false
});

const handlePluginAction = (actionData) => {
  console.log('插件操作:', actionData);
};

const handlePluginComplete = (data) => {
  console.log('插件完成:', data);
};

const handlePluginCancel = (data) => {
  console.log('插件取消:', data);
};

const handlePluginError = (data) => {
  console.log('插件错误:', data);
};
</script>
```

## 属性 (Props)

| 属性名 | 类型 | 默认值 | 说明 |
|-----|---|-----|---|
| pluginType | String | '' | 插件类型（vote/form/info/stats等） |
| pluginData | Object | {} | 插件数据对象 |
| status | String | 'normal' | 插件状态（normal/success/error/warning/info） |
| loading | Boolean | false | 是否显示加载状态 |
| readonly | Boolean | false | 是否为只读模式 |
| errorMessage | String | '' | 错误消息文本 |
| id | String/Number | null | 插件实例ID |
| messageId | String/Number | null | 关联的消息ID |
| pluginRequired | Boolean | false | 是否为必须完成的插件 |

## 事件 (Events)

| 事件名 | 参数 | 说明 |
|-----|---|---|
| action | (actionData: object) | 插件内部操作时触发 |
| complete | (data: object) | 插件完成时触发 |
| cancel | (data: object) | 插件取消时触发 |
| error | (data: object) | 插件出错时触发 |
| click | (event: object) | 点击气泡时触发 |
| context-menu | (event: object) | 右键菜单时触发 |

## 插槽 (Slots)

| 插槽名 | 参数 | 说明 |
|-----|---|---|
| default | - | 未找到插件时的默认内容 |

## 支持的插件类型

### 1. 投票插件 (vote)

```vue
<template>
  <LiaoPluginBubble
    plugin-type="vote"
    :plugin-data="voteData"
    :plugin-required="true"
  />
</template>

<script setup>
const voteData = {
  title: '功能优先级投票',
  subtitle: '帮助我们了解您的需求',
  question: '您最希望我们优先开发哪些功能？',
  description: '请选择您认为最重要的功能（可多选）',
  allowMultiple: true,
  showResults: false,
  options: [
    {
      id: 'mobile',
      text: '移动端适配优化',
      description: '提升移动设备使用体验',
      icon: 'mobile'
    },
    {
      id: 'charts',
      text: '数据可视化增强',
      description: '更多图表类型支持',
      icon: 'chart'
    }
  ]
};
</script>
```

### 2. 表单插件 (form)

```vue
<template>
  <LiaoPluginBubble
    plugin-type="form"
    :plugin-data="formData"
    :plugin-required="true"
  />
</template>

<script setup>
const formData = {
  title: '用户反馈表单',
  description: '请填写您的反馈信息',
  fields: [
    {
      name: 'name',
      label: '姓名',
      type: 'text',
      required: true,
      placeholder: '请输入您的姓名'
    },
    {
      name: 'email',
      label: '邮箱',
      type: 'email',
      required: true,
      placeholder: '请输入您的邮箱'
    },
    {
      name: 'feedback',
      label: '反馈内容',
      type: 'textarea',
      required: true,
      placeholder: '请输入您的反馈内容'
    }
  ]
};
</script>
```

### 3. 信息展示插件 (info)

```vue
<template>
  <LiaoPluginBubble
    plugin-type="info"
    :plugin-data="infoData"
  />
</template>

<script setup>
const infoData = {
  title: '系统升级通知',
  content: '系统将于今晚22:00-24:00进行升级维护',
  type: 'warning',
  icon: 'warning',
  actions: [
    { id: 'confirm', text: '我知道了', type: 'primary' }
  ]
};
</script>
```

### 4. 统计图表插件 (stats)

```vue
<template>
  <LiaoPluginBubble
    plugin-type="stats"
    :plugin-data="statsData"
  />
</template>

<script setup>
const statsData = {
  title: '销售数据统计',
  items: [
    {
      label: '今日销售',
      value: '¥12,345',
      change: 15.6,
      icon: 'dollar',
      color: '#52c41a',
      chartType: 'line',
      chartData: [
        { date: '6/7', value: 8200 },
        { date: '6/8', value: 9100 },
        { date: '6/9', value: 10500 },
        { date: '6/10', value: 12345 }
      ]
    }
  ]
};
</script>
```

## 高级用法

### 状态管理集成

插件与全局状态管理深度集成，支持自动锁定/解锁：

```vue
<template>
  <LiaoWindow>
    <LiaoMessageList :messages="messages" />
    <LiaoInputArea v-model="inputText" />
  </LiaoWindow>
</template>

<script setup>
import { ref } from 'vue';

const messages = ref([
  {
    id: 1,
    type: 'plugin',
    pluginType: 'form',
    pluginData: { /* 表单数据 */ },
    pluginRequired: true  // 必须完成，会锁定输入
  },
  {
    id: 2,
    type: 'plugin',
    pluginType: 'info',
    pluginData: { /* 信息数据 */ },
    pluginRequired: false // 可选完成，不锁定输入
  }
]);
</script>
```

### 自定义插件注册

```javascript
// 注册自定义插件
import { registerPlugin } from '@/utils/pluginRegistry';
import MyCustomPlugin from './MyCustomPlugin.vue';

// 注册插件
registerPlugin('my-custom', MyCustomPlugin);

// 使用自定义插件
const customData = {
  title: '自定义插件',
  customField: 'custom value'
};
```

### 动态插件加载

```vue
<template>
  <LiaoPluginBubble
    :plugin-type="dynamicType"
    :plugin-data="dynamicData"
    :loading="isLoading"
    @action="handleDynamicAction"
  />
</template>

<script setup>
import { ref, watch } from 'vue';

const dynamicType = ref('');
const dynamicData = ref({});
const isLoading = ref(true);

// 根据条件动态加载插件
const loadPlugin = async (condition) => {
  isLoading.value = true;
  
  try {
    if (condition === 'survey') {
      dynamicType.value = 'vote';
      dynamicData.value = await fetchSurveyData();
    } else if (condition === 'form') {
      dynamicType.value = 'form';
      dynamicData.value = await fetchFormData();
    }
  } catch (error) {
    console.error('插件加载失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const handleDynamicAction = (actionData) => {
  // 处理动态插件的操作
  console.log('动态插件操作:', actionData);
};
</script>
```

### 插件通信

```vue
<template>
  <div>
    <!-- 父插件 -->
    <LiaoPluginBubble
      plugin-type="parent"
      :plugin-data="parentData"
      @action="handleParentAction"
    />
    
    <!-- 子插件 -->
    <LiaoPluginBubble
      v-if="showChildPlugin"
      plugin-type="child"
      :plugin-data="childData"
      @complete="handleChildComplete"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';

const showChildPlugin = ref(false);
const parentData = ref({
  title: '选择操作',
  actions: [
    { id: 'show-form', text: '显示表单' },
    { id: 'show-vote', text: '显示投票' }
  ]
});

const childData = ref({});

const handleParentAction = (actionData) => {
  if (actionData.data.id === 'show-form') {
    childData.value = { /* 表单数据 */ };
    showChildPlugin.value = true;
  } else if (actionData.data.id === 'show-vote') {
    childData.value = { /* 投票数据 */ };
    showChildPlugin.value = true;
  }
};

const handleChildComplete = (data) => {
  console.log('子插件完成:', data);
  showChildPlugin.value = false;
};
</script>
```

## 错误处理

### 加载错误处理

```vue
<template>
  <LiaoPluginBubble
    plugin-type="stats"
    :plugin-data="statsData"
    :loading="isLoading"
    :status="pluginStatus"
    :error-message="errorMessage"
    @error="handlePluginError"
  />
</template>

<script setup>
import { ref } from 'vue';

const isLoading = ref(true);
const pluginStatus = ref('normal');
const errorMessage = ref('');
const statsData = ref({});

const loadStatsData = async () => {
  try {
    isLoading.value = true;
    pluginStatus.value = 'normal';
    
    const data = await fetchStatsData();
    statsData.value = data;
    
    pluginStatus.value = 'success';
  } catch (error) {
    pluginStatus.value = 'error';
    errorMessage.value = '数据加载失败，请稍后重试';
    console.error('统计数据加载失败:', error);
  } finally {
    isLoading.value = false;
  }
};

const handlePluginError = (errorData) => {
  console.error('插件执行错误:', errorData);
  // 可以在这里实现重试逻辑
};
</script>
```

### 网络错误重试

```vue
<template>
  <LiaoPluginBubble
    plugin-type="vote"
    :plugin-data="voteData"
    :status="pluginStatus"
    @action="handleVoteAction"
  />
</template>

<script setup>
import { ref } from 'vue';

const pluginStatus = ref('normal');
const retryCount = ref(0);
const maxRetries = 3;

const handleVoteAction = async (actionData) => {
  if (actionData.type === 'submit') {
    await submitVoteWithRetry(actionData.data);
  }
};

const submitVoteWithRetry = async (voteData) => {
  try {
    pluginStatus.value = 'normal';
    
    const response = await submitVote(voteData);
    console.log('投票提交成功:', response);
    
    pluginStatus.value = 'success';
    retryCount.value = 0;
    
  } catch (error) {
    console.error('投票提交失败:', error);
    
    if (retryCount.value < maxRetries) {
      retryCount.value++;
      console.log(`正在重试... (${retryCount.value}/${maxRetries})`);
      
      // 延时重试
      setTimeout(() => {
        submitVoteWithRetry(voteData);
      }, 1000 * retryCount.value);
      
    } else {
      pluginStatus.value = 'error';
      console.error('重试次数已达上限，提交失败');
    }
  }
};
</script>
```

## 样式定制

### CSS 变量

```scss
.liao-plugin-bubble {
  --plugin-border-radius: 8px;
  --plugin-padding: 16px;
  --plugin-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  --plugin-border-color: #e8e8e8;
  --plugin-bg-color: #ffffff;
  
  // 状态颜色
  --plugin-success-color: #52c41a;
  --plugin-error-color: #ff4d4f;
  --plugin-warning-color: #faad14;
  --plugin-info-color: #1890ff;
}
```

### 自定义主题

```vue
<template>
  <div class="custom-plugin-theme">
    <LiaoPluginBubble
      plugin-type="vote"
      :plugin-data="voteData"
    />
  </div>
</template>

<style scoped>
.custom-plugin-theme {
  .liao-plugin-bubble {
    --plugin-border-radius: 16px;
    --plugin-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    
    .liao-plugin-bubble-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
  }
}
</style>
```

## 性能优化

### 懒加载插件

```vue
<template>
  <LiaoPluginBubble
    :plugin-type="pluginType"
    :plugin-data="pluginData"
    :loading="!isPluginLoaded"
  />
</template>

<script setup>
import { ref, watch, defineAsyncComponent } from 'vue';

const isPluginLoaded = ref(false);
const pluginType = ref('stats');

// 懒加载插件组件
const loadPluginComponent = async (type) => {
  try {
    const component = await import(`@/components/LiaoPlugins/Liao${type}Plugin.vue`);
    registerPlugin(type, component.default);
    isPluginLoaded.value = true;
  } catch (error) {
    console.error(`插件 ${type} 加载失败:`, error);
  }
};

watch(pluginType, (newType) => {
  if (newType) {
    loadPluginComponent(newType);
  }
}, { immediate: true });
</script>
```

### 数据缓存

```javascript
// 插件数据缓存
const pluginDataCache = new Map();

export const getCachedPluginData = (pluginType, dataKey) => {
  const cacheKey = `${pluginType}-${dataKey}`;
  return pluginDataCache.get(cacheKey);
};

export const setCachedPluginData = (pluginType, dataKey, data) => {
  const cacheKey = `${pluginType}-${dataKey}`;
  pluginDataCache.set(cacheKey, data);
};
```

## 注意事项

1. **插件注册**：确保插件组件已正确注册到插件注册表中
2. **数据格式**：不同插件类型需要特定的数据格式，请参考各插件的文档
3. **状态管理**：设置 `pluginRequired=true` 时会自动锁定输入，确保正确处理完成事件
4. **内存管理**：大量插件实例时注意内存使用，适当使用懒加载
5. **错误边界**：建议在父组件中添加错误边界处理
6. **异步操作**：插件内的异步操作应正确处理加载和错误状态

## 浏览器兼容性

- Chrome 70+
- Firefox 65+
- Safari 12+
- Edge 79+
- 移动端：iOS Safari 12+, Android Chrome 70+

## 更新日志

### 2.5.0 (2025-06-16)
- 🔧 修复Vue Script Setup导出错误
- 🔄 重构类型系统，使用独立的session.ts类型文件
- ✨ 完善状态管理集成，支持必须完成插件的输入锁定
- 🎯 优化插件自动注册机制
- 📝 改进事件数据结构和日志输出

### 2.4.0 (2025-06-15)
- ✨ 新增插件必须完成控制 (pluginRequired 属性)
- 🔒 集成全局状态管理，支持自动锁定/解锁
- 🎯 优化插件事件处理和数据传递
- 📱 改进移动端插件交互体验

### 2.3.0 (2025-06-14)
- 🚀 重构插件注册系统，支持自动注册
- ✨ 新增错误状态显示和处理
- 🎨 优化加载状态动画效果
- 🔧 改进插件组件解析逻辑

### 2.2.0 (2025-06-13)
- ✨ 新增多种内置插件支持
- 🎨 统一插件样式和交互规范
- 📦 优化插件数据传递机制
- 🔧 修复插件渲染性能问题 