# LiaoKit 插件示例集合

本文档提供多种插件实现示例，帮助您理解插件开发的最佳实践。

## 目录

1. [表单插件](#表单插件)
2. [选择列表插件](#选择列表插件)
3. [信息卡片插件](#信息卡片插件)
4. [统计数据插件](#统计数据插件)
5. [媒体播放器插件](#媒体播放器插件)
6. [投票插件](#投票插件)
7. [FAQs插件](#faqs插件)
8. [时间轴插件](#时间轴插件)

## 表单插件

创建一个简单的表单插件，允许用户填写信息并提交。

```vue
<template>
  <div class="form-plugin">
    <h3 class="form-plugin-title">{{ pluginData.title }}</h3>
    <p v-if="pluginData.description" class="form-plugin-description">
      {{ pluginData.description }}
    </p>
    
    <form @submit.prevent="handleSubmit" class="form-plugin-form">
      <div 
        v-for="field in pluginData.fields" 
        :key="field.name" 
        class="form-plugin-field"
      >
        <label :for="field.name" class="form-plugin-label">
          {{ field.label }}
          <span v-if="field.required" class="form-plugin-required">*</span>
        </label>
        
        <!-- 文本输入 -->
        <input 
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'"
          :type="field.type"
          :id="field.name"
          :name="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          :placeholder="field.placeholder"
          :disabled="loading || readonly"
          class="form-plugin-input"
        />
        
        <!-- 多行文本 -->
        <textarea 
          v-else-if="field.type === 'textarea'"
          :id="field.name"
          :name="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          :placeholder="field.placeholder"
          :disabled="loading || readonly"
          class="form-plugin-textarea"
        ></textarea>
        
        <!-- 下拉选择 -->
        <select 
          v-else-if="field.type === 'select'"
          :id="field.name"
          :name="field.name"
          v-model="formData[field.name]"
          :required="field.required"
          :disabled="loading || readonly"
          class="form-plugin-select"
        >
          <option value="" disabled selected>{{ field.placeholder || '请选择' }}</option>
          <option 
            v-for="option in field.options" 
            :key="option.value" 
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
        
        <!-- 复选框 -->
        <div 
          v-else-if="field.type === 'checkbox'"
          class="form-plugin-checkbox-wrapper"
        >
          <input 
            type="checkbox"
            :id="field.name"
            :name="field.name"
            v-model="formData[field.name]"
            :disabled="loading || readonly"
            class="form-plugin-checkbox"
          />
          <span class="form-plugin-checkbox-label">{{ field.checkboxLabel }}</span>
        </div>
      </div>
      
      <div class="form-plugin-actions">
        <button 
          type="submit"
          class="form-plugin-submit"
          :disabled="loading || readonly"
        >
          <span v-if="loading">提交中...</span>
          <span v-else>{{ pluginData.submitText || '提交' }}</span>
        </button>
        
        <button 
          v-if="pluginData.showCancel"
          type="button"
          class="form-plugin-cancel"
          @click="handleCancel"
          :disabled="loading || readonly"
        >
          {{ pluginData.cancelText || '取消' }}
        </button>
      </div>
    </form>
    
    <div v-if="errorMessage" class="form-plugin-error">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  pluginData: {
    type: Object,
    default: () => ({})
  },
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['action']);

// 初始化表单数据
const formData = reactive({});
const errorMessage = ref('');

// 初始化默认值
watch(() => props.pluginData.fields, (fields) => {
  if (fields && Array.isArray(fields)) {
    fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        formData[field.name] = field.defaultValue;
      } else {
        // 根据字段类型设置默认值
        if (field.type === 'checkbox') {
          formData[field.name] = false;
        } else {
          formData[field.name] = '';
        }
      }
    });
  }
}, { immediate: true });

const handleSubmit = () => {
  errorMessage.value = '';
  
  // 简单验证
  let isValid = true;
  if (props.pluginData.fields && Array.isArray(props.pluginData.fields)) {
    for (const field of props.pluginData.fields) {
      if (field.required && !formData[field.name]) {
        errorMessage.value = `${field.label}是必填项`;
        isValid = false;
        break;
      }
    }
  }
  
  if (isValid) {
    emit('action', {
      type: 'form-submit',
      data: {
        formId: props.pluginData.formId,
        values: { ...formData }
      }
    });
  }
};

const handleCancel = () => {
  emit('action', {
    type: 'form-cancel',
    data: {
      formId: props.pluginData.formId
    }
  });
};
</script>

<style lang="scss" scoped>
.form-plugin {
  padding: 16px;
  
  &-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  &-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 16px;
  }
  
  &-form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  &-field {
    display: flex;
    flex-direction: column;
  }
  
  &-label {
    font-size: 14px;
    margin-bottom: 4px;
  }
  
  &-required {
    color: #f5222d;
    margin-left: 4px;
  }
  
  &-input,
  &-textarea,
  &-select {
    padding: 8px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    font-size: 14px;
    
    &:focus {
      border-color: #1890ff;
      outline: none;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
    
    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }
  
  &-textarea {
    min-height: 80px;
    resize: vertical;
  }
  
  &-checkbox-wrapper {
    display: flex;
    align-items: center;
  }
  
  &-checkbox {
    margin-right: 8px;
  }
  
  &-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }
  
  &-submit,
  &-cancel {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &-submit {
    background-color: #1890ff;
    color: white;
    border: none;
    
    &:hover:not(:disabled) {
      background-color: #40a9ff;
    }
  }
  
  &-cancel {
    background-color: white;
    color: #666;
    border: 1px solid #d9d9d9;
    
    &:hover:not(:disabled) {
      color: #40a9ff;
      border-color: #40a9ff;
    }
  }
  
  &-error {
    margin-top: 12px;
    color: #f5222d;
    font-size: 14px;
  }
}
</style>
```

### 使用方式

```javascript
const formPluginMessage = {
  type: 'plugin',
  pluginType: 'form',
  pluginData: {
    title: '联系我们',
    description: '请填写以下信息，我们将尽快回复您',
    formId: 'contact-form',
    submitText: '提交',
    showCancel: true,
    cancelText: '取消',
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
        name: 'subject',
        label: '主题',
        type: 'select',
        required: true,
        options: [
          { value: 'support', label: '技术支持' },
          { value: 'feedback', label: '产品反馈' },
          { value: 'other', label: '其他' }
        ]
      },
      {
        name: 'message',
        label: '留言',
        type: 'textarea',
        required: true,
        placeholder: '请输入您的留言'
      },
      {
        name: 'agreement',
        label: '同意条款',
        type: 'checkbox',
        required: true,
        checkboxLabel: '我已阅读并同意隐私政策'
      }
    ]
  }
};
```

## 选择列表插件

创建一个选择列表插件，允许用户从多个选项中选择。

```vue
<template>
  <div class="list-plugin">
    <h3 v-if="pluginData.title" class="list-plugin-title">
      {{ pluginData.title }}
    </h3>
    
    <p v-if="pluginData.description" class="list-plugin-description">
      {{ pluginData.description }}
    </p>
    
    <div class="list-plugin-items">
      <div 
        v-for="(item, index) in pluginData.items" 
        :key="index"
        class="list-plugin-item"
        :class="{ 'list-plugin-item-selected': selectedIndex === index }"
        @click="!readonly && handleItemClick(item, index)"
      >
        <div class="list-plugin-item-content">
          <div v-if="item.icon" class="list-plugin-item-icon">
            <!-- 可以是图标名称或图片URL -->
            <img 
              v-if="item.icon.startsWith('http')" 
              :src="item.icon" 
              alt="图标"
            />
            <span v-else class="list-plugin-item-icon-name">{{ item.icon }}</span>
          </div>
          
          <div class="list-plugin-item-text">
            <div class="list-plugin-item-title">{{ item.title }}</div>
            <div v-if="item.description" class="list-plugin-item-description">
              {{ item.description }}
            </div>
          </div>
        </div>
        
        <div v-if="!readonly" class="list-plugin-item-arrow">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12L10 8L6 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
      </div>
    </div>
    
    <div v-if="pluginData.showMore" class="list-plugin-more">
      <button 
        class="list-plugin-more-button"
        @click="handleShowMore"
        :disabled="loading || readonly"
      >
        {{ pluginData.moreText || '显示更多' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  pluginData: {
    type: Object,
    default: () => ({})
  },
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['action']);

const selectedIndex = ref(-1);

const handleItemClick = (item, index) => {
  selectedIndex.value = index;
  
  emit('action', {
    type: 'list-item-select',
    data: {
      listId: props.pluginData.listId,
      item: { ...item },
      index
    }
  });
};

const handleShowMore = () => {
  emit('action', {
    type: 'list-show-more',
    data: {
      listId: props.pluginData.listId
    }
  });
};
</script>

<style lang="scss" scoped>
.list-plugin {
  padding: 16px;
  
  &-title {
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  &-description {
    font-size: 14px;
    color: #666;
    margin-bottom: 12px;
  }
  
  &-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-radius: 8px;
    background-color: #f5f5f5;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover:not(.list-plugin-item-selected) {
      background-color: #e8e8e8;
    }
    
    &-selected {
      background-color: #e6f7ff;
      border: 1px solid #91d5ff;
    }
    
    &-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    &-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      
      img {
        max-width: 100%;
        max-height: 100%;
        object-fit: contain;
      }
    }
    
    &-text {
      display: flex;
      flex-direction: column;
    }
    
    &-title {
      font-size: 14px;
      font-weight: 500;
    }
    
    &-description {
      font-size: 12px;
      color: #666;
      margin-top: 4px;
    }
    
    &-arrow {
      color: #bfbfbf;
    }
  }
  
  &-more {
    margin-top: 12px;
    text-align: center;
    
    &-button {
      background: none;
      border: none;
      color: #1890ff;
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      
      &:hover {
        text-decoration: underline;
      }
      
      &:disabled {
        color: #d9d9d9;
        cursor: not-allowed;
        text-decoration: none;
      }
    }
  }
}
</style>
```

### 使用方式

```javascript
const listPluginMessage = {
  type: 'plugin',
  pluginType: 'list',
  pluginData: {
    title: '请选择一个选项',
    description: '以下是可用的选项列表',
    listId: 'options-list',
    showMore: true,
    moreText: '加载更多选项',
    items: [
      {
        title: '选项一',
        description: '这是选项一的描述文本',
        icon: 'option-icon',
        value: 'option1'
      },
      {
        title: '选项二',
        description: '这是选项二的描述文本',
        icon: 'https://example.com/icon2.png',
        value: 'option2'
      },
      {
        title: '选项三',
        description: '这是选项三的描述文本',
        value: 'option3'
      }
    ]
  }
};
```

## 信息卡片插件

创建一个信息卡片插件，用于显示结构化信息。

```vue
<template>
  <div class="info-plugin">
    <div v-if="pluginData.header" class="info-plugin-header">
      <img 
        v-if="pluginData.header.imageUrl" 
        :src="pluginData.header.imageUrl" 
        alt="头部图片"
        class="info-plugin-header-image"
      />
      
      <div class="info-plugin-header-content">
        <h3 class="info-plugin-title">{{ pluginData.header.title }}</h3>
        <p v-if="pluginData.header.subtitle" class="info-plugin-subtitle">
          {{ pluginData.header.subtitle }}
        </p>
      </div>
    </div>
    
    <div class="info-plugin-body">
      <div v-if="pluginData.content" class="info-plugin-content">
        <p>{{ pluginData.content }}</p>
      </div>
      
      <div v-if="pluginData.fields && pluginData.fields.length > 0" class="info-plugin-fields">
        <div 
          v-for="(field, index) in pluginData.fields" 
          :key="index" 
          class="info-plugin-field"
        >
          <div class="info-plugin-field-label">{{ field.label }}</div>
          <div class="info-plugin-field-value">{{ field.value }}</div>
        </div>
      </div>
    </div>
    
    <div v-if="pluginData.actions && pluginData.actions.length > 0" class="info-plugin-actions">
      <button 
        v-for="(action, index) in pluginData.actions" 
        :key="index"
        class="info-plugin-action"
        :class="[`info-plugin-action-${action.type || 'default'}`]"
        @click="handleAction(action, index)"
        :disabled="loading || readonly"
      >
        {{ action.text }}
      </button>
    </div>
    
    <div v-if="pluginData.footer" class="info-plugin-footer">
      {{ pluginData.footer }}
    </div>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  pluginData: {
    type: Object,
    default: () => ({})
  },
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['action']);

const handleAction = (action, index) => {
  emit('action', {
    type: 'info-action-click',
    data: {
      cardId: props.pluginData.cardId,
      action: { ...action },
      actionIndex: index
    }
  });
};
</script>

<style lang="scss" scoped>
.info-plugin {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  &-header {
    position: relative;
    
    &-image {
      width: 100%;
      height: 140px;
      object-fit: cover;
    }
    
    &-content {
      padding: 16px;
      background-color: white;
      
      // 如果有图片，覆盖在图片底部
      &:has(~ .info-plugin-header-image) {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(255, 255, 255, 0.9);
        backdrop-filter: blur(4px);
      }
    }
  }
  
  &-title {
    font-size: 18px;
    font-weight: 600;
    margin: 0;
  }
  
  &-subtitle {
    font-size: 14px;
    color: #666;
    margin: 4px 0 0 0;
  }
  
  &-body {
    padding: 16px;
  }
  
  &-content {
    font-size: 14px;
    line-height: 1.5;
    margin-bottom: 16px;
  }
  
  &-fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  &-field {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &-label {
      font-size: 14px;
      color: #666;
      flex: 1;
    }
    
    &-value {
      font-size: 14px;
      font-weight: 500;
      text-align: right;
      flex: 1;
    }
  }
  
  &-actions {
    display: flex;
    gap: 8px;
    padding: 16px;
    border-top: 1px solid #f0f0f0;
  }
  
  &-action {
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    
    &-primary {
      background-color: #1890ff;
      color: white;
      border: none;
      
      &:hover:not(:disabled) {
        background-color: #40a9ff;
      }
    }
    
    &-default {
      background-color: white;
      color: #666;
      border: 1px solid #d9d9d9;
      
      &:hover:not(:disabled) {
        color: #40a9ff;
        border-color: #40a9ff;
      }
    }
    
    &-link {
      background: none;
      border: none;
      color: #1890ff;
      padding: 8px 0;
      
      &:hover:not(:disabled) {
        text-decoration: underline;
      }
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
  
  &-footer {
    padding: 12px 16px;
    font-size: 12px;
    color: #999;
    text-align: center;
    background-color: #f9f9f9;
    border-top: 1px solid #f0f0f0;
  }
}
</style>
```

### 使用方式

```javascript
const infoPluginMessage = {
  type: 'plugin',
  pluginType: 'info',
  pluginData: {
    cardId: 'product-info',
    header: {
      imageUrl: 'https://example.com/product-image.jpg',
      title: '智能手表 Pro',
      subtitle: '先进的健康监测和长达14天的续航'
    },
    content: '这款新一代智能手表配备全天候健康监测功能，包括血氧、心率和睡眠分析。',
    fields: [
      { label: '价格', value: '¥1,299' },
      { label: '库存状态', value: '有货' },
      { label: '颜色', value: '太空灰' },
      { label: '保修', value: '2年' }
    ],
    actions: [
      { 
        text: '立即购买', 
        type: 'primary',
        actionId: 'buy'
      },
      { 
        text: '加入购物车', 
        type: 'default',
        actionId: 'add-to-cart'
      },
      { 
        text: '查看详情', 
        type: 'link',
        actionId: 'view-details',
        url: 'https://example.com/product/123'
      }
    ],
    footer: '价格包含增值税 | 支持7天无理由退货'
  }
};
```

## 其他插件示例

由于文档篇幅有限，我们只详细展示了三个复杂插件的实现。其他插件实现可以参考以下简要示例：

### 统计数据插件

```javascript
// 使用方式
const statsPluginMessage = {
  type: 'plugin',
  pluginType: 'stats',
  pluginData: {
    title: '本月销售统计',
    data: [
      { label: '总销售额', value: '¥128,560', change: '+12.5%', trend: 'up' },
      { label: '订单数', value: '1,286', change: '+8.2%', trend: 'up' },
      { label: '平均客单价', value: '¥100', change: '-2.1%', trend: 'down' },
      { label: '新客户', value: '368', change: '+5.7%', trend: 'up' }
    ]
  }
};
```

### 投票插件

```javascript
// 使用方式
const votePluginMessage = {
  type: 'plugin',
  pluginType: 'vote',
  pluginData: {
    title: '您喜欢哪种类型的内容?',
    description: '请选择您最感兴趣的内容类型',
    voteId: 'content-preference',
    options: [
      { id: 'tutorial', text: '教程', count: 42 },
      { id: 'news', text: '新闻资讯', count: 28 },
      { id: 'case', text: '案例分析', count: 35 },
      { id: 'opinion', text: '观点评论', count: 15 }
    ],
    totalVotes: 120,
    hasVoted: false,
    multiSelect: false,
    showResults: true
  }
};
```

### 时间轴插件

```javascript
// 使用方式
const timelinePluginMessage = {
  type: 'plugin',
  pluginType: 'timeline',
  pluginData: {
    title: '订单跟踪',
    events: [
      { 
        title: '订单已确认', 
        time: '2023-05-15 10:30',
        description: '您的订单已确认，等待发货',
        status: 'success' 
      },
      { 
        title: '订单已发货', 
        time: '2023-05-16 14:20',
        description: '您的订单已发货，预计3-5天送达',
        status: 'success' 
      },
      { 
        title: '配送中', 
        time: '2023-05-17 09:45',
        description: '您的订单正在配送中',
        status: 'current' 
      },
      { 
        title: '已送达', 
        time: '预计 2023-05-19',
        description: '订单将送达您指定的地址',
        status: 'pending' 
      }
    ]
  }
};
```

## 下一步

欢迎查阅[自定义插件开发指南](./CustomPluginDevelopment.md)以获取更详细的开发说明。

如果您有其他插件需求或想法，请随时与我们联系。 

---

> 使用者提示：如果你是在寻找“组件库使用文档”（快速开始、组件/插件说明、场景组合与 FAQ），请前往 `../../docs-user/README.md`。
