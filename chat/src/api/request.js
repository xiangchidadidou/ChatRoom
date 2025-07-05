/**
 * HTTP 请求配置文件
 * 基于 axios 封装的 HTTP 请求库，包含请求/响应拦截器、错误处理等功能
 * 提供统一的 API 请求接口和认证机制
 */

import axios from 'axios'

/**
 * 创建 axios 实例
 * 配置基础的请求参数和默认设置
 */
const request = axios.create({
    baseURL: '/api',                                    // API 基础路径
    timeout: 5000,                                     // 请求超时时间（5秒）
    headers: {
        'Content-Type': 'application/json;charset=utf-8'  // 默认请求头
    }
})

/**
 * 请求拦截器
 * 在发送请求前自动添加认证令牌等处理
 */
request.interceptors.request.use(
    config => {
        // 从 localStorage 获取认证令牌
        const token = localStorage.getItem('token')
        if (token) {
            // 如果存在令牌，添加到请求头中
            config.headers['Authorization'] = 'Bearer ' + token
        }
        return config
    },
    error => {
        // 请求配置错误处理
        console.log('请求拦截器错误', error)
        return Promise.reject(error) // 错误返回，后续可通过 catch 获取错误信息
    }
)

/**
 * 响应拦截器
 * 统一处理响应数据和错误状态
 */
request.interceptors.response.use(
    response => {
        const res = response.data
        
        // 检查业务状态码
        if (res.code !== 200) {
            // 处理认证失效的情况
            if (res.code === 401) {
                localStorage.removeItem('token')  // 清除无效令牌
                window.location.href = '/login'   // 重定向到登录页
            }
            // 返回业务错误
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            // 请求成功，返回数据
            return res
        }
    },
    error => {
        // HTTP 错误处理（网络错误、服务器错误等）
        console.log('响应拦截器错误', error)
        return Promise.reject(error)
    }
)

/**
 * 封装 GET 请求方法
 * 用于获取数据的 HTTP GET 请求
 * @param {String} url 请求地址（相对于 baseURL）
 * @param {Object} params 查询参数对象，会被转换为 URL 查询字符串
 * @returns {Promise} 返回 Promise 对象，包含响应数据
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        request.get(url, {
            params: params  // 查询参数会自动拼接到 URL 后面
        }).then(response => {
            resolve(response)  // 请求成功，返回响应数据
        }).catch(error => {
            reject(error)      // 请求失败，返回错误信息
        })
    })
}

/**
 * 封装 POST 请求方法
 * 用于提交数据的 HTTP POST 请求
 * @param {String} url 请求地址（相对于 baseURL）
 * @param {Object} data 请求体数据，会被序列化为 JSON 格式
 * @returns {Promise} 返回 Promise 对象，包含响应数据
 */
export function post(url, data = {}) {
    return new Promise((resolve, reject) => {
        request.post(url, data).then(response => {
            resolve(response)  // 请求成功，返回响应数据
        }).catch(error => {
            reject(error)      // 请求失败，返回错误信息
        })
    })
}