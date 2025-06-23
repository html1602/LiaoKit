import { createApp } from 'vue'
import './style.css'
import './styles/main.scss'
import App from './App.vue'
import router from './router'
// 导入Vue应用程序创建函数和相关依赖
// 导入全局样式文件
// 导入根组件
// 导入路由配置

import { registerPlugin, installPluginRegistry } from './utils/pluginRegistry'
// 导入自定义指令
import directives from './utils/directives'

// 导入图标注册函数
import { registerIconComponents } from './components/LiaoIcon'
import { registerSvgIconComponents } from './utils/importIcons'

// 导入内置插件
import LiaoProgressPlugin from './components/LiaoPlugins/LiaoProgressPlugin.vue'
import LiaoMediaCarouselPlugin from './components/LiaoPlugins/LiaoMediaCarouselPlugin.vue'
import LiaoInfoPlugin from './components/LiaoPlugins/LiaoInfoPlugin.vue'
import LiaoTimelinePlugin from './components/LiaoPlugins/LiaoTimelinePlugin.vue'
import LiaoFaqCardPlugin from './components/LiaoPlugins/LiaoFaqCardPlugin.vue'
import LiaoActionsPlugin from './components/LiaoPlugins/LiaoActionsPlugin.vue'
import LiaoStatsPlugin from './components/LiaoPlugins/LiaoStatsPlugin.vue'
import LiaoVotePlugin from './components/LiaoPlugins/LiaoVotePlugin.vue'
import LiaoListPlugin from './components/LiaoPlugins/LiaoListPlugin.vue'
import LiaoImageCardPlugin from './components/LiaoPlugins/LiaoImageCardPlugin.vue'

const app = createApp(App)

// 注册图标组件
registerIconComponents(app)
// 注册SVG图标组件
registerSvgIconComponents(app)

// 注册内置插件
registerPlugin('progress', LiaoProgressPlugin)
registerPlugin('media-carousel', LiaoMediaCarouselPlugin)
registerPlugin('info', LiaoInfoPlugin)
registerPlugin('timeline', LiaoTimelinePlugin)
registerPlugin('faq', LiaoFaqCardPlugin)
registerPlugin('actions', LiaoActionsPlugin)
registerPlugin('stats', LiaoStatsPlugin)
registerPlugin('vote', LiaoVotePlugin)
registerPlugin('list', LiaoListPlugin)
registerPlugin('image-card', LiaoImageCardPlugin)

// 注册全局指令
app.directive('ripple', directives.ripple)

// 安装插件注册表
installPluginRegistry(app)

app.use(router)
  .mount('#app')
