/**
 * 操作权限处理
 */

import store from '@/store'

export default {
  inserted(el, binding, vnode) {
    let { value } = binding
    let all_permission = '*'
    let permissions = store.getters && store.getters['user/modulePermissions']
    if (value && value instanceof Array && value.length > 0) {
      let permissionFlag = value
      let hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
