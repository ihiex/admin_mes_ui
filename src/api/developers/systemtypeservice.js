import request, { BaseUrl } from '@/utils/request'

/**
   * 系统分页查询
   * @param {查询条件} data
   */
export function getSystemTypeListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的系统
   */
export function getAllSystemTypeList() {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/GetAllEnable',
    method: 'get',
  })
}
/**
   * 新增或修改保存系统
   * @param data
   */
export function saveSystemType(data, url) {
  return request({
    url: `${BaseUrl.api}/api/Security/${url}`,
    method: 'post',
    data: data,
  })
}
/**
   * 获取系统详情
   * @param {Id} 系统Id
   */
export function getSystemTypeDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setSystemTypeEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftSystemType(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteSystemType(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'SystemType/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

