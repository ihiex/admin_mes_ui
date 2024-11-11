import Vue from 'vue'
import axios from 'axios'
import {
  contentType,
  invalidCode,
  noPermissionCode,
  requestTimeout,
  loginInterception,
  recordRoute,
  multiServer,
  tokenTableName,
  emailServerConfig
} from '@/config'
import store from '@/store'
import qs from 'qs'
import router from '@/router'
import { Loading, Message, MessageBox } from 'element-ui';


let loadingInstance

/**
 * @author Jason.zou 305043598@qq.com
 * @description 处理code异常
 * @param {*} code
 * @param {*} msg
 */
let handleCode = (code, msg, ResData) => {
  // if(store.getters['user/isPublic']) return;
  let fullPath = router.history.current.fullPath
  switch (code) {
    case invalidCode:
      Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
      store.dispatch('user/resetAccessToken')
      if (loginInterception) {
        location.reload()
      }
      break
    case noPermissionCode:
      router.push({ path: '/401' })
      break;
    case "40004":
      Vue.prototype.$baseMessage(msg || `错误码${code}`, 'info')
      store.dispatch('user/resetAccessToken')
      if (recordRoute && !store.getters['user/isPublicPage']) {
        router.push({ path: `/login?redirect=${fullPath}` })
      } else {
        // router.push({ path: '/403' })
        router.push({ path: '/login' })
      }
      break;
    case "40005":
    case "0": // 成功退出  token超时 自动刷新
      //token超时 自动刷新
      store.dispatch('user/resetToken').then((res) => {
        location.reload()
      })
      break;
    case "40006":
      //不合法的凭证类型
      Vue.prototype.$baseMessage(msg || `错误码${code}`, 'info')
      router.push({ path: '/403' })
      break;
    case "40000":
    case "40008": //用户未登录 或超时
      MessageBox.confirm('登录状态已过期，您可以继续留在该页面，或者重新登录', '系统提示', {
        confirmButtonText: '重新登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((res) => {
        store.dispatch('user/resetToken').then((res) => {
          location.reload()
        })
      })
      break;
    default:
      if (!code && !msg && !ResData) {
        Vue.prototype.$baseMessage(`接口没有任务数据返回`, 'error')
        return Promise.resolve({})
      } else {
        Vue.prototype.$baseMessage(msg || `后端接口${code}异常`, 'error')
        //处理多服务器刷新问题
        // if (sessionStorage.getItem('AsyncPath') === '/MultiServerDashboardPage') {
        //   sessionStorage.removeItem(tokenTableName)
        //   location.reload()
        // }
      }
      break
  }
}

let instance = axios.create({
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
    sign: false,
  },
})

let handleReplace = (url) => {
  let key = url.slice(0, url.split('/')[1].length + 1);
  switch (key) {
    case '/api':
      return url.replace('/api', process.env.VUE_APP_BASE_URL)
    default:
      let serveKeys = { ...multiServer, ...emailServerConfig?.serve }
      return url.replace(key, serveKeys[key])
  }
}

instance.interceptors.request.use(
  (config) => {
    config.headers['Accept-Language'] = localStorage.getItem('language') ? localStorage.getItem('language') : 'CN'
    config.headers['line-id'] = store.getters['stationSet/currentLine'] ? store.getters['stationSet/currentLine'].ID : ''
    config.headers['line-name'] = encodeURIComponent(store.getters['stationSet/currentLine'] ? store.getters['stationSet/currentLine'].Description : '')
    config.headers['station-id'] = store.getters['stationSet/currentStation'] ? store.getters['stationSet/currentStation'].ID : ''
    config.headers['station-name'] = encodeURIComponent(store.getters['stationSet/currentStation'] ? store.getters['stationSet/currentStation'].Description : '')
    config.headers['employee-id'] = store.getters['user/userId']// ? store.getters['stationSet/currentStation'].ID : ''
    config.headers['current-login-ip'] = store.getters['user/currentLoginIp']// ? store.getters['stationSet/currentStation'].ID : '' current-login-ip
    config.headers['page-uuid'] = store.getters['pages/pageUuid']
    if (process.env.NODE_ENV === 'production') {
      config.url = handleReplace(config.url)
    }
    if (config.url.includes('/api/Login/GetCheckUser') || config.url.includes('/api/Login/GetCheckUserMES')) {
      config.headers['Authorization'] = store.getters['user/temporaryToken']
    } else {
      config.headers['Authorization'] = store.getters['user/accessToken']//getAccessToken()
    }
    if (
      config.data &&
      config.headers['Content-Type'] ===
      'application/x-www-form-urlencoded;charset=UTF-8'
    ) {
      config.data = qs.stringify(config.data)
    }

    if (config.isShowLoading) {
      loadingInstance = Vue.prototype.$baseLoading()
    }

    return config
  },
  (error) => {
    loadingInstance?.close()
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    loadingInstance?.close()
    let { data, config } = response
    let { ResultCode, ResultMsg, Success, ResData } = data
    if (Success && ResultCode === '0') {
      if (config.isShowSuccess) {
        Message({
          message: data.ResultMsg,
          duration: 3000,
          type: 'success',
          showClose: true,
        })
      }
      //续时
      if (!ResData && ResultMsg == '成功退出') {
        if (store.dispatch('user/resetToken')) {
          location.reload()
          return
        }
      }
    } else {
      if (!config.isShowError) {
        handleCode(ResultCode, ResultMsg, ResData)
      }
    }
    return Promise.resolve(data)
  },
  (error) => {
    loadingInstance?.close()
    let { response, message } = error
    if (error.response && error.response.data) {
      let { status, data } = response
      handleCode(status, data.msg || message)
      return Promise.reject(error)
    } else {
      let { message } = error
      if (message === 'Network Error') {
        message = '后端接口连接异常'
      }
      if (message.includes('timeout')) {
        message = '后端接口请求超时'
      }
      if (message.includes('Request failed with status code')) {
        let code = message.substr(message.length - 3)
        message = '后端接口' + code + '异常'
      }
      Vue.prototype.$baseMessage(message || `后端接口未知异常`, 'error')
      return Promise.reject(error)
    }
  }
)

export default instance

export const BaseUrl = {
  api: '/api',
  mock: 'vab-mock-server'
}
