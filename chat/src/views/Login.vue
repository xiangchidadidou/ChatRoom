<template>
    <div class="mylogin">
        <div class="login-container">
            <el-card class="login-card">
                <template #header>
                    <div class="card-header">
                        <span>用户登录</span>
                    </div>
                </template>
                <el-form :model="loginForm" label-width="80px" :rules="rules" ref="loginFormRef">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="loginForm.username" placeholder="请输入用户名" clearable>
                            <template #prefix>
                                <el-icon><User /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" show-password clearable>
                            <template #prefix>
                                <el-icon><Lock /></el-icon>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="选择头像" prop="userImg">
                        <div class="avatar-selection">
                            <!-- 当前选中的头像预览 -->
                            <div class="selected-avatar">
                                <el-avatar 
                                    :size="60" 
                                    :src="loginForm.userImg" 
                                    :icon="Avatar"
                                    class="avatar-preview"
                                />
                                <span class="avatar-label">当前头像</span>
                            </div>
                            
                            <!-- 头像选择网格 -->
                            <div class="avatar-grid">
                                <div 
                                    v-for="avatar in avatarList" 
                                    :key="avatar.name"
                                    class="avatar-item"
                                    :class="{ 'selected': loginForm.userImg === avatar.url }"
                                    @click="selectAvatar(avatar.url)"
                                >
                                    <el-avatar :size="40" :src="avatar.url" />
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button 
                            type="primary" 
                            @click="handleLogin" 
                            :loading="loginLoading"
                            style="width: 100%; margin-bottom: 10px;"
                        >
                            {{ loginLoading ? '登录中...' : '登录' }}
                        </el-button>
                        <el-button @click="resetForm" style="width: 100%;">重置</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { User, Lock, Avatar } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const loginFormRef = ref()
const loginLoading = ref(false)

// 表单数据
const loginForm = ref({
    username: '',
    password: '',
    userImg: ''
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    userImg: [
        { required: true, message: '请选择头像', trigger: 'change' }
    ]
}

// 头像列表
const avatarList = ref([])

// 初始化头像列表
const initAvatarList = () => {
    const avatars = []
    for (let i = 1; i <= 10; i++) {
        avatars.push({
            name: `avatar${i}`,
            url: new URL(`../assets/imgs/avatar${i}.jpeg`, import.meta.url).href
        })
    }
    avatarList.value = avatars
    // 默认选择第一个头像
    if (!loginForm.value.userImg && avatars.length > 0) {
        loginForm.value.userImg = avatars[0].url
    }
}

// 选择头像
const selectAvatar = (avatarUrl) => {
    loginForm.value.userImg = avatarUrl
}

// 处理登录
const handleLogin = async () => {
    if (!loginFormRef.value) return
    
    try {
        // 表单验证
        await loginFormRef.value.validate()
        
        loginLoading.value = true
        
        // 调用store的登录方法
        await userStore.login(
            loginForm.value.username, 
            loginForm.value.password, 
            loginForm.value.userImg
        )
        
        ElMessage.success('登录成功！')
        
        // 获取重定向路径，如果没有则跳转到首页
        const redirect = route.query.redirect || '/'
        
        // 登录成功后跳转
        router.push(redirect)
        
    } catch (error) {
        console.error('登录失败:', error)
        ElMessage.error(error.message || '登录失败，请检查用户名和密码')
    } finally {
        loginLoading.value = false
    }
}

// 重置表单
const resetForm = () => {
    if (loginFormRef.value) {
        loginFormRef.value.resetFields()
    }
    loginForm.value = {
        username: '',
        password: '',
        userImg: avatarList.value.length > 0 ? avatarList.value[0].url : ''
    }
}

// 组件挂载时初始化
onMounted(() => {
    initAvatarList()
    
    // 如果已经登录，直接跳转到首页
    if (userStore.isLogin) {
        ElMessage.info('您已登录，正在跳转到首页...')
        router.push('/')
    }
})
</script>

<style scoped>
.mylogin {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    box-sizing: border-box;
}

.login-container {
    width: 100%;
    max-width: 450px;
}

.login-card {
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 12px;
    overflow: hidden;
}

.card-header {
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    color: #333;
    padding: 20px 0;
}

.avatar-selection {
    width: 100%;
}

.selected-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
}

.avatar-preview {
    border: 3px solid #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.avatar-label {
    margin-top: 8px;
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.avatar-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    max-height: 180px;
    overflow-y: auto;
    padding: 15px;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    background-color: #fafafa;
}

.avatar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
    background-color: white;
}

.avatar-item:hover {
    background-color: #f0f9ff;
    transform: scale(1.05);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.avatar-item.selected {
    border-color: #409eff;
    background-color: #e6f7ff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
    transform: scale(1.05);
}

/* Element Plus 表单项样式优化 */
:deep(.el-form-item) {
    margin-bottom: 24px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
    color: #333;
}

:deep(.el-input__wrapper) {
    border-radius: 8px;
}

:deep(.el-button) {
    border-radius: 8px;
    font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .mylogin {
        padding: 10px;
    }
    
    .login-container {
        max-width: 100%;
    }
    
    .avatar-grid {
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        padding: 12px;
    }
    
    .card-header {
        font-size: 18px;
        padding: 15px 0;
    }
}

@media (max-width: 480px) {
    .avatar-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
    }
    
    .selected-avatar {
        padding: 12px;
    }
}
</style>