/**
 * 用户状态管理 Store
 * 使用 Pinia 管理用户相关的状态数据，包括登录状态、用户信息、认证令牌等
 * 支持状态持久化，数据会自动保存到 localStorage
 */

import { defineStore } from "pinia";
import * as userApi from "@/api/user";

// 定义用户状态管理 Store
export const useUserStore = defineStore("user", {
	// ===== 状态定义 =====
	state: () => ({
		// 用户基本信息对象
		userInfo: {},
		
		// 用户登录状态标识
        isLogin: false,
        
        // 用户认证令牌
        token: null,
        
        // 模拟用户数据列表（用于开发测试）
        userList: [
            {
                username: "admin",
                password: "123456",
                userImg: ""
            },
            {
                username: "user",
                password: "123456",
                userImg: ""
            },
            {
                username: "test",
                password: "123456",
                userImg: ""
            }
        ],
	}),
    
    // ===== 计算属性（Getters）=====
    getters: {
    	/**
         * 获取当前登录用户的用户名
         * @param {Object} state - 当前状态对象
         * @returns {String|null} 用户名或null
         */
        getUsername: (state) => {
            return state.userInfo.username || null;
        },
    },
    
    // ===== 异步操作方法（Actions）=====
    actions: {
    	/**
         * 用户登录操作
         * 调用登录API，成功后更新用户状态和令牌
         * @param {String} username 用户名
         * @param {String} password 密码
         * @param {String} userImg 用户头像URL
         * @returns {Promise} 登录结果Promise
         */
        async login(username, password, userImg) {
        	try {
        		// 调用登录API
        		const res = await userApi.login(username, password);
        		
                if(res.code == 200) {
                	// 登录成功，更新状态
                	this.token = res.data.token;  // 保存认证令牌
                    this.userInfo = {             // 保存用户信息
                        username: username,
                        userImg: userImg,
                    };
                    this.isLogin = true;          // 设置登录状态为true
                    return Promise.resolve(res);  // 返回成功结果
                } else {
                	// 登录失败，返回错误信息
                	return Promise.reject(new Error(res.msg || "登录失败"));
                }
        	}catch(err) {
        		// 捕获异常并返回
        		return Promise.reject(err);
        	}
        },
        
        /**
         * 获取用户详细信息
         * 从服务器获取当前用户的完整信息
         * @returns {Promise} 获取结果Promise
         */
        async getUserInfo() {
        	try {
        		// 调用获取用户信息API
        		const res = await userApi.getUserInfo();
        		
                if(res.code == 200) {
                	// 成功获取，更新用户信息
                	this.userInfo = res.data;
                    return Promise.resolve(res);
                } else {
                	// 获取失败，返回错误信息
                	return Promise.reject(new Error(res.msg || "获取用户信息失败"));
                }
        	}catch(err) {
        		// 捕获异常并返回
        		return Promise.reject(err);
        	}
        },
        
        /**
         * 用户登出操作
         * 调用登出API并清除本地用户状态
         * @returns {Promise} 登出结果Promise
         */
        async logout() {
        	try {
        		// 调用登出API
        		const res = await userApi.logout();
        		
                if(res.code == 200) {
                	// 登出成功，清除所有用户状态
                	this.userInfo = {};           // 清空用户信息
                    this.isLogin = false;        // 设置登录状态为false
                    this.token = null;           // 清除认证令牌
                    return Promise.resolve(res); // 返回成功结果
                } else {
                	// 登出失败，返回错误信息
                	return Promise.reject(new Error(res.msg || "登出失败"));
                }
        	}catch(err) {
        		// 捕获异常并返回
        		return Promise.reject(err);
        	}
        }
    },

    // ===== 状态持久化配置 =====
    // 使用 pinia-plugin-persistedstate 插件实现状态持久化
    persist: {
        enabled: true,        // 启用持久化功能
        strategies: [
            {
                key: "user-info",                           // localStorage 中的存储键名
                storage: localStorage,                       // 使用 localStorage 作为存储方式
                paths: ["userInfo", "isLogin", "token"],   // 需要持久化的状态字段
            },
        ],
    }
})