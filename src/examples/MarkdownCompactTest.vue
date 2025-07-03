<template>
  <div class="markdown-compact-test">
    <div class="test-header">
      <h2>📝 Markdown样式紧凑性测试</h2>
      <p>对比修复前后的行间距效果</p>
    </div>

    <div class="comparison-container">
      <!-- 修复后的紧凑样式 -->
      <div class="test-section">
        <h3>✅ 修复后：紧凑标准样式</h3>
        <div class="markdown-content liao-markdown-content" v-html="renderedMarkdown"></div>
      </div>

      <!-- 原始问题样式 -->
      <div class="test-section">
        <h3>❌ 修复前：间距过大问题</h3>
        <div class="markdown-content original-spacing" v-html="renderedMarkdown"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

// 配置marked
marked.setOptions({
  breaks: true,
  gfm: true
})

// 测试用的Markdown内容
const markdownContent = `## AI助手回复

这是一个普通段落，测试基础行间距效果。

### 功能列表

1. **智能识别**：自动分析需求
2. **快速响应**：毫秒级处理
3. **多格式支持**：文本、图片等

普通段落文本，展示段落间的间距。

- 无序列表项一
- 无序列表项二
  - 嵌套项目
  - 另一个嵌套项

\`\`\`javascript
// 代码块示例
const config = {
  model: 'qwen-turbo',
  temperature: 0.7
};
\`\`\`

行内代码：\`const result = process()\`

> 这是一个引用块
> 展示引用的样式效果

**粗体**和*斜体*文本。`

// 渲染Markdown
const renderedMarkdown = computed(() => {
  try {
    return marked(markdownContent)
  } catch (e) {
    console.error('Markdown渲染错误:', e)
    return markdownContent
  }
})
</script>

<style lang="scss" scoped>
// 导入修复后的样式
@import '../styles/markdown.scss';

.markdown-compact-test {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  
  .test-header {
    text-align: center;
    margin-bottom: 30px;
    
    h2 {
      color: #2c3e50;
      margin-bottom: 10px;
    }
    
    p {
      color: #7f8c8d;
      font-size: 16px;
    }
  }
  
  .comparison-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .test-section {
    h3 {
      margin-bottom: 15px;
      padding: 10px 15px;
      border-radius: 6px;
      
      &:has-text("✅") {
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
      }
      
      &:has-text("❌") {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
      }
    }
    
    .markdown-content {
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 20px;
      min-height: 400px;
      overflow-y: auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
  }
}

// 模拟原始问题样式：间距过大
.original-spacing {
  h1, h2, h3, h4, h5, h6 {
    margin: 24px 0 16px 0 !important;
    line-height: 1.7 !important;
  }
  
  p {
    margin: 16px 0 !important;
    line-height: 1.7 !important;
  }
  
  ul, ol {
    margin: 16px 0 !important;
    
    li {
      margin: 8px 0 !important;
      line-height: 1.6 !important;
    }
  }
  
  pre {
    margin: 20px 0 !important;
    padding: 16px 20px !important;
    line-height: 1.5 !important;
  }
  
  blockquote {
    margin: 20px 0 !important;
    padding: 16px 20px !important;
    
    p {
      margin: 8px 0 !important;
    }
  }
  
  code {
    padding: 2px 6px !important;
    font-size: 13px !important;
  }
}
</style> 