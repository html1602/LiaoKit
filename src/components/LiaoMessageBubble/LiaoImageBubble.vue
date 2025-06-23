<template>
  <LiaoMessageBubble
    :type="type"
    :avatar="avatar"
    :showAvatar="showAvatar"
    :showAvatarSelf="showAvatarSelf"
    :name="name"
    :showName="showName"
    :time="time"
    :showTime="showTime"
    :timeFormat="timeFormat"
    :highlight="highlight"
    :status="status"
    :customClass="customClassComputed"
    @click="handleBubbleClick"
    @context-menu="handleContextMenu"
  >
    <div 
      class="liao-image-content"
      :class="{ 'liao-image-loading': loading }"
      @click.stop="handleImageClick"
    >
      <!-- 加载占位 -->
      <div v-if="loading" class="liao-image-loading-indicator">
        <LiaoIcon name="loading" spin size="medium" />
        <span>{{ loadingText }}</span>
      </div>
      
      <!-- 失败占位 -->
      <div v-else-if="error" class="liao-image-error">
        <LiaoIcon name="error" size="medium" />
        <span>{{ errorText }}</span>
      </div>
      
      <!-- 图片 -->
      <template v-else>
        <img
          ref="imageRef"
          class="liao-image"
          :src="imageUrl"
          :alt="alt"
          :style="imageStyle"
          @load="handleImageLoad"
          @error="handleImageError"
        />
        
        <!-- 图片尺寸信息 -->
        <div v-if="showInfo && imageInfo.width && imageInfo.height" class="liao-image-info">
          {{ `${imageInfo.width} × ${imageInfo.height}` }}
        </div>
      </template>
    </div>
    
    <!-- 预览遮罩 -->
    <div v-if="isPreviewVisible" class="liao-image-preview-mask" @click="closePreview">
      <div class="liao-image-preview-wrapper" @click.stop>
        <img 
          class="liao-image-preview" 
          :src="imageUrl" 
          :alt="alt"
          ref="previewImageRef"
        />
        <button class="liao-image-preview-close" @click="closePreview">
          <LiaoIcon name="close" size="medium" />
        </button>
      </div>
    </div>
  </LiaoMessageBubble>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import type { PropType } from 'vue';
import LiaoMessageBubble from './LiaoMessageBubble.vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

// 图片信息接口
interface ImageInfo {
  width?: number;
  height?: number;
  size?: number;
  format?: string;
}

const props = defineProps({
  imageUrl: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: 'Image'
  },
  type: {
    type: String as PropType<'self' | 'other' | 'system'>,
    default: 'other'
  },
  avatar: {
    type: String,
    default: ''
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showAvatarSelf: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    default: ''
  },
  showName: {
    type: Boolean,
    default: false
  },
  time: {
    type: [String, Date, Number],
    default: ''
  },
  showTime: {
    type: Boolean,
    default: true
  },
  timeFormat: {
    type: String,
    default: 'HH:mm'
  },
  highlight: {
    type: Boolean,
    default: false
  },
  status: {
    type: String as PropType<'sending' | 'sent' | 'failed' | 'streaming'>,
    default: 'sent'
  },
  maxWidth: {
    type: Number,
    default: 240 // 默认最大宽度
  },
  maxHeight: {
    type: Number,
    default: 240 // 默认最大高度
  },
  minWidth: {
    type: Number,
    default: 100 // 默认最小宽度
  },
  minHeight: {
    type: Number,
    default: 100 // 默认最小高度
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Boolean,
    default: false
  },
  loadingText: {
    type: String,
    default: '图片加载中...'
  },
  errorText: {
    type: String,
    default: '图片加载失败'
  },
  showInfo: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click', 'image-click', 'context-menu', 'preview', 'preview-close']);

// 图片引用
const imageRef = ref<HTMLImageElement | null>(null);
const previewImageRef = ref<HTMLImageElement | null>(null);

// 图片信息
const imageInfo = ref<ImageInfo>({});

// 预览状态
const isPreviewVisible = ref(false);

// 组合自定义类名
const customClassComputed = computed(() => {
  return `liao-image-bubble ${props.customClass}`.trim();
});

// 计算图片样式
const imageStyle = computed(() => {
  if (!imageInfo.value.width || !imageInfo.value.height) {
    return {
      maxWidth: `${props.maxWidth}px`,
      maxHeight: `${props.maxHeight}px`,
      minWidth: `${props.minWidth}px`,
      minHeight: `${props.minHeight}px`
    };
  }

  // 原始比例
  const ratio = imageInfo.value.width / imageInfo.value.height;
  
  // 最大宽高
  const maxWidth = Math.min(props.maxWidth, imageInfo.value.width);
  const maxHeight = Math.min(props.maxHeight, imageInfo.value.height);
  
  // 适配最大宽高
  let width = maxWidth;
  let height = width / ratio;
  
  if (height > maxHeight) {
    height = maxHeight;
    width = height * ratio;
  }
  
  return {
    width: `${width}px`,
    height: `${height}px`,
    maxWidth: `${maxWidth}px`,
    maxHeight: `${maxHeight}px`
  };
});

// 图片加载成功
const handleImageLoad = () => {
  if (imageRef.value) {
    imageInfo.value = {
      width: imageRef.value.naturalWidth,
      height: imageRef.value.naturalHeight
    };
  }
};

// 图片加载失败
const handleImageError = () => {
  emit('image-click', { error: true });
};

// 处理气泡点击
const handleBubbleClick = (e: any) => {
  emit('click', e);
};

// 处理图片点击
const handleImageClick = () => {
  if (props.loading || props.error) return;
  
  isPreviewVisible.value = true;
  emit('preview', { url: props.imageUrl });
  
  // 确保预览图片加载完整
  nextTick(() => {
    if (previewImageRef.value) {
      previewImageRef.value.style.maxWidth = '90vw';
      previewImageRef.value.style.maxHeight = '90vh';
    }
  });
};

// 处理右键菜单
const handleContextMenu = (e: any) => {
  emit('context-menu', e);
};

// 关闭预览
const closePreview = () => {
  isPreviewVisible.value = false;
  emit('preview-close');
};

// 组件挂载后，尝试加载图片信息
onMounted(() => {
  // 预加载图片以获取尺寸
  if (!props.loading && !props.error && props.imageUrl) {
    const img = new Image();
    img.src = props.imageUrl;
    img.onload = () => {
      imageInfo.value = {
        width: img.naturalWidth,
        height: img.naturalHeight
      };
    };
  }
});
</script>

<style lang="scss" scoped>

.liao-image-bubble {
  .liao-image-content {
    position: relative;
    overflow: hidden;
    border-radius: $border-radius-md;
    background-color: $bg-secondary;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: 100px;
    cursor: pointer;
    transition: all $transition-duration $transition-timing-function;
    
    &:hover {
      filter: brightness(0.95);
    }
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  .liao-image {
    display: block;
    object-fit: cover;
    border-radius: $border-radius-md;
  }
  
  .liao-image-info {
    position: absolute;
    bottom: $spacing-xs;
    right: $spacing-xs;
    padding: $spacing-xs $spacing-sm;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: $font-size-xs;
    border-radius: $border-radius-sm;
    pointer-events: none;
  }
  
  .liao-image-loading-indicator,
  .liao-image-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-md;
    color: $text-secondary;
    
    span {
      margin-top: $spacing-sm;
      font-size: $font-size-sm;
    }
  }
  
  .liao-image-loading {
    pointer-events: none;
    opacity: 0.8;
  }
  
  .liao-image-error {
    color: $danger-color;
    cursor: default;
    
    &:hover {
      filter: none;
    }
    
    &:active {
      transform: none;
    }
  }
}

// 图片预览
.liao-image-preview-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: zoom-out;
  animation: fade-in 0.2s ease-in-out;
}

.liao-image-preview-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 90vw;
  max-height: 90vh;
}

.liao-image-preview {
  max-width: 90vw;
  max-height: 90vh;
  object-fit: contain;
  animation: zoom-in 0.3s ease-out;
}

.liao-image-preview-close {
  position: absolute;
  top: -44px;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: $border-radius-circle;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all $transition-duration $transition-timing-function;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }
}

// 动画
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoom-in {
  from { 
    opacity: 0;
    transform: scale(0.8);
  }
  to { 
    opacity: 1;
    transform: scale(1);
  }
}
</style> 