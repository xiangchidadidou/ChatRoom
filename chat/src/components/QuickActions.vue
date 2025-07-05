<template>
    <el-card class="actions-card">
        <div class="actions-content">
            <!-- 标题插槽 -->
            <slot name="title">
                <h2>{{ title }}</h2>
            </slot>
            
            <div class="action-buttons">
                <!-- 未登录状态插槽 -->
                <slot 
                    name="guest-actions" 
                    :isLogin="isLogin" 
                    :onLogin="handleLogin"
                    :onGuestMode="handleGuestMode"
                    v-if="!isLogin"
                >
                    <el-button type="primary" size="large" @click="handleLogin">
                        <el-icon><User /></el-icon>
                        立即登录
                    </el-button>
                    <el-button size="large" @click="handleGuestMode">
                        <el-icon><ChatDotRound /></el-icon>
                        游客模式
                    </el-button>
                </slot>
                
                <!-- 已登录状态插槽 -->
                <slot 
                    name="user-actions" 
                    :isLogin="isLogin"
                    :userInfo="userInfo"
                    :onEnterRoom="handleEnterRoom"
                    :onLogout="handleLogout"
                    v-else
                >
                    <!-- 用户欢迎信息插槽 -->
                    <slot name="user-welcome" :userInfo="userInfo">
                        <div class="welcome-user">
                            <el-avatar 
                                :size="50" 
                                :src="userInfo.userImg" 
                                :icon="UserFilled" 
                            />
                            <h3>欢迎回来，{{ userInfo.username || '用户' }}！</h3>
                        </div>
                    </slot>
                    
                    <el-button type="primary" size="large" @click="handleEnterRoom">
                        <el-icon><ChatDotRound /></el-icon>
                        进入聊天室
                    </el-button>
                    <el-button size="large" @click="handleLogout">
                        <el-icon><SwitchButton /></el-icon>
                        退出登录
                    </el-button>
                </slot>
            </div>
            
            <!-- 额外操作插槽 -->
            <slot name="extra-actions" :userInfo="userInfo" :isLogin="isLogin">
                <div class="extra-actions" v-if="showExtraActions">
                    <el-button-group>
                        <el-button size="small" @click="handleHelp">
                            <el-icon><QuestionFilled /></el-icon>
                            帮助
                        </el-button>
                        <el-button size="small" @click="handleFeedback">
                            <el-icon><ChatLineRound /></el-icon>
                            反馈
                        </el-button>
                    </el-button-group>
                </div>
            </slot>
        </div>
    </el-card>
</template>

<script setup>
import { 
    User, 
    ChatDotRound, 
    UserFilled, 
    SwitchButton,
    QuestionFilled,
    ChatLineRound
} from '@element-plus/icons-vue'

// 定义 props
const props = defineProps({
    title: {
        type: String,
        default: '快速开始'
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    userInfo: {
        type: Object,
        default: () => ({
            username: '',
            userImg: ''
        })
    },
    showExtraActions: {
        type: Boolean,
        default: false
    }
})

// 定义 emits
const emit = defineEmits([
    'login-click',
    'guest-mode-click', 
    'enter-room-click',
    'logout-click',
    'help-click',
    'feedback-click'
])

// 处理登录
const handleLogin = () => {
    emit('login-click', {
        timestamp: Date.now(),
        source: 'quick-actions'
    })
}

// 处理游客模式
const handleGuestMode = () => {
    emit('guest-mode-click', {
        timestamp: Date.now(),
        mode: 'guest'
    })
}

// 处理进入聊天室
const handleEnterRoom = () => {
    emit('enter-room-click', {
        timestamp: Date.now(),
        userInfo: props.userInfo
    })
}

// 处理登出
const handleLogout = () => {
    emit('logout-click', {
        timestamp: Date.now(),
        userInfo: props.userInfo
    })
}

// 处理帮助
const handleHelp = () => {
    emit('help-click', {
        timestamp: Date.now(),
        type: 'help'
    })
}

// 处理反馈
const handleFeedback = () => {
    emit('feedback-click', {
        timestamp: Date.now(),
        type: 'feedback'
    })
}
</script>

<style scoped>
.actions-card {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border: none;
    transition: all 0.3s ease;
}

.actions-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(252, 182, 159, 0.3);
}

.actions-content {
    text-align: center;
    padding: 40px 20px;
}

.actions-content h2 {
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-direction: row;  /* 默认水平排列 */
    margin-bottom: 20px;
}

.action-buttons .el-button {
    padding: 12px 30px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    border-radius: 25px;
}

.action-buttons .el-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.welcome-user {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.welcome-user:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: scale(1.02);
}

.welcome-user h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    font-weight: 600;
}

.extra-actions {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid rgba(255, 255, 255, 0.3);
}

.extra-actions .el-button-group {
    display: flex;
    gap: 10px;
}

.extra-actions .el-button {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.9);
    color: #666;
    font-size: 14px;
    padding: 8px 16px;
}

.extra-actions .el-button:hover {
    background: rgba(255, 255, 255, 0.95);
    color: #409eff;
    border-color: #409eff;
}

/* 响应式设计 */
@media (max-width: 576px) {
    .actions-content {
        padding: 30px 15px;
    }
    
    .actions-content h2 {
        font-size: 24px;
    }
    
    .action-buttons {
        flex-direction: column;
        align-items: center;
    }
    
    .action-buttons .el-button {
        width: 200px;
        font-size: 14px;
        padding: 10px 20px;
    }
    
    .welcome-user {
        padding: 15px;
    }
    
    .welcome-user h3 {
        font-size: 16px;
    }
}

@media (max-width: 480px) {
    .action-buttons .el-button {
        width: 180px;
    }
    
    .extra-actions .el-button-group {
        flex-direction: column;
        width: 100%;
    }
    
    .extra-actions .el-button {
        width: 100%;
    }
}
</style>