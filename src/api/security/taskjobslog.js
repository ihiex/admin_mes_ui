import request, { BaseUrl } from '@/utils/request'

/**
   * 定时任务执行日志分页查询
   * @param {查询条件} data
   */
export function getTaskJobsLogListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的定时任务执行日志
   */
export function getAllTaskJobsLogList() {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/GetAllEnable',
    method: 'get',
  })
}
/**
   * 新增或修改保存定时任务执行日志
   * @param data
   */
export function saveTaskJobsLog(data, url) {
  return request({
    url: BaseUrl.api + "/api/Security/" + url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取定时任务执行日志详情
   * @param {Id} 定时任务执行日志Id
   */
export function getTaskJobsLogDetail(id) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setTaskJobsLogEnable(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftTaskJobsLog(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteTaskJobsLog(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}
