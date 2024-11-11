import request, { BaseUrl } from '@/utils/request'

/**
   * 分页查询
   * @param {查询条件} data
   */
export function getTaskManagerListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/FindWithPagerAsync',
    method: 'post',
    data: data,
  })
}/**
   * 获取所有可用的
   */
export function getAllTaskManagerList() {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/GetAllEnable',
    method: 'get',
  })
}
/**
   * 新增或修改保存
   * @param data
   */
export function saveTaskManager(data, url) {
  return request({
    url: BaseUrl.api +'/api/Security/'+ url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取详情
   * @param {Id} Id
   */
export function getTaskManagerDetail(id) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setTaskManagerEnable(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftTaskManager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteTaskManager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

/**
 * 启动/暂停
 * @param  data
 */
export function changeStatus(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/ChangeStatus',
    method: 'post',
    data: data,
  })
}

/**
   * 获取本地任务
   */
export function getLocalTaskJobs() {
  return request({
    url: BaseUrl.api + '/api/Security/TaskManager/GetLocalHandlers',
    method: 'get',
  })
}

/**
   * 分页查询
   * @param {查询条件} data
   */
export function getTaskJobLogListWithPager(data) {
  return request({
    url: BaseUrl.api + '/api/Security/TaskJobsLog/FindWithByTaskIdAsync',
    method: 'get',
    params: data,
  })
}
