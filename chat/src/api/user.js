/**
 * 用户相关 API 接口封装
 * 提供用户登录、获取信息、登出等功能的 HTTP 接口
 * 所有接口都基于统一的请求配置和错误处理
 */

import { get, post } from './request'

/**
 * 用户登录接口
 * 向服务器发送用户凭据进行身份验证
 * @param {String} username 用户名
 * @param {String} password 用户密码
 * @param {String} userImg 用户头像URL（可选）
 * @returns {Promise} 返回包含登录结果和用户令牌的 Promise
 */
export const login = (username, password, userImg) => {
	return post('/user/login', {
		username,   // 用户名
		password,   // 密码
		userImg     // 头像URL
	})
}

/**
 * 获取当前用户详细信息接口
 * 根据当前用户的认证令牌获取用户完整信息
 * @returns {Promise} 返回包含用户详细信息的 Promise
 */
export const getUserInfo = () => {
	return get('/user/info')
}

/**
 * 用户登出接口
 * 清除服务器端的用户会话状态
 * @returns {Promise} 返回登出操作结果的 Promise
 */
export const logout = () => {
	return post('/user/logout')
}