import store from '@/store'

/**
 * @author Jason.zou 305043598@qq.com
 * @description 检查权限
 * @param value
 * @returns {boolean}
 */
export default function checkPermission(value) {
  if (value && value instanceof Array && value.length > 0) {
    let permissions = store.getters['user/permissions']
    let permissionPermissions = value

    return permissions.some((role) => {
      return permissionPermissions.includes(role)
    })
  } else {
    return false
  }
}


