/**
 * 角色权限处理
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    let { value } = binding
    let super_admin = 'administrator'
    let roles = store.getters && store.getters['user/roles']

    if (value && value instanceof Array && value.length > 0) {
      let roleFlag = value

      let hasRole = roles.some(role => {
        return super_admin === role || roleFlag.includes(role)
      })

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置角色权限标签值"`)
    }
  }
}
