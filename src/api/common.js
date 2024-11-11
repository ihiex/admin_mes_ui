import request, { BaseUrl } from '@/utils/request'
//产品大类 获取料号组类别
export function GetPartFamilyType() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPartFamilyType`,
    method: 'get',
  })
}
//获取料号组
export function GetPartFamily(PartFamilyTypeID) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPartFamily`,
    method: 'get',
    data: PartFamilyTypeID
  })
}
//获取料号
export function GetPart(PartFamilyID) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPart`,
    method: 'get',
    data: PartFamilyID
  })
}
//获取工单
export function GetProductionOrder(PartID) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetProductionOrder`,
    method: 'get',
    data: PartID
  })
}
//获取工站类型
export function GetStationType() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetStationType`,
    method: 'get'
  })
}
//获取工站
export function GetStation(StationTypeID) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetStation`,
    method: 'get',
    data: StationTypeID
  })
}
//获取班别
export function GetShift() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetShift`,
    method: 'get'
  })
}
//获取线别
export function GetLine() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetLine`,
    method: 'get'
  })
}
//获取数据层级
export function GetDataLevel() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetDataLevel`,
    method: 'get'
  })
}

//以下是带ALL的
//获取料号组类别
export function GetPartFamilyTypeAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPartFamilyTypeAll`,
    method: 'get'
  })
}

//获取料号组
/*
参数： {S_PartFamilyTypeID：''}
*/
export function GetPartFamilyAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPartFamilyAll`,
    method: 'get'
  })
}

//获取料号
/*
参数：{S_PartFamilyID''}
*/
export function GetPartNumberAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetPartNumberAll`,
    method: 'get'
  })
}

//获取工站类型
export function GetStationTypeAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetStationTypeAll`,
    method: 'get'
  })
}
//获取工站
/*
{S_StationTypeID： ‘’}
*/
export function GetStationAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetStationAll`,
    method: 'get'
  })
}
//获取线别
export function GetLineAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetLineAll`,
    method: 'get'
  })
}
//获取工单
/*
{S_PartID：‘’}
*/
export function GetProductionOrderAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetProductionOrderAll`,
    method: 'get'
  })
}
/* 单元状态 */
export function GetUnitStatusAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetUnitStatusAll`,
    method: 'get'
  })
}
/* 过站状态 */
export function GetUnitStateAll() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetUnitStateAll`,
    method: 'get'
  })
}

/* 获取线别 工站配置--特用 */
export function GetMesLine() {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetLine?api-version=2.0`,
    method: 'get'
  })
}

/* 获取工站 工站配置--特用 */
export function GetMesStation(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetStation`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}

/* 获取字典明细 */
export function GetDictDataDetail(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/GetDictDataDetail`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}

/* 扫描过站四件套 */

//料号组类别
/*
ID
*/
export function MesGetPartFamilyType(params = {}) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetPartFamilyType`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}
//料号组
/*
ID
PartFamilyTypeID
*/
export function MesGetPartFamily(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetPartFamily`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}
//料号
/*
ID
PartFamilyID
*/
export function MesGetPart(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetPart`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}
//工单
/*
ID
PartID
*/
export function MesGetProductionOrder(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/MesGetProductionOrder`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}
//单元状态
export function LuGetUnitStatus(params = {}) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/LuGetUnitStatus`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' }
  })
}

// 获取工站类型
export function GetMesStationType() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesStationType`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}


export function GetMesUnitState() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesUnitState`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}

