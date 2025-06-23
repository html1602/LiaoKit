<template>
  <div class="liao-list-plugin">
    <div v-if="title" class="liao-list-plugin-header">
      <h3 class="liao-list-plugin-title">{{ title }}</h3>
      <p v-if="subtitle" class="liao-list-plugin-subtitle">{{ subtitle }}</p>
    </div>
    
    <!-- 搜索区域 -->
    <div v-if="enableSearch && !readonly" class="liao-list-plugin-search">
      <div class="liao-list-plugin-search-wrapper">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchKeyword"
          type="text"
          :placeholder="searchPlaceholder"
          class="liao-list-plugin-search-input"
          @input="handleSearch"
        />
        <button v-if="searchKeyword" class="liao-list-plugin-search-clear" @click="clearSearch">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
      
      <!-- 搜索统计 -->
      <div v-if="searchKeyword" class="liao-list-plugin-search-stats">
        找到 {{ filteredItems.length }} / {{ originalItems.length }} 项结果
      </div>
    </div>
    
    <div class="liao-list-plugin-content">
      <!-- 搜索无结果状态 -->
      <div v-if="enableSearch && searchKeyword && filteredItems.length === 0" class="liao-list-plugin-no-results">
        <div class="no-results-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
            <line x1="11" y1="8" x2="11" y2="14"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <div class="no-results-text">未找到匹配"{{ searchKeyword }}"的结果</div>
        <button class="no-results-clear" @click="clearSearch">清空搜索</button>
      </div>
      
      <!-- 列表项 -->
      <slot v-else>
        <div
          v-for="(item, index) in displayItems"
          :key="item.id || index"
          class="liao-list-plugin-item"
          @click="handleItemClick(item, getOriginalIndex(item))"
        >
          <div class="liao-list-plugin-item-content">
            <!-- 图片/图标 -->
            <div v-if="item.image || item.icon" class="liao-list-plugin-item-icon">
              <img 
                v-if="item.image" 
                :src="item.image" 
                :alt="item.title || item.label" 
                class="liao-list-plugin-img-icon" 
              />
              <svg 
                v-else-if="item.icon && item.icon.startsWith('<svg')" 
                v-html="item.icon.replace(/<svg/, '<svg class=\'liao-list-plugin-svg-icon\'')"
              ></svg>
              <img 
                v-else-if="item.icon"
                :src="item.icon" 
                alt="图标" 
                class="liao-list-plugin-img-icon" 
              />
            </div>
            
            <div class="liao-list-plugin-item-text">
              <!-- 标题行：标题 + 徽章 -->
              <div class="liao-list-plugin-item-header">
                <div class="liao-list-plugin-item-title" v-html="highlightSearchText(item.title || item.label)"></div>
                <div v-if="item.badge" class="liao-list-plugin-item-badge" :class="`badge-${item.badge}`">
                  {{ getBadgeText(item.badge) }}
                </div>
              </div>
              
              <!-- 描述 -->
              <div v-if="item.description || item.desc" class="liao-list-plugin-item-desc" v-html="highlightSearchText(item.description || item.desc)"></div>
              
              <!-- 价格和状态行 -->
              <div class="liao-list-plugin-item-meta">
                <div v-if="item.price" class="liao-list-plugin-item-price" v-html="highlightSearchText(item.price)"></div>
                <div v-if="item.status" class="liao-list-plugin-item-status" v-html="highlightSearchText(item.status)"></div>
                <div v-if="item.time" class="liao-list-plugin-item-time" v-html="highlightSearchText(item.time)"></div>
              </div>
            </div>
          </div>
          
          <!-- 操作按钮 -->
          <div v-if="item.actions && item.actions.length" class="liao-list-plugin-item-actions">
            <button
              v-for="(action, actionIndex) in item.actions"
              :key="actionIndex"
              class="liao-list-plugin-item-action-btn"
              :class="`btn-${action.type || 'default'}`"
              :disabled="readonly"
              @click.stop="handleAction(item, action, getOriginalIndex(item))"
            >
              {{ action.text }}
            </button>
          </div>
        </div>
      </slot>
    </div>
    
    <!-- 底部操作区 -->
    <div v-if="actions && actions.length" class="liao-list-plugin-footer">
      <button
        v-for="(action, index) in actions"
        :key="index"
        class="liao-list-plugin-footer-btn"
        :class="`btn-${action.type || 'default'}`"
        :disabled="readonly"
        @click="handleAction(null, action, -1)"
      >
        {{ action.text }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';

// 列表项动作类型
interface ItemAction {
  text: string;
  id?: string;
  action?: string; // 兼容旧版本
  type?: 'primary' | 'default' | 'danger' | 'success' | 'warning';
  extend?: Record<string, any>; // 新增：支持自定义扩展数据
}

// 列表项类型
interface ListItem {
  id?: string;
  title?: string;
  label?: string; // 兼容旧版本
  description?: string;
  desc?: string; // 兼容旧版本
  price?: string;
  status?: string;
  time?: string;
  image?: string;
  icon?: string;
  badge?: 'hot' | 'new' | 'urgent' | 'sale';
  actions?: ItemAction[];
  [key: string]: any;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      subtitle?: string;
      items: ListItem[];
      actions?: ItemAction[];
      showImages?: boolean;
      showBadges?: boolean;
      // 搜索相关配置
      enableSearch?: boolean;
      searchPlaceholder?: string;
      searchFields?: string[]; // 指定搜索的字段，为空则搜索所有字段
      searchCaseSensitive?: boolean; // 是否区分大小写
      searchHighlight?: boolean; // 是否高亮搜索结果
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
const emit = defineEmits(['action', 'search']);

// 搜索相关状态
const searchKeyword = ref('');

// 获取列表数据
const title = computed(() => props.pluginData.title || '');
const subtitle = computed(() => props.pluginData.subtitle || '');
const originalItems = computed(() => props.pluginData.items || []);
const actions = computed(() => props.pluginData.actions || []);

// 搜索配置
const enableSearch = computed(() => props.pluginData.enableSearch !== false); // 默认启用搜索
const searchPlaceholder = computed(() => props.pluginData.searchPlaceholder || '搜索...');
const searchFields = computed(() => props.pluginData.searchFields || []);
const searchCaseSensitive = computed(() => props.pluginData.searchCaseSensitive || false);
const searchHighlight = computed(() => props.pluginData.searchHighlight !== false); // 默认启用高亮

// 过滤后的列表项
const filteredItems = computed(() => {
  if (!searchKeyword.value.trim()) {
    return originalItems.value;
  }

  const keyword = searchCaseSensitive.value ? searchKeyword.value : searchKeyword.value.toLowerCase();
  
  return originalItems.value.filter(item => {
    // 如果指定了搜索字段，只在这些字段中搜索
    if (searchFields.value.length > 0) {
      return searchFields.value.some(field => {
        const fieldValue = item[field];
        if (fieldValue == null) return false;
        const searchValue = searchCaseSensitive.value ? String(fieldValue) : String(fieldValue).toLowerCase();
        return searchValue.includes(keyword);
      });
    }

    // 否则在所有字符串字段中搜索
    return Object.values(item).some(value => {
      if (value == null || typeof value === 'object') return false;
      const searchValue = searchCaseSensitive.value ? String(value) : String(value).toLowerCase();
      return searchValue.includes(keyword);
    });
  });
});

// 显示的列表项（用于支持未来可能的分页等功能）
const displayItems = computed(() => filteredItems.value);

// 监听搜索关键词变化，触发搜索事件
watch(searchKeyword, (newKeyword) => {
  emit('search', {
    type: 'list-search',
    data: {
      keyword: newKeyword,
      results: filteredItems.value,
      total: originalItems.value.length,
      filteredCount: filteredItems.value.length
    }
  });
});

// 获取原始索引（用于事件回调）
const getOriginalIndex = (item: ListItem) => {
  return originalItems.value.findIndex(original => 
    (item.id && original.id === item.id) || original === item
  );
};

// 高亮搜索文本
const highlightSearchText = (text: string | undefined) => {
  if (!text || !searchKeyword.value.trim() || !searchHighlight.value) {
    return text || '';
  }

  const keyword = searchKeyword.value.trim();
  const flags = searchCaseSensitive.value ? 'g' : 'gi';
  const regex = new RegExp(`(${escapeRegExp(keyword)})`, flags);
  
  return String(text).replace(regex, '<mark class="search-highlight">$1</mark>');
};

// 转义正则表达式特殊字符
const escapeRegExp = (string: string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 处理搜索输入
const handleSearch = () => {
  // 这里可以添加防抖逻辑，但目前保持实时搜索
};

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = '';
};

// 获取徽章文本
const getBadgeText = (badge: string) => {
  const badgeMap = {
    hot: '热门',
    new: '新品',
    urgent: '紧急',
    sale: '促销'
  };
  return badgeMap[badge as keyof typeof badgeMap] || badge;
};

// 处理操作按钮点击
const handleAction = (item: ListItem | null, action: ItemAction, index: number) => {
  emit('action', {
    type: 'list-action',
    data: {
      action: action.id || action.action || action.text,
      actionText: action.text,
      item,
      index,
      originalIndex: index, // 如果是列表项操作，index已经是原始索引
      extend: action.extend || null // 新增：传递扩展数据
    }
  });
};

// 处理列表项点击
const handleItemClick = (item: ListItem, originalIndex: number) => {
  emit('action', {
    type: 'list-item-click',
    data: {
      item,
      index: originalIndex,
      id: item.id,
      title: item.title || item.label
    }
  });
};
</script>

<style lang="scss" scoped>
.liao-list-plugin {
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
    margin: 0;
  }
  
  &-subtitle {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin: $spacing-xs 0 0 0;
  }
  
  // 搜索区域样式
  &-search {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color-card;
    background-color: rgba($primary-color, 0.02);
    
    &-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: $spacing-xs;
    }
    
    &-icon {
      position: absolute;
      left: $spacing-md;
      color: $text-secondary;
      z-index: 1;
      pointer-events: none;
    }
    
    &-input {
      width: 100%;
      padding: $spacing-sm $spacing-lg $spacing-sm 40px;
      border: 1px solid $border-color-card;
      border-radius: $border-radius-md;
      font-size: $font-size-sm;
      background-color: $bg-primary;
      color: $text-primary;
      transition: all $transition-duration;
      
      &:focus {
        outline: none;
        border-color: $primary-color;
        box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
      }
      
      &::placeholder {
        color: $text-secondary;
      }
    }
    
    &-clear {
      position: absolute;
      right: $spacing-md;
      color: $text-secondary;
      cursor: pointer;
      padding: 2px;
      border-radius: 50%;
      transition: all $transition-duration;
      
      &:hover {
        color: $text-primary;
        background-color: rgba($text-secondary, 0.1);
      }
    }
    
    &-stats {
      font-size: $font-size-xs;
      color: $text-secondary;
    }
  }
  
  // 搜索无结果状态
  &-no-results {
    padding: $spacing-xl;
    text-align: center;
    color: $text-secondary;
    
    .no-results-icon {
      margin-bottom: $spacing-md;
      color: $text-disabled;
    }
    
    .no-results-text {
      font-size: $font-size-md;
      margin-bottom: $spacing-lg;
      color: $text-secondary;
    }
    
    .no-results-clear {
      padding: $spacing-sm $spacing-lg;
      background-color: $primary-color;
      color: white;
      border: none;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
      cursor: pointer;
      transition: all $transition-duration;
      
      &:hover {
        background-color: rgba($primary-color, 0.8);
      }
    }
  }
  
  &-content {
    padding: 0;
  }
  
  &-item {
    padding: $spacing-md $spacing-lg;
    border-bottom: 1px solid $border-color-card;
    cursor: pointer;
    transition: background-color $transition-duration;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background-color: rgba($primary-color, 0.05);
    }
    
    &-content {
      display: flex;
      align-items: flex-start;
    }
    
    &-icon {
      margin-right: $spacing-md;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      border-radius: $border-radius-sm;
      overflow: hidden;
    }
    
    &-svg-icon {
      width: 24px;
      height: 24px;
    }
    
    &-img-icon {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &-text {
      flex: 1;
      min-width: 0;
    }
    
    &-header {
      display: flex;
      align-items: center;
      margin-bottom: $spacing-xs;
    }
    
    &-title {
      font-weight: $font-weight-medium;
      color: $text-primary;
      flex: 1;
      line-height: 1.4;
    }
    
    &-badge {
      padding: 2px 8px;
      border-radius: 12px;
      margin-left: $spacing-sm;
      font-size: 12px;
      line-height: 1.2;
      white-space: nowrap;
      
      &.badge-hot {
        background-color: #ff4d4f;
        color: white;
      }
      
      &.badge-new {
        background-color: #52c41a;
        color: white;
      }
      
      &.badge-urgent {
        background-color: #faad14;
        color: white;
      }
      
      &.badge-sale {
        background-color: #fa8c16;
        color: white;
      }
    }
    
    &-desc {
      font-size: $font-size-sm;
      color: $text-secondary;
      line-height: 1.4;
      margin-bottom: $spacing-xs;
    }
    
    &-meta {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: $spacing-md;
    }
    
    &-price {
      font-size: $font-size-md;
      color: #ff4d4f;
      font-weight: $font-weight-medium;
    }
    
    &-status {
      font-size: $font-size-sm;
      color: $text-primary;
    }
    
    &-time {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
    
    &-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: $spacing-md;
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
      
      &.btn-primary {
        background-color: $primary-color;
        color: white;
        border-color: $primary-color;
        
        &:hover {
          background-color: rgba($primary-color, 0.8);
        }
      }
      
      &.btn-default {
        background-color: $bg-primary;
        color: $text-primary;
        
        &:hover {
          background-color: $bg-secondary;
          border-color: rgba($primary-color, 0.3);
        }
      }
      
      &.btn-danger {
        background-color: transparent;
        color: #ff4d4f;
        border-color: #ff4d4f;
        
        &:hover {
          background-color: #ff4d4f;
          color: white;
        }
      }
      
      &.btn-success {
        background-color: transparent;
        color: #52c41a;
        border-color: #52c41a;
        
        &:hover {
          background-color: #52c41a;
          color: white;
        }
      }
      
      &.btn-warning {
        background-color: transparent;
        color: #faad14;
        border-color: #faad14;
        
        &:hover {
          background-color: #faad14;
          color: white;
        }
      }
      
      &:disabled {
        color: $text-disabled;
        background-color: $bg-secondary;
        border-color: $border-color-card;
        cursor: not-allowed;
        
        &:hover {
          transform: none;
        }
      }
    }
  }
  
  &-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
    display: flex;
    gap: $spacing-sm;
    flex-wrap: wrap;
  }
  
  &-footer-btn {
    padding: $spacing-sm $spacing-lg;
    border: 1px solid $border-color-card;
    border-radius: $border-radius-sm;
    font-size: $font-size-sm;
    cursor: pointer;
    transition: all $transition-duration;
    
    &.btn-primary {
      background-color: $primary-color;
      color: white;
      border-color: $primary-color;
      
      &:hover {
        background-color: rgba($primary-color, 0.8);
      }
    }
    
    &.btn-default {
      background-color: $bg-primary;
      color: $primary-color;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
        border-color: rgba($primary-color, 0.3);
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

// 搜索高亮样式
:deep(.search-highlight) {
  background-color: rgba($primary-color, 0.2);
  color: $primary-color;
  font-weight: $font-weight-medium;
  padding: 1px 2px;
  border-radius: 2px;
}

// 响应式布局
@media (max-width: 768px) {
  .liao-list-plugin {
    &-search {
      padding: $spacing-md;
      
      &-input {
        font-size: $font-size-md;
      }
    }
    
    &-item {
      &-content {
        flex-direction: column;
      }
      
      &-icon {
        margin-right: 0;
        margin-bottom: $spacing-sm;
        align-self: center;
      }
      
      &-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: $spacing-xs;
      }
      
      &-actions {
        justify-content: center;
      }
    }
    
    &-footer {
      flex-direction: column;
      
      &-btn {
        text-align: center;
      }
    }
  }
}
</style> 