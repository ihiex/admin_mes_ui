import request, { BaseUrl } from '@/utils/request'

// 线别管理
export function MesLineInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesLineUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MesLineClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesLineInsertDetail(params, data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/InsertDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...params },
    data
  })
}

export function MesLineDeleteDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/DeleteDetail`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data }
  })
}

export function MesLineUpdateDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/UpdateDetail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineList_Detail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLine/List_Detail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

// 线别分组
export function MesLineGroupInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineGroup/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineGroupDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineGroup/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}


export function MesLineGroupUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineGroup/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineGroupClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineGroup/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesLineGroupFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineGroup/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

/* 工站分类 */
export function MesStationTypeInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationTypeDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesStationTypeUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationTypeClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationTypeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesStationTypeInsertDetail(params, data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/InsertDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...params },
    data
  })
}

export function MesStationTypeDeleteDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/DeleteDetail`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data }
  })
}

export function MesStationTypeUpdateDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationType/UpdateDetail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

/* 工站管理 */

export function MesStationInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesStationUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function MesStationFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function MesStationInsertDetail(params, data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/InsertDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...params },
    data
  })
}

export function MesStationDeleteDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/DeleteDetail`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data }
  })
}

export function MesStationUpdateDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStation/UpdateDetail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

/* 物料管理 */
// 不良代码
export function DefectCodeUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefect/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function DefectCodeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefect/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function DefectCodeInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefect/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function DefectCodeDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefect/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

// 下拉框数据
export function getDefectTypeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefect/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

//不良代码类别
export function DefectTypeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luDefectType/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

/* 料号组类别 */

export function PartFamilyTypeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

export function PartFamilyTypeChildInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyTypeDetail/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeChildDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyTypeDetail/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyTypeChildUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyTypeDetail/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
// 属性
export function PartFamilyTypeAttributeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyTypeDetailDef/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
// 类别 下拉框
// 料号组类别
export function PartFamilyTypeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyType/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

/* 料号组 */
export function PartFamilyFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

// 下拉框
export function PartFamilyFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
// 属性
export function PartFamilyAttributeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamilyDetailDef/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// child table
export function PartFamilyChildUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyDetail/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyChildInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyDetail/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartFamilyChildDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartFamilyDetail/DeleteAsyn`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

/* 料号 */

export function PartFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

// 下拉框数据
export function PartFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
// 属性
export function PartAttributeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartDetailDef/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// child table
export function PartChildInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartDetail/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartChildUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartDetail/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PartChildDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPartDetail/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

// 供应商
export function VendorUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luVendo/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function VendorFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luVendo/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function VendorInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luVendo/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function VendorDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luVendo/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

// 料号三件套
export function GetPartFamilyByParentId(id) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luPartFamily/FindPagerByParentAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...{ ParentID: id } },
  })
}
export function GetPartByParentId(id) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesPart/FindPagerByParentAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...{ ParentID: id } },
  })
}

// 条码分组
export function SNFamilyInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNFamily/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFamilyUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNFamily/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function SNFamilyClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNFamily/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFamilyDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNFamily/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function SNFamilyFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNFamily/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 条码类别
export function SNTypeInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNType/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNTypeUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNType/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNTypeClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNType/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNTypeDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNType/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function SNTypeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNType/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 条码格式分配
export function SNFormatAllotInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormatMap/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatAllotUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormatMap/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatAllotClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormatMap/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatAllotDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormatMap/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function SNFormatAllotFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormatMap/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 条码格式
export function SNFormatInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function SNFormatFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 子表
export function SNFormatChildInsert(pid, data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/InsertDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...pid },
    data
  })
}
export function SNFormatChildUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/UpdateDetail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatChildDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/DeleteDetail`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

// Range
export function SNFormatInsertSNRange(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/InsertSNRange`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatUpdateSNRange(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/UpdateSNRange`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function SNFormatDeleteSNRange(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/DeleteSNRange`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

export function SNFormatListSNRange(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesSNFormat/List_SNRange`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

// BOM管理
// BOM产品结构
export function BOMProductStructureUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductStructure/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function BOMProductStructureFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductStructure/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function BOMProductStructureInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductStructure/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function BOMProductStructureDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductStructure/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

// 工单维护
export function WorkOrderMaintenanceFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
// PMC页面
export function WorkOrderMaintenanceFindWithPagerSearchPMCAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/FindWithPagerSearchPMCAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function WorkOrderMaintenanceUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function PMCWorkOrderMaintenanceInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/InsertPMCAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function WorkOrderMaintenanceFindPagerByParentAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrder/FindPagerByParentAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data }
  })
}

// 工单详细属性
export function WorkOrderAttributeFindWithAllPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data }
  })
}

// 工单维护 子表
export function WorkOrderMaintenanceChildUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrderDetail/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceChildInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrderDetail/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceChildDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesProductionOrderDetail/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
// 分线

export function WorkOrderMaintenanceLineUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineOrder/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceLineInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineOrder/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderMaintenanceLineDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLineOrder/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

// 标签分组
export function LabelFamilyInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_LabelFamily/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFamilyUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_LabelFamily/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFamilyClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_LabelFamily/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFamilyDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_LabelFamily/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function LabelFamilyFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_LabelFamily/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 标签
export function LabelInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function LabelDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}

export function LabelUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function LabelFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function LabelInsertDetail(params, data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/InsertDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...params },
    data
  })
}

export function LabelDeleteDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/DeleteDetail`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data }
  })
}

export function LabelUpdateDetail(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabel/UpdateDetail`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

// 标签字段定义
export function LabelFieldDefinitionInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabelFieldDefinition/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFieldDefinitionUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabelFieldDefinition/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFieldDefinitionClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabelFieldDefinition/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFieldDefinitionDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabelFieldDefinition/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function LabelFieldDefinitionFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesLabelFieldDefinition/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 工艺流程名
export function WorkflowNameInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowNameUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowNameClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowNameDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function WorkflowNameFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function ShowXMLRouteV2(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/ShowXMLRouteV2`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}
export function SaveXMLRouteV2(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/SaveXMLRouteV2`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
// 从旧版转新版
export function SetXMLToXMLV2(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/SetXMLToXMLV2`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}
export function ShowRouteHistory(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/ShowRouteHistory`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetMesRouteHistory(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/GetmesRouteHistory`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}
export function WorkflowNameUndo(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRoute/Undo`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}


// 工艺流程配置
export function WorkflowConfigInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteDetail/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowConfigUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteDetail/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowConfigClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteDetail/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowConfigDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteDetail/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function WorkflowConfigFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteDetail/List_mesRouteDetail`,
    method: 'post',
    params: { 'api-version': '3.0', ...data },
  })
}

// 工艺流程分配
export function WorkflowAllotInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMap/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowAllotUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMap/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowAllotClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMap/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkflowAllotDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMap/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function WorkflowAllotFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMap/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 工序状态
export function WorkStageStateInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesUnitState/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkStageStateUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesUnitState/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkStageStateClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesUnitState/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkStageStateDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesUnitState/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function WorkStageStateFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesUnitState/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 标签格式分配

export function LabelFormatAllotInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeLabelMap/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFormatAllotUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeLabelMap/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFormatAllotClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeLabelMap/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function LabelFormatAllotDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeLabelMap/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function LabelFormatAllotFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeLabelMap/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 员人权限
export function EmployeeInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeAccess/Insert`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function EmployeeUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeAccess/Update`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function EmployeeClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeAccess/Clone`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function EmployeeDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeAccess/Delete`,
    method: 'delete',
    params: { 'api-version': '3.0', ...data },
  })
}
export function EmployeeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesStationTypeAccess/FindWithPagerSearchAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 设备组类别
export function MachineFamilyTypeUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamilyType/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyTypeFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamilyType/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyTypeInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamilyType/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyTypeDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamilyType/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

export function getMachineFamilyType(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamilyType/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

//设备组
export function MachineFamilyUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamily/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamily/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamily/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFamilyDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamily/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}

export function getMachineFamily(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luMachineFamily/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 设备资料
export function MachineUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function getMachine(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetWarningState(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/GetWarningState`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}



// 设备分配
export function MachineRouteUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineRouteFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineRouteInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineRouteCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function MachineRouteDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function getMachineRoute(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesRouteMachineMap/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

// 工单属性
export function WorkOrderAttributeUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderAttributeInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderAttributeDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function WorkOrderAttributeFindWithPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function GetCheckType(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_luProductionOrderDetailDef/GetCheckType`,
    method: 'get',
    params: { 'api-version': '3.0' },
    data
  })
}

// 属性名配置
export function AttributeUpdateAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function AttributeInsertAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function AttributeCloneAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function AttributeDeleteAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function AttributeFindWithPagerAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
// 获取所有表名
export function GetCommonTabList() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicProperties/GetCommonTabList`,
    method: 'get',
    params: { 'api-version': '3.0' },
  })
}

// 班次
export function ShiftUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftGetList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftGetAllList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0' },
    data
  })
}
// 获取可用班次
export function ShiftGetAllEnable(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/GetAllEnable`,
    method: 'get',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftFindWithAllPagerFilterAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShift/FindWithAllPagerFilterAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}


// 班次时间段
export function ShiftDetailUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftDetailInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftDetailDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftDetailClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftDetailGetList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftDetailGetAllList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function ShiftDetailGetListByParentId(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftDetail/FindPagerByParentAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}


// UPH设置
export function ShiftUPHUpdate(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/UpdateAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftUPHInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/InsertAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftUPHBatchInsert(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/InsertBulkAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftUPHDelete(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/DeleteAsync`,
    method: 'delete',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftUPHClone(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/CloneAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}
export function ShiftUPHGetList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/FindWithPagerAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function ShiftUPHGetAllList(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/FindWithAllPagerFilterAsync`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function ShiftUPHDeleteBulkAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesShiftUPH/DeleteBulkAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function LockSNAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNLock/LockSNAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}

export function LockSNFindWithPagerSearchAsync(data) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_SNLock/FindWithPagerSearchAsync`,
    method: 'post',
    params: { 'api-version': '3.0' },
    data
  })
}




