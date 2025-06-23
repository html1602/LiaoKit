<template>
  <div class="liao-info-plugin" :class="[`liao-info-plugin-${theme}`, statusColor && `liao-info-plugin-status-${statusColor}`]">
    <!-- 头部 -->
    <div class="liao-info-plugin-header">
      <div class="liao-info-plugin-header-icon" v-if="icon">
        <svg v-if="icon.startsWith('<svg')" v-html="icon.replace(/<svg/, '<svg class=\'liao-info-plugin-svg-icon\'')"></svg>
        <img v-else :src="icon" alt="图标" class="liao-info-plugin-img-icon" />
      </div>
      <div class="liao-info-plugin-header-content">
        <h3 class="liao-info-plugin-title">{{ title }}</h3>
        <p v-if="subtitle" class="liao-info-plugin-subtitle">{{ subtitle }}</p>
      </div>
    </div>
    
    <div class="liao-info-plugin-content">
      <slot>
        <!-- 纯文本内容 -->
        <p v-if="!items && !sections && content" class="liao-info-plugin-text">{{ content }}</p>
        
        <!-- 简单列表内容（向后兼容） -->
        <div v-if="items && items.length && !sections" class="liao-info-plugin-items">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="liao-info-plugin-item"
          >
            <div class="liao-info-plugin-item-label">{{ item.label }}:</div>
            <div class="liao-info-plugin-item-value">{{ item.value }}</div>
          </div>
        </div>
        
        <!-- 分组内容（新功能） -->
        <div v-if="sections && sections.length" class="liao-info-plugin-sections">
          <div
            v-for="(section, sectionIndex) in sections"
            :key="sectionIndex"
            class="liao-info-plugin-section"
          >
            <!-- 分组标题 -->
            <div class="liao-info-plugin-section-header">
              <div class="liao-info-plugin-section-icon" v-if="section.icon">
                <LiaoIcon :name="section.icon" size="small" />
              </div>
              <h4 class="liao-info-plugin-section-title">{{ section.title }}</h4>
            </div>
            
            <!-- 分组内容 -->
            <div class="liao-info-plugin-section-content">
              <div
                v-for="(item, itemIndex) in section.items"
                :key="itemIndex"
                class="liao-info-plugin-item"
                :class="{
                  'liao-info-plugin-item-highlight': item.highlight,
                  [`liao-info-plugin-item-type-${item.type}`]: item.type
                }"
              >
                <div class="liao-info-plugin-item-label">{{ item.label }}:</div>
                <div class="liao-info-plugin-item-value-wrapper">
                  <div class="liao-info-plugin-item-value" :class="{ 'privacy-text': item.privacy }">
                    {{ item.value }}
                  </div>
                  
                  <!-- 徽章 -->
                  <span v-if="item.badge" class="liao-info-plugin-item-badge" :class="`badge-${item.badge}`">
                    {{ getBadgeText(item.badge) }}
                  </span>
                  
                  <!-- 复制按钮 -->
                  <button 
                    v-if="item.copy" 
                    class="liao-info-plugin-copy-btn"
                    @click="copyToClipboard(item.value)"
                    title="复制"
                  >
                    <LiaoIcon name="copy" size="small" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    
    <!-- 底部操作区 -->
    <div v-if="showFooter" class="liao-info-plugin-footer">
      <slot name="footer">
        <div v-if="footerText" class="liao-info-plugin-footer-text">{{ footerText }}</div>
        
        <!-- 简单按钮（向后兼容） -->
        <button
          v-if="buttonText && !actions"
          class="liao-info-plugin-button"
          :disabled="readonly"
          @click="handleAction"
        >
          {{ buttonText }}
        </button>
        
        <!-- 操作按钮组（新功能） -->
        <div v-if="actions && actions.length" class="liao-info-plugin-actions">
          <button
            v-for="(action, index) in actions"
            :key="index"
            class="liao-info-plugin-action-btn"
            :class="[`btn-${action.type || 'default'}`]"
            :disabled="readonly"
            @click="handleActionClick(action)"
          >
            <LiaoIcon v-if="action.icon" :name="action.icon" size="small" />
            {{ action.text }}
          </button>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

// 信息项接口（向后兼容）
interface InfoItem {
  label: string;
  value: string;
}

// 增强的信息项接口
interface EnhancedInfoItem {
  label: string;
  value: string;
  highlight?: boolean;
  type?: 'price' | 'total' | 'discount' | 'free' | 'urgent' | 'address' | 'final_price';
  badge?: 'verified' | 'fast';
  copy?: boolean;
  privacy?: boolean;
}

// 分组接口
interface InfoSection {
  title: string;
  icon?: string;
  items: EnhancedInfoItem[];
}

// 操作按钮接口
interface InfoAction {
  id: string;
  text: string;
  type?: 'primary' | 'default' | 'danger';
  icon?: string;
  extend?: Record<string, any>; // 新增：支持自定义扩展数据
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title: string;
      subtitle?: string;
      content?: string;
      items?: InfoItem[];
      sections?: InfoSection[];
      actions?: InfoAction[];
      icon?: string;
      theme?: 'default' | 'info' | 'warning' | 'success' | 'error';
      statusColor?: 'success' | 'warning' | 'error';
      footerText?: string;
      buttonText?: string;
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

// 获取卡片数据
const title = computed(() => props.pluginData.title || '信息');
const subtitle = computed(() => props.pluginData.subtitle || '');
const content = computed(() => props.pluginData.content || '');
const items = computed(() => props.pluginData.items || []);
const sections = computed(() => props.pluginData.sections || []);
const actions = computed(() => props.pluginData.actions || []);
const icon = computed(() => props.pluginData.icon || '');
const theme = computed(() => props.pluginData.theme || 'default');
const statusColor = computed(() => props.pluginData.statusColor || '');
const footerText = computed(() => props.pluginData.footerText || '');
const buttonText = computed(() => props.pluginData.buttonText || '');

// 是否显示底部
const showFooter = computed(() => {
  return footerText.value || buttonText.value || (actions.value && actions.value.length > 0);
});

// 获取徽章文本
const getBadgeText = (badge: string) => {
  const badgeMap: Record<string, string> = {
    verified: '已验证',
    fast: '快速'
  };
  return badgeMap[badge] || badge;
};

// 复制到剪贴板
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // 可以在这里添加提示，如Toast等
    console.log('已复制到剪贴板:', text);
  } catch (err) {
    console.error('复制失败:', err);
    // 降级方案
    fallbackCopyTextToClipboard(text);
  }
};

// 降级复制方案
const fallbackCopyTextToClipboard = (text: string) => {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    document.execCommand('copy');
    console.log('已复制到剪贴板:', text);
  } catch (err) {
    console.error('降级复制也失败:', err);
  }

  document.body.removeChild(textArea);
};

// 处理简单按钮点击（向后兼容）
const handleAction = () => {
  emit('action', {
    type: 'info-action',
    data: {
      title: title.value,
      buttonText: buttonText.value
    }
  });
};

// 处理操作按钮点击
const handleActionClick = (action: InfoAction) => {
  emit('action', {
    type: 'info-action',
    data: {
      actionId: action.id,
      actionText: action.text,
      actionType: action.type,
      title: title.value,
      extend: action.extend || null // 新增：传递扩展数据
    }
  });
};
</script>

<style lang="scss" scoped>
.liao-info-plugin {
  width: 100%;
  border-radius: $border-radius-md;
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  
  &-default {
    border-left: 4px solid $primary-color;
  }
  
  &-info {
    border-left: 4px solid $info-color;
  }
  
  &-success {
    border-left: 4px solid $success-color;
  }
  
  &-warning {
    border-left: 4px solid $warning-color;
  }
  
  &-error {
    border-left: 4px solid $danger-color;
  }
  
  // 状态颜色样式
  &-status-success {
    border-top: 3px solid $success-color;
  }
  
  &-status-warning {
    border-top: 3px solid $warning-color;
  }
  
  &-status-error {
    border-top: 3px solid $danger-color;
  }
  
  &-header {
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color-card;
    background-color: $bg-secondary;
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    
    &-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }
    
    &-content {
      flex: 1;
    }
  }
  
  &-svg-icon {
    width: 20px;
    height: 20px;
  }
  
  &-img-icon {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin: 0;
  }
  
  &-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: $spacing-xs 0 0 0;
    line-height: 1.4;
  }
  
  &-content {
    padding: $spacing-lg;
  }
  
  &-text {
    margin: 0;
    line-height: 1.5;
    color: $text-primary;
  }
  
  // 简单列表样式（向后兼容）
  &-items {
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;
  }
  
  // 分组样式
  &-sections {
    display: flex;
    flex-direction: column;
    gap: $spacing-lg;
  }
  
  &-section {
    &:not(:last-child) {
      border-bottom: 1px solid $border-color-card;
      padding-bottom: $spacing-lg;
    }
    
    &-header {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin-bottom: $spacing-md;
    }
    
    &-icon {
      color: $text-primary; // 修改：让图标颜色与文字颜色一致
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &-title {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $text-primary;
      margin: 0;
    }
    
    &-content {
      display: flex;
      flex-direction: column;
      gap: $spacing-sm;
    }
  }
  
  &-item {
    display: flex;
    align-items: flex-start;
    gap: $spacing-md;
    padding: $spacing-xs 0;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    // 高亮样式
    &-highlight {
      background-color: rgba($primary-color, 0.05);
      padding: $spacing-sm;
      border-radius: $border-radius-sm;
      border-left: 3px solid $primary-color;
    }
    
    // 不同类型的样式
    &-type-price {
      .liao-info-plugin-item-value {
        color: $success-color;
        font-weight: $font-weight-medium;
      }
    }
    
    &-type-total, &-type-final_price {
      .liao-info-plugin-item-value {
        color: $danger-color;
        font-weight: $font-weight-bold;
        font-size: $font-size-lg;
      }
    }
    
    &-type-discount {
      .liao-info-plugin-item-value {
        color: $success-color;
      }
    }
    
    &-type-free {
      .liao-info-plugin-item-value {
        color: $success-color;
        font-weight: $font-weight-medium;
      }
    }
    
    &-type-urgent {
      .liao-info-plugin-item-value {
        color: $danger-color;
        font-weight: $font-weight-medium;
      }
    }
    
    &-type-address {
      .liao-info-plugin-item-value {
        line-height: 1.4;
      }
    }
    
    &-label {
      font-weight: $font-weight-medium;
      color: $text-primary;
      width: 120px;
      flex-shrink: 0;
      padding-top: 2px;
    }
    
    &-value-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      flex-wrap: wrap;
    }
    
    &-value {
      flex: 1;
      color: $text-secondary;
      word-break: break-word;
      
      &.privacy-text {
        font-family: monospace;
        letter-spacing: 1px;
      }
    }
    
    &-badge {
      padding: 2px 8px;
      border-radius: 12px;
      font-size: $font-size-xs;
      font-weight: $font-weight-medium;
      white-space: nowrap;
      
      &.badge-verified {
        background-color: rgba($success-color, 0.1);
        color: $success-color;
      }
      
      &.badge-fast {
        background-color: rgba($primary-color, 0.1);
        color: $primary-color;
      }
    }
  }
  
  &-copy-btn {
    padding: 4px;
    background: none;
    border: 1px solid $border-color-card;
    border-radius: $border-radius-sm;
    cursor: pointer;
    color: $text-secondary;
    transition: all $transition-duration;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    
    &:hover {
      background-color: rgba($primary-color, 0.1);
      border-color: $primary-color;
      color: $primary-color;
    }
  }
  
  &-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: $spacing-md;
    flex-wrap: wrap;
  }
  
  &-footer-text {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
  
  &-button {
    padding: $spacing-xs $spacing-lg;
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: background-color $transition-duration;
    
    &:hover {
      background-color: color.adjust($primary-color, $lightness: -5%);
    }
    
    &:disabled {
      background-color: $text-disabled;
      cursor: not-allowed;
    }
  }
  
  &-actions {
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }
  
  &-action-btn {
    padding: $spacing-xs $spacing-md;
    border: 1px solid $border-color-card;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-duration;
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    
    &.btn-primary {
      background-color: $primary-color;
      color: white;
      border-color: $primary-color;
      
      &:hover {
        background-color: color.adjust($primary-color, $lightness: -5%);
      }
    }
    
    &.btn-default {
      background-color: $bg-primary;
      color: $primary-color;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
        border-color: $primary-color;
      }
    }
    
    &.btn-danger {
      background-color: $bg-primary;
      color: $danger-color;
      border-color: $danger-color;
      
      &:hover {
        background-color: rgba($danger-color, 0.1);
      }
    }
    
    &:disabled {
      color: $text-disabled;
      background-color: $bg-secondary;
      border-color: $border-color-card;
      cursor: not-allowed;
    }
  }
}

// 响应式调整
@media (max-width: 480px) {
  .liao-info-plugin {
    &-item {
      flex-direction: column;
      gap: $spacing-xs;
      
      &-label {
        width: 100%;
      }
      
      &-value-wrapper {
        width: 100%;
      }
    }
    
    &-actions {
      width: 100%;
      
      .liao-info-plugin-action-btn {
        flex: 1;
        justify-content: center;
      }
    }
    
    &-footer {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style> 