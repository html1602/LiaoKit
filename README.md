# LiaoKit 🚀

![版本](https://img.shields.io/badge/版本-2.5.0-blue.svg)
![构建状态](https://img.shields.io/badge/构建-通过-brightgreen.svg)
![最后更新](https://img.shields.io/badge/最后更新-2025--06--16-green.svg)

一个现代化的 Vue 3 组件库，专注于创建直观、高效的用户界面。采用 TypeScript + Vite + Sass 技术栈，提供丰富的业务组件和插件系统。

## ✨ 最新更新 (v2.5.0) - 全局状态管控演示系统

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
