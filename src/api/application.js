import request, { BaseUrl } from '@/utils/request'

export function SetConfirmPO(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetConfirmPO`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}

export function SetScanSN(params, isShowLoading, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetScanSN`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//不良代码
export function GetDefect(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Public/GetDefect`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}

/*
页面初始化
IsCheckPO=0隐藏工单
IsCheckPN=0隐藏所有
*/
export function GetPageInitialize(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/GetPageInitialize`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}


/*
TT 过站
*/
export function SetScanSN_TT(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetScanSNTT`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

export function GetScanTTCardID(params, isShowLoading = false, isShowError = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/GetScanTTCardID`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/*
TT 注册
*/
export function SetScanSN_TTRegister(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetScanSN_TTRegister`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
TT 箱子绑定扫描
*/
export function SetConfirmPO_TTBindBox(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetConfirmPO_TTBindBox`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
TT Box绑定BoxSN
*/
export function SetScanSN_TTBoxSN(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetScanSN_TTBoxSN`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
TT Box绑定子SN
*/
export function SetScanSN_TTChildSN(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OverStation/SetScanSN_TTChildSN`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
组装 页面初始化
*/
export function GetPageInitializeAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyTwoInput/GetPageInitializeAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}

/*
组装 料号或工单确认
*/
export function SetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyTwoInput/SetConfirmPOAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
组装 主条码提交
*/
export function MainSnVerifyAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyTwoInput/MainSnVerifyAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}



/*
组装 条码
*/
export function ChildSnVerifyAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyTwoInput/ChildSnVerifyAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//仓库：
//包装过站
/*
初始化页面
*/
export function PackGetPageInitializeAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PackageOverStation/GetPageInitializeAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}
/* 确认po */
export function PackSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/PackageOverStation/SetConfirmPOAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 栈板条码校验 */
export function PackPalletSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PackageOverStation/PalletSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* 箱码检查 */
export function PackBoxSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PackageOverStation/BoxSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/* 打印 */
/* 页面初始化 */
export function PrintPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Print/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 线号 */
export function PrintMesLineGroup(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Print/mesLineGroup`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
/* 料号或工单确认 */
export function PrintSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Print/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 生成FGSN并打印 */
export function PrintCreateSN(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Print/CreateSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}


/*
托盘绑定批次
*/
/* 初始化 */
export function LinkGetPageInitializeAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CarrierLinkMaterialBatch/GetPageInitializeAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}
/*
确认
*/
export function LinkSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/CarrierLinkMaterialBatch/SetConfirmPOAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 托盘条码校验 */
export function LinkCarrierSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CarrierLinkMaterialBatch/CarrierSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* 批次号校验 */
export function LinkBatchNumberVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CarrierLinkMaterialBatch/BatchNumberVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/*
治具关联治具
*/
/* 初始化 */
export function ToolGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ToolingLinkTooling/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 确认工单 */
export function ToolSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ToolingLinkTooling/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 校验新治具 */
export function ToolNewToolingSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/ToolingLinkTooling/NewToolingSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* 校验旧治具 */
export function ToolOldToolingSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/ToolingLinkTooling/OldToolingSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* 解锁 */
export function ToolOldToolingSnReleaseAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ToolingLinkTooling/OldToolingSnReleaseAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 序列号关联批次号 */

/* 初始化 */
export function SNGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkBatch/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 确认工单 */
export function SNSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkBatch/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 批次号输入校验 */
export function SNBatchSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkBatch/BatchSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/* 关联序列号输入校验 */
export function SNLinkSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkBatch/LinkSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/*
SNLinkUPC 成品条码关联UPC
*/
/* 初始化 */
export function UPCGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkUPC/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 确认工单 */
export function UPCSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkUPC/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 主条码校验 */
export function UPCMainSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkUPC/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* 动态条码校验 */
export function UPCDynamicSnVerifyAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/SNLinkUPC/DynamicSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/*
跳站
*/
/* 初始化 */
export function JSGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/JumpStation/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 确认工单或料号 */
export function JSSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/JumpStation/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 扫描 */
export function JSSetScanSN_JumpStation(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/JumpStation/SetScanSN_JumpStation`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

/* 改变料号和工单 */
/* 初始化 */
export function CPGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ChangePOPN/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 确认 */
export function SetConfirmChangePOAndPN(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ChangePOPN/SetConfirmPO_ChangePOPN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 扫描 */
export function ScanChangePOAndPN(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/ChangePOPN/SetScanSN_ChangePOPN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

/*
组装解绑
*/
/* 初始化 */
export function ReworkGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Rework/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
/* 获取反工数据 */
export function ReworkSetScanSNGetRework(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Rework/SetScanSN_GetRework`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 反工 */
export function SetRework(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Rework/SetRework`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 打印 */
export function ReworkPrint(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Rework/ReworkPrint`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

/* 产品装箱 */
// 初始化
export function PackageGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 确认工单
export function PackageSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 主条码校验
export function PackageMainSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 动态条码校验
export function PackageDynamicSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/DynamicSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 移除未封箱产品
export function PackageRemoveSingleAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/RemoveSingleAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 补打印
export function PackageReprintBoxSnAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/ReprintBoxSnAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 尾箱封箱
export function PackageLastBoxSubmitAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAuto/LastBoxSubmitAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/*
仓库 出货联单
*/
//初始化
export function ShipmentGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//状态数据类别
export function ShipmentGetWHType() {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/GetWHType`,
    method: 'get',
    params: { 'api-version': '2.0' },
  })
}
// 获取主数据
export function ShipmentGetShipmentNew(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/GetShipmentNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
  })
}

// 获取子数据
export function ShipmentGetShipmentEntryNew(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/GetShipmentEntryNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}

// 栈板纸
export function ShipmentGetShipmentReport(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/GetShipmentReport`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}

// 编辑主表
export function ShipmentSetShipmentNew(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/SetShipmentNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}

// 批量更新状态
export function ShipmentUpdateFStatus(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/UpdateFStatus`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}

// 删除主表
export function ShipmentDelShipmentNew(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/DelShipmentNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}
//编辑子表
export function ShipmentSetShipmentEntryNew(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/SetShipmentEntryNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}
// 删除子表
export function ShipmentDelShipmentEntryNew(params, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/WH/DelShipmentEntryNew`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowSuccess
  })
}

/* IQC */
export function IQCGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/IQC/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 确认工单
export function IQCSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/IQC/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 子条码校验
export function IQCSetScanChildSN(params, isShowLoading = false, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/IQC/SetScanChildSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowSuccess
  })
}


// 主条码校验
export function IQCSetScanSN(params, isShowLoading = false, isShowSuccess = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/IQC/SetScanSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowSuccess,
    isShowError: true
  })
}

/*
产品装箱
*/

//初始化
export function SimplifyGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
// 确认工单
export function SimplifySetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 主条码校验
export function SimplifyMainSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 动态条码校验
export function SimplifyDynamicSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/DynamicSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 移除未封箱产品
export function SimplifyRemoveSingleAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/RemoveSingleAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 补打印
export function SimplifyReprintBoxSnAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/ReprintBoxSnAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 尾箱封箱
export function SimplifyLastBoxSubmitAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxPackageAutoSimplify/LastBoxSubmitAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/*
棧板包裝
*/

//初始化
export function PalletGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 确认工单
export function PalletSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

// 主条码校验
export function PalletMainSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 动态条码校验
export function PalletDynamicSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/DynamicSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// 移除未封箱产品
export function PalletRemoveSingleAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/RemoveSingleAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 补打印
export function PalletReprintBoxSnAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/ReprintBoxSnAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

// 尾箱封箱
export function PalletLastBoxSubmitAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/PalletPackage/LastPalletSubmitAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}

/* 物料初始化 */
//初始化
export function MaterialInitGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialInitial/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//确认工单
export function MaterialInitSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialInitial/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//物料注册
export function MaterialInitSetRegister(params, isShowLoading = false, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialInitial/SetRegister`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//重打印
export function MaterialInitSetRePrint(params, isShowLoading = true, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialInitial/RePrint`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//追溯码
export function MaterialInitTranceCodeKeyDown(params, isShowLoading = false, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialInitial/TranceCode_KeyDown`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 中箱称重 */
//初始化
export function ScalageGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxScalagePackage/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认工单
export function ScalageSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxScalagePackage/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
// 箱码校验
export function ScalageMainSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxScalagePackage/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
// 提交
export function ScalageFinalWeightSubmitAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/BoxScalagePackage/FinalWeightSubmitAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

/* 物料切割 */
//初始化
export function MaterialCuttingGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialLineCropping_SN/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function MaterialCuttingSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialLineCropping_SN/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//物料切割
export function MaterialCuttingSetSplit(params, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialLineCropping_SN/SetSplit`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowError: isShowError
  })
}
//批次事件
export function MaterialCuttingParentBatchNoValueChanged(params, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/MaterialLineCropping_SN/ParentBatchNo_ValueChanged`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowError: isShowError
  })
}

/* 出货卡板 */

//初始化
export function ShipmentPalletGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//确认
export function ShipmentPalletSetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//主条码校验
export function ShipmentPalletMainSnVerifyAsync(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
//箱码校验
export function ShipmentPalletMultipackSnVerifyAsync(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/MultipackSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
//出货单号替换
export function ShipmentPalletReplaceBillNOAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/ReplaceBillNOAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
//通过条码进行补打印
export function ShipmentPalletReprintSnAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/ReprintSnAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
//从出货栈板中解绑单个箱码
export function ShipmentPalletRemoveMultipackSnAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/RemoveMultipackSnAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
//将整个出货栈板解除关联
export function ShipmentPalletUnpackShipmentPalletAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/ShipMent/UnpackShipmentPalletAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

/*
ScanFG Print UPC
*/
//初始化
export function ScanFGPrintUPCGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanFGSN_PrintUPC/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function ScanFGPrintUPCSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanFGSN_PrintUPC/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//扫条码
export function ScanFGPrintUPCSetScanSN(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanFGSN_PrintUPC/SetScanSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
  })
}

//FG重打印
//初始化
export function ReFGGetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/RePrint/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function ReFGSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/RePrint/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//扫条码
export function ReFGSetScanSN(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/RePrint/SetScanSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
  })
}

/* 扫描UPC打印FG */
//初始化
export function ScanUPCToFGGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanUPC_PrintFGSN/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function ScanUPCToFGSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanUPC_PrintFGSN/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//扫条码
export function ScanUPCToFGSetScanSN(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanUPC_PrintFGSN/SetScanSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
  })
}

/* 扫夹具打印SN */
//初始化
export function FixturePrintGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanToolingPrint/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function FixturePrintSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanToolingPrint/SetConfirmPO`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//扫条码
export function FixturePrintSetScanSN(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/ScanToolingPrint/SetScanSN`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
  })
}

/* 动态组装 */
//初始化
export function AssemblyDynamicGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyDynamic/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
//确认
export function AssemblyDynamicSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyDynamic/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
// 动态条码校验
export function AssemblyDynamicSnVerifyAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyDynamic/DynamicSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
/* 释放 */
export function ReleaseMachineSNAsync(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/AssemblyDynamic/ReleaseMachineSNAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

/* 东莞仓库 */
export function DG_GetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetPageInitialize`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

export function DG_WHIn(params, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/WHIn`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowError: isShowError
  })
}

/* export function DG_WHIn_DT(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/WHIn_DT`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
} */

export function DG_WHOut(params, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/WHOut`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowError: isShowError
  })
}

/* export function DG_WHOut_DT(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/WHOut_DT`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
} */


export function DG_CheckBillNo(params, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/CheckBillNo`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowError: isShowError
  })
}
/* export function DG_GetIpad_BB(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetIpad_BB`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
} */
export function DG_GetShipment(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetShipment`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_GetShipmentEntry(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetShipmentEntry`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_GetShipmentReport(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetShipmentReport`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_Edit_CO_WH_Shipment(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/Edit_CO_WH_Shipment`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_DeleteShipment(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/DeleteShipment`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_DeleteShipmentEntry(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/DeleteShipmentEntry`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_DeleteMultiSelectShipment(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/DeleteMultiSelectShipment`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
export function DG_UpdateShipment_FStatus(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/UpdateShipment_FStatus`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}
/* export function DG_GetShipment_One(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetShipment_One`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
} */
/* export function DG_GetShipmentEntry_One(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/GetShipmentEntry_One`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
} */
export function DG_Edit_CO_WH_ShipmentEntry(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/Edit_CO_WH_ShipmentEntry`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

export function DG_ImportCheck(params, isShow = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/ImportCheck`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: isShow,
    isShowError: isShow
  })
}
export function DG_ImportEnter(params, isShow = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/Siemens/ImportEnter`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: isShow,
    isShowError: isShow
  })
}

// OOBA print and rework
export function OOBA_GetPageInitializeAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/OOBA/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
// 箱码检查
export function OOBA_BoxSnCheckAsync(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/OOBA/BoxSnCheckAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}
// 返工
export function OOBA_BoxSnReworkAsync(params, isShowLoading = false) {
  return request({
    url: `${BaseUrl.api}/api/Security/OOBA/BoxSnReworkAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
  })
}

// KitQC

//初始化
export function KitQCGetPageInitialize(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/KitQC/GetPageInitializeAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

//确认
export function KitQCSetConfirmPO(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/KitQC/SetConfirmPOAsync`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

export function KitQCMainSnVerifyAsync(params, isShowLoading = false, isShowError = true) {
  debugger
  return request({
    url: `${BaseUrl.api}/api/Security/KitQC/MainSnVerifyAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/* 仓库项目基础数据 */
//DG

export function DGProjectBaseUpdate(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBase/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}


export function DGProjectBaseInsert(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBase/InsertAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}

export function DGProjectBaseDeleteAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBase/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}


export function DGProjectBaseGetById(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBase/GetById`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

export function DGProjectBaseFindWithPagerAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBase/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}

// TH
export function DGProjectBaseNewUpdate(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBaseNew/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}


export function DGProjectBaseNewInsert(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBaseNew/InsertAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}

export function DGProjectBaseNewDeleteAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBaseNew/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}

export function DGProjectBaseNewGetById(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBaseNew/GetById`,
    method: 'get',
    params: { 'api-version': '2.0', ...params },
  })
}

export function DGProjectBaseNewFindWithPagerAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_WH_ProjectBaseNew/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}


/* SAP出货导出 */
export function SAPShipManifestDataFindWithPagerLikeAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_ShipManifestData_SN/FindWithPagerLikeAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}
export function SAPShipManifestDataFindExportCSVAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/CO_ShipManifestData_SN/FindExportCSVAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params
  })
}
/* SAP出货导入 */
export function SAPShipmentImportFindWithPagerLikeAsync(params, showMsg = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/TmpExcelShipmentNew/FindWithPagerLikeAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowSuccess: showMsg,
    isShowError: showMsg
  })
}


// 获取SAP数据状态
export function GetSAPDataState() {
  return request({
    url: `${BaseUrl.api}/api/Security/TmpExcelShipmentNew/GetSAPDataState`,
    method: 'get',
    params: { 'api-version': '2.0' },
  })
}

// QC
export function QCPageInitialize(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/QC/GetPageInitialize`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}

export function QCConfirmPO(params, isShowLoading) {
  return request({
    url: `${BaseUrl.api}/api/Security/QC/SetConfirmPO`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading
  })
}

export function QCSetScanSN(params, isShowLoading, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/QC/SetScanSN`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}


/*
返工
*/
export function RMAGetPageInitializeAsync(params) {
  return request({
    url: `${BaseUrl.api}/api/Security/RMAChange/GetPageInitializeAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
  })
}

/*
工单确认
*/
export function RMASetConfirmPOAsync(params, isShowLoading, isShowError) {
  return request({
    url: `${BaseUrl.api}/api/Security/RMAChange/SetConfirmPOAsync`,
    method: 'get',
    params: { ...params, 'api-version': '2.0' },
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}

/*
条码提交
*/
export function RMASnCheckAsync(params, isShowLoading, isShowError = true) {
  return request({
    url: `${BaseUrl.api}/api/Security/RMAChange/SnCheckAsync`,
    method: 'post',
    params: { 'api-version': '2.0' },
    data: params,
    isShowLoading: isShowLoading,
    isShowSuccess: isShowLoading,
    isShowError: isShowError
  })
}
