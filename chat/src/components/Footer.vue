<template>
    <footer class="app-footer">
        <!-- 主要内容区域 -->
        <div class="footer-content">
            <!-- 品牌信息 -->
            <div class="footer-section brand-section">
                <div class="brand-info">
                    <h3 class="brand-title">
                        <el-icon class="brand-icon"><ChatDotRound /></el-icon>
                        Kayron Chat
                    </h3>
                    <p class="brand-description">
                        一个现代化的实时聊天平台，连接你我，分享精彩时刻。
                    </p>
                    <div class="social-links">
                        <a href="#" class="social-link" title="GitHub">
                            <el-icon><Platform /></el-icon>
                        </a>
                    </div>
                </div>
            </div>

            <!-- 快速链接 -->
            <div class="footer-section links-section">
                <h4 class="section-title">快速导航</h4>
                <ul class="footer-links">
                    <li><router-link to="/" class="footer-link">首页</router-link></li>
                </ul>
            </div>

            <!-- 帮助支持 -->
            <div class="footer-section support-section">
                <h4 class="section-title">帮助支持</h4>
                <ul class="footer-links">
                    <li><a href="#" class="footer-link">暂无支持</a></li>
                </ul>
            </div>

            <!-- 联系信息 -->
            <div class="footer-section contact-section">
                <h4 class="section-title">联系方式</h4>
                <div class="contact-info">
                    <div class="contact-item">
                        <el-icon><Location /></el-icon>
                        <span>中国·广鸡</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部版权信息 -->
        <div class="footer-bottom">
            <div class="copyright-info">
                <p class="copyright-text">
                    © {{ currentYear }} Kayron Chat. All rights reserved.
                </p>
                <div class="footer-meta">
                    <span class="meta-item">隐私政策</span>
                    <span class="meta-divider">|</span>
                    <span class="meta-item">服务条款</span>
                    <span class="meta-divider">|</span>
                    <span class="meta-item">ICP备案号: 京ICP备12345678号</span>
                </div>
            </div>
            
            <!-- 在线状态指示器 -->
            <div class="status-indicator">
                <div class="status-dot" :class="{ 'online': isOnline }"></div>
                <span class="status-text">{{ isOnline ? '服务正常' : '服务异常' }}</span>
            </div>
        </div>

        <!-- 装饰性元素 -->
        <div class="footer-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
        </div>
    </footer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { 
    ChatDotRound, 
    Platform, 
    Share, 
    Message, 
    ChatLineRound,
    Location,
    Phone
} from '@element-plus/icons-vue'

// 当前年份
const currentYear = computed(() => new Date().getFullYear())

// 在线状态
const isOnline = ref(true)

// 模拟服务状态检查
const checkServiceStatus = () => {
    // 这里可以添加实际的服务状态检查逻辑
    setInterval(() => {
        // 模拟偶尔的服务状态变化
        if (Math.random() > 0.95) {
            isOnline.value = !isOnline.value
            setTimeout(() => {
                isOnline.value = true
            }, 3000)
        }
    }, 10000)
}

onMounted(() => {
    checkServiceStatus()
})
</script>

<style scoped>
.app-footer {
    position: relative;
    background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.1) 0%,
        rgba(103, 194, 58, 0.1) 50%,
        rgba(245, 108, 108, 0.1) 100%
    );
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255, 255, 255, 0.2);
    color: #606266;
    overflow: hidden;
    margin-top: auto;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 40px;
    position: relative;
    z-index: 2;
}

/* 品牌区域 */
.brand-section {
    display: flex;
    flex-direction: column;
}

.brand-info {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.brand-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 24px;
    font-weight: 700;
    color: #303133;
    margin: 0;
    background: linear-gradient(135deg, #409EFF, #67C23A);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.brand-icon {
    font-size: 28px;
    color: #409EFF;
    filter: drop-shadow(0 2px 4px rgba(64, 158, 255, 0.3));
}

.brand-description {
    font-size: 14px;
    line-height: 1.6;
    color: #909399;
    margin: 0;
    max-width: 280px;
}

.social-links {
    display: flex;
    gap: 12px;
    margin-top: 5px;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: #909399;
    text-decoration: none;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.social-link:hover {
    background: rgba(64, 158, 255, 0.2);
    color: #409EFF;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 链接区域 */
.footer-section {
    display: flex;
    flex-direction: column;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
    margin: 0 0 20px 0;
    position: relative;
    padding-bottom: 8px;
}

.section-title::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 30px;
    height: 2px;
    background: linear-gradient(90deg, #409EFF, #67C23A);
    border-radius: 1px;
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.footer-link {
    color: #909399;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s ease;
    position: relative;
    padding-left: 0;
}

.footer-link:hover {
    color: #409EFF;
    padding-left: 8px;
}

.footer-link::before {
    content: '';
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 2px;
    background: #409EFF;
    transition: width 0.3s ease;
}

.footer-link:hover::before {
    width: 4px;
}

/* 联系信息 */
.contact-info {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #909399;
}

.contact-item .el-icon {
    color: #409EFF;
    font-size: 16px;
}

/* 底部版权区域 */
.footer-bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.05);
    position: relative;
    z-index: 2;
}

.copyright-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.copyright-text {
    margin: 0;
    font-size: 14px;
    color: #909399;
    font-weight: 500;
}

.footer-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #C0C4CC;
}

.meta-item {
    transition: color 0.3s ease;
    cursor: pointer;
}

.meta-item:hover {
    color: #409EFF;
}

.meta-divider {
    color: #E4E7ED;
}

/* 状态指示器 */
.status-indicator {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #909399;
}

.status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #F56C6C;
    transition: all 0.3s ease;
    box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.3);
    animation: pulse-offline 2s infinite;
}

.status-dot.online {
    background: #67C23A;
    box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.3);
    animation: pulse-online 2s infinite;
}

.status-text {
    font-weight: 500;
}

/* 装饰性元素 */
.footer-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    overflow: hidden;
}

.decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(103, 194, 58, 0.1));
    animation: float 6s ease-in-out infinite;
}

.circle-1 {
    width: 120px;
    height: 120px;
    top: -60px;
    right: 10%;
    animation-delay: 0s;
}

.circle-2 {
    width: 80px;
    height: 80px;
    bottom: -40px;
    left: 15%;
    animation-delay: 2s;
}

.circle-3 {
    width: 60px;
    height: 60px;
    top: 50%;
    right: 5%;
    animation-delay: 4s;
}

/* 动画效果 */
@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
        opacity: 0.3;
    }
    50% {
        transform: translateY(-20px) rotate(180deg);
        opacity: 0.6;
    }
}

@keyframes pulse-online {
    0%, 100% {
        box-shadow: 0 0 0 2px rgba(103, 194, 58, 0.3);
    }
    50% {
        box-shadow: 0 0 0 6px rgba(103, 194, 58, 0.1);
    }
}

@keyframes pulse-offline {
    0%, 100% {
        box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.3);
    }
    50% {
        box-shadow: 0 0 0 6px rgba(245, 108, 108, 0.1);
    }
}

/* 响应式设计 */
@media (max-width: 1024px) {
    .footer-content {
        grid-template-columns: 1fr 1fr;
        gap: 30px;
    }
}

@media (max-width: 768px) {
    .footer-content {
        grid-template-columns: 1fr;
        gap: 25px;
        padding: 30px 15px;
    }
    
    .footer-bottom {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .footer-meta {
        flex-wrap: wrap;
        justify-content: center;
    }
    
    .brand-title {
        font-size: 20px;
    }
    
    .social-links {
        justify-content: center;
    }
}

@media (max-width: 480px) {
    .footer-content {
        padding: 20px 10px;
    }
    
    .brand-description {
        text-align: center;
    }
    
    .footer-meta {
        font-size: 11px;
    }
}

/* 深色模式支持 */
:global(.dark) .app-footer {
    background: linear-gradient(
        135deg,
        rgba(64, 158, 255, 0.05) 0%,
        rgba(103, 194, 58, 0.05) 50%,
        rgba(245, 108, 108, 0.05) 100%
    );
    border-top-color: rgba(255, 255, 255, 0.1);
    color: #E4E7ED;
}

:global(.dark) .brand-title {
    color: #E4E7ED;
}

:global(.dark) .section-title {
    color: #E4E7ED;
}

:global(.dark) .footer-bottom {
    background: rgba(0, 0, 0, 0.1);
    border-top-color: rgba(255, 255, 255, 0.05);
}

:global(.dark) .social-link {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.1);
}

:global(.dark) .social-link:hover {
    background: rgba(64, 158, 255, 0.1);
}
</style>