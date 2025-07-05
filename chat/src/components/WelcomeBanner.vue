<template>
    <el-card class="welcome-card">
        <div class="welcome-content">
            <!-- 使用具名插槽 -->
            <slot name="icon">
                <el-icon class="welcome-icon"><ChatDotRound /></el-icon>
            </slot>
            
            <!-- 使用默认插槽 -->
            <slot>
                <h1>{{ title }}</h1>
                <p>{{ description }}</p>
            </slot>
            
            <!-- 使用作用域插槽 -->
            <slot name="actions" :user="userInfo" :isLogin="isLogin">
                <div class="default-actions" v-if="showDefaultActions">
                    <el-button type="primary" @click="handleDefaultAction">
                        默认操作
                    </el-button>
                </div>
            </slot>
        </div>
    </el-card>
</template>

<script setup>
import { ChatDotRound } from '@element-plus/icons-vue'

// 定义 props - 父子组件通信
const props = defineProps({
    title: {
        type: String,
        default: '欢迎来到聊天室'
    },
    description: {
        type: String,
        default: '与朋友们实时交流，分享美好时光'
    },
    userInfo: {
        type: Object,
        default: () => ({})
    },
    isLogin: {
        type: Boolean,
        default: false
    },
    showDefaultActions: {
        type: Boolean,
        default: false
    }
})

// 定义 emits - 父子组件通信
const emit = defineEmits(['action-click', 'banner-mounted'])

// 处理默认操作
const handleDefaultAction = () => {
    emit('action-click', {
        type: 'default',
        timestamp: Date.now()
    })
}

// 组件挂载时通知父组件
import { onMounted } from 'vue'
onMounted(() => {
    emit('banner-mounted', {
        component: 'WelcomeBanner',
        props: props
    })
})
</script>

<style scoped>
.welcome-card {
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    transition: all 0.3s ease;
}

.welcome-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.welcome-content {
    padding: 40px 20px;
}

.welcome-icon {
    font-size: 64px;
    margin-bottom: 20px;
    color: #fff;
    animation: pulse 2s infinite;
}

.welcome-content h1 {
    font-size: 36px;
    margin-bottom: 16px;
    font-weight: bold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.welcome-content p {
    font-size: 18px;
    opacity: 0.9;
    margin-bottom: 20px;
}

.default-actions {
    margin-top: 20px;
}

.default-actions .el-button {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    backdrop-filter: blur(10px);
}

.default-actions .el-button:hover {
    background: rgba(255, 255, 255, 0.3);
    border-color: rgba(255, 255, 255, 0.5);
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

/* 响应式设计 */
@media (max-width: 768px) {
    .welcome-content h1 {
        font-size: 28px;
    }
    
    .welcome-content p {
        font-size: 16px;
    }
    
    .welcome-icon {
        font-size: 48px;
    }
}
</style>