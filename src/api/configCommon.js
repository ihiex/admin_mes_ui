import request, { BaseUrl } from '@/utils/request'

export function GetluApplicationType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluApplicationType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetluDefectType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluDefectType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetsysStatus(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetsysStatus`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluProductionOrderStatus(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetPOStatus`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluPartFamilyType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluPartFamilyType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluPartFamily(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluPartFamily`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluPartFamilyDetailDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluPartFamilyDetailDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluPartFamilyTypeDetailDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluPartFamilyTypeDetailDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetPartFamily_PartFamilyTypeID(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetPartFamily_PartFamilyTypeID`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesPart(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesPart`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesPart_PartFamilyID(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesPart_PartFamilyID`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluPartDetailDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluPartDetailDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesStationType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesStationType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesStation(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesStation`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetTypeToStation(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetTypeToStation`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesLine(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesLine`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesLinePO(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesLinePO`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluLineTypeDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluLineTypeDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetLineType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetLineType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetLineGroupName(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetLineGroupName`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesRoute(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesRoute`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesMachine(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesMachine`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluMachineFamilyType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluMachineFamilyType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluMachineFamily(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluMachineFamily`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluSNFamily(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluSNFamily`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesSNFormat(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesSNFormat`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesUnitState(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesUnitState`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesProductionOrder(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesProductionOrder`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluProductionOrderDetailDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluProductionOrderDetailDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluMachineStatus(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluMachineStatus`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluLabelFamily(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluLabelFamily`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetVLabelType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetVLabelType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetVOutputType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetVOutputType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetVModuleName(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetVModuleName`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetDBField(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetDBField`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetVFunctionName(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetVFunctionName`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesLabelFieldDefinition(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesLabelFieldDefinition`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetmesLabel(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesLabel`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluStationTypeDetailDef(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluStationTypeDetailDef`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetLabelFormatPosName(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetLabelFormatPosName`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetSectionType(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetSectionType`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetSectionStatus(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetSectionStatus`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetProcesureUDP(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetProcesureUDP`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetluProductionOrderDetailDef_PMC(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetluProductionOrderDetailDef_PMC`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetCom_a(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetCom_a`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetCom_d(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetCom_d`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetCom_h(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetCom_h`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetCom_n(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetCom_n`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}
export function GetCom_o(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetCom_o`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetmesLinePMC(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetmesLinePMC`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetLineTypePMC(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetLineTypePMC`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetEmployee(data = {}) {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetEmployee`,
    method: 'get',
    params: { 'api-version': '3.0', ...data },
  })
}

export function GetEmployeeGroup() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetEmployeeGroup`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}
export function GetEmployeeStatus() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetEmployeeStatus`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}
export function GetPermissionGroup() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/GetPermissionGroup`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}
export function InitializeBaseData() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/PublicSC/InitializeBaseData`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}
export function FindWithAllPagerAsync() {
  return request({
    url: `${BaseUrl.api}/api/SysConfig/SC_mesMachine/FindWithAllPagerAsync`,
    method: 'get',
    params: { 'api-version': '3.0' }
  })
}







