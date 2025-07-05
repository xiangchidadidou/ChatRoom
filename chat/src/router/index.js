/**
 * Vue Router 路由配置文件
 * 定义应用程序的所有路由规则、路由守卫和导航逻辑
 * 包含页面路由、权限控制、登录状态检查等功能
 */

import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 创建路由实例
const router = createRouter({
  // 使用 HTML5 History 模式，URL 不会包含 # 号
  history: createWebHistory(import.meta.env.BASE_URL),
  
  // 路由配置数组
  routes: [
    // ===== 公开页面路由（无需登录） =====
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: {
        requiresAuth: false,  // 不需要登录权限
        title: '首页'         // 页面标题
      }
    },
    {
      path: '/login',
      name: 'login', 
      component: () => import('@/views/Login.vue'),
      meta: {
        requiresAuth: false,  // 不需要登录权限
        title: '登录'         // 页面标题
      }
    },
    
    // ===== 需要登录权限的页面路由 =====
    {
      path: '/room',
      name: 'room',
      component: () => import('@/views/Room.vue'),
      meta: {
        requiresAuth: true,   // 需要登录权限
        title: '聊天室'       // 页面标题
      }
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/Setting.vue'),
      meta: {
        requiresAuth: true,   // 需要登录权限
        title: '设置'         // 页面标题
      }
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('@/views/User.vue'),
      meta: {
        requiresAuth: true,   // 需要登录权限
        title: '用户中心'     // 页面标题
      }
    }
  ],
})

/**
 * 获取用户登录状态的辅助函数
 * 从 localStorage 中读取用户登录信息，支持多种存储格式
 * @returns {Object} 包含 isLogin 和 token 的对象
 */
function getUserLoginStatus() {
  // 调试：打印所有localStorage keys（开发环境调试用）
  console.log('所有localStorage keys:', Object.keys(localStorage))
  
  // 尝试多种可能的存储key，兼容不同的持久化方案
  const possibleKeys = ['user-info', 'user', 'userInfo', 'pinia_user']
  let userInfoStr = null
  let foundKey = null
  
  // 遍历可能的key，找到第一个有效的用户数据
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key)
    if (value) {
      userInfoStr = value
      foundKey = key
      console.log(`找到用户数据，key: ${key}, value:`, value)
      break
    }
  }
  
  // 如果没有找到任何用户数据，返回未登录状态
  if (!userInfoStr) {
    console.log('未找到任何用户数据')
    return { isLogin: false, token: null }
  }
  
  let isLogin = false
  let token = null
  
  // 尝试解析JSON格式的用户信息
  try {
    const userInfo = JSON.parse(userInfoStr)
    console.log('解析后的用户信息:', userInfo)
    isLogin = userInfo.isLogin || false  // 获取登录状态
    token = userInfo.token || null       // 获取认证令牌
  } catch (e) {
    console.error('解析用户信息失败:', e)
  }
  
  return { isLogin, token }
}

/**
 * 全局前置路由守卫
 * 在每次路由跳转前执行，负责权限检查、登录状态验证和页面标题设置
 * @param {Object} to - 即将进入的目标路由对象
 * @param {Object} from - 当前导航正要离开的路由对象
 * @param {Function} next - 调用该方法来 resolve 这个钩子
 */
router.beforeEach((to, from, next) => {
  // ===== 设置页面标题 =====
  if (to.meta.title) {
    document.title = `${to.meta.title} - Kayron 聊天室`
  }

  // ===== 获取用户登录状态 =====
  const { isLogin, token } = getUserLoginStatus()
  
  // ===== 已登录用户访问登录页的处理 =====
  // 如果用户已经登录且试图访问登录页，重定向到首页
  if (to.path === '/login' && token && isLogin) {
    ElMessage.info('您已经登录，自动跳转到首页')
    next('/')  // 重定向到首页
    return
  }
  
  // ===== 需要登录权限的页面访问控制 =====
  if (to.meta.requiresAuth) {
    // 检查用户是否已登录（同时检查token和登录状态）
    if (!token || !isLogin) {
      // 未登录用户访问需要权限的页面
      ElMessage.warning('请先登录后再访问该页面')
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原始路径，登录成功后可以重定向回来
      })
      return
    }
  }
  
  // ===== 允许路由导航继续 =====
  next()
})

/**
 * 全局后置路由守卫
 * 在路由跳转完成后执行，可用于页面切换后的处理逻辑
 * @param {Object} to - 已经进入的目标路由对象
 * @param {Object} from - 离开的路由对象
 */
router.afterEach((to, from) => {
  // 路由切换完成后的处理（开发环境调试用）
  console.log(`路由从 ${from.path} 切换到 ${to.path}`)
})

export default router
