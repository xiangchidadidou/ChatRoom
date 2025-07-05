<template>
    <div class="room">
        <!-- 当前用户列表 -->
        <div class="room-left">
            <div class="room-center">
                <div class="title">当前用户列表</div>
                <ul class="user-list">
                    <li class="user-item" v-for="user in userList" :key="user.username">
                        <!-- 用户头像 -->
                        <el-avatar :size="40" :src="user.avatar" :icon="Avatar" />
                        <!-- 用户昵称 -->
                        <span class="username">{{ user.username }}</span>
                        <span v-if="user.username === currentUser.username" class="current-user-tag">(我)</span>
                    </li>
                </ul>
            </div>
        </div>
        <!-- 聊天框 -->
        <div class="room-right">
            <div class="room-center">
                <div class="room-header">
                    <div class="room-name">聊天室({{ userList.length }}人)</div>
                    <el-button type="danger" size="small" @click="handleLogout">退出聊天室</el-button>
                </div>
                <div class="chat-box" ref="chatBoxRef">
                    <ul class="chat-list">
                        <li class="chat-item" v-for="(message, index) in messageList" :key="index">
                            <!-- 系统消息 -->
                            <div v-if="message.type === 'system'" class="system-message">
                                {{ message.content }}
                            </div>
                            <!-- 用户消息 -->
                            <div v-else class="user-message" :class="{
                                'own-message': message.username === currentUser.username,
                                'other-message': message.username !== currentUser.username
                            }">
                                <div class="message-info">
                                    <el-avatar :size="30" :src="message.avatar" :icon="Avatar" />
                                    <span class="message-username">{{ message.username }}</span>
                                    <span class="message-time">{{ formatTime(message.timestamp) }}</span>
                                </div>
                                <div class="message-content">
                                    {{ message.content }}
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <!-- 聊天输入框 -->
                <div class="chat-input">
                    <el-input 
                        v-model="inputMessage" 
                        placeholder="请输入聊天内容" 
                        @keyup.enter="sendMessage"
                        :disabled="!isConnected"
                        maxlength="500"
                        show-word-limit
                    />
                    <el-button 
                        type="primary" 
                        @click="sendMessage" 
                        :disabled="!inputMessage.trim() || !isConnected"
                        :loading="sendLoading"
                    >
                        发送
                    </el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Avatar } from '@element-plus/icons-vue'
import { io } from 'socket.io-client'

const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const socket = ref(null)
const isConnected = ref(false)
const userList = ref([])
const messageList = ref([])
const inputMessage = ref('')
const sendLoading = ref(false)
const chatBoxRef = ref(null)
const currentUser = ref({})

// 初始化Socket连接
const initSocket = () => {
    try {
        socket.value = io('http://localhost:3000', {
            transports: ['websocket', 'polling']
        })

        // 连接成功
        socket.value.on('connect', () => {
            console.log('Socket连接成功')
            isConnected.value = true
            
            // 发送登录信息
            const loginData = {
                username: currentUser.value.username,
                avatar: currentUser.value.userImg
            }
            socket.value.emit('login', loginData)
        })

        // 连接断开
        socket.value.on('disconnect', () => {
            console.log('Socket连接断开')
            isConnected.value = false
        })

        // 登录成功
        socket.value.on('loginSuccess', (data) => {
            console.log('登录成功:', data)
            ElMessage.success('成功加入聊天室！')
        })

        // 用户已存在
        socket.value.on('userExist', (data) => {
            console.log('用户已存在:', data)
            ElMessage.error(data.msg)
            handleLogout()
        })

        // 有人加入聊天室
        socket.value.on('joinRoom', (data) => {
            console.log('有人加入:', data)
            const systemMessage = {
                type: 'system',
                content: `${data.username} 加入了聊天室`,
                timestamp: new Date()
            }
            messageList.value.push(systemMessage)
            scrollToBottom()
        })

        // 有人离开聊天室
        socket.value.on('leaveRoom', (data) => {
            console.log('有人离开:', data)
            const systemMessage = {
                type: 'system',
                content: `${data.username} 离开了聊天室`,
                timestamp: new Date()
            }
            messageList.value.push(systemMessage)
            scrollToBottom()
        })

        // 更新用户列表
        socket.value.on('userList', (data) => {
            console.log('用户列表更新:', data)
            userList.value = data
        })

        // 接收消息
        socket.value.on('receiveMessage', (data) => {
            console.log('收到消息:', data)
            const message = {
                type: 'user',
                username: data.username,
                avatar: data.avatar,
                content: data.content,
                timestamp: new Date(data.timestamp)
            }
            messageList.value.push(message)
            scrollToBottom()
        })

        // 连接错误
        socket.value.on('connect_error', (error) => {
            console.error('Socket连接错误:', error)
            ElMessage.error('连接聊天服务器失败，请检查网络连接')
            isConnected.value = false
        })

    } catch (error) {
        console.error('初始化Socket失败:', error)
        ElMessage.error('初始化聊天功能失败')
    }
}

// 发送消息
const sendMessage = () => {
    if (!inputMessage.value.trim()) {
        ElMessage.warning('请输入消息内容')
        return
    }

    if (!isConnected.value) {
        ElMessage.error('连接已断开，无法发送消息')
        return
    }

    try {
        sendLoading.value = true
        
        const messageData = {
            username: currentUser.value.username,
            avatar: currentUser.value.userImg,
            content: inputMessage.value.trim(),
            timestamp: new Date().toISOString()
        }

        socket.value.emit('sendMessage', messageData)
        inputMessage.value = ''
        
    } catch (error) {
        console.error('发送消息失败:', error)
        ElMessage.error('发送消息失败')
    } finally {
        sendLoading.value = false
    }
}

// 滚动到底部
const scrollToBottom = () => {
    nextTick(() => {
        if (chatBoxRef.value) {
            chatBoxRef.value.scrollTop = chatBoxRef.value.scrollHeight
        }
    })
}

// 格式化时间
const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
}

// 退出聊天室
const handleLogout = async () => {
    try {
        await ElMessageBox.confirm(
            '确定要退出聊天室吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        
        // 断开Socket连接
        if (socket.value) {
            socket.value.disconnect()
        }
        
        // 清除用户登录状态
        await userStore.logout()
        
        ElMessage.success('已退出聊天室')
        router.push('/login')
        
    } catch (error) {
        // 用户取消操作
        console.log('用户取消退出')
    }
}

// 检查登录状态
const checkLoginStatus = () => {
    if (!userStore.isLogin || !userStore.userInfo.username) {
        ElMessage.error('请先登录')
        router.push('/login')
        return false
    }
    
    currentUser.value = userStore.userInfo
    return true
}

// 组件挂载
onMounted(() => {
    if (checkLoginStatus()) {
        initSocket()
    }
})

// 组件卸载
onUnmounted(() => {
    if (socket.value) {
        socket.value.disconnect()
    }
})

// 监听消息列表变化，自动滚动到底部
watch(() => messageList.value.length, () => {
    scrollToBottom()
})
</script>

<style scoped>
.room {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    font-family: 'Helvetica Neue', Arial, sans-serif;
}

/* 左侧用户列表 */
.room-left {
    width: 300px;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.room-center {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 20px;
}

.title {
    font-size: 18px;
    font-weight: bold;
    color: #333;
    margin-bottom: 20px;
    text-align: center;
    padding: 15px;
    background: linear-gradient(45deg, #409eff, #67c23a);
    color: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.user-list {
    flex: 1;
    overflow-y: auto;
    list-style: none;
    padding: 0;
    margin: 0;
}

.user-item {
    display: flex;
    align-items: center;
    padding: 12px;
    margin-bottom: 8px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
}

.user-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background: #f8f9fa;
}

.username {
    margin-left: 12px;
    font-weight: 500;
    color: #333;
    flex: 1;
}

.current-user-tag {
    color: #409eff;
    font-size: 12px;
    font-weight: bold;
    background: #e6f7ff;
    padding: 2px 6px;
    border-radius: 4px;
}

/* 右侧聊天区域 */
.room-right {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
}

.room-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: white;
    border-bottom: 1px solid #e4e7ed;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.room-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
    background: linear-gradient(45deg, #409eff, #67c23a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.chat-box {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
    background: #f8f9fa;
    height: calc(100vh - 200px);
}

.chat-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.chat-item {
    margin-bottom: 15px;
}

/* 系统消息 */
.system-message {
    text-align: center;
    color: #909399;
    font-size: 12px;
    padding: 8px 16px;
    background: rgba(144, 147, 153, 0.1);
    border-radius: 20px;
    margin: 10px auto;
    max-width: 300px;
    border: 1px solid rgba(144, 147, 153, 0.2);
}

/* 用户消息 */
.user-message {
    display: flex;
    flex-direction: column;
    max-width: 100%;
    margin-bottom: 15px;
}

.own-message {
    align-self: flex-end;
    align-items: flex-end;
}

.other-message {
    align-self: flex-start;
    align-items: flex-start;
}

.message-info {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    gap: 8px;
}

.own-message .message-info {
    flex-direction: row-reverse;
}

.message-username {
    font-size: 12px;
    color: #666;
    font-weight: 500;
}

.message-time {
    font-size: 11px;
    color: #999;
}

.message-content {
    padding: 12px 16px;
    border-radius: 18px;
    word-wrap: break-word;
    line-height: 1.4;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
}

.own-message .message-content {
    background: linear-gradient(45deg, #409eff, #36a3f7);
    color: white;
    border-bottom-right-radius: 4px;
}

.other-message .message-content {
    background: white;
    color: #333;
    border: 1px solid #e4e7ed;
    border-bottom-left-radius: 4px;
}

/* 聊天输入框 */
.chat-input {
    display: flex;
    gap: 12px;
    padding: 20px;
    background: white;
    border-top: 1px solid #e4e7ed;
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.chat-input :deep(.el-input) {
    flex: 1;
}

.chat-input :deep(.el-input__wrapper) {
    border-radius: 25px;
    padding: 0 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid #e4e7ed;
}

.chat-input :deep(.el-input__wrapper:hover) {
    border-color: #409eff;
}

.chat-input :deep(.el-input__wrapper.is-focus) {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

.chat-input :deep(.el-button) {
    border-radius: 25px;
    padding: 12px 24px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3);
}

/* 滚动条样式 */
.chat-box::-webkit-scrollbar,
.user-list::-webkit-scrollbar {
    width: 6px;
}

.chat-box::-webkit-scrollbar-track,
.user-list::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}

.chat-box::-webkit-scrollbar-thumb,
.user-list::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
}

.chat-box::-webkit-scrollbar-thumb:hover,
.user-list::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .room {
        flex-direction: column;
    }
    
    .room-left {
        width: 100%;
        height: 200px;
    }
    
    .room-right {
        flex: 1;
    }
    
    .chat-box {
        height: calc(100vh - 400px);
    }
    
    .user-message {
        max-width: 85%;
    }
    
    .room-header {
        padding: 15px;
    }
    
    .room-name {
        font-size: 18px;
    }
}

@media (max-width: 480px) {
    .room-center {
        padding: 15px;
    }
    
    .chat-input {
        padding: 15px;
        gap: 8px;
    }
    
    .chat-input :deep(.el-button) {
        padding: 10px 16px;
    }
    
    .user-message {
        max-width: 90%;
    }
    
    .message-content {
        padding: 10px 14px;
    }
}

/* 动画效果 */
.chat-item {
    animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* 连接状态指示 */
.room-header::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #67c23a;
    margin-right: 8px;
    animation: pulse 2s infinite;
}

@keyframes pulse {
    0% {
        box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.7);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(103, 194, 58, 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
    }
}
</style>