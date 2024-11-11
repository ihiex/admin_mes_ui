import request, { BaseUrl } from '@/utils/request'

//良率
export function GetUPHYield(data, api, noShow) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/GetUPHYield`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: !noShow ? true : false,
    isShowSuccess: !noShow ? true : false
  })
}

//不良
export function GetDefectYield(data, api, noShow = true) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/GetDefectYield`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: !noShow ? true : false,
    isShowSuccess: !noShow ? true : false
  })
}
//多服务器 UPH
export function GetUPHMultiServer(data, api, noShow) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/GetUPH`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: !noShow ? true : false,
    isShowSuccess: !noShow ? true : false
  })
}

//UPH
export function GetUPH(data, noShow = true, api) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/GetUPH`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: !noShow ? true : false,
    isShowSuccess: !noShow ? true : false
  })
}
export function GetUPHCum(data, noShow = false, api) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/GetUPHCum`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: !noShow ? true : false,
    isShowSuccess: !noShow ? true : false
  })
}
//概览
export function GetOutputSum(data, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetOutputSum`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}

//WIP
export function GetReportGeneral(data, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetReportGeneral`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}
//wip导出
export function GetExportExcel(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetExportExcel`,
    timeout: 1000 * 60 * 10,
    method: 'get',
    params: data,
  })
}

//查询中心
export function GetSearchCenter(data, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSearchCenter`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}

//物料追溯
export function GetWIPComponentList(data, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetWIPComponentList`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}

// 原数据
export function GetRawData(data, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetRawData`,
    method: 'get',
    params: data,
    timeout: 1000 * 60 * 10,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}
//原数据导出
export function GetExportExcel_RawData(data) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetExportExcel_RawData`,
    timeout: 1000 * 60 * 10,
    method: 'get',
    params: data,
  })
}

// 物料库存计划
export function GetStockPlan(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSAPStock`,
    method: 'get',
    timeout: 1000 * 60 * 10,
    params
  })
}

// 工厂代码
export function GetPlantCode() {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSAPAllPlant`,
    method: 'get',
  })
}

export function GetVersionByPlantCode(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSAPAllVersion`,
    method: 'get',
    params
  })
}

export function GetMaterialByPlantCode(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSAPStockMaterial`,
    method: 'get',
    params
  })
}

export function ExportStockPlan(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetExportExcel_SapStock`,
    method: 'get',
    params
  })
}

export function GetSAPStockPro(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetSAPStockPro`,
    method: 'get',
    params
  })
}

export function GetSAPStockProExport(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetExportExcel_SapStockPro`,
    method: 'get',
    params
  })
}

export function GetAutoAnalysisAlarmDashboard(isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetAutoAnalysisAlarmDashboard`,
    method: 'get',
    isShowLoading: isShowLoading,
  })
}
/* export function GetAutoAnalysisAlarmDashboard(){
  return request({
    url: `${BaseUrl.api}/api/Security/Report/GetAutoAnalysisAlarmDashboard`,
    method: 'get',
  })
} */

/* 邮件服务 */
export function SendEmail(data, api, isShowLoading = false) {
  return request({
    url: `${api ? api : BaseUrl.api}/api/Security/Report/SendMail`,
    method: 'post',
    data: data,
    isShowLoading: isShowLoading,
  })
}

