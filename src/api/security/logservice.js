import request, { BaseUrl } from '@/utils/request'

/**
   * 系统分页查询
   * @param {查询条件} data
   */
export function getLogListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/Log/FindWithPagerSearchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 获取系统详情
   * @param {Id} 系统Id
   */
export function getLogDetail(id) {
  return request({
    url: BaseUrl.api + '/api/Security/Log/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteLog(data) {
  return request({
    url: BaseUrl.api + '/api/Security/Log/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

