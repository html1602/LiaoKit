<template>
  <div ref="progressRef" class="liao-progress-plugin">
    <div v-if="title || subtitle" class="liao-progress-plugin-header">
      <h3 v-if="title" class="liao-progress-plugin-title">{{ title }}</h3>
      <p v-if="subtitle" class="liao-progress-plugin-subtitle">{{ subtitle }}</p>
    </div>
    
    <div class="liao-progress-plugin-content">
      <slot>
        <!-- 进度条类型 -->
        <div v-if="type === 'bar'" class="liao-progress-plugin-bar-container">
          <div class="liao-progress-plugin-bar-info">
            <div v-if="label" class="liao-progress-plugin-label">{{ label }}</div>
            <div class="liao-progress-plugin-percentage">{{ percentage }}%</div>
          </div>
          <div class="liao-progress-plugin-bar">
            <div 
              class="liao-progress-plugin-bar-inner" 
              :class="[`liao-progress-plugin-bar-${status}`]" 
              :style="{ width: `${percentage}%` }"
            ></div>
          </div>
          <div v-if="description" class="liao-progress-plugin-description">{{ description }}</div>
          <div v-if="estimatedTime" class="liao-progress-plugin-estimated-time">{{ estimatedTime }}</div>
        </div>
        
        <!-- 圆形进度类型 -->
        <div v-else-if="type === 'circle'" class="liao-progress-plugin-circle-container">
          <div class="liao-progress-plugin-circle">
            <svg class="liao-progress-plugin-circle-svg" viewBox="0 0 100 100">
              <!-- 背景圆 -->
              <circle
                class="liao-progress-plugin-circle-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke-width="8"
              />
              <!-- 进度圆 -->
              <circle
                class="liao-progress-plugin-circle-progress"
                :class="[`liao-progress-plugin-circle-${status}`]"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke-width="8"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="dashOffset"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div class="liao-progress-plugin-circle-info">
              <div class="liao-progress-plugin-circle-percentage">{{ percentage }}%</div>
              <div v-if="label" class="liao-progress-plugin-circle-label">{{ label }}</div>
            </div>
          </div>
          <div v-if="description" class="liao-progress-plugin-description">{{ description }}</div>
          <div v-if="estimatedTime" class="liao-progress-plugin-estimated-time">{{ estimatedTime }}</div>
        </div>
        
        <!-- 步骤类型 -->
        <div v-else-if="type === 'steps'" class="liao-progress-plugin-steps-container">
          <div v-if="description" class="liao-progress-plugin-description">{{ description }}</div>
          
          <div class="liao-progress-plugin-steps" :class="{ 'liao-progress-plugin-steps-horizontal': isDesktop }">
            <div
              v-for="(step, index) in steps"
              :key="step.id || index"
              class="liao-progress-plugin-step"
              :class="{
                'liao-progress-plugin-step-finished': getStepStatus(step, index) === 'finished',
                'liao-progress-plugin-step-processing': getStepStatus(step, index) === 'processing',
                'liao-progress-plugin-step-waiting': getStepStatus(step, index) === 'waiting',
                'liao-progress-plugin-step-current': currentStep === index,
                'liao-progress-plugin-step-horizontal': isDesktop
              }"
            >
              <div class="liao-progress-plugin-step-icon">
                <span v-if="getStepStatus(step, index) === 'finished'" class="liao-progress-plugin-step-icon-check">✓</span>
                <span v-else-if="getStepStatus(step, index) === 'processing'" class="liao-progress-plugin-step-icon-processing">⏳</span>
                <span v-else class="liao-progress-plugin-step-icon-number">{{ index + 1 }}</span>
              </div>
              <div class="liao-progress-plugin-step-content">
                <div class="liao-progress-plugin-step-title">{{ step.title }}</div>
                <div v-if="step.description" class="liao-progress-plugin-step-description">{{ step.description }}</div>
                <div v-if="step.detail" class="liao-progress-plugin-step-detail">{{ step.detail }}</div>
              </div>
              <div v-if="index < steps.length - 1" class="liao-progress-plugin-step-line" :class="{ 'liao-progress-plugin-step-line-horizontal': isDesktop }"></div>
            </div>
          </div>
          
          <div v-if="estimatedTime" class="liao-progress-plugin-estimated-time">{{ estimatedTime }}</div>
        </div>
      </slot>
      
      <!-- 操作按钮 -->
      <div v-if="actions && actions.length > 0" class="liao-progress-plugin-actions">
        <button
          v-for="action in actions"
          :key="action.id"
          class="liao-progress-plugin-action-btn"
          :class="[`liao-progress-plugin-action-btn-${action.type || 'default'}`]"
          @click="handleAction(action)"
          :disabled="readonly || loading"
        >
          {{ action.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import type { PropType } from 'vue';

// 步骤接口
interface Step {
  id?: string;
  title: string;
  description?: string;
  detail?: string;
  status?: 'finished' | 'processing' | 'waiting';
  icon?: string;
}

// 操作按钮接口
interface Action {
  id: string;
  text: string;
  type?: 'primary' | 'default' | 'danger';
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      type?: 'bar' | 'circle' | 'steps';
      percentage?: number;
      percent?: number; // 兼容旧字段名
      status?: 'normal' | 'success' | 'warning' | 'error';
      label?: string;
      description?: string;
      steps?: Step[];
      currentStep?: number;
      estimatedTime?: string;
      actions?: Action[];
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
  }
});

// 事件
const emit = defineEmits(['action']);

// 组件引用
const progressRef = ref<HTMLElement>();

// 响应式组件宽度
const componentWidth = ref(800); // 默认为桌面端宽度

// 检测是否为桌面端（基于组件实际宽度）
const isDesktop = computed(() => {
  return componentWidth.value >= 600; // 调整断点为600px，更适合组件容器
});

// ResizeObserver 监听组件宽度变化
let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  if (progressRef.value && typeof ResizeObserver !== 'undefined') {
    // 使用 ResizeObserver 监听组件宽度变化
    resizeObserver = new ResizeObserver((entries) => {
      if (entries.length > 0) {
        const entry = entries[0];
        componentWidth.value = entry.contentRect.width;
      }
    });
    
    resizeObserver.observe(progressRef.value);
    
    // 初始化组件宽度
    componentWidth.value = progressRef.value.offsetWidth;
  } else if (progressRef.value) {
    // 降级方案：使用元素的 offsetWidth
    componentWidth.value = progressRef.value.offsetWidth;
    
    // 监听窗口大小变化作为备选方案
    const handleResize = () => {
      if (progressRef.value) {
        componentWidth.value = progressRef.value.offsetWidth;
      }
    };
    
    window.addEventListener('resize', handleResize);
  }
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

// 获取进度数据
const title = computed(() => props.pluginData.title || '');
const subtitle = computed(() => props.pluginData.subtitle || '');
const type = computed(() => props.pluginData.type || 'steps'); // 默认为步骤类型
const percentage = computed(() => {
  // 兼容 percent 和 percentage 两种字段名
  const val = props.pluginData.percentage || props.pluginData.percent || 0;
  return Math.min(100, Math.max(0, val));
});
const label = computed(() => props.pluginData.label || '');
const description = computed(() => props.pluginData.description || '');
const steps = computed(() => props.pluginData.steps || []);
const currentStep = computed(() => {
  const step = props.pluginData.currentStep || 0;
  return Math.min(steps.value.length - 1, Math.max(0, step));
});
const estimatedTime = computed(() => props.pluginData.estimatedTime || '');
const actions = computed(() => props.pluginData.actions || []);

// 获取步骤状态
const getStepStatus = (step: Step, index: number) => {
  // 如果步骤有明确的状态，使用步骤的状态
  if (step.status) {
    return step.status;
  }
  
  // 否则根据当前步骤计算状态
  if (index < currentStep.value) {
    return 'finished';
  } else if (index === currentStep.value) {
    return 'processing';
  } else {
    return 'waiting';
  }
};

// 处理操作按钮点击
const handleAction = (action: Action) => {
  emit('action', {
    type: 'progress-action',
    data: {
      actionId: action.id,
      actionText: action.text,
      actionType: action.type,
      currentStep: currentStep.value,
      percent: percentage.value
    }
  });
};

// 圆形进度条计算
const circumference = computed(() => 2 * Math.PI * 45);
const dashOffset = computed(() => {
  return circumference.value * (1 - percentage.value / 100);
});
</script>

<style lang="scss" scoped>
.liao-progress-plugin {
  width: 100%;
  border-radius: $border-radius-md;
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  
  &-header {
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color-card;
    background-color: $bg-secondary;
  }
  
  &-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin: 0 0 $spacing-xs 0;
  }
  
  &-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: 0;
    line-height: 1.4;
  }
  
  &-content {
    padding: $spacing-lg;
  }
  
  &-description {
    margin-bottom: $spacing-md;
    font-size: $font-size-sm;
    color: $text-secondary;
    line-height: 1.5;
  }
  
  &-estimated-time {
    margin-top: $spacing-md;
    padding: $spacing-sm $spacing-md;
    background-color: rgba($primary-color, 0.1);
    border-left: 3px solid $primary-color;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    color: $primary-color;
    font-weight: $font-weight-medium;
  }
  
  // 进度条样式
  &-bar {
    height: 8px;
    background-color: $bg-secondary;
    border-radius: $border-radius-sm;
    overflow: hidden;
    
    &-container {
      width: 100%;
    }
    
    &-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: $spacing-sm;
    }
    
    &-label {
      font-size: $font-size-md;
      color: $text-primary;
    }
    
    &-percentage {
      font-size: $font-size-md;
      color: $text-secondary;
    }
    
    &-inner {
      height: 100%;
      border-radius: $border-radius-sm;
      transition: width 0.6s ease;
    }
    
    &-normal {
      background-color: $primary-color;
    }
    
    &-success {
      background-color: $success-color;
    }
    
    &-warning {
      background-color: $warning-color;
    }
    
    &-error {
      background-color: $danger-color;
    }
  }
  
  // 圆形进度样式
  &-circle {
    position: relative;
    width: 120px;
    height: 120px;
    
    &-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    &-svg {
      transform: rotate(0deg);
    }
    
    &-bg {
      stroke: $bg-secondary;
    }
    
    &-progress {
      transition: stroke-dashoffset 0.6s ease;
    }
    
    &-normal {
      stroke: $primary-color;
    }
    
    &-success {
      stroke: $success-color;
    }
    
    &-warning {
      stroke: $warning-color;
    }
    
    &-error {
      stroke: $danger-color;
    }
    
    &-info {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    
    &-percentage {
      font-size: $font-size-xl;
      font-weight: $font-weight-medium;
      color: $text-primary;
    }
    
    &-label {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: $spacing-xs;
    }
  }
  
  // 步骤进度样式
  &-steps {
    display: flex;
    flex-direction: column;
    
    &-container {
      width: 100%;
    }
    
    // 横向布局样式
    &-horizontal {
      flex-direction: row;
      align-items: flex-start;
      justify-content: space-between;
      gap: $spacing-md;
      
      @media (max-width: 767px) {
        flex-direction: column;
      }
    }
  }
  
  &-step {
    position: relative;
    display: flex;
    padding-bottom: $spacing-xl;
    
    &:last-child {
      padding-bottom: 0;
      
      .liao-progress-plugin-step-line {
        display: none;
      }
    }
    
    // 横向布局样式
    &-horizontal {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding-bottom: 0;
      padding-right: $spacing-md;
      flex: 1;
      min-width: 0; // 防止内容溢出
      
      &:last-child {
        padding-right: 0;
      }
      
      .liao-progress-plugin-step-icon {
        margin-right: 0;
        margin-bottom: $spacing-sm;
      }
      
      .liao-progress-plugin-step-content {
        padding-top: 0;
        width: 100%;
      }
      
      .liao-progress-plugin-step-title {
        font-size: $font-size-sm;
        margin-bottom: $spacing-xs;
        line-height: 1.3;
      }
      
      .liao-progress-plugin-step-description {
        font-size: $font-size-xs;
        margin-bottom: $spacing-xs;
        line-height: 1.3;
      }
      
      .liao-progress-plugin-step-detail {
        font-size: $font-size-xs;
      }
      
      @media (max-width: 767px) {
        flex-direction: row;
        text-align: left;
        padding-right: 0;
        padding-bottom: $spacing-xl;
        
        .liao-progress-plugin-step-icon {
          margin-right: $spacing-md;
          margin-bottom: 0;
        }
        
        .liao-progress-plugin-step-content {
          padding-top: $spacing-xs;
        }
        
        .liao-progress-plugin-step-title {
          font-size: $font-size-md;
        }
        
        .liao-progress-plugin-step-description {
          font-size: $font-size-sm;
        }
      }
    }
    
    &-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: $bg-secondary;
      border: 2px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: $spacing-md;
      z-index: 1;
      transition: all 0.3s;
      flex-shrink: 0;
      
      &-number {
        font-size: $font-size-md;
        color: $text-secondary;
      }
      
      &-check {
        font-size: $font-size-md;
        color: white;
      }
      
      &-processing {
        font-size: $font-size-md;
        color: $primary-color;
      }
    }
    
    &-content {
      flex: 1;
      padding-top: $spacing-xs;
    }
    
    &-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $text-primary;
      margin-bottom: $spacing-xs;
    }
    
    &-description {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-bottom: $spacing-xs;
      line-height: 1.4;
    }
    
    &-detail {
      font-size: $font-size-xs;
      color: $text-disabled;
      font-style: italic;
    }
    
    &-line {
      position: absolute;
      left: 16px;
      top: 32px;
      height: calc(100% - 32px);
      width: 2px;
      background-color: $border-color;
      z-index: 0;
      
      // 横向布局的连接线
      &-horizontal {
        left: auto;
        top: 16px;
        right: calc(-#{$spacing-md} / 2);
        width: $spacing-md;
        height: 2px;
        
        @media (max-width: 767px) {
          left: 16px;
          top: 32px;
          right: auto;
          width: 2px;
          height: calc(100% - 32px);
        }
      }
    }
    
    &-finished {
      .liao-progress-plugin-step-icon {
        background-color: $success-color;
        border-color: $success-color;
      }
      
      .liao-progress-plugin-step-line {
        background-color: $success-color;
        
        &-horizontal {
          background-color: $success-color;
        }
      }
    }
    
    &-processing {
      .liao-progress-plugin-step-icon {
        background-color: rgba($primary-color, 0.1);
        border-color: $primary-color;
        animation: pulse 2s infinite;
      }
      
      .liao-progress-plugin-step-title {
        color: $primary-color;
        font-weight: $font-weight-bold;
      }
    }
    
    &-waiting {
      .liao-progress-plugin-step-icon {
        background-color: $bg-secondary;
        border-color: $border-color;
      }
      
      .liao-progress-plugin-step-title,
      .liao-progress-plugin-step-description {
        color: $text-disabled;
      }
    }
    
    &-current {
      .liao-progress-plugin-step-icon {
        background-color: $primary-color;
        border-color: $primary-color;
        
        .liao-progress-plugin-step-icon-number {
          color: white;
        }
      }
    }
  }
  
  // 操作按钮样式
  &-actions {
    margin-top: $spacing-lg;
    padding-top: $spacing-lg;
    border-top: 1px solid $border-color-card;
    display: flex;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
  
  &-action-btn {
    padding: $spacing-sm $spacing-lg;
    border-radius: $border-radius-sm;
    border: 1px solid $border-color;
    background-color: $bg-primary;
    color: $text-primary;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all 0.3s;
    
    &:hover:not(:disabled) {
      border-color: $primary-color;
      color: $primary-color;
    }
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &-primary {
      background-color: $primary-color;
      border-color: $primary-color;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: color.adjust($primary-color, $lightness: -10%);
        border-color: color.adjust($primary-color, $lightness: -10%);
        color: white;
      }
    }
    
    &-danger {
      background-color: $danger-color;
      border-color: $danger-color;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: color.adjust($danger-color, $lightness: -10%);
        border-color: color.adjust($danger-color, $lightness: -10%);
        color: white;
      }
    }
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba($primary-color, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba($primary-color, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba($primary-color, 0);
  }
}
</style> 