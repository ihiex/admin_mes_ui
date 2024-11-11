import request, { BaseUrl } from '@/utils/request'

/**
   * 创建数据库连接
   */
export function createGetDBConn(data) {
  return request({
    url: BaseUrl.api + '/api/CodeGenerator/CreateDBConn',
    method: 'post',
    data: data,
  })
}
/**
   * 获取数据库
   */
export function codeGetDBList() {
  return request({
    url: BaseUrl.api + '/api/CodeGenerator/GetListDataBase',
    method: 'get',
  })
}
/**
   * 获取数据库表
   */
export function codeGetTableList(data) {
  return request({
    url: BaseUrl.api + '/api/CodeGenerator/FindListTable',
    method: 'post',
    data: data,
  })
}
/**
   * 生成代码
   */
export async function codeGenerator(data) {
  return await request({
    url: BaseUrl.api + '/api/CodeGenerator/Generate',
    method: 'get',
    params: data,
    timeout: 0,
  })
}
/**
 *
* 数据库解密
*/
export function dbtoolsConnStrDecrypt(data) {
  return request({
    url: BaseUrl.api + '/api/DbTools/ConnStrDecrypt',
    method: 'post',
    params: data,
  })
}
/**
   * 数据库加密
   */
export function dbtoolsConnStrEncrypt(data) {
  return request({
    url: BaseUrl.api + '/api/DbTools/ConnStrEncrypt',
    method: 'post',
    params: data,
  })
}
