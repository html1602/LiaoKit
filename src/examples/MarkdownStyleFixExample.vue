<template>
  <div class="markdown-style-fix-example">
    <div class="example-header">
      <h2>🎨 AI消息Markdown样式修复演示</h2>
      <p class="example-description">
        解决AI回复显示样式难看的问题，提供美观的Markdown渲染效果
      </p>
    </div>

    <div class="example-controls">
      <div class="control-group">
        <label>
          <input v-model="useEnhancedMarkdown" type="checkbox" />
          启用增强Markdown样式
        </label>
      </div>
      <div class="control-group">
        <label>
          <input v-model="darkTheme" type="checkbox" />
          暗色主题
        </label>
      </div>
      <button @click="addTestMessage" class="add-btn">
        添加测试消息
      </button>
    </div>

    <div class="example-content">
      <div class="messages-container">
        <div class="message-comparison">
          <!-- 原始样式 -->
          <div class="comparison-section">
            <h3>❌ 原始样式（问题示例）</h3>
            <div class="message-bubble original-style">
              <div class="message-content">
                <div v-html="originalMarkdownHTML"></div>
              </div>
            </div>
          </div>

          <!-- 修复后样式 -->
          <div class="comparison-section">
            <h3>✅ 修复后样式（美观效果）</h3>
            <div class="message-bubble fixed-style" :class="{ 'dark-theme': darkTheme }">
              <div class="message-content">
                <div 
                  class="liao-markdown-content" 
                  :class="{ 'dark-theme': darkTheme }"
                  v-html="enhancedMarkdownHTML"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- LiaoMessageList演示 -->
        <div class="liaokit-demo">
          <h3>📱 LiaoKit组件集成演示</h3>
          <LiaoMessageList
            :messages="demoMessages"
            :use-ai-adapter="false"
            :enable-markdown="useEnhancedMarkdown"
            style="height: 400px; border: 1px solid #e0e0e0; border-radius: 8px;"
          />
        </div>
      </div>
    </div>

    <div class="solution-guide">
      <h3>🔧 解决方案指南</h3>
      <div class="solution-steps">
        <div class="solution-step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>引入增强样式</h4>
            <pre><code>// 在您的主CSS文件中引入
@import '@yuandezuohua/liaokit/dist/liaokit.css';
@import './markdown-enhanced.css'; // 新增的Markdown样式文件</code></pre>
          </div>
        </div>

        <div class="solution-step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>确保Markdown解析正确</h4>
            <pre><code>// 在您的LiaoMessageList配置中
&lt;LiaoMessageList
  :messages="messages"
  :use-ai-adapter="true"
  :enable-markdown="true"
  :ai-adapter-options="aiAdapterOptions"
/&gt;</code></pre>
          </div>
        </div>

        <div class="solution-step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>应用CSS类名</h4>
            <pre><code>// 确保AI适配器返回的内容使用正确的类名
&lt;div class="liao-markdown-content"&gt;
  {/* AI回复的Markdown内容 */}
&lt;/div&gt;</code></pre>
          </div>
        </div>
      </div>
    </div>

    <div class="troubleshooting">
      <h3>🔍 常见问题排查</h3>
      <div class="faq-list">
        <div class="faq-item">
          <h4>Q: AI回复还是显示纯文本，没有格式化？</h4>
          <p>A: 请检查：1) enableMarkdown是否为true；2) marked库是否正确安装；3) AI适配器是否正常工作</p>
        </div>
        <div class="faq-item">
          <h4>Q: 样式显示不正确，间距和颜色很难看？</h4>
          <p>A: 请确保引入了markdown.scss样式文件，并且HTML内容包含在.liao-markdown-content类中</p>
        </div>
        <div class="faq-item">
          <h4>Q: 代码块显示效果不佳？</h4>
          <p>A: 检查CSS文件是否完整加载，代码块需要特殊的样式定义才能正确显示</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { marked } from 'marked';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';

// 配置marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
});

// 响应式状态
const useEnhancedMarkdown = ref(true);
const darkTheme = ref(false);
const demoMessages = ref([
  {
    id: 1,
    content: "你好！我来给你演示一下Markdown格式的回复效果。",
    type: 'text',
    isSelf: true,
    time: Date.now() - 10000,
  },
  {
    id: 2,
    content: testMarkdownContent,
    type: 'text',
    isSelf: false,
    time: Date.now() - 5000,
  }
]);

// 测试用的Markdown内容 - 添加更多类型的内容
const testMarkdownContent = `## 🤖 AI助手回复示例

这是一个包含多种格式的AI回复演示：

### 📋 服务内容

**产品购买**：支持在线下单、订单管理、收集收件人信息、地址等 （参考）。

**社区互动**：用户可加入社区小组织、评论，分享动态内容 （参考）。

**活动报名**：支持新约线下活动，需提供姓名、手机号等信息 （参考）。

### 💡 技术特点

1. **智能识别**：自动分析用户需求
2. **快速响应**：毫秒级处理速度  
3. **多format支持**：文本、图片、文件等

这是一个普通段落，展示文本的基础行间距效果。在优化后，行间距应该更加紧凑，符合标准的Markdown渲染规范。

- 这是一个无序列表项
- 第二个列表项
  - 嵌套列表项
  - 另一个嵌套项
- 回到第一级列表

### 📊 数据统计

| 指标 | 数值 | 说明 |
|------|------|------|
| 准确率 | 99.2% | AI识别准确率 |
| 响应时间 | <100ms | 平均响应时间 |
| 用户满意度 | 4.8/5 | 用户评分 |

### 💻 代码示例

\`\`\`javascript
// AI消息适配器配置
const aiConfig = {
  model: 'qwen-turbo',
  temperature: 0.7,
  maxTokens: 1000
};

// 内联代码示例
const result = processMessage(content);
\`\`\`

行内代码示例：\`const variable = "value"\`，这样的代码应该有合适的背景色。

### 📝 重要提示

> 如果您有更具体的问题，比如隐私政策细节或功能使用疑问，可以随时向我询问！💙
> 
> 这是引用块的第二行，应该有合适的缩进和样式。

---

希望这个演示能帮助您了解AI回复的格式化效果！

**粗体文本**和*斜体文本*的组合展示。

~~删除线文本~~也是常用的格式。`;

// 原始HTML（模拟问题状态）
const originalMarkdownHTML = computed(() => {
  return marked(testMarkdownContent);
});

// 增强HTML（修复后状态）
const enhancedMarkdownHTML = computed(() => {
  return marked(testMarkdownContent);
});

// 添加测试消息
const addTestMessage = () => {
  const newMessage = {
    id: Date.now(),
    content: `### 新测试消息 ${new Date().toLocaleTimeString()}

这是一个新添加的测试消息，包含：

- **粗体文本**演示
- *斜体文本*演示  
- \`行内代码\`演示

\`\`\`python
# 代码块演示
def hello_world():
    print("Hello, LiaoKit!")
\`\`\`

> 这是一个引用块示例，用于展示样式效果。`,
    type: 'text',
    isSelf: Math.random() > 0.5,
    time: Date.now(),
  };
  
  demoMessages.value.push(newMessage);
};
</script>

<style lang="scss" scoped>
.markdown-style-fix-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  .example-header {
    text-align: center;
    margin-bottom: 30px;
    
    h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    .example-description {
      color: #7f8c8d;
      font-size: 16px;
    }
  }
  
  .example-controls {
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 30px;
    
    .control-group {
      display: flex;
      align-items: center;
      
      label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        
        input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #667eea;
        }
      }
    }
    
    .add-btn {
      padding: 8px 16px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.2s;
      
      &:hover {
        background: #5a6fd8;
      }
    }
  }
  
  .example-content {
    .message-comparison {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
      
      .comparison-section {
        h3 {
          margin-bottom: 15px;
          padding: 10px 15px;
          border-radius: 6px;
          
          &:has-text("❌") {
            background: rgba(220, 53, 69, 0.1);
            color: #dc3545;
          }
          
          &:has-text("✅") {
            background: rgba(40, 167, 69, 0.1);
            color: #28a745;
          }
        }
        
        .message-bubble {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          padding: 0;
          max-height: 500px;
          overflow-y: auto;
          
          &.dark-theme {
            background: #2a2a2a;
            border-color: #444;
            color: #e0e0e0;
          }
          
          .message-content {
            padding: 16px;
          }
        }
        
        .original-style {
          // 模拟原始的糟糕样式
          .message-content {
            font-family: monospace;
            font-size: 12px;
            line-height: 1.2;
            color: #666;
            
            div {
              white-space: pre-line;
            }
          }
        }
        
        .fixed-style {
          // 应用修复后的美观样式
          .message-content {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        }
      }
    }
    
    .liaokit-demo {
      h3 {
        margin-bottom: 15px;
        color: #2c3e50;
      }
    }
  }
  
  .solution-guide {
    margin: 40px 0;
    padding: 20px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 12px;
    
    h3 {
      color: #2c3e50;
      margin-bottom: 20px;
    }
    
    .solution-steps {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .solution-step {
        display: flex;
        gap: 15px;
        
        .step-number {
          width: 32px;
          height: 32px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }
        
        .step-content {
          flex: 1;
          
          h4 {
            margin-bottom: 8px;
            color: #2c3e50;
          }
          
          pre {
            background: #2d3748;
            color: #e2e8f0;
            padding: 12px 16px;
            border-radius: 6px;
            overflow-x: auto;
            font-size: 13px;
            line-height: 1.4;
          }
        }
      }
    }
  }
  
  .troubleshooting {
    padding: 20px;
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: 8px;
    
    h3 {
      color: #856404;
      margin-bottom: 15px;
    }
    
    .faq-list {
      .faq-item {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px solid #ffeaa7;
        
        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }
        
        h4 {
          color: #856404;
          margin-bottom: 5px;
          font-size: 14px;
        }
        
        p {
          color: #6c757d;
          font-size: 13px;
          line-height: 1.5;
          margin: 0;
        }
      }
    }
  }
}

// 引入增强的Markdown样式
@import '../styles/markdown.scss';
</style> 