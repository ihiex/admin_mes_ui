/**
 * @author Jason.zou 305043598@qq.com
 * @description 页面下接框数据
 */

import {
  GetPartFamilyType,
  GetPartFamily,
  GetPart,
  GetProductionOrder,
  GetStationType,
  GetStation,
  GetShift,
  GetLine,
  GetDataLevel,
  GetPartFamilyTypeAll,
  GetPartFamilyAll,
  GetPartNumberAll,
  GetStationTypeAll,
  GetStationAll,
  GetLineAll,
  GetProductionOrderAll,
  GetUnitStatusAll,
  GetUnitStateAll,
  GetMesLine,
  GetMesStation,
  GetDictDataDetail,
  MesGetPartFamilyType,
  LuGetUnitStatus,
} from '@/api/common'

export default {
  state: {
    bgOptions: ['bg', 'bg1', 'bg2', 'bg3', 'bg4', 'bg5', 'none'],
    //时间类型
    timeOptions: [
      {
        value: '0',
        label: 'Hour',
      },
      {
        value: '1',
        label: 'Day',
      },
      {
        value: '2',
        label: 'Week',
      },
      {
        value: '3',
        label: 'Month',
      },
      {
        value: '4',
        label: 'Year',
      },
    ],
    //数据层级
    dataLevelOptions: [],
    PartFamilyTypeOptions: [], //产品大类
    PartFamilyOptions: [], //产品小类
    PartNumberOptions: [], //料号
    ProductionOrderOptions: [], //工单
    StationTypeOptions: [], //工序,
    StationOptions: [], //工站
    LineOptions: [], //线别
    ShiftOptions: [], //班次
    PartFamilyTypeAll: [],  //料号组类别
    PartFamilyAll: [],  //料号组
    PartNumberAll: [], //料号
    StationTypeAll: [], //工站类型
    StationAll: [], //工站
    LineAll: [], //线别
    ProductionOrderAll: [], //工单
    UnitState: [], //单元状态
    StationState: [], //过站状态
    MesLine: [],//线别--配置用
    MesStation: [], //工站--配置用
    UserTypes: [], //用户类别
    //mes扫描过站使用
    MesPartFamilyType: [], //料号组类别
    // MesPartFamily:[], //料号组
    // MesPart:[], //料号
    // MesProductionOrder:[], //工单
    LuUnitStatus: [], //单元状态
    YieldLevel: [
      {
        value: 1,
        label: 'FPY',
      },
      {
        value: 2,
        label: 'SPY',
      },
      {
        value: 0,
        label: 'FinalYield',
      }
    ], //良率层级
    IsCombineYield: [
      {
        value: 1,
        label: 'Combine',
      },
      {
        value: 0,
        label: 'NonCombine',
      }
    ], //是否合并良率
    IsUnit: [
      {
        value: true,
        label: 'true',
      },
      {
        value: false,
        label: 'false',
      }
    ],
    isFullScreen: false
  },
  mutations: {
    setFullScreen(state, bool) {
      state.isFullScreen = bool
    },
    setLuUnitStatus(state, data) {
      state.LuUnitStatus = data
    },
    setMesPartFamilyType(state, data) {
      state.MesPartFamilyType = data
    },
    setUserType(state, data) {
      state.UserTypes = data
    },
    setMesLine(state, data) {
      state.MesLine = data
    },
    setMesStation(state, data) {
      state.MesStation = data
    },
    setUnitState(state, datas) {
      state.UnitState = datas
    },
    setStationState(state, datas) {
      state.StationState = datas
    },
    setPartFamilyTypeOptions(state, datas) {
      state.PartFamilyTypeOptions = datas;
    },
    setPartFamilyOptions(state, datas) {
      state.PartFamilyOptions = datas
    },
    setPartNumberOptions(state, datas) {
      state.PartNumberOptions = datas
    },
    setProductionOrderOptions(state, datas) {
      state.ProductionOrderOptions = datas
    },
    setStationTypeOptions(state, datas) {
      state.StationTypeOptions = datas
    },
    setStationOptions(state, datas) {
      state.StationOptions = datas
    },
    setLineOptions(state, datas) {
      state.LineOptions = datas;
    },
    setShiftOptions(state, datas) {
      state.ShiftOptions = datas
    },
    setDataLevelOptions(state, datas) {
      state.dataLevelOptions = datas
    },
    setPartFamilyTypeAll(state, datas) {
      state.PartFamilyTypeAll = datas
    },
    setPartFamilyAll(state, datas) {
      state.PartFamilyAll = datas
    },
    setPartNumberAll(state, datas) {
      state.PartNumberAll = datas
    },
    setStationTypeAll(state, datas) {
      state.StationTypeAll = datas
    },
    setStationAll(state, datas) {
      state.StationAll = datas
    },
    setLineAll(state, datas) {
      state.LineAll = datas
    },
    setProductionOrderAll(state, datas) {
      state.ProductionOrderAll = datas
    }
  },
  actions: {
    setFullScreen({ commit }, bool) {
      commit('setFullScreen', bool)
    },
    setLuUnitStatus({ commit, state }) {
      if (state.LuUnitStatus.length > 0) return;
      LuGetUnitStatus().then(res => {
        if (res.Success) {
          commit('setLuUnitStatus', res.ResData)
        }
      })
    },
    setMesPartFamilyType({ commit, state }, params) {
      if (state.MesPartFamilyType.length > 0) return;
      MesGetPartFamilyType(params).then(res => {
        if (res.Success) {
          commit('setMesPartFamilyType', res.ResData)
        }
      })
    },
    setUserType({ commit, state }, params) {
      if (state.UserTypes.length) return;
      GetDictDataDetail(params).then(res => {
        if (res.Success) {
          commit('setUserType', res.ResData)
        }
      })
    },
    setMesLine({ commit, state }) {
      if (state.MesLine.length) return;
      GetMesLine().then(res => {
        if (res.Success) {
          commit('setMesLine', res.ResData)
        }
      })
    },
    setMesStation({ commit, state }, params) {
      // if(state.MesStation.length) return;
      GetMesStation(params).then(res => {
        if (res.Success) {
          commit('setMesStation', res.ResData)
        }
      })
    },
    //单元状态
    setUnitState({ commit, state }) {
      if (state.UnitState.length) return
      GetUnitStatusAll().then(res => {
        if (res.Success) {
          commit('setUnitState', res.ResData)
        }
      })
    },
    //过站状态
    setStationState({ commit, state }) {
      if (state.StationState.length) return
      GetUnitStateAll().then(res => {
        if (res.Success) {
          commit('setStationState', res.ResData)
        }
      })
    },
    setPartFamilyTypeOptions({ commit, state }) {
      if (state.PartFamilyTypeOptions.length) return
      GetPartFamilyType().then(res => {
        if (res.Success) {
          commit('setPartFamilyTypeOptions', res.ResData);
        }
      })
    },
    setPartFamilyOptions({ commit, state }, parentId) {
      if (state.PartFamilyOptions.length) return
      GetPartFamily({ PartFamilyTypeID: parentId }).then((res) => {
        if (res.Success) {
          commit('setPartFamilyOptions', res.ResData)
        }
      })
    },
    setPartNumberOptions({ commit, state }, PartFamilyID) {
      if (state.PartNumberOptions.length) return
      GetPart({ PartFamilyID }).then((res) => {
        if (res.Success) {
          commit('setPartNumberOptions', res.ResData)
        }
      })
    },
    setProductionOrderOptions({ commit, state }, PartID) {
      if (state.ProductionOrderOptions.length) return
      GetProductionOrder({ PartID }).then((res) => {
        if (res.Success) {
          commit('setProductionOrderOptions', res.ResData)
        }
      })
    },
    setStationTypeOptions({ commit, state }) {
      if (state.StationTypeOptions.length) return
      GetStationType().then((res) => {
        if (res.Success) {
          commit('setStationTypeOptions', res.ResData)
        }
      })
    },
    setStationOptions({ commit, state }, StationTypeID) {
      if (state.StationOptions.length) return;
      GetStation({ StationTypeID }).then((res) => {
        if (res.Success) {
          commit('setStationOptions', res.ResData)
        }
      })
    },
    setLineOptions({ commit, state }) {
      if (state.LineOptions.length) return
      GetLine().then((res) => {
        if (res.Success) {
          commit('setLineOptions', res.ResData)
        }
      })
    },
    setShiftOptions({ commit, state }) {
      if (state.ShiftOptions.length) return
      GetShift().then((res) => {
        if (res.Success) {
          commit('setShiftOptions', res.ResData)
        }
      })
    },
    setDataLevelOptions({ commit, state }) {
      if (state.dataLevelOptions.length) return
      GetDataLevel().then(res => {
        if (res.Success) {
          commit('setDataLevelOptions', res.ResData)
        }
      })

    },
    //料号组类别
    setPartFamilyTypeAll({ commit, state }) {
      if (state.PartFamilyTypeAll.length) return
      GetPartFamilyTypeAll().then(res => {
        if (res.Success) {
          commit('setPartFamilyTypeAll', res.ResData)
        }
      })
    },
    //料号组
    setPartFamilyAll({ commit, state }, S_PartFamilyTypeID) {
      if (state.PartFamilyAll.length) return
      GetPartFamilyAll({ S_PartFamilyTypeID: S_PartFamilyTypeID }).then(res => {
        if (res.Success) {
          commit('setPartFamilyAll', res.ResData)
        }
      })
    },
    //料号
    setPartNumberAll({ commit, state }, S_PartFamilyID) {
      if (state.PartNumberAll.length) return
      GetPartNumberAll({ S_PartFamilyID: S_PartFamilyID }).then(res => {
        if (res.Success) {
          commit('setPartNumberAll', res.ResData)
        }
      })
    },
    //工站类别
    setStationTypeAll({ commit, state }) {
      if (state.StationTypeAll.length) return
      GetStationTypeAll().then(res => {
        if (res.Success) {
          commit('setStationTypeAll', res.ResData)
        }
      })
    },
    //工站
    setStationAll({ commit, state }, S_StationTypeID) {
      if (state.StationAll.length) return
      GetStationAll({ S_StationTypeID: S_StationTypeID }).then(res => {
        if (res.Success) {
          commit('setStationAll', res.ResData)
        }
      })
    },
    //线别
    setLineAll({ commit, state }) {
      if (state.LineAll.length) return
      GetLineAll().then(res => {
        if (res.Success) {
          commit('setLineAll', res.ResData)
        }
      })
    },
    //工单
    setProductionOrderAll({ commit, state }, S_PartID) {
      if (state.ProductionOrderAll.length) return
      GetProductionOrderAll({ S_PartID: S_PartID }).then(res => {
        if (res.Success) {
          commit('setProductionOrderAll', res.ResData)
        }
      })
    },
  },
  getters: {
    timeOptions: state => state.timeOptions,
    dataLevelOptions: state => state.dataLevelOptions,
    PartFamilyTypeOptions: state => state.PartFamilyTypeOptions,
    PartFamilyOptions: state => state.PartFamilyOptions,
    PartNumberOptions: state => state.PartNumberOptions,
    ProductionOrderOptions: state => state.ProductionOrderOptions,
    StationTypeOptions: state => state.StationTypeOptions,
    StationOptions: state => state.StationOptions,
    LineOptions: state => state.LineOptions,
    ShiftOptions: state => state.ShiftOptions,
    PartFamilyTypeAll: state => state.PartFamilyTypeAll,
    PartFamilyAll: state => state.PartFamilyAll,
    PartNumberAll: state => state.PartNumberAll,
    StationTypeAll: state => state.StationTypeAll,
    StationAll: state => state.StationAll,
    LineAll: state => state.LineAll,
    ProductionOrderAll: state => state.ProductionOrderAll,
    UnitState: state => state.UnitState,
    StationState: state => state.StationState,
    MesLine: state => state.MesLine,
    MesStation: state => state.MesStation,
    UserTypes: state => state.UserTypes,
    MesPartFamilyType: state => state.MesPartFamilyType,
    LuUnitStatus: state => state.LuUnitStatus,
    YieldLevel: state => state.YieldLevel,
    IsCombineYield: state => state.IsCombineYield,
    IsUnit: state => state.IsUnit,
    isFullScreen: state => state.isFullScreen
  }
}
