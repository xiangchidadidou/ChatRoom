<template>
    <div class="myuser">
        <div class="myuser-title">
            <h3>用户中心</h3>
        </div>
        <div class="myuser-contain">
            <!-- 用户信息展示 -->
            <div class="user-info-section">
                <div class="current-user-info">
                    <el-avatar 
                        :size="80" 
                        :src="userStore.userInfo.userImg" 
                        :icon="Avatar"
                        class="user-avatar"
                    />
                    <div class="user-details">
                        <h4>{{ userStore.userInfo.username || '未登录' }}</h4>
                        <p class="user-status">{{ userStore.isLogin ? '在线' : '离线' }}</p>
                    </div>
                </div>
            </div>

            <!-- 更改头像 -->
            <div class="avatar-change-section">
                <div class="section-title">
                    <el-icon><Picture /></el-icon>
                    <span>更改头像</span>
                </div>
                
                <div class="avatar-selection">
                    <!-- 当前选中的头像预览 -->
                    <div class="selected-avatar">
                        <el-avatar 
                            :size="100" 
                            :src="selectedAvatar" 
                            :icon="Avatar"
                            class="avatar-preview"
                        />
                        <span class="avatar-label">预览头像</span>
                    </div>
                    
                    <!-- 头像选择网格 -->
                    <div class="avatar-grid">
                        <div 
                            v-for="avatar in avatarList" 
                            :key="avatar.name"
                            class="avatar-item"
                            :class="{ 'selected': selectedAvatar === avatar.url }"
                            @click="selectAvatar(avatar.url)"
                        >
                            <el-avatar :size="50" :src="avatar.url" />
                        </div>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="avatar-actions">
                        <el-button 
                            type="primary" 
                            @click="updateAvatar"
                            :loading="updateLoading"
                            :disabled="selectedAvatar === userStore.userInfo.userImg"
                        >
                            {{ updateLoading ? '更新中...' : '更新头像' }}
                        </el-button>
                        <el-button @click="resetSelection">
                            重置选择
                        </el-button>
                    </div>
                </div>
            </div>

            <!-- 账户信息 -->
            <div class="account-info-section">
                <div class="section-title">
                    <el-icon><User /></el-icon>
                    <span>账户信息</span>
                </div>
                
                <div class="info-grid">
                    <div class="info-item">
                        <span class="info-label">用户名:</span>
                        <span class="info-value">{{ userStore.userInfo.username || '未设置' }}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">登录状态:</span>
                        <el-tag :type="userStore.isLogin ? 'success' : 'danger'">
                            {{ userStore.isLogin ? '已登录' : '未登录' }}
                        </el-tag>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Token:</span>
                        <span class="info-value token-display">
                            {{ userStore.token ? userStore.token.substring(0, 20) + '...' : '无' }}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { Avatar, Picture, User } from '@element-plus/icons-vue'

const userStore = useUserStore()
const updateLoading = ref(false)

// 头像列表
const avatarList = ref([])

// 当前选中的头像
const selectedAvatar = ref('')

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
    
    // 设置当前用户头像为默认选中
    selectedAvatar.value = userStore.userInfo.userImg || (avatars.length > 0 ? avatars[0].url : '')
}

// 选择头像
const selectAvatar = (avatarUrl) => {
    selectedAvatar.value = avatarUrl
}

// 更新头像
const updateAvatar = async () => {
    if (!selectedAvatar.value) {
        ElMessage.warning('请先选择一个头像')
        return
    }
    
    if (selectedAvatar.value === userStore.userInfo.userImg) {
        ElMessage.info('您选择的头像与当前头像相同')
        return
    }
    
    try {
        updateLoading.value = true
        
        // 更新用户信息中的头像
        userStore.userInfo.userImg = selectedAvatar.value
        
        // 这里可以调用API更新后端数据
        // await userApi.updateUserAvatar(selectedAvatar.value)
        
        ElMessage.success('头像更新成功！')
        
    } catch (error) {
        console.error('更新头像失败:', error)
        ElMessage.error('更新头像失败，请稍后重试')
    } finally {
        updateLoading.value = false
    }
}

// 重置选择
const resetSelection = () => {
    selectedAvatar.value = userStore.userInfo.userImg || (avatarList.value.length > 0 ? avatarList.value[0].url : '')
    ElMessage.info('已重置为当前头像')
}

// 组件挂载时初始化
onMounted(() => {
    initAvatarList()
    
    // 检查登录状态
    if (!userStore.isLogin) {
        ElMessage.warning('请先登录后再使用用户中心功能')
    }
})
</script>

<style scoped>
.myuser {
    padding: 20px;
    max-width: 800px;
    margin: 0 auto;
    background: #f5f7fa;
    min-height: 100vh;
}

.myuser-title {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid #e4e7ed;
}

.myuser-title h3 {
    font-size: 28px;
    color: #303133;
    margin: 0;
    font-weight: 600;
}

.myuser-contain {
    display: flex;
    flex-direction: column;
    gap: 25px;
}

/* 用户信息展示区域 */
.user-info-section {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.current-user-info {
    display: flex;
    align-items: center;
    gap: 20px;
}

.user-avatar {
    border: 3px solid #409eff;
    box-shadow: 0 4px 8px rgba(64, 158, 255, 0.3);
}

.user-details h4 {
    margin: 0 0 8px 0;
    font-size: 24px;
    color: #303133;
    font-weight: 600;
}

.user-status {
    margin: 0;
    color: #67c23a;
    font-size: 14px;
    font-weight: 500;
}

/* 更改头像区域 */
.avatar-change-section,
.account-info-section {
    background: #fff;
    padding: 25px;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #303133;
    padding-bottom: 10px;
    border-bottom: 1px solid #e4e7ed;
}

.section-title .el-icon {
    font-size: 20px;
    color: #409eff;
}

.avatar-selection {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.selected-avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
    border: 2px dashed #d0d7de;
}

.avatar-preview {
    border: 3px solid #409eff;
    box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

.avatar-label {
    font-size: 14px;
    color: #606266;
    font-weight: 500;
}

.avatar-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(70px, 1fr));
    gap: 15px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}

.avatar-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.avatar-item:hover {
    background: #e6f7ff;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.avatar-item.selected {
    border-color: #409eff;
    background: #e6f7ff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

.avatar-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    padding-top: 10px;
}

/* 账户信息区域 */
.info-grid {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #409eff;
}

.info-label {
    font-weight: 600;
    color: #606266;
    min-width: 80px;
}

.info-value {
    color: #303133;
    font-weight: 500;
}

.token-display {
    font-family: 'Courier New', monospace;
    font-size: 12px;
    background: #f0f0f0;
    padding: 4px 8px;
    border-radius: 4px;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .myuser {
        padding: 15px;
    }
    
    .current-user-info {
        flex-direction: column;
        text-align: center;
    }
    
    .avatar-grid {
        grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
        gap: 10px;
    }
    
    .avatar-actions {
        flex-direction: column;
    }
    
    .info-item {
        flex-direction: column;
        gap: 8px;
        text-align: center;
    }
}

/* 深色模式支持 */
:global(.dark) .myuser {
    background: #1a1a1a;
}

:global(.dark) .myuser-title h3 {
    color: #e4e7ed;
}

:global(.dark) .user-info-section,
:global(.dark) .avatar-change-section,
:global(.dark) .account-info-section {
    background: #2d2d2d;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

:global(.dark) .section-title {
    color: #e4e7ed;
    border-bottom-color: #4c4d4f;
}

:global(.dark) .selected-avatar,
:global(.dark) .avatar-grid,
:global(.dark) .info-item {
    background: #3a3a3a;
}

:global(.dark) .avatar-item:hover {
    background: #404040;
}

:global(.dark) .info-label,
:global(.dark) .info-value {
    color: #e4e7ed;
}

:global(.dark) .token-display {
    background: #404040;
    color: #e4e7ed;
}
</style>