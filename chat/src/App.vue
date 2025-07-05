<!-- 
  应用程序根组件 App.vue
  定义整个应用的基础布局结构：头部导航 + 主内容区 + 底部信息
  使用 Element Plus 的 Container 布局组件实现响应式布局
-->
<template>
  <!-- 应用程序最外层容器 -->
  <div class="myApp">
    <!-- 通用布局容器 -->
    <div class="common-layout">
      <!-- Element Plus 容器组件，提供标准的页面布局结构 -->
      <el-container>
        <!-- 头部区域：包含导航菜单、用户信息等 -->
        <el-header class="myheader">
          <Header />
        </el-header>
        
        <!-- 主内容区域：显示路由对应的页面组件 -->
        <el-main>
          <!-- Vue Router 视图容器，根据当前路由渲染对应组件 -->
          <RouterView />
        </el-main>
        
        <!-- 底部区域：显示版权信息、链接等 -->
        <el-footer class="myfooter">
          <Footer />
        </el-footer>
        
        <!-- 辅助元素（可能用于特殊样式或布局调整） -->
        <div class="aaa"></div>
      </el-container>
    </div>
  </div>
</template>

<script setup>
// 导入布局组件
import Footer from './components/Footer.vue';  // 底部组件
import Header from './components/Header.vue';  // 头部导航组件
</script>

<style>
/* ===== 全局样式重置 ===== */
/* 重置所有元素的默认边距和内边距，使用 border-box 盒模型 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* ===== 页面基础样式 ===== */
/* 设置 html 和 body 的高度和背景色，确保页面完整覆盖 */
html, body {
  height: 100%;                /* 设置高度为 100% */
  min-height: 100vh;           /* 最小高度为视口高度 */
  background-color: #475975;   /* 深蓝灰色背景 */
}

/* Vue 应用根元素样式 */
#app {
  height: 100%;                /* 继承父元素高度 */
  min-height: 100vh;           /* 最小高度为视口高度 */
  background-color: #475975;   /* 保持背景色一致 */
}

/* ===== 应用容器样式 ===== */
/* 应用主容器，确保背景完全覆盖 */
.myApp {
  min-height: 100vh;           /* 最小高度为视口高度 */
  height: 100%;                /* 高度 100% */
  background-color: #475975;   /* 主题背景色 */
}

/* 通用布局容器 */
.myApp .common-layout {
  height: 100%;                /* 继承父容器高度 */
}

/* ===== 头部导航样式 ===== */
/* 固定定位的头部导航栏 */
.myheader {
  position: fixed;             /* 固定定位，始终显示在顶部 */
  top: 0;                      /* 距离顶部 0px */
  left: 0;                     /* 距离左侧 0px */
  z-index: 1000;               /* 高层级，确保在其他元素之上 */
  width: 100%;                 /* 宽度占满整个视口 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
}

/* ===== 底部信息样式 ===== */
/* 固定定位的底部信息栏 */
.myfooter {
  position: fixed;             /* 固定定位 */
  bottom: 100px;               /* 距离底部 100px */
  left: 0;                     /* 距离左侧 0px */
  z-index: 1000;
  width: 100%;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.aaa{
  height: 100px;
}

/* 为主内容区域添加上下内边距，避免被固定的Header和Footer遮挡 */
.el-main {
  padding-top: 80px !important;
  padding-bottom: 80px !important;
  min-height: calc(100vh - 160px);
}
</style>
