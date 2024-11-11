import request, { BaseUrl } from '@/utils/request'

/**
   * 系统分页查询
   * @param {查询条件} data
   */
export function getFilterIPListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的系统
   */
export function getAllFilterIPList() {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/GetAllEnable',
    method: 'get',
  })
}
/**
   * 新增或修改保存系统
   * @param data
   */
export function saveFilterIP(data, url) {
  return request({
    url: BaseUrl.api + "/api/Security/" + url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取系统详情
   * @param {Id} 系统Id
   */
export function getFilterIPDetail(id) {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setFilterIPEnable(data) {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftFilterIP(data) {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/DeleteSoftBatchAsync',
    method: 'post',
    params: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteFilterIP(data) {
  return request({
    url: BaseUrl.api + '/api/Security/FilterIP/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

