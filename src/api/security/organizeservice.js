import request, {BaseUrl} from '@/utils/request'

/**
 * 获取树形组织机构
*/
export function getAllOrganizeTreeTable() {
  return request({
    url: `${BaseUrl.api}/api/Security/Organize/GetAllOrganizeTreeTable`,
    method: 'get',
  })
}
/**
   * 角色分页查询
   * @param {查询条件} data
   */
export function getOrganizeListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Organize/FindWithPagerAsync`,
    method: 'post',
    data: data,
  })
}
/**
   * 新增或修改保存角色
   * @param data
   */
export function saveOrganize(data, url) {
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
export function getOrganizeDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Organize/GetById',
    method: 'get',
    params: { id: id },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setOrganizeEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Organize/SetEnabledMarktBatchAsync',
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftOrganize(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Organize/DeleteSoftBatchAsync',
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteOrganize(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/` + 'Organize/DeleteBatchAsync',
    method: 'delete',
    data: data,
  })
}

