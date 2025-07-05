// Vue 3 应用程序主入口文件
// 负责初始化 Vue 应用、配置插件和挂载应用

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import p from 'pinia-plugin-persistedstate' // Pinia 状态持久化插件

// 导入根组件和路由配置
import App from './App.vue'
import router from './router'

// 导入 Element Plus UI 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入 Mock 数据配置（用于开发环境模拟 API）
import './mock'

// 创建 Vue 应用实例
const app = createApp(App)

// 创建 Pinia 状态管理实例
const pinia = createPinia()

// 为 Pinia 添加持久化插件，支持状态数据持久化到 localStorage
pinia.use(p)

// 注册插件和中间件
app.use(ElementPlus)  // 注册 Element Plus UI 组件库
app.use(pinia)        // 注册 Pinia 状态管理
app.use(router)       // 注册 Vue Router 路由管理

// 将应用挂载到 DOM 元素 #app 上
app.mount('#app')
