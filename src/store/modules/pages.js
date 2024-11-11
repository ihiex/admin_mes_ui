/**
 * @author Jason.zou 305043598@qq.com
 * @description 页面相关状态
 */

import { getUuid } from '@/utils'

let state = () => ({
    pageUuid: sessionStorage.getItem('pageUuid'),
})
let getters = {
    pageUuid: (state) => {
        if (state.pageUuid) {
            return state.pageUuid
        } else {
            let uuid = getUuid();
            sessionStorage.setItem('pageUuid', uuid)
            state.pageUuid = uuid
            return uuid
        }
    }
}
let mutations = {
    setPageUuid(state, uuid) {
        state.currentLoginIp = uuid
        sessionStorage.setItem('pageUuid', uuid)
    },
}
let actions = {
    setPageUuid({ commit }, uuid) {
        commit('setPageUuid', uuid)
    },
}

export default { state, getters, mutations, actions }
