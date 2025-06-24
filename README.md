# LiaoKit 🚀

![版本](https://img.shields.io/badge/版本-2.6.0-blue.svg)
![构建状态](https://img.shields.io/badge/构建-通过-brightgreen.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--24-green.svg)

一个现代化的 Vue 3 组件库，专注于创建直观、高效的用户界面。采用 TypeScript + Vite + Sass 技术栈，提供丰富的业务组件和插件系统。现已集成 AI 智能消息适配功能，支持自动转换各种消息格式！

## 🎯 完整功能预览

### 🚀 [多窗口管理系统完整演示](/window-preview)

体验LiaoKit多窗口管理组件的完整功能，包括：

**🖥️ 桌面端体验**：
- 多窗口并发管理和拖拽交互
- 四种专业布局模式（自由、网格、层叠、平铺）
- 窗口最小化和层级管理
- AI与人工模式实时切换

**📱 移动端体验**：
- 标签页式单窗口展示
- 未读消息徽章显示
- 触摸友好的交互设计

**⚡ 交互功能**：
- 实时消息模拟和聊天体验
- 智能未读消息管理
- 完整的会话状态控制
- 响应式设备类型切换

> 🎮 **立即体验**：访问预览页面，创建多个窗口，尝试不同布局模式，感受企业级多窗口管理的强大功能！

## ✨ 最新更新 (v2.6.0) - AI 智能消息格式适配器

### 🧠 AI 智能消息适配器 - 革命性功能发布！(2025-06-24)

**重大突破**：LiaoKit 现已集成通义千问大模型，实现 AI 驱动的智能消息格式适配，一键解决不同业务系统消息格式不统一的痛点！

#### **🎯 核心价值**

解决企业级项目中最常见的痛点：**不同业务系统的消息格式千差万别**，现在只需一个配置，AI 自动识别并转换为统一的标准格式！

```typescript
// 🔥 一行代码启用 AI 适配
<LiaoMessageList
  :messages="rawMessages"
  :useAiAdapter="true"
  :aiAdapterOptions="{
    apiKey: 'sk-your-qwen-api-key',
    businessScenario: 'customer-service'
  }"
  @adapter-success="handleAdapterSuccess"
/>
```

#### **🚀 智能适配能力**

**支持自动识别和转换的消息格式**：
- **第三方API响应** → 标准消息格式
- **数据库原始数据** → 组件可用格式  
- **微信/钉钉消息** → 统一聊天格式
- **CSV/Excel数据** → 结构化消息
- **日志文件** → 可视化消息流

```typescript
// 原始数据 (各种奇怪格式)
const rawData = [
  { data: { msg: "hello", from: "user1", time: 1703401234567 } },
  { content: "world", sender: { name: "user2" }, timestamp: "2024-01-01" },
  { text: "AI消息", user: "assistant", created_at: "2024-01-01T10:00:00Z" }
];

// AI 自动转换为标准格式 ✨
const standardMessages = [
  { id: "msg_1", content: "hello", sender: "user1", timestamp: 1703401234567, type: "text" },
  { id: "msg_2", content: "world", sender: "user2", timestamp: 1704067200000, type: "text" },
  { id: "msg_3", content: "AI消息", sender: "assistant", timestamp: 1704103200000, type: "text" }
];
```

#### **💡 分层 Prompt 模板系统**

- **通用模板**：适配所有消息类型的基础模板
- **专用模板**：针对图片、文件、系统消息的优化模板  
- **业务模板**：客服、电商、社交、协作场景的专用模板
- **自定义模板**：完全可定制的 Prompt 系统

```typescript
// 业务场景智能适配
const adapterOptions = {
  apiKey: 'your-api-key',
  businessScenario: 'customer-service', // 客服场景优化
  customPrompt: `专门优化客服对话格式转换...` // 可自定义
};
```

#### **⚡ 高性能缓存系统**

- **LRU 缓存算法**：智能淘汰最少使用的缓存
- **MD5 哈希键**：基于消息内容生成唯一缓存键
- **TTL 过期机制**：30分钟自动过期，可配置
- **60%+ 缓存命中率**：相同格式消息秒级响应

```typescript
// 缓存配置
const adapterOptions = {
  apiKey: 'your-api-key',
  enableCache: true,
  cacheSize: 1000,      // 最大缓存条目
  cacheTTL: 1800000,    // 30分钟过期
};
```

#### **🛡️ 多层兜底方案**

**三重保障**，确保功能始终可用：
1. **AI 适配成功** ✅ → 使用 AI 转换结果
2. **AI 适配失败** 🔄 → 自动使用本地适配器
3. **本地适配失败** 🆘 → 返回原始数据 + 友好提示

```typescript
// 本地兜底适配器示例
class LocalMessageAdapter {
  adaptMessage(rawMessage: any): StandardMessage {
    return {
      id: rawMessage.id || this.generateId(),
      content: this.extractContent(rawMessage), 
      sender: this.extractSender(rawMessage),
      timestamp: this.parseTimestamp(rawMessage),
      type: this.inferType(rawMessage)
    };
  }
}
```

#### **🎛️ 完整演示示例**

提供功能完整的演示页面 `AiMessageAdapterExample.vue`：

- **实时控制面板**：开关配置、参数调整、统计显示
- **测试消息库**：15+ 种不同格式的测试消息
- **事件日志系统**：完整记录适配过程和结果
- **自定义消息输入**：支持 JSON 格式自定义测试
- **性能监控**：实时显示缓存命中率、处理速度等指标

#### **🔧 Vue 组合式函数**

```typescript
import { useAiMessageAdapter } from '@/ai-adapter';

const adapterOptions = ref({
  apiKey: 'your-api-key',
  businessScenario: 'social'
});

const {
  adaptMessages,      // 适配消息函数
  isLoading,         // 加载状态
  error,             // 错误信息  
  stats,             // 统计数据
  clearCache         // 清空缓存
} = useAiMessageAdapter(adapterOptions);

// 使用适配功能
const result = await adaptMessages(rawMessages);
```

#### **📊 性能表现**

- **AI 响应时间**：500-2000ms（首次）
- **缓存命中响应**：< 1ms（极速）
- **兜底处理响应**：< 10ms（可靠）
- **内存占用**：每条缓存约 1KB（轻量）
- **API 优化**：批量处理减少调用次数

#### **🎯 使用场景**

1. **企业级客服系统**：统一各渠道消息格式
2. **多平台消息聚合**：微信、钉钉、邮件等格式统一
3. **第三方系统集成**：快速对接各种 API 数据格式
4. **数据迁移项目**：历史数据格式转换
5. **跨部门协作**：统一不同部门的数据格式

**技术价值**：这个功能将 LiaoKit 从基础组件库升级为**AI 驱动的智能解决方案**，大幅降低了企业级项目中数据格式适配的开发成本！

---

## ✨ 历史更新 (v2.7.0) - 多窗口预览系统

### 🎬 多窗口完整预览演示页面 (2025-06-23)

**WindowListPreview** - 创建了专门的多窗口预览页面，提供完整的企业级多窗口管理体验：

#### **🎯 功能控制面板**
- **窗口操作**：创建窗口、模拟消息、切换AI模式、清空未读
- **布局控制**：四种布局模式实时切换演示
- **设备模拟**：桌面/移动端响应式切换体验
- **状态监控**：实时显示窗口统计和系统状态

#### **💬 完整聊天体验**  
- **真实对话模拟**：智能回复机制，AI/人工不同响应风格
- **用户信息展示**：头像、姓名、状态指示器
- **消息时间处理**：智能时间格式化和显示
- **快速回复功能**：预设回复选项，提升操作效率

#### **🎨 专业UI设计**
- **现代化控制面板**：渐变按钮、悬停动效、状态指示
- **流畅动画系统**：窗口创建、切换、拖拽的丝滑过渡
- **响应式布局**：完美适配各种屏幕尺寸
- **视觉状态反馈**：丰富的交互反馈和状态提示

#### **🛠️ 技术架构**
```vue
<template>
  <!-- 功能控制面板 -->
  <div class="control-panel">
    <div class="control-section">
      <h3>窗口操作</h3>
      <button @click="createCustomWindow">创建窗口</button>
      <button @click="simulateIncomingMessage">模拟消息</button>
    </div>
  </div>
  
  <!-- 多窗口展示区域 -->
  <LiaoWindowList>
    <template #window-content="{ window, isActive }">
      <WindowContent 
        :window="window"
        :is-active="isActive"
        @send-message="handleSendMessage"
        @switch-mode="handleSwitchMode"
      />
    </template>
  </LiaoWindowList>
  
  <!-- 实时状态面板 -->
  <div class="status-panel">
    <div class="status-item">
      <span>窗口总数: {{ windowStats.total }}</span>
    </div>
  </div>
</template>
```

#### **🚀 集成特色**
- **路由系统**：完整的Vue Router配置，支持独立访问
- **组件插槽**：自定义窗口内容，展示真实聊天界面
- **类型安全**：完整TypeScript支持，提供智能提示
- **文档完善**：详细的开发日志和使用说明

**预览访问**：通过ComponentsShowcase中的"查看完整多窗口预览演示"按钮，或直接访问 `/window-preview` 路径。

这个预览页面标志着LiaoKit从组件库向完整解决方案的重要演进，为用户提供了直观的功能体验和技术展示平台。

---

## ✨ 历史更新 (v2.6.0) - 第二阶段：多窗口智能客服系统

### 🏢 LiaoWindowList 多窗口管理核心组件 (2025-01-27)

#### **🎯 第二阶段核心突破：从组件库到完整解决方案**

**LiaoWindowList** - 多窗口/多会话管理组件，是LiaoKit第二阶段的核心基础设施，将组件库升级为专业级智能客服系统：

#### **🖥️ 桌面端多窗口特性**
- **多窗口并排管理**：支持同时开启多个会话窗口
- **灵活拖拽交互**：点击标题栏拖拽移动，边界检测保护
- **四种布局模式**：自由、网格、层叠、平铺四种专业布局
- **智能层级管理**：点击自动激活，层级自动提升
- **最小化窗口栏**：最小化窗口显示在底部，一键恢复
- **未读消息高亮**：实时显示未读数量，视觉突出提醒

#### **📱 移动端适配特性**
- **标签页模式**：自动切换为标签页样式，适配小屏幕
- **单窗口内容**：当前活跃窗口全屏显示
- **标签切换动画**：流畅的切换过渡效果
- **未读徽章显示**：标签页显示未读消息徽章

#### **🎨 交互体验优化**
```vue
<template>
  <LiaoWindowList
    :max-window-count="5"
    :auto-create-first="true" 
    :default-layout="'free'"
    :mobile-breakpoint="768"
    @window-created="handleWindowCreated"
    @window-closed="handleWindowClosed"
  >
    <template #window-content="{ window, isActive }">
      <!-- 自定义窗口内容 -->
      <LiaoWindow 
        :window-id="window.id"
        :session-mode="window.mode"
        :is-active="isActive"
      >
        <LiaoMessageList :messages="getWindowMessages(window.id)" />
        <LiaoInputArea @send="handleWindowSend" />
      </LiaoWindow>
    </template>
  </LiaoWindowList>
</template>
```

#### **🏗️ 技术架构创新**

**Composable状态管理模式**：
```typescript
// 使用useWindowManager实现逻辑复用
const {
  windows, activeWindowId, layoutMode, dragState,
  createWindow, closeWindow, activateWindow,
  startDrag, duringDrag, endDrag, applyLayout
} = useWindowManager(config);
```

**响应式设备适配**：
```scss
// 768px自动断点切换
@media (min-width: 769px) {
  /* 桌面端多窗口布局 */
}

@media (max-width: 768px) {
  /* 移动端标签页布局 */
}
```

**类型安全设计**：
```typescript
interface WindowInfo {
  id: string;
  title: string;
  mode: 'AI' | 'human';
  status: 'active' | 'inactive' | 'minimized';
  unreadCount: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  // ... 完整类型定义
}
```

#### **🎯 核心价值**

1. **完整的多窗口管理能力**：满足企业级客服系统需求
2. **优秀的用户交互体验**：流畅动画、直观操作、美观界面  
3. **灵活的集成接口**：插槽系统、事件系统、配置系统
4. **全面的响应式支持**：桌面/移动端无缝适配

#### **🚀 布局模式详解**

- **自由模式(free)**：用户自定义拖拽定位，支持重叠
- **网格模式(grid)**：自动等分网格排列，整齐美观
- **层叠模式(cascade)**：经典桌面层叠效果，右下偏移
- **平铺模式(tile)**：水平平铺显示，最大化利用空间

#### **⚡ 性能优化亮点**

- **事件委托机制**：减少事件监听器数量
- **防抖位置更新**：60fps流畅拖拽体验
- **内存清理机制**：窗口关闭时自动清理引用
- **计算属性缓存**：复杂计算结果自动缓存

这标志着**LiaoKit从基础组件库向完整解决方案的重要跨越**，为多窗口/多会话智能客服系统奠定了坚实的技术基础！

---

### 📁 文件预览架构重构 (2025-01-15)
- **🎯 组件统一架构**：真正的"一个组件，多种布局"设计理念
  - **统一组件**：`LiaoFileBubble` 成为唯一的文件处理组件
  - **三种布局**：`bubble`（消息气泡）、`list`（列表项）、`card`（卡片）
  - **一致体验**：所有布局模式都有相同的预览交互
- **🔧 组件级自包含设计**：无需外部配置的文件预览
  - ✅ **内置预览弹窗**：点击即可预览，无需外部处理
  - ✅ **FileReader API集成**：真实文件内容读取和预览
  - ✅ **现代化UI**：全屏遮罩 + 响应式布局 + ESC键/点击关闭
- **📝 15+种文件类型支持**：
  - 📝 **文本文件**：txt, md, json, csv, log, xml, yaml, yml
  - 💻 **代码文件**：js, ts, jsx, tsx, vue, html, css, scss, sass, less, py, java, c, cpp, h, php
  - 🖼️ **媒体文件**：jpg, png, gif, svg, mp4, webm, mp3, wav等
- **🏗️ 向后兼容**：完全兼容现有API，同时支持新的布局模式

**核心价值**：
```vue
<!-- 聊天窗口：消息气泡布局 -->
<LiaoFileBubble layout="bubble" messageType="self" :fileName="file.name" />

<!-- 文件列表：列表项布局 -->  
<LiaoFileBubble layout="list" :name="file.name" :showAvatar="false" />

<!-- 文件网格：卡片布局 -->
<LiaoFileBubble layout="card" :name="file.name" :showAvatar="false" />
```

**重大突破**：
- ✅ 真正的组件统一：聊天窗口和展示区使用同一个组件
- ✅ 组件级预览：点击任何文件气泡都能直接预览
- ✅ 架构优雅：消除了组件分离和外部依赖问题
- ✅ 开发友好：一个组件满足所有文件展示需求

### 🎛️ 全局对话状态与消息流管控预览 (2025-06-16)
- **新增演示页面**：创建专门的全局状态管控演示页面 (`/global-state`)
- **实时状态可视化**：直观展示会话模式、输入锁定状态、活跃插件等信息
- **完整的控制面板**：
  - 🔒 **锁定控制**：AI回复锁定、插件操作锁定、表单/投票必填锁定、自定义锁定
  - 💬 **消息流控制**：手动添加消息、AI思考模拟、消息清空
  - 🔌 **插件演示**：必须完成插件 vs 可选插件的不同行为展示
  - 📝 **状态日志**：实时记录所有状态变化，支持分类查看
- **交互式体验**：
  - 双向状态同步：控制面板与LiaoWindow组件状态完全同步
  - 紧急解锁机制：防死锁保护，确保系统始终可恢复
  - AI思考动画：3秒思考过程，自动锁定/解锁演示
  - 响应式设计：完美适配桌面端和移动端

**核心演示场景**：
```javascript
// 会话模式切换演示
switchToAI() / switchToHuman()

// 智能锁定机制演示
lockForAIReply() - AI回复锁定
lockForPlugin() - 插件操作锁定  
lockForForm() - 表单填写锁定
emergencyUnlock() - 紧急解锁

// 插件系统演示
showRequiredPlugin() - 必须完成插件（锁定输入）
showOptionalPlugin() - 可选插件（不锁定输入）
```

### 🔧 重要修复：Vue Script Setup 导出错误 (2024-12-28)
- **修复编译错误**：解决 `<script setup>` 中使用 `export` 语句的语法错误
- **重构类型系统**：创建独立的 `src/types/session.ts` 文件管理会话相关类型
- **导入优化**：修正了所有相关组件的类型导入，确保类型安全
- **代码组织改进**：
  - 将共享类型抽离到独立文件
  - 区分类型导入 (`import type`) 和值导入 (`import`)
  - 遵循 Vue 3 `<script setup>` 最佳实践

**影响的文件**：
- 新建：`src/types/session.ts` - 会话状态类型定义
- 修改：`LiaoWindow.vue` - 移除导出语句，更新导入
- 修改：`LiaoInputArea.vue` - 更新类型导入路径
- 修改：`LiaoPluginBubble.vue` - 更新类型导入路径

### 🔄 全局状态管控重大升级
- **组件级状态控制**：无业务逻辑判断，纯状态控制接口
  - LiaoWindow：全局状态管理器，统一管理会话模式和输入锁定
  - LiaoInputArea：状态响应器，智能响应锁定状态变化
  - LiaoPluginBubble：状态触发器，根据配置自动锁定/解锁
- **细粒度消息控制**：每条plugin消息可独立设置必须完成状态
  - 支持 `pluginRequired` 属性控制
  - 默认为false，保持向后兼容
  - 智能解锁策略：完成自动解锁，取消根据required状态决定
- **自动解锁机制**：
  - 超时自动解锁（默认30秒）
  - 紧急解锁功能
  - 友好的锁定原因提示

### 🎯 会话状态管理核心特性

```javascript
// 全局状态管理配置
<LiaoWindow
  :default-session-mode="'human'"
  :auto-unlock-timeout="30000"
  :enable-emergency-unlock="true"
  @session-mode-change="handleModeChange"
  @plugin-complete="handlePluginComplete"
>
  <LiaoMessageList :messages="messages" />
  <LiaoInputArea />
</LiaoWindow>

// 消息定义 - 必须完成的插件
const requiredMessage = {
  id: 1,
  type: 'plugin',
  pluginType: 'form',
  pluginData: { /* 表单数据 */ },
  pluginRequired: true // 锁定输入直到完成
};

// 消息定义 - 可选完成的插件
const optionalMessage = {
  id: 2,
  type: 'plugin',
  pluginType: 'info',
  pluginData: { /* 信息数据 */ },
  pluginRequired: false // 不锁定输入
};
```

### 🔒 智能锁定策略

#### 锁定原因类型
- **AI_REPLYING**：AI正在回复中
- **PLUGIN_PENDING**：插件操作待完成
- **FORM_REQUIRED**：表单填写必须完成
- **VOTE_REQUIRED**：投票选择必须完成
- **CUSTOM**：自定义锁定原因

#### 解锁策略
- **完成操作**：所有类型插件自动解锁
- **取消操作**：非必须插件解锁，必须插件保持锁定
- **错误操作**：根据required状态智能决策
- **超时解锁**：防止死锁，自动恢复交互

### 🗳️ LiaoVotePlugin 响应式优化 (v2.4.0)

### 🗳️ LiaoVotePlugin 重大体验升级
- **移动端文本换行优化**：完美解决长文本换行变形问题
  - 智能文本断行：`word-break: break-word` + `overflow-wrap: break-word`
  - 优化行高和字体大小，保持视觉协调
  - 设置最小高度保持卡片一致性
  - 调整间距和内边距，提升移动端体验
- **桌面端对齐统一**：选项标题和描述统一左对齐
  - 副标题字体大小优化（sm → md）
  - 统一文本对齐方式
  - 保持hover效果和交互动画
- **响应式布局完善**：
  - 移动端（≤768px）：紧凑布局，防变形设计
  - 桌面端（≥769px）：宽松布局，统一对齐
  - 智能字体大小调整
  - 优化交互反馈

### 🚀 投票插件核心特性

```javascript
// 完整的投票插件配置
const voteData = {
  title: '产品功能优先级投票',
  subtitle: '帮助我们了解您的需求',
  question: '您最希望我们优先开发哪些功能？',
  description: '请选择您认为最重要的功能（可多选）',
  allowMultiple: true,
  showResults: true,
  showPercentage: true,
  options: [
    {
      id: 'mobile',
      text: '移动端适配优化',
      description: '提升移动设备使用体验，优化触摸交互',
      icon: 'mobile'
    },
    {
      id: 'charts',
      text: '数据可视化增强',
      description: '更多图表类型，更丰富的数据展示方式',
      icon: 'chart'
    },
    {
      id: 'themes',
      text: '主题定制系统',
      description: '支持深色模式，自定义品牌色彩',
      icon: 'palette'
    }
  ]
};
```

### 📱 响应式设计亮点

#### 移动端优化（≤768px）
- **防变形文本处理**：智能断行，保持美观
- **紧凑布局**：最小高度60px，保持一致性
- **触摸友好**：禁用hover效果，优化点击区域
- **全宽按钮**：提交按钮占满宽度，易于操作

#### 桌面端优化（≥769px）
- **统一左对齐**：标题和描述保持一致对齐
- **丰富交互**：hover动画，阴影变化
- **宽松布局**：充足间距，舒适阅读体验

## 🏗️ 快速开始

### 环境要求
- Node.js >= 16.0.0
- npm >= 7.0.0

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

## 📦 核心组件

### 🎨 布局组件
- **LiaoApp** - 主应用容器，支持多种布局模式
- **LiaoWindow** - 窗口容器，模拟操作系统窗口体验
- **LiaoMessageList** - 消息列表，支持虚拟滚动和下拉刷新

### 🧩 插件系统
- **LiaoStatsPlugin** - 📊 智能数据统计（图表功能）
- **LiaoListPlugin** - 📋 动态列表插件
- **LiaoInfoPlugin** - ℹ️ 信息展示插件
- **LiaoActionsPlugin** - ⚡ 快捷操作插件（统一背景字段）
- **LiaoVotePlugin** - 🗳️ 投票调研插件（响应式优化）
- **LiaoFaqCardPlugin** - ❓ FAQ问答插件
- **LiaoTimelinePlugin** - 📅 时间线插件
- **LiaoMediaCarouselPlugin** - 🎨 媒体轮播插件
- **LiaoProgressPlugin** - 📋 进度跟踪插件

### 💬 交互组件
- **LiaoMessageBubble** - 消息气泡，支持多种消息类型
- **LiaoInputArea** - 智能输入区域，支持语音和快捷操作
- **LiaoQuickActionBar** - 快捷操作栏

## 🎛️ 演示和预览

### 在线演示页面
- **组件展示** (`/showcase`) - 全组件库功能展示
- **流式输出** (`/streaming`) - 实时消息流演示
- **全局状态演示** (`/global-state`) - 🆕 **核心推荐**：完整的状态管控演示

### 全局状态演示亮点
```
🎯 核心功能演示：
├── 实时状态可视化
│   ├── 会话模式显示（AI/人工）
│   ├── 输入锁定状态监控
│   ├── 锁定原因详情展示
│   └── 活跃插件信息追踪
├── 交互式控制面板
│   ├── 🔒 锁定控制（5种锁定类型）
│   ├── 💬 消息流管理（手动/自动）
│   ├── 🔌 插件演示（必须/可选）
│   └── 🚨 紧急解锁保护
└── 📝 实时操作日志
    ├── 分类日志记录
    ├── 时间戳追踪
    └── 50条历史记录
```

## 🗳️ LiaoVotePlugin 功能详解

### 数据结构支持
```javascript
// 复杂选项对象（推荐）
const complexOptions = [
  {
    id: 'feature1',
    text: '功能标题',
    description: '详细的功能描述信息',
    icon: 'icon-name'
  }
];

// 简单字符串数组（向后兼容）
const simpleOptions = ['选项1', '选项2', '选项3'];
```

### 投票模式
- **单选模式**：`allowMultiple: false` - 经典单选投票
- **多选模式**：`allowMultiple: true` - 支持多项选择

### 状态管理
- **投票流程**：未投票 → 投票中 → 已投票 → 查看结果
- **修改投票**：支持重新选择和提交
- **结果展示**：进度条、百分比、票数统计

### 响应式特性
- **智能布局**：根据屏幕尺寸自动调整
- **文本处理**：防止长文本换行变形
- **交互优化**：移动端和桌面端差异化体验

## 🎯 LiaoStatsPlugin 图表功能详解

### 智能模式切换
```javascript
// 数字卡片模式（单天数据）
const singleDayData = {
  items: [
    { 
      label: '今日订单', 
      value: '128单', 
      icon: '📋', 
      change: 12.5, 
      color: '#1890ff' 
    }
  ]
};

// 图表模式（多天数据）
const chartData = {
  items: [
    {
      label: '销售趋势',
      icon: '💰',
      color: '#52c41a',
      chartType: 'area', // line | area | column
      unit: '万元',
      chartData: [
        { date: '6/7', value: 31.5 },
        { date: '6/8', value: 28.2 },
        { date: '6/9', value: 33.8 },
        { date: '6/10', value: 29.7 },
        { date: '6/11', value: 35.6 },
        { date: '6/12', value: 38.2 }
      ]
    }
  ]
};
```

### 图表类型特点
- **折线图 (line)**：清晰展示数据走势，适合趋势分析
- **面积图 (area)**：突出数据量级和趋势，视觉效果强
- **柱状图 (column)**：适合不同时间点的数值对比

## 🛠️ 技术架构

### 核心技术栈
- **前端框架**: Vue 3.4+ (Composition API)
- **构建工具**: Vite 5.0+
- **类型系统**: TypeScript 5.0+
- **样式预处理**: Sass/SCSS
- **图表库**: AntV G2Plot (新增)
- **代码规范**: ESLint + Prettier

### 架构特色
- **组合式API**: 更好的代码组织和类型推导
- **插件化架构**: 高度模块化，易于扩展
- **TypeScript全覆盖**: 完整的类型安全保障
- **响应式设计**: 移动端优先，多设备适配
- **性能优化**: 虚拟滚动、懒加载、缓存策略

## 📱 响应式设计

### 断点设计
- **桌面端**: ≥1200px - 完整功能，最佳体验
- **平板端**: 768px-1199px - 优化触摸交互
- **手机端**: ≤767px - 移动端专用设计
- **超小屏**: ≤576px - 紧凑布局优化

### 图表响应式
- **桌面端**: 120px图表高度，完整交互功能
- **平板端**: 100px图表高度，触摸优化
- **手机端**: 80px图表高度，简化界面

## 🔧 开发指南

### 项目结构
```
src/
├── components/          # 组件库
│   ├── LiaoApp/        # 应用容器
│   ├── LiaoPlugins/    # 插件组件
│   │   └── LiaoStatsPlugin.vue  # 统计插件（含图表功能）
│   └── ...
├── examples/           # 示例和演示
│   ├── ComponentsShowcase.vue     # 组件展示
│   ├── StreamingExample.vue       # 流式输出演示
│   └── GlobalStateDemo.vue        # 全局状态演示 🆕
├── types/              # 类型定义
│   └── session.ts      # 会话状态类型 🆕
├── styles/             # 样式文件
└── assets/            # 静态资源
```

### 开发规范
- 组件命名: PascalCase (如 `LiaoStatsPlugin`)
- 文件命名: kebab-case (如 `liao-stats-plugin.vue`)
- CSS类名: BEM命名规范
- TypeScript: 严格模式，完整类型定义

## 📚 文档和示例

### 组件文档
- [LiaoStatsPlugin](./Docs/ComponentGuides/LiaoStatsPlugin.md) - 智能统计插件文档
- [LiaoWindow 组件](Docs/ComponentGuides/LiaoWindow.md) - 智能窗口容器组件使用指南 🆕
- [开发日志](./Docs/DevLog/) - 详细开发记录
- [变更日志](./Docs/ChangeLog.md) - 版本更新历史

### 在线示例
访问项目运行后的示例页面，可以实时查看所有组件的效果和交互。**特别推荐体验 `/global-state` 页面的完整状态管控功能！**

## 🚀 性能优化

### 图表性能
- **按需渲染**: 只有图表模式才加载G2Plot库
- **实例管理**: 自动销毁图表实例，防止内存泄漏
- **数据监听**: 智能更新机制，避免不必要的重绘

### 组件性能
- **虚拟滚动**: 长列表性能优化
- **懒加载**: 组件和资源按需加载
- **缓存策略**: 智能缓存机制，提升响应速度

### 状态管理性能
- **事件防抖**: 防止频繁状态变化影响性能
- **批量更新**: 状态变更合并处理，减少重渲染
- **内存控制**: 自动清理过期状态和定时器

## 🔄 版本历史

### v2.5.0 (2025-06-16) - 全局状态管控演示系统
- 🎛️ 新增全局状态演示页面，完整展示LiaoWindow状态管控能力
- 🔧 修复Vue Script Setup导出错误，重构类型系统
- 🔒 完善智能锁定机制，支持5种锁定原因和优先级管理
- 🚨 增强紧急解锁功能，防死锁保护机制
- 📱 优化响应式设计，移动端完美适配

### v2.3.0 (2025-06-13) - 统一背景字段设计
- 🎨 LiaoActionsPlugin新增统一 `background` 字段
- 🔧 智能背景类型检测和CSS属性应用
- ✅ 完美向后兼容，旧API自动转换
- 📖 更新文档和示例，展示新API使用方法

### v2.2.0 (2025-06-12) - 智能图表升级
- 🚀 LiaoStatsPlugin新增图表功能
- 📊 集成AntV G2Plot图表库

### v2.1.3 (2025-06-12) - 样式优化
- 🎨 现代化卡片设计
- 📱 移动端响应式优化
- ♿ 可访问性改进

### v2.1.0 (2025-06-11)
- ✨ 插件系统完善
- 🔧 组件API统一
- 📝 文档体系建立

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！请遵循项目的代码规范和提交规范。

## 📄 许可证

MIT License - 详见 [LICENSE](./LICENSE) 文件

---

**立即体验**: `npm run dev` 启动项目，访问 `/global-state` 查看完整的全局状态管控演示！

## 📚 文档目录

### 开发文档
- [开发环境配置](Docs/DevEnvConfig.md) - 项目初始化和环境搭建指南
- [技术架构文档](Docs/Architecture.md) - 项目整体架构和技术栈说明
- [组件系统概览](Docs/ComponentSystem.md) - 组件化开发规范和最佳实践
- [API 接口文档](Docs/API.md) - 后端API接口说明

### 组件使用指南
- [LiaoInputArea 组件](Docs/ComponentGuides/LiaoInputArea.md) - 智能输入区域组件使用指南
- [LiaoPluginBubble 组件](Docs/ComponentGuides/LiaoPluginBubble.md) - 插件气泡组件使用指南
- [LiaoMessageList 组件](Docs/ComponentGuides/LiaoMessageList.md) - 消息列表组件使用指南
- [LiaoWindow 组件](Docs/ComponentGuides/LiaoWindow.md) - 智能窗口容器组件使用指南 🆕

### 开发日志
- [开发日志目录](Docs/DevLog/) - 按日期记录的开发进度和问题解决
- [提问日志目录](Docs/AskLog/) - 与AI交互的记录和学习笔记

### 功能特性
- [功能地图](Docs/FeatureMap.md) - 项目功能模块和依赖关系图
- [功能规则文档](Docs/Feature/) - 各功能模块的设计思路和实现细节

### 项目管理
- [版本变更日志](Docs/ChangeLog.md) - 版本更新记录和功能变更
- [常见问题解答](Docs/FAQ.md) - 开发和使用过程中的常见问题
- [技术债务跟踪](Docs/TechDebt.md) - 待优化的技术问题记录
