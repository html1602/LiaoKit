<template>
  <div class="app">
    <header class="app-header">
      <h1 class="app-logo">LiaoKit</h1>
      <nav class="app-nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/showcase" class="nav-link">组件展示</router-link>
        <router-link to="/streaming" class="nav-link">流式输出</router-link>
        <router-link to="/global-state" class="nav-link">全局状态演示</router-link>
      </nav>
    </header>
    
    <main class="app-content">
      <router-view></router-view>
    </main>
    
    <footer class="app-footer">
      <p>LiaoKit - 基于Vue 3的聊天界面组件库</p>
    </footer>
  </div>
</template>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background-color: #4080ff;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.app-logo {
  margin: 0;
  font-size: 1.8rem;
}

.app-nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: border-color 0.3s;
}

.nav-link:hover,
.nav-link.router-link-active {
  border-color: white;
}

.app-content {
  flex: 1;
}

.app-footer {
  background-color: #f5f5f5;
  padding: 1rem;
  text-align: center;
  color: #666;
}
</style> 