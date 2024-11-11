/**
 * @author Jason.zou 305043598@qq.com
 * @description 代码生成机状态管理
 */

let state = () => ({
  srcCode: '',
})
let getters = {
  srcTableCode: (state) => state.srcCode,
}

let mutations = {
  setTableCode(state, srcCode) {
    state.srcCode = srcCode
  },
}
let actions = {
  setTableCode({ commit }, srcCode) {
    commit('setTableCode', srcCode)
  },
}
export default { state, getters, mutations, actions }
