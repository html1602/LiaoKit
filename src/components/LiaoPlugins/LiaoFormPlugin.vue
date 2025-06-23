<template>
  <div class="liao-form-plugin" :class="{ 'is-disabled': disabled, 'is-readonly': readonly }">
    <div class="liao-form-plugin-header">
      <h3 class="liao-form-plugin-title">{{ title }}</h3>
    </div>

    <div class="liao-form-plugin-body">
      <slot>
        <form @submit.prevent="handleSubmit" class="liao-form-plugin-form">
          <div 
            v-for="(field, index) in fields" 
            :key="index"
            class="liao-form-plugin-field"
          >
            <label class="liao-form-plugin-label">
              {{ field.label }}
              <span v-if="field.required" class="liao-form-plugin-required">*</span>
            </label>
            
            <!-- 文本输入框 -->
            <input
              v-if="field.type === 'input'"
              v-model="formValues[index]"
              :placeholder="field.placeholder || '请输入' + field.label"
              :required="field.required"
              :disabled="disabled || readonly"
              class="liao-form-plugin-input"
              type="text"
            />
            
            <!-- 多行文本框 -->
            <textarea
              v-else-if="field.type === 'textarea'"
              v-model="formValues[index]"
              :placeholder="field.placeholder || '请输入' + field.label"
              :required="field.required"
              :disabled="disabled || readonly"
              class="liao-form-plugin-textarea"
              rows="3"
            ></textarea>
            
            <!-- 选择框 -->
            <select
              v-else-if="field.type === 'select'"
              v-model="formValues[index]"
              :required="field.required"
              :disabled="disabled || readonly"
              class="liao-form-plugin-select"
            >
              <option value="" disabled>请选择{{ field.label }}</option>
              <option
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                :value="typeof option === 'object' ? option.value : option"
              >
                {{ typeof option === 'object' ? option.label : option }}
              </option>
            </select>
            
            <!-- 单选框组 -->
            <div v-else-if="field.type === 'radio'" class="liao-form-plugin-radio-group">
              <div
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                class="liao-form-plugin-radio"
              >
                <input
                  type="radio"
                  :id="`radio-${index}-${optionIndex}`"
                  :name="`radio-group-${index}`"
                  :value="typeof option === 'object' ? option.value : option"
                  v-model="formValues[index]"
                  :disabled="disabled || readonly"
                />
                <label :for="`radio-${index}-${optionIndex}`">
                  {{ typeof option === 'object' ? option.label : option }}
                </label>
              </div>
            </div>
            
            <!-- 复选框组 -->
            <div v-else-if="field.type === 'checkbox'" class="liao-form-plugin-checkbox-group">
              <div
                v-for="(option, optionIndex) in field.options"
                :key="optionIndex"
                class="liao-form-plugin-checkbox"
              >
                <input
                  type="checkbox"
                  :id="`checkbox-${index}-${optionIndex}`"
                  :value="typeof option === 'object' ? option.value : option"
                  v-model="formValues[index]"
                  :disabled="disabled || readonly"
                />
                <label :for="`checkbox-${index}-${optionIndex}`">
                  {{ typeof option === 'object' ? option.label : option }}
                </label>
              </div>
            </div>
          </div>
          
          <div class="liao-form-plugin-footer">
            <slot name="footer">
              <button
                v-ripple="'rgba(38, 105, 255, 0.3)'"
                class="liao-form-plugin-submit"
                type="button"
                :disabled="disabled || readonly || loading"
                @click="handleSubmit"
              >
                <span v-if="loading" class="liao-form-plugin-loading-icon"></span>
                {{ submitText }}
              </button>
            </slot>
          </div>
        </form>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import type { PropType } from 'vue';

// 表单字段类型
interface FormField {
  label: string;
  type: 'input' | 'select' | 'textarea' | 'radio' | 'checkbox';
  options?: any[];
  required?: boolean;
  placeholder?: string;
  value?: any;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      fields: FormField[];
      submitText?: string;
    }>,
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
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

// 事件
const emit = defineEmits(['action']);

// 获取表单数据
const title = computed(() => props.pluginData.title || '表单');
const fields = computed(() => props.pluginData.fields || []);
const submitText = computed(() => props.pluginData.submitText || '提交');

// 表单值
const formValues = ref<any[]>([]);

// 初始化表单值
watch(
  () => props.pluginData.fields,
  (newFields) => {
    if (newFields) {
      formValues.value = newFields.map(field => field.value !== undefined ? field.value : 
        field.type === 'checkbox' ? [] : '');
    }
  },
  { immediate: true }
);

// 处理表单提交
const handleSubmit = (event?: Event) => {
  // 如果表单被禁用，直接返回
  if (props.disabled) {
    return;
  }
  
  console.log('📝 [LiaoFormPlugin] 接收到提交请求:', { formValues: formValues.value, fields: fields.value });
  
  // 阻止默认的表单提交行为
  if (event) {
    event.preventDefault();
  }
  
  // 验证逻辑
  const errors: Array<{field: FormField, index: number, message: string}> = [];
  
  fields.value.forEach((field, index) => {
    if (field.required) {
      const value = formValues.value[index];
      const isEmpty = value === '' || value === null || value === undefined || 
                     (Array.isArray(value) && value.length === 0);
      
      if (isEmpty) {
        errors.push({
          field,
          index,
          message: `${field.label} 为必填项`
        });
      }
    }
  });
  
  // 始终抛出事件，让使用者决定如何处理
  if (errors.length > 0) {
    // 抛出验证失败事件
    const failedEvent = {
      type: 'form-validation-failed',
      data: {
        errors,
        errorCount: errors.length,
        isValid: false
      }
    };
    console.log('📤 [LiaoFormPlugin] 向父组件发送事件:', failedEvent);
    emit('action', failedEvent);
  } else {
    // 构建表单数据对象
    const formData = fields.value.reduce((result, field, index) => {
      result[field.label] = formValues.value[index];
      return result;
    }, {} as Record<string, any>);
    
    // 抛出提交成功事件
    const successEvent = {
      type: 'form-submit',
      data: {
        formData,
        formValues: [...formValues.value],
        isValid: true
      }
    };
    console.log('📤 [LiaoFormPlugin] 向父组件发送事件:', successEvent);
    emit('action', successEvent);
  }
};
</script>

<style lang="scss" scoped>
.liao-form-plugin {
  width: 100%;
  border-radius: 8px; // 现代表单规范：4-8px圆角
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  transition: all 0.3s ease;
  
  // 禁用状态样式
  &.is-disabled {
    background-color: #f8f9fa;
    border-color: #e9ecef;
    opacity: 0.7;
    
    .liao-form-plugin-title {
      color: #6c757d;
    }
  }
  
  // 只读状态样式
  &.is-readonly {
    background-color: #f8f9fa;
    border-color: #dee2e6;
    
    .liao-form-plugin-title {
      color: #495057;
    }
  }
  
  &-header {
    padding: 20px 20px 16px 20px; // 优化间距
    border-bottom: 1px solid $border-color-card;
    background-color: $bg-secondary;
  }
  
  &-title {
    font-size: 16px; // 现代表单规范：标题字体适中
    font-weight: 600; // 稍微加重
    color: $text-primary;
    margin: 0;
    text-align: left; // 明确左对齐
    line-height: 1.4;
  }
  
  &-body {
    padding: 24px 20px; // 现代表单规范：自然间距
  }
  
  &-form {
    display: flex;
    flex-direction: column;
    gap: 20px; // 现代表单规范：字段间距12-24px
  }
  
  &-field {
    display: flex;
    flex-direction: column;
    gap: 8px; // 标签与输入框间距
  }
  
  &-label {
    display: block;
    font-size: 14px; // 现代表单规范：标签字体小于输入框内容
    font-weight: 600; // 加粗标签文字，增强视觉层次
    color: $text-primary;
    text-align: left; // 明确左对齐
    line-height: 1.4;
    margin: 0;
    
    .is-disabled & {
      color: #6c757d;
    }
  }
  
  &-required {
    color: $danger-color;
    margin-left: 4px;
    font-weight: 600;
  }
  
  &-input,
  &-textarea,
  &-select {
    width: 100%;
    min-width: 280px; // 现代表单规范：最小宽度
    height: 44px; // 现代表单规范：40-48px高度
    padding: 12px 16px;
    border: 1px solid #d1d5db; // 现代表单规范：边框灰
    border-radius: 6px; // 现代表单规范：4-8px圆角
    background-color: $bg-primary;
    font-size: 15px; // 输入内容字体
    color: $text-primary;
    transition: all 0.3s ease; // 现代表单规范：平滑过渡
    box-sizing: border-box;
    
    &::placeholder {
      color: #9ca3af; // 现代表单规范：占位符灰
      font-size: 14px;
    }
    
    &:focus {
      outline: none;
      border-color: #0052d9; // 现代表单规范：主色
      box-shadow: 0 0 0 3px rgba(0, 82, 217, 0.1); // 聚焦高亮描边
    }
    
    &:disabled {
      background-color: #f3f4f6; // 现代表单规范：禁用灰
      color: #6c757d;
      border-color: #e5e7eb;
      cursor: not-allowed;
      
      &::placeholder {
        color: #9ca3af;
      }
    }
    
    // 移动端适配
    @media (max-width: 768px) {
      min-width: 100%;
    }
  }
  
  &-textarea {
    height: auto;
    min-height: 88px; // 3行文本的合适高度
    resize: vertical;
    line-height: 1.5;
  }
  
  &-select {
    cursor: pointer;
    
    &:disabled {
      cursor: not-allowed;
    }
  }
  
  &-radio-group,
  &-checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px; // 选项间距
  }
  
  &-radio,
  &-checkbox {
    display: flex;
    align-items: center;
    gap: 8px;
    
    input {
      cursor: pointer;
      margin: 0;
      
      &:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }
    }
    
    label {
      cursor: pointer;
      font-size: 14px;
      color: $text-primary;
      line-height: 1.4;
      margin: 0;
      text-align: left;
      
      .is-disabled &,
      input:disabled + & {
        color: #6c757d;
        cursor: not-allowed;
      }
    }
  }
  
  &-footer {
    margin-top: 24px; // 与表单字段保持一致的间距
    display: flex;
    justify-content: flex-start; // 按钮左对齐，符合现代表单规范
    
    // 移动端按钮全宽
    @media (max-width: 768px) {
      justify-content: stretch;
    }
  }
  
  &-submit {
    background-color: #0052d9; // 现代表单规范：主色
    color: white;
    border: none;
    border-radius: 6px;
    height: 44px; // 与输入框高度一致
    padding: 0 24px;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 120px;
    
    &:hover:not(:disabled) {
      background-color: #0041a8; // 悬停时加深
      transform: translateY(-1px); // 轻微上浮效果
    }
    
    &:active:not(:disabled) {
      transform: translateY(0); // 点击时轻微缩放
    }
    
    &:disabled {
      background-color: #e5e7eb; // 现代表单规范：禁用灰
      color: #9ca3af;
      cursor: not-allowed;
      transform: none;
    }
    
    // 移动端全宽按钮
    @media (max-width: 768px) {
      width: 100%;
      min-width: auto;
    }
  }
  
  &-loading-icon {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: liao-form-plugin-spin 1s linear infinite;
    margin-right: 8px;
  }
}

@keyframes liao-form-plugin-spin {
  to { transform: rotate(360deg); }
}

// 全局禁用状态下的额外样式
.liao-form-plugin.is-disabled {
  * {
    pointer-events: none; // 完全禁用所有交互
  }
}
</style> 