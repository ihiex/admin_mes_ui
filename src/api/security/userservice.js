import request, {BaseUrl} from '@/utils/request'

/**
   * 用户分页查询
   * @param {查询条件} data
   */
export function getUserListWithPager(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/FindWithPagerSearchAsync`,
    method: 'post',
    data: data,
  })
}
/**
   * 新增或修改保存用户
   * @param data
   */
export function saveUser(data, url) {
  return request({
    url: BaseUrl.api +"/api/Security/" +url,
    method: 'post',
    data: data,
  })
}
/**
   * 获取用户详情
   * @param {Id} 用户Id
   */
export function getUserDetail(id) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/GetById`,
    method: 'get',
    params: { id: id },
  })
}
/**
   * 获取用户详情
   * @param {userName} 用户账号
   */
export function getByUserName(userName) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/GetByUserName`,
    method: 'get',
    params: { userName: userName },
  })
}
/**
   * 批量设置启用状态
   * @param {id集合} ids
   */
export function setUserEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/SetEnabledMarktBatchAsync`,
    method: 'post',
    data: data,
  })
}
/**
   * 批量软删除
   * @param {id集合} ids
   */
export function deleteSoftUser(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/DeleteSoftBatchAsync`,
    method: 'post',
    data: data,
  })
}

/**
   * 批量删除
   * @param {id集合} ids
   */
export function deleteUser(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/DeleteBatchAsync`,
    method: 'delete',
    data: data,
  })
}

/**
   * 重置密码
   * @param {userId:用户id} data
   */
export function resetPassword(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/ResetPassword`,
    method: 'post',
    params: data,
  })
}

/**
   * 修改密码
   * @param {password:新密码,password2:重复新密码} data
   */
export function modifyPassword(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/ModifyPassword`,
    method: 'post',
    params: data,
  })
}

/**
   * 注册新用户
   * @param data
   */
export function registerUser(data, url) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/Register`,
    method: 'post',
    data: data,
  })
}

/**
   * 保存用户主题配置
   * @param data
   */
export function saveThemeConfig(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/User/SaveUserTheme`,
    method: 'post',
    data: data,
  })
}

