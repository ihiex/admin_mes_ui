/**
 * @author Jason.zou 305043598@qq.com
 * @description 工站状态管理
 */

let state = () => ({
  lineDesc: sessionStorage.getItem('lineDesc') ?? '--',
  stationDesc: sessionStorage.getItem('stationDesc') ?? '--',
  announcement: sessionStorage.getItem('announcement') && sessionStorage.getItem('announcement') != 'undefined' ? JSON.parse(sessionStorage.getItem('announcement')) : [],
  currentLine: sessionStorage.getItem('CurrentLine') && sessionStorage.getItem('CurrentLine') != 'undefined' ? JSON.parse(sessionStorage.getItem('CurrentLine')) : {},
  currentStation: sessionStorage.getItem('CurrentStation') && sessionStorage.getItem('CurrentStation') != 'undefined' ? JSON.parse(sessionStorage.getItem('CurrentStation')) : {},
  activeConfigManage: localStorage.getItem('ActiveConfigManage') && localStorage.getItem('ActiveConfigManage') != 'undefined' ? JSON.parse(localStorage.getItem('ActiveConfigManage')) : {}
})
let getters = {
  lineDesc: state => state.lineDesc,
  stationDesc: state => state.stationDesc,
  announcement: state => state.announcement,
  currentLine: state => state.currentLine,
  currentStation: state => state.currentStation,
  activeConfigManage: state => state.activeConfigManage
}

let mutations = {
  setLineDesc(state, val) {
    sessionStorage.setItem('lineDesc', val)
    state.lineDesc = val
  },
  setStationDesc(state, val) {
    sessionStorage.setItem('stationDesc', val)
    state.stationDesc = val
  },
  setAnnouncement(state, list) {
    sessionStorage.setItem('announcement', JSON.stringify(list))
    state.announcement = list
  },
  setCurrentLine(state, data) {
    state.currentLine = data
    sessionStorage.setItem('CurrentLine', JSON.stringify(data))
  },
  setCurrentStation(state, data) {
    state.currentStation = data
    sessionStorage.setItem('CurrentStation', JSON.stringify(data))
  },
  setActiveConfigManage(state, data) {
    state.activeConfigManage = data;
    localStorage.setItem('ActiveConfigManage', JSON.stringify(data))
  }
}
let actions = {
  setLineDesc({ commit }, val) {
    commit('setLineDesc', val)
  },
  setStationDesc({ commit }, val) {
    commit('setStationDesc', val)
  },
  setAnnouncement({ commit }, list) {
    commit('setAnnouncement', list)
  },
  setCurrentLine({ commit }, data) {
    commit('setCurrentLine', data)
  },
  setCurrentStation({ commit }, data) {
    commit('setCurrentStation', data)
  },
  setActiveConfigManage({ commit }, data) {
    commit('setActiveConfigManage', data)
  }
}
export default { state, getters, mutations, actions }
