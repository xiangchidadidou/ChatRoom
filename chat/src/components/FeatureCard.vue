<!-- 
    FeatureCard 功能卡片组件
    功能：
    1. 展示功能特性的卡片式布局
    2. 支持图标、标题、描述、操作按钮的自定义
    3. 提供悬停效果和点击交互
    4. 支持新功能和热门标签显示
    5. 可配置路由跳转和事件发射
-->
<template>
    <!-- 主卡片容器：支持悬停阴影和点击事件 -->
    <el-card 
        class="feature-card" 
        shadow="hover" 
        @click="handleCardClick"
        :class="{ 'active': isActive }"
    >
        <!-- 卡片内容区域 -->
        <div class="feature-content">
            <!-- 图标插槽：可自定义图标，默认为设置图标 -->
            <slot name="icon">
                <el-icon class="feature-icon"><Setting /></el-icon>
            </slot>
            
            <!-- 标题插槽：可自定义标题内容 -->
            <slot name="title">
                <h3>{{ title }}</h3>
            </slot>
            
            <!-- 描述插槽：可自定义描述文本 -->
            <slot name="description">
                <p>{{ description }}</p>
            </slot>
            
            <!-- 操作按钮插槽：可自定义操作按钮，传递功能数据和点击方法 -->
            <slot name="actions" :feature="featureData" :onClick="handleCardClick">
                <div class="feature-actions" v-if="showActions">
                    <!-- 阻止事件冒泡，避免触发卡片点击 -->
                    <el-button size="small" type="primary" @click.stop="handleActionClick">
                        {{ actionText }}
                    </el-button>
                </div>
            </slot>
        </div>
        
        <!-- 角标插槽：显示新功能或热门标签 -->
        <slot name="badge" :isNew="isNew" :isHot="isHot">
            <div class="feature-badge" v-if="isNew || isHot">
                <el-tag v-if="isNew" type="success" size="small">新功能</el-tag>
                <el-tag v-if="isHot" type="danger" size="small">热门</el-tag>
            </div>
        </slot>
    </el-card>
</template>

<script setup>
/**
 * FeatureCard 组件的逻辑部分
 * 处理卡片交互、事件发射和路由跳转
 */

// Vue 3 Composition API
import { computed } from 'vue'
// Vue Router 路由管理
import { useRouter } from 'vue-router'
// Element Plus 图标组件
import { Setting } from '@element-plus/icons-vue'

// 路由实例
const router = useRouter()

/**
 * 组件属性定义
 * 定义了卡片的各种配置选项和显示内容
 */
const props = defineProps({
    // 卡片标题
    title: {
        type: String,
        default: '功能标题'
    },
    // 卡片描述文本
    description: {
        type: String,
        default: '功能描述'
    },
    // 图标名称（暂未使用）
    icon: {
        type: String,
        default: 'Setting'
    },
    // 是否为激活状态
    isActive: {
        type: Boolean,
        default: false
    },
    // 是否为新功能
    isNew: {
        type: Boolean,
        default: false
    },
    // 是否为热门功能
    isHot: {
        type: Boolean,
        default: false
    },
    // 是否显示操作按钮
    showActions: {
        type: Boolean,
        default: false
    },
    // 操作按钮文本
    actionText: {
        type: String,
        default: '了解更多'
    },
    // 是否可点击
    clickable: {
        type: Boolean,
        default: true
    },
    // 功能ID标识
    featureId: {
        type: [String, Number],
        default: ''
    },
    // 点击后跳转的路由
    route: {
        type: String,
        default: ''
    }
})

/**
 * 组件事件定义
 * 定义了组件可以向父组件发射的事件类型
 */
const emit = defineEmits([
    'card-click',      // 卡片点击事件
    'action-click',    // 操作按钮点击事件
    'feature-hover',   // 功能悬停事件（暂未使用）
    'navigate'         // 路由导航事件
])

/**
 * 计算属性：功能数据对象
 * 将组件的各个属性整合成一个完整的功能数据对象
 * 用于向父组件传递完整的功能信息
 */
const featureData = computed(() => ({
    id: props.featureId,           // 功能ID
    title: props.title,            // 功能标题
    description: props.description, // 功能描述
    isActive: props.isActive,      // 激活状态
    isNew: props.isNew,            // 新功能标识
    isHot: props.isHot,            // 热门标识
    route: props.route             // 路由地址
}))

/**
 * 处理卡片点击事件
 * 当用户点击卡片时触发，支持事件发射和路由跳转
 */
const handleCardClick = () => {
    // 检查卡片是否可点击
    if (props.clickable) {
        // 向父组件发射卡片点击事件，传递功能数据和时间戳
        emit('card-click', {
            feature: featureData.value,
            timestamp: Date.now()
        })
        
        // 如果配置了路由，执行页面跳转
        if (props.route) {
            router.push(props.route)
            emit('navigate', props.route)
        }
    }
}

/**
 * 处理操作按钮点击事件
 * 当用户点击操作按钮时触发，支持事件发射和路由跳转
 */
const handleActionClick = () => {
    // 向父组件发射操作按钮点击事件
    emit('action-click', {
        feature: featureData.value,
        action: 'button-click',
        timestamp: Date.now()
    })
    
    // 如果配置了路由，执行页面跳转
    if (props.route) {
        router.push(props.route)
        emit('navigate', props.route)
    }
}
</script>

<style scoped>
/**
 * FeatureCard 组件样式
 * 定义功能卡片的外观、布局、动画效果和响应式设计
 */

/* 主卡片容器样式 */
.feature-card {
    height: 200px;                    /* 固定高度 */
    transition: all 0.3s ease;        /* 平滑过渡动画 */
    cursor: pointer;                  /* 鼠标指针 */
    position: relative;               /* 相对定位，用于角标定位 */
    overflow: hidden;                 /* 隐藏溢出内容 */
}

/* 卡片悬停效果 */
.feature-card:hover {
    transform: translateY(-5px);                    /* 向上移动5px */
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);   /* 增强阴影效果 */
}

/* 卡片激活状态样式 */
.feature-card.active {
    border-color: #409eff;                          /* 主题色边框 */
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2); /* 外发光效果 */
}

/* 卡片内容区域布局 */
.feature-content {
    text-align: center;               /* 文本居中 */
    padding: 20px;                    /* 内边距 */
    height: 100%;                     /* 全高度 */
    display: flex;                    /* 弹性布局 */
    flex-direction: column;           /* 垂直排列 */
    justify-content: center;          /* 垂直居中 */
    position: relative;               /* 相对定位 */
}

/* 功能图标样式 */
.feature-icon {
    font-size: 48px;                 /* 图标大小 */
    color: #409eff;                   /* 主题蓝色 */
    margin-bottom: 16px;              /* 底部间距 */
    transition: all 0.3s ease;       /* 平滑过渡 */
}

/* 图标悬停效果 */
.feature-card:hover .feature-icon {
    transform: scale(1.1);            /* 放大1.1倍 */
    color: #66b1ff;                   /* 更亮的蓝色 */
}

/* 功能标题样式 */
.feature-content h3 {
    font-size: 20px;                 /* 字体大小 */
    margin-bottom: 12px;              /* 底部间距 */
    color: #333;                      /* 深灰色文字 */
    font-weight: 600;                 /* 字体粗细 */
}

/* 功能描述样式 */
.feature-content p {
    color: #666;                      /* 中灰色文字 */
    line-height: 1.6;                /* 行高 */
    margin-bottom: 16px;              /* 底部间距 */
    font-size: 14px;                  /* 字体大小 */
}

/* 操作按钮区域样式 */
.feature-actions {
    margin-top: auto;                 /* 推到底部 */
    padding-top: 10px;                /* 顶部间距 */
}

/* 角标容器样式 */
.feature-badge {
    position: absolute;               /* 绝对定位 */
    top: 10px;                        /* 距顶部10px */
    right: 10px;                      /* 距右侧10px */
    display: flex;                    /* 弹性布局 */
    gap: 5px;                         /* 标签间距 */
    flex-direction: column;           /* 垂直排列 */
    align-items: flex-end;            /* 右对齐 */
}

/* 角标标签样式 */
.feature-badge .el-tag {
    font-size: 10px;                  /* 小字体 */
    padding: 2px 6px;                 /* 内边距 */
    border-radius: 8px;               /* 圆角 */
}

/* 卡片激活状态的闪光动画效果 */
.feature-card.active::before {
    content: '';                      /* 伪元素内容 */
    position: absolute;               /* 绝对定位 */
    top: 0;                          /* 顶部对齐 */
    left: -100%;                     /* 初始位置在左侧外部 */
    width: 100%;                     /* 全宽度 */
    height: 100%;                    /* 全高度 */
    background: linear-gradient(      /* 渐变背景 */
        90deg,                       /* 水平方向 */
        transparent,                 /* 透明起始 */
        rgba(64, 158, 255, 0.1),    /* 半透明主题色 */
        transparent                  /* 透明结束 */
    );
    animation: shimmer 2s infinite;   /* 闪光动画，2秒循环 */
}

/* 闪光动画关键帧定义 */
@keyframes shimmer {
    0% {
        left: -100%;                 /* 动画开始：左侧外部 */
    }
    100% {
        left: 100%;                  /* 动画结束：右侧外部 */
    }
}

/* 移动端响应式设计 */
@media (max-width: 768px) {
    /* 移动端卡片高度调整 */
    .feature-card {
        height: 180px;               /* 减小高度适应小屏幕 */
    }
    
    /* 移动端图标大小调整 */
    .feature-icon {
        font-size: 40px;             /* 减小图标尺寸 */
    }
    
    /* 移动端标题字体调整 */
    .feature-content h3 {
        font-size: 18px;             /* 减小标题字体 */
    }
    
    /* 移动端描述字体调整 */
    .feature-content p {
        font-size: 13px;             /* 减小描述字体 */
    }
}
</style>