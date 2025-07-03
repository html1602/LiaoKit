<template>
  <div class="file-preview-debugger">
    <h2>文件预览调试器</h2>
    
    <!-- 文件信息输入 -->
    <div class="debug-section">
      <h3>文件信息配置</h3>
      <div class="input-group">
        <label>文件名：</label>
        <input v-model="debugFile.name" placeholder="例如: test.txt" />
      </div>
      <div class="input-group">
        <label>文件类型：</label>
        <select v-model="debugFile.type">
          <option value="text/plain">text/plain</option>
          <option value="application/json">application/json</option>
          <option value="text/markdown">text/markdown</option>
          <option value="text/javascript">text/javascript</option>
          <option value="text/html">text/html</option>
        </select>
      </div>
      <div class="input-group">
        <label>文件内容：</label>
        <textarea v-model="debugFile.content" rows="6" placeholder="输入文件内容..."></textarea>
      </div>
      <div class="input-group">
        <label>URL类型：</label>
        <select v-model="urlType" @change="generateUrl">
          <option value="base64">Base64 Data URL</option>
          <option value="plain">普通 Data URL</option>
          <option value="file">File 对象</option>
        </select>
      </div>
    </div>
    
    <!-- 生成的文件信息 -->
    <div class="debug-section">
      <h3>生成的文件数据</h3>
      <div class="debug-info">
        <p><strong>文件名：</strong>{{ debugFile.name }}</p>
        <p><strong>文件类型：</strong>{{ debugFile.type }}</p>
        <p><strong>文件大小：</strong>{{ debugFile.size }} bytes</p>
        <p><strong>URL类型：</strong>{{ urlType }}</p>
        <p><strong>生成的URL：</strong></p>
        <textarea readonly :value="debugFile.url" rows="3"></textarea>
      </div>
      
      <button @click="testPreview" class="test-btn">测试预览</button>
      <button @click="analyzeUrl" class="test-btn">分析URL</button>
    </div>
    
    <!-- 文件气泡预览 -->
    <div class="debug-section">
      <h3>文件气泡测试</h3>
      <LiaoFileBubble
        ref="fileBubbleRef"
        :fileName="debugFile.name"
        :fileType="debugFile.type"
        :fileSize="debugFile.size"
        :fileUrl="debugFile.url"
        :fileStatus="'success'"
        :layout="'list'"
        @preview="onPreview"
        @click="onClick"
      />
    </div>
    
    <!-- 调试输出 -->
    <div class="debug-section">
      <h3>调试输出</h3>
      <div class="debug-output">
        <pre>{{ debugOutput }}</pre>
      </div>
      <button @click="clearOutput" class="test-btn">清空输出</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import LiaoFileBubble from '../components/LiaoMessageBubble/LiaoFileBubble.vue'

const debugFile = reactive({
  name: 'test.txt',
  type: 'text/plain',
  content: 'Hello World!\n你好世界！\nThis is a test file content.',
  url: '',
  size: 0,
  file: null as File | null
})

const urlType = ref('base64')
const debugOutput = ref('')
const fileBubbleRef = ref()

// 生成URL
const generateUrl = () => {
  debugFile.size = new Blob([debugFile.content]).size
  
  switch (urlType.value) {
    case 'base64':
      // 生成Base64 Data URL
      const base64Content = btoa(unescape(encodeURIComponent(debugFile.content)))
      debugFile.url = `data:${debugFile.type};base64,${base64Content}`
      debugFile.file = null
      break
      
    case 'plain':
      // 生成普通Data URL
      const encodedContent = encodeURIComponent(debugFile.content)
      debugFile.url = `data:${debugFile.type};charset=utf-8,${encodedContent}`
      debugFile.file = null
      break
      
    case 'file':
      // 创建File对象
      debugFile.file = new File([debugFile.content], debugFile.name, {
        type: debugFile.type
      })
      debugFile.url = URL.createObjectURL(debugFile.file)
      break
  }
  
  addDebugOutput(`🔧 生成了${urlType.value}类型的URL: ${debugFile.url.substring(0, 100)}...`)
}

// 测试预览
const testPreview = async () => {
  addDebugOutput('🧪 开始测试预览功能...')
  
  if (debugFile.file && fileBubbleRef.value) {
    // 设置File对象
    fileBubbleRef.value.setFileObject(debugFile.file)
    addDebugOutput('📁 已设置File对象')
  }
  
  // 模拟点击预览
  await nextTick()
  addDebugOutput('🎯 触发预览点击事件')
}

// 分析URL
const analyzeUrl = () => {
  addDebugOutput('🔍 开始分析URL...')
  addDebugOutput(`URL类型: ${urlType.value}`)
  addDebugOutput(`URL长度: ${debugFile.url.length}`)
  
  if (debugFile.url.startsWith('data:')) {
    const parts = debugFile.url.split(',')
    const header = parts[0]
    const data = parts[1] || ''
    
    addDebugOutput(`Data URL Header: ${header}`)
    addDebugOutput(`Data部分长度: ${data.length}`)
    
    if (header.includes('base64')) {
      try {
        const decoded = atob(data)
        addDebugOutput(`Base64解码成功，内容长度: ${decoded.length}`)
        addDebugOutput(`解码前缀: ${decoded.substring(0, 50)}...`)
      } catch (error) {
        addDebugOutput(`❌ Base64解码失败: ${error}`)
      }
    } else {
      try {
        const decoded = decodeURIComponent(data)
        addDebugOutput(`URL解码成功，内容长度: ${decoded.length}`)
        addDebugOutput(`解码前缀: ${decoded.substring(0, 50)}...`)
      } catch (error) {
        addDebugOutput(`❌ URL解码失败: ${error}`)
      }
    }
  }
}

// 事件处理
const onPreview = (file: any) => {
  addDebugOutput(`📁 预览事件触发: ${JSON.stringify(file, null, 2)}`)
}

const onClick = (file: any) => {
  addDebugOutput(`🖱️ 点击事件触发: ${JSON.stringify(file, null, 2)}`)
}

// 调试输出
const addDebugOutput = (message: string) => {
  const timestamp = new Date().toLocaleTimeString()
  debugOutput.value += `[${timestamp}] ${message}\n`
}

const clearOutput = () => {
  debugOutput.value = ''
}

// 初始化
onMounted(() => {
  generateUrl()
  addDebugOutput('🚀 文件预览调试器已初始化')
})
</script>

<style scoped>
.file-preview-debugger {
  max-width: 1000px;
  margin: 20px auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  background: #f8f9fa;
}

.debug-section h3 {
  margin-top: 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 8px;
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.input-group label {
  min-width: 100px;
  font-weight: 500;
  color: #555;
}

.input-group input,
.input-group select,
.input-group textarea {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.debug-info {
  background: white;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 15px;
}

.debug-info p {
  margin: 8px 0;
}

.debug-output {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 15px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
  line-height: 1.4;
  max-height: 400px;
  overflow-y: auto;
}

.debug-output pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.test-btn {
  background: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  transition: background 0.2s;
}

.test-btn:hover {
  background: #2980b9;
}

textarea[readonly] {
  background: #f5f5f5;
  color: #666;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 12px;
}
</style> 