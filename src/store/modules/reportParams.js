/**
 * @author Jason.zou 305043598@qq.com
 * @description 数据看板
 */
// import { getShift, getUserShift, uuid } from '@/utils'
// import store from '../index'

//日期格式化
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  "".substring()
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)));
  return fmt;
}

let date = new Date()
let sDate = new Date(date.setDate(date.getDate() - 6)).format(
  'yyyy-MM-dd 00:00:00'
)
// let shift = getShift(this.$store.getters['user/shiftTable'])

let state = () => ({
  params: {
    S_StartDateTime: '',//shift.sTime,
    S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
    S_DataType: '0',
    S_PartFamilyTypeID: null, //料号类别
    S_PartFamilyID: null, //料号组
    S_PartID: null, //料号
    S_ProductionOrderID: null, //工单
    S_StationTypeID: null, //工站类型
    S_StationID: null, //工站
    S_LineID: null, //产线
    S_Shift: '', //this.$store.getters['user/userShiftTable'], //班次
    S_DataLevel: 4, //数据层级
    YieldLevel: 1, //良率层级
    IsCombineYield: 0, //是否合并良率
    S_TopQTY: localStorage.getItem('YieldTop')
      ? localStorage.getItem('YieldTop')
      : 20
  },
  paramsV2: {
    S_StartDateTime: '',//shift.sTime,
    S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
    S_DataType: '0',
    S_PartFamilyTypeID: null, //料号类别
    S_PartFamilyID: null, //料号组
    S_PartID: null, //料号
    S_ProductionOrderID: null, //工单
    S_StationTypeID: null, //工站类型
    S_StationID: null, //工站
    S_LineID: null, //产线
    S_Shift: '', //this.$store.getters['user/userShiftTable'], //班次
    S_DataLevel: 8, //数据层级 7是cum, 8是最后一站
    YieldLevel: 1, //良率层级
    IsCombineYield: 0, //是否合并良率
    S_TopQTY: localStorage.getItem('YieldTop')
      ? localStorage.getItem('YieldTop')
      : 20
  },
  paramsV3: {
    S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
    S_EndDateTime: new Date().format('yyyy-MM-dd hh:00:00'),
    S_DataType: '1',
    S_PartFamilyTypeID: null, //料号类别
    S_PartFamilyID: null, //料号组
    S_PartID: null, //料号
    S_ProductionOrderID: null, //工单
    S_StationTypeID: null, //[2, 8], //工站类型
    S_StationID: null, //工站
    S_LineID: null, //产线
    S_Shift: null, //班次
    S_DataLevel: 4, //数据层级
    YieldLevel: 1, //良率层级
    IsCombineYield: 0, //良率合并
    S_TopQTY: localStorage.getItem('DefectTopBySoftGoods')
      ? localStorage.getItem('DefectTopBySoftGoods')
      : 10
  },
  isAuto: true,
  isAutoV2: true,
  isAutoV3: true
})
let getters = {
  params: (state) => state.params,
  isAuto: state => state.isAuto,
  paramsV2: (state) => state.paramsV2,
  isAutoV2: state => state.isAutoV2,
  paramsV3: (state) => state.paramsV3,
  isAutoV3: state => state.isAutoV3
}
let mutations = {
  setParams(state, params) {
    state.params = params
  },
  setIsAuto(state, bool) {
    state.isAuto = bool
  },
  setParamsV2(state, params) {
    state.paramsV2 = params
  },
  setIsAutoV2(state, bool) {
    state.isAutoV2 = bool
  },
  setParamsV3(state, params) {
    state.paramsV3 = params
  },
  setIsAutoV3(state, bool) {
    state.isAutoV3 = bool
  }
}
let actions = {
  setParams({ commit }, params) {
    commit('setParams', params)
  },
  setIsAuto({ commit }, bool) {
    commit('setIsAuto', bool)
  },
  setParamsV2({ commit }, params) {
    commit('setParamsV2', params)
  },
  setIsAutoV2({ commit }, bool) {
    commit('setIsAutoV2', bool)
  },
  setParamsV3({ commit }, params) {
    commit('setParamsV3', params)
  },
  setIsAutoV3({ commit }, bool) {
    commit('setIsAutoV3', bool)
  }
}

export default { state, getters, mutations, actions }
