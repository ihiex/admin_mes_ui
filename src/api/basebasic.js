import request, { BaseUrl } from '@/utils/request'
import setting from '@/config'
/**
 * 获取token
 * @param query
 */
export function getToken(query) {
  var data = {
    'grant_type': setting.tokenGrantType,
    'appid': setting.appId,
    'secret': setting.appSecret
  }
  return http({
    url: `${BaseUrl.api}/api/` + 'Token',
    method: 'get',
    params: query ? query : data,
  })
}
/**
 *刷新token
 * @param {*} data
 */
export function refreshToken(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Token/RefreshToken',
    method: 'get',
    params: data,
  })
}
/**
 * 获取系统基础设置信息
 */
export function getSysSetting() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/SysSetting/GetInfo',
    method: 'get',
  })
}

/**
 * 获取系统基础设置信息
 */
export function getAllSysSetting() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/SysSetting/GetAllInfo',
    method: 'get',
  })
}
/**
 * 获取系统信息
 */
export async function getSysInfo() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/SysSetting/GetSysInfo',
    method: 'get',
    timeout: 0,
  })
}
export function saveSysSetting(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/SysSetting/Save',
    method: 'post',
    data: data,
  })
}
/**
 * 获取所有子系统
 */
export function getSubSystemList() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/SystemType/GetSubSystemList',
    method: 'get',
  })
}
/**
   * 登录
   * @param {*} data
   */
export async function login(data) {
  var query = data
  return request({
    url: `${BaseUrl.api}/api/` + 'Login/GetCheckUser',
    method: 'get',
    params: query,
    timeout: 0,
  })
}
/**
 * 获取用户信息
 * @returns
 */
export async function getUserInfo() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Login/GetUserInfo',
    method: 'get',
    timeout: 0,
  })
}
/**
 * 保存修改密码
 * @param data 密码
 * @returns
 */
export function savePassword(data) {
  var query = data
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/User/ModifyPassword',
    method: 'post',
    params: query,
  })
}
/**
 * 清除缓存
 * @returns
 */
export function clearCache() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/User/ClearCache',
    method: 'get',
  })
}
/**
   * 退出登录
   */
export function logout() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Login/Logout',
    method: 'get',
  })
}

/**
   * 系统切换
   * @param ids id集合
   */
export function yuebonConnecSys(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'SystemType/YuebonConnecSys',
    method: 'get',
    params: data,
  })
}
/**
   * 系统切换sso
   * @param ids id集合
   */
export function sysConnect(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Login/SysConnect',
    method: 'get',
    params: data,
  })
}
/**
 * 根据字典编码获取字典内容
 * @param  code 字典编码
 * @returns
 */
export function getListItemDetailsByCode(code) {
  var data = {
    itemCode: code
  }
  return request({
    url: `${BaseUrl.api}/api/` + 'Security/Items/GetListByItemCode',
    method: 'get',
    params: data,
  })
}
/**
 * 根据菜单功能编码查询该页面操作功能
 * @param  code 字典编码
 * @returns
 */
export function getListMeunFuntionBymeunCode(code) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Function/GetListByParentEnCode',
    method: 'get',
    params: { enCode: code },
  })
}

/**
   * 获取微信小程序二维码
   * @param data 查询条件
   */
export function getWxAppletQrCode(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'WeiXin/WxOpen/ContentWxAppletQrCode',
    method: 'post',
    params: data,
  })
}

/**
   * 获取验证码
   * @param data 查询条件
   */
export function getVerifyCode() {
  return request({
    url: `${BaseUrl.api}/api/` + 'Captcha',
    method: 'get',
  })
}

/**
 * 上传文件
 * @returns
 */
export function UploadFile(formData) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Files/Upload',
    method: 'post',
    data: formData,
  })
}

/**
 * 删除文件
 * @returns
 */
export function DeleteFile(data) {
  return request({
    url: `${BaseUrl.api}/api/` + 'Files/DeleteFile',
    method: 'get',
    params: data,
  })
}

/* 根据id获取上传文件 */
export function GetUploadFileById(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/UploadFile/GetById`,
    method: 'get',
    params
  })
}

/* 获取所有上传文件 */
export function GetAllUploadFile() {
  return request({
    url: `${BaseUrl.api}/api/Security/UploadFile/GetAllEnable`,
    method: 'get',
  })
}


/* 同步 win form 上传 */

/**
 * 上传文件
 * @returns
 */
export function WinUploadFile(formData) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/FileUpload`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data: formData,
  })
}

export function WinUploadFileUrl(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data: data,
  })
}

export function getUploadFileList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/FindWithPagerSearchAsync`,
    method: 'get',
    params: { ...data, 'api-version': '3.0' },
  })
}

export function deleteScreenItem(id) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/Delete`,
    method: 'delete',
    params: { Id: id, 'api-version': '3.0' },
  })
}


export function GetFtpIP() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/GetFtpIP`,
    method: 'post',
    params: { 'api-version': '3.0' },
  })
}

export function GetScreenshotIP() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_Screenshot/GetScreenshotIP`,
    method: 'post',
    params: { 'api-version': '3.0' },
  })
}
