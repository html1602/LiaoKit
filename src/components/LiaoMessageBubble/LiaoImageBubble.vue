<template>
  <div 
    class="liao-image-container"
    :class="[
      `liao-image-container-${type}`,
      customClass
    ]"
    @click="handleBubbleClick"
    @contextmenu="handleContextMenu"
  >
    <!-- 头像区域 -->
    <div v-if="showAvatar && (type === 'other' || showAvatarSelf)" class="liao-image-avatar">
      <img v-if="avatar" :src="avatar" alt="Avatar" class="liao-image-avatar-img" />
      <div v-else class="liao-image-avatar-placeholder">
        <LiaoIcon v-if="type === 'other'" name="robot" size="medium" />
        <LiaoIcon v-else name="user" size="medium" />
      </div>
    </div>
    
    <div class="liao-image-wrapper">
      <!-- 名称显示 -->
      <div v-if="showName && name" class="liao-image-name">
        {{ name }}
      </div>
      
      <!-- 图片内容区域 -->
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
      
      <!-- 时间显示 -->
      <div v-if="showTime" class="liao-image-time">
        {{ formattedTime }}
      </div>
      
      <!-- 消息状态 -->
      <div v-if="status === 'sending'" class="liao-image-status">
        <LiaoIcon name="loading" size="small" class="loading-icon" />
      </div>
      <div v-else-if="status === 'failed'" class="liao-image-status error">
        <LiaoIcon name="error" size="small" />
        <span>发送失败</span>
      </div>
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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue';
import type { PropType } from 'vue';
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

// 时间格式化
const formattedTime = computed(() => {
  if (!props.time) return '';
  
  let date: Date;
  
  if (props.time instanceof Date) {
    date = props.time;
  } else if (typeof props.time === 'number') {
    date = new Date(props.time);
  } else {
    date = new Date(props.time);
  }
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // 简易时间格式化
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (isToday) {
    return `${hours}:${minutes}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }
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
.liao-image-container {
  display: flex;
  margin: $spacing-md 0;
  position: relative;
  
  &.liao-image-container-self {
    flex-direction: row-reverse;
    
    .liao-image-wrapper {
      align-items: flex-end;
      margin-right: $spacing-md;
    }
    
    .liao-image-name {
      text-align: right;
    }
    
    .liao-image-time {
      text-align: right;
    }
  }
  
  &.liao-image-container-other {
    flex-direction: row;
    
    .liao-image-wrapper {
      align-items: flex-start;
      margin-left: $spacing-md;
    }
  }
  
  &.liao-image-container-system {
    justify-content: center;
    
    .liao-image-wrapper {
      align-items: center;
    }
    
    .liao-image-name,
    .liao-image-time {
      text-align: center;
    }
  }
}

.liao-image-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  
  .liao-image-avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .liao-image-avatar-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $bg-secondary;
    color: $text-secondary;
  }
}

.liao-image-wrapper {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.liao-image-name {
  font-size: $font-size-sm;
  color: $text-secondary;
  margin-bottom: $spacing-xs;
}

.liao-image-time {
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin-top: $spacing-xs;
}

.liao-image-status {
  display: flex;
  align-items: center;
  font-size: $font-size-xs;
  color: $text-tertiary;
  margin-top: $spacing-xs;
  
  &.error {
    color: $danger-color;
  }
  
  .loading-icon {
    animation: spin 1s linear infinite;
  }
  
  span {
    margin-left: $spacing-xs;
  }
}

.liao-image-content {
  position: relative;
  overflow: hidden;
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
  border-radius: 50%;
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

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>