<template>
  <div 
    class="liao-input-area"
    :class="{ 
      'liao-input-area-expanded': expanded,
      'liao-input-area-disabled': disabled,
      'liao-input-area-recording': isRecording,
      'liao-input-area-focused': isFocused,
      'liao-input-area-desktop': isDesktop,
      'liao-input-area-mobile': !isDesktop,
      customClass
    }"
  >
    <div v-if="$slots.before" class="liao-input-area-before">
      <slot name="before"></slot>
    </div>
    
    <!-- 文件预览列表 -->
    <LiaoFileChipList
      v-if="selectedFiles.length > 0"
      :files="selectedFiles"
      :max-name-length="20"
      @remove="handleRemoveFile"
      @preview="handlePreviewFile"
      @change="handleFileListChange"
    />
    
    <!-- 语音录制提示 -->
    <div v-if="isRecording" class="liao-input-area-recording-tip">
      <div class="liao-input-area-recording-animation">
        <div class="liao-input-area-recording-wave"></div>
        <LiaoIcon name="microphone" color="#2669FF" size="xlarge" />
      </div>
      <div class="liao-input-area-recording-text">
        松开发送，上滑取消
      </div>
    </div>
    
    <div class="liao-input-area-main">
      <!-- 主输入区域容器 -->
      <div 
        class="liao-input-area-container" 
        :class="{ 
          'liao-input-area-container-focused': isFocused 
        }"
      >
        <!-- 移动端：左侧功能区 - 仅在非聚焦状态显示 -->
        <div v-if="!isDesktop && !isFocused" class="liao-input-area-left-actions">
          <!-- 移动端：拍摄按钮 -->
          <div 
            v-if="enableCamera" 
            class="liao-input-area-action liao-input-area-camera"
            @click="handleCamera"
          >
            <LiaoIcon name="camera" size="medium" />
          </div>
        </div>
        
        <!-- 文本输入区域 -->
        <textarea
          ref="textareaRef"
          class="liao-input-area-textarea"
          :placeholder="effectivePlaceholder"
          :disabled="effectiveDisabled"
          :value="modelValue"
          @input="updateInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeyDown"
        ></textarea>
        
        <!-- 右侧功能区 -->
        <div class="liao-input-area-right-actions">
          <!-- 桌面端：文件上传按钮 - 仅在非聚焦状态显示 -->
          <div 
            v-if="isDesktop && !isFocused && enableFileUpload" 
            class="liao-input-area-action liao-input-area-upload"
            @click="handleFileUpload"
          >
            <LiaoIcon name="link" size="medium" />
          </div>
          
          <!-- 表情选择按钮 -->
          <div 
            v-if="enableEmojiInput"
            class="liao-input-area-action liao-input-area-emoji"
            @click.stop="toggleEmojiPicker"
          >
            <LiaoIcon name="emoji" size="medium" />
          </div>
          
          <!-- 发送按钮 -->
          <div 
            class="liao-input-area-action liao-input-area-send"
            :class="{ 'liao-input-area-send-active': canSend }"
            @click="sendMessage"
          >
            <LiaoIcon name="send" size="medium" :color="canSend ? 'white' : infoColor" />
          </div>
        </div>
      </div>
      
      <!-- 移动端：语音输入按钮 - 仅在非聚焦状态显示 -->
      <div 
        v-if="!isDesktop && !isFocused && showVoiceInput"
        class="liao-input-area-action liao-input-area-voice"
        @touchstart="startRecording"
        @touchend="stopRecording"
        @touchmove="handleTouchMove"
      >
        <LiaoIcon name="microphone" size="medium" />
      </div>
    </div>
    
    <!-- 表情选择器 -->
    <div 
      v-if="showEmojiPicker" 
      class="liao-input-area-emoji-picker"
    >
      <LiaoEmojiPicker @select="selectEmoji" :visible="showEmojiPicker" />
    </div>
    
    <div v-if="$slots.after" class="liao-input-area-after">
      <slot name="after"></slot>
    </div>
    
    <!-- 隐藏的文件上传input -->
    <input
      ref="fileInputRef"
      type="file"
      class="liao-input-area-file-input"
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
      @input.stop
    />
    
    <!-- 摄像头选择弹窗 -->
    <div v-if="showCameraOptions" class="liao-input-area-camera-options">
      <div class="liao-input-area-camera-options-backdrop" @click="closeCameraOptions"></div>
      <div class="liao-input-area-camera-options-content">
        <div class="liao-input-area-camera-options-title">选择方式</div>
        <div class="liao-input-area-camera-options-list">
          <div class="liao-input-area-camera-option" @click="openCamera">
            <LiaoIcon name="camera" size="large" />
            <span>拍摄照片</span>
          </div>
          <div class="liao-input-area-camera-option" @click="openGallery">
            <LiaoIcon name="image" size="large" />
            <span>从相册选择</span>
          </div>
        </div>
        <div class="liao-input-area-camera-cancel" @click="closeCameraOptions">
          <span>取消</span>
        </div>
      </div>
    </div>
    
    <!-- 摄像头捕获 - 隐藏元素 -->
    <input
      v-if="!isDesktop && enableCamera"
      ref="cameraInputRef"
      type="file"
      accept="image/*"
      capture="environment"
      class="liao-input-area-file-input"
      @change="handleCameraCapture"
      @input.stop
    />
    
    <!-- 相册选择 - 隐藏元素 -->
    <input
      v-if="!isDesktop && enableCamera"
      ref="galleryInputRef"
      type="file"
      accept="image/*"
      class="liao-input-area-file-input"
      @change="handleCameraCapture"
      @input.stop
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick, inject } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import LiaoEmojiPicker from '../LiaoEmojiPicker/LiaoEmojiPicker.vue';
import LiaoFileChipList from '../LiaoFileChipList/LiaoFileChipList.vue';
import type { LiaoSessionState, LockReason } from '../../types/session';
import { LIAO_SESSION_STATE_KEY } from '../../types/session';
import type { FileMeta } from '../../types/file';
import { createFileMeta } from '../../utils/fileUtils';

// 声明全局语音识别接口
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

// 语音识别接口
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

// 语音识别事件接口
interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

// 语音识别错误事件接口
interface SpeechRecognitionErrorEvent {
  error: string;
}

// 定义表情类型接口
interface Emoji {
  char: string;
  name: string;
  keywords?: string[];
  category?: string;
}

// 语音录制状态类型
type RecordingStatus = 'idle' | 'recording' | 'converting';

// 锁定原因到友好提示文本的映射
const lockReasonMessages: Record<Exclude<LockReason, null>, string> = {
  'AI_REPLYING': 'AI正在回复中...',
  'PLUGIN_PENDING': '请先完成当前操作...',
  'FORM_REQUIRED': '请先完成表单填写...',
  'VOTE_REQUIRED': '请先完成投票选择...',
  'CUSTOM': '输入已锁定...'
};

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '输入消息...'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  // 新增：外部锁定状态控制
  locked: {
    type: Boolean,
    default: false
  },
  // 新增：锁定原因
  lockReason: {
    type: String as PropType<LockReason>,
    default: null
  },
  expanded: {
    type: Boolean,
    default: false
  },
  accept: {
    type: String,
    default: '*/*'
  },
  multiple: {
    type: Boolean,
    default: false
  },
  showVoice: {
    type: Boolean,
    default: true
  },
  enableVoiceInput: {
    type: Boolean,
    default: true
  },
  enableEmojiInput: {
    type: Boolean,
    default: true
  },
  enableFileUpload: {
    type: Boolean,
    default: true
  },
  enableCamera: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  deviceType: {
    type: String,
    default: '',
    validator: (value: string) => ['', 'desktop', 'mobile'].includes(value)
  }
});

const emit = defineEmits([
  'update:modelValue', 
  'send', 
  'focus',
  'blur',
  'file-upload',
  'voice-record',
  'emoji-select',
  'camera-capture'
]);

// 注入全局状态管理
const sessionState = inject<LiaoSessionState | null>(LIAO_SESSION_STATE_KEY, null);

const textareaRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const cameraInputRef = ref<HTMLInputElement | null>(null);
const galleryInputRef = ref<HTMLInputElement | null>(null);

const isFocused = ref(false);
const showEmojiPicker = ref(false);
const showCameraOptions = ref(false);
const isRecording = ref(false);
const recordingCancelled = ref(false);
const textareaHeight = ref('auto');
const selectedFiles = ref<FileMeta[]>([]);

// 设备检测 - 现在支持外部传入deviceType
const isDesktop = ref(window.innerWidth >= 768);

// 添加全局CSS变量值
const infoColor = ref('#808080'); // 默认值

// 计算有效的禁用状态
const effectiveDisabled = computed(() => {
  // 优先使用外部传入的锁定状态
  if (props.locked) return true;
  
  // 然后检查全局状态管理
  if (sessionState && sessionState.isInputLocked) return true;
  
  // 最后检查组件内部状态
  return props.disabled || isRecording.value;
});

// 计算有效的占位符文本
const effectivePlaceholder = computed(() => {
  // 如果有外部传入的锁定原因，使用对应提示文本
  if (props.lockReason) {
    return lockReasonMessages[props.lockReason] || props.placeholder;
  }
  
  // 如果有全局状态管理的锁定原因，使用对应提示文本
  if (sessionState && sessionState.isInputLocked && sessionState.lockReason) {
    return lockReasonMessages[sessionState.lockReason] || props.placeholder;
  }
  
  // 如果正在录音，显示特殊提示
  if (isRecording.value) {
    return '正在录音中...';
  }
  
  // 默认使用传入的占位符
  return props.placeholder;
});

// 计算是否可以发送消息
const canSend = computed(() => {
  const hasText = props.modelValue && props.modelValue.trim && props.modelValue.trim().length > 0;
  const hasFiles = selectedFiles.value.length > 0;
  return hasText || hasFiles;
});

// 监听属性变化
watch(() => props.deviceType, (newValue) => {
  if (newValue === 'desktop') {
    isDesktop.value = true;
  } else if (newValue === 'mobile') {
    isDesktop.value = false;
  }
}, { immediate: true });

// 监听窗口尺寸变化
onMounted(() => {
  // 只有在未指定deviceType时，才根据窗口尺寸自动判断
  if (!props.deviceType) {
    window.addEventListener('resize', handleResize);
  }
  
  document.addEventListener('click', handleOutsideClick);
  adjustTextareaHeight();
  
  // 获取CSS变量的值
  const cssVar = getComputedStyle(document.documentElement).getPropertyValue('--info-color');
  if (cssVar) {
    infoColor.value = cssVar.trim();
  }
  
  // 初始化表情选择器
  showEmojiPicker.value = false;
  console.log('组件挂载完成，表情选择器状态:', showEmojiPicker.value);
});

const handleResize = () => {
  // 只有在未指定deviceType时，才根据窗口尺寸自动判断
  if (!props.deviceType) {
    isDesktop.value = window.innerWidth >= 768;
  }
};

// 处理点击外部关闭表情选择器
const handleOutsideClick = (e: MouseEvent) => {
  if (!showEmojiPicker.value) return;
  
  const target = e.target as HTMLElement;
  const isEmojiClick = target.closest('.liao-input-area-emoji-picker') || 
                       target.closest('.liao-input-area-emoji');
  
  console.log('handleOutsideClick:', { isEmojiClick, target });
  
  if (!isEmojiClick) {
    console.log('关闭表情选择器');
    showEmojiPicker.value = false;
  }
};

// 输入框高度自适应
const adjustTextareaHeight = () => {
  if (!textareaRef.value) return;
  
  // 先重置高度，以便正确计算新的高度
  textareaRef.value.style.height = 'auto';
  
  // 移动端下，根据聚焦状态设置高度
  if (!isDesktop.value) {
    if (isFocused.value) {
      // 聚焦状态：最小两行高度，然后根据内容自适应
      const minHeight = 30 * 2 + 16; // 字体大小 * 2行 + 内边距
      textareaRef.value.style.height = `${Math.max(textareaRef.value.scrollHeight, minHeight)}px`;
    } else {
      // 非聚焦状态：一行高度
      textareaRef.value.style.height = '30px'; // 字体大小 * 1行
    }
  } else {
    // 桌面端：始终自适应高度
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`;
  }
};

// 监听输入内容变化，调整高度
watch(() => props.modelValue, () => {
  nextTick(adjustTextareaHeight);
});

// 处理输入更新
const updateInput = (e: Event) => {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
  adjustTextareaHeight();
};

// 处理聚焦
const handleFocus = () => {
  isFocused.value = true;
  emit('focus');
  // 在状态变化后使用nextTick确保DOM已更新
  nextTick(adjustTextareaHeight);
};

// 处理失焦
const handleBlur = (e: FocusEvent) => {
  // 检查点击目标是否为表情选择器或其子元素
  const isEmojiPickerClick = e.relatedTarget && 
    (e.relatedTarget as HTMLElement).closest('.liao-input-area-emoji-picker, .liao-input-area-emoji');
  
  if (isEmojiPickerClick) {
    // 如果点击的是表情选择器，保持聚焦状态
    nextTick(() => {
      if (textareaRef.value) {
        textareaRef.value.focus();
      }
    });
    return;
  }
  
  isFocused.value = false;
  emit('blur');
  
  // 延迟关闭表情选择器，避免交互问题
  setTimeout(() => {
    if (!isFocused.value) {
      showEmojiPicker.value = false;
    }
  }, 150);
  
  // 在状态变化后使用nextTick确保DOM已更新
  nextTick(adjustTextareaHeight);
};

// 处理按键
const handleKeyDown = (e: KeyboardEvent) => {
  // Enter发送，Shift+Enter换行
  if (e.key === 'Enter' && !e.shiftKey && isDesktop.value) {
    e.preventDefault();
    sendMessage();
  }
};

// 发送消息
const sendMessage = () => {
  if (effectiveDisabled.value) return;
  
  const hasText = props.modelValue && props.modelValue.trim && props.modelValue.trim().length > 0;
  const hasFiles = selectedFiles.value.length > 0;
  
  if (!hasText && !hasFiles) return;
  
  // 发送文本消息
  if (hasText) {
    emit('send', props.modelValue);
    emit('update:modelValue', '');
  }
  
  // 发送文件
  if (hasFiles) {
    // 将FileMeta转换为FileList格式发送
    const fileArray = selectedFiles.value.map(fileMeta => fileMeta.file).filter(Boolean) as File[];
    const fileList = new DataTransfer();
    fileArray.forEach(file => fileList.items.add(file));
    emit('file-upload', fileList.files);
    
    // 清空选中的文件列表
    selectedFiles.value = [];
  }
  
  // 重置输入框高度
  nextTick(adjustTextareaHeight);
};

// 切换表情选择器
const toggleEmojiPicker = () => {
  console.log('toggleEmojiPicker: 之前状态', showEmojiPicker.value);
  showEmojiPicker.value = !showEmojiPicker.value;
  console.log('toggleEmojiPicker: 之后状态', showEmojiPicker.value);
  
  // 如果打开表情选择器，确保输入框保持聚焦状态
  if (showEmojiPicker.value && textareaRef.value) {
    textareaRef.value.focus();
    isFocused.value = true; // 确保聚焦状态更新
  }
};

// 选择表情
const selectEmoji = (emoji: Emoji) => {
  const currentValue = props.modelValue || '';
  const newValue = currentValue + emoji.char;
  emit('update:modelValue', newValue);
  emit('emoji-select', emoji);
  
  // 保持表情选择器打开，允许多次选择
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.focus();
      isFocused.value = true; // 确保聚焦状态更新
    }
  });
};

// 文件上传相关
const handleFileUpload = () => {
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handleFileChange = (e: Event) => {
  e.preventDefault(); // 阻止默认行为
  e.stopPropagation(); // 阻止事件冒泡
  
  const target = e.target as HTMLInputElement;
  const files = target.files;
  
  if (files && files.length > 0) {
    // 将文件转换为FileMeta格式并添加到选中列表
    const newFiles: FileMeta[] = Array.from(files).map(file => createFileMeta(file));
    selectedFiles.value.push(...newFiles);
    console.log('handleFileChange:', newFiles);
    // 重置input，以便能够重复选择同一文件
    target.value = '';
  }
};

// 语音录制相关
const startRecording = (e: TouchEvent) => {
  if (props.disabled) return;
  
  e.preventDefault();
  isRecording.value = true;
  recordingCancelled.value = false;
  emit('voice-record', { status: 'start' });
};

const stopRecording = (e: TouchEvent) => {
  if (!isRecording.value) return;
  
  e.preventDefault();
  isRecording.value = false;
  
  if (!recordingCancelled.value) {
    emit('voice-record', { status: 'stop' });
  } else {
    emit('voice-record', { status: 'cancel' });
  }
  
  recordingCancelled.value = false;
};

const handleTouchMove = (e: TouchEvent) => {
  if (!isRecording.value) return;
  
  // 向上滑动取消录音
  const touch = e.touches[0];
  const element = e.target as HTMLElement;
  const moveY = element.getBoundingClientRect().top - touch.clientY;
  
  if (moveY > 50) {
    recordingCancelled.value = true;
  } else {
    recordingCancelled.value = false;
  }
};

// 相机/相册相关
const handleCamera = () => {
  console.log('Camera button clicked');
  
  // 移动端直接尝试调用相机
  if (!isDesktop.value && cameraInputRef.value) {
    cameraInputRef.value.click();
  } else {
    // 显示选项弹窗
    showCameraOptions.value = true;
  }
};

const closeCameraOptions = () => {
  showCameraOptions.value = false;
};

const openCamera = () => {
  if (cameraInputRef.value) {
    cameraInputRef.value.click();
  }
  showCameraOptions.value = false;
};

const openGallery = () => {
  if (galleryInputRef.value) {
    galleryInputRef.value.click();
  }
  showCameraOptions.value = false;
};

const handleCameraCapture = (e: Event) => {
  e.preventDefault(); // 阻止默认行为
  e.stopPropagation(); // 阻止事件冒泡
  
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    // 将文件转换为FileMeta格式并添加到选中列表
    const newFiles: FileMeta[] = Array.from(files).map(file => createFileMeta(file));
    selectedFiles.value.push(...newFiles);
    
    // 重置input，以便能够重复选择同一文件
    target.value = '';
  }
};

// 新增：处理文件移除
const handleRemoveFile = (fileId: string) => {
  selectedFiles.value = selectedFiles.value.filter(file => file.id !== fileId);
};

// 新增：处理文件预览
const handlePreviewFile = (fileId: string) => {
  const file = selectedFiles.value.find(f => f.id === fileId);
  if (file) {
    // 这里可以添加文件预览逻辑，比如打开文件预览弹窗
    console.log('预览文件:', file);
  }
};

// 新增：处理文件列表变化
const handleFileListChange = (files: FileMeta[]) => {
  selectedFiles.value = files;
};

// 计算属性：是否显示语音输入
const showVoiceInput = computed(() => {
  // 同时支持showVoice和enableVoiceInput属性
  return props.showVoice && props.enableVoiceInput;
});

// 添加组件卸载前的清理逻辑
onBeforeUnmount(() => {
  if (!props.deviceType) {
    window.removeEventListener('resize', handleResize);
  }
  document.removeEventListener('click', handleOutsideClick);
});
</script>

<style lang="scss" scoped>

.liao-input-area {
  display: flex;
  flex-direction: column;
  background-color: $bg-secondary;
  padding: $spacing-md;
  padding-top: calc(#{$spacing-md} + 20px); // 增加顶部间距，为快捷卡片腾出空间
  transition: all $transition-duration $transition-timing-function;
  position: relative;
  border-radius: $border-radius-lg $border-radius-lg 0 0; // 添加顶部圆角
  margin-top: -$border-radius-lg; // 创建与消息列表的重叠效果
  z-index: 1; // 设置层级低于快捷卡片
  
  &-main {
    display: flex;
    align-items: flex-end;
    gap: $spacing-sm;
  }
  
  &-before,
  &-after {
    margin-bottom: $spacing-md;
  }
  
  &-container {
    flex: 1;
    display: flex;
    align-items: center;
    background-color: white;
    border-radius: $border-radius-md;
    border: 1px solid $border-color;
    padding: $spacing-xs;
    transition: all $transition-duration $transition-timing-function;
    box-shadow: $shadow-sm;
    
    &-focused {
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
    }
  }
  
  &-left-actions,
  &-right-actions {
    display: flex;
    align-items: center;
  }
  
  &-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: $border-radius-circle;
    cursor: pointer;
    transition: all $transition-duration-fast $transition-timing-function;
    color: $text-secondary;
    
    &:hover {
      background-color: rgba($secondary-color, 0.05);
    }
    
    &:active {
      background-color: rgba($secondary-color, 0.1);
    }
  }
  
  &-send {
    color: $text-disabled;
    transition: all 0.2s ease-in-out;
    
    &-active {
      background-color: $primary-color;
      color: white !important; /* 强制激活状态下使用白色 */
      
      .liao-icon {
        color: white !important; /* 强制图标使用白色 */
      }
      
      &:hover {
        background-color: color.adjust($primary-color, $lightness: -5%);
      }
      
      &:active {
        background-color: color.adjust($primary-color, $lightness: -10%);
      }
    }
  }
  
  &-textarea {
    flex: 1;
    border: none;
    outline: none;
    padding: $spacing-xs $spacing-sm;
    font-size: $font-size-md;
    resize: none;
    overflow-y: auto;
    background-color: transparent;
    line-height: 1.4;
    min-height: 20px; // 默认一行高度
    transition: height 0.15s ease; // 添加高度变化的平滑过渡
    
    // 在聚焦状态下增加左侧内边距，填补隐藏按钮的空间
    .liao-input-area-mobile.liao-input-area-focused & {
      padding-left: calc(#{$spacing-sm} + 4px);
    }
    
    // 隐藏滚动条
    &::-webkit-scrollbar {
      width: 0px;
      background: transparent;
    }
    
    scrollbar-width: none; // Firefox
    -ms-overflow-style: none; // IE and Edge
  }
  
  &-file-input {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
  
  &-emoji-picker {
    position: absolute;
    bottom: 100%;
    right: 0;
    z-index: 1000;
    margin-bottom: $spacing-sm;
    background-color: white;
    border-radius: $border-radius-md;
    box-shadow: $shadow-lg;
    border: 1px solid $border-color;
    overflow: hidden;
    max-width: 350px;
    max-height: 350px;
    display: block !important; /* 确保显示 */
    
    @media (max-width: 767px) {
      left: 0;
      right: 0;
      max-width: 100%;
    }
  }
  
  &-emoji-picker-container {
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    z-index: 1000;
  }
  
  &-emoji-picker-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }
  
  &-camera-options {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    
    &-backdrop {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    &-content {
      position: relative;
      width: 100%;
      background-color: white;
      border-radius: $border-radius-lg $border-radius-lg 0 0;
      padding: $spacing-lg;
      display: flex;
      flex-direction: column;
      z-index: 1;
    }
    
    &-title {
      text-align: center;
      margin-bottom: $spacing-lg;
      font-weight: 500;
      font-size: $font-size-lg;
      color: $text-primary;
    }
    
    &-list {
      display: flex;
      justify-content: space-around;
      margin-bottom: $spacing-lg;
    }
  }
  
  &-camera-option {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;
    background-color: $bg-secondary;
    border-radius: $border-radius-lg;
    width: 120px;
    
    span {
      margin-top: $spacing-md;
      font-size: $font-size-md;
      color: $text-primary;
    }
    
    &:active {
      background-color: color.adjust($bg-secondary, $lightness: -5%);
    }
  }
  
  &-camera-cancel {
    padding: $spacing-md;
    margin-top: $spacing-md;
    text-align: center;
    font-size: $font-size-md;
    color: $text-secondary;
    border-radius: $border-radius-md;
    background-color: $bg-secondary;
    
    &:active {
      background-color: color.adjust($bg-secondary, $lightness: -5%);
    }
  }
  
  &-recording-tip {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-lg;
  }
  
  &-recording-animation {
    position: relative;
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: $spacing-md;
  }
  
  &-recording-wave {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background-color: rgba($primary-color, 0.1);
    animation: wave-animation 1.5s infinite;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 50%;
      background-color: rgba($primary-color, 0.1);
      animation: wave-animation 1.5s infinite;
    }
    
    &::before {
      animation-delay: 0.5s;
    }
    
    &::after {
      animation-delay: 1s;
    }
  }
  
  @keyframes wave-animation {
    0% {
      transform: scale(0.5);
      opacity: 1;
    }
    100% {
      transform: scale(1.5);
      opacity: 0;
    }
  }
  
  &-recording-status {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: $font-size-md;
    color: $text-primary;
  }
  
  &-recording-cancel-btn {
    margin-top: $spacing-md;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: $spacing-xs $spacing-md;
    border: none;
    border-radius: $border-radius-md;
    background-color: $bg-secondary;
    color: $danger-color;
    cursor: pointer;
    
    .liao-icon {
      margin-right: $spacing-xs;
    }
    
    &:hover {
      background-color: rgba($danger-color, 0.1);
    }
  }
  
  &-left-actions {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
    margin-right: $spacing-xs;
  }
  
  &-right-actions {
    display: flex;
    align-items: center;
    gap: $spacing-xs;
  }
  
  &-emoji-mobile {
    color: $text-secondary;
    
    &:active {
      color: $primary-color;
    }
  }
  
  &-camera {
    color: $primary-color;
    
    @media (max-width: 767px) {
      margin-right: $spacing-xs;
    }
  }
  
  // 移动端布局样式调整
  &-mobile {
    .liao-input-area-container {
      flex: 1;
    }
    
    .liao-input-area-main {
      display: flex;
      align-items: center;
      gap: $spacing-sm;
    }
    
    // 聚焦状态下调整左侧操作区
    &.liao-input-area-focused {
      .liao-input-area-camera,
      .liao-input-area-emoji-mobile {
        transform: scale(0.9);
        opacity: 0.8;
      }
      
      .liao-input-area-voice {
        transform: scale(0.9);
        opacity: 0.8;
      }
    }
    
    .liao-input-area-voice {
      // 无需额外样式，使用统一的action样式
    }
  }
}
</style> 