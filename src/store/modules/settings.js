/**
 * @author Jason.zou 305043598@qq.com
 * @description 所有全局配置的状态管理，如无必要请勿修改
 */

import defaultSettings from '@/config'
import variables from '@/styles/variables.scss'

let { tabsBar, logo, layout, header, themeBar, themeBarRight } = defaultSettings
let theme =
  JSON.parse(localStorage.getItem('kader-theme')) || ''
let state = () => ({
  tabsBar: theme.tabsBar || tabsBar,
  logo,
  collapse: true,
  layout: theme.layout || layout,
  header: theme.header || header,
  device: 'desktop',
  themeBar: themeBar ? themeBar : true,
  themeColor: theme.themeColor || variables.themeColor,
  themeBarRight
})
let getters = {
  collapse: (state) => state.collapse,
  device: (state) => state.device,
  header: (state) => state.header,
  layout: (state) => state.layout,
  logo: (state) => state.logo,
  tabsBar: (state) => state.tabsBar,
  themeBar: (state) => state.themeBar,
  themeColor: state => state.themeColor,
  themeBarRight: state => state.themeBarRight
}
let mutations = {
  changeLayout: (state, layout) => {
    if (layout) state.layout = layout
  },
  changeHeader: (state, header) => {
    if (header) state.header = header
  },
  changeTabsBar: (state, tabsBar) => {
    if (tabsBar) state.tabsBar = tabsBar
  },
  changeCollapse: (state) => {
    state.collapse = !state.collapse
  },
  foldSideBar: (state) => {
    state.collapse = true
  },
  openSideBar: (state) => {
    state.collapse = false
  },
  toggleDevice: (state, device) => {
    state.device = device
  },
}
let actions = {
  changeLayout({ commit }, layout) {
    commit('changeLayout', layout)
  },
  changeHeader({ commit }, header) {
    commit('changeHeader', header)
  },
  changeTabsBar({ commit }, tabsBar) {
    commit('changeTabsBar', tabsBar)
  },
  changeCollapse({ commit }) {
    commit('changeCollapse')
  },
  foldSideBar({ commit }) {
    commit('foldSideBar')
  },
  openSideBar({ commit }) {
    commit('openSideBar')
  },
  toggleDevice({ commit }, device) {
    commit('toggleDevice', device)
  },
}
export default { state, getters, mutations, actions }
