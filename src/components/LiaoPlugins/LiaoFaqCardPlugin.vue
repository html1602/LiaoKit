<template>
  <div class="liao-faq-card-plugin">
    <div class="liao-faq-card-plugin-header">
      <h3 class="liao-faq-card-plugin-title">{{ title }}</h3>
      <div v-if="subtitle" class="liao-faq-card-plugin-subtitle">{{ subtitle }}</div>
    </div>
    
    <div class="liao-faq-card-plugin-content">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="liao-faq-card-plugin-item"
        :class="{ 'liao-faq-card-plugin-item-expanded': expandedIndex === index }"
      >
        <div 
          class="liao-faq-card-plugin-item-header" 
          @click="toggleItem(index)"
          :class="{ 'liao-faq-card-plugin-item-header-disabled': readonly }"
        >
          <div class="liao-faq-card-plugin-item-question">{{ item.question }}</div>
          <div class="liao-faq-card-plugin-item-icon">
            <button class="liao-faq-card-plugin-expand-btn" @click="toggleItem(index)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
          </div>
        </div>
        <div class="liao-faq-card-plugin-item-content">
          <div class="liao-faq-card-plugin-item-answer">{{ item.answer }}</div>
          <div v-if="item.actionText" class="liao-faq-card-plugin-item-action">
            <button 
              @click="handleAction(item, index)"
              :disabled="readonly || loading"
            >
              {{ item.actionText }}
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="footerText" class="liao-faq-card-plugin-footer">
      {{ footerText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { PropType } from 'vue';

// FAQ项目接口
interface FaqItem {
  question: string;
  answer: string;
  actionText?: string;
  actionData?: any;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      items?: FaqItem[];
      footerText?: string;
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

// 获取FAQ数据
const title = computed(() => props.pluginData.title || '常见问题');
const subtitle = computed(() => props.pluginData.subtitle || '');
const items = computed(() => props.pluginData.items || []);
const footerText = computed(() => props.pluginData.footerText || '');

// 展开状态
const expandedIndex = ref<number | null>(null);

// 切换展开/收起
const toggleItem = (index: number) => {
  if (props.readonly) return;
  
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
  }
  
  emit('action', {
    type: 'faq-toggle',
    data: {
      index,
      expanded: expandedIndex.value === index,
      item: items.value[index]
    }
  });
};

// 处理操作按钮点击
const handleAction = (item: FaqItem, index: number) => {
  emit('action', {
    type: 'faq-action',
    data: {
      item,
      index,
      actionData: item.actionData
    }
  });
};
</script>

<style lang="scss" scoped>


.liao-faq-card-plugin {
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
    font-weight: $font-weight-bold;
    color: $text-primary;
    margin: 0 0 $spacing-xs 0;
  }
  
  &-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
  }
  
  &-content {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color-card;
  }
  
  &-item {
    border-bottom: 1px solid $border-color-card;
    
    &:last-child {
      border-bottom: none;
    }
    
    &-header {
      padding: $spacing-md $spacing-lg;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      transition: background-color 0.2s;
      border-bottom: 1px solid rgba($primary-color, 0.1);
      
      &:hover {
        background-color: rgba($primary-color, 0.03);
      }
      
      &-disabled {
        cursor: default;
        
        &:hover {
          background-color: transparent;
        }
      }
    }
    
    &-question {
      font-weight: $font-weight-medium;
      color: $text-primary;
      flex: 1;
    }
    
    &-icon {
      transition: transform 0.3s;
      color: $text-secondary;
    }
    
    &-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease, padding 0.3s ease;
      padding: 0 $spacing-lg;
    }
    
    &-answer {
      color: $text-secondary;
      line-height: 1.5;
      margin-bottom: $spacing-md;
    }
    
    &-action {
      margin-bottom: $spacing-md;
      
      button {
        background-color: $bg-secondary;
        border: none;
        color: $primary-color;
        padding: $spacing-xs $spacing-md;
        border-radius: $border-radius-sm;
        cursor: pointer;
        font-size: $font-size-sm;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: rgba($primary-color, 0.1);
        }
        
        &:disabled {
          color: $text-disabled;
          background-color: $bg-secondary;
          cursor: not-allowed;
          
          &:hover {
            background-color: $bg-secondary;
          }
        }
      }
    }
    
    // 展开状态
    &-expanded {
      .liao-faq-card-plugin-item-icon {
        transform: rotate(180deg);
      }
      
      .liao-faq-card-plugin-item-content {
        max-height: 300px; // 足够大以适应内容
        padding: $spacing-md $spacing-lg;
      }
    }
  }
  
  &-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    font-size: $font-size-xs;
    color: $text-secondary;
    text-align: center;
  }
}
</style> 