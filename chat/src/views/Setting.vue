<template>
    <div class="mysetting">
        <div class="setting">
            <div class="setting-title">
                <span>设置</span>
            </div>
        </div>
        <div class="setting-content">
            <div class="setting-item">
                <div class="setting-label">
                    <el-icon><SwitchButton /></el-icon>
                    <span>账户管理</span>
                </div>
                <el-button 
                    type="danger" 
                    @click="handleLogout"
                    :loading="logoutLoading"
                >
                    退出登录
                </el-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Moon, SwitchButton } from '@element-plus/icons-vue'

const router = useRouter()
const userStore = useUserStore()

// 主题模式状态
const isDarkMode = ref(false)
const logoutLoading = ref(false)

// 初始化主题
onMounted(() => {
    // 从localStorage获取主题设置
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
        isDarkMode.value = true
        document.documentElement.classList.add('dark')
    }
})

/**
 * 切换主题模式
 * @param {Boolean} value - 是否为深色模式
 */
const toggleTheme = (value) => {
    if (value) {
        // 切换到深色模式
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
        ElMessage.success('已切换到深色模式')
    } else {
        // 切换到浅色模式
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
        ElMessage.success('已切换到浅色模式')
    }
}

/**
 * 处理用户退出登录
 * 调用user.js store中的logout方法
 */
const handleLogout = async () => {
    try {
        // 确认对话框
        await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        
        logoutLoading.value = true
        
        // 调用store中的logout方法
        await userStore.logout()
        
        ElMessage.success('退出登录成功')
        
        // 跳转到登录页面
        router.push('/login')
        
    } catch (error) {
        if (error !== 'cancel') {
            console.error('退出登录失败:', error)
            ElMessage.error(error.message || '退出登录失败')
        }
    } finally {
        logoutLoading.value = false
    }
}
</script>

<style scoped>
.mysetting {
    padding: 20px;
    max-width: 600px;
    margin: 0 auto;
}

.setting {
    margin-bottom: 30px;
}

.setting-title {
    font-size: 24px;
    font-weight: bold;
    color: #303133;
    text-align: center;
    padding-bottom: 20px;
    border-bottom: 2px solid #E4E7ED;
}

.setting-content {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.setting-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
}

.setting-label {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    color: #606266;
    font-weight: 500;
}

.setting-label .el-icon {
    font-size: 18px;
    color: #409EFF;
}

/* 深色模式样式 */
:global(.dark) .setting-title {
    color: #E4E7ED;
    border-bottom-color: #4C4D4F;
}

:global(.dark) .setting-item {
    background: #2D2D2D;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

:global(.dark) .setting-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

:global(.dark) .setting-label {
    color: #E4E7ED;
}

:global(.dark) .mysetting {
    background: #1A1A1A;
    min-height: 100vh;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .mysetting {
        padding: 15px;
    }
    
    .setting-item {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .setting-label {
        justify-content: center;
    }
}
</style>