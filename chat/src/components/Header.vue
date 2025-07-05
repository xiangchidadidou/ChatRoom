<!-- 
    Header 导航组件
    功能：
    1. 显示应用Logo和标题
    2. 提供主要页面导航（首页、登录）
    3. 显示用户登录状态和用户菜单
    4. 处理用户登出操作
-->
<template>
    <div class="myheader">
        <!-- 水平导航菜单容器 -->
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
            @select="handleSelect">
            <!-- Logo区域：显示应用图标和名称 -->
            <el-menu-item index="0" class="logo-item">
                <el-icon><ChatDotRound /></el-icon>
                <span class="logo-text">聊天室</span>
            </el-menu-item>
            
            <!-- 主导航菜单：首页链接 -->
            <el-menu-item index="home" @click="navigateTo('/')">
                <el-icon><House /></el-icon>
                <span>首页</span>
            </el-menu-item>
            
            <!-- 右侧操作区域：包含导航按钮和用户菜单 -->
            <div class="header-right">
                <!-- 页面切换按钮组：快速导航到主要页面 -->
                <el-button-group class="nav-buttons">
                    <!-- 首页按钮：根据当前路由高亮显示 -->
                    <el-button 
                        :type="currentRoute === '/' ? 'primary' : 'default'"
                        size="small"
                        @click="navigateTo('/')"
                    >
                        <el-icon><House /></el-icon>
                        首页
                    </el-button>
                    <!-- 登录按钮：根据当前路由高亮显示 -->
                    <el-button 
                        :type="currentRoute === '/login' ? 'primary' : 'default'"
                        size="small"
                        @click="navigateTo('/login')"
                    >
                        <el-icon><User /></el-icon>
                        登录
                    </el-button>
                </el-button-group>
                
                <!-- 已登录用户的下拉菜单 -->
                <el-dropdown class="user-dropdown" v-if="userStore.isLogin">
                    <!-- 用户信息显示区域：头像和用户名 -->
                    <div class="user-info">
                        <el-avatar :size="32" :src="userStore.userInfo.userImg" :icon="Avatar" />
                        <span class="username">{{ userStore.getUsername }}</span>
                    </div>
                    <!-- 下拉菜单内容 -->
                    <template #dropdown>
                        <el-dropdown-menu>
                            <!-- 首页导航 -->
                            <el-dropdown-item @click="navigateTo('/')">
                                <el-icon><House /></el-icon>
                                首页
                            </el-dropdown-item>
                            <!-- 设置选项（暂未实现功能） -->
                            <el-dropdown-item divided>
                                <el-icon><Setting /></el-icon>
                                设置
                            </el-dropdown-item>
                            <!-- 退出登录选项 -->
                            <el-dropdown-item @click="handleLogout">
                                <el-icon><SwitchButton /></el-icon>
                                退出登录
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
                
                <!-- 未登录时显示的登录按钮 -->
                <el-button v-else type="primary" @click="navigateTo('/login')">
                    <el-icon><User /></el-icon>
                    登录
                </el-button>
            </div>
        </el-menu>
    </div>
</template>

<script setup>
/**
 * Header 组件的逻辑部分
 * 处理导航、用户状态管理和登出操作
 */

// Vue 3 Composition API
import { ref, computed } from 'vue'
// Vue Router 路由管理
import { useRouter, useRoute } from 'vue-router'
// Element Plus 图标组件
import { 
    ChatDotRound,   // 聊天图标
    House,          // 首页图标
    User,           // 用户图标
    Avatar,         // 头像图标
    Setting,        // 设置图标
    SwitchButton    // 切换按钮图标
} from '@element-plus/icons-vue'
// 用户状态管理
import { useUserStore } from '@/stores/user'
// Element Plus 消息组件
import { ElMessage, ElMessageBox } from 'element-plus'

// 路由实例
const router = useRouter()
// 当前路由信息
const route = useRoute()
// 用户状态管理实例
const userStore = useUserStore()

// 当前激活的菜单项
const activeIndex = ref('home')

/**
 * 计算属性：获取当前路由路径
 * 用于判断当前页面，实现按钮高亮效果
 */
const currentRoute = computed(() => route.path)

/**
 * 页面导航函数
 * @param {String} path 目标路由路径
 */
const navigateTo = (path) => {
    router.push(path)
}

/**
 * 菜单选择事件处理器
 * @param {String} key 选中的菜单项key
 * @param {Array} keyPath 菜单路径
 */
const handleSelect = (key, keyPath) => {
    console.log('选中菜单:', key, keyPath)
}

/**
 * 处理用户登出操作
 * 包含确认对话框、调用登出API、清除状态、页面跳转等步骤
 */
const handleLogout = async () => {
    try {
        // 显示确认对话框，防止误操作
        await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        
        // 调用用户状态管理器的登出方法
        await userStore.logout()
        // 显示成功消息
        ElMessage.success('已退出登录')
        
        // 跳转到登录页面
        router.push('/login')
    } catch (error) {
        // 如果不是用户取消操作，则显示错误信息
        if (error !== 'cancel') {
            console.error('登出失败:', error)
            ElMessage.error('登出失败')
        }
    }
}
</script>

<style scoped>
/**
 * Header 组件样式
 * 定义导航栏的布局、外观和交互效果
 */

/* 头部容器样式 */
.myheader {
    padding: 0;           /* 移除内边距 */
    height: 60px;         /* 固定高度 */
    width: 100%;          /* 全宽度 */
}

/* 水平菜单布局 */
.el-menu--horizontal {
    display: flex;                    /* 弹性布局 */
    align-items: center;              /* 垂直居中 */
    justify-content: space-between;   /* 两端对齐 */
}

/* Logo 区域样式 */
.logo-item {
    margin-right: auto !important;    /* 推到最左侧 */
    font-weight: bold;                /* 粗体字 */
    font-size: 16px;                  /* 字体大小 */
}

/* Logo 文字样式 */
.logo-text {
    margin-left: 8px;     /* 与图标的间距 */
    color: #409eff;       /* 主题蓝色 */
}

/* 右侧操作区域布局 */
.header-right {
    display: flex;        /* 弹性布局 */
    align-items: center;  /* 垂直居中 */
    gap: 12px;           /* 子元素间距 */
    margin-left: auto;    /* 推到右侧 */
    padding-right: 16px;  /* 右侧内边距 */
}

/* 导航按钮组样式 */
.nav-buttons {
    display: flex;        /* 弹性布局 */
    gap: 4px;            /* 按钮间距 */
}

/* 导航按钮内部布局 */
.nav-buttons .el-button {
    display: flex;        /* 弹性布局 */
    align-items: center;  /* 垂直居中 */
    gap: 4px;            /* 图标与文字间距 */
}

/* 用户下拉菜单样式 */
.user-dropdown {
    margin-left: 8px;     /* 左侧间距 */
    cursor: pointer;      /* 鼠标指针 */
}

/* 用户信息显示区域 */
.user-info {
    display: flex;                           /* 弹性布局 */
    align-items: center;                     /* 垂直居中 */
    gap: 8px;                               /* 头像与用户名间距 */
    padding: 4px 8px;                       /* 内边距 */
    border-radius: 20px;                    /* 圆角边框 */
    transition: background-color 0.3s ease; /* 背景色过渡动画 */
}

/* 用户信息悬停效果 */
.user-info:hover {
    background-color: #f0f9ff;  /* 浅蓝色背景 */
}

/* 用户名显示样式 */
.username {
    font-size: 14px;          /* 字体大小 */
    color: #333;              /* 文字颜色 */
    font-weight: 500;         /* 字体粗细 */
    max-width: 80px;          /* 最大宽度 */
    overflow: hidden;         /* 隐藏溢出 */
    text-overflow: ellipsis;  /* 省略号显示 */
    white-space: nowrap;      /* 不换行 */
}

/* 确保右侧内容不被菜单样式影响 */
.el-menu--horizontal .header-right {
    height: 60px;         /* 固定高度 */
    display: flex;        /* 弹性布局 */
    align-items: center;  /* 垂直居中 */
}
</style>