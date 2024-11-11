/**
 * @author
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { getUserInfo, login, logout, loginNoKey, getToken } from '@/api/user'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import router from '@/router/index.js'
import { title, tokenName, appSecret, appId, tokenGrantType } from '@/config'
import { getUserShift, getShift } from '@/utils'
import { getUsableMenuFullPath } from 'cosmo-routes'
import i18n from '@/language'
import store from '../index'
import { refreshToken, GetScreenshotIP } from '@/api/basebasic'
import { Message } from 'element-ui';
import { decryptedData } from '@/utils/encrypt.js'

let state = () => ({
  accessToken: getAccessToken(),
  username: '',
  userId: sessionStorage.getItem('userId'),
  userInfo: null,
  avatar: '@/assets/images/15922_100.gif', //头像url
  permissions: [],
  isAutoLogin: false,
  temporaryToken: '',
  roles: [],
  modulePermissions: [],
  isPublicPage: sessionStorage.getItem('isPublicPage') ? JSON.parse(sessionStorage.getItem('isPublicPage')) : false,
  asyncPath: sessionStorage.getItem('AsyncPath') ?? '/',
  userType: sessionStorage.getItem('userType'),
  // flag: false,
  currentLoginIp: sessionStorage.getItem('currentLoginIp') ?? '',
  userShiftTable: {},
  MenusRouter: [],
  PermissionsRouter: []
})
let getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  avatar: (state) => state.avatar,
  permissions: (state) => state.permissions,
  isAutoLogin: (state) => state.isAutoLogin,
  temporaryToken: state => state.temporaryToken,
  userInfo: state => state.userInfo,
  roles: state => state.roles,
  modulePermissions: state => state.modulePermissions,
  isPublicPage: state => state.isPublicPage,
  asyncPath: state => state.asyncPath,
  userId: state => state.userId,
  userType: state => state.userType,
  currentLoginIp: state => state.currentLoginIp,
  shiftTable: state => state.userShiftTable,
  userShiftTable: state => {
    return getUserShift(state.userShiftTable)
  },
  getShift: state => getShift(state.userShiftTable),
  MenusRouter: state => state.MenusRouter,
  PermissionsRouter: state => state.PermissionsRouter
}
let mutations = {
  setPermissionsRouter(state, data) {
    state.PermissionsRouter = [...data];
  },
  setMenusRouter(state, data) {
    Object.assign(state.MenusRouter, data)
  },
  setUserShiftTable(state, data) {
    Object.assign(state.userShiftTable, data)
  },
  setCurrentLoginIp(state, ip) {
    state.currentLoginIp = ip
    sessionStorage.setItem('currentLoginIp', ip)
  },
  setUserType(state, val) {
    sessionStorage.setItem('userType', val)
    state.userType = val
  },
  setUserId(state, userId) {
    sessionStorage.setItem('userId', userId)
    state.userId = userId
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setIsAutoLogin(state, flag) {
    state.isAutoLogin = flag
  },
  setTemporaryToken(state, token) {
    state.temporaryToken = token
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  setModulePermissions(state, permissions) {
    state.modulePermissions = permissions
  },
  setIsPublicPage(state, bool) {
    state.isPublicPage = bool
  },
  setAsyncPath(state, path) {
    sessionStorage.setItem('AsyncPath', path)
    state.asyncPath = path
  }
}
let actions = {
  setUserShiftTable({ commit }, data) {
    commit('setUserShiftTable', data)
  },
  setCurrentLoginIp({ commit }, ip) {
    commit('setCurrentLoginIp', ip)
  },
  setAsyncPath({ commit }, path) {
    commit('setAsyncPath', path)
  },
  setIsPublicPage({ commit }, bool) {
    commit('setIsPublicPage', bool)
  },
  setUserInfo({ commit }, userInfo) {
    commit('setUserInfo', userInfo)
  },
  setTemporaryToken({ commit }, accessToken) {
    commit('setTemporaryToken', accessToken)
  },
  setIsAutoLogin({ commit }, flag) {
    commit('setIsAutoLogin', flag)
  },
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  login({ commit, state, dispatch }, userInfo) {
    return new Promise(async (resolve, reject) => {
      let { ResData, ResultMsg } = await login(userInfo)
      if (!ResData) {
        getToken({
          grant_type: tokenGrantType,
          appid: appId,
          secret: appSecret,
        }).then((res) => {
          if (res.Success) {
            commit('setTemporaryToken', `Bearer ${res.ResData.AccessToken}`);
          }
        })
        return reject(new Error(ResultMsg))
      }
      let accessToken = `Bearer ${ResData[tokenName]}`;
      if (accessToken && ResData[tokenName]) {
        commit('setTemporaryToken', '');
        commit('setUserId', ResData.UserId)
        commit('setAccessToken', accessToken);
        let hour = new Date().getHours()
        let thisTime =
          hour < 8
            ? i18n.t('goodMorning1')
            : hour <= 11
              ? i18n.t('goodMorning2')
              : hour <= 13
                ? i18n.t('goodAfternoon1')
                : hour < 18
                  ? i18n.t('goodAfternoon2')
                  : i18n.t('goodEvening')
        Vue.prototype.$baseNotify(`${i18n.t('WelcomeToLogOn')}${title}`, `${thisTime}!`)

        //处理生产用户并跳转已配置好的url
        let { UserType, APPURL, CurrentLoginIP } = ResData
        commit('setCurrentLoginIp', CurrentLoginIP)

        commit('setUserType', UserType)
        if (UserType === '2' && APPURL) {
          commit('setAsyncPath', APPURL)
          return resolve({ ResData, Success: true, APPURL })
        } else if (UserType == '2' && APPURL == "") {
          Message.warning(`${i18n.t('ConfigureTheCorrespondingPage')}...`)
          dispatch('resetAccessToken')
          router.push({ path: '/login' }, () => { })
        }
        resolve({ ResData, Success: true })
      } else {
        Vue.prototype.$baseMessage(
          `${i18n.t('TheLoginInterfaceIsAbnormal')}${tokenName}...`,
          'error'
        )
        return reject(new Error(ResultMsg))
      }
    })
  },
  loginNoKey({ commit, state }, obj) {
    return new Promise(async (resolve, reject) => {
      let { ResData, ResultMsg, Success } = await loginNoKey(obj.userInfo, obj.api)
      if (!Success) {
        return reject(new Error(ResultMsg))
      }
      let accessToken = `Bearer ${ResData[tokenName]}`;
      if (accessToken && ResData[tokenName]) {

        commit('setTemporaryToken', '');
        commit('setUserId', ResData.UserId)
        commit('setAccessToken', accessToken);
        commit('setUserType', ResData.UserType)
        commit('setCurrentLoginIp', ResData.CurrentLoginIP)

        return resolve({ ResData, Success: true })
      } else {
        Vue.prototype.$baseMessage(
          `${i18n.t('TheLoginInterfaceIsAbnormal')}${tokenName}...`,
          'error'
        )
        return reject(new Error(ResultMsg))
      }
    })
  },

  async getUserInfo({ commit, state }, api) {
    getScreenshot()

    let { ResData, Success, ResultCode } = await getUserInfo(api)
    if (!ResData && !Success) {
      Vue.prototype.$baseMessage(i18n.t('AuthenticationFailedPleaseLoginAgain'), 'error')
      return false
    } else {
      commit('setUserInfo', ResData)
    }
    let { Name, /* avatar, */MenusRouter, Modules, Role, UserType, APPURL, IsAdmin, UserId, CurrentLoginIP, DN_Shift } = ResData

    if (!DN_Shift) {
      Vue.prototype.$baseMessage(i18n.t('loseShiftMsg'), 'error')
      //使用默认
      commit('setUserShiftTable', {
        D: {
          end: 20,
          start: 8,
          isSpan: false,
          s_end: '20:00:00',
          s_start: '08:00:00'
        },
        N: {
          end: 8,
          start: 20,
          isSpan: true,
          s_end: '08:00:00',
          s_start: '20:00:00'
        }
      })
    } else {
      let obj = {}
      DN_Shift.forEach(item => {
        let e = item.ShiftEnd.split(/\s/g)[1];
        let s = item.ShiftStart.split(/\s/g)[1];
        let start = parseFloat(s.split(':')[0]) + parseFloat(s.split(':')[1]) / 60 + parseFloat(s.split(':')[2]) / 60 / 60;
        let end = parseFloat(e.split(':')[0]) + parseFloat(e.split(':')[1]) / 60 + parseFloat(e.split(':')[2]) / 60 / 60
        obj[item.Shift] = {
          end: end,
          start: start,
          isSpan: start > end,
          s_end: e,
          s_start: s
        }
      })
      //如果后面没传则使用默认班次
      if (JSON.stringify(obj) == '{}') {
        obj = {
          D: {
            end: 20,
            start: 8,
            isSpan: false,
            s_end: '20:00:00',
            s_start: '08:00:00'
          },
          N: {
            end: 8,
            start: 20,
            isSpan: true,
            s_end: '08:00:00',
            s_start: '20:00:00'
          }
        }
      }
      commit('setUserShiftTable', obj)
    }

    if (GlobalConfig.isReportServer) {
      let index = MenusRouter.findIndex(item => ['/configManagement'].includes(item.path))
      if (index >= 0) {
        MenusRouter.splice(index, 1)
      }
    }

    if (Name && Array.isArray(MenusRouter) && Role && Array.isArray(Modules)) {

      commit('setCurrentLoginIp', CurrentLoginIP)
      commit('setUserId', UserId)
      commit('setUsername', Name)
      //添加模块(按钮)权限
      commit('setModulePermissions', Modules ? Modules : [])
      //角色
      commit('SET_ROLES', Role.slice(0, Role.length - 1).split(','))
      commit('setPermissions', state.roles) //已登录状态
      // commit('setAvatar', avatar) //头像url
      //默认第一显示页
      let permissionsRouter = getUsableMenuFullPath(MenusRouter).list
      commit('setPermissionsRouter', permissionsRouter)
      let firstPath = permissionsRouter ? permissionsRouter[0] : '/';
      if (firstPath === '/') {
        firstPath = permissionsRouter[1] ? permissionsRouter[1] : '/login'
      }
      commit('setAsyncPath', firstPath)

      //跨模块使用commit调用 会出现格式化报错现象，但也可以调用到
      // commit('routes/setRoutes', MenusRouter)
      store.dispatch('routes/setRoutes', MenusRouter)

      if (state.isPublicPage) {
        commit('setAsyncPath', location.href.split('#').pop())
      } else {
        //处理生产用户并记录已配置的url
        if (UserType === '2' && APPURL) {
          commit('setAsyncPath', APPURL)
        }
      }
      return MenusRouter
    } else {
      Vue.prototype.$baseMessage(i18n.t('TheUserInformationInterfaceIsAbnormal'), 'error')
      return false
    }
  },
  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    // await resetRouter()
  },
  // 刷新 token
  async resetToken({ commit, state }) {
    let bool = false;
    const params = {
      'token': state.accessToken.substring(state.accessToken.indexOf(' ') + 1)
    }

    let res = await refreshToken(params)
    const data = res.ResData
    if (res.Success) {
      commit('setAccessToken', `Bearer ${data.AccessToken}`);
      bool = true
    }
    return bool
  },
  resetAccessToken({ commit, state }) {
    commit('setPermissions', [])
    commit('setAccessToken', '')
    removeAccessToken()
  },
}

function getScreenshot() {
  GetScreenshotIP().then(res => {
    if (res.Success) {
      Vue.prototype.$imgBaseUrl = `http://${res.ResData}`
    } else {
      Vue.prototype.$imgBaseUrl = `${process.env.VUE_APP_BASE_URL}/FTP_Screenshot`
    }
  })
}

export default { state, getters, mutations, actions }
