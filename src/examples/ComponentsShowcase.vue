<template>
  <div class="liao-showcase">
    <!-- 顶栏 -->
    <header class="liao-showcase-header">
      <div class="liao-showcase-logo">
        <h1>LiaoKit组件演示中心</h1>
      </div>
      <div class="liao-showcase-actions">
        <button class="liao-showcase-btn test-btn" @click="testMessageNotification">
          <span>测试新消息通知</span>
        </button>
        <button 
          class="liao-showcase-btn mode-btn" 
          :class="{ 'ai-mode': chatMode === 'ai', 'human-mode': chatMode === 'human' }" 
          @click="toggleChatMode"
          :disabled="isStreaming"
        >
          <span v-if="chatMode === 'ai'">🤖 AI模式</span>
          <span v-else>👤 人工模式</span>
        </button>
        <button class="liao-showcase-btn" :class="{ active: viewMode === 'desktop' }" @click="viewMode = 'desktop'">
          <span>桌面版</span>
        </button>
        <button class="liao-showcase-btn" :class="{ active: viewMode === 'mobile' }" @click="viewMode = 'mobile'">
          <span>移动端</span>
        </button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="liao-showcase-content">
      <div class="liao-showcase-main-view" :class="[`liao-showcase-view-${viewMode}`]">
        <LiaoWindow
          :width="viewMode === 'desktop' ? '900px' : '375px'"
          :height="viewMode === 'desktop' ? '600px' : '700px'"
          :rounded="true"
          :shadow="true"
        >
          <template #header>
            <LiaoWindowHeader
              title="AI智能助手"
              subtitle="随时为你解答问题"
              :showClose="true"
              :showSettings="true"
              backgroundColor="transparent"
              titleColor="#333333"
              iconsColor="#666666"
            />
          </template>
          
          <LiaoMessageList
            ref="messageListRef"
            :messages="messages"
            :loading="loading"
            :loadingMore="loadingMore"
            :hasMore="hasMore"
            :unreadCount="unreadCount"
            @plugin-action="(data) => handlePluginAction(data.action)"
            @load-more="handleLoadMore"
            @scroll-to-bottom="handleScrollToBottom"
            @quick-action-click="handleMessageQuickAction"
            @file-preview="(data) => handleBubblePreview(data.file)"
            @file-download="(data) => handleBubbleDownload(data.file)"
            @file-click="(data) => handleBubblePreview(data.file)"
          />
          
          <LiaoQuickActionBar
            v-if="quickActions.length > 0"
            :actions="quickActions"
            @action-click="handleQuickAction"
          />

          <LiaoInputArea
            v-model="inputValue"
            @input="onInputChange"
            @send="sendMessage"
            @file-upload="handleFileUpload"
            placeholder="请输入您的问题..."
            :enableEmojiInput="true"
            :enableVoiceInput="true"
            :deviceType="viewMode"
            :disabled="inputLocked || (chatMode === 'ai' && isStreaming)"
          />
        </LiaoWindow>
      </div>

      <!-- 组件展示区占位，稍后添加详细内容 -->
      <div class="liao-showcase-components">
        <h2>组件演示</h2>
        
        <!-- 选项卡切换 -->
        <div class="liao-showcase-tabs">
          <button 
            v-for="tab in componentTabs" 
            :key="tab.id" 
            :class="['liao-showcase-tab', { active: activeComponentTab === tab.id }]"
            @click="activeComponentTab = tab.id"
          >
            {{ tab.name }}
          </button>
        </div>
        
        <!-- 消息气泡展示 -->
        <div v-if="activeComponentTab === 'bubbles'" class="liao-showcase-component-container">
          <h3>文本气泡</h3>
          <div class="liao-showcase-component-row">
            <LiaoMessageBubble
              content="这是一条普通的文本消息，支持Markdown语法**加粗**、*斜体*、`代码`等"
              type="other"
              :show-avatar="true"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
              name="AI助手"
              :show-name="true"
              :time="new Date()"
              :show-time="true"
            />
          </div>
          <div class="liao-showcase-component-row">
            <LiaoMessageBubble
              content="这是用户发送的消息，位于右侧"
              type="self"
              :show-avatar="true"
              :show-name="true"
              :time="new Date()"
              :show-time="true"
            />
          </div>
          
          <h3>图片气泡</h3>
          <div class="liao-showcase-component-row">
            <LiaoImageBubble
              image-url="https://picsum.photos/500/300"
              alt="示例图片"
              type="other"
              :show-avatar="true"
              avatar="https://randomuser.me/api/portraits/men/32.jpg"
              name="AI助手"
              :show-name="true"
              :time="new Date()"
              :show-time="true"
            />
          </div>
        </div>
        
        <!-- 插件气泡展示 -->
        <div v-if="activeComponentTab === 'plugins'" class="liao-showcase-component-container">
          <h3>插件气泡类型</h3>
          <div class="liao-showcase-select">
            <label for="plugin-type">选择插件类型:</label>
            <select id="plugin-type" v-model="selectedPluginType">
              <option v-for="(plugin, key) in pluginExamples" :key="key" :value="key">
                {{ key }}
              </option>
            </select>
          </div>
          
          <!-- 表单插件状态控制 -->
          <div v-if="selectedPluginType === 'form'" class="liao-showcase-form-controls">
            <h4>表单状态控制</h4>
            <div class="liao-showcase-options">
              <div class="liao-showcase-option">
                <input type="radio" id="form-normal" v-model="formPluginState" value="normal">
                <label for="form-normal">🟢 正常状态（可填写和提交）</label>
              </div>
              <div class="liao-showcase-option">
                <input type="radio" id="form-readonly" v-model="formPluginState" value="readonly">
                <label for="form-readonly">🔒 只读状态（可查看但不可修改）</label>
              </div>
              <div class="liao-showcase-option">
                <input type="radio" id="form-disabled" v-model="formPluginState" value="disabled">
                <label for="form-disabled">⚫ 禁用状态（完全不可交互）</label>
              </div>
            </div>
          </div>
          
          <!-- 时间线场景选择 -->
          <div v-if="selectedPluginType === 'timeline'" class="liao-showcase-timeline-controls">
            <h4>时间线场景选择</h4>
            <div class="liao-showcase-scenario-grid">
              <div 
                v-for="(scenario, key) in timelineScenarios" 
                :key="key" 
                class="liao-showcase-scenario-item"
                :class="{ active: selectedTimelineScenario === key }"
                @click="selectedTimelineScenario = key"
              >
                <div class="liao-showcase-scenario-name">{{ scenario.name }}</div>
                <div class="liao-showcase-scenario-desc">
                  <span v-if="key === 'logistics'">物流跟踪示例，测试基础时间线功能</span>
                  <span v-else-if="key === 'activity'">活动进度，测试进度条、徽章、统计等</span>
                  <span v-else-if="key === 'work'">工作任务，测试不同状态和操作按钮</span>
                  <span v-else-if="key === 'milestone'">项目里程碑，测试大尺寸和挂起状态</span>
                  <span v-else-if="key === 'learning'">学习进度，测试小尺寸和简化显示</span>
                  <span v-else-if="key === 'changelog'">更新日志，测试富文本和标签功能</span>
                </div>
              </div>
            </div>
            
            <div class="liao-showcase-scenario-features">
              <h5>当前场景测试的功能特性：</h5>
              <div class="liao-showcase-feature-tags">
                <span v-if="selectedTimelineScenario === 'logistics'" class="liao-showcase-feature-tag">基础时间线</span>
                <span v-if="selectedTimelineScenario === 'logistics'" class="liao-showcase-feature-tag">操作按钮</span>
                <span v-if="selectedTimelineScenario === 'logistics'" class="liao-showcase-feature-tag">统计信息</span>
                
                <span v-if="selectedTimelineScenario === 'activity'" class="liao-showcase-feature-tag">进度条</span>
                <span v-if="selectedTimelineScenario === 'activity'" class="liao-showcase-feature-tag">徽章系统</span>
                <span v-if="selectedTimelineScenario === 'activity'" class="liao-showcase-feature-tag">详细信息</span>
                <span v-if="selectedTimelineScenario === 'activity'" class="liao-showcase-feature-tag">高亮状态</span>
                
                <span v-if="selectedTimelineScenario === 'work'" class="liao-showcase-feature-tag">不同状态</span>
                <span v-if="selectedTimelineScenario === 'work'" class="liao-showcase-feature-tag">负责人信息</span>
                <span v-if="selectedTimelineScenario === 'work'" class="liao-showcase-feature-tag">多种操作</span>
                
                <span v-if="selectedTimelineScenario === 'milestone'" class="liao-showcase-feature-tag">大尺寸</span>
                <span v-if="selectedTimelineScenario === 'milestone'" class="liao-showcase-feature-tag">挂起状态</span>
                <span v-if="selectedTimelineScenario === 'milestone'" class="liao-showcase-feature-tag">里程碑</span>
                
                <span v-if="selectedTimelineScenario === 'learning'" class="liao-showcase-feature-tag">小尺寸</span>
                <span v-if="selectedTimelineScenario === 'learning'" class="liao-showcase-feature-tag">学习进度</span>
                <span v-if="selectedTimelineScenario === 'learning'" class="liao-showcase-feature-tag">简化显示</span>
                
                <span v-if="selectedTimelineScenario === 'changelog'" class="liao-showcase-feature-tag">富文本内容</span>
                <span v-if="selectedTimelineScenario === 'changelog'" class="liao-showcase-feature-tag">标签系统</span>
                <span v-if="selectedTimelineScenario === 'changelog'" class="liao-showcase-feature-tag">版本历史</span>
              </div>
            </div>
          </div>
          
          <div class="liao-showcase-component-row">
            <div class="liao-plugin-container">
              <component
                :is="resolvePluginComponent(selectedPluginType)"
                v-if="resolvePluginComponent(selectedPluginType)"
                :plugin-data="selectedPluginType === 'timeline' ? currentTimelineData : pluginExamples[selectedPluginType]"
                :readonly="selectedPluginType === 'form' && formPluginState === 'readonly'"
                :disabled="selectedPluginType === 'form' && formPluginState === 'disabled'"
                @action="handlePluginAction"
              />
              <div v-else class="liao-plugin-not-found">
                未找到对应的插件组件
              </div>
            </div>
          </div>
        </div>
        
        <!-- 输入区域展示 -->
        <div v-if="activeComponentTab === 'input'" class="liao-showcase-component-container">
          <h3>输入区域</h3>
          <div class="liao-showcase-component-row">
            <LiaoInputArea
              v-model="demoInput"
              @input="onDemoInputChange"
              @send="handleDemoSend"
              @file-upload="handleDemoFileUpload"
              placeholder="请输入消息..."
              :enableEmojiInput="demoInputOptions.showEmoji"
              :enableVoiceInput="demoInputOptions.showVoice"
              :deviceType="viewMode"
            />
          </div>
          
          <h3>选项配置</h3>
          <div class="liao-showcase-options">
            <div class="liao-showcase-option">
              <input type="checkbox" id="show-emoji" v-model="demoInputOptions.showEmoji">
              <label for="show-emoji">显示表情按钮</label>
            </div>
            <div class="liao-showcase-option">
              <input type="checkbox" id="show-voice" v-model="demoInputOptions.showVoice">
              <label for="show-voice">显示语音按钮</label>
            </div>
          </div>
          
          <div v-if="demoResult" class="liao-showcase-result">
            <h4>操作结果:</h4>
            <pre>{{ demoResult }}</pre>
          </div>
        </div>
        
        <!-- 快捷操作栏展示 -->
        <div v-if="activeComponentTab === 'quickactions'" class="liao-showcase-component-container">
          <h3>快捷操作栏</h3>
          <div class="liao-showcase-component-row">
            <LiaoQuickActionBar
              :actions="demoQuickActions"
              @action-click="handleDemoQuickAction"
            />
          </div>
          
          <h3>自定义快捷操作</h3>
          <div class="liao-showcase-options">
            <div class="liao-showcase-input-group">
              <input type="text" v-model="newQuickAction" placeholder="输入新的快捷操作文本">
              <button @click="addDemoQuickAction">添加</button>
            </div>
            <div class="liao-showcase-actions-list">
              <div v-for="(action, index) in demoQuickActions" :key="action.id" class="liao-showcase-action-item">
                {{ action.text }}
                <button @click="removeDemoQuickAction(index)" class="liao-showcase-remove-btn">×</button>
              </div>
            </div>
          </div>
          
          <div v-if="demoResult" class="liao-showcase-result">
            <h4>操作结果:</h4>
            <pre>{{ demoResult }}</pre>
          </div>
        </div>

        <!-- 图标库展示 -->
        <div v-if="activeComponentTab === 'icons'" class="liao-showcase-component-container">
          <h3>图标库</h3>
          <div class="liao-showcase-search">
            <input type="text" v-model="iconSearch" placeholder="搜索图标..." @input="filterIcons" />
          </div>
          
          <div class="liao-showcase-icon-grid">
            <div v-for="icon in filteredIcons" :key="icon" class="liao-showcase-icon-item">
              <div class="liao-showcase-icon-preview">
                <LiaoIcon :name="icon" size="large" />
              </div>
              <div class="liao-showcase-icon-name">{{ icon }}</div>
              <div class="liao-showcase-icon-code">{{ `<LiaoIcon name="${icon}" />` }}</div>
            </div>
          </div>
          
          <div v-if="filteredIcons.length === 0" class="liao-showcase-no-icons">
            没有找到匹配的图标
          </div>
        </div>
        
        <!-- 文件上传展示 -->
        <div v-if="activeComponentTab === 'files'" class="liao-showcase-component-container">
          <h3>文件上传组件</h3>
          <div class="liao-showcase-component-row">
            <LiaoFileUpload
              :max-count="5"
              :max-size="50 * 1024 * 1024"
              accept="*/*"
              @files-changed="handleFilesChanged"
              @upload-progress="handleUploadProgress"
              @upload-success="handleUploadSuccess"
              @upload-error="handleUploadError"
            />
          </div>
          
          <h3>文件标签列表 (LiaoFileChipList)</h3>
          <div class="liao-showcase-component-row">
            <LiaoFileChipList
              :files="demoFiles"
              :max-count="5"
              :max-visible-chips="3"
              :max-name-length="20"
              @remove="handleRemoveFile"
              @preview="handlePreviewFile"
              @change="handleFileListChange"
            />
          </div>
          
          <h3>文件消息气泡 (LiaoFileBubble)</h3>
          <div class="liao-showcase-component-row">
            <div class="liao-showcase-file-bubbles">
              <!-- 左侧（收到的文件） -->
              <div class="liao-showcase-bubble-left">
                <h4>接收到的文件</h4>
                <LiaoFileBubble
                  name="设计规范文档.pdf"
                  :size="2048000"
                  type="application/pdf"
                  url="https://example.com/design-guide.pdf"
                  status="success"
                  messageType="other"
                  :showAvatar="false"
                  :showName="false"
                  :showTime="false"
                  @preview="handleBubblePreview"
                  @download="handleBubbleDownload"
                />
                
                <LiaoFileBubble
                  name="项目截图.png"
                  :size="1536000"
                  type="image/png"
                  url="https://picsum.photos/800/600"
                  status="success"
                  messageType="other"
                  :showAvatar="false"
                  :showName="false"
                  :showTime="false"
                  @preview="handleBubblePreview"
                />
              </div>
              
              <!-- 右侧（发送的文件） -->
              <div class="liao-showcase-bubble-right">
                <h4>发送的文件</h4>
                <LiaoFileBubble
                  name="工作总结报告.docx"
                  :size="3072000"
                  type="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  url="https://example.com/work-report.docx"
                  status="success"
                  messageType="self"
                  :showAvatar="false"
                  :showName="false"
                  :showTime="false"
                  @download="handleBubbleDownload"
                />
                
                <!-- 上传中状态 -->
                <LiaoFileBubble
                  name="上传中的视频.mp4"
                  :size="25600000"
                  type="video/mp4"
                  status="uploading"
                  :progress="75"
                  messageType="self"
                  :showAvatar="false"
                  :showName="false"
                  :showTime="false"
                  @retry="handleBubbleRetry"
                />
                
                <!-- 上传失败状态 -->
                <LiaoFileBubble
                  name="失败的文件.xlsx"
                  :size="1024000"
                  type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  status="error"
                  error-message="网络连接失败，请重试"
                  messageType="self"
                  :showAvatar="false"
                  :showName="false"
                  :showTime="false"
                  @retry="handleBubbleRetry"
                />
              </div>
            </div>
          </div>
          
          <h3>文件类型演示</h3>
          <div class="liao-showcase-file-types">
            <div v-for="fileType in demoFileTypes" :key="fileType.name" class="liao-showcase-file-type">
              <LiaoFileBubble
                :name="fileType.name"
                :size="fileType.size"
                :type="fileType.type"
                :url="fileType.url"
                status="success"
                layout="list"
                messageType="other"
                :showAvatar="false"
                :showName="false"
                :showTime="false"
                :max-name-length="50"
                @preview="handleBubblePreview"
                @download="handleBubbleDownload"
              />
            </div>
          </div>
          
          <h3>卡片布局演示</h3>
          <div class="liao-showcase-file-cards">
            <div v-for="fileType in demoFileTypes.slice(0, 6)" :key="'card-' + fileType.name" class="liao-showcase-file-card">
              <LiaoFileBubble
                :name="fileType.name"
                :size="fileType.size"
                :type="fileType.type"
                :url="fileType.url"
                status="success"
                layout="card"
                messageType="other"
                :showAvatar="false"
                :showName="false"
                :showTime="false"
                :max-name-length="20"
                @preview="handleBubblePreview"
                @download="handleBubbleDownload"
              />
            </div>
          </div>

          <div v-if="fileOperationResult" class="liao-showcase-result">
            <h4>操作结果:</h4>
            <pre>{{ fileOperationResult }}</pre>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed, nextTick, onUnmounted } from 'vue';
import LiaoWindow from '../components/LiaoWindow/LiaoWindow.vue';
import LiaoWindowHeader from '../components/LiaoWindowHeader/LiaoWindowHeader.vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../components/LiaoInputArea/LiaoInputArea.vue';
import LiaoQuickActionBar from '../components/LiaoQuickActionBar/LiaoQuickActionBar.vue';
import LiaoMessageBubble from '../components/LiaoMessageBubble/LiaoMessageBubble.vue';
import LiaoImageBubble from '../components/LiaoMessageBubble/LiaoImageBubble.vue';
import LiaoPluginBubble from '../components/LiaoMessageBubble/LiaoPluginBubble.vue';
import {
  LiaoFormPlugin,
  LiaoListPlugin,
  LiaoInfoPlugin,
  LiaoStatsPlugin,
  LiaoActionsPlugin,
  LiaoVotePlugin,
  LiaoFaqCardPlugin,
  LiaoTimelinePlugin,
  LiaoMediaCarouselPlugin,
  LiaoProgressPlugin
} from '../components/LiaoPlugins';
import type { Message } from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoIcon from '../components/LiaoIcon/LiaoIcon.vue';
import { getAvailableIcons } from '../utils/importIcons';

// 文件上传相关组件
import LiaoFileUpload from '../components/LiaoFileUpload/LiaoFileUpload.vue';
import LiaoFilePreview from '../components/LiaoFilePreview/LiaoFilePreview.vue';
import LiaoFileChipList from '../components/LiaoFileChipList/LiaoFileChipList.vue';
import LiaoFileBubble from '../components/LiaoMessageBubble/LiaoFileBubble.vue';

// 视图模式：桌面/移动
const viewMode = ref('desktop');

// 消息列表引用
const messageListRef = ref(null);

// 状态
const loading = ref(false);
const loadingMore = ref(false);
const hasMore = ref(true);
const unreadCount = ref(0);
const inputValue = ref('');

// AI/人工模式相关状态
const chatMode = ref<'ai' | 'human'>('ai'); // 默认AI模式
const isStreaming = ref(false); // 是否正在流式输出
const inputLocked = ref(false); // 输入框是否锁定
const streamingMessageId = ref<string | null>(null); // 当前流式输出的消息ID
const streamingContent = ref(''); // 流式输出的内容
const streamingTimer = ref<number | null>(null); // 流式输出定时器

// 创建模拟文件对象的工具函数
const createMockFile = (fileName: string, content: string, type: string): File => {
  const blob = new Blob([content], { type });
  const file = new File([blob], fileName, { type });
  return file;
};

// 安全的Base64编码函数，支持UTF-8字符
const safeBase64Encode = (str: string): string => {
  try {
    // 先使用encodeURIComponent处理Unicode字符，再编码
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Base64编码失败:', error);
    return '';
  }
};

// 文件内容定义
const readmeContent = `# LiaoKit 组件库

这是一个基于Vue 3的组件库，包含以下功能：

## 主要组件
- 消息气泡组件
- 文件预览组件
- 输入框组件
- 窗口组件

## 特性
- TypeScript支持
- 响应式设计
- 主题定制
- 插件扩展

## 安装
\`\`\`bash
npm install liaokit
\`\`\`

## 使用
\`\`\`javascript
import { LiaoWindow } from "liaokit";
\`\`\`

这个文件可以正常预览文本内容！`;

// 基本消息数据
const messages = ref<Message[]>([
  {
    id: '1',
    content: '你好！我是AI助手，有什么可以帮你的？',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 60000), // 1分钟前
  },
  {
    id: '2',
    content: '🎉🎉欢迎使用LiaoKit！',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 30000), // 30秒前
  },
  {
    id: '3',
    type: 'image',
    content: 'https://picsum.photos/500/300',
    alt: '示例图片',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 20000), // 20秒前
  },
  {
    id: '3.5',
    type: 'file',
    fileName: 'README.md',
    fileSize: 2048,
    fileType: 'text/markdown',
    fileUrl: 'data:text/markdown;base64,' + safeBase64Encode(readmeContent),
    fileStatus: 'success',
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 19000), // 19秒前
    file: createMockFile('README.md', readmeContent, 'text/markdown')
  },
  {
    id: '4',
    type: 'file',
    fileName: '项目设计规范.pdf',
    fileSize: 2048000,
    fileType: 'application/pdf',
    fileUrl: 'https://example.com/design-guide.pdf',
    fileStatus: 'success',
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 18000), // 18秒前
    file: createMockFile('项目设计规范.pdf', 'PDF文件内容暂时无法预览，但您可以点击下载查看完整内容。', 'application/pdf')
  },
  {
    id: '5',
    type: 'file',
    fileName: '会议录音.mp3',
    fileSize: 3584000,
    fileType: 'audio/mpeg',
    fileUrl: 'https://example.com/meeting-audio.mp3',
    fileStatus: 'success',
    content: '',
    isSelf: true,
    time: new Date(Date.now() - 15000), // 15秒前
    file: createMockFile('会议录音.mp3', '这是一个音频文件，请使用音频播放器查看。', 'audio/mpeg')
  },
  {
    id: '6',
    type: 'file',
    fileName: '数据分析报告.xlsx',
    fileSize: 1536000,
    fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    fileUrl: 'https://example.com/data-report.xlsx',
    fileStatus: 'uploading',
    fileProgress: 75,
    content: '',
    isSelf: true,
    time: new Date(Date.now() - 12000), // 12秒前
    file: createMockFile('数据分析报告.xlsx', 'Excel文件内容暂时无法预览，但您可以点击下载查看完整内容。', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  },
  {
    id: '7',
    type: 'file',
    fileName: '演示视频.mp4',
    fileSize: 25600000,
    fileType: 'video/mp4',
    fileUrl: 'https://example.com/demo-video.mp4',
    fileStatus: 'error',
    fileError: '文件过大，上传失败',
    content: '',
    isSelf: true,
    time: new Date(Date.now() - 10000), // 10秒前
    file: createMockFile('演示视频.mp4', '这是一个视频文件，请使用视频播放器查看。', 'video/mp4')
  },
  {
    id: '8',
    type: 'plugin',
    pluginType: 'form',
    pluginData: {
      title: '📋 用户满意度调研问卷',
      description: '您的宝贵意见将帮助我们提供更好的服务体验',
      fields: [
        {
          label: '您对我们的整体服务满意度如何？',
          type: 'radio',
          required: true,
          options: [
            { value: 'very_satisfied', label: '🌟 非常满意' },
            { value: 'satisfied', label: '😊 满意' },
            { value: 'neutral', label: '😐 一般' },
            { value: 'dissatisfied', label: '😕 不满意' },
            { value: 'very_dissatisfied', label: '😞 非常不满意' }
          ]
        },
        {
          label: '您最喜欢的功能是什么？（可多选）',
          type: 'checkbox',
          options: [
            { value: 'chat', label: '💬 智能对话' },
            { value: 'plugin', label: '🧩 插件系统' },
            { value: 'ui', label: '🎨 界面设计' },
            { value: 'voice', label: '🎤 语音输入' },
            { value: 'emoji', label: '😀 表情符号' }
          ]
        },
        {
          label: '您使用我们服务的主要目的是？',
          type: 'select',
          placeholder: '请选择主要用途',
          options: [
            { value: 'work', label: '工作协助' },
            { value: 'study', label: '学习帮助' },
            { value: 'entertainment', label: '娱乐聊天' },
            { value: 'information', label: '信息查询' },
            { value: 'other', label: '其他用途' }
          ]
        },
        {
          label: '您的联系邮箱（用于后续服务优化）',
          type: 'input',
          placeholder: 'example@email.com',
          required: false
        },
        {
          label: '请留下您的宝贵建议和意见',
          type: 'textarea',
          placeholder: '感谢您花时间给我们反馈，您的每一条建议都非常重要...'
        }
      ],
      submitText: '✅ 提交问卷'
    },
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 8000), // 8秒前
  },
  {
    id: '9',
    content: '需要查看更多功能示例吗？点击下方的时间线场景卡片体验不同应用场景！',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(Date.now() - 5000), // 5秒前
  },
]);

// 快捷操作
const quickActions = computed(() => {
  const baseActions = [
    { id: 'contact', text: '如何联系客服', label: '如何联系客服' },
    { id: 'order', text: '订单物流查询', label: '订单物流查询' },
    { id: 'phone', text: '手机号变更', label: '手机号变更' }
  ];
  
  // 添加时间线场景快捷操作
  const timelineActions = Object.entries(timelineScenarios).map(([key, scenario]) => ({
    id: key,
    text: scenario.name,
    label: scenario.description,
    action: { id: key }
  }));
  
  return [...baseActions, ...timelineActions];
});

// 时间线场景快捷操作
const timelineScenarioActions = computed(() => {
  return Object.entries(timelineScenarios).map(([key, scenario]) => ({
    id: key,
    text: scenario.name,
    label: scenario.description,
    action: { id: key }
  }));
});

// 插件示例数据
const pluginExamples: Record<string, any> = {
  form: {
    title: '📋 用户满意度调研问卷',
    description: '您的宝贵意见将帮助我们提供更好的服务体验',
    fields: [
      {
        label: '您对我们的整体服务满意度如何？',
        type: 'radio',
        required: true,
        options: [
          { value: 'very_satisfied', label: '🌟 非常满意' },
          { value: 'satisfied', label: '😊 满意' },
          { value: 'neutral', label: '😐 一般' },
          { value: 'dissatisfied', label: '😕 不满意' },
          { value: 'very_dissatisfied', label: '😞 非常不满意' }
        ]
      },
      {
        label: '您最喜欢的功能是什么？（可多选）',
        type: 'checkbox',
        options: [
          { value: 'chat', label: '💬 智能对话' },
          { value: 'plugin', label: '🧩 插件系统' },
          { value: 'ui', label: '🎨 界面设计' },
          { value: 'voice', label: '🎤 语音输入' },
          { value: 'emoji', label: '😀 表情符号' }
        ]
      },
      {
        label: '您使用我们服务的主要目的是？',
        type: 'select',
        placeholder: '请选择主要用途',
        options: [
          { value: 'work', label: '工作协助' },
          { value: 'study', label: '学习帮助' },
          { value: 'entertainment', label: '娱乐聊天' },
          { value: 'information', label: '信息查询' },
          { value: 'other', label: '其他用途' }
        ]
      },
      {
        label: '您的联系邮箱（用于后续服务优化）',
        type: 'input',
        placeholder: 'example@email.com',
        required: false
      },
      {
        label: '请留下您的宝贵建议和意见',
        type: 'textarea',
        placeholder: '感谢您花时间给我们反馈，您的每一条建议都非常重要...',
        rows: 4
      }
    ],
    submitText: '✅ 提交问卷',
    cancelText: '❌ 稍后再说'
  },
  list: {
    title: '📦 我的订单列表',
    subtitle: '最近30天的购买记录',
    // 搜索功能配置
    enableSearch: true,
    searchPlaceholder: '搜索订单号、商品名称、状态...',
    searchFields: ['title', 'description', 'status', 'id'], // 指定搜索字段
    searchCaseSensitive: false, // 不区分大小写
    searchHighlight: true, // 启用高亮
    items: [
      { 
        id: 'order_001',
        title: '🎧 无线蓝牙耳机 AirPods Pro', 
        description: '主动降噪 | 白色 | 官方正品',
        price: '¥1,999',
        status: '✅ 已签收', 
        time: '2025-06-10 14:30',
        image: 'https://picsum.photos/60/60?random=1',
        badge: 'hot',
        category: '数码产品',
        brand: 'Apple',
        tags: ['蓝牙', '降噪', '无线']
      },
      { 
        id: 'order_002',
        title: '📱 iPhone 15 Pro Max', 
        description: '512GB | 钛金色 | 现货发售',
        price: '¥10,999',
        status: '🚚 运输中', 
        time: '2025-06-09 16:45',
        image: 'https://picsum.photos/60/60?random=2',
        badge: 'new',
        category: '手机通讯',
        brand: 'Apple',
        tags: ['5G', '拍照', '钛金属']
      },
      { 
        id: 'order_003',
        title: '💻 MacBook Pro 16寸', 
        description: 'M3 Pro芯片 | 18GB内存 | 512GB存储',
        price: '¥19,999',
        status: '⏳ 待付款', 
        time: '2025-06-08 20:12',
        image: 'https://picsum.photos/60/60?random=3',
        badge: 'urgent',
        category: '电脑办公',
        brand: 'Apple',
        tags: ['M3芯片', '高性能', '设计']
      },
      { 
        id: 'order_004',
        title: '⌚ Apple Watch Series 9', 
        description: 'GPS版 | 45mm | 午夜色铝金属表壳',
        price: '¥2,999',
        status: '✅ 交易完成', 
        time: '2025-06-05 11:20',
        image: 'https://picsum.photos/60/60?random=4',
        category: '智能穿戴',
        brand: 'Apple',
        tags: ['健康', '运动', 'GPS']
      },
      { 
        id: 'order_005',
        title: '🖱️ 罗技MX Master 3无线鼠标', 
        description: '多设备连接 | 人体工学设计 | 快充',
        price: '¥699',
        status: '📦 已发货', 
        time: '2025-06-07 09:15',
        image: 'https://picsum.photos/60/60?random=5',
        category: '电脑配件',
        brand: '罗技',
        tags: ['无线', '办公', '人体工学']
      },
      { 
        id: 'order_006',
        title: '⌨️ 机械键盘 Cherry MX', 
        description: '青轴 | RGB背光 | 87键位无冲',
        price: '¥899',
        status: '⏳ 待发货', 
        time: '2025-06-06 15:42',
        image: 'https://picsum.photos/60/60?random=6',
        badge: 'sale',
        category: '电脑配件',
        brand: 'Cherry',
        tags: ['机械', 'RGB', '游戏']
      }
    ],
    actions: [
      { id: 'view_all', text: '下一页', type: 'primary' }
    ],
    showImages: true,
    showBadges: true
  },
  info: {
    title: '📋 订单详情 #ORD20250611001',
    subtitle: '购买时间：2025-06-11 10:30:45',
    sections: [
      { 
        title: '商品信息', 
        icon: 'package',
        items: [
          { label: '商品名称', value: '🎧 Sony WH-1000XM5 无线降噪耳机', highlight: true },
          { label: '商品规格', value: '黑色 | 官方正品 | 2年保修' },
          { label: '商品单价', value: '¥2,399', type: 'price' },
          { label: '购买数量', value: '1件' },
          { label: '商品总价', value: '¥2,399', type: 'total' }
        ]
      },
      { 
        title: '支付信息', 
        icon: 'credit-card',
        items: [
          { label: '支付方式', value: '💳 微信支付', badge: 'verified' },
          { label: '支付时间', value: '2025-06-11 10:31:23' },
          { label: '交易单号', value: 'WX20250611103123456789', copy: true },
          { label: '优惠券', value: '🎫 新用户专享券 -¥100', type: 'discount' },
          { label: '运费', value: '免运费', type: 'free' },
          { label: '实付金额', value: '¥2,299', type: 'final_price', highlight: true }
        ]
      },
      { 
        title: '物流信息', 
        icon: 'truck',
        items: [
          { label: '收货人', value: '张先生' },
          { label: '联系电话', value: '138****8888', privacy: true },
          { label: '收货地址', value: '北京市朝阳区xx街道xx小区xx号楼xx单元xx室', type: 'address' },
          { label: '物流公司', value: '🚚 顺丰速运', badge: 'fast' },
          { label: '运单号码', value: 'SF1234567890123', copy: true },
          { label: '预计送达', value: '今天 18:00前', type: 'urgent', highlight: true }
        ]
      }
    ],
    actions: [
      { 
        id: 'track', 
        text: '📍 查看物流', 
        type: 'primary',
        extend: {
          orderId: 'ORD20250611001',
          trackingNumber: 'SF1234567890123',
          carrier: '顺丰速运',
          url: 'https://www.sf-express.com/track?orderNo=SF1234567890123'
        }
      },
      { 
        id: 'contact', 
        text: '联系客服', 
        type: 'default', 
        icon: 'message',
        extend: {
          orderId: 'ORD20250611001',
          chatId: 'CHAT_20250611_001',
          department: 'after_sales',
          priority: 'normal',
          preText: '您好，我想咨询订单 #ORD20250611001 的相关问题。'
        }
      },
      { 
        id: 'invoice', 
        text: '开具发票', 
        type: 'default', 
        icon: 'file',
        extend: {
          orderId: 'ORD20250611001',
          amount: 2999.00,
          invoiceType: 'electronic',
          needEmail: true,
          companyInfo: {
            name: '',
            taxNumber: '',
            address: '',
            phone: ''
          }
        }
      },
      { 
        id: 'refund', 
        text: '申请退款', 
        type: 'danger', 
        icon: 'refund',
        extend: {
          orderId: 'ORD20250611001',
          refundType: 'full_refund',
          reason: '',
          amount: 2999.00,
          paymentMethod: 'wechat_pay',
          estimatedDays: 3,
          requiresConfirmation: true
        }
      }
    ],
    statusColor: 'success'
  },
  stats: {
    title: '📊 电商数据看板',
    subtitle: '实时业务数据总览',
    timeRange: '近30天数据',
    charts: [
      {
        id: 'sales_trend',
        title: '💰 销售趋势',
        type: 'line',
        height: 200,
        labels: ['6/1', '6/3', '6/5', '6/7', '6/9', '6/11'],
        datasets: [
          {
            label: '销售额(万元)',
            data: [15.2, 23.8, 18.9, 31.5, 27.3, 35.6],
            borderColor: '#1890ff',
            backgroundColor: 'rgba(24, 144, 255, 0.1)',
            tension: 0.4
          }
        ]
      },
      {
        id: 'order_status',
        title: '📦 订单状态分布',
        type: 'doughnut',
        height: 180,
        labels: ['已完成', '待发货', '运输中', '待付款'],
        datasets: [{
          data: [156, 42, 38, 21],
          backgroundColor: ['#52c41a', '#faad14', '#1890ff', '#f5222d']
        }]
      }
    ],
    items: [
      // 多天趋势数据 - 显示图表
      { 
        label: '销售趋势', 
        icon: '💰', 
        color: '#52c41a',
        chartType: 'area',
        unit: '万元',
        chartData: [
          { date: '6/7', value: 31.5 },
          { date: '6/8', value: 28.2 },
          { date: '6/9', value: 33.8 },
          { date: '6/10', value: 29.7 },
          { date: '6/11', value: 35.6 },
          { date: '6/12', value: 38.2 }
        ]
      },
      { 
        label: '订单趋势', 
        icon: '📋', 
        color: '#1890ff',
        chartType: 'line',
        unit: '单',
        chartData: [
          { date: '6/7', value: 142 },
          { date: '6/8', value: 128 },
          { date: '6/9', value: 156 },
          { date: '6/10', value: 134 },
          { date: '6/11', value: 149 },
          { date: '6/12', value: 162 }
        ]
      },
      { 
        label: '用户增长', 
        icon: '👥', 
        color: '#722ed1',
        chartType: 'column',
        unit: '人',
        chartData: [
          { date: '6/7', value: 78 },
          { date: '6/8', value: 89 },
          { date: '6/9', value: 95 },
          { date: '6/10', value: 82 },
          { date: '6/11', value: 91 },
          { date: '6/12', value: 97 }
        ]
      },
      // 单天数据 - 显示数字卡片
      { label: '今日退款率', value: '2.1%', icon: '📉', change: -0.5, color: '#f5222d' },
      { label: '客服响应时间', value: '2.3分钟', icon: '⏱️', change: -12.8, color: '#fa8c16' },
      { label: '用户满意度', value: '98.5%', icon: '⭐', change: 1.2, color: '#fadb14' }
    ],
    lastUpdate: '2025-06-12 15:30:45'
  },
  actions: {
    title: '⚡ 订单快捷操作',
    subtitle: '选择您要执行的操作',
    description: '订单号：#ORD20250611001 | 商品：Sony WH-1000XM5 耳机',
    layout: 'grid', // grid 或 list
    columns: 2,
    actions: [
      { 
        id: 'urgent', 
        text: '🚀 加急处理', 
        icon: 'rocket',
        description: '优先处理，预计2小时内发货',
        type: 'primary',
        badge: 'hot',
        // 渐变背景
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        textColor: '#ffffff'
      },
      { 
        id: 'modify_address', 
        text: '📍 修改地址', 
        icon: 'location',
        description: '更改收货地址（仅限未发货订单）',
        type: 'default'
      },
      { 
        id: 'contact_seller', 
        text: '💬 联系商家', 
        icon: 'message',
        description: '直接与商家沟通产品问题',
        type: 'default',
        // 背景图片
        background: 'url(https://picsum.photos/200/100?random=bg1)',
        textColor: '#ffffff'
      },
      { 
        id: 'cancel_order', 
        text: '❌ 取消订单', 
        icon: 'close',
        description: '取消订单并申请退款',
        type: 'danger',
        confirm: true,
        // 纯色背景
        background: '#ff6b6b',
        textColor: '#ffffff',
        iconColor: '#ffffff'
      },
      { 
        id: 'share_order', 
        text: '📤 分享订单', 
        icon: 'share',
        description: '分享订单信息给朋友',
        type: 'default'
      },
      { 
        id: 'add_note', 
        text: '📝 添加备注', 
        icon: 'edit',
        description: '为订单添加特殊要求',
        type: 'default',
        // 渐变背景
        background: 'linear-gradient(45deg, #ffeaa7, #fab1a0)',
        textColor: '#2d3436'
      }
    ]
  },
  vote: {
    title: '🗳️ 技术栈偏好调研',
    subtitle: '帮助我们了解开发者的技术选择',
    question: '您在前端开发中最常使用的技术栈是什么？',
    description: '请选择您在日常开发工作中使用频率最高的技术组合',
    options: [
      { 
        id: 'vue_ts', 
        text: '🌟 Vue 3 + TypeScript + Vite',
        description: '现代化Vue生态',
        icon: 'vue'
      },
      { 
        id: 'react_ts', 
        text: '⚛️ React + TypeScript + Next.js',
        description: '企业级React方案',
        icon: 'react'
      },
      { 
        id: 'angular', 
        text: '🅰️ Angular + TypeScript',
        description: '大型应用框架',
        icon: 'angular'
      },
      { 
        id: 'svelte', 
        text: '🧡 Svelte + SvelteKit',
        description: '轻量级编译型框架',
        icon: 'svelte'
      },
      { 
        id: 'vanilla', 
        text: '🍦 原生 JavaScript + Web Components',
        description: '回归原生开发',
        icon: 'javascript'
      }
    ],
    allowMultiple: false,
    showResults: false, // 初始状态不显示结果，让用户先投票
    showPercentage: true,
    results: [
      { id: 'vue_ts', count: 245 },
      { id: 'react_ts', count: 198 },
      { id: 'angular', count: 87 },
      { id: 'svelte', count: 56 },
      { id: 'vanilla', count: 34 }
    ],
    totalVotes: 620,
    userVote: null, // 用户的投票选择
    votingEnabled: true
  },
  faq: {
    title: '❓ 常见问题解答',
    subtitle: '快速找到您关心的问题答案',
    items: [
      { 
        question: '📍 订单提交后还能修改收货地址吗？', 
        answer: '如果订单状态为"待发货"，您可以在订单详情页面点击"修改地址"进行更改。如果订单已发货，建议您联系快递公司或我们的客服团队协助处理。\n\n修改步骤：\n1. 进入"我的订单"页面\n2. 找到对应订单点击"订单详情"\n3. 点击"修改收货地址"按钮\n4. 填写新地址并确认',
        actionText: '查看我的订单',
        actionData: { action: 'navigate', target: '/orders' }
      },
      { 
        question: '💰 申请退款后多久能收到钱？', 
        answer: '退款处理时间取决于您的支付方式：\n\n微信支付/支付宝：1-3个工作日\n银行卡支付：3-7个工作日\n信用卡支付：7-15个工作日\n\n退款将原路返回到您的支付账户。如果超过预期时间未收到，请联系客服核实处理状态。',
        actionText: '查询退款进度',
        actionData: { action: 'openModal', type: 'refund-status' }
      },
      { 
        question: '🔧 如何联系客服团队？', 
        answer: '我们提供多种客服联系方式：\n\n在线客服：点击页面右下角客服图标，工作时间9:00-22:00\n电话客服：400-123-4567（工作时间9:00-18:00）\n邮件客服：support@example.com（24小时内回复）\n微信客服：搜索"客服小助手"添加好友\n\n紧急问题建议优先使用在线客服或电话联系。',
        actionText: '联系在线客服',
        actionData: { action: 'openChat', type: 'customer-service' }
      },
      { 
        question: '💳 支持哪些支付方式？', 
        answer: '我们支持多种便捷的支付方式：\n\n移动支付：微信支付、支付宝、Apple Pay、Google Pay\n银行卡：支持所有主流银行的借记卡和信用卡\n数字钱包：PayPal、京东支付、美团支付\n分期支付：花呗分期、信用卡分期\n\n所有支付方式都采用银行级加密，保障您的资金安全。'
      },
      {
        question: '🚚 如何查看物流信息？',
        answer: '您可以通过多种方式查看订单物流信息：\n\n1. 登录账户，在"我的订单"中查看\n2. 点击订单详情页的"查看物流"按钮\n3. 使用快递单号在快递公司官网查询\n4. 关注我们的微信公众号获取物流推送\n\n我们会在商品发货后第一时间为您推送物流信息。',
        actionText: '查看物流',
        actionData: { action: 'navigate', target: '/logistics' }
      }
    ],
    footerText: '如果以上内容无法解决您的问题，请联系我们的客服团队获取更多帮助。'
  },
  timeline: {
    title: '🚚 订单物流跟踪',
    subtitle: '订单号：#ORD20250611001 | 运单号：SF1234567890123',
    carrier: '顺丰速运',
    estimatedDelivery: '今天 18:00前',
    currentStatus: 'in_transit',
    items: [
      { 
        title: '✅ 已签收', 
        content: '您的包裹已由本人签收，感谢您的购买！如有问题请联系客服。地点：北京市朝阳区xx小区门卫处，操作员：收件人张先生',
        time: '2025-06-11 16:23:45',
        status: 'success',
        actions: [
          { text: '查看详情', action: 'view_delivery_detail', extend:{key:'1234567890'}},
          { text: '评价服务', action: 'rate_service' }
        ]
      },
      { 
        title: '🚚 正在派送', 
        content: '您的包裹正在派送中，快递员：李师傅(138****1234)，预计今日18点前送达。配送点：北京朝阳区配送点',
        time: '2025-06-11 08:15:30',
        status: 'primary',
        actions: [
          { text: '联系快递员', action: 'call_courier' },
          { text: '修改地址', action: 'change_address' }
        ]
      },
      { 
        title: '📦 到达配送点', 
        content: '快件已到达北京朝阳区分拣中心，正在安排派送。操作员：分拣员王师傅',
        time: '2025-06-10 22:45:12',
        status: 'success',
        actions: [
          { text: '查看配送点', action: 'view_center' }
        ]
      },
      { 
        title: '🚛 运输途中', 
        content: '您的包裹正在从深圳转运中心发往北京，运输车辆：京A12345。承运商：顺丰速运',
        time: '2025-06-10 15:30:00',
        status: 'success'
      },
      { 
        title: '📋 快件揽收', 
        content: '商家已发货，快件已从深圳华强北营业点揽收，正在进行安检。操作员：揽收员陈师傅',
        time: '2025-06-10 14:15:20',
        status: 'success'
      },
      { 
        title: '💰 订单确认', 
        content: '您已完成付款，商家正在准备发货，预计24小时内发出。商家：Sony官方旗舰店',
        time: '2025-06-10 10:31:23',
        status: 'success'
      }
    ],
    showMore: true,
    loadMoreText: '查看更多物流信息'
  },
  mediaCarousel: {
    title: '🎨 产品展示相册',
    items: [
      { 
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=10', 
        title: '🎧 产品正面展示 - 经典黑色设计',
        description: '简约优雅的外观设计，符合人体工程学',
        clickable: true,
        clickData: {
          productId: 'headphone-001',
          viewType: 'front',
          action: 'view_detail',
          category: 'electronics'
        }
      },
      { 
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=11',
        title: '🔄 产品侧面视角 - 可调节头带',
        description: '舒适的头带设计，适合长时间佩戴',
        clickable: true,
        clickData: {
          productId: 'headphone-001',
          viewType: 'side',
          action: 'view_detail',
          features: ['adjustable', 'comfortable']
        }
      },
      { 
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=12',
        title: '🎛️ 控制按钮细节 - 触控操作',
        description: '直观的触控界面，支持手势控制',
        clickable: true,
        clickData: {
          productId: 'headphone-001',
          viewType: 'controls',
          action: 'show_tutorial',
          tutorialType: 'touch_controls'
        }
      },
      { 
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=13',
        title: '📦 完整包装内容 - 官方配件',
        description: '包含耳机、充电线、收纳袋和说明书',
        clickable: false, // 这张图片不可点击
        clickData: null
      },
      { 
        type: 'image', 
        url: 'https://picsum.photos/800/600?random=14',
        title: '⚡ 充电接口展示 - USB-C快充',
        description: '支持快速充电，3小时满电续航30小时',
        clickable: true,
        clickData: {
          productId: 'headphone-001',
          viewType: 'charging',
          action: 'view_specs',
          specs: {
            chargingTime: '3 hours',
            batteryLife: '30 hours',
            chargingPort: 'USB-C'
          }
        }
      },
      {
        type: 'video',
        url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        poster: 'https://picsum.photos/800/600?random=15',
        title: '🎥 产品演示视频',
        description: '完整的产品功能演示和使用指南',
        clickable: true,
        clickData: {
          productId: 'headphone-001',
          viewType: 'video',
          action: 'play_fullscreen',
          videoId: 'demo-video-001',
          duration: '2:30'
        }
      }
    ],
    autoplay: true,
    interval: 3000,
    showControls: true,
    showIndicators: true,
    enableItemClick: true
  },
  progress: {
    title: '📋 订单处理进度',
    subtitle: '订单号：#ORD20250611001',
    type: 'steps', // 明确指定类型
    description: '实时跟踪您的订单处理状态',
    steps: [
      { 
        id: 'order_placed',
        title: '📝 订单确认', 
        description: '订单提交成功',
        detail: '2025-06-11 10:30:45',
        status: 'finished'
      },
      { 
        id: 'payment_confirmed',
        title: '💰 支付确认', 
        description: '支付成功，等待商家处理',
        detail: '2025-06-11 10:31:23',
        status: 'finished'
      },
      { 
        id: 'preparing',
        title: '📦 商品准备', 
        description: '商家正在准备您的商品',
        detail: '预计2小时内完成',
        status: 'processing'
      },
      { 
        id: 'shipped',
        title: '🚚 已发货', 
        description: '商品已发出，物流配送中',
        detail: '预计今日发货',
        status: 'waiting'
      },
      { 
        id: 'delivered',
        title: '✅ 确认收货', 
        description: '商品送达，交易完成',
        detail: '预计明日送达',
        status: 'waiting'
      }
    ],
    percentage: 45, // 修正字段名
    currentStep: 2,
    estimatedTime: '预计今日18:00前发货',
    actions: [
      { id: 'view_detail', text: '📋 查看详情', type: 'primary' },
      { id: 'contact_seller', text: '💬 联系商家', type: 'default' }
    ]
  }
};

// 展示指定类型的插件消息
const sendPluginMessage = (pluginType: string) => {
  console.log('发送插件消息:', pluginType);
  
  if (!pluginExamples[pluginType as keyof typeof pluginExamples]) {
    console.error('找不到插件类型:', pluginType);
    return;
  }
  
  const pluginMessage: Message = {
    id: `plugin-${Date.now()}`,
    type: 'plugin',
    pluginType,
    pluginData: pluginExamples[pluginType as keyof typeof pluginExamples],
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(),
  };
  
  console.log('创建的插件消息:', pluginMessage);
  
  // 确保更新是响应式的
  messages.value = [...messages.value, pluginMessage];
  
  // 确保滚动到底部
  nextTick(() => {
    if (messageListRef.value) {
      // 使用类型断言，因为TypeScript无法自动识别组件暴露的方法
      (messageListRef.value as any).scrollToBottom(true);
    }
  });
};

// 处理快捷操作点击
const handleQuickAction = (action: any, index: number) => {
  console.log('快捷操作点击:', action);
  
  // 检查是否是时间线场景操作
  if (timelineScenarios[action.action?.id as keyof typeof timelineScenarios]) {
    sendTimelineScenarioMessage(action.action.id);
    return;
  }
  
  // 检查是否是消息中的快捷操作
  if (action.action && action.action.id) {
    // 如果是插件ID，直接展示对应插件
    const pluginIds = ['list', 'info', 'stats', 'actions', 'vote', 'faq', 'timeline', 'mediaCarousel', 'progress'];
    if (pluginIds.includes(action.action.id)) {
      sendPluginMessage(action.action.id);
      return;
    }
    
    // 否则处理为普通文本消息
    const actionText = quickActions.value.find(a => a.id === action.action.id)?.text || '';
    if (actionText) {
      sendMessage(actionText);
    }
  }
};

// 加载更多消息
const handleLoadMore = () => {
  if (loadingMore.value) return;
  
  loadingMore.value = true;
  
  // 模拟加载延迟
  setTimeout(() => {
    // 添加历史消息
    const historicalMessages: Message[] = [];
    for (let i = 0; i < 5; i++) {
      const isSelf = Math.random() > 0.5;
      const messageTime = new Date(
        new Date().getTime() - 86400000 * 3 - Math.random() * 86400000 * 7
      );
      
      historicalMessages.push({
        id: `history-${Date.now()}-${i}`,
        content: `这是历史消息 ${i + 1}`,
        isSelf,
        avatar: isSelf ? '' : 'https://randomuser.me/api/portraits/men/32.jpg',
        name: isSelf ? '我' : 'AI助手',
        time: messageTime,
      });
    }
    
    messages.value = [...historicalMessages, ...messages.value];
    loadingMore.value = false;
    
    // 如果历史消息已加载完毕
    if (messages.value.length > 30) {
      hasMore.value = false;
    }
  }, 1000);
};

// 滚动到底部事件处理
const handleScrollToBottom = () => {
  // 重置未读计数
  unreadCount.value = 0;
};

// 处理消息发送
const sendMessage = (content: string) => {
  if (!content.trim()) return;
  
  // 如果在AI模式下正在流式输出，则阻止发送
  if (chatMode.value === 'ai' && isStreaming.value) {
    return;
  }
  
  // 添加用户消息
  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content,
    isSelf: true,
    time: new Date(),
    status: 'sending',
  };
  
  messages.value.push(newMessage);
  inputValue.value = '';
  
  // 根据模式不同，采用不同的回复策略
  if (chatMode.value === 'ai') {
    // AI模式：流式输出回复
    handleAIStreamingReply(content);
  } else {
    // 人工模式：即时回复
    handleHumanReply(content);
  }
};

// AI模式流式回复
const handleAIStreamingReply = (userContent: string) => {
  // 锁定输入框
  inputLocked.value = true;
  isStreaming.value = true;
  
  // 模拟思考延迟
  setTimeout(() => {
    // 创建AI回复消息
    const replyId = `ai-reply-${Date.now()}`;
    const aiReply: Message = {
      id: replyId,
      content: '',
      isSelf: false,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: '🤖 AI助手',
      time: new Date(),
    };
    
    messages.value.push(aiReply);
    streamingMessageId.value = replyId;
    
    // 准备流式输出的内容
    const fullResponse = `我正在分析您的问题："${userContent}"

基于我的理解，我可以为您提供以下建议：

1. **问题分析**：您提到的内容很有意思，让我来详细解释一下相关概念。

2. **解决方案**：
   - 首先，我们需要考虑问题的核心要素
   - 其次，分析可能的解决路径
   - 最后，制定具体的行动计划

3. **相关资源**：我可以为您推荐一些有用的工具和资料。

4. **后续建议**：如果您需要更深入的帮助，我随时为您服务。

希望这些信息对您有所帮助！如果您还有其他问题，请随时告诉我。`;
    
    // 开始流式输出
    startStreamingOutput(fullResponse);
  }, 1000);
};

// 人工模式即时回复
const handleHumanReply = (userContent: string) => {
  // 模拟人工客服回复延迟（较短）
  setTimeout(() => {
    const humanReplies = [
      `收到您的消息："${userContent}"，我来为您处理一下。`,
      `好的，我明白您的意思了。让我查看一下相关信息。`,
      `感谢您的咨询！关于您提到的问题，我这边可以帮您解决。`,
      `您好！我是人工客服小王，很高兴为您服务。您的问题我已经记录下来了。`,
      `明白了，您的需求我已经了解。我会尽快为您处理这个问题。`
    ];
    
    const randomReply = humanReplies[Math.floor(Math.random() * humanReplies.length)];
    
    const reply: Message = {
      id: `human-reply-${Date.now()}`,
      content: randomReply,
      isSelf: false,
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      name: '👤 客服小王',
      time: new Date(),
      // 添加快捷操作
      quickActions: [
        { id: 'list', text: '订单列表', label: '订单列表' },
        { id: 'info', text: '订单详情', label: '订单详情' },
        { id: 'timeline', text: '物流信息', label: '物流信息' },
        { id: 'contact', text: '联系客服', label: '联系客服' }
      ]
    };
    
    messages.value.push(reply);
    
    // 滚动到底部
    nextTick(() => {
      if (messageListRef.value) {
        (messageListRef.value as any).scrollToBottom(true);
      }
    });
  }, 500);
};

// 开始流式输出
const startStreamingOutput = (fullContent: string) => {
  streamingContent.value = '';
  let currentIndex = 0;
  
  const streamInterval = setInterval(() => {
    if (currentIndex < fullContent.length) {
      // 每次添加1-3个字符，模拟真实的流式输出
      const charsToAdd = Math.min(Math.floor(Math.random() * 3) + 1, fullContent.length - currentIndex);
      streamingContent.value += fullContent.slice(currentIndex, currentIndex + charsToAdd);
      currentIndex += charsToAdd;
      
      // 更新消息内容
      const messageIndex = messages.value.findIndex(msg => msg.id === streamingMessageId.value);
      if (messageIndex !== -1) {
        messages.value[messageIndex].content = streamingContent.value;
      }
      
      // 滚动到底部
      nextTick(() => {
        if (messageListRef.value) {
          (messageListRef.value as any).scrollToBottom(true);
        }
      });
    } else {
      // 流式输出完成
      clearInterval(streamInterval);
      isStreaming.value = false;
      inputLocked.value = false;
      streamingMessageId.value = null;
      streamingContent.value = '';
      
      // 添加快捷操作到完成的消息
      const messageIndex = messages.value.findIndex(msg => msg.id === streamingMessageId.value);
      if (messageIndex !== -1) {
        messages.value[messageIndex].quickActions = [
          { id: 'list', text: '订单列表', label: '订单列表' },
          { id: 'info', text: '订单详情', label: '订单详情' },
          { id: 'timeline', text: '物流信息', label: '物流信息' },
          { id: 'faq', text: '常见问题', label: '常见问题' }
        ];
      }
    }
  }, 50); // 每50ms输出一次
  
  streamingTimer.value = streamInterval;
};

// 处理文件上传
const handleFileUpload = (files: FileList) => {
  console.log('处理文件上传:', files);
  
  // 为每个文件创建文件消息
  Array.from(files).forEach((file, index) => {
    const fileMessage: Message = {
      id: `file-${Date.now()}-${index}`,
      type: 'file',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file), // 创建本地预览URL
      fileStatus: 'success',
      content: '',
      isSelf: true,
      time: new Date(),
    };
    
    messages.value.push(fileMessage);
  });
  
  // 模拟AI回复
  setTimeout(() => {
    const reply: Message = {
      id: `file-reply-${Date.now()}`,
      content: `我收到了您发送的 ${files.length} 个文件。文件上传功能正常工作！`,
      isSelf: false,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'AI助手',
      time: new Date(),
    };
    messages.value.push(reply);
    
    // 滚动到底部
    nextTick(() => {
      if (messageListRef.value) {
        (messageListRef.value as any).scrollToBottom(true);
      }
    });
  }, 1000);
};

onMounted(() => {
  // 模拟初始加载
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    // 加载图标列表
    loadIcons();
  }, 1000);
});

// 组件卸载时清理定时器
onUnmounted(() => {
  if (streamingTimer.value) {
    clearInterval(streamingTimer.value);
    streamingTimer.value = null;
  }
});

// 组件选项卡
const componentTabs = [
  { id: 'bubbles', name: '消息气泡' },
  { id: 'plugins', name: '插件气泡' },
  { id: 'files', name: '文件上传' },
  { id: 'input', name: '输入区域' },
  { id: 'quickactions', name: '快捷操作栏' },
  { id: 'icons', name: '图标库' }
];

const activeComponentTab = ref('bubbles');

// 插件展示相关
const selectedPluginType = ref('form');
const formPluginState = ref('normal'); // 表单插件状态控制

// 时间线场景相关
const selectedTimelineScenario = ref('logistics'); // 默认物流场景

// 时间线多场景数据
const timelineScenarios = {
  logistics: {
    name: '📦 物流跟踪',
    icon: '🚚',
    description: '测试基础时间线功能、操作按钮、统计信息',
    data: {
      title: '🚚 订单物流跟踪',
      subtitle: '订单号：#ORD20250611001 | 运单号：SF1234567890123',
      description: '顺丰速运 | 预计今天 18:00前送达',
      size: 'default',
      showStats: true,
      stats: [
        { label: '运输时间', value: '2天', color: '#1890ff' },
        { label: '中转次数', value: '3次', color: '#52c41a' },
        { label: '当前状态', value: '派送中', color: '#faad14' }
      ],
      items: [
        { 
          title: '✅ 已签收', 
          content: '您的包裹已由本人签收，感谢您的购买！如有问题请联系客服。地点：北京市朝阳区xx小区门卫处，操作员：收件人张先生',
          time: '2025-06-11 16:23:45',
          status: 'success',
          icon: 'check',
          actions: [
            { text: '查看详情', action: 'view_delivery_detail', extend:{key:'1234567890'}},
            { text: '评价服务', action: 'rate_service' }
          ]
        },
        { 
          title: '🚚 正在派送', 
          content: '您的包裹正在派送中，快递员：李师傅(138****1234)，预计今日18点前送达。配送点：北京朝阳区配送点',
          time: '2025-06-11 08:15:30',
          status: 'primary',
          icon: 'truck',
          actions: [
            { text: '联系快递员', action: 'call_courier' },
            { text: '修改地址', action: 'change_address' }
          ]
        },
        { 
          title: '📦 到达配送点', 
          content: '快件已到达北京朝阳区分拣中心，正在安排派送。操作员：分拣员王师傅',
          time: '2025-06-10 22:45:12',
          status: 'success',
          icon: 'package'
        },
        { 
          title: '🚛 运输途中', 
          content: '您的包裹正在从深圳转运中心发往北京，运输车辆：京A12345。承运商：顺丰速运',
          time: '2025-06-10 15:30:00',
          status: 'success',
          icon: 'truck'
        },
        { 
          title: '📋 快件揽收', 
          content: '商家已发货，快件已从深圳华强北营业点揽收，正在进行安检。操作员：揽收员陈师傅',
          time: '2025-06-10 14:15:20',
          status: 'success',
          icon: 'check'
        }
      ]
    }
  },
  activity: {
    name: '🎉 活动进度',
    icon: '🎊',
    description: '测试进度条、徽章、高亮状态、详细信息',
    data: {
      title: '🎉 双十一购物节活动进度',
      subtitle: '活动期间：2025-11-01 至 2025-11-11',
      description: '全平台年度最大促销活动，多重优惠叠加享不停',
      size: 'default',
      showStats: true,
      stats: [
        { label: '参与商家', value: '10万+', color: '#722ed1' },
        { label: '商品数量', value: '500万+', color: '#13c2c2' },
        { label: '用户预约', value: '2000万+', color: '#52c41a' }
      ],
      items: [
        {
          title: '🏆 活动圆满结束',
          subtitle: '创历史新高',
          content: '本次双十一活动圆满结束，各项指标创历史新高！感谢所有用户和商家的支持。',
          time: '2025-11-12 00:00:00',
          status: 'success',
          icon: 'trophy',
          badge: { text: '已完成', type: 'success' },
          progress: 100,
          progressColor: '#52c41a',
          details: [
            { label: '总成交额', value: '5684亿元' },
            { label: '订单数量', value: '1.42亿单' },
            { label: '参与用户', value: '8.9亿人' }
          ],
          highlighted: true
        },
        {
          title: '🔥 活动高潮期',
          subtitle: '销售爆发式增长',
          content: '11月11日0点开始，全平台进入销售高潮期，各品类商品销量激增。',
          time: '2025-11-11 00:00:00',
          status: 'success',
          icon: 'fire',
          badge: { text: '爆款', type: 'warning' },
          progress: 95,
          progressColor: '#faad14',
          details: [
            { label: '1小时成交', value: '1207亿元' },
            { label: '峰值QPS', value: '58万/秒' },
            { label: '并发用户', value: '5400万人' }
          ]
        },
        {
          title: '📱 预售活动启动',
          subtitle: '提前锁定优惠',
          content: '预售活动正式启动，用户可提前支付定金锁定商品和优惠价格。',
          time: '2025-11-01 20:00:00',
          status: 'success',
          icon: 'mobile',
          badge: { text: '预售', type: 'primary' },
          progress: 80,
          progressColor: '#1890ff',
          actions: [
            { text: '查看预售商品', action: 'view_presale', type: 'primary' },
            { text: '设置提醒', action: 'set_reminder' }
          ]
        },
        {
          title: '🎯 活动预热阶段',
          subtitle: '氛围营造',
          content: '活动预热阶段，通过各种营销手段营造活动氛围，吸引用户关注。',
          time: '2025-10-20 00:00:00',
          status: 'success',
          icon: 'target',
          progress: 60,
          progressColor: '#722ed1'
        },
        {
          title: '📋 活动策划完成',
          subtitle: '方案确定',
          content: '活动策划方案最终确定，包括活动规则、商家招募、技术准备等各个环节。',
          time: '2025-09-15 18:00:00',
          status: 'success',
          icon: 'file-text',
          progress: 40
        }
      ]
    }
  },
  work: {
    name: '💼 工作任务',
    icon: '📋',
    description: '测试多种状态、负责人信息、任务详情',
    data: {
      title: '💼 LiaoKit 项目开发进度',
      subtitle: '前端组件库开发项目 | 版本 v1.0.0',
      description: '基于 Vue 3 + TypeScript 的现代化组件库项目',
      size: 'default',
      showStats: true,
      stats: [
        { label: '完成进度', value: '75%', color: '#52c41a' },
        { label: '剩余任务', value: '12个', color: '#faad14' },
        { label: '团队成员', value: '6人', color: '#1890ff' }
      ],
      items: [
        {
          title: '🧪 单元测试编写',
          subtitle: '负责人：张三',
          content: '为所有核心组件编写完整的单元测试，确保代码质量和功能稳定性。',
          time: '2025-06-15 开始',
          status: 'processing',
          icon: 'bug',
          badge: { text: '进行中', type: 'primary' },
          progress: 60,
          progressColor: '#1890ff',
          actions: [
            { text: '查看测试报告', action: 'view_test_report', type: 'primary' },
            { text: '运行测试', action: 'run_tests' }
          ]
        },
        {
          title: '📚 文档完善',
          subtitle: '负责人：李四',
          content: '完善组件文档，包括API说明、使用示例、最佳实践等内容。',
          time: '2025-06-10 开始',
          status: 'warning',
          icon: 'book',
          badge: { text: '需关注', type: 'warning' },
          progress: 45,
          progressColor: '#faad14',
          details: [
            { label: '文档完成度', value: '45%' },
            { label: '组件数量', value: '24个' },
            { label: '示例代码', value: '89个' }
          ],
          actions: [
            { text: '查看文档', action: 'view_docs', type: 'default' },
            { text: '编辑文档', action: 'edit_docs', type: 'primary' }
          ]
        },
        {
          title: '🎨 主题系统开发',
          subtitle: '负责人：王五',
          content: '开发可定制的主题系统，支持动态切换和自定义颜色方案。',
          time: '2025-06-05 完成',
          status: 'success',
          icon: 'palette',
          badge: { text: '已完成', type: 'success' },
          progress: 100,
          progressColor: '#52c41a',
          details: [
            { label: '主题数量', value: '8个' },
            { label: '自定义变量', value: '156个' },
            { label: '兼容性测试', value: '100%' }
          ]
        },
        {
          title: '⚙️ 构建系统优化',
          subtitle: '负责人：赵六',
          content: '优化项目构建系统，提升开发体验和构建性能。',
          time: '2025-05-25 完成',
          status: 'success',
          icon: 'settings',
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '🚀 项目初始化',
          subtitle: '负责人：全员',
          content: '完成项目架构设计、技术栈选型、开发环境搭建等基础工作。',
          time: '2025-05-01 完成',
          status: 'success',
          icon: 'rocket',
          progress: 100,
          progressColor: '#52c41a'
        }
      ]
    }
  },
  milestone: {
    name: '🎯 项目里程碑',
    icon: '🏆',
    description: '测试大尺寸、挂起状态、未来规划',
    data: {
      title: '🎯 产品发布里程碑',
      subtitle: 'LiaoKit v1.0 发布计划',
      description: '从概念到发布的完整产品开发周期',
      size: 'large',
      showStats: true,
      stats: [
        { label: '总耗时', value: '6个月', color: '#722ed1' },
        { label: '团队规模', value: '12人', color: '#13c2c2' },
        { label: '投入成本', value: '150万', color: '#52c41a' }
      ],
      items: [
        {
          title: '🎉 正式发布',
          subtitle: '里程碑 6',
          content: '产品正式发布上线，开始面向全量用户提供服务。',
          time: '2025-07-01',
          status: 'info',
          icon: 'rocket',
          badge: { text: '计划中', type: 'info' },
          pending: true,
          actions: [
            { text: '制定发布计划', action: 'create_release_plan', type: 'primary' },
            { text: '准备发布资料', action: 'prepare_release_materials' }
          ]
        },
        {
          title: '🧪 用户测试',
          subtitle: '里程碑 5',
          content: '邀请核心用户参与内测，收集反馈并优化产品体验。',
          time: '2025-06-15',
          status: 'info',
          icon: 'users',
          badge: { text: '计划中', type: 'info' },
          pending: true,
          details: [
            { label: '目标用户数', value: '500人' },
            { label: '测试周期', value: '2周' },
            { label: '反馈渠道', value: '3个' }
          ]
        },
        {
          title: '✅ Beta 版本发布',
          subtitle: '里程碑 4',
          content: '完成 Beta 版本开发，功能基本完整，开始内部测试。',
          time: '2025-06-01',
          status: 'success',
          icon: 'check-circle',
          badge: { text: '已完成', type: 'success' },
          details: [
            { label: '功能完成度', value: '95%' },
            { label: 'Bug数量', value: '23个' },
            { label: '性能得分', value: '92分' }
          ],
          actions: [
            { text: '查看发布说明', action: 'view_release_notes', type: 'default' }
          ]
        },
        {
          title: '🔧 核心功能开发',
          subtitle: '里程碑 3',
          content: '完成所有核心功能模块的开发工作，产品形态基本确定。',
          time: '2025-05-01',
          status: 'success',
          icon: 'tool',
          badge: { text: '已完成', type: 'success' },
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '🎨 UI/UX 设计',
          subtitle: '里程碑 2',
          content: '完成产品的用户界面和用户体验设计，确定视觉风格。',
          time: '2025-03-15',
          status: 'success',
          icon: 'palette',
          badge: { text: '已完成', type: 'success' },
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '📋 需求分析',
          subtitle: '里程碑 1',
          content: '完成市场调研和用户需求分析，确定产品功能规格。',
          time: '2025-02-01',
          status: 'success',
          icon: 'file-text',
          badge: { text: '已完成', type: 'success' },
          progress: 100,
          progressColor: '#52c41a'
        }
      ]
    }
  },
  learning: {
    name: '📚 学习进度',
    icon: '🎓',
    description: '测试小尺寸、简化显示、紧凑布局',
    data: {
      title: '📚 前端学习路线',
      subtitle: '从入门到精通的系统化学习',
      description: 'Vue 3 + TypeScript 全栈开发学习计划',
      size: 'small',
      showStats: true,
      stats: [
        { label: '完成进度', value: '65%', color: '#52c41a' },
        { label: '学习天数', value: '45天', color: '#1890ff' },
        { label: '练习项目', value: '8个', color: '#722ed1' }
      ],
      items: [
        {
          title: '🚀 项目实战',
          content: '完成一个完整的全栈项目，巩固所学知识。',
          time: '第8周',
          status: 'processing',
          badge: { text: '学习中', type: 'primary' },
          progress: 40,
          progressColor: '#1890ff',
          actions: [
            { text: '查看项目', action: 'view_project', type: 'primary' }
          ]
        },
        {
          title: '🔧 工程化工具',
          content: '学习 Vite、Webpack、ESLint 等现代前端工程化工具。',
          time: '第7周',
          status: 'success',
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '🎯 状态管理',
          content: '掌握 Pinia/Vuex 状态管理，理解大型应用的状态设计。',
          time: '第6周',
          status: 'success',
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '📱 TypeScript 进阶',
          content: '深入学习 TypeScript 高级特性，泛型、装饰器等。',
          time: '第4-5周',
          status: 'success',
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '⚡ Vue 3 核心',
          content: '学习 Vue 3 Composition API、响应式原理等核心概念。',
          time: '第2-3周',
          status: 'success',
          progress: 100,
          progressColor: '#52c41a'
        },
        {
          title: '🌟 基础知识',
          content: '掌握 HTML、CSS、JavaScript 基础知识。',
          time: '第1周',
          status: 'success',
          progress: 100,
          progressColor: '#52c41a'
        }
      ]
    }
  },
  changelog: {
    name: '📝 更新日志',
    icon: '📄',
    description: '测试富文本、标签系统、链接支持',
    data: {
      title: '📝 系统更新日志',
      subtitle: 'LiaoKit 组件库版本历史',
      description: '记录每个版本的新功能、改进和修复',
      size: 'default',
      items: [
        {
          title: '🎉 v1.2.0 发布',
          subtitle: '重大功能更新',
          content: [
            { type: 'text', value: '本次更新新增了多个重要功能：' },
            { type: 'tag', text: '新增', color: 'success' },
            { type: 'text', value: ' 时间线组件' },
            { type: 'tag', text: '优化', color: 'primary' },
            { type: 'text', value: ' 表单验证机制' },
            { type: 'tag', text: '修复', color: 'warning' },
            { type: 'text', value: ' 已知样式问题' }
          ],
          time: '2025-06-12',
          status: 'success',
          badge: { text: '最新', type: 'primary' },
          details: [
            { label: '新组件', value: '3个' },
            { label: '修复问题', value: '15个' },
            { label: '性能提升', value: '20%' }
          ],
          actions: [
            { text: '查看详情', action: 'view_changelog', type: 'primary' },
            { text: '下载', action: 'download_version' }
          ]
        },
        {
          title: '🔧 v1.1.3 补丁',
          subtitle: '问题修复',
          content: '修复了一些用户反馈的问题，提升了组件稳定性。',
          time: '2025-06-05',
          status: 'success',
          details: [
            { label: '修复问题', value: '8个' },
            { label: '优化项', value: '5个' }
          ]
        },
        {
          title: '✨ v1.1.0 功能更新',
          subtitle: '新功能发布',
          content: [
            { type: 'text', value: '新增了插件系统和主题定制功能，' },
            { type: 'link', text: '查看文档', url: 'https://docs.example.com' },
            { type: 'text', value: ' 了解更多详情。' }
          ],
          time: '2025-05-20',
          status: 'success',
          badge: { text: '功能', type: 'success' },
          details: [
            { label: '新功能', value: '12个' },
            { label: 'API变更', value: '3个' }
          ]
        },
        {
          title: '🚀 v1.0.0 正式版',
          subtitle: '首次发布',
          content: 'LiaoKit 组件库正式发布，提供完整的 Vue 3 组件解决方案。',
          time: '2025-05-01',
          status: 'success',
          badge: { text: '里程碑', type: 'warning' },
          highlighted: true
        }
      ]
    }
  }
};

// 获取当前选中的时间线场景数据
const currentTimelineData = computed(() => {
  return timelineScenarios[selectedTimelineScenario.value as keyof typeof timelineScenarios]?.data || timelineScenarios.logistics.data;
});

// 解析插件组件
const resolvePluginComponent = (type: string) => {
  const pluginMap: Record<string, any> = {
    form: LiaoFormPlugin,
    list: LiaoListPlugin,
    info: LiaoInfoPlugin,
    stats: LiaoStatsPlugin,
    actions: LiaoActionsPlugin,
    vote: LiaoVotePlugin,
    faq: LiaoFaqCardPlugin,
    timeline: LiaoTimelinePlugin,
    mediaCarousel: LiaoMediaCarouselPlugin,
    progress: LiaoProgressPlugin
  };
  return pluginMap[type] || null;
};

// 演示区输入相关
const demoInput = ref('');
const demoResult = ref('');
const demoInputOptions = ref({
  showEmoji: true,
  showVoice: true
});

// 处理演示区发送
const handleDemoSend = (content: string) => {
  demoResult.value = `发送消息: ${content}`;
  demoInput.value = '';
};

// 演示快捷操作相关
const demoQuickActions = ref([
  { id: 'demo1', text: '如何使用', label: '如何使用' },
  { id: 'demo2', text: '查看更多示例', label: '查看更多示例' },
  { id: 'demo3', text: '联系我们', label: '联系我们' }
]);
const newQuickAction = ref('');

// 添加快捷操作
const addDemoQuickAction = () => {
  if (!newQuickAction.value.trim()) return;
  
  demoQuickActions.value.push({
    id: `demo-${Date.now()}`,
    text: newQuickAction.value,
    label: newQuickAction.value
  });
  newQuickAction.value = '';
};

// 移除快捷操作
const removeDemoQuickAction = (index: number) => {
  demoQuickActions.value.splice(index, 1);
};

// 处理演示快捷操作点击
const handleDemoQuickAction = (action: any) => {
  demoResult.value = `点击了快捷操作: ${action.text}`;
};

// 处理插件操作
const handlePluginAction = (action: any) => {
  
  if (!action) {
    console.error('❌ 没有接收到插件事件数据');
    return;
  }
  
  console.group(`🔧 [插件操作] ${new Date().toLocaleTimeString()}`);
  console.log('📋 操作详情:', action);
  console.log('🎯 操作类型:', action.type);
  console.log('📊 操作数据:', action.data);
  
  let feedbackMessage = '';
  let detailInfo: Record<string, any> = {};
  
  switch (action.type) {
    case 'form-submit':
      const formData = action.data?.formData || {};
      const formValues = action.data?.formValues || [];
      
      feedbackMessage = `📝 表单提交成功！收到了${Object.keys(formData).length}个字段的数据`;
      detailInfo = {
        formData,
        formValues,
        validFields: Object.keys(formData).filter(key => {
          const value = formData[key];
          return value !== null && value !== undefined && value !== '' && 
                 !(Array.isArray(value) && value.length === 0);
        }),
        timestamp: new Date().toISOString()
      };
      
      console.log('📝 表单数据:', formData);
      console.log('📊 表单值数组:', formValues);
      console.log('✅ 有效字段:', detailInfo.validFields);
      console.log('📈 字段统计:', {
        总字段数: Object.keys(formData).length,
        有效字段数: detailInfo.validFields.length,
        填写率: `${Math.round((detailInfo.validFields.length / Object.keys(formData).length) * 100)}%`
      });
      break;
      
    case 'list-item-click':
      feedbackMessage = `📋 点击了列表项: ${action.data?.title || action.data?.id || '未知项目'}`;
      detailInfo = {
        clickedItem: action.data,
        itemIndex: action.data?.index,
        itemType: action.data?.type || 'list-item'
      };
      console.log('🎯 点击的项目:', action.data);
      break;
      
    case 'list-action':
      feedbackMessage = `📋 列表操作: ${action.data?.actionText || action.data?.action || '未知操作'}`;
      detailInfo = {
        actionId: action.data?.action,
        actionText: action.data?.actionText,
        targetItem: action.data?.item,
        itemIndex: action.data?.index,
        originalIndex: action.data?.originalIndex
      };
      console.log('📋 列表操作详情:', action.data);
      break;
      
    case 'list-search':
      const searchResults = action.data?.results || [];
      const totalCount = action.data?.total || 0;
      const filteredCount = action.data?.filteredCount || 0;
      const searchKeyword = action.data?.keyword || '';
      
      if (searchKeyword.trim()) {
        feedbackMessage = `🔍 搜索"${searchKeyword}"：找到 ${filteredCount} / ${totalCount} 项结果`;
        detailInfo = {
          keyword: searchKeyword,
          results: searchResults,
          totalCount,
          filteredCount,
          searchHitRate: totalCount > 0 ? Math.round((filteredCount / totalCount) * 100) : 0,
          timestamp: new Date().toISOString()
        };
        
        console.log('🔍 搜索关键词:', searchKeyword);
        console.log('📊 搜索结果:', searchResults);
        console.log('📈 搜索统计:', {
          总数: totalCount,
          匹配数: filteredCount,
          命中率: `${detailInfo.searchHitRate}%`
        });
      } else {
        feedbackMessage = `🔍 搜索已清空，显示全部 ${totalCount} 项结果`;
        detailInfo = {
          keyword: '',
          results: searchResults,
          totalCount,
          filteredCount,
          searchCleared: true,
          timestamp: new Date().toISOString()
        };
        console.log('🔍 搜索已清空，显示全部结果');
      }
      break;
      
    case 'action-click':
      feedbackMessage = `⚡ 执行了操作: ${action.data?.text || action.data?.id || '未知操作'}`;
      detailInfo = {
        actionId: action.data?.id,
        actionText: action.data?.text,
        actionType: action.data?.type,
        requiresConfirm: action.data?.confirm
      };
      console.log('⚡ 操作信息:', action.data);
      
      // 特殊操作处理
      if (action.data?.confirm) {
        console.warn('⚠️ 此操作需要用户确认');
        feedbackMessage += ' (需要确认)';
      }
      break;
      
    case 'vote-submit':
      feedbackMessage = `🗳️ 投票成功！选择了: ${action.data?.selectedOption?.text || '未知选项'}`;
      detailInfo = {
        selectedOption: action.data?.selectedOption,
        totalVotes: action.data?.totalVotes,
        userChoice: action.data?.choice
      };
      console.log('🗳️ 投票选择:', action.data?.selectedOption);
      console.log('📊 投票统计:', action.data?.totalVotes);
      break;
      
    case 'vote-change':
      const selectedOption = action.data?.selectedOption || action.data?.selectedOptions?.[0];
      const isMultiple = Array.isArray(action.data?.selectedOptions);
      
      if (isMultiple) {
        feedbackMessage = `🗳️ 投票选择变更：已选择 ${action.data?.selectedOptions?.length || 0} 个选项`;
        detailInfo = {
          selectedOptions: action.data?.selectedOptions,
          selectionCount: action.data?.selectedOptions?.length || 0,
          isMultiple: true,
          value: action.data?.value
        };
        console.log('🗳️ 多选投票变更:', action.data?.selectedOptions);
      } else {
        feedbackMessage = `🗳️ 投票选择变更：${selectedOption?.text || '未知选项'}`;
        detailInfo = {
          selectedOption: selectedOption,
          isMultiple: false,
          value: action.data?.value
        };
        console.log('🗳️ 单选投票变更:', selectedOption);
      }
      break;
      
    case 'vote-change-request':
      feedbackMessage = `🔄 请求修改投票：当前投票为 ${action.data?.currentVote || '未知'}`;
      detailInfo = {
        currentVote: action.data?.currentVote,
        requestType: 'change_vote'
      };
      console.log('🔄 修改投票请求:', action.data);
      break;
      
    case 'info-action':
      feedbackMessage = `ℹ️ 信息操作: ${action.data?.actionId || '未知操作'}`;
      detailInfo = {
        sectionTitle: action.data?.section,
        actionId: action.data?.actionId,
        itemData: action.data?.item
      };
      console.log('ℹ️ 信息操作详情:', action.data);
      break;
      
    case 'timeline-action':
      feedbackMessage = `📅 时间线操作: ${action.data?.actionId || '未知操作'}`;
      detailInfo = {
        timelineEvent: action.data?.event,
        actionId: action.data?.actionId,
        eventStatus: action.data?.status
      };
      console.log('📅 时间线事件:', action.data);
      break;
      
    case 'timeline-load-more':
      feedbackMessage = `📅 时间线加载更多`;
      detailInfo = {
        actionType: 'load_more',
        requestedBy: 'timeline_plugin'
      };
      console.log('📅 时间线加载更多请求');
      break;
      
    case 'media-view':
      feedbackMessage = `🖼️ 查看媒体: ${action.data?.caption || '第' + (action.data?.index + 1) + '张图片'}`;
      detailInfo = {
        mediaIndex: action.data?.index,
        mediaType: action.data?.type,
        mediaUrl: action.data?.src,
        caption: action.data?.caption
      };
      console.log('🖼️ 媒体信息:', action.data);
      break;
      
    case 'carousel-item-click':
      const clickedItem = action.data?.item || {};
      const clickData = action.data?.clickData || {};
      
      feedbackMessage = `🎯 轮播项点击: ${clickedItem.title || '第' + (action.data?.index + 1) + '项'}`;
      detailInfo = {
        clickedIndex: action.data?.index,
        currentSlide: action.data?.currentSlide,
        totalSlides: action.data?.totalSlides,
        itemData: clickedItem,
        customData: clickData,
        actionType: clickData.action || 'unknown',
        timestamp: new Date().toISOString()
      };
      
      console.log('🎯 轮播项点击详情:', action.data);
      console.log('📋 自定义数据:', clickData);
      
      // 根据不同的动作类型给出不同的反馈
      if (clickData.action === 'view_detail') {
        feedbackMessage += ` - 查看详情`;
      } else if (clickData.action === 'show_tutorial') {
        feedbackMessage += ` - 显示教程`;
      } else if (clickData.action === 'view_specs') {
        feedbackMessage += ` - 查看规格`;
      } else if (clickData.action === 'play_fullscreen') {
        feedbackMessage += ` - 全屏播放`;
      }
      break;
      
    case 'carousel-change':
      feedbackMessage = `🔄 轮播切换到第 ${(action.data?.index || 0) + 1} 项`;
      detailInfo = {
        newIndex: action.data?.index,
        newItem: action.data?.item
      };
      console.log('🔄 轮播切换:', action.data);
      break;
      
    case 'progress-action':
      feedbackMessage = `📊 进度操作: ${action.data?.actionId || '未知操作'}`;
      detailInfo = {
        currentStep: action.data?.currentStep,
        actionId: action.data?.actionId,
        progressPercent: action.data?.percent
      };
      console.log('📊 进度信息:', action.data);
      break;
      
    case 'stats-interaction':
      feedbackMessage = `📈 数据交互: ${action.data?.chartId || action.data?.kpiLabel || '未知数据'}`;
      detailInfo = {
        chartId: action.data?.chartId,
        dataPoint: action.data?.dataPoint,
        value: action.data?.value,
        interactionType: action.data?.interactionType
      };
      console.log('📈 统计数据:', action.data);
      break;
      
    case 'faq-toggle':
      feedbackMessage = `❓ 展开/收起FAQ: ${action.data?.item.question || '未知问题'}`;
      detailInfo = {
        index: action.data?.index,
        item: action.data?.item
      };
      console.log('❓ FAQ操作:', action);
      break;
      
    case 'faq-helpful':
      feedbackMessage = `👍 标记FAQ有用: ${action.data?.question || '未知问题'}`;
      detailInfo = {
        faqId: action.data?.id,
        helpfulCount: action.data?.helpful,
        userAction: 'mark_helpful'
      };
      console.log('👍 有用反馈:', action.data);
      break;
      
    case 'form-validation-failed':
      const validationErrors = action.data?.errors || [];
      const errorCount = action.data?.errorCount || 0;
      
      feedbackMessage = `🚫 表单验证失败：发现${errorCount}个必填项未完成`;
      detailInfo = {
        errors: validationErrors,
        errorCount,
        isValid: false,
        errorMessages: validationErrors.map((error: any) => error.message),
        timestamp: new Date().toISOString()
      };
      
      console.warn('🚫 表单验证失败:', validationErrors);
      console.log('📝 需要完成的必填项:', validationErrors.map((error: any) => error.field.label));
      break;
      
    default:
      feedbackMessage = `🔄 插件操作: ${action.type}`;
      detailInfo = {
        rawAction: action,
        unknownType: true
      };
      console.warn('⚠️ 未知的操作类型:', action.type);
  }
  
  console.log('💬 反馈消息:', feedbackMessage);
  console.log('📋 详细信息:', detailInfo);
  console.groupEnd();
  
  // 更新演示区结果显示
  demoResult.value = `${feedbackMessage}\n\n📊 操作详情:\n${JSON.stringify(detailInfo, null, 2)}`;
  
  // 发送反馈消息到消息列表
  const feedbackMessage_obj: Message = {
    id: `feedback-${Date.now()}`,
    content: `${feedbackMessage}\n\n🔍 **操作详情:**\n\`\`\`json\n${JSON.stringify(action.data, null, 2)}\n\`\`\``,
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: '🤖 系统反馈',
    time: new Date(),
  };
  
  messages.value.push(feedbackMessage_obj);
  
  // 滚动到底部
  nextTick(() => {
    if (messageListRef.value) {
      (messageListRef.value as any).scrollToBottom(true);
    }
  });
};

// 输入变化事件处理器（用于调试）
const onInputChange = (e: Event) => {
  // 确保我们从事件对象中获取值，而不是直接传递事件对象
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  const value = target.value;
  console.log('输入框内容变化:', value);
  // 手动更新inputValue
  inputValue.value = value;
};

// 演示区输入变化事件处理器
const onDemoInputChange = (e: Event) => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  
  // 如果是文件输入元素，忽略该事件
  if (target.type === 'file') {
    console.log('忽略演示区文件输入事件:', target.value);
    return;
  }
  
  const value = target.value;
  console.log('演示输入框内容变化:', value);
  // 手动更新demoInput
  demoInput.value = value;
};

// 图标库相关
const iconList = ref<string[]>([]);
const iconSearch = ref('');
const filteredIcons = ref<string[]>([]);

// 过滤图标
const filterIcons = () => {
  if (!iconSearch.value) {
    filteredIcons.value = iconList.value;
  } else {
    filteredIcons.value = iconList.value.filter(icon => 
      icon.toLowerCase().includes(iconSearch.value.toLowerCase())
    );
  }
  // console.log('Filtered icons:', filteredIcons.value);
};

// 获取图标列表
const loadIcons = () => {
  iconList.value = getAvailableIcons();
  // console.log('Loaded icons into iconList:', iconList.value);
  filterIcons();
};

// 合并测试功能：测试新消息通知
const testMessageNotification = () => {
  console.log('开始测试新消息通知');
  // 首先确保我们有一个非底部的滚动位置
  if (messageListRef.value) {
    try {
      // 获取消息列表DOM元素
      const messageListEl = (messageListRef.value as any).$el.querySelector('.liao-message-list');
      if (messageListEl) {
        // 获取滚动信息
        const { scrollHeight } = messageListEl;
        
        console.log('当前消息数量:', messages.value.length);
        
        // 强制滚动到顶部位置，确保足够远离底部
        messageListEl.scrollTop = 0; // 滚动到顶部，确保肯定不在底部
        console.log('已滚动到顶部:', messageListEl.scrollTop);
        
        // 延迟添加测试消息，确保滚动已经生效
        setTimeout(() => {
          console.log('准备添加测试消息');
          
          // 记录原始消息数量
          const originalLength = messages.value.length;
          
          // 添加第一条文本消息
          const textMessage = {
            id: `test-text-${Date.now()}`,
            content: '这是一条测试文本消息，用于验证新消息提示功能',
            isSelf: false,
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            name: 'AI助手',
            time: new Date(),
          };
          
          // 通过替换整个数组来确保触发响应式更新
          messages.value = [...messages.value, textMessage];
          console.log('已添加文本消息，当前消息数量:', messages.value.length);
          
          // 添加第二条图片消息
          setTimeout(() => {
            const imageMessage = {
              id: `test-image-${Date.now()}`,
              type: 'image',
              content: 'https://picsum.photos/600/400',
              alt: '测试图片',
              isSelf: false,
              avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
              name: 'AI助手',
              time: new Date(),
            };
            
            // 再次通过替换整个数组确保触发响应式更新
            messages.value = [...messages.value, imageMessage];
            console.log('已添加图片消息，当前消息数量:', messages.value.length);
            
            // 验证新消息提示状态
            setTimeout(() => {
              const msgListComponent = messageListRef.value as any;
              if (msgListComponent) {
                console.log('测试结果 - 新消息提示状态:', {
                  shouldAutoScroll: msgListComponent.shouldAutoScroll,
                  showNewMessageTip: msgListComponent.showNewMessageTip,
                  newMessageCount: msgListComponent.newMessageCount
                });
                
                // 如果提示还没显示，尝试手动更新状态
                if (!msgListComponent.showNewMessageTip) {
                  console.log('尝试手动更新提示状态');
                  msgListComponent.showNewMessageTip = true;
                  msgListComponent.newMessageCount = messages.value.length - originalLength;
                }
              }
            }, 300);
          }, 500);
        }, 200);
      }
    } catch (error) {
      console.error('测试消息通知出错:', error);
    }
  } else {
    console.error('未找到消息列表组件');
  }
};

// 处理消息快捷操作点击
const handleMessageQuickAction = (action: any, index: number) => {
  console.log('消息快捷操作点击事件触发:', action);
  
  if (action.action && action.action.id) {
    // 获取点击的操作ID
    const actionId = action.action.id;
    console.log('准备发送插件消息，ID:', actionId);
    
    // 直接发送对应的插件消息
    sendPluginMessage(actionId);
  } else {
    console.error('无效的操作:', action);
  }
};

// 发送时间线场景消息
const sendTimelineScenarioMessage = (scenarioKey: string) => {
  console.log('发送时间线场景消息:', scenarioKey);
  
  const scenario = timelineScenarios[scenarioKey as keyof typeof timelineScenarios];
  if (!scenario) {
    console.error('找不到场景:', scenarioKey);
    return;
  }
  
  // 创建时间线插件消息
  const timelineMessage: Message = {
    id: `timeline-${scenarioKey}-${Date.now()}`,
    type: 'plugin',
    pluginType: 'timeline',
    pluginData: scenario.data,
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(),
  };
  
  // 添加引导消息
  const introMessage: Message = {
    id: `intro-${scenarioKey}-${Date.now()}`,
    content: `为您展示${scenario.name}场景的时间线组件：`,
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(),
  };
  
  // 添加消息到列表
  messages.value = [...messages.value, introMessage, timelineMessage];
  
  // 滚动到底部
  nextTick(() => {
    if (messageListRef.value) {
      (messageListRef.value as any).scrollToBottom(true);
    }
  });
};

// 处理时间线场景快捷操作
const handleTimelineScenarioAction = (action: any) => {
  console.log('时间线场景快捷操作:', action);
  sendTimelineScenarioMessage(action.action.id);
};

// 文件上传演示相关
const demoFiles = ref([
  {
    id: 'demo-file-1',
    name: '设计规范文档.pdf',
    size: 2048000,
    type: 'application/pdf',
    status: 'success' as const,
    url: 'https://example.com/design-guide.pdf'
  },
  {
    id: 'demo-file-2',
    name: '项目需求说明.docx',
    size: 1024000,
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    status: 'uploading' as const,
    progress: 45
  },
  {
    id: 'demo-file-3',
    name: '界面设计稿.sketch',
    size: 5120000,
    type: 'application/octet-stream',
    status: 'error' as const,
    error: '文件格式不支持'
  }
]);

const fileOperationResult = ref('');

const demoFileTypes = ref([
  {
    name: '1041.txt',
    size: 1024,
    type: 'text/plain',
    url: 'data:text/plain;base64,6L+Z5piv5LiA5Liq5rWL6K+V5paH5pys5paH5Lu255qE5YaF5a6544CCCui/memHjOWMheWQq+WkmeihjOaWh+acrOOAggrlj6/ku6XnlajmnaXmtYvor5XmlofmnKznlKjop4jlip/og73mmK/lkKbmraPluLjlt6XkvZzjgIIKCuaUr+aMgeS4reaWh+Wtl+esplWSjOWQhOenjeespuWPtyHvvIEjJCVeJiooKQrova7mlK/mjIHmlbDlrZc6MTIzNDUKCui/memHjOaYr+aWh+acrOaWh+S7teeahOmihOiniOWKn+iDveOAgg=='
  },
  {
    name: 'config.json',
    size: 512,
    type: 'application/json',
    url: 'data:application/json;base64,eyJuYW1lIjoiTGlhb0tpdCIsInZlcnNpb24iOiIxLjAuMCIsImRlc2NyaXB0aW9uIjoiVnVlM+e7hOS7tuW6kyIsIm1haW4iOiJpbmRleC5qcyIsInNjcmlwdHMiOnsiZGV2Ijoidml0ZSIsImJ1aWxkIjoidml0ZSBidWlsZCJ9LCJkZXBlbmRlbmNpZXMiOnsidnVlIjoiXjMuMC4wIn19'
  },
  {
    name: 'README.md',
    size: 2048,
    type: 'text/markdown',
    url: 'data:text/markdown;base64,IyBMaWFvS2l0IOe7hOS7tuW6kwoKIyMg566A5LuLCui/memHjOaYr+S4gOS4quWfuuS6jlZ1ZSAz55qE546w5Luj5YyW57uE5Lu25bqT44CCCgojIyDlip/og73nibnmgKcKLSDwn46oIOe+juingueeqlVJ6K6+6K6hCi0g8J+agOmrmOaAp+iDvQotIPCfk7Eg5ZON5bqU5byP5biE5bGACi0g8J+bqO+4jyBUeXBlU2NyaXB05pSv5oyBCgojIyDlronoo4UKYGBgYmFzaApucG0gaW5zdGFsbCBsaWFvd2wtdWkKYGBgCgojIyDkvb/nlKgKYGBgamF2YXNjcmlwdAppbXBvcnQgeyBMaWFvQnV0dG9uIH0gZnJvbSAibGlhb3dsLXVpIgpgYGA='
  },
  {
    name: 'presentation.pptx',
    size: 4096000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    url: 'https://example.com/presentation.pptx'
  },
  {
    name: 'spreadsheet.xlsx',
    size: 1536000,
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    url: 'https://example.com/spreadsheet.xlsx'
  },
  {
    name: 'archive.zip',
    size: 10240000,
    type: 'application/zip',
    url: 'https://example.com/archive.zip'
  },
  {
    name: 'music.mp3',
    size: 3584000,
    type: 'audio/mpeg',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav'
  },
  {
    name: 'photo.jpg',
    size: 2048000,
    type: 'image/jpeg',
    url: 'https://picsum.photos/800/600'
  }
]);

// 文件上传事件处理函数
const handleFilesChanged = (files: any[]) => {
  fileOperationResult.value = `文件列表变更: ${files.length} 个文件`;
  console.log('文件变更:', files);
};

const handleUploadProgress = (fileId: string, progress: number) => {
  fileOperationResult.value = `文件上传进度: ${progress}%`;
  console.log('上传进度:', fileId, progress);
};

const handleUploadSuccess = (fileId: string, response: any) => {
  fileOperationResult.value = `文件上传成功: ${fileId}`;
  console.log('上传成功:', fileId, response);
};

const handleUploadError = (fileId: string, error: string) => {
  fileOperationResult.value = `文件上传失败: ${error}`;
  console.log('上传失败:', fileId, error);
};

const handleRemoveFile = (fileId: string) => {
  fileOperationResult.value = `移除文件: ${fileId}`;
  demoFiles.value = demoFiles.value.filter(file => file.id !== fileId);
  console.log('移除文件:', fileId);
};

const handlePreviewFile = (fileId: string) => {
  const file = demoFiles.value.find(f => f.id === fileId);
  fileOperationResult.value = `预览文件: ${file?.name || fileId}`;
  console.log('预览文件:', file);
};

const handleFileListChange = (files: any[]) => {
  fileOperationResult.value = `文件列表更新: ${files.length} 个文件`;
  console.log('文件列表变更:', files);
};

const handleBubblePreview = (file: any) => {
  console.log('预览气泡文件:', file);
  
  // 现在预览功能由LiaoFileBubble组件内部处理
  // 无需切换到展示区，无需外部预览逻辑
  fileOperationResult.value = `预览文件: ${file.name} (由文件气泡组件内部处理)`;
  
  // 不再切换标签页，不再设置demoFileTypes
  // activeComponentTab.value = 'files';
  // demoFileTypes.value = [previewFile];
};

const handleBubbleDownload = (file: any) => {
  fileOperationResult.value = `下载气泡文件: ${file.name}`;
  console.log('下载气泡文件:', file);
};

const handleBubbleRetry = (file: any) => {
  fileOperationResult.value = `重试气泡文件: ${file.name}`;
  console.log('重试气泡文件:', file);
};

const handleDemoFileUpload = (files: FileList) => {
  console.log('处理演示区文件上传:', files);
  
  // 为每个文件创建文件消息
  Array.from(files).forEach((file, index) => {
    const fileMessage: Message = {
      id: `file-${Date.now()}-${index}`,
      type: 'file',
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      fileUrl: URL.createObjectURL(file), // 创建本地预览URL
      fileStatus: 'success',
      content: '',
      isSelf: true,
      time: new Date(),
      file: file, // 保存原始File对象
    };
    
    messages.value.push(fileMessage);
  });
  
  // 模拟AI回复
  setTimeout(() => {
    const reply: Message = {
      id: `file-reply-${Date.now()}`,
      content: `我收到了您发送的 ${files.length} 个文件。文件上传功能正常工作！`,
      isSelf: false,
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      name: 'AI助手',
      time: new Date(),
    };
    messages.value.push(reply);
    
    // 滚动到底部
    nextTick(() => {
      if (messageListRef.value) {
        (messageListRef.value as any).scrollToBottom(true);
      }
    });
  }, 1000);
};

// 聊天窗口文件预览处理
const handleFilePreview = (data: { message: Message, file: any }) => {
  console.log('聊天窗口文件预览:', data);
  const { file } = data;
  
  fileOperationResult.value = `预览文件: ${file.name}`;
  // 注意：预览功能现在由LiaoFileBubble组件内部处理
};

const handleFileDownload = (data: { message: Message, file: any }) => {
  console.log('聊天窗口文件下载:', data);
  const { message, file } = data;
  
  if (message.fileUrl) {
    const link = document.createElement('a');
    link.href = message.fileUrl;
    link.download = file.name;
    link.click();
  }
  
  fileOperationResult.value = `下载文件: ${file.name}`;
};

const handleFileClick = (data: { message: Message, file: any }) => {
  console.log('聊天窗口文件点击:', data);
  const { file } = data;
  
  fileOperationResult.value = `点击文件: ${file.name}`;
  // 注意：点击预览功能现在由LiaoFileBubble组件内部处理
};

// 切换AI/人工模式
const toggleChatMode = () => {
  chatMode.value = chatMode.value === 'ai' ? 'human' : 'ai';
  isStreaming.value = false; // 重置流式输出状态
};

</script>

<style lang="scss" scoped>
.liao-showcase {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
  
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background-color: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    z-index: 10;
    
    h1 {
      font-size: 20px;
      margin: 0;
      color: #333;
    }
  }
  
  &-actions {
    display: flex;
    gap: 8px;
  }
  
  &-btn {
    padding: 8px 16px;
    border: 1px solid #ddd;
    background-color: #fff;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    
    &.active {
      background-color: #1890ff;
      color: white;
      border-color: #1890ff;
    }
  }
  
  &-content {
    display: flex;
    flex-direction: column;
    padding: 24px;
    gap: 24px;
    
    @media (min-width: 1200px) {
      flex-direction: row;
      align-items: flex-start;
    }
  }
  
  &-main-view {
    margin: 0 auto;
    transition: all 0.3s ease;
    
    &.liao-showcase-view-mobile {
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: -20px;
        left: -12px;
        right: -12px;
        bottom: -20px;
        background-color: #e9e9e9;
        border-radius: 32px;
        z-index: -1;
      }
    }
  }
  
  &-components {
    background-color: #fff;
    border-radius: 8px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    @media (min-width: 1200px) {
      min-width: 400px;
      max-width: 400px;
    }
    
    h2 {
      margin-top: 0;
      font-size: 18px;
      margin-bottom: 16px;
      color: #333;
    }
  }
  
  &-tabs {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid #ddd;
    margin-bottom: 16px;
  }
  
  &-tab {
    padding: 8px 16px;
    border: none;
    background: none;
    cursor: pointer;
    font-size: 14px;
    color: #666;
    white-space: nowrap;
    
    &.active {
      color: #1890ff;
      font-weight: bold;
      box-shadow: inset 0 -2px 0 #1890ff;
    }
  }
  
  &-component-container {
    margin-bottom: 24px;
  }
  
  &-component-row {
    margin-bottom: 16px;
    border: 1px solid #eee;
    padding: 16px;
    border-radius: 8px;
    background-color: #fafafa;
  }
  
  &-options {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  &-option {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  &-result {
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 8px;
    margin-top: 16px;
    
    h4 {
      margin-top: 0;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    pre {
      margin: 0;
      white-space: pre-wrap;
      font-size: 12px;
    }
  }
  
  &-select {
    margin-bottom: 16px;
    
    select {
      margin-left: 8px;
      padding: 4px 8px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
  }
  
  &-input-group {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    
    input {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      padding: 8px 16px;
      background-color: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }
  
  &-actions-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  &-action-item {
    background-color: #f5f5f5;
    padding: 4px 8px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    font-size: 14px;
  }
  
  &-remove-btn {
    margin-left: 4px;
    background: none;
    border: none;
    cursor: pointer;
    color: #999;
    font-size: 16px;
    
    &:hover {
      color: #f5222d;
    }
  }
  
  .liao-plugin-container {
    width: 100%;
  }
  
  .liao-plugin-not-found {
    padding: 16px;
    text-align: center;
    color: #999;
    border: 1px dashed #ddd;
    border-radius: 4px;
  }
  
  &-icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 16px;
    margin-top: 16px;
  }
  
  &-icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 8px;
    border: 1px solid #eee;
    border-radius: 8px;
    transition: all 0.2s;
    
    &:hover {
      border-color: #1890ff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
      transform: translateY(-2px);
    }
  }
  
  &-icon-preview {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    color: #333;
  }
  
  &-icon-name {
    font-size: 12px;
    text-align: center;
    color: #666;
    word-break: break-all;
  }
  
  &-icon-code {
    font-size: 10px;
    margin-top: 8px;
    color: #999;
    text-align: center;
    background-color: #f5f5f5;
    padding: 4px;
    border-radius: 4px;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  &-search {
    margin-bottom: 16px;
    
    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      
      &:focus {
        border-color: #1890ff;
        outline: none;
        box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
      }
    }
  }
  
  &-no-icons {
    text-align: center;
    padding: 32px;
    color: #999;
    font-style: italic;
  }
}

.liao-showcase-header {
  .test-btn {
    background-color: $primary-color;
    color: white;
    margin-right: 10px;
    
    &:hover {
      background-color: color.adjust($primary-color, $lightness: -10%);
    }
  }
}

.liao-showcase-form-controls {
  margin-bottom: 16px;
}

.liao-showcase-timeline-controls {
  margin-bottom: 16px;
}

.liao-showcase-scenario-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 固定每行3列
  grid-template-rows: repeat(2, auto); // 最多2行
  gap: 8px;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr); // 移动端每行2列
    grid-template-rows: repeat(3, auto); // 移动端最多3行
    gap: 6px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr; // 小屏幕单列
    grid-template-rows: repeat(6, auto); // 6行显示
    gap: 4px;
  }
}

.liao-showcase-scenario-item {
  background-color: #fafafa;
  border: 2px solid #e6e6e6;
  border-radius: 6px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 60px;
  
  @media (max-width: 768px) {
    padding: 6px;
    min-height: 50px;
  }
  
  &:hover {
    border-color: #b3d9ff;
    background-color: #f0f8ff;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
  }
  
  &.active {
    border-color: #1890ff;
    background-color: #f0f8ff;
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);
    
    &::before {
      content: '✓';
      position: absolute;
      top: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      background-color: #1890ff;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: bold;
      
      @media (max-width: 768px) {
        width: 14px;
        height: 14px;
        font-size: 9px;
        top: 3px;
        right: 3px;
      }
    }
  }
}

.liao-showcase-scenario-name {
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #333;
  padding-right: 20px; // 为选中标记留出空间
  line-height: 1.2;
  
  @media (max-width: 768px) {
    font-size: 11px;
    padding-right: 18px;
    margin-bottom: 3px;
  }
}

.liao-showcase-scenario-desc {
  font-size: 10px;
  color: #666;
  line-height: 1.3;
  
  @media (max-width: 768px) {
    font-size: 9px;
    line-height: 1.2;
  }
}

.liao-showcase-scenario-features {
  background-color: #f9f9f9;
  border-radius: 4px;
  padding: 8px;
  border-left: 2px solid #1890ff;
  
  @media (max-width: 768px) {
    padding: 6px;
    border-left-width: 1px;
  }
  
  h5 {
    margin: 0 0 6px 0;
    font-size: 11px;
    color: #333;
    font-weight: 600;
    
    @media (max-width: 768px) {
      font-size: 10px;
      margin-bottom: 4px;
    }
  }
}

.liao-showcase-feature-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  
  @media (max-width: 768px) {
    gap: 3px;
  }
}

.liao-showcase-feature-tag {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
  border-radius: 3px;
  padding: 1px 6px;
  font-size: 9px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1.4;
  
  @media (max-width: 768px) {
    padding: 1px 4px;
    font-size: 8px;
    border-radius: 2px;
  }
  
  &:nth-child(odd) {
    background-color: #f6ffed;
    border-color: #b7eb8f;
    color: #52c41a;
  }
  
  &:nth-child(3n) {
    background-color: #fff7e6;
    border-color: #ffd591;
    color: #fa8c16;
  }
}

.liao-timeline-scenario-cards {
  margin-top: 24px;
  background-color: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  
  .liao-scenario-cards-header {
    margin-bottom: 16px;
    text-align: center;
    
    h4 {
      font-size: 18px;
      margin: 0 0 8px 0;
      color: #333;
      font-weight: 600;
    }
    
    p {
      font-size: 14px;
      color: #666;
      margin: 0;
      line-height: 1.5;
    }
  }
  
  .liao-scenario-cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    
    @media (max-width: 480px) {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
  
  .liao-scenario-card {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 2px solid #e9ecef;
    border-radius: 12px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    min-height: 140px;
    
    @media (max-width: 768px) {
      padding: 16px;
      min-height: 120px;
    }
    
    @media (max-width: 480px) {
      padding: 12px;
      min-height: 100px;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #1890ff, #52c41a, #faad14, #f5222d, #722ed1, #13c2c2);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover {
      border-color: #1890ff;
      box-shadow: 0 8px 24px rgba(24, 144, 255, 0.15);
      transform: translateY(-4px);
      
      &::before {
        opacity: 1;
      }
      
      .liao-scenario-card-icon {
        transform: scale(1.1);
        filter: drop-shadow(0 4px 8px rgba(24, 144, 255, 0.3));
      }
      
      .liao-scenario-card-arrow {
        transform: translateX(4px);
        color: #1890ff;
      }
    }
    
    &:active {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
    }
    
    .liao-scenario-card-icon {
      font-size: 36px;
      margin-bottom: 12px;
      transition: all 0.3s ease;
      align-self: flex-start;
      
      @media (max-width: 768px) {
        font-size: 32px;
        margin-bottom: 10px;
      }
      
      @media (max-width: 480px) {
        font-size: 28px;
        margin-bottom: 8px;
      }
    }
    
    .liao-scenario-card-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      
      .liao-scenario-card-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 8px;
        color: #333;
        line-height: 1.3;
        
        @media (max-width: 768px) {
          font-size: 15px;
          margin-bottom: 6px;
        }
        
        @media (max-width: 480px) {
          font-size: 14px;
          margin-bottom: 4px;
        }
      }
      
      .liao-scenario-card-desc {
        font-size: 13px;
        color: #666;
        line-height: 1.4;
        flex: 1;
        
        @media (max-width: 768px) {
          font-size: 12px;
        }
        
        @media (max-width: 480px) {
          font-size: 11px;
          line-height: 1.3;
        }
      }
    }
    
    .liao-scenario-card-arrow {
      position: absolute;
      bottom: 16px;
      right: 16px;
      font-size: 20px;
      color: #999;
      transition: all 0.3s ease;
      font-weight: bold;
      
      @media (max-width: 768px) {
        bottom: 12px;
        right: 12px;
        font-size: 18px;
      }
      
      @media (max-width: 480px) {
        bottom: 8px;
        right: 8px;
        font-size: 16px;
      }
    }
    
    // 为不同场景添加特色边框颜色
    &:nth-child(1) { // logistics
      &:hover {
        border-color: #1890ff;
        &::before { background: #1890ff; }
      }
    }
    
    &:nth-child(2) { // activity
      &:hover {
        border-color: #722ed1;
        &::before { background: #722ed1; }
      }
    }
    
    &:nth-child(3) { // work
      &:hover {
        border-color: #52c41a;
        &::before { background: #52c41a; }
      }
    }
    
    &:nth-child(4) { // milestone
      &:hover {
        border-color: #faad14;
        &::before { background: #faad14; }
      }
    }
    
    &:nth-child(5) { // learning
      &:hover {
        border-color: #13c2c2;
        &::before { background: #13c2c2; }
      }
    }
    
    &:nth-child(6) { // changelog
      &:hover {
        border-color: #f5222d;
        &::before { background: #f5222d; }
      }
    }
  }
}

// 文件上传展示样式
.liao-showcase-file-bubbles {
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
}

.liao-showcase-bubble-left,
.liao-showcase-bubble-right {
  flex: 1;
  
  h4 {
    margin: 0 0 12px 0;
    font-size: 14px;
    color: #666;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  
  > div:not(:first-child) {
    margin-top: 12px;
  }
}

.liao-showcase-file-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.liao-showcase-file-type {
  background: #fafafa;
  border-radius: 8px;
  padding: 8px;
}

.liao-showcase-file-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background-color: #fafafa;
  border: 1px solid #e6e6e6;
  border-radius: 8px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 8px;
    padding: 8px;
  }
}

.liao-showcase-file-card {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.liao-showcase-btn.mode-btn {
  background-color: #f5f5f5;
  color: #333;
  border: 2px solid #ddd;
  transition: all 0.3s ease;
  font-weight: 500;
  min-width: 100px;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:not(:disabled):hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}

.liao-showcase-btn.ai-mode.mode-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border-color: #4CAF50;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
  
  &:not(:disabled):hover {
    background: linear-gradient(135deg, #45a049 0%, #3d8b40 100%);
    box-shadow: 0 4px 16px rgba(76, 175, 80, 0.4);
  }
}

.liao-showcase-btn.human-mode.mode-btn {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
  color: white;
  border-color: #2196F3;
  box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
  
  &:not(:disabled):hover {
    background: linear-gradient(135deg, #1976D2 0%, #1565C0 100%);
    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.4);
  }
}
</style> 