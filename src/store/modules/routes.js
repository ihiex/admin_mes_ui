/**
 * @author Jason.zou 305043598@qq.com
 * @description 路由拦截状态管理，目前两种模式：all模式与intelligence模式，其中partialRoutes是菜单暂未使用
 */
import { asyncRoutes, constantRoutes } from '@/router/index.js'
import { convertRouter, FilterMenus } from 'cosmo-routes'

let state = () => ({
  routes: [],
  partialRoutes: [],
})
let getters = {
  routes: (state) => state.routes,
  partialRoutes: (state) => state.partialRoutes,
}
let mutations = {
  setRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setAllRoutes(state, routes) {
    state.routes = constantRoutes.concat(routes)
  },
  setPartialRoutes(state, routes) {
    state.partialRoutes = constantRoutes.concat(routes)
  },
}
let actions = {
  async setRoutes({ commit }, menuRouter) {
    // 过滤router.js
    let finallyAsyncRoutes = FilterMenus(
      asyncRoutes,
      menuRouter
    )
    commit('setRoutes', finallyAsyncRoutes)
    return finallyAsyncRoutes
  },
  //由后台控制路由 未起用 设 authentication= 'all' 起用
  async setAllRoutes({ commit, rootGetters }) {
    // let { data } = await getRouterList()
    let accessRoutes = convertRouter(rootGetters['user/MenusRouter'])
    commit('setAllRoutes', accessRoutes)
    return accessRoutes
  },
  setPartialRoutes({ commit }, accessRoutes) {
    commit('setPartialRoutes', accessRoutes)
    return accessRoutes
  },
}
export default { state, getters, mutations, actions }
