/**
 * @author Jason.zou 305043598@qq.com
 * @description 异常捕获的状态拦截，请勿修改
 */

let state = () => ({
  errorLogs: [],
})
let getters = {
  errorLogs: (state) => state.errorLogs,
}
let mutations = {
  addErrorLog(state, errorLog) {
    state.errorLogs.push(errorLog)
  },
  clearErrorLog: (state) => {
    state.errorLogs.splice(0)
  },
}
let actions = {
  addErrorLog({ commit }, errorLog) {
    commit('addErrorLog', errorLog)
  },
  clearErrorLog({ commit }) {
    commit('clearErrorLog')
  },
}
export default { state, getters, mutations, actions }
