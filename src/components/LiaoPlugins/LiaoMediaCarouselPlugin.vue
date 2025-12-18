<template>
  <div class="liao-media-carousel-plugin">
    <div v-if="title" class="liao-media-carousel-plugin-header">
      <h3 class="liao-media-carousel-plugin-title">{{ title }}</h3>
    </div>
    
    <div class="liao-media-carousel-plugin-content">
      <slot>
        <div class="liao-media-carousel-plugin-carousel">
          <!-- 轮播内容区 -->
          <div class="liao-media-carousel-plugin-container" ref="carouselContainer">
            <div
              class="liao-media-carousel-plugin-items"
              ref="carouselItems"
              :style="{ 
                transform: `translateX(-${(currentIndex + 1) * 100}%)`,
                transition: isTransitioning ? 'transform 0.4s ease' : 'none'
              }"
              @transitionend="handleTransitionEnd"
            >
              <!-- 克隆最后一个元素放在开头（用于无缝循环） -->
              <div
                v-if="items.length > 1"
                class="liao-media-carousel-plugin-item liao-media-carousel-plugin-item-clone"
              >
                <div v-if="lastItem.type === 'image'" class="liao-media-carousel-plugin-image-wrapper">
                  <img
                    :src="lastItem.url"
                    :alt="lastItem.title || '图片'"
                    class="liao-media-carousel-plugin-image"
                  />
                </div>
                <div v-else-if="lastItem.type === 'video'" class="liao-media-carousel-plugin-video-wrapper">
                  <video
                    :src="lastItem.url"
                    :poster="lastItem.poster"
                    controls
                    class="liao-media-carousel-plugin-video"
                  ></video>
                </div>
                <div v-if="lastItem.title || lastItem.description" class="liao-media-carousel-plugin-caption">
                  <div v-if="lastItem.title" class="liao-media-carousel-plugin-caption-title">{{ lastItem.title }}</div>
                  <div v-if="lastItem.description" class="liao-media-carousel-plugin-caption-desc">{{ lastItem.description }}</div>
                </div>
              </div>
              
              <!-- 原始元素 -->
              <div
                v-for="(item, index) in items"
                :key="index"
                class="liao-media-carousel-plugin-item"
                :class="{ 
                  'liao-media-carousel-plugin-item-clickable': enableItemClick && (item.clickable !== false)
                }"
                @click="handleItemClick(item, index)"
              >
                <!-- 图片 -->
                <div v-if="item.type === 'image'" class="liao-media-carousel-plugin-image-wrapper">
                  <img
                    :src="item.url"
                    :alt="item.title || '图片'"
                    class="liao-media-carousel-plugin-image"
                    @error="handleImageError(index)"
                  />
                  <div v-if="imageErrors[index]" class="liao-media-carousel-plugin-image-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>图片加载失败</span>
                  </div>
                </div>
                
                <!-- 视频 -->
                <div v-else-if="item.type === 'video'" class="liao-media-carousel-plugin-video-wrapper">
                  <video
                    :src="item.url"
                    :poster="item.poster"
                    controls
                    class="liao-media-carousel-plugin-video"
                    @error="handleVideoError(index)"
                  ></video>
                  <div v-if="videoErrors[index]" class="liao-media-carousel-plugin-video-error">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="23 7 16 12 23 17 23 7"></polygon>
                      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                    </svg>
                    <span>视频加载失败</span>
                  </div>
                </div>
                
                <!-- 内容标题和描述 -->
                <div v-if="item.title || item.description" class="liao-media-carousel-plugin-caption">
                  <div v-if="item.title" class="liao-media-carousel-plugin-caption-title">{{ item.title }}</div>
                  <div v-if="item.description" class="liao-media-carousel-plugin-caption-desc">{{ item.description }}</div>
                </div>
              </div>
              
              <!-- 克隆第一个元素放在末尾（用于无缝循环） -->
              <div
                v-if="items.length > 1"
                class="liao-media-carousel-plugin-item liao-media-carousel-plugin-item-clone"
              >
                <div v-if="firstItem.type === 'image'" class="liao-media-carousel-plugin-image-wrapper">
                  <img
                    :src="firstItem.url"
                    :alt="firstItem.title || '图片'"
                    class="liao-media-carousel-plugin-image"
                  />
                </div>
                <div v-else-if="firstItem.type === 'video'" class="liao-media-carousel-plugin-video-wrapper">
                  <video
                    :src="firstItem.url"
                    :poster="firstItem.poster"
                    controls
                    class="liao-media-carousel-plugin-video"
                  ></video>
                </div>
                <div v-if="firstItem.title || firstItem.description" class="liao-media-carousel-plugin-caption">
                  <div v-if="firstItem.title" class="liao-media-carousel-plugin-caption-title">{{ firstItem.title }}</div>
                  <div v-if="firstItem.description" class="liao-media-carousel-plugin-caption-desc">{{ firstItem.description }}</div>
                </div>
              </div>
            </div>
            
            <!-- 导航箭头 -->
            <button
              v-if="items.length > 1 && showControls"
              class="liao-media-carousel-plugin-arrow liao-media-carousel-plugin-arrow-prev"
              @click="prevSlide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              v-if="items.length > 1 && showControls"
              class="liao-media-carousel-plugin-arrow liao-media-carousel-plugin-arrow-next"
              @click="nextSlide"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          
          <!-- 轮播指示器 -->
          <div v-if="items.length > 1 && showIndicators" class="liao-media-carousel-plugin-indicators">
            <button
              v-for="(_, index) in items"
              :key="index"
              class="liao-media-carousel-plugin-indicator"
              :class="{ 'liao-media-carousel-plugin-indicator-active': index === currentIndex }"
              @click="setSlide(index)"
            ></button>
          </div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import type { PropType } from 'vue';

// 媒体项接口
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  title?: string;
  description?: string;
  poster?: string; // 视频封面
  clickable?: boolean; // 是否可点击
  clickData?: any; // 点击时传递的自定义数据
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      title?: string;
      items: MediaItem[];
      autoplay?: boolean;
      interval?: number;
      showControls?: boolean;
      showIndicators?: boolean;
      enableItemClick?: boolean; // 是否启用项目点击
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

// 获取轮播数据
const title = computed(() => props.pluginData.title || '');
const items = computed(() => props.pluginData.items || []);
const autoplay = computed(() => props.pluginData.autoplay !== false);
const interval = computed(() => props.pluginData.interval || 5000);
const showControls = computed(() => props.pluginData.showControls !== false);
const showIndicators = computed(() => props.pluginData.showIndicators !== false);
const enableItemClick = computed(() => props.pluginData.enableItemClick !== false);

const fallbackItem: MediaItem = { type: 'image', url: '' };
const firstItem = computed<MediaItem>(() => items.value[0] ?? fallbackItem);
const lastItem = computed<MediaItem>(() => items.value[items.value.length - 1] ?? fallbackItem);

// 轮播状态
const currentIndex = ref(0);
const isTransitioning = ref(true);
const autoplayTimer = ref<number | null>(null);
const imageErrors = ref<Record<number, boolean>>({});
const videoErrors = ref<Record<number, boolean>>({});
const carouselContainer = ref<HTMLElement | null>(null);
const carouselItems = ref<HTMLElement | null>(null);

// 切换到上一张幻灯片
const prevSlide = () => {
  if (items.value.length <= 1) return;
  
  isTransitioning.value = true;
  currentIndex.value--;
  
  // 如果到了第一张之前，需要跳转到最后一张
  if (currentIndex.value < 0) {
    // 先移动到克隆的最后一张（视觉上看起来是最后一张）
    currentIndex.value = -1;
    
    // 等待动画完成后，无动画地跳转到真正的最后一张
    setTimeout(() => {
      isTransitioning.value = false;
      currentIndex.value = items.value.length - 1;
    }, 400);
  }
  
  resetAutoplay();
  emitChangeEvent();
};

// 切换到下一张幻灯片
const nextSlide = () => {
  if (items.value.length <= 1) return;
  
  isTransitioning.value = true;
  currentIndex.value++;
  
  // 如果超过了最后一张，需要跳转到第一张
  if (currentIndex.value >= items.value.length) {
    // 先移动到克隆的第一张（视觉上看起来是第一张）
    currentIndex.value = items.value.length;
    
    // 等待动画完成后，无动画地跳转到真正的第一张
    setTimeout(() => {
      isTransitioning.value = false;
      currentIndex.value = 0;
    }, 400);
  }
  
  resetAutoplay();
  emitChangeEvent();
};

// 切换到指定幻灯片
const setSlide = (index: number) => {
  if (index === currentIndex.value || index < 0 || index >= items.value.length) return;
  
  isTransitioning.value = true;
  currentIndex.value = index;
  resetAutoplay();
  emitChangeEvent();
};

// 重置自动播放
const resetAutoplay = () => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
    autoplayTimer.value = null;
  }
  
  if (autoplay.value && items.value.length > 1) {
    autoplayTimer.value = window.setInterval(() => {
      nextSlide();
    }, interval.value);
  }
};

// 触发变更事件
const emitChangeEvent = () => {
  // 确保索引在有效范围内
  const validIndex = Math.max(0, Math.min(currentIndex.value, items.value.length - 1));
  
  emit('action', {
    type: 'carousel-change',
    data: {
      index: validIndex,
      item: items.value[validIndex]
    }
  });
};

// 处理图片加载错误
const handleImageError = (index: number) => {
  imageErrors.value = { ...imageErrors.value, [index]: true };
};

// 处理视频加载错误
const handleVideoError = (index: number) => {
  videoErrors.value = { ...videoErrors.value, [index]: true };
};

// 处理轮播项点击
const handleItemClick = (item: MediaItem, index: number) => {
  // 检查是否启用点击功能
  if (!enableItemClick.value) return;
  
  // 检查当前项是否可点击（优先级：单项设置 > 全局设置）
  const isClickable = item.clickable !== undefined ? item.clickable : true;
  if (!isClickable) return;
  
  // 触发点击事件
  emit('action', {
    type: 'carousel-item-click',
    data: {
      index: index,
      item: item,
      clickData: item.clickData || null,
      currentSlide: currentIndex.value,
      totalSlides: items.value.length
    }
  });
};

// 监听项目变化
watch(
  () => props.pluginData.items,
  () => {
    // 重置索引和错误状态
    currentIndex.value = 0;
    isTransitioning.value = true;
    imageErrors.value = {};
    videoErrors.value = {};
    resetAutoplay();
  }
);

// 设置触摸滑动事件
let touchStartX = 0;
let touchEndX = 0;

const handleTouchStart = (e: TouchEvent) => {
  touchStartX = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const minSwipeDistance = 50;
  const swipeDistance = touchEndX - touchStartX;
  
  if (Math.abs(swipeDistance) >= minSwipeDistance) {
    if (swipeDistance > 0) {
      prevSlide();
    } else {
      nextSlide();
    }
  }
};

// 处理过渡结束事件
const handleTransitionEnd = () => {
  // 过渡结束后，如果需要重置位置，则重新启用过渡
  nextTick(() => {
    if (!isTransitioning.value) {
      // 给一个小延迟后重新启用过渡
      setTimeout(() => {
        isTransitioning.value = true;
      }, 50);
    }
  });
};

// 初始化
onMounted(() => {
  resetAutoplay();
  
  // 添加触摸事件
  if (carouselContainer.value) {
    carouselContainer.value.addEventListener('touchstart', handleTouchStart, { passive: true });
    carouselContainer.value.addEventListener('touchend', handleTouchEnd, { passive: true });
  }
});

// 清理
onBeforeUnmount(() => {
  if (autoplayTimer.value) {
    clearInterval(autoplayTimer.value);
  }
  
  // 移除触摸事件
  if (carouselContainer.value) {
    carouselContainer.value.removeEventListener('touchstart', handleTouchStart);
    carouselContainer.value.removeEventListener('touchend', handleTouchEnd);
  }
});
</script>

<style lang="scss" scoped>
.liao-media-carousel-plugin {
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
  
  &-content {
    padding: 0;
  }
  
  &-carousel {
    position: relative;
  }
  
  &-container {
    position: relative;
    overflow: hidden;
    width: 100%;
  }
  
  &-items {
    display: flex;
    width: 100%;
  }
  
  &-item {
    flex: 0 0 100%;
    width: 100%;
    position: relative;
    
    &-clickable {
      cursor: pointer;
      transition: transform 0.2s ease, opacity 0.2s ease;
      
      &:hover {
        transform: scale(1.02);
        opacity: 0.9;
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
  
  &-image-wrapper,
  &-video-wrapper {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; // 16:9 宽高比
    overflow: hidden;
  }
  
  &-image,
  &-video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  &-image-error,
  &-video-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $bg-secondary;
    color: $text-secondary;
    
    svg {
      margin-bottom: $spacing-sm;
    }
  }
  
  &-caption {
    padding: $spacing-md $spacing-lg;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    
    &-title {
      font-size: $font-size-lg;
      font-weight: $font-weight-medium;
      margin-bottom: $spacing-xs;
    }
    
    &-desc {
      font-size: $font-size-sm;
      opacity: 0.8;
    }
  }
  
  &-arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.3);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    cursor: pointer;
    z-index: 2;
    transition: background-color 0.3s;
    
    &:hover {
      background-color: rgba(0, 0, 0, 0.6);
    }
    
    &-prev {
      left: $spacing-md;
    }
    
    &-next {
      right: $spacing-md;
    }
  }
  
  &-indicators {
    display: flex;
    justify-content: center;
    padding: $spacing-md 0;
    gap: $spacing-sm;
  }
  
  &-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba($primary-color, 0.3);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.3s;
    
    &:hover {
      background-color: rgba($primary-color, 0.6);
    }
    
    &-active {
      background-color: $primary-color;
      transform: scale(1.2);
    }
  }
}
</style> 
