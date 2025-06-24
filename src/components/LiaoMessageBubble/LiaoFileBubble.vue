<template>
  <div 
    class="liao-message-bubble liao-file-message-bubble" 
    :class="[
      `liao-message-bubble--${actualMessageType}`,
      `liao-file-bubble--${actualFileStatus}`,
      `liao-file-bubble--layout-${props.layout}`,
      { 
        'liao-message-bubble--self': actualMessageType === 'self',
        'liao-message-bubble--other': actualMessageType === 'other',
        'liao-message-bubble--show-avatar': shouldShowAvatar,
        'liao-message-bubble--show-name': shouldShowName,
        'liao-message-bubble--show-time': shouldShowTime,
        'liao-file-bubble--no-message': props.layout !== 'bubble'
      }
    ]"
  >
    <!-- 头像（仅在bubble模式显示） -->
    <div v-if="shouldShowAvatar && props.layout === 'bubble'" class="liao-message-bubble-avatar">
      <img v-if="avatar" :src="avatar" :alt="userName || '头像'" />
      <div v-else class="liao-message-bubble-avatar-placeholder">
        <LiaoIcon name="user" />
      </div>
    </div>

    <!-- 消息内容区 -->
    <div class="liao-message-bubble-content">
      <!-- 用户名（仅在bubble模式显示） -->
      <div v-if="shouldShowName && props.layout === 'bubble'" class="liao-message-bubble-name">
        {{ userName }}
      </div>

      <!-- 文件气泡主体 -->
      <div class="liao-file-bubble-wrapper">
        <div 
          class="liao-file-bubble"
          :class="[
            `bubble-${actualMessageType}`,
            `status-${actualFileStatus}`,
            `layout-${props.layout}`,
            { 
              'is-clickable': isClickable,
              'is-downloading': isDownloading
            }
          ]"
          @click="handleBubbleClick"
        >
          <!-- 文件图标区域 -->
          <div class="liao-file-bubble-icon" :style="{ backgroundColor: iconBgColor }">
            <LiaoIcon :name="fileIcon" :style="{ color: iconColor }" size="large" />
            
            <!-- 状态指示器 -->
            <div 
              v-if="actualFileStatus !== 'success'"
              class="liao-file-bubble-status"
              :class="`status-${actualFileStatus}`"
            >
              <LiaoIcon 
                v-if="actualFileStatus === 'uploading'" 
                name="loading" 
                size="small" 
                spin 
                color="white"
              />
              <LiaoIcon 
                v-else-if="actualFileStatus === 'waiting'" 
                name="time" 
                size="small" 
                color="white"
              />
              <LiaoIcon 
                v-else-if="actualFileStatus === 'error'" 
                name="close" 
                size="small" 
                color="white"
              />
            </div>
          </div>
          
          <!-- 文件信息区域 -->
          <div class="liao-file-bubble-content">
            <!-- 文件名 -->
            <div class="liao-file-bubble-name" :title="actualFileName">
              {{ truncatedName }}
            </div>
            
            <!-- 文件大小和类型 -->
            <div class="liao-file-bubble-meta">
              <span class="liao-file-bubble-size">{{ formattedSize }}</span>
              <span v-if="actualFileType" class="liao-file-bubble-type">{{ fileTypeText }}</span>
            </div>
            
            <!-- 上传进度 -->
            <div 
              v-if="actualFileStatus === 'uploading' && actualFileProgress !== undefined"
              class="liao-file-bubble-progress"
            >
              <div class="liao-file-bubble-progress-bar">
                <div 
                  class="liao-file-bubble-progress-fill"
                  :style="{ width: actualFileProgress + '%' }"
                ></div>
              </div>
              <span class="liao-file-bubble-progress-text">{{ actualFileProgress }}%</span>
            </div>
            
            <!-- 错误信息 -->
            <div v-if="actualFileStatus === 'error' && actualFileError" class="liao-file-bubble-error">
              <LiaoIcon name="error" size="small" />
              <span>{{ actualFileError }}</span>
            </div>
          </div>
          
          <!-- 操作区域 -->
          <div class="liao-file-bubble-actions" @click.stop>
            <!-- 下载按钮（当文件成功上传且有URL时显示） -->
            <button
              v-if="actualFileStatus === 'success' && actualFileUrl"
              class="liao-file-bubble-action liao-file-bubble-download"
              :class="{ 'is-loading': isDownloading }"
              :disabled="isDownloading"
              @click.stop="handleDownload"
              title="下载文件"
            >
              <LiaoIcon 
                v-if="isDownloading"
                name="loading" 
                size="small" 
                spin 
              />
              <LiaoIcon 
                v-else
                name="download" 
                size="small" 
              />
            </button>
            
            <!-- 重试按钮 -->
            <button
              v-if="actualFileStatus === 'error' && showRetry"
              class="liao-file-bubble-action liao-file-bubble-retry"
              @click.stop="handleRetry"
              title="重试上传"
            >
              <LiaoIcon name="refresh" size="small" />
            </button>
            
            <!-- 更多操作按钮 -->
            <button
              v-if="showMoreActions"
              class="liao-file-bubble-action liao-file-bubble-more"
              @click.stop="handleMoreActions"
              title="更多操作"
            >
              <LiaoIcon name="more" size="small" />
            </button>
          </div>
        </div>
      </div>

      <!-- 时间戳（仅在bubble模式显示） -->
      <div v-if="shouldShowTime && props.layout === 'bubble'" class="liao-message-bubble-time">
        {{ formattedTime }}
      </div>
    </div>
  </div>

  <!-- 预览弹窗 -->
  <div v-if="previewVisible" class="liao-file-preview-modal">
    <div class="liao-file-preview-modal-content">
      <div class="liao-file-preview-modal-header">
        <h3>{{ previewType === 'text' ? '文本预览' : previewType === 'image' ? '图片预览' : previewType === 'video' ? '视频预览' : previewType === 'audio' ? '音频预览' : '文档预览' }}</h3>
        <button @click="closePreview">
          <LiaoIcon name="close" size="small" />
        </button>
      </div>
      <div class="liao-file-preview-modal-body">
        <div v-if="previewType === 'text'" class="liao-file-preview-modal-text">
          <!-- Markdown渲染内容 -->
          <div 
            v-if="isMarkdownContent" 
            class="liao-file-preview-markdown"
            v-html="previewRenderedContent"
          ></div>
          <!-- 普通文本内容 -->
          <pre v-else class="liao-file-preview-plain-text">{{ previewContent }}</pre>
        </div>
        <div v-else-if="previewType === 'image'" class="liao-file-preview-modal-image">
          <img :src="previewContent" alt="预览图片" />
        </div>
        <div v-else-if="previewType === 'video'" class="liao-file-preview-modal-video">
          <video :src="previewContent" controls></video>
        </div>
        <div v-else-if="previewType === 'audio'" class="liao-file-preview-modal-audio">
          <audio :src="previewContent" controls></audio>
        </div>
        <div v-else class="liao-file-preview-modal-document">
          <p>无法预览该类型的文件。</p>
        </div>
      </div>
      <div v-if="previewLoading" class="liao-file-preview-modal-loading">
        <LiaoIcon name="loading" size="large" spin />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { marked } from 'marked';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import type { FileMessageStatus } from '../../types/file';
import { 
  getFileTypeConfig, 
  formatFileSize, 
  truncateFileName,
  isPreviewableByMimeType 
} from '../../utils/fileUtils';

// Props定义 - 兼容两种命名方式
interface Props {
  // 文件信息 - 兼容两种命名方式
  fileName?: string;
  name?: string;
  fileSize?: number;
  size?: number;
  fileType?: string;
  type?: string;
  fileUrl?: string;
  url?: string;
  fileStatus?: FileMessageStatus;
  status?: FileMessageStatus;
  fileProgress?: number;
  progress?: number;
  fileError?: string;
  errorMessage?: string;
  maxNameLength?: number;
  
  // 消息气泡相关
  messageType?: 'self' | 'other';
  avatar?: string;
  showAvatar?: boolean;
  showAvatarSelf?: boolean;
  userName?: string;
  showName?: boolean;
  time?: string | Date | number;
  showTime?: boolean;
  messageStatus?: 'sending' | 'sent' | 'failed' | 'streaming';
  
  // 气泡位置（向后兼容）
  position?: 'left' | 'right';
  
  // 布局模式 - 新增
  layout?: 'bubble' | 'list' | 'card';
  
  // 操作控制
  showMainAction?: boolean;
  showRetry?: boolean;
  showMoreActions?: boolean;
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  fileName: '',
  name: '',
  fileSize: 0,
  size: 0,
  fileType: '',
  type: '',
  fileUrl: '',
  url: '',
  fileStatus: 'waiting',
  status: 'success',
  fileProgress: 0,
  progress: 0,
  fileError: '',
  errorMessage: '',
  maxNameLength: 30,
  messageType: 'other',
  avatar: '',
  showAvatar: true,
  showAvatarSelf: false,
  userName: '',
  showName: true,
  showTime: true,
  messageStatus: 'sent',
  position: 'right',
  layout: 'bubble',
  showMainAction: true,
  showRetry: true,
  showMoreActions: false,
  clickable: true
});

// 事件定义
const emit = defineEmits<{
  preview: [file: any];
  download: [file: any];
  retry: [file: any];
  more: [file: any];
  moreActions: [file: any];
  click: [file: any];
}>();

// 响应式状态
const isDownloading = ref(false);
const previewVisible = ref(false);
const previewContent = ref('');
const previewRenderedContent = ref(''); // 渲染后的HTML内容
const previewType = ref<'text' | 'image' | 'video' | 'audio' | 'document'>('document');
const previewLoading = ref(false);
const isMarkdownContent = ref(false); // 标识是否为Markdown内容

// 计算属性 - 文件属性标准化（兼容两种命名方式）
const actualFileName = computed(() => props.fileName || props.name || '未知文件');
const actualFileSize = computed(() => props.fileSize || props.size || 0);
const actualFileType = computed(() => props.fileType || props.type || '');
const actualFileUrl = computed(() => props.fileUrl || props.url || '');
const actualFileStatus = computed(() => props.fileStatus || props.status || 'waiting');
const actualFileProgress = computed(() => props.fileProgress || props.progress || 0);
const actualFileError = computed(() => props.fileError || props.errorMessage || '');

// 计算属性 - 消息类型（兼容position属性）
const actualMessageType = computed(() => {
  if (props.messageType) return props.messageType;
  if (props.position === 'left') return 'other';
  if (props.position === 'right') return 'self';
  return 'other';
});

// 计算属性 - 文件类型配置
const fileTypeConfig = computed(() => getFileTypeConfig(actualFileName.value, actualFileType.value));
const fileIcon = computed(() => fileTypeConfig.value.icon);
const iconColor = computed(() => fileTypeConfig.value.color);
const iconBgColor = computed(() => `${fileTypeConfig.value.color}20`);
const fileTypeText = computed(() => {
  if (actualFileType.value) {
    return actualFileType.value.split('/').pop()?.toUpperCase() || '';
  }
  return '';
});

// 计算属性 - 文件信息格式化
const formattedSize = computed(() => formatFileSize(actualFileSize.value));
const truncatedName = computed(() => truncateFileName(actualFileName.value, props.maxNameLength));

// 计算属性 - 交互状态
const isPreviewableFile = computed(() => isPreviewableByMimeType(actualFileType.value));
const isClickable = computed(() => 
  props.clickable && actualFileStatus.value === 'success' && (isPreviewableFile.value || actualFileUrl.value)
);
const canPerformAction = computed(() => 
  actualFileStatus.value === 'success' && !isDownloading.value
);

// 计算属性 - 主操作
const mainActionIcon = computed(() => {
  if (isPreviewableFile.value) return 'eye';
  return 'download';
});
const mainActionTitle = computed(() => {
  if (isPreviewableFile.value) return '预览文件';
  return '下载文件';
});

// 计算属性 - 消息气泡显示逻辑
const shouldShowAvatar = computed(() => {
  if (actualMessageType.value === 'self') {
    return props.showAvatarSelf;
  }
  return props.showAvatar;
});
const shouldShowName = computed(() => props.showName && actualMessageType.value === 'other');
const shouldShowTime = computed(() => props.showTime);

// 计算属性 - 时间格式化
const formattedTime = computed(() => {
  if (!props.time) return '';
  
  const date = new Date(props.time);
  if (isNaN(date.getTime())) return '';
  
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于1分钟显示"刚刚"
  if (diff < 60000) {
    return '刚刚';
  }
  
  // 小于1小时显示分钟
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}分钟前`;
  }
  
  // 小于24小时显示小时
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}小时前`;
  }
  
  // 超过24小时显示具体时间
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// 文件预览功能
const canPreview = computed(() => {
  if (!actualFileType.value && !actualFileName.value) return false;
  
  // 使用文件名获取扩展名
  const extension = actualFileName.value.split('.').pop()?.toLowerCase() || '';
  const mimeType = actualFileType.value.toLowerCase();
  
  // 文本文件类型 - 支持扩展名和MIME类型双重判断
  const textTypes = [
    'txt', 'md', 'json', 'csv', 'log', 'xml', 'yaml', 'yml',
    'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss',
    'sass', 'less', 'py', 'java', 'c', 'cpp', 'h', 'php'
  ];
  
  // 图片文件类型
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  
  // 视频文件类型
  const videoTypes = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv'];
  
  // 音频文件类型
  const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  // 通过扩展名判断
  const extensionSupported = textTypes.includes(extension) || 
                            imageTypes.includes(extension) || 
                            videoTypes.includes(extension) || 
                            audioTypes.includes(extension);
  
  // 通过MIME类型判断
  const mimeSupported = mimeType.startsWith('text/') ||
                       mimeType.startsWith('image/') ||
                       mimeType.startsWith('video/') ||
                       mimeType.startsWith('audio/') ||
                       mimeType === 'application/json' ||
                       mimeType === 'application/xml';
  
  return extensionSupported || mimeSupported;
});

// 获取预览类型
const getPreviewType = (fileType: string, fileName: string = ''): 'text' | 'image' | 'video' | 'audio' | 'document' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const mimeType = fileType.toLowerCase();
  
  const textTypes = [
    'txt', 'md', 'json', 'csv', 'log', 'xml', 'yaml', 'yml',
    'js', 'ts', 'jsx', 'tsx', 'vue', 'html', 'css', 'scss',
    'sass', 'less', 'py', 'java', 'c', 'cpp', 'h', 'php'
  ];
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'];
  const videoTypes = ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv', 'flv'];
  const audioTypes = ['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'];
  
  // 通过扩展名判断
  if (textTypes.includes(extension)) return 'text';
  if (imageTypes.includes(extension)) return 'image';
  if (videoTypes.includes(extension)) return 'video';
  if (audioTypes.includes(extension)) return 'audio';
  
  // 通过MIME类型判断
  if (mimeType.startsWith('text/') || mimeType === 'application/json' || mimeType === 'application/xml') return 'text';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  
  return 'document';
};

// 读取文件内容
const readFileContent = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('无法读取文件内容'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };
    
    reader.readAsText(file);
  });
};

// 读取URL内容（用于Base64数据或外部文件）
const readUrlContent = async (url: string): Promise<string> => {
  try {
    // 如果是Base64 data URL，直接解码
    if (url.startsWith('data:text/') || url.startsWith('data:application/json')) {
      const base64Data = url.split(',')[1];
      if (base64Data) {
        return atob(base64Data);
      }
    }
    
    // 对于其他URL，尝试fetch
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return await response.text();
  } catch (error: unknown) {
    console.error('读取URL内容失败:', error);
    throw new Error('无法读取文件内容');
  }
};

// 打开预览
const openPreview = async () => {
  console.group(`👁️ [打开预览] ${new Date().toLocaleTimeString()}`);
  console.log('📄 文件信息:', {
    名称: actualFileName.value,
    类型: actualFileType.value,
    URL: actualFileUrl.value,
    可预览: canPreview.value
  });
  
  if (!canPreview.value) {
    console.warn('❌ 文件类型不支持预览');
    console.groupEnd();
    return;
  }
  
  previewType.value = getPreviewType(actualFileType.value || '', actualFileName.value);
  previewVisible.value = true;
  
  console.log('🎯 预览类型:', previewType.value);
  console.log('👀 预览弹窗已显示');
  
  // 根据文件类型设置预览内容
  if (previewType.value === 'text') {
    previewLoading.value = true;
    try {
      let textContent = '';
      if (fileObject.value) {
        console.log('📖 读取File对象内容');
        textContent = await readFileContent(fileObject.value);
      } else if (actualFileUrl.value) {
        console.log('🌐 读取URL内容:', actualFileUrl.value);
        textContent = await readUrlContent(actualFileUrl.value);
      } else {
        console.warn('⚠️ 无File对象或URL，使用示例内容');
        textContent = `文件名: ${actualFileName.value}\n文件大小: ${formattedSize.value}\n文件类型: ${actualFileType.value}\n\n这是一个示例预览内容，实际文件内容需要通过File对象或有效的URL获取。`;
      }
      
      previewContent.value = textContent;
      
      // 判断是否为Markdown文件并进行渲染
      isMarkdownContent.value = isMarkdownFile(actualFileName.value, actualFileType.value);
      
      if (isMarkdownContent.value) {
        console.log('📝 检测到Markdown文件，开始渲染');
        previewRenderedContent.value = await renderMarkdown(textContent);
        console.log('✅ Markdown渲染完成');
      } else {
        console.log('📄 普通文本文件，无需渲染');
        previewRenderedContent.value = textContent;
      }
      
      console.log('✅ 文本内容读取成功，长度:', previewContent.value.length);
    } catch (error: unknown) {
      console.error('❌ 读取文件内容失败:', error);
      previewContent.value = `读取文件内容失败: ${error instanceof Error ? error.message : '未知错误'}\n\n文件信息:\n- 名称: ${actualFileName.value}\n- 大小: ${formattedSize.value}\n- 类型: ${actualFileType.value}`;
      previewRenderedContent.value = previewContent.value;
      isMarkdownContent.value = false;
    } finally {
      previewLoading.value = false;
    }
  } else if (previewType.value === 'image' || previewType.value === 'video' || previewType.value === 'audio') {
    // 对于媒体文件，直接使用URL
    previewContent.value = actualFileUrl.value || '';
    console.log('🖼️ 媒体文件预览URL:', previewContent.value);
  }
  
  console.groupEnd();
};

// 关闭预览
const closePreview = () => {
  previewVisible.value = false;
  previewContent.value = '';
  previewRenderedContent.value = '';
  previewLoading.value = false;
  isMarkdownContent.value = false;
};

// 下载文件
const handleDownload = async () => {
  if (!actualFileUrl.value) return;
  
  isDownloading.value = true;
  
  try {
    const fileObj = createFileObject();
    emit('download', fileObj);
    
    // 如果有URL，尝试下载
    if (actualFileUrl.value) {
      const link = document.createElement('a');
      link.href = actualFileUrl.value;
      link.download = actualFileName.value;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
    
    // 模拟下载延迟
    await new Promise(resolve => setTimeout(resolve, 1000));
  } catch (error) {
    console.error('下载失败:', error);
  } finally {
    isDownloading.value = false;
  }
};

// 添加文件对象引用
const fileObject = ref<File | null>(null);

// 创建文件对象
const createFileObject = () => ({
  id: actualFileName.value,
  name: actualFileName.value,
  size: actualFileSize.value,
  type: actualFileType.value,
  url: actualFileUrl.value,
  status: actualFileStatus.value,
  progress: actualFileProgress.value,
  error: actualFileError.value
});

// 添加调试监听器
onMounted(() => {
  console.group(`🎬 [文件气泡初始化] ${new Date().toLocaleTimeString()}`);
  console.log('📄 初始文件信息:', {
    名称: actualFileName.value,
    大小: formattedSize.value,
    类型: actualFileType.value,
    URL: actualFileUrl.value,
    状态: actualFileStatus.value,
    进度: actualFileProgress.value
  });
  console.log('🎭 组件状态:', {
    消息类型: actualMessageType.value,
    可点击: isClickable.value,
    可预览: isPreviewableFile.value,
    可执行操作: canPerformAction.value,
    主操作类型: mainActionIcon.value
  });
  console.groupEnd();
});

// 监听文件状态变化
watch(actualFileStatus, (newStatus, oldStatus) => {
  if (newStatus !== oldStatus) {
    console.log(`📊 [文件状态变化] ${oldStatus} → ${newStatus}`, {
      文件名: actualFileName.value,
      时间: new Date().toLocaleTimeString(),
      进度: actualFileProgress.value,
      错误: actualFileError.value
    });
  }
});

// 监听下载状态变化
watch(isDownloading, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    console.log(`⏳ [下载状态变化] ${oldValue} → ${newValue}`, {
      文件名: actualFileName.value,
      时间: new Date().toLocaleTimeString()
    });
  }
});

// 监听文件进度变化
watch(actualFileProgress, (newProgress, oldProgress) => {
  if (newProgress !== oldProgress) {
    console.log(`📈 [文件进度更新] ${oldProgress}% → ${newProgress}%`, {
      文件名: actualFileName.value,
      时间: new Date().toLocaleTimeString()
    });
  }
});

// 事件处理
const handleBubbleClick = () => {
  console.group(`🎯 [气泡点击] ${new Date().toLocaleTimeString()}`);
  console.log('📄 文件信息:', {
    名称: actualFileName.value,
    状态: actualFileStatus.value,
    可预览: canPreview.value
  });
  
  if (actualFileStatus.value === 'success' && canPreview.value) {
    console.log('✅ 触发预览');
    openPreview();
  } else {
    console.log('❌ 不满足预览条件');
  }
  
  emit('click', {
    id: actualFileName.value,
    name: actualFileName.value,
    size: actualFileSize.value,
    type: actualFileType.value,
    url: actualFileUrl.value,
    status: actualFileStatus.value,
    progress: actualFileProgress.value,
    error: actualFileError.value
  });
  
  console.groupEnd();
};

const handleMainAction = () => {
  console.group(`🔴 [主操作按钮] ${new Date().toLocaleTimeString()}`);
  console.log('📄 文件信息:', {
    名称: actualFileName.value,
    状态: actualFileStatus.value,
    可预览: canPreview.value,
    操作类型: mainActionIcon.value
  });
  
  if (actualFileStatus.value === 'success') {
    if (canPreview.value) {
      console.log('👁️ 执行预览操作');
      openPreview();
      emit('preview', {
        id: actualFileName.value,
        name: actualFileName.value,
        size: actualFileSize.value,
        type: actualFileType.value,
        url: actualFileUrl.value,
        status: actualFileStatus.value,
        progress: actualFileProgress.value,
        error: actualFileError.value
      });
    } else {
      console.log('⬇️ 执行下载操作');
      handleDownload();
    }
  } else if (actualFileStatus.value === 'error') {
    console.log('🔄 执行重试操作');
    handleRetry();
  }
  
  console.groupEnd();
};

const handleRetry = () => {
  console.group(`🔄 [重试操作] ${new Date().toLocaleTimeString()}`);
  console.log('📄 重试文件:', {
    名称: actualFileName.value,
    错误信息: actualFileError.value,
    当前状态: actualFileStatus.value
  });
  
  const fileObj = createFileObject();
  console.log('📦 创建的文件对象:', fileObj);
  console.log('📤 发送重试事件');
  emit('retry', fileObj);
  console.groupEnd();
};

const handleMoreActions = () => {
  console.group(`⚙️ [更多操作] ${new Date().toLocaleTimeString()}`);
  console.log('📄 文件信息:', {
    名称: actualFileName.value,
    大小: formattedSize.value,
    类型: actualFileType.value,
    状态: actualFileStatus.value
  });
  
  const fileObj = createFileObject();
  console.log('📦 创建的文件对象:', fileObj);
  console.log('📤 发送更多操作事件 (more + moreActions)');
  emit('more', fileObj);
  emit('moreActions', fileObj); // 向后兼容
  console.groupEnd();
};

// 添加设置文件对象的方法
const setFileObject = (file: File | null) => {
  fileObject.value = file;
};

// 暴露方法
defineExpose({
  setFileObject,
  openPreview,
  closePreview
});

// 判断是否为Markdown文件
const isMarkdownFile = (fileName: string, fileType: string): boolean => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  const markdownExtensions = ['md', 'markdown', 'mdown', 'mkd'];
  
  // 通过扩展名判断
  if (markdownExtensions.includes(extension)) return true;
  
  // 通过MIME类型判断
  if (fileType === 'text/markdown' || fileType === 'text/x-markdown') return true;
  
  return false;
};

// 渲染Markdown内容
const renderMarkdown = async (content: string): Promise<string> => {
  try {
    // 配置marked选项
    marked.setOptions({
      breaks: true, // 支持换行
      gfm: true,    // 启用GitHub风格的Markdown
    });
    
    const result = await marked(content);
    return typeof result === 'string' ? result : String(result);
  } catch (error) {
    console.error('Markdown渲染失败:', error);
    return `<p>Markdown渲染失败: ${error instanceof Error ? error.message : '未知错误'}</p><pre>${content}</pre>`;
  }
};
</script>

<style lang="scss" scoped>
@use '../../styles/variables';

// 继承消息气泡的基础样式
.liao-message-bubble {
  display: flex;
  margin-bottom: 16px;
  
  // 非气泡模式的样式
  &.liao-file-bubble--no-message {
    margin-bottom: 0;
    width: 100%;
    
    .liao-message-bubble-content {
      width: 100%;
      max-width: none;
      min-width: auto;
    }
  }
  
  &--self {
    justify-content: flex-end;
    
    .liao-message-bubble-content {
      align-items: flex-end;
    }
    
    .liao-message-bubble-avatar {
      order: 2;
      margin-right: 0;
      margin-left: 8px;
    }
  }
  
  &--other {
    justify-content: flex-start;
    
    .liao-message-bubble-content {
      align-items: flex-start;
    }
  }
  
  &-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    margin-right: 8px;
    flex-shrink: 0;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    &-placeholder {
      width: 100%;
      height: 100%;
      background-color: #f0f0f0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
    }
  }
  
  &-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    min-width: 200px;
  }
  
  &-name {
    font-size: 12px;
    color: #999;
    margin-bottom: 4px;
    padding: 0 4px;
  }
  
  &-time {
    font-size: 11px;
    color: #999;
    margin-top: 4px;
    padding: 0 4px;
  }
}

// 文件气泡特有样式 - 采用简洁设计
.liao-file-bubble-wrapper {
  position: relative;
}

.liao-file-bubble {
  display: flex;
  align-items: flex-start;
  gap: variables.$spacing-sm;
  padding: variables.$spacing-md;
  background-color: variables.$bg-primary;
  border: 1px solid variables.$border-color;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  max-width: 320px;
  min-width: 240px;
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 1px 3px rgba(0, 0, 0, 0.08);
  
  // 列表模式样式
  &.layout-list {
    max-width: none;
    width: 100%;
    margin-bottom: variables.$spacing-sm;
    border-radius: 8px;
    min-width: 280px;
    
    .liao-file-bubble-content {
      flex: 1;
    }
    
    .liao-file-bubble-actions {
      flex-direction: row;
      gap: variables.$spacing-xs;
    }
  }
  
  // 卡片模式样式
  &.layout-card {
    flex-direction: column;
    max-width: 200px;
    min-width: 160px;
    text-align: center;
    
    .liao-file-bubble-icon {
      align-self: center;
      margin-bottom: variables.$spacing-sm;
    }
    
    .liao-file-bubble-content {
      align-items: center;
      text-align: center;
    }
    
    .liao-file-bubble-actions {
      flex-direction: row;
      justify-content: center;
      margin-top: variables.$spacing-sm;
    }
  }
  
  &.is-clickable {
    cursor: pointer;
    
    &:hover {
      background-color: variables.$bg-secondary;
      border-color: variables.$primary-color;
      transform: translateY(-2px);
      box-shadow: 
        0 8px 24px rgba(0, 0, 0, 0.08),
        0 4px 12px rgba(24, 144, 255, 0.12);
    }
    
    // 列表模式的悬停效果
    &.layout-list:hover {
      transform: translateX(4px);
    }
    
    // 卡片模式的悬停效果
    &.layout-card:hover {
      transform: translateY(-4px) scale(1.02);
    }
  }
  
  &.bubble-other {
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    border-color: #e8e8e8;
  }
  
  &.bubble-self {
    background: linear-gradient(135deg, rgba(24, 144, 255, 0.02) 0%, rgba(24, 144, 255, 0.05) 100%);
    border-color: rgba(24, 144, 255, 0.15);
  }
  
  &.status-waiting {
    opacity: 0.8;
  }
  
  &.status-uploading {
    border-color: #ffa940;
    background: linear-gradient(135deg, rgba(250, 140, 22, 0.02) 0%, rgba(250, 140, 22, 0.05) 100%);
    box-shadow: 
      0 2px 8px rgba(250, 140, 22, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  &.status-error {
    border-color: #ff7875;
    background: linear-gradient(135deg, rgba(245, 34, 45, 0.02) 0%, rgba(245, 34, 45, 0.05) 100%);
    box-shadow: 
      0 2px 8px rgba(245, 34, 45, 0.1),
      0 1px 3px rgba(0, 0, 0, 0.05);
  }
  
  &-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    flex-shrink: 0;
    box-shadow: 
      0 2px 6px rgba(0, 0, 0, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    // 为图标添加微妙的发光效果
    :deep(.liao-icon) {
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
      transition: transform 0.2s ease;
    }
    
    // 当整个气泡被hover时，图标也有反应
    .liao-file-bubble.is-clickable:hover & :deep(.liao-icon) {
      transform: scale(1.05);
    }
  }
  
  &-status {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    
    &.status-waiting {
      background-color: variables.$text-tertiary;
    }
    
    &.status-uploading {
      background-color: variables.$warning-color;
    }
    
    &.status-error {
      background-color: variables.$error-color;
    }
  }
  
  &-content {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-xs;
  }
  
  &-name {
    font-size: variables.$font-size-md;
    font-weight: 600;
    color: variables.$text-primary;
    line-height: 1.4;
    word-break: break-word;
    text-align: left;
  }
  
  &-meta {
    display: flex;
    gap: variables.$spacing-sm;
    font-size: variables.$font-size-sm;
    color: variables.$text-secondary;
  }
  
  &-size {
    font-weight: 500;
  }
  
  &-type {
    color: variables.$text-tertiary;
    text-transform: uppercase;
    font-size: variables.$font-size-xs;
    font-weight: 500;
  }
  
  &-progress {
    display: flex;
    align-items: center;
    gap: variables.$spacing-sm;
    margin-top: variables.$spacing-xs;
    
    &-bar {
      flex: 1;
      height: 4px;
      background-color: rgba(variables.$warning-color, 0.2);
      border-radius: 2px;
      overflow: hidden;
    }
    
    &-fill {
      height: 100%;
      background-color: variables.$warning-color;
      transition: width 0.3s ease;
    }
    
    &-text {
      font-size: variables.$font-size-xs;
      color: variables.$text-secondary;
      font-weight: 500;
      min-width: 30px;
    }
  }
  
  &-error {
    display: flex;
    align-items: center;
    gap: variables.$spacing-xs;
    margin-top: variables.$spacing-xs;
    color: variables.$error-color;
    font-size: variables.$font-size-sm;
  }
  
  &-actions {
    display: flex;
    flex-direction: column;
    gap: variables.$spacing-xs;
    flex-shrink: 0;
  }
  
  &-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: 1px solid variables.$border-color;
    border-radius: variables.$border-radius-sm;
    background-color: variables.$bg-primary;
    color: variables.$text-secondary;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    
    &:hover:not(:disabled) {
      background-color: variables.$bg-secondary;
      border-color: variables.$primary-color;
      color: variables.$primary-color;
      transform: translateY(-1px) scale(1.05);
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }
    
    &:active {
      transform: translateY(0) scale(1.02);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    &.is-loading {
      pointer-events: none;
    }
    
    // 为所有按钮添加微妙的图标过渡效果
    :deep(.liao-icon) {
      transition: transform 0.2s ease;
    }
    
    &:hover:not(:disabled) :deep(.liao-icon) {
      transform: scale(1.1);
    }
  }
  
  &-main-action {
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    color: white;
    border: 2px solid transparent;
    box-shadow: 
      0 2px 4px rgba(24, 144, 255, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    
    // 确保图标清晰渲染
    :deep(.liao-icon) {
      color: white !important;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
      
      // 优化小图标的渲染
      svg {
        shape-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        
        // 确保stroke宽度适中，避免过细导致模糊
        stroke-width: 2.2px;
      }
    }
    
    // 添加光泽效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: left 0.5s ease;
    }
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #096dd9 0%, #1890ff 100%);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
      transform: translateY(-1px) scale(1.05);
      box-shadow: 
        0 4px 12px rgba(24, 144, 255, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.15);
      
      &::before {
        left: 100%;
      }
      
      :deep(.liao-icon) {
        color: white !important;
        transform: scale(1.1);
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
      }
    }
    
    &:active {
      transform: translateY(0) scale(1.02);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
      
      &::before {
        display: none;
      }
    }
  }
  
  &-download {
    background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
    color: white;
    border: 2px solid transparent;
    box-shadow: 
      0 2px 4px rgba(24, 144, 255, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    
    :deep(.liao-icon) {
      color: white !important;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
    }
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #096dd9 0%, #1890ff 100%);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
      transform: translateY(-1px) scale(1.05);
      box-shadow: 
        0 4px 12px rgba(24, 144, 255, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.15);
      
      :deep(.liao-icon) {
        color: white !important;
        transform: scale(1.1);
        filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
      }
    }
    
    &:active {
      transform: translateY(0) scale(1.02);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    
    &.is-loading {
      pointer-events: none;
    }
  }
  
  &-retry {
    background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
    color: white;
    border: 2px solid transparent;
    box-shadow: 
      0 2px 4px rgba(250, 140, 22, 0.2),
      0 1px 2px rgba(0, 0, 0, 0.1);
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #d46b08 0%, #fa8c16 100%);
      border-color: rgba(255, 255, 255, 0.3);
      color: white;
      transform: translateY(-1px) scale(1.05);
      box-shadow: 
        0 4px 12px rgba(250, 140, 22, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.15);
    }
    
    :deep(.liao-icon) {
      color: white !important;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.1));
    }
  }
  
  &-more {
    background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%);
    border: 1px solid #e6e6e6;
    
    &:hover:not(:disabled) {
      background: linear-gradient(135deg, #e6f7ff 0%, #f0f8ff 100%);
      border-color: #91d5ff;
      color: #1890ff;
      transform: translateY(-1px) scale(1.05);
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }
    
    :deep(.liao-icon) {
      transition: transform 0.2s ease, color 0.2s ease;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .liao-message-bubble {
    &-content {
      max-width: 85%;
    }
  }
  
  .liao-file-bubble {
    max-width: 280px;
    min-width: 200px;
    padding: variables.$spacing-sm;
    
    &-icon {
      width: 40px;
      height: 40px;
    }
    
    &-name {
      font-size: variables.$font-size-sm;
    }
    
    &-meta {
      font-size: variables.$font-size-xs;
    }
    
    &-actions {
      gap: variables.$spacing-xs;
    }
    
    &-action {
      width: 28px;
      height: 28px;
    }
  }
}

// 预览弹窗样式
.liao-file-preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  
  &-content {
    background: white;
    border-radius: 12px;
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    display: flex;
    flex-direction: column;
  }
  
  &-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid #eee;
    background: #fafafa;
    
    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 500;
      color: #333;
      max-width: calc(100% - 40px);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    button {
      width: 32px;
      height: 32px;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333;
      
      &:hover {
        background: rgba(0, 0, 0, 0.1);
        color: #000;
      }
    }
  }
  
  &-body {
    flex: 1;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    position: relative;
  }
  
  &-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  &-video {
    max-width: 100%;
    max-height: 100%;
  }
  
  &-audio {
    width: 100%;
    max-width: 400px;
  }
  
  &-text {
    width: 100%;
    height: 100%;
    padding: 20px;
    overflow: auto;
    
    .liao-file-preview-plain-text {
      margin: 0;
      padding: 0;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      font-size: 14px;
      line-height: 1.5;
      color: #333;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    
    .liao-file-preview-markdown {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
      line-height: 1.6;
      color: #333;
      word-wrap: break-word;
      
      // 标题样式
      h1, h2, h3, h4, h5, h6 {
        margin: 20px 0 10px 0;
        font-weight: 600;
        line-height: 1.25;
        color: #24292e;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
      h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
      h3 { font-size: 1.25em; }
      h4 { font-size: 1em; }
      h5 { font-size: 0.875em; }
      h6 { font-size: 0.85em; color: #6a737d; }
      
      // 段落样式
      p {
        margin: 16px 0;
        line-height: 1.6;
      }
      
      // 列表样式
      ul, ol {
        margin: 16px 0;
        padding-left: 30px;
        
        li {
          margin: 4px 0;
          line-height: 1.6;
        }
        
        ul, ol {
          margin: 0;
        }
      }
      
      // 代码块样式
      code {
        padding: 2px 4px;
        margin: 0;
        font-size: 85%;
        background-color: rgba(27, 31, 35, 0.05);
        border-radius: 3px;
        font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      }
      
      pre {
        padding: 16px;
        overflow: auto;
        font-size: 85%;
        line-height: 1.45;
        background-color: #f6f8fa;
        border-radius: 6px;
        margin: 16px 0;
        
        code {
          display: inline;
          max-width: auto;
          padding: 0;
          margin: 0;
          overflow: visible;
          line-height: inherit;
          word-wrap: normal;
          background-color: transparent;
          border: 0;
        }
      }
      
      // 引用样式
      blockquote {
        padding: 0 16px;
        margin: 16px 0;
        color: #6a737d;
        border-left: 4px solid #dfe2e5;
        
        > :first-child {
          margin-top: 0;
        }
        
        > :last-child {
          margin-bottom: 0;
        }
      }
      
      // 表格样式
      table {
        border-spacing: 0;
        border-collapse: collapse;
        margin: 16px 0;
        width: 100%;
        
        th, td {
          padding: 6px 13px;
          border: 1px solid #dfe2e5;
          text-align: left;
        }
        
        th {
          font-weight: 600;
          background-color: #f6f8fa;
        }
        
        tr:nth-child(2n) {
          background-color: #f6f8fa;
        }
      }
      
      // 分割线样式
      hr {
        height: 4px;
        padding: 0;
        margin: 24px 0;
        background-color: #e1e4e8;
        border: 0;
      }
      
      // 链接样式
      a {
        color: #0366d6;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
      
      // 强调样式
      strong {
        font-weight: 600;
      }
      
      em {
        font-style: italic;
      }
      
      // 删除线样式
      del {
        text-decoration: line-through;
      }
      
      // 图片样式
      img {
        max-width: 100%;
        height: auto;
        margin: 8px 0;
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }
    }
  }
  
  &-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #666;
    
    .liao-icon {
      margin-bottom: 12px;
    }
  }
}
</style> 