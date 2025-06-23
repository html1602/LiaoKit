<template>
  <div 
    class="liao-text-bubble"
    :class="[
      `liao-text-bubble-theme-${actualTheme}`,
      { 
        'liao-text-bubble-error': error,
        'liao-text-bubble-editable': editable,
        'liao-text-bubble-collapsed': isCollapsed,
        [`liao-text-bubble-status-${status}`]: status
      }
    ]"
    @click="handleBubbleClick"
    @contextmenu.prevent="handleLongPress"
  >
    <!-- 前缀插槽 -->
    <div v-if="$slots.prefix" class="liao-text-bubble-prefix">
      <slot name="prefix"></slot>
    </div>
    
    <!-- 消息内容 -->
    <div class="liao-text-bubble-content" ref="contentRef">
      <slot name="content">
        <div 
          v-if="content" 
          class="liao-text-bubble-text"
          :class="{ 'liao-text-bubble-text-expandable': needsCollapse }"
          ref="textRef"
          v-html="renderedContent"
        ></div>
        <div v-else class="liao-text-bubble-empty">
          [消息不可用]
        </div>
      </slot>
      
      <!-- 展开/收起 -->
      <div v-if="needsCollapse" class="liao-text-bubble-expand">
        <slot name="expanded">
          <button 
            class="liao-text-bubble-expand-btn" 
            @click.stop="toggleExpand"
          >
            {{ isCollapsed ? '展开' : '收起' }}
          </button>
        </slot>
      </div>
    </div>
    
    <!-- 后缀插槽 -->
    <div v-if="$slots.suffix" class="liao-text-bubble-suffix">
      <slot name="suffix"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import type { PropType } from 'vue';

// 定义Props
const props = defineProps({
  content: {
    type: String,
    required: true
  },
  linkify: {
    type: Boolean,
    default: true
  },
  emoji: {
    type: Boolean,
    default: true
  },
  highlight: {
    type: [String, Array] as PropType<string | string[]>,
    default: null
  },
  editable: {
    type: Boolean,
    default: false
  },
  collapsed: {
    type: Boolean,
    default: false
  },
  maxLines: {
    type: Number,
    default: 5
  },
  error: {
    type: Boolean,
    default: false
  },
  status: {
    type: String as PropType<'sending' | 'failed' | 'recalled' | 'reported' | null>,
    default: null
  },
  theme: {
    type: String as PropType<'auto' | 'light' | 'dark' | 'brand'>,
    default: 'auto'
  },
  sender: {
    type: Object as PropType<{
      id?: string | number;
      name?: string;
      avatar?: string;
    }>,
    default: () => ({})
  },
  customStyle: {
    type: [Object, String],
    default: null
  },
  id: {
    type: [String, Number],
    default: null
  }
});

// 定义事件
const emit = defineEmits([
  'copy',
  'link-click',
  'bubble-click',
  'bubble-longpress',
  'expand'
]);

// 引用和状态
const contentRef = ref<HTMLDivElement | null>(null);
const textRef = ref<HTMLDivElement | null>(null);
const isCollapsed = ref(props.collapsed);
const needsCollapse = ref(false);

// 获取实际主题
const actualTheme = computed(() => {
  if (props.theme !== 'auto') return props.theme;
  
  // 检测系统主题，这里只是简单实现，实际项目可能需要更复杂的逻辑
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
});

// 处理文本渲染
const renderedContent = computed(() => {
  if (!props.content) return '';
  
  let processed = props.content;
  
  // XSS防护
  processed = escapeHtml(processed);
  
  // Emoji处理
  if (props.emoji) {
    processed = processEmoji(processed);
  }
  
  // 超链接处理
  if (props.linkify) {
    processed = processLinks(processed);
  }
  
  // 关键词高亮
  if (props.highlight) {
    processed = highlightKeywords(processed, props.highlight);
  }
  
  return processed;
});

// 处理HTML转义
const escapeHtml = (html: string): string => {
  const escapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  };
  return html.replace(/[&<>"']/g, (match) => escapeMap[match]);
};

// 处理Emoji显示
const processEmoji = (text: string): string => {
  // 这里使用简单的实现，实际项目可能需要使用更复杂的emoji库
  return text;
};

// 处理超链接
const processLinks = (text: string): string => {
  // URL链接
  const urlRegex = /https?:\/\/\S+/g;
  text = text.replace(urlRegex, (url) => {
    return `<a href="${url}" class="liao-text-bubble-link" data-type="url" data-url="${url}" onclick="return false;">${url}</a>`;
  });
  
  // www链接
  const wwwRegex = /\b(?<!\/\/)(www\.\S+\.\S+)/g;
  text = text.replace(wwwRegex, (url) => {
    return `<a href="http://${url}" class="liao-text-bubble-link" data-type="url" data-url="http://${url}" onclick="return false;">${url}</a>`;
  });
  
  // 邮箱
  const emailRegex = /\b([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})\b/g;
  text = text.replace(emailRegex, (email) => {
    return `<a href="mailto:${email}" class="liao-text-bubble-link" data-type="email" data-url="${email}" onclick="return false;">${email}</a>`;
  });
  
  // 电话号码 (简单实现，实际项目可能需要更复杂的正则)
  const phoneRegex = /\b(\+?[0-9]{8,})\b/g;
  text = text.replace(phoneRegex, (phone) => {
    return `<a href="tel:${phone}" class="liao-text-bubble-link" data-type="phone" data-url="${phone}" onclick="return false;">${phone}</a>`;
  });
  
  return text;
};

// 处理关键词高亮
const highlightKeywords = (text: string, keywords: string | string[]): string => {
  const keywordList = Array.isArray(keywords) ? keywords : [keywords];
  
  keywordList.forEach((keyword) => {
    if (!keyword) return;
    
    const regex = new RegExp(keyword, 'gi');
    text = text.replace(regex, (match) => {
      return `<span class="liao-text-bubble-highlight">${match}</span>`;
    });
  });
  
  return text;
};

// 计算是否需要折叠
const checkCollapse = async () => {
  await nextTick();
  
  if (!textRef.value) return;
  
  const lineHeight = parseInt(window.getComputedStyle(textRef.value).lineHeight);
  const height = textRef.value.clientHeight;
  
  // 如果行高为0或高度为0，说明元素还未渲染完成，跳过检查
  if (lineHeight === 0 || height === 0) return;
  
  const lines = Math.ceil(height / lineHeight);
  needsCollapse.value = lines > props.maxLines;
  
  // 如果需要折叠且isCollapsed为true，则应用max-height限制
  if (needsCollapse.value && isCollapsed.value && textRef.value) {
    textRef.value.style.maxHeight = `${props.maxLines * lineHeight}px`;
  } else if (textRef.value) {
    textRef.value.style.maxHeight = '';
  }
};

// 展开/收起切换
const toggleExpand = () => {
  isCollapsed.value = !isCollapsed.value;
  
  if (textRef.value) {
    const lineHeight = parseInt(window.getComputedStyle(textRef.value).lineHeight);
    
    if (isCollapsed.value) {
      textRef.value.style.maxHeight = `${props.maxLines * lineHeight}px`;
    } else {
      textRef.value.style.maxHeight = '';
    }
  }
  
  emit('expand', { 
    collapsed: isCollapsed.value, 
    id: props.id 
  });
};

// 处理气泡点击
const handleBubbleClick = (event: MouseEvent) => {
  // 检查点击是否在链接上
  const target = event.target as HTMLElement;
  const linkElement = target.closest('.liao-text-bubble-link');
  
  if (linkElement) {
    const type = linkElement.getAttribute('data-type');
    const url = linkElement.getAttribute('data-url');
    
    if (type && url) {
      emit('link-click', { url, type, event });
      return;
    }
  }
  
  // 如果不是点击链接，则触发气泡点击事件
  emit('bubble-click', { 
    content: props.content, 
    id: props.id 
  });
};

// 处理长按/右键
const handleLongPress = (event: MouseEvent) => {
  emit('bubble-longpress', { 
    content: props.content, 
    id: props.id, 
    sourceEvent: event 
  });
};

// 复制内容
const copyContent = () => {
  if (!props.content) return;
  
  navigator.clipboard.writeText(props.content)
    .then(() => {
      emit('copy', { 
        content: props.content, 
        id: props.id 
      });
    })
    .catch((error) => {
      console.error('复制失败:', error);
    });
};

// 监听content变化
watch(() => props.content, async () => {
  await nextTick();
  checkCollapse();
});

// 监听collapsed属性变化
watch(() => props.collapsed, (newVal) => {
  isCollapsed.value = newVal;
  nextTick(() => checkCollapse());
});

// 挂载后执行
onMounted(() => {
  // 设置事件监听
  window.addEventListener('resize', checkCollapse);
  
  // 初次检查是否需要折叠
  checkCollapse();
  
  // 为链接添加点击事件委托
  if (contentRef.value) {
    contentRef.value.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'A' || target.closest('a')) {
        event.preventDefault();
      }
    });
  }
  
  // 在DOM中添加点击事件处理，以监听链接点击
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement;
    const link = target.closest('.liao-text-bubble-link');
    
    if (link && contentRef.value?.contains(link)) {
      const type = link.getAttribute('data-type');
      const url = link.getAttribute('data-url');
      
      if (type && url) {
        emit('link-click', { url, type, event });
        event.preventDefault();
      }
    }
  });
});

// 暴露公共方法
defineExpose({
  copyContent
});
</script>

<style lang="scss" scoped>


.liao-text-bubble {
  display: flex;
  position: relative;
  max-width: 80%;
  margin-bottom: $spacing-sm;
  
  &-prefix {
    margin-right: $spacing-xs;
    flex-shrink: 0;
  }
  
  &-content {
    display: flex;
    flex-direction: column;
    border-radius: $border-radius-md;
    overflow: hidden;
  }
  
  &-text {
    padding: $spacing-sm $spacing-lg;
    word-break: break-word;
    font-size: $font-size-md;
    line-height: 1.5;
    transition: max-height 0.3s ease;
    overflow: hidden;
    
    &-expandable {
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 24px;
        background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0.8));
        pointer-events: none;
      }
    }
  }
  
  &-empty {
    padding: $spacing-sm $spacing-lg;
    color: $text-secondary;
    font-style: italic;
  }
  
  &-expand {
    padding: $spacing-xs $spacing-lg;
    display: flex;
    justify-content: flex-end;
    
    &-btn {
      background: none;
      border: none;
      color: $primary-color;
      font-size: $font-size-sm;
      cursor: pointer;
      padding: $spacing-xs $spacing-sm;
      border-radius: $border-radius-sm;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba($primary-color, 0.1);
      }
    }
  }
  
  &-suffix {
    margin-left: $spacing-xs;
    flex-shrink: 0;
  }
  
  // 状态样式
  &-error {
    .liao-text-bubble-text {
      background-color: rgba($danger-color, 0.1);
      border: 1px solid $danger-color;
    }
  }
  
  &-editable {
    .liao-text-bubble-text {
      background-color: rgba($primary-color, 0.05);
      border: 1px dashed $primary-color;
    }
  }
  
  &-status {
    &-sending {
      opacity: 0.7;
    }
    
    &-failed {
      .liao-text-bubble-text {
        border: 1px solid $danger-color;
      }
    }
    
    &-recalled, &-reported {
      opacity: 0.6;
      
      .liao-text-bubble-text {
        font-style: italic;
        color: $text-secondary;
      }
    }
  }
  
  // 主题
  &-theme {
    &-light {
      .liao-text-bubble-text {
        background-color: $bg-secondary;
        border: 1px solid $border-color;
      }
    }
    
    &-dark {
      .liao-text-bubble-text {
        background-color: #2a2a2a;
        color: #e0e0e0;
        border: 1px solid #444;
      }
      
      .liao-text-bubble-text-expandable::after {
        background: linear-gradient(to bottom, rgba(42,42,42,0), rgba(42,42,42,0.8));
      }
      
      .liao-text-bubble-expand-btn {
        color: #69b3ff;
        
        &:hover {
          background-color: rgba(105, 179, 255, 0.1);
        }
      }
      
      .liao-text-bubble-empty {
        color: #999;
      }
    }
    
    &-brand {
      .liao-text-bubble-text {
        background-color: rgba($primary-color, 0.1);
        border: 1px solid rgba($primary-color, 0.2);
      }
    }
  }
}

// 链接样式
:deep(.liao-text-bubble-link) {
  color: $primary-color;
  text-decoration: underline;
  cursor: pointer;
  
  &:hover {
    text-decoration: none;
    background-color: rgba($primary-color, 0.1);
    border-radius: 2px;
  }
}

// 高亮样式
:deep(.liao-text-bubble-highlight) {
  background-color: rgba($primary-color, 0.2);
  border-radius: 2px;
  padding: 0 2px;
}

// 响应式调整
@media (max-width: 768px) {
  .liao-text-bubble {
    max-width: 90%;
    
    &-text {
      padding: $spacing-xs $spacing-md;
    }
  }
}
</style> 