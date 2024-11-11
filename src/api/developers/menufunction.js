import request, { BaseUrl } from '@/utils/request'

/**
   * 获取功能菜单
   * @param {查询条件} data
   */
export function getAllMenuTreeTable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/GetAllMenuTreeTable',
    method: 'get',
    params: data,
  })
}
/**
   * 新增或修改保存
   * @param data
   * 
   */
export function saveMenu(data, url) {
  return request({
    url: `${BaseUrl.api}/api/Security/${url}`,
    method: 'post',
    data: data,
  })
}
/**
   * 获取详情
   * @param {Id} Id
   */
export function getMenuDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setMenuEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftMenu(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteMenu(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

/**
   * 查询所有可用的
   * @param {查询条件} data
   */
export function getMenuAllEnable() {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Menu/GetAllEnable',
    method: 'get',
  })
}

/**
   * 获取功能菜单
   * @param {查询条件} data
   */
export function getFunctionListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 新增或修改保存
   * @param data
   * 
   */
export function saveFunction(data, url) {
  return request({
    url: `${BaseUrl.api}/api/Security/${url}`,
    method: 'post',
    data: data,
  })
}
/**
   * 获取详情
   * @param {Id} Id
   */
export function getFunctionDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setFunctionEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftFunction(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteFunction(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

/**
   * 查询所有可用的
   * @param {查询条件} data
   */
export function getFunctionAllEnable() {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/GetAllEnable',
    method: 'get',
  })
}
/**
 * 根据子系统查询所有功能
 * @param {} data
 */
export function getAllFunctionTreeTable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Function/GetAllFunctionTreeTable',
    method: 'get',
    params: data,
  })
}
