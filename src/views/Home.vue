<template>
  <div class="home">
    <div class="home-container">
      <h1>LiaoKit 聊天界面组件库</h1>
      <p class="home-description">LiaoKit是一个基于Vue 3的聊天界面组件库，旨在提供灵活、美观且易于集成的聊天相关组件。</p>
      
      <div class="home-links">
        <router-link to="/showcase" class="home-link">
          <div class="home-link-icon">🎮</div>
          <div class="home-link-text">
            <h3>组件展示</h3>
            <p>查看和体验所有组件</p>
          </div>
        </router-link>
        
        <router-link to="/streaming" class="home-link">
          <div class="home-link-icon">⚡</div>
          <div class="home-link-text">
            <h3>流式输出</h3>
            <p>体验实时流式消息功能</p>
          </div>
        </router-link>
      </div>
      
      <div class="home-features">
        <h2>主要功能</h2>
        <ul>
          <li>✅ 聊天窗口 - 可自定义的完整聊天界面</li>
          <li>✅ 消息气泡 - 支持文本、图片和插件等多种类型</li>
          <li>✅ 输入区域 - 带有表情选择器、语音输入和文件上传</li>
          <li>✅ 消息列表 - 支持加载更多、日期分割线和未读消息计数</li>
          <li>✅ 快捷操作栏 - 可配置的常用操作按钮</li>
          <li>✅ 丰富的插件类型 - 表单、列表、投票、FAQ等</li>
          <li>🚀 流式输出 - 支持打字机效果、SSE流式传输</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: 32px 16px;
  max-width: 1200px;
  margin: 0 auto;
}

.home-container {
  max-width: 800px;
  margin: 0 auto;
}

.home h1 {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: #333;
}

.home-description {
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.6;
}

.home-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 48px;
}

.home-link {
  display: flex;
  align-items: center;
  padding: 24px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #eaeaea;
}

.home-link:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
}

.home-link-icon {
  font-size: 2.5rem;
  margin-right: 16px;
}

.home-link-text h3 {
  margin: 0 0 8px 0;
  color: #333;
}

.home-link-text p {
  margin: 0;
  color: #666;
}

.home-features {
  margin-top: 48px;
}

.home-features h2 {
  margin-bottom: 24px;
  color: #333;
}

.home-features ul {
  padding-left: 24px;
  list-style-type: none;
}

.home-features li {
  margin-bottom: 16px;
  font-size: 1.1rem;
  color: #444;
}
</style> 