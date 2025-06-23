<template>
  <div class="liao-timeline-plugin" :class="[`liao-timeline-plugin-${layout}`, `liao-timeline-plugin-${size}`]">
    <div v-if="title || subtitle" class="liao-timeline-plugin-header">
      <h3 v-if="title" class="liao-timeline-plugin-title">{{ title }}</h3>
      <p v-if="subtitle" class="liao-timeline-plugin-subtitle">{{ subtitle }}</p>
      <div v-if="description" class="liao-timeline-plugin-description">{{ description }}</div>
    </div>
    
    <div class="liao-timeline-plugin-content">
      <slot>
        <div class="liao-timeline-plugin-items">
          <div
            v-for="(item, index) in items"
            :key="item.id || index"
            class="liao-timeline-plugin-item"
            :class="{ 
              'liao-timeline-plugin-item-last': index === items.length - 1,
              [`liao-timeline-plugin-item-${item.status || 'default'}`]: true,
              'liao-timeline-plugin-item-pending': item.pending,
              'liao-timeline-plugin-item-highlighted': item.highlighted
            }"
          >
            <!-- 连接线 -->
            <div 
              class="liao-timeline-plugin-item-tail"
              :style="{ 
                borderLeftColor: item.lineColor || getStatusColor(item.status || 'default'),
                borderLeftStyle: item.lineStyle || 'solid'
              }"
            ></div>
            
            <!-- 节点图标/圆点 -->
            <div 
              class="liao-timeline-plugin-item-dot"
              :class="{ 
                'liao-timeline-plugin-item-dot-icon': item.icon,
                'liao-timeline-plugin-item-dot-plain': !item.icon
              }"
              :style="!item.icon ? { 
                backgroundColor: item.color || getStatusColor(item.status || 'default'),
                borderColor: item.color || getStatusColor(item.status || 'default')
              } : {}"
            >
              <LiaoIcon 
                v-if="item.icon" 
                :name="item.icon" 
                size="small" 
                :color="item.iconColor || (item.color || getStatusColor(item.status || 'default'))"
              />
            </div>
            
            <!-- 内容区域 -->
            <div class="liao-timeline-plugin-item-content">
              <div class="liao-timeline-plugin-item-header">
                <div class="liao-timeline-plugin-item-title-section">
                  <div class="liao-timeline-plugin-item-title">
                    {{ item.title }}
                  </div>
                  <span v-if="item.badge" class="liao-timeline-plugin-item-badge" :class="`liao-timeline-plugin-badge-${item.badge.type || 'default'}`">
                    {{ item.badge.text }}
                  </span>
                  <div v-if="item.subtitle" class="liao-timeline-plugin-item-subtitle">{{ item.subtitle }}</div>
                </div>
                <div class="liao-timeline-plugin-item-meta">
                  <div v-if="item.time" class="liao-timeline-plugin-item-time">{{ item.time }}</div>
                  <div v-if="item.duration" class="liao-timeline-plugin-item-duration">{{ item.duration }}</div>
                </div>
              </div>
              
              <!-- 内容描述 -->
              <div v-if="item.content" class="liao-timeline-plugin-item-body">
                <div v-if="typeof item.content === 'string'" v-html="formatContent(item.content)"></div>
                <div v-else>
                  <!-- 支持富文本内容 -->
                  <div v-for="(contentItem, contentIndex) in item.content" :key="contentIndex" class="liao-timeline-plugin-content-item">
                    <template v-if="contentItem.type === 'text'">{{ contentItem.value }}</template>
                    <template v-else-if="contentItem.type === 'link'">
                      <a :href="contentItem.url" target="_blank" rel="noopener noreferrer">{{ contentItem.text }}</a>
                    </template>
                    <template v-else-if="contentItem.type === 'tag'">
                      <span class="liao-timeline-plugin-tag" :class="`liao-timeline-plugin-tag-${contentItem.color || 'default'}`">
                        {{ contentItem.text }}
                      </span>
                    </template>
                  </div>
                </div>
              </div>
              
              <!-- 详细信息 -->
              <div v-if="item.details && item.details.length" class="liao-timeline-plugin-item-details">
                <div 
                  v-for="(detail, detailIndex) in item.details" 
                  :key="detailIndex" 
                  class="liao-timeline-plugin-detail-item"
                >
                  <span class="liao-timeline-plugin-detail-label">{{ detail.label }}:</span>
                  <span class="liao-timeline-plugin-detail-value">{{ detail.value }}</span>
                </div>
              </div>
              
              <!-- 进度条 -->
              <div v-if="item.progress !== undefined" class="liao-timeline-plugin-item-progress">
                <div class="liao-timeline-plugin-progress-bar">
                  <div 
                    class="liao-timeline-plugin-progress-fill" 
                    :style="{ 
                      width: `${item.progress}%`,
                      backgroundColor: item.progressColor || getStatusColor(item.status || 'primary')
                    }"
                  ></div>
                </div>
                <span class="liao-timeline-plugin-progress-text">{{ item.progress }}%</span>
              </div>
              
              <!-- 操作按钮 -->
              <div 
                v-if="item.actions && item.actions.length" 
                class="liao-timeline-plugin-item-actions"
              >
                <button
                  v-for="(action, actionIndex) in item.actions"
                  :key="actionIndex"
                  class="liao-timeline-plugin-item-action-btn"
                  :class="`liao-timeline-plugin-btn-${action.type || 'default'}`"
                  :disabled="readonly || action.disabled"
                  @click="handleAction(item, action, index)"
                >
                  <LiaoIcon v-if="action.icon" :name="action.icon" size="small" />
                  {{ action.text }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </slot>
    </div>
    
    <!-- 统计信息 -->
    <div v-if="showStats && stats" class="liao-timeline-plugin-stats">
      <div class="liao-timeline-plugin-stats-item" v-for="(stat, statIndex) in stats" :key="statIndex">
        <span class="liao-timeline-plugin-stats-label">{{ stat.label }}</span>
        <span class="liao-timeline-plugin-stats-value" :style="{ color: stat.color }">{{ stat.value }}</span>
      </div>
    </div>
    
    <div v-if="showMore" class="liao-timeline-plugin-footer">
      <slot name="footer">
        <button
          class="liao-timeline-plugin-more-btn"
          :disabled="loading || readonly"
          @click="handleLoadMore"
        >
          <span v-if="loading" class="liao-timeline-plugin-loading"></span>
          {{ loadMoreText }}
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

// 动作类型
interface TimelineAction {
  text: string;
  action: string;
  type?: 'default' | 'primary' | 'danger' | 'success';
  icon?: string;
  disabled?: boolean;
  extend?: Record<string, any>;
}

// 时间线项类型
interface TimelineItem {
  id?: string | number;
  title: string;
  subtitle?: string;
  time?: string;
  duration?: string;
  content?: string | Array<{
    type: 'text' | 'link' | 'tag';
    value?: string;
    text?: string;
    url?: string;
    color?: string;
  }>;
  status?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info' | 'processing';
  color?: string;
  lineColor?: string;
  lineStyle?: 'solid' | 'dashed' | 'dotted';
  icon?: string;
  iconColor?: string;
  badge?: {
    text: string;
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  };
  progress?: number;
  progressColor?: string;
  details?: Array<{
    label: string;
    value: string;
  }>;
  actions?: TimelineAction[];
  pending?: boolean;
  highlighted?: boolean;
  [key: string]: any;
}

// 统计信息类型
interface TimelineStats {
  label: string;
  value: string | number;
  color?: string;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      description?: string;
      items: TimelineItem[];
      layout?: 'vertical' | 'horizontal';
      size?: 'small' | 'default' | 'large';
      showMore?: boolean;
      loadMoreText?: string;
      showStats?: boolean;
      stats?: TimelineStats[];
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

// 获取时间线数据
const title = computed(() => props.pluginData.title || '');
const subtitle = computed(() => props.pluginData.subtitle || '');
const description = computed(() => props.pluginData.description || '');
const items = computed(() => props.pluginData.items || []);
const layout = computed(() => props.pluginData.layout || 'vertical');
const size = computed(() => props.pluginData.size || 'default');
const showMore = computed(() => props.pluginData.showMore || false);
const loadMoreText = computed(() => props.pluginData.loadMoreText || '加载更多');
const showStats = computed(() => props.pluginData.showStats || false);
const stats = computed(() => props.pluginData.stats || []);

// 获取状态对应的颜色
const getStatusColor = (status: string) => {
  const colors = {
    default: '#d9d9d9',
    primary: 'var(--primary-color, #1890ff)',
    success: 'var(--success-color, #52c41a)',
    warning: 'var(--warning-color, #faad14)',
    error: 'var(--danger-color, #ff4d4f)',
    info: 'var(--info-color, #13c2c2)',
    processing: 'var(--processing-color, #722ed1)'
  };
  return colors[status as keyof typeof colors] || colors.default;
};

// 格式化内容（支持简单的HTML）
const formatContent = (content: string) => {
  return content.replace(/\n/g, '<br>');
};

// 处理操作按钮点击
const handleAction = (item: TimelineItem, action: TimelineAction, index: number) => {
  emit('action', {
    type: 'timeline-action',
    data: {
      action: action.action,
      actionText: action.text,
      item,
      index,
      extend: action.extend || null
    }
  });
};

// 处理加载更多
const handleLoadMore = () => {
  emit('action', {
    type: 'timeline-load-more'
  });
};
</script>

<style lang="scss" scoped>
.liao-timeline-plugin {
  width: 100%;
  border-radius: $border-radius-md;
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  text-align: left !important;
  
  * {
    text-align: left !important;
  }
  
  @media (max-width: 768px) {
    text-align: left !important;
    
    * {
      text-align: left !important;
    }
  }
  
  &-header {
    padding: $spacing-lg;
    border-bottom: 1px solid $border-color-card;
    background-color: $bg-secondary;
    text-align: left !important;
  }
  
  &-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin: 0 0 $spacing-xs;
    text-align: left !important;
  }
  
  &-subtitle {
    font-size: $font-size-md;
    color: $text-secondary;
    margin: 0 0 $spacing-sm;
    text-align: left !important;
  }
  
  &-description {
    font-size: $font-size-sm;
    color: $text-disabled;
    margin: 4px 0 0 0;
    text-align: left !important;
  }
  
  &-content {
    padding: $spacing-lg;
    text-align: left !important;
    
    @media (max-width: 768px) {
      padding: $spacing-md;
      text-align: left !important;
    }
  }
  
  &-items {
    padding: $spacing-md 0;
    text-align: left !important;
    
    @media (max-width: 768px) {
      padding: $spacing-sm 0;
      text-align: left !important;
    }
  }
  
  &-small {
    .liao-timeline-plugin-header {
      padding: $spacing-md;
      
      @media (max-width: 768px) {
        padding: $spacing-sm;
      }
    }
    .liao-timeline-plugin-content {
      padding: $spacing-lg;
      
      @media (max-width: 768px) {
        padding: $spacing-sm;
      }
    }
    .liao-timeline-plugin-item {
      padding: 0 0 $spacing-md 0;
      
      @media (max-width: 768px) {
        padding: 0 0 $spacing-sm 0;
      }
      
      &-tail {
        top: 20px;
        height: calc(100% - 16px);
        
        @media (max-width: 768px) {
          top: 16px;
          height: calc(100% - 24px);
        }
      }
      
      &-dot {
        width: 12px;
        height: 12px;
        
        @media (max-width: 768px) {
          width: 10px;
          height: 10px;
        }
        
        &-icon {
          width: 18px;
          height: 18px;
          left: -3px;
          top: 3px;
          
          @media (max-width: 768px) {
            width: 16px;
            height: 16px;
            left: -3px;
            top: 2px;
          }
        }
      }
      
      &-content {
        margin-left: $spacing-lg;
        
        @media (max-width: 768px) {
          margin-left: $spacing-md;
          width: calc(100% - #{$spacing-md});
        }
      }
    }
  }
  
  &-large {
    .liao-timeline-plugin-header {
      padding: $spacing-xl;
      
      @media (max-width: 768px) {
        padding: $spacing-lg;
      }
    }
    .liao-timeline-plugin-content {
      padding: $spacing-xl;
      
      @media (max-width: 768px) {
        padding: $spacing-lg;
      }
    }
    .liao-timeline-plugin-item {
      padding: 0 0 calc($spacing-xl + $spacing-md) 0;
      
      @media (max-width: 768px) {
        padding: 0 0 $spacing-lg 0;
      }
      
      &-tail {
        top: 28px;
        height: calc(100% - 38px);
        
        @media (max-width: 768px) {
          top: 22px;
          height: calc(100% - 32px);
        }
      }
      
      &-dot {
        width: 20px;
        height: 20px;
        
        @media (max-width: 768px) {
          width: 16px;
          height: 16px;
        }
        
        &-icon {
          width: 28px;
          height: 28px;
          left: -4px;
          top: -1px;
          
          @media (max-width: 768px) {
            width: 24px;
            height: 24px;
            left: -4px;
            top: -1px;
          }
        }
      }
      
      &-content {
        margin-left: calc($spacing-xl + $spacing-md);
        
        @media (max-width: 768px) {
          margin-left: $spacing-lg;
        }
      }
    }
  }
  
  &-item {
    position: relative;
    margin: 0;
    padding: 0 0 $spacing-xl 0;
    
    @media (max-width: 768px) {
      padding: 0 0 $spacing-lg 0;
    }
    
    &-last {
      .liao-timeline-plugin-item-tail {
        display: none;
      }
    }
    
    &-highlighted {
      .liao-timeline-plugin-item-content {
        background-color: rgba($primary-color, 0.05);
        border-radius: $border-radius-sm;
        padding: $spacing-md;
        
        @media (max-width: 768px) {
          padding: $spacing-sm;
        }
      }
    }
    
    &-pending {
      opacity: 0.6;
      
      .liao-timeline-plugin-item-dot {
        border-style: dashed;
      }
    }
    
    &-tail {
      position: absolute;
      left: 5px;
      top: 24px;
      height: calc(100% - 21px);
      border-left: 2px solid $border-color;
      
      @media (max-width: 768px) {
        left: 6px;
        top: 20px;
        height: calc(100% - 30px);
        border-left-width: 1px;
      }
    }
    
    &-dot {
      position: absolute;
      width: 16px;
      height: 16px;
      left: 0;
      top: 6px;
      border-radius: 50%;
      border: 2px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $bg-primary;
      
      @media (max-width: 768px) {
        width: 14px;
        height: 14px;
        top: 4px;
        border-width: 1px;
      }
      
      &-icon {
        width: 24px;
        height: 24px;
        left: -4px;
        top: 2px;
        background: none !important;
        border: none !important;
        
        @media (max-width: 768px) {
          width: 20px;
          height: 20px;
          left: -3px;
          top: 1px;
        }
      }
      
      &-plain {
        background-color: $bg-primary;
        border-color: $border-color;
      }
    }
    
    &-content {
      position: relative;
      margin-left: $spacing-xl;
      padding-top: 0;
      
      @media (max-width: 768px) {
        margin-left: $spacing-lg;
        width: calc(100% - #{$spacing-lg});
        box-sizing: border-box;
      }
    }
    
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: $spacing-xs;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: $spacing-xs;
        margin-bottom: $spacing-sm;
        width: 100%;
      }
    }
    
    &-title-section {
      flex: 1;
      
      @media (max-width: 768px) {
        width: 100%;
        order: 1;
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
      }
    }
    
    &-title {
      font-weight: $font-weight-medium;
      font-size: $font-size-md;
      color: $text-primary;
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      
      @media (max-width: 768px) {
        font-size: $font-size-sm;
        width: 100%;
        margin-bottom: 0;
      }
    }
    
    &-subtitle {
      font-size: $font-size-sm;
      color: $text-secondary;
      margin-top: $spacing-xs;
      
      @media (max-width: 768px) {
        font-size: $font-size-xs;
        text-align: left !important;
        width: 100%;
        margin-top: 0;
      }
    }
    
    &-meta {
      text-align: right;
      
      @media (max-width: 768px) {
        order: 2;
        text-align: left;
        width: 100%;
        margin-top: $spacing-xs;
        padding-top: $spacing-xs;
        border-top: 1px solid rgba($border-color, 0.3);
      }
    }
    
    &-time {
      font-size: $font-size-xs;
      color: $text-disabled;
      margin-bottom: 4px;
      
      @media (max-width: 768px) {
        font-size: 10px;
        margin-bottom: 2px;
      }
    }
    
    &-duration {
      font-size: $font-size-xs;
      color: $text-secondary;
      margin-top: 2px;
      
      @media (max-width: 768px) {
        font-size: 10px;
        margin-top: 1px;
      }
    }
    
    &-body {
      margin: $spacing-xs 0 $spacing-md;
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.5;
      text-align: left !important;
      
      @media (max-width: 768px) {
        font-size: $font-size-xs;
        margin: $spacing-xs 0 $spacing-sm;
        line-height: 1.4;
        text-align: left !important;
        width: 100%;
      }
      
      *,
      div,
      span,
      p,
      text {
        text-align: left !important;
      }
      
      .liao-timeline-plugin-content-item {
        text-align: left !important;
        display: inline-block;
        
        @media (max-width: 768px) {
          text-align: left !important;
          width: 100%;
        }
      }
      
      > div {
        text-align: left !important;
        
        * {
          text-align: left !important;
        }
      }
    }
    
    &-details {
      margin: $spacing-sm 0;
      padding: $spacing-sm;
      background-color: $bg-secondary;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      
      @media (max-width: 768px) {
        margin: $spacing-xs 0;
        padding: $spacing-xs;
        font-size: $font-size-xs;
        width: 100%;
        box-sizing: border-box;
      }
    }
    
    &-progress {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
      margin: $spacing-sm 0;
      
      @media (max-width: 768px) {
        gap: $spacing-xs;
        margin: $spacing-xs 0;
      }
    }
    
    &-actions {
      display: flex;
      flex-wrap: wrap;
      gap: $spacing-sm;
      margin-top: $spacing-md;
      
      @media (max-width: 768px) {
        gap: $spacing-xs;
        margin-top: $spacing-sm;
      }
    }
    
    &-action-btn {
      padding: $spacing-xs $spacing-md;
      background-color: $bg-secondary;
      border: none;
      border-radius: $border-radius-sm;
      color: $primary-color;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: all $transition-duration;
      display: flex;
      align-items: center;
      gap: $spacing-xs;
      
      @media (max-width: 768px) {
        padding: $spacing-xs $spacing-sm;
        font-size: $font-size-xs;
        gap: 2px;
      }
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
      
      &:disabled {
        color: $text-disabled;
        background-color: $bg-secondary;
        cursor: not-allowed;
      }
      
      &.liao-timeline-plugin-btn-primary {
        background-color: $primary-color;
        color: white;
        
        &:hover {
          background-color: color.adjust($primary-color, $lightness: -10%);
        }
      }
      
      &.liao-timeline-plugin-btn-danger {
        background-color: $danger-color;
        color: white;
        
        &:hover {
          background-color: color.adjust($danger-color, $lightness: -10%);
        }
      }
      
      &.liao-timeline-plugin-btn-success {
        background-color: $success-color;
        color: white;
        
        &:hover {
          background-color: color.adjust($success-color, $lightness: -10%);
        }
      }
    }
  }
  
  &-item-badge {
    font-size: $font-size-xs;
    padding: 2px 6px;
    border-radius: $border-radius-xs;
    font-weight: normal;
    display: inline-block;
    
    @media (max-width: 768px) {
      font-size: 10px;
      padding: 1px 4px;
      margin-top: 0;
      display: inline-block;
      width: fit-content;
      align-self: flex-start;
    }
    
    &.liao-timeline-plugin-badge-default {
      background-color: $bg-secondary;
      color: $text-secondary;
    }
    
    &.liao-timeline-plugin-badge-primary {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }
    
    &.liao-timeline-plugin-badge-success {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }
    
    &.liao-timeline-plugin-badge-warning {
      background-color: rgba($warning-color, 0.1);
      color: $warning-color;
    }
    
    &.liao-timeline-plugin-badge-error {
      background-color: rgba($danger-color, 0.1);
      color: $danger-color;
    }
  }
  
  &-tag {
    display: inline-block;
    padding: 2px 6px;
    border-radius: $border-radius-xs;
    font-size: $font-size-xs;
    margin: 0 4px;
    
    &-default {
      background-color: $bg-secondary;
      color: $text-secondary;
    }
    
    &-primary {
      background-color: rgba($primary-color, 0.1);
      color: $primary-color;
    }
    
    &-success {
      background-color: rgba($success-color, 0.1);
      color: $success-color;
    }
  }
  
  &-detail-item {
    display: flex;
    margin-bottom: 4px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  &-detail-label {
    color: $text-disabled;
    margin-right: $spacing-sm;
    min-width: 60px;
  }
  
  &-detail-value {
    color: $text-disabled;
    font-size: $font-size-sm;
    margin-left: 8px;
    flex: 1;
  }
  
  &-progress-bar {
    flex: 1;
    height: 4px;
    background-color: $bg-secondary;
    border-radius: 2px;
    overflow: hidden;
  }
  
  &-progress-fill {
    height: 100%;
    transition: width $transition-duration;
  }
  
  &-progress-text {
    font-size: $font-size-xs;
    color: $text-secondary;
    min-width: 35px;
    text-align: right;
  }
  
  &-content-item {
    display: inline;
    
    a {
      color: $primary-color;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
  
  &-stats {
    display: flex;
    justify-content: space-around;
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    
    &-item {
      text-align: center;
    }
    
    &-label {
      display: block;
      font-size: $font-size-xs;
      color: $text-disabled;
      margin-bottom: 2px;
    }
    
    &-value {
      font-size: $font-size-md;
      font-weight: $font-weight-medium;
      color: $text-primary;
    }
  }
  
  &-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    display: flex;
    justify-content: center;
  }
  
  &-more-btn {
    background: none;
    border: none;
    color: $primary-color;
    font-size: $font-size-md;
    cursor: pointer;
    display: flex;
    align-items: center;
    transition: opacity $transition-duration;
    
    &:hover {
      opacity: 0.8;
    }
    
    &:disabled {
      color: $text-disabled;
      cursor: not-allowed;
    }
  }
  
  &-loading {
    width: 14px;
    height: 14px;
    border: 2px solid rgba($primary-color, 0.3);
    border-radius: 50%;
    border-top-color: $primary-color;
    animation: liao-timeline-plugin-spin 1s infinite linear;
    margin-right: $spacing-sm;
  }
}

@keyframes liao-timeline-plugin-spin {
  to { transform: rotate(360deg); }
}
</style> 