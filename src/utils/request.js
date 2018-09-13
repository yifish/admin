import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken, removeToken } from '@/utils/auth'
import qs from 'qs'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_URL + process.env.API_BASE_URL, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['TOKEN'] = getToken()
  }
  for (const key in config.params) { // 去除对象内多余的空值key(get用)
    if (config.params[key] === '') {
      delete config.params[key]
    }
  }
  for (const key in config.data) { // 去除对象内多余的空值key(post用)
    if (config.data[key] === '') {
      delete config.data[key]
    }
  }
  if (config.fileUpload) {
    config.headers['Content-Type'] = 'application/form-data' // 请求头部
  } else {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    config.data = qs.stringify(config.data)
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== 200) {
      if (res.code === 109) {
        Message({
          message: '请重新登录',
          type: 'error',
          duration: 2 * 1000
        })
        store.commit('SET_PERMISSION_ROLES', [])
        removeToken()
        setTimeout(() => {
          window.isGetOut = true
          location.href = '/#/login'
        }, 1000)
      } else {
        // 暂时关闭错误提示！！！！！！！！！！
        Message({
          message: res.message,
          type: 'error',
          duration: 2 * 1000
        })
      }
      return false
    } else {
      return response.data
    }
  },
  error => {
    // console.log('err' + error)// for debug
    if (error.response.status === 422) {
      Message({
        message: error.response.data.message,
        type: 'error',
        duration: 2 * 1000
      })
      return false
    }
    Message({
      message: '服务器异常，请稍后再试',
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
