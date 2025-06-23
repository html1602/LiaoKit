<template>
  <span
    class="liao-icon"
    :class="[
      size ? `liao-icon-${size}` : '',
      spin ? 'liao-icon-spin' : '',
      customClass
    ]"
    :style="iconStyle"
    v-if="svg"
    v-html="svg"
    v-bind="$attrs"
  ></span>
  <span 
    v-else-if="isLiaoIcon"
    class="liao-icon"
    :class="[
      size ? `liao-icon-${size}` : '',
      spin ? 'liao-icon-spin' : '',
      customClass
    ]"
    :style="iconStyle"
    v-bind="$attrs"
    v-html="liaoIconSvg"
  >
  </span>
  <Icon
    v-else
    :icon="name"
    :class="[
      'liao-icon',
      size ? `liao-icon-${size}` : '',
      spin ? 'liao-icon-spin' : '',
      customClass
    ]"
    :style="iconStyle"
    v-bind="$attrs"
  />
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import type { PropType } from 'vue';
import { getAvailableIcons } from '../../utils/importIcons';
import { getCustomSvgIcon } from './icons';

const props = defineProps({
  name: {
    type: String,
    default: '',
    required: false
  },
  svg: {
    type: String,
    default: '',
    required: false
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large' | 'xlarge' | 'auto'>,
    default: 'medium'
  },
  color: {
    type: String,
    default: ''
  },
  spin: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  }
});

// 图标尺寸映射
const sizeMap = {
  small: '18px',
  medium: '20px',
  large: '24px',
  xlarge: '32px',
  auto: '1em'
};

// 计算图标样式
const iconStyle = computed(() => {
  const style: Record<string, string> = {};
  
  // 设置颜色，如果未指定则使用默认颜色
  style.color = props.color || ''; // 不需要在这里设置默认颜色，已在CSS中设置
  
  // 如果使用预设尺寸，添加宽高样式
  if (props.size && props.size !== 'auto') {
    const sizeValue = sizeMap[props.size as keyof typeof sizeMap];
    style.width = sizeValue;
    style.height = sizeValue;
    style.minWidth = sizeValue;
    style.minHeight = sizeValue;
  }
  
  return style;
});

// 检查是否为自定义图标库图标
const availableIcons = ref<string[]>([]);

// 直接获取SVG内容
const liaoIconSvg = computed(() => {
  if (!props.name) return '';
  
  try {
    // 1. 首先检查是否有通过registerSvgIcon注册的自定义图标
    const customSvg = getCustomSvgIcon(props.name);
    if (customSvg) {
      return customSvg;
    }
    
    // 2. 从assets/icons目录中获取SVG内容
    const svgModules = import.meta.glob<string>('../../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true });
    const iconPath = Object.keys(svgModules).find(path => {
      const filename = path.replace(/^.*[\\\/]/, '').replace(/\.\w+$/, '');
      return filename.toLowerCase() === props.name.toLowerCase();
    });
    
    if (iconPath) {
      // 获取原始SVG内容
      let svgContent = svgModules[iconPath] as string;
      
      // 修改SVG内容，移除所有fill属性，确保可以通过CSS控制
      svgContent = svgContent.replace(/fill="[^"]*"/g, 'fill="none"');
      // 确保path元素可以接收stroke颜色
      svgContent = svgContent.replace(/<path /g, '<path stroke="currentColor" ');
      
      return svgContent;
    }
    
    // console.warn(`No SVG found for icon: ${props.name}`);
    return '';
  } catch (error) {
    // console.error(`Error loading SVG for icon ${props.name}:`, error);
    return '';
  }
});

onMounted(() => {
  // 获取可用图标列表
  availableIcons.value = getAvailableIcons();
  // console.log('Available icons:', availableIcons.value);
});

const isLiaoIcon = computed(() => {
  // 使用动态获取的图标列表
  const result = availableIcons.value.includes(props.name);
  // console.log(`Checking if ${props.name} is a Liao icon:`, result);
  return result;
});

// 必须提供name或svg至少一个
if (import.meta.env.DEV) {
  if (!props.name && !props.svg) {
    // console.warn('LiaoIcon: 必须提供name或svg至少一个');
  }
}
</script>

<style lang="scss" scoped>
.liao-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.2s ease-in-out;
  position: relative;
  vertical-align: middle;
  color: #808080;
  
  // 预设尺寸类（仅作为备用，主要使用inline样式）
  &-small {
    font-size: $icon-size-sm;
  }
  
  &-medium {
    font-size: $icon-size-md;
  }
  
  &-large {
    font-size: $icon-size-lg;
  }
  
  &-xlarge {
    font-size: $icon-size-xl;
  }
  
  &-auto {
    width: 1em;
    height: 1em;
  }
  
  &-spin {
    animation: liao-icon-spin 1s linear infinite;
  }
  
  :deep(svg) {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
    
    // 优化小尺寸图标的渲染质量
    shape-rendering: geometricPrecision;
    // 对于crisp edges更好的选择是crispEdges，但某些浏览器不支持
    // shape-rendering: crispEdges;
    
    // 确保图标在不同分辨率下都清晰
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    
    // 防止抗锯齿导致的模糊
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
}

// 修复组件SVG样式
:deep([class^="icon-liao-"]) {
  display: inline-flex;
  width: 100%;
  height: 100%;
  
  svg {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: currentColor;
  }
}

@keyframes liao-icon-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style> 