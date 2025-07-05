import mockjs from "mockjs";

// 模拟用户数据
const users = [
    {
        username: "admin",
        password: "123456",
        userImg: "",
        token: "admin-token-123456"
    },
    {
        username: "user",
        password: "123456",
        userImg: "",
        token: "user-token-123456"
    },
    {
        username: "test",
        password: "123456",
        userImg: "",
        token: "test-token-123456"
    }
];

// 模拟登录接口
mockjs.mock('/api/user/login', 'post', (options) => {
    const { username, password, userImg } = JSON.parse(options.body);
    
    // 查找用户
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        return {
            code: 200,
            message: '登录成功',
            data: {
                token: user.token,
                userInfo: {
                    username: user.username,
                    userImg: userImg || user.userImg
                }
            }
        };
    } else {
        return {
            code: 401,
            message: '用户名或密码错误',
            data: null
        };
    }
});

// 模拟获取用户信息接口
mockjs.mock('/api/user/info', 'get', (options) => {
    const token = options.headers && options.headers.Authorization;
    
    if (token) {
        // 根据token查找用户
        const user = users.find(u => token.includes(u.token));
        if (user) {
            return {
                code: 200,
                message: '获取用户信息成功',
                data: {
                    username: user.username,
                    userImg: user.userImg
                }
            };
        }
    }
    
    return {
        code: 401,
        message: '未授权',
        data: null
    };
});

// 模拟登出接口
mockjs.mock('/api/user/logout', 'post', () => {
    return {
        code: 200,
        message: '登出成功',
        data: null
    };
});

console.log('Mock API 已启动');