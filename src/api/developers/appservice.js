import request, { BaseUrl } from '@/utils/request'

/**
   * 应用分页查询
   * @param {查询条件} data
   */
export function getAPPListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的应用
   */
export function getAllAPPList() {
  return request({
    url: BaseUrl.api + '/api/Security/APP/GetAllEnable',
    method: 'get',
  })
}
/**
   * 新增或修改保存应用
   * @param data
   */
export function saveAPP(data, url) {
  return request({
    url: BaseUrl.api + "/api/Security/" + url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取应用详情
   * @param {Id} 应用Id
   */
export function getAPPDetail(id) {
  return request({
    url: BaseUrl.api + "/api/Security/" + 'APP/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setAPPEnable(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftAPP(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteAPP(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}
/**
 * 重置应用密钥
 * @param {id} data
 */
export function resetAppSecret(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/ResetAppSecret',
    method: 'get',
    params: data,
  })
}

/**
 * 重置消息加密密钥
 * @param {id} data
 */
export function resetEncodingAESKey(data) {
  return request({
    url: BaseUrl.api + '/api/Security/APP/ResetEncodingAESKey',
    method: 'get',
    params: data,
  })
}
