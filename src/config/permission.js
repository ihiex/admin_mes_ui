/**
 * @author Jason.zou 305043598@qq.com
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import router, { asyncRoutes } from '@/router'
import store from '@/store'
import VabProgress from 'nprogress' //加载动画条
import 'nprogress/nprogress.css'
import getPageTitle from '@/utils/pageTitle'
import i18n from '@/language/index.js'
import { findPathObj } from '@/utils'

import {
  authentication,
  loginInterception,
  progressBar,
  recordRoute,
  routesWhiteList,
} from '@/config'

VabProgress.configure({
  easing: 'ease',
  speed: 500,
  trickleSpeed: 200,
  showSpinner: false,
})

router.beforeResolve(async (to, from, next) => {
  document.title = getPageTitle(to.meta.language ? i18n.t(to.meta.language) : to.meta.title)
  if (progressBar) VabProgress.start()
  let hasToken = store.getters['user/accessToken']
  //是否自动开启自动拦截
  if (!loginInterception) hasToken = true
  if (hasToken) {
    if (to.path === '/login') {
      //为公共页面单独开
      if (store.getters['user/isPublicPage']) {
        next()
      } else {
        next(store.getters['user/asyncPath'])
      }
      if (progressBar) VabProgress.done()
    } else {
      //登录状态
      let hasPermissions = Array.isArray(store.getters['user/permissions']) && store.getters['user/permissions'].length > 0
      //未登录或者没拿到路由数据
      if (hasPermissions) {
        let rObj = findPathObj(to.path, router.options.routes)
        //非控制页面
        if (rObj) {
          next()
        } else {
          let isPermission = store.getters['user/PermissionsRouter'].some(res => res === to.fullPath)
          if (isPermission) { //控制页面
            next()
          } else {
            next('/403')
          }
        }
      } else {
        try {
          let menuRouter
          // 是否开启登录拦截
          if (!loginInterception) {
            //settings.js loginInterception为false时，创建虚拟权限
            // await store.dispatch('user/setPermissions', ['administrators'])
            menuRouter = asyncRoutes
          } else {
            menuRouter = await store.dispatch('user/getUserInfo')
          }

          let accessRoutes = []
          //拦截模式
          if (authentication === 'intelligence') {
            accessRoutes = await store.dispatch('routes/setRoutes', menuRouter)
          } else if (authentication === 'all') {
            accessRoutes = await store.dispatch('routes/setAllRoutes')
          }
          router.addRoutes(accessRoutes)

          //添加无首页权限时应跳转到配置的第一个页面
          let pUrl = store.getters['user/PermissionsRouter']
          let pathTo = store.getters['user/asyncPath']
          //注意：在添加菜单时 模块编码的书写方式
          if (pUrl.includes(to.path)) {
            next({ ...to, replace: true })
          } else {
            if (pathTo) {
              next(pathTo)
            } else {
              next('/404')
            }
          }
        } catch {
          await store.dispatch('user/resetAccessToken')
          if (progressBar) VabProgress.done()
        }
      }
    }
  } else {
    if (routesWhiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      if (recordRoute && !store.getters['user/isPublicPage'] && to.path !== '/modifyPasswordResetLogin') {
        //记录之前的url用于重定向
        next(`/login?redirect=${to.path ? to.path : store.getters['user/asyncPath']}`)
      } else {
        next('/login')
      }
      if (progressBar) VabProgress.done()
    }
  }
})
router.afterEach(() => {
  if (progressBar) VabProgress.done()
})
