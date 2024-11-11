import request, {BaseUrl} from '@/utils/request'

/**
   * 角色分页查询
   * @param {查询条件} data
   */
export function getRoleListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/FindWithPagerAsync`,
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的角色
   */
export function getAllRoleList() {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/GetAllEnable`,
    method: 'get',
  })
}
/**
   * 新增或修改保存角色
   * @param data
   */
export function saveRole(data, url) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取角色详情
   * @param {Id} 角色Id
   */
export function getRoleDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/GetById`,
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setRoleEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/SetEnabledMarktBatchAsync`,
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftRole(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/DeleteSoftBatchAsync`,
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteRole(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Role/DeleteBatchAsync`,
    method: 'delete',
    data: data,
  })
}

/**
 *获取功能菜单树
 * @param {roleId:角色Id} data
 */
export function getAllFunctionTree() {
  return request({
    url: `${BaseUrl.api}/api/Security/RoleAuthorize/GetAllFunctionTree`,
    method: 'get',
  })
}
/**
 *获取功能菜单树
 * @param {roleId:角色Id} data
 */
export function getRoleAuthorizeFunction(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/RoleAuthorize/GetRoleAuthorizeFunction`,
    method: 'get',
    params: data,
  })
}

/**
 *获取角色可以访问数据
 * @param {roleId:角色Id} data
 */
export function getAllRoleDataByRoleId(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/RoleData/GetAllRoleDataByRoleId`,
    method: 'get',
    params: data,
  })
}
/**
 * 保存角色权限
 * @param {} data
 */
export function saveRoleAuthorize(data) {
  return request.request({
    url: `${BaseUrl.api}/api/Security/RoleAuthorize/SaveRoleAuthorize`,
    method: 'post',
    data: data,
    timeout: 0,
  })
}
