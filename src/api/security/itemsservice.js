import request, { BaseUrl } from '@/utils/request'

/**
   * 获取功能菜单
   * @param {查询条件} data
   */
export function getAllItemsTreeTable() {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/GetAllItemsTreeTable',
    method: 'get',
  })
}
/**
   * 新增或修改保存
   * @param data
   */
export function saveItems(data, url) {
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
export function getItemsDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setItemsEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftItems(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteItems(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

/**
   * 查询所有可用的
   * @param {查询条件} data
   */
export function getItemsAllEnable() {
  return request.request({
    url: `${BaseUrl.api}/api/Security/` + 'Items/GetAllEnable',
    method: 'get',
  })
}

/**
   * 获取功能菜单
   * @param {查询条件} data
   */
export function getItemsDetailListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/GetAllItemsDetailTreeTable',
    method: 'get',
    params: data,
  })
}
/**
   * 新增或修改保存
   * @param data
   */
export function saveItemsDetail(data, url) {
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
export function getItemsDetailDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setItemsDetailEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftItemsDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteItemsDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

/**
   * 查询所有可用的
   * @param {查询条件} data
   */
export function getItemsDetailAllEnable() {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/GetAllEnable',
    method: 'get',
  })
}
/**
 * 根据子系统查询所有功能
 * @param {} data
 */
export function getAllItemsDetailTreeTable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'ItemsDetail/GetAllItemsDetailTreeTable',
    method: 'get',
    params: data,
  })
}
