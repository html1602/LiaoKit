<template>
  <div class="liao-actions-plugin">
    <div v-if="title || subtitle || description" class="liao-actions-plugin-header">
      <h3 v-if="title" class="liao-actions-plugin-title">{{ title }}</h3>
      <p v-if="subtitle" class="liao-actions-plugin-subtitle">{{ subtitle }}</p>
      <p v-if="description" class="liao-actions-plugin-description">{{ description }}</p>
    </div>
    
    <div class="liao-actions-plugin-content">
      <slot>
        <div 
          class="liao-actions-plugin-container"
          :class="[
            `liao-actions-plugin-layout-${layout}`,
            { [`liao-actions-plugin-columns-${columns}`]: layout === 'grid' && columns }
          ]"
          :style="gridStyle"
        >
          <button
            v-for="(action, index) in actions"
            :key="index"
            class="liao-actions-plugin-button"
            :class="[
              `liao-actions-plugin-button-${layout}`,
              { 'liao-actions-plugin-button-confirm': action.confirm }
            ]"
            :disabled="readonly || action.disabled"
            :style="getButtonStyle(action)"
            @click="handleAction(action, index)"
          >
            <div 
              v-if="action.icon" 
              class="liao-actions-plugin-button-icon" 
              :style="getIconStyle(action)"
            >
              <LiaoIcon v-if="isLiaoIconName(action.icon)" :name="action.icon" size="large" />
              <img v-else-if="isImageUrl(action.icon)" :src="action.icon" alt="图标" class="liao-actions-plugin-img-icon" />
              <span v-else-if="isSvgString(action.icon)" v-html="action.icon" class="liao-actions-plugin-svg-icon"></span>
              <span v-else>{{ action.icon }}</span>
            </div>
            <div class="liao-actions-plugin-button-content">
              <span class="liao-actions-plugin-button-text">{{ action.text }}</span>
              <span v-if="action.description && layout === 'list'" class="liao-actions-plugin-button-desc">{{ action.description }}</span>
            </div>
            <span v-if="action.badge" class="liao-actions-plugin-button-badge" :class="`liao-actions-plugin-badge-${action.badge}`">
              {{ getBadgeText(action.badge) }}
            </span>
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

// 操作按钮类型
interface Action {
  text: string;
  id: string;
  icon?: string;
  description?: string;
  type?: 'primary' | 'default' | 'danger';
  badge?: 'hot' | 'new' | 'urgent' | 'sale';
  disabled?: boolean;
  confirm?: boolean;
  extend?: Record<string, any>;
  // 自定义样式 - 统一的背景字段
  background?: string; // 支持纯色、渐变、图片URL
  textColor?: string;
  iconColor?: string;
  // 保留向后兼容
  backgroundColor?: string;
  backgroundImage?: string;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      description?: string;
      actions: Action[];
      layout?: 'grid' | 'list';
      columns?: number;
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

// 获取数据
const title = computed(() => props.pluginData.title || '');
const subtitle = computed(() => props.pluginData.subtitle || '');
const description = computed(() => props.pluginData.description || '');
const actions = computed(() => props.pluginData.actions || []);
const layout = computed(() => props.pluginData.layout || 'grid');
const columns = computed(() => props.pluginData.columns || 2);

// 计算网格样式
const gridStyle = computed(() => {
  if (layout.value === 'grid' && columns.value) {
    return {
      gridTemplateColumns: `repeat(${columns.value}, 1fr)`
    };
  }
  return {};
});

// 计算按钮样式
const getButtonStyle = (action: Action) => {
  const style: Record<string, string> = {};
  
  // 统一背景处理逻辑
  let backgroundValue = '';
  
  if (action.background) {
    // 优先使用新的统一background字段
    backgroundValue = action.background;
  } else {
    // 向后兼容：将旧字段转换为统一格式
    if (action.backgroundImage) {
      backgroundValue = `url(${action.backgroundImage})`;
    } else if (action.backgroundColor) {
      backgroundValue = action.backgroundColor;
    }
  }
  
  // 应用背景样式
  if (backgroundValue) {
    if (backgroundValue.startsWith('url(') || backgroundValue.includes('gradient')) {
      style.background = backgroundValue;
      // 如果是图片，添加默认的背景属性
      if (backgroundValue.startsWith('url(')) {
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
        style.backgroundRepeat = 'no-repeat';
      }
    } else {
      // 纯色背景
      style.backgroundColor = backgroundValue;
    }
  }
  
  if (action.textColor) style.color = action.textColor;
  
  return style;
};

// 计算图标样式
const getIconStyle = (action: Action) => {
  const style: Record<string, string> = {};
  if (action.iconColor) style.color = action.iconColor;
  return style;
};

// 获取徽章文本
const getBadgeText = (badge: string) => {
  const badgeMap: Record<string, string> = {
    hot: '热门',
    new: '新',
    urgent: '紧急',
    sale: '促销'
  };
  return badgeMap[badge] || badge;
};

// icon类型判断方法
function isLiaoIconName(icon: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(icon) && !/^https?:\/\//.test(icon) && !icon.trim().startsWith('<svg');
}
function isImageUrl(icon: string): boolean {
  return /^https?:\/\//.test(icon) || icon.endsWith('.png') || icon.endsWith('.jpg') || icon.endsWith('.jpeg') || icon.endsWith('.gif') || icon.endsWith('.webp');
}
function isSvgString(icon: string): boolean {
  return icon.trim().startsWith('<svg');
}

// 打印接收到的props数据
watch(() => props.pluginData, (val) => {
  console.log('[LiaoActionsPlugin] 接收到pluginData:', val);
}, { immediate: true, deep: true });

// 处理操作按钮点击
const handleAction = (action: Action, index: number) => {
  const emitData = {
    type: 'action-click',
    data: {
      id: action.id,
      actionText: action.text,
      actionType: action.type,
      confirm: action.confirm,
      index,
      extend: action.extend ?? {}
    }
  };
  console.log('[LiaoActionsPlugin] 抛出action事件:', emitData);
  emit('action', emitData);
};
</script>

<style lang="scss" scoped>
.liao-actions-plugin {
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
    font-size: $font-size-md;
    color: $text-secondary;
    margin: 0 0 $spacing-xs 0;
    font-weight: $font-weight-regular;
  }
  
  &-description {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: 0;
    line-height: 1.4;
  }
  
  &-content {
    padding: $spacing-lg;
  }
  
  &-container {
    &.liao-actions-plugin-layout-grid {
      display: grid;
      gap: $spacing-md;
      
      // 默认网格布局
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      
      // 自定义列数
      &.liao-actions-plugin-columns-1 {
        grid-template-columns: 1fr;
      }
      &.liao-actions-plugin-columns-2 {
        grid-template-columns: repeat(2, 1fr);
      }
      &.liao-actions-plugin-columns-3 {
        grid-template-columns: repeat(3, 1fr);
      }
      &.liao-actions-plugin-columns-4 {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    
    &.liao-actions-plugin-layout-list {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }
  }
  
  &-button {
    position: relative;
    border: 1px solid $border-color-card;
    border-radius: $border-radius-sm;
    background-color: $bg-primary;
    cursor: pointer;
    transition: all $transition-duration;
    
    &:hover:not([style*="background-color"]):not([style*="background-image"]):not([style*="background:"]) {
      background-color: $bg-secondary;
      border-color: rgba($primary-color, 0.3);
    }
    
    &:active {
      transform: scale(0.98);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      
      &:hover {
        background-color: $bg-primary;
        border-color: $border-color;
        transform: none;
      }
    }
    
    // 确保自定义样式优先级
    &[style*="background-color"], &[style*="background-image"], &[style*="background:"] {
      &:hover {
        filter: brightness(0.9);
      }
    }
    
    &[style*="color"] {
      .liao-actions-plugin-button-text {
        color: inherit !important;
      }
    }
    
    // 网格布局样式
    &-grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: $spacing-md;
      text-align: center;
    }
    
    // 列表布局样式
    &-list {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: $spacing-md;
      text-align: left;
    }
    
    &-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $primary-color;
      flex-shrink: 0;
      transition: all 0.3s ease;
      
      .liao-actions-plugin-button-grid & {
        margin-bottom: $spacing-sm;
      }
      
      .liao-actions-plugin-button-list & {
        margin-right: $spacing-md;
      }
    }
    
    &-content {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }
    
    &-text {
      font-size: $font-size-sm;
      color: $text-primary;
      font-weight: $font-weight-medium;
      
      .liao-actions-plugin-button-list & {
        margin-bottom: $spacing-xs;
      }
    }
    
    &-desc {
      font-size: $font-size-xs;
      color: $text-secondary;
      line-height: 1.3;
    }
    
    &-badge {
      position: absolute;
      top: -6px;
      right: -6px;
      padding: 2px 6px;
      border-radius: $border-radius-sm;
      font-size: 10px;
      font-weight: $font-weight-medium;
      line-height: 1;
      
      &.liao-actions-plugin-badge-hot {
        background-color: #ff4d4f;
        color: white;
      }
      
      &.liao-actions-plugin-badge-new {
        background-color: #52c41a;
        color: white;
      }
      
      &.liao-actions-plugin-badge-urgent {
        background-color: #faad14;
        color: white;
      }
      
      &.liao-actions-plugin-badge-sale {
        background-color: #722ed1;
        color: white;
      }
    }
    
    // 确认操作样式
    &-confirm {
      border-color: #ff4d4f;
      
      &:hover:not([style*="background-color"]):not([style*="background-image"]):not([style*="background:"]) {
        background-color: rgba(#ff4d4f, 0.05);
        border-color: #ff4d4f;
      }
      
      &:not([style*="color"]) .liao-actions-plugin-button-text {
        color: #ff4d4f;
      }
    }
  }
  
  &-svg-icon {
    width: 24px;
    height: 24px;
  }
  
  &-img-icon {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
}

@media (max-width: 500px) {
  .liao-actions-plugin {
    &-container {
      &.liao-actions-plugin-layout-grid {
        grid-template-columns: repeat(auto-fill, minmax(90px, 1fr));
        
        &.liao-actions-plugin-columns-2 {
          grid-template-columns: repeat(2, 1fr);
        }
        &.liao-actions-plugin-columns-3 {
          grid-template-columns: repeat(2, 1fr); // 移动端最多2列
        }
        &.liao-actions-plugin-columns-4 {
          grid-template-columns: repeat(2, 1fr); // 移动端最多2列
        }
      }
    }
    
    &-button {
      &-grid {
        padding: $spacing-sm;
      }
      
      &-icon {
        width: 20px;
        height: 20px;
      }
      
      &-text {
        font-size: $font-size-xs;
      }
      
      &-desc {
        font-size: 10px;
      }
    }
  }
}
</style> 