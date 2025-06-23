<template>
  <div 
    class="liao-quick-action-bar"
    :class="{
      'liao-quick-action-bar-vertical': vertical,
      'liao-quick-action-bar-fixed': fixed,
      'liao-quick-action-bar-scrollable': !vertical && actions.length > 0,
      customClass
    }"
  >
    <div 
      v-if="!vertical && actions.length > 0"
      ref="scrollContainer"
      class="liao-quick-action-bar-scroll-container"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
      @wheel="handleWheel"
    >
      <div class="liao-quick-action-bar-content">
        <div 
          v-for="(action, index) in actions" 
          :key="action.id || index"
          class="liao-quick-action-bar-item"
          :class="{
            'liao-quick-action-bar-item-active': action.active,
            'liao-quick-action-bar-item-disabled': action.disabled,
            [`liao-quick-action-bar-item-${action.type || 'default'}`]: true
          }"
          @click="handleActionClick(action, index)"
        >
          <div v-if="action.icon" class="liao-quick-action-bar-icon">
            <LiaoIcon 
              :name="action.icon" 
              :size="action.iconSize || 'medium'"
            />
          </div>
          <div class="liao-quick-action-bar-text">
            {{ action.text }}
          </div>
          <div v-if="action.badge" class="liao-quick-action-bar-badge">
            {{ action.badge }}
          </div>
        </div>
      </div>
      
      <!-- 滚动指示器 -->
      <div 
        v-if="showScrollIndicators"
        class="liao-quick-action-bar-scroll-indicators"
      >
        <div 
          class="liao-quick-action-bar-scroll-indicator left"
          :class="{ visible: canScrollLeft }"
          @click="scrollLeftButton"
        >
          <LiaoIcon name="chevron-left" size="small" />
        </div>
        <div 
          class="liao-quick-action-bar-scroll-indicator right"
          :class="{ visible: canScrollRight }"
          @click="scrollRightButton"
        >
          <LiaoIcon name="chevron-right" size="small" />
        </div>
      </div>
    </div>
    
    <!-- 垂直布局或自定义插槽内容 -->
    <slot v-else>
      <div 
        v-for="(action, index) in actions" 
        :key="action.id || index"
        class="liao-quick-action-bar-item"
        :class="{
          'liao-quick-action-bar-item-active': action.active,
          'liao-quick-action-bar-item-disabled': action.disabled,
          [`liao-quick-action-bar-item-${action.type || 'default'}`]: true
        }"
        @click="handleActionClick(action, index)"
      >
        <div v-if="action.icon" class="liao-quick-action-bar-icon">
          <LiaoIcon 
            :name="action.icon" 
            :size="action.iconSize || 'medium'"
          />
        </div>
        <div class="liao-quick-action-bar-text">
          {{ action.text }}
        </div>
        <div v-if="action.badge" class="liao-quick-action-bar-badge">
          {{ action.badge }}
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

export interface QuickAction {
  id?: string | number;
  icon?: string;
  iconSize?: 'small' | 'medium' | 'large';
  text: string;
  label?: string;
  badge?: string | number;
  active?: boolean;
  disabled?: boolean;
  type?: 'default' | 'primary' | 'warning' | 'danger' | 'success';
  [key: string]: any;
}

const props = defineProps({
  actions: {
    type: Array as PropType<QuickAction[]>,
    default: () => []
  },
  vertical: {
    type: Boolean,
    default: false
  },
  fixed: {
    type: Boolean,
    default: false
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  showScrollIndicators: {
    type: Boolean,
    default: true
  },
  scrollStep: {
    type: Number,
    default: 200
  }
});

const emit = defineEmits(['action-click']);

// 滚动容器引用
const scrollContainer = ref<HTMLElement | null>(null);

// 拖拽状态
const isDragging = ref(false);
const startX = ref(0);
const scrollLeftPos = ref(0);
const startScrollLeft = ref(0);

// 滚动状态
const canScrollLeft = ref(false);
const canScrollRight = ref(false);

// 检查滚动状态
const checkScrollState = () => {
  if (!scrollContainer.value) return;
  
  const container = scrollContainer.value;
  const scrollLeft = container.scrollLeft;
  const scrollWidth = container.scrollWidth;
  const clientWidth = container.clientWidth;
  
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1; // -1 for precision
};

// 鼠标事件处理
const handleMouseDown = (e: MouseEvent) => {
  if (!scrollContainer.value) return;
  
  isDragging.value = true;
  startX.value = e.pageX;
  startScrollLeft.value = scrollContainer.value.scrollLeft;
  
  // 阻止文本选择
  e.preventDefault();
  
  // 添加全局鼠标事件监听
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
  
  // 改变鼠标样式
  scrollContainer.value.style.cursor = 'grabbing';
};

const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value || !scrollContainer.value) return;
  
  e.preventDefault();
  
  const x = e.pageX;
  const walk = (x - startX.value) * 2; // 增加滚动速度
  scrollContainer.value.scrollLeft = startScrollLeft.value - walk;
};

const handleMouseUp = () => {
  if (!isDragging.value) return;
  
  isDragging.value = false;
  
  // 移除全局事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
  
  // 恢复鼠标样式
  if (scrollContainer.value) {
    scrollContainer.value.style.cursor = 'grab';
  }
};

// 触摸事件处理
const handleTouchStart = (e: TouchEvent) => {
  if (!scrollContainer.value) return;
  
  const touch = e.touches[0];
  startX.value = touch.pageX;
  startScrollLeft.value = scrollContainer.value.scrollLeft;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!scrollContainer.value) return;
  
  const touch = e.touches[0];
  const x = touch.pageX;
  const walk = (x - startX.value) * 1.5; // 触摸滚动速度
  scrollContainer.value.scrollLeft = startScrollLeft.value - walk;
  
  // 阻止页面滚动
  e.preventDefault();
};

const handleTouchEnd = () => {
  // 触摸结束时的处理
};

// 鼠标滚轮事件处理
const handleWheel = (e: WheelEvent) => {
  if (!scrollContainer.value) return;
  
  // 水平滚动
  if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
    scrollContainer.value.scrollLeft += e.deltaX;
  } else {
    // 垂直滚轮转换为水平滚动
    scrollContainer.value.scrollLeft += e.deltaY;
  }
  
  e.preventDefault();
};

// 滚动按钮事件
const scrollLeftButton = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({
    left: -props.scrollStep,
    behavior: 'smooth'
  });
};

const scrollRightButton = () => {
  if (!scrollContainer.value) return;
  scrollContainer.value.scrollBy({
    left: props.scrollStep,
    behavior: 'smooth'
  });
};

// 操作点击处理
const handleActionClick = (action: QuickAction, index: number) => {
  if (action.disabled || isDragging.value) return;
  
  emit('action-click', {
    action,
    index
  });
};

// 监听滚动事件
const handleScroll = () => {
  checkScrollState();
};

// 组件挂载时初始化
onMounted(() => {
  nextTick(() => {
    if (scrollContainer.value) {
      scrollContainer.value.addEventListener('scroll', handleScroll);
      scrollContainer.value.style.cursor = 'grab';
      checkScrollState();
      
      // 监听窗口大小变化
      window.addEventListener('resize', checkScrollState);
    }
  });
});

// 组件卸载时清理
onUnmounted(() => {
  if (scrollContainer.value) {
    scrollContainer.value.removeEventListener('scroll', handleScroll);
  }
  window.removeEventListener('resize', checkScrollState);
  
  // 清理全局事件监听
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});

// 导出方法供外部调用
defineExpose({
  scrollLeft: scrollLeftButton,
  scrollRight: scrollRightButton,
  checkScrollState
});
</script>

<style lang="scss" scoped>
.liao-quick-action-bar {
  position: relative;
  z-index: 2;
  
  &-vertical {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    padding: $spacing-sm $spacing-md;
    margin-bottom: -20px;
    background-color: transparent;
  }
  
  &-fixed {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
  
  &-scrollable {
    padding: $spacing-sm 0;
    margin-bottom: -20px;
    background-color: transparent;
  }
  
  &-scroll-container {
    position: relative;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 0 $spacing-md;
    
    // 隐藏滚动条
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    
    // 平滑滚动
    scroll-behavior: smooth;
    
    // 防止选中文本
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }
  
  &-content {
    display: flex;
    align-items: center;
    gap: $spacing-sm;
    min-width: min-content;
    padding: 2px; // 为阴影留出空间
  }
  
  &-item {
    display: flex;
    align-items: center;
    padding: $spacing-xs $spacing-sm;
    border-radius: $border-radius-sm;
    cursor: pointer;
    transition: all $transition-duration $transition-timing-function;
    position: relative;
    background-color: white;
    border: 1px solid $border-color;
    box-shadow: $shadow-sm;
    font-size: $font-size-sm;
    white-space: nowrap;
    flex-shrink: 0; // 防止卡片被压缩
    min-width: fit-content;
    
    &:hover {
      border-color: $primary-color;
      box-shadow: $shadow-md;
      transform: translateY(-2px);
    }
    
    &-active {
      color: $primary-color;
      border-color: $primary-color;
      background-color: rgba($primary-color, 0.05);
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
    }
    
    &-disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        transform: none;
        border-color: $border-color;
        box-shadow: $shadow-sm;
      }
    }
    
    &-primary {
      color: $primary-color;
    }
    
    &-warning {
      color: $warning-color;
    }
    
    &-danger {
      color: $danger-color;
    }
    
    &-success {
      color: $success-color;
    }
  }
  
  &-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: $spacing-xs;
  }
  
  &-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  &-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    min-width: 16px;
    height: 16px;
    border-radius: 8px;
    background-color: $danger-color;
    color: white;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
    padding: 0 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }
  
  // 滚动指示器
  &-scroll-indicators {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;
    z-index: 1;
  }
  
  &-scroll-indicator {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    border: 1px solid $border-color;
    box-shadow: $shadow-sm;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: auto;
    opacity: 0;
    visibility: hidden;
    transition: all $transition-duration $transition-timing-function;
    color: $text-secondary;
    
    &:hover {
      background-color: white;
      box-shadow: $shadow-md;
      color: $primary-color;
      transform: translateY(-50%) scale(1.1);
    }
    
    &.visible {
      opacity: 1;
      visibility: visible;
    }
    
    &.left {
      left: 8px;
    }
    
    &.right {
      right: 8px;
    }
  }
  
  // 垂直布局样式
  &-vertical {
    .liao-quick-action-bar-item {
      &:not(:last-child) {
        margin-bottom: $spacing-sm;
      }
    }
  }
  
  // 移动端优化
  @media (max-width: 768px) {
    &-scroll-container {
      padding: 0 $spacing-sm;
    }
    
    &-scroll-indicator {
      width: 28px;
      height: 28px;
      
      &.left {
        left: 4px;
      }
      
      &.right {
        right: 4px;
      }
    }
    
    &-item {
      padding: $spacing-xs;
      font-size: 12px;
      
      .liao-quick-action-bar-text {
        max-width: 80px;
      }
    }
  }
  
  // 触摸设备优化
  @media (hover: none) and (pointer: coarse) {
    &-scroll-indicator {
      opacity: 0.7;
      visibility: visible;
      
      &:not(.visible) {
        opacity: 0.3;
      }
    }
  }
}

// 拖拽时的样式
.liao-quick-action-bar-scroll-container {
  &:active {
    cursor: grabbing !important;
  }
}
</style> 