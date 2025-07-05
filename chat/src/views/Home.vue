<template>
    <div class="myhome">
        <div class="home-content">
            <!-- 欢迎区域 - 使用 WelcomeBanner 组件 -->
            <div class="welcome-section">
                <!-- 4.1 组件定义、注册和引用 -->
                <!-- 4.2 父子组件间的通信 - 通过 props 传递数据 -->
                <!-- 4.3 插槽 - 使用具名插槽和作用域插槽 -->
                <WelcomeBanner :title="welcomeTitle" :description="welcomeDescription" :user-info="userStore.userInfo"
                    :is-login="userStore.isLogin" :show-default-actions="false" @action-click="handleBannerAction"
                    @banner-mounted="handleBannerMounted">
                    <!-- 具名插槽 - 自定义图标 -->
                    <template #icon>
                        <el-icon class="welcome-icon animated-icon">
                            <ChatDotRound />
                        </el-icon>
                    </template>

                    <!-- 默认插槽 - 自定义内容 -->
                    <template #default>
                        <h1 class="gradient-title">{{ welcomeTitle }}</h1>
                        <p class="welcome-subtitle">{{ welcomeDescription }}</p>
                        <div class="welcome-stats">
                            <div class="stat-item">
                                <span class="stat-number">{{ onlineUsers }}</span>
                                <span class="stat-label">在线用户</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-number">{{ totalMessages }}</span>
                                <span class="stat-label">消息总数</span>
                            </div>
                        </div>
                    </template>

                    <!-- 作用域插槽 - 根据用户状态显示不同内容 -->
                    <template #actions="{ user, isLogin }">
                        <div class="banner-actions">
                            <el-button v-if="!isLogin" type="primary" size="large" @click="navigateToLogin"
                                class="glow-button">
                                开始聊天
                            </el-button>
                            <el-button v-else type="success" size="large" @click="navigateToRoom" class="glow-button">
                                欢迎回来，{{ user.username || '用户' }}！
                            </el-button>
                        </div>
                    </template>
                </WelcomeBanner>
            </div>

            <!-- 功能区域 - 使用 FeatureCard 组件 -->
            <div class="features-section">
                <h2 class="section-title">核心功能</h2>
                <el-row :gutter="20">
                    <el-col :span="8" v-for="feature in features" :key="feature.id">
                        <!-- 组件定义、注册和引用 -->
                        <!-- 父子组件间的通信 - 通过 props 和 emit -->
                        <FeatureCard :title="feature.title" :description="feature.description" :feature-id="feature.id"
                            :route="feature.route" :is-active="activeFeature === feature.id" :is-new="feature.isNew"
                            :is-hot="feature.isHot" :show-actions="true" :action-text="feature.actionText"
                            @card-click="handleFeatureClick" @action-click="handleFeatureAction"
                            @navigate="handleFeatureNavigate">
                            <!-- 插槽 - 具名插槽自定义图标 -->
                            <template #icon>
                                <el-icon class="feature-icon" :class="feature.iconClass">
                                    <component :is="feature.icon" />
                                </el-icon>
                            </template>

                            <!-- 具名插槽 - 自定义标题样式 -->
                            <template #title>
                                <h3 class="feature-title" :class="feature.titleClass">
                                    {{ feature.title }}
                                </h3>
                            </template>

                            <!-- 作用域插槽 - 自定义操作按钮 -->
                            <template #actions="{ feature: featureData, onClick }">
                                <div class="custom-actions">
                                    <el-button size="small" :type="feature.buttonType"
                                        @click="() => handleFeatureNavigate(feature.route)">
                                        {{ feature.actionText }}
                                    </el-button>
                                    <el-button size="small" text @click="() => handleFeatureInfo(featureData)">
                                        详情
                                    </el-button>
                                </div>
                            </template>
                        </FeatureCard>
                    </el-col>
                </el-row>
            </div>

            <!-- 快速操作区域 - 使用 QuickActions 组件 -->
            <div class="actions-section">
                <!-- 组件定义、注册和引用 -->
                <!-- 父子组件间的通信 - 事件传递 -->
                <QuickActions :title="quickActionsTitle" :is-login="userStore.isLogin" :user-info="userStore.userInfo"
                    :show-extra-actions="true" @login-click="handleLoginClick" @guest-mode-click="handleGuestModeClick"
                    @enter-room-click="handleEnterRoomClick" @logout-click="handleLogoutClick"
                    @help-click="handleHelpClick" @feedback-click="handleFeedbackClick">
                    <!-- 插槽 - 具名插槽自定义标题 -->
                    <template #title>
                        <h2 class="actions-title">
                            <el-icon>
                                <Lightning />
                            </el-icon>
                            {{ quickActionsTitle }}
                        </h2>
                    </template>

                    <!-- 作用域插槽 - 自定义游客操作 -->
                    <template #guest-actions="{ isLogin, onLogin, onGuestMode }">
                        <div class="guest-actions-custom">
                            <el-button type="primary" size="large" @click="onLogin" class="primary-action">
                                <el-icon>
                                    <User />
                                </el-icon>
                                立即登录
                            </el-button>
                            <el-button size="large" @click="onGuestMode" class="secondary-action">
                                <el-icon>
                                    <ChatDotRound />
                                </el-icon>
                                游客体验
                            </el-button>
                            <el-button size="large" text @click="handleDemoMode">
                                <el-icon>
                                    <View />
                                </el-icon>
                                演示模式
                            </el-button>
                        </div>
                    </template>

                    <!-- 作用域插槽 - 自定义用户欢迎信息 -->
                    <template #user-welcome="{ userInfo }">
                        <div class="custom-welcome-user">
                            <el-avatar :size="60" :src="userInfo.userImg" :icon="UserFilled" class="user-avatar" />
                            <div class="user-info">
                                <h3>欢迎回来！</h3>
                                <p class="username">{{ userInfo.username || '用户' }}</p>
                                <el-tag size="small" type="success">在线</el-tag>
                            </div>
                        </div>
                    </template>

                    <!-- 作用域插槽 - 自定义额外操作 -->
                    <template #extra-actions="{ userInfo, isLogin }">
                        <div class="enhanced-extra-actions">
                            <el-button-group>
                                <el-button size="small" @click="handleHelp">
                                    <el-icon>
                                        <QuestionFilled />
                                    </el-icon>
                                    帮助中心
                                </el-button>
                                <el-button size="small" @click="handleFeedback">
                                    <el-icon>
                                        <ChatLineRound />
                                    </el-icon>
                                    意见反馈
                                </el-button>
                                <el-button size="small" @click="handleAbout">
                                    <el-icon>
                                        <InfoFilled />
                                    </el-icon>
                                    关于我们
                                </el-button>
                            </el-button-group>
                        </div>
                    </template>
                </QuickActions>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import {
    ChatDotRound,
    Message,
    UserFilled,
    Setting,
    User,
    SwitchButton,
    Lightning,
    View,
    QuestionFilled,
    ChatLineRound,
    InfoFilled
} from '@element-plus/icons-vue'

// 组件定义、注册和引用 - 导入自定义组件
import WelcomeBanner from '@/components/WelcomeBanner.vue'
import FeatureCard from '@/components/FeatureCard.vue'
import QuickActions from '@/components/QuickActions.vue'

const router = useRouter()
const userStore = useUserStore()

//  父子组件间的通信 - 响应式数据
const welcomeTitle = ref('欢迎来到 Kayron 聊天室')
const welcomeDescription = ref('连接世界，分享精彩时刻，体验全新的实时交流方式')
const quickActionsTitle = ref('快速开始')
const activeFeature = ref('')
const onlineUsers = ref(1234)
const totalMessages = ref(56789)

// 功能列表数据
const features = reactive([
    {
        id: 'chat',
        title: '实时聊天',
        description: '支持文字、表情、图片等多种消息类型，享受流畅的聊天体验',
        icon: 'Message',
        iconClass: 'chat-icon',
        titleClass: 'chat-title',
        buttonType: 'primary',
        actionText: '开始聊天',
        route: '/room',
        isNew: false,
        isHot: true
    },
    {
        id: 'user',
        title: '用户管理',
        description: '完善的用户系统，支持个人资料设置和头像自定义',
        icon: 'UserFilled',
        iconClass: 'user-icon',
        titleClass: 'user-title',
        buttonType: 'success',
        actionText: '个人中心',
        route: '/user',
        isNew: false,
        isHot: false
    },
    {
        id: 'setting',
        title: '个性化设置',
        description: '自定义主题、通知等个人偏好设置，打造专属聊天环境',
        icon: 'Setting',
        iconClass: 'setting-icon',
        titleClass: 'setting-title',
        buttonType: 'warning',
        actionText: '设置中心',
        route: '/setting',
        isNew: true,
        isHot: false
    }
])

// 基础导航方法
const navigateToLogin = () => {
    router.push('/login')
}

const navigateToRoom = () => {
    router.push('/room')
}

const navigateToSetting = () => {
    router.push('/setting')
}

const navigateToUser = () => {
    router.push('/user')
}

// 父子组件间的通信 - 事件处理方法

// WelcomeBanner 组件事件处理
const handleBannerAction = (data) => {
    console.log('Banner action:', data)
    ElMessage.success('横幅操作触发')
}

const handleBannerMounted = (data) => {
    console.log('Banner mounted:', data)
    // 模拟获取实时数据
    setTimeout(() => {
        onlineUsers.value = Math.floor(Math.random() * 2000) + 1000
        totalMessages.value = Math.floor(Math.random() * 100000) + 50000
    }, 1000)
}

// FeatureCard 组件事件处理
const handleFeatureClick = (data) => {
    console.log('Feature clicked:', data)
    activeFeature.value = data.feature.id
    ElNotification({
        title: '功能选择',
        message: `您选择了：${data.feature.title}`,
        type: 'info',
        duration: 2000
    })
}

const handleFeatureAction = (data) => {
    console.log('Feature action:', data)
    ElMessage.success(`${data.feature.title} 操作执行成功`)
}

const handleFeatureNavigate = (route) => {
    if (route) {
        router.push(route)
    }
}

const handleFeatureInfo = (featureData) => {
    ElMessageBox.alert(
        `功能ID: ${featureData.id}\n标题: ${featureData.title}\n描述: ${featureData.description}`,
        '功能详情',
        {
            confirmButtonText: '确定',
            type: 'info'
        }
    )
}

// QuickActions 组件事件处理
const handleLoginClick = (data) => {
    console.log('Login clicked:', data)
    navigateToLogin()
}

const handleGuestModeClick = (data) => {
    console.log('Guest mode clicked:', data)
    ElMessage.info('游客模式功能开发中...')
}

const handleEnterRoomClick = (data) => {
    console.log('Enter room clicked:', data)
    navigateToRoom()
}

const handleLogoutClick = async (data) => {
    console.log('Logout clicked:', data)
    await handleLogout()
}

const handleHelpClick = (data) => {
    console.log('Help clicked:', data)
    ElMessage.info('帮助中心功能开发中...')
}

const handleFeedbackClick = (data) => {
    console.log('Feedback clicked:', data)
    ElMessage.info('意见反馈功能开发中...')
}

// 额外的事件处理方法
const handleDemoMode = () => {
    ElMessage.success('演示模式已启动')
    // 可以添加演示模式的逻辑
}

const handleHelp = () => {
    ElMessageBox.alert(
        '这是一个现代化的聊天室应用，支持实时消息、用户管理和个性化设置。',
        '帮助中心',
        {
            confirmButtonText: '我知道了',
            type: 'info'
        }
    )
}

const handleFeedback = () => {
    ElMessageBox.prompt(
        '请输入您的宝贵意见：',
        '意见反馈',
        {
            confirmButtonText: '提交',
            cancelButtonText: '取消',
            inputType: 'textarea',
            inputPlaceholder: '请输入您的建议或意见...'
        }
    ).then(({ value }) => {
        ElMessage.success('感谢您的反馈！')
        console.log('用户反馈:', value)
    }).catch(() => {
        ElMessage.info('已取消反馈')
    })
}

const handleAbout = () => {
    ElMessageBox.alert(
        'Kayron 聊天室 v1.0\n\n一个基于 Vue 3 + Element Plus 的现代化聊天应用\n\n开发团队：Kayron Team\n技术栈：Vue 3, Element Plus, Socket.io',
        '关于我们',
        {
            confirmButtonText: '确定',
            type: 'info'
        }
    )
}

// 处理登出
const handleLogout = async () => {
    try {
        await ElMessageBox.confirm(
            '确定要退出登录吗？',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )

        await userStore.logout()
        ElMessage.success('已退出登录')

    } catch (error) {
        if (error !== 'cancel') {
            console.error('登出失败:', error)
            ElMessage.error('登出失败')
        }
    }
}

// 组件挂载时的初始化
onMounted(() => {
    // 模拟数据加载
    setTimeout(() => {
        ElNotification({
            title: '欢迎',
            message: '欢迎使用 Kayron 聊天室！',
            type: 'success',
            duration: 3000
        })
    }, 500)
})
</script>

<style scoped>
.myhome {
    min-height: 100%;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.home-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.welcome-section {
    margin-bottom: 40px;
}

.welcome-card {
    text-align: center;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
}

.welcome-content {
    padding: 40px 20px;
}

.welcome-icon {
    font-size: 64px;
    margin-bottom: 20px;
    color: #fff;
}

.welcome-content h1 {
    font-size: 36px;
    margin-bottom: 16px;
    font-weight: bold;
}

.welcome-content p {
    font-size: 18px;
    opacity: 0.9;
}

.features-section {
    margin-bottom: 40px;
}

.feature-card {
    height: 200px;
    transition: transform 0.3s ease;
}

.feature-card:hover {
    transform: translateY(-5px);
}

.feature-content {
    text-align: center;
    padding: 20px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

.feature-icon {
    font-size: 48px;
    color: #409eff;
    margin-bottom: 16px;
}

.feature-content h3 {
    font-size: 20px;
    margin-bottom: 12px;
    color: #333;
}

.feature-content p {
    color: #666;
    line-height: 1.6;
}

.actions-section {
    margin-bottom: 40px;
}

.actions-card {
    background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
    border: none;
}

.actions-content {
    text-align: center;
    padding: 40px 20px;
}

.actions-content h2 {
    font-size: 28px;
    margin-bottom: 30px;
    color: #333;
}

.action-buttons {
    display: flex;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
}

.action-buttons .el-button {
    padding: 12px 30px;
    font-size: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
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
}

.welcome-user h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
}

.guest-actions-custom {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 12px;
    width: 100%;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .home-content {
        padding: 20px 10px;
    }

    .welcome-content h1 {
        font-size: 28px;
    }

    .welcome-content p {
        font-size: 16px;
    }

    .action-buttons {
        flex-direction: column;
        align-items: center;
    }

    .action-buttons .el-button {
        width: 200px;
    }
}
</style>