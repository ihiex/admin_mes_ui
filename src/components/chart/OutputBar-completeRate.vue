<template>
  <div class="output_bar">
    <el-carousel class="chart_box" :autoplay="autoplay" :interval="interval" indicator-position="none" height="100%"
      width="100%" @change="handleCarouselChange">
      <el-carousel-item v-for="(item, index) in carouselItem" :key="index">
        <div
          style="height: 46px; line-height: 46px; color: black; font-size: 24px; font-weight: 800; position: relative;"
          @click="test">
          {{ item[0].DataLevel }} {{ shiftText }}
          <span style="position: absolute; right: 10px;">{{ dateTime }}</span>
        </div>
        {{ computeHeight(item, index) }}
        <div class="show_content">
          <div class="table_content" :class="tableAutoClass + index">
            <!-- :key="refreshKey" -->
            <el-table :data="item" border height="100%" size="mini" :span-method="objectSpanMethod"
              :row-style="handleRowStyle">
              <el-table-column v-for="(h, i) in tableHead" :key="i" :prop="h"
                :label="h === 'UPHTarget' ? 'UPH' : h.split(/\s/g).pop()" :min-width="h == 'UPHTarget' ? '60' : '100'"
                :fixed="h === 'StationType' || h === 'type' || h === 'UPHTarget' ? true : false">
                <template slot-scope="scope">
                  <!-- :style="{ color: ((scope.row.type == 'Input' && scope.row.IsRPTYield == 1) || scope.row.type == 'Output') && scope.row[h] < scope.row.UPHTarget ? 'red' : '' }" -->
                  <span v-if="!isNaN(scope.row[h])" style="cursor: pointer;" @click="handleGoToRawData(scope.row, h)">
                    {{ scope.row[h] }}
                    <!-- <el-progress style="position: relative; top: 3px" :width="14" type="circle" :stroke-width="3" :percentage="'25'" :show-text="false" :title="125 + '%'"></el-progress> -->
                  </span>
                  <span v-else>
                    {{ scope.row[h] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="chart_content" :class="chartAutoClass + index" style="border: 1px solid #fff;">
            <div class="target_input">
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <div style="display: inline-block; margin: 0 10px">top:</div>
                  <el-input v-model="target" type="number" style="width: 160px" @input="handleTargetInput"></el-input>
                  <div style="margin: 10px;">
                    <el-switch v-model="isShowRow" active-text="显示完成率" inactive-text="隐藏完成率" @change="handleSwitchChange">
                    </el-switch>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div :id="ids[index]" style="height: 100%;">
              {{ handleShowChart(carouselItem[index], ids[index], target) }}
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { uuid, downloadFile, getTimeChangeTimeRangeNew } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

export default {
  name: 'OutputBar',
  data() {
    let target = localStorage.getItem('OutputBarTarget')
    return {
      chartContext: {},
      carouselItem: [],
      dateTime: '',
      tableHead: [],
      ids: [],
      shiftText: 'AllShift',
      time: null,
      interval: 1000 * 30,
      autoplay: true,
      dataList: {},
      filters: [],
      params: {},
      cacheParams: {},
      tableKey: {},
      tableAutoClass: uuid(),
      chartAutoClass: uuid(),
      refreshKey: uuid(),
      target: target ? target : 98,
      time1: null,
      time2: null,
      isShowRow: true,
      cacheObj:{}
    }
  },
  activated() {
    this.handleWindowResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    //
    for (let key in this.chartContext) {
      this.chartContext[key] && this.chartContext[key].dispose()
    }
  },
  methods: {
    handleSwitchChange(){
        this.show(this.cacheObj.data, this.cacheObj.levelValue, this.cacheObj.shift, this.dateTime, this.cacheParams)
    },
    handleTargetInput(val) {
      if (!val) return;
      localStorage.setItem('OutputBarTarget', val)

      this.carouselItem.forEach((res, index) => {

        this.handleShowChart(res, this.ids[index], val)
      })
    },
    test() {
      console.log(this.carouselItem)
      console.log(this.dataList)
    },
    computeHeight(list, index) {
      let _this = this
      setTimeout(function () {
        let th = document.querySelector('.' + _this.tableAutoClass + index + ' ' + '.el-table').clientHeight
        let td = document.querySelector('.' + _this.tableAutoClass + index)
        let tc = document.querySelector('.' + _this.chartAutoClass + index)
        let ch = list.length * 24 + 40
        if (ch <= th + 2) {
          td.style.height = ch + 'px'
          tc.style.height = 'calc(100% - ' + ch + 'px )'
        } else {
          td.style.height = '80%'
          tc.style.height = '20%'
        }
        _this.handleWindowResize()

        // _this.refreshKey = uuid()
      })
    },
    handleGoToRawData(item, time) {
      switch (item.type) {
        case 'Output':
          this.$set(this.params, 'S_UnitStatusID', [1])
          break;
        case 'NG':
          this.$set(this.params, 'S_UnitStatusID', [2])
          break;
        case 'SCRAP':
          this.$set(this.params, 'S_UnitStatusID', [3])
          break;
        default:
          this.$set(this.params, 'S_UnitStatusID', [])
      }
      this.$set(this.params, 'S_PartFamilyTypeID', item.PartFamilyTypeID ? [item.PartFamilyTypeID] : '')
      this.$set(this.params, 'S_ProductionOrderID', item.ProductionOrderID ? [item.ProductionOrderID] : '')
      this.$set(this.params, 'S_StationTypeID', item.StationTypeID ? [item.StationTypeID] : '')
      this.$set(this.params, 'S_PartID', item.PartID ? [item.PartID] : '')
      this.$set(this.params, 'S_LineID', item.LineID ? [item.LineID] : '')
      this.$set(this.params, 'S_Type', 'RawData')
      this.$set(this.params, 'Shift', this.params.S_Shift)
      this.$set(this.params, 'S_PageIndex', 1)
      this.$set(this.params, 'S_PageQTY', 100)
      if (time != 'total') {
        let res = getTimeChangeTimeRangeNew(time, this.cacheParams, this.$store.getters['user/shiftTable'])
        this.$set(this.params, 'S_StartDateTime', res[0])
        this.$set(this.params, 'S_EndDateTime', res[1])
      } else {
        this.$set(this.params, 'S_StartDateTime', this.cacheParams.S_StartDateTime)
        this.$set(this.params, 'S_EndDateTime', this.cacheParams.S_EndDateTime)
      }
      this.$router.push({
        path: '/report/quality/rawData',
        name: 'RawData',
        params: this.params,
      })
    },
    handleRowStyle({ row, rowIndex }) {
      if (row.type === 'Yield') {
        return { 'background-color': '#e8e8e8' }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.isShowRow) {
        if (columnIndex === 0) {
          if (row.IsRPTYield === 0 && row.type === 'Output') {
            return {
              rowspan: this.getRowspan(row.IsRPTYield),
              colspan: 1
            };
          } else if (row.type === 'Input') {
            return {
              rowspan: this.getRowspan(row.IsRPTYield),
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }

        if (columnIndex === 1) {
          if (row.IsRPTYield === 0 && row.type === 'Output') {
            return {
              rowspan: this.getRowspan(row.IsRPTYield),
              colspan: 1
            };
          } else if (row.type === 'Input') {
            return {
              rowspan: this.getRowspan(row.IsRPTYield),
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      } else {
        if (columnIndex === 0) {
          if (row.IsRPTYield === 0 && row.type === 'Output') {
            return {
              rowspan: this.getRowspanV2(row.IsRPTYield),
              colspan: 1
            };
          } else if (row.type === 'Input') {
            return {
              rowspan: this.getRowspanV2(row.IsRPTYield),
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }

        if (columnIndex === 1) {
          if (row.IsRPTYield === 0 && row.type === 'Output') {
            return {
              rowspan: this.getRowspanV2(row.IsRPTYield),
              colspan: 1
            };
          } else if (row.type === 'Input') {
            return {
              rowspan: this.getRowspanV2(row.IsRPTYield),
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
      }
    },
    setAutoPlay(bool) {
      this.autoplay = bool;
    },
    handleExport() {
      let data = {}
      let headData = {}
      let merges = {}
      let cols = {};
      // 合并 和 宽度调整
      Object.keys(this.dataList).forEach(key => {
        let arr = [];
        let flag = this.dataList[key]?.[0]?.IsRPTYield;
        let once = true
        this.dataList[key]?.forEach((item, index) => {
          if ((item.IsRPTYield == 0 || item.IsRPTYield == 1) && flag === item.IsRPTYield && once) {
            once = false
            /*  arr.push({
               s: { c: 0, r: 0 },
               e: { c: 0, r: 0 }
             }) */
          } else if (item.IsRPTYield == 2 && flag === item.IsRPTYield && once) {
            once = false
            arr.push({
              s: { c: 0, r: 1 },
              e: { c: 0, r: index }
            })
          } else if (item.IsRPTYield == 3 && flag === item.IsRPTYield && once) {
            once = false
            arr.push({
              s: { c: 0, r: 3 },
              e: { c: 0, r: index }
            })
          } else if (item.IsRPTYield == 4 && flag === item.IsRPTYield && once) {
            once = false
            arr.push({
              s: { c: 0, r: 3 },
              e: { c: 0, r: index }
            })
          } else if (item.IsRPTYield == 5 && flag === item.IsRPTYield && once) {
            once = false
            arr.push({
              s: { c: 0, r: 4 },
              e: { c: 0, r: index }
            })
          }
          if (flag !== item.IsRPTYield) {
            once = true;
          }
          flag = item.IsRPTYield

        })
        merges[key.replaceAll(/\//g, '-')] = arr;

        let item = this.dataList[key]?.[0]
        let list = []
        Object.keys(item).forEach(res => {
          list.push({ wch: 17 })
        })
        cols[key.replaceAll(/\//g, '-')] = list;
      })

      console.log(merges)

      Object.values(this.dataList).forEach((res) => {
        data[res[0].DataLevel.replaceAll(/\//g, '-')] = res
        headData[res[0].DataLevel.replaceAll(/\//g, '-')] = this.tableHead
      })

      // getDownLoadData(data, 'xlsx', headData, merges)
      // { wch: 30 } cols

      downloadFile(
        // getDownLoadData(data, 'xlsx', headData, merges, cols),
        getDownLoadData(data, 'xlsx', headData),
        `Output_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`,
      )

      return false;
    },
    getRowspan(val) {
      switch (val) {
        case 0:
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 4;
        default:
          return 5;
      }
    },
    getRowspanV2(val) {
      switch (val) {
        case 0:
        case 1:
          return 2;
        case 2:
          return 3;
        case 3:
          return 4;
        case 4:
          return 5;
        default:
          return 6;
      }
    },
    show(data, levelValue = 3, shift = [], dateTime = new Date().format('yyyy-MM-dd hh:mm:ss'), params) {
      this.$set(this.cacheObj, 'data', data)
      this.$set(this.cacheObj, 'levelValue', levelValue)
      this.$set(this.cacheObj, 'shift', shift)
      if (params) {
        this.params = JSON.parse(JSON.stringify(params))
        this.cacheParams = params
      }
      this.dateTime = dateTime
      this.shiftText = this.getShift(shift);
      // let list = FormatData(data, levelValue);
      let InputData = this.HandleFormatData(data, levelValue, 'Input');
      let dataList = this.HandleFormatDataIntegrate(InputData.classifyItem,
        this.HandleFormatData(data, levelValue, 'Output').classifyItem,
        this.HandleFormatData(data, levelValue, 'NG').classifyItem,
        // this.HandleFormatData(data, levelValue, 'Other').classifyItem,
        this.HandleFormatData(data, levelValue, 'SCRAP').classifyItem,
        this.HandleFormatData(data, levelValue, 'Yield').classifyItem,
        // this.HandleFormatData(data, levelValue, 'UPHTarget').classifyItem,
      );

      // let copyDataList = JSON.parse(JSON.stringify(dataList))

      /*
     IsRPTYield：
     0：只显示output
     1: 只显示input
     2: 只显示input, output
     3：input, output, ng
     4: input, output, ng, SCRAP
     5：5个都显示
     */
      Object.keys(dataList).forEach(key => {
        for (let i = 0; i < dataList[key].length; i++) {
          switch (dataList[key][i].IsRPTYield) {
            case 0:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield' || dataList[key][i].type === 'Input') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 1:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield' || dataList[key][i].type === 'Output') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 2:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 3:
              if (dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 4:
              if (dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            default:
          }
        }
      })
      this.dataList = dataList //JSON.parse(JSON.stringify(dataList));

      if (this.isShowRow) {
        Object.entries(this.dataList).forEach(([key, values]) => {
          let dList = []
          let cacheValues = [];
          for (let i = 0; i < values.length; i++) {
            if (values[i].IsRPTYield == 1 && values[i].type == 'Input') {
              cacheValues = values[i]
            } else if (values[i].type == 'Output') {
              cacheValues = values[i]
            }
            if ((values[i + 1] && values[i].StationType != values[i + 1].StationType) || i == values.length - 1) {
              dList.push(values[i])

              let obj = {}
              Object.keys(cacheValues).forEach(key => {
                if (key == 'total') {
                  obj[key] = ((cacheValues.sumOutput / cacheValues.sumTarget) * 100).toFixed(1) + '%';
                } else if (key.includes('WK') || !isNaN(parseInt(key))) {
                  obj[key] = ((cacheValues[key] / cacheValues.UPHTarget) * 100).toFixed(1) + '%'
                } else {
                  obj[key] = cacheValues[key]
                }
              })
              obj.type = 'completeRate'
              dList.push(obj)
              cacheValues = {}
            } else {
              dList.push(values[i])
            }
          }
          this.$set(this.dataList, key, dList)
        })
      }

      // console.log(this.dataList)

      Object.keys(this.chartContext).forEach(key => {
        this.chartContext[key] && this.chartContext[key].dispose()
      })

      let that = this;
      this.ids = [];
      this.tableHead = [];
      this.carouselItem = [];
      this.tableHead = InputData.tableHead;
      Object.values(dataList).forEach(() => {
        this.ids.push(uuid())
      })

      this.$nextTick(function () {
        Object.values(dataList).forEach((item) => {
          if (item.length >= 20) {
            item.push({
              StationType: '',
              type: '.',
              total: ''
            })
          }
          this.carouselItem.push(item)
        })
        //没数据时直接跳过
        if (this.carouselItem.length === 0 || this.carouselItem.length === 1) {
          if (that.time1) {
            clearTimeout(that.time1)
            that.time1 = null
          }
          that.time1 = setTimeout(function () {
            that.handleCarouselChange(0)
          }, that.interval)
          return
        }
      })
      window.addEventListener('resize', this.handleWindowResize)

    },

    getShift(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },
    handleCarouselChange(val) {
      if (val == this.carouselItem.length - 1 || this.carouselItem.length == 0) {
        let that = this;
        if (that.time2) {
          clearTimeout(that.time1)
          that.time2 = null
        }
        that.time2 = setTimeout(function () {
          that.$emit('LastCarousel')
        }, that.interval)
      }
    },
    handleShowChart(item, id, target) {
      this.$nextTick(function () {
        // this.BarChart(item, id)
        this.BarChartGroup(item, id, target)
      })
    },
    HandleFormatDataIntegrate(...argument) {
      // 融合
      let obj = {};
      argument.forEach(res => {
        Object.keys(res).forEach(key => {
          if (obj[key]) {
            obj[key] = [...obj[key], ...res[key]]
          } else {
            obj[key] = [...res[key]]//.sort((a, b) => a.StationType - b.StationType)
          }
        })
      })
      //规类排序 并计算良率
      let sortObj = {};
      Object.keys(obj).forEach(res => {
        sortObj = {}
        obj[res].forEach(item => {
          if (item.type === 'Yield') {
            Object.keys(item).forEach(key => {
              if (key.includes('0') || key.includes('1') || key.includes('2')) {
                item[key] = parseFloat(item[key].toFixed(1)) + '%'
              }
              if (key === 'total') {
                item[key] = parseFloat((item.sumOutput / item.sumInput * 100).toFixed(1)) + '%'
              }
            })
          }
          if (sortObj[item.StationType]) {
            sortObj[item.StationType].push(item)
          } else {
            sortObj[item.StationType] = [item]
          }
        })
        obj[res] = JSON.parse(JSON.stringify(Object.values(sortObj).flat()))
      })
      return obj
    },
    /*
    IsRPTYield：
    0：只显示output
    1: 只显示input
    2: 只显示input, output
    3：input, output, ng
    4: input, output, ng, SCRAP
    5：5个都显示
    */
    //  图表使用
    fillData(StationType, IsRPTYield, sumInput = 0, sumOutput = 0, item) {
      // debugger
      let cItem = [];
      // 填补 缺少的行
      switch (IsRPTYield) {
        case 0:
          cItem = [{
            StationType: StationType,
            total: null,
            type: "Input"
          },
          {
            StationType: StationType,
            total: null,
            type: "NG"
          },
          {
            StationType: StationType,
            total: null,
            type: "SCRAP"
          },
          {
            StationType: StationType,
            total: 100,
            type: "Yield"
          }
          ];

          break;
        case 1:
          cItem = [{
            StationType: StationType,
            total: null,
            type: "Output"
          },
          {
            StationType: StationType,
            total: null,
            type: "NG"
          },
          {
            StationType: StationType,
            total: null,
            type: "SCRAP"
          },
          {
            StationType: StationType,
            total: 100,
            type: "Yield"
          }
          ]
          break;
        case 2:
          let total = sumOutput / sumInput
          if (total == NaN) {
            total = 0;
          } else if (total == Infinity) {
            total = 100;
          } else {
            total = total * 100;
          }
          cItem = [
            {
              StationType: StationType,
              total: null,
              type: "NG"
            },
            {
              StationType: StationType,
              total: null,
              type: "SCRAP"
            },
            {
              StationType: StationType,
              total: (total).toFixed(2),
              type: "Yield"
            }
          ]
          break;
        case 3:
          cItem = [
            {
              StationType: StationType,
              total: null,
              type: "SCRAP"
            },
            {
              StationType: StationType,
              total: 100,
              type: "Yield"
            }
          ]
          break;
        case 4:
          cItem = [
            {
              StationType: StationType,
              total: 100,
              type: "Yield"
            }
          ]
          break;
        default:
        // cItem = [item]
      }
      return cItem
    },
    /* 第二版 */
    HandleFormatData(data = [], levelValue = 3, type = 'Output') {
      if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
      let tableHead = ['StationType', 'UPHTarget', 'type'];
      data[0].forEach(res => {
        tableHead.push(res.CDate/* .split(/\s/)[1] */)
      })
      tableHead.push('total');
      /* 按时间段+ 层级分类*/
      let listObj = {};
      let listKey = Object.keys(data[1][0]);
      data[2].forEach(res => {
        let key = res.CDate.replaceAll(/\s/g, "");
        listKey.forEach(k => {
          key += '_' + res[k]
        })
        //处理异常返回的数据 作加减用
        listObj[key] = {};
        listObj[key]['CDate'] = res.CDate;
        listObj[key]['StationType'] = res.StationType;
        listObj[key]['Line'] = res.Line;
        listObj[key]['Project'] = res.Project;
        listObj[key]['PartNumber'] = res.PartNumber;
        listObj[key]['Input'] = res.Input ? res.Input : 0;
        listObj[key]['Output'] = res.Output ? res.Output : 0;
        listObj[key]['NG'] = res.NG ? res.NG : 0;
        listObj[key]['SCRAP'] = res.SCRAP ? res.SCRAP : 0;
        listObj[key]['Other'] = res.Other ? res.Other : 0;
        listObj[key]['Yield'] = res.Yield ? res.Yield : 0;
        listObj[key]['UPHTarget'] = res.UPHTarget ? res.UPHTarget : 0;
        listObj[key]['IsRPTYield'] = res.IsRPTYield;
        listObj[key]['LineID'] = res.LineID ? res.LineID : null;
        listObj[key]['PartID'] = res.PartID ? res.PartID : null;
        listObj[key]['StationTypeID'] = res.StationTypeID ? res.StationTypeID : null;
        listObj[key]['PartFamilyTypeID'] = res.PartFamilyTypeID ? res.PartFamilyTypeID : null;
        listObj[key]['ProductionOrderID'] = res.ProductionOrderID ? res.ProductionOrderID : null;
      })

      let tItem = {}
      //横向转换成表格数据
      Object.values(listObj).forEach(res => {
        let key = "";
        listKey.forEach((k, i) => {
          key += (i === 0 ? '' : '/') + res[k]
        })
        if (tItem[key]) {
          tItem[key][res.CDate] = res[type]
          tItem[key]['total'] += res[type]
          tItem[key]['sumOutput'] += res.Output
          tItem[key]['sumInput'] += res.Input
          tItem[key]['sumNG'] += res.NG
          tItem[key]['sumSCRAP'] += res.SCRAP;
          tItem[key]['sumTarget'] += res.UPHTarget;
        } else {
          tItem[key] = {};
          tItem[key]['StationType'] = res.StationType;
          tItem[key]['DataLevel'] = key;
          tItem[key][res.CDate] = res[type]
          tItem[key]['total'] = res[type]
          tItem[key]['type'] = type
          tItem[key]['sumOutput'] = res.Output
          tItem[key]['sumInput'] = res.Input
          tItem[key]['sumNG'] = res.NG
          tItem[key]['IsRPTYield'] = res.IsRPTYield;
          tItem[key]['LineID'] = res.LineID;
          tItem[key]['PartID'] = res.PartID;
          tItem[key]['StationTypeID'] = res.StationTypeID;
          tItem[key]['PartFamilyTypeID'] = res.PartFamilyTypeID;
          tItem[key]['ProductionOrderID'] = res.ProductionOrderID;
          tItem[key]['UPHTarget'] = res.UPHTarget;
          tItem[key]['sumSCRAP'] = res.SCRAP
          tItem[key]['sumTarget'] = res.UPHTarget //由前端完成计算
        }
      })
      /* 数据分屏 按层级*/
      let classifyItem = {};
      switch (levelValue) {
        case 2:
          //byStationType
          Object.values(tItem).forEach(res => {
            res.DataLevel = 'byStationType'
          })
          classifyItem['byStationType'] = Object.values(tItem);
          break;
        case 3:
          //byProject/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              tItem[key].DataLevel = tItem[key].DataLevel.split('/').shift()
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 4:
          //byProject/Line/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              let a = tItem[key].DataLevel.split('/');
              a.splice(1, 1)
              tItem[key].DataLevel = a.join('/')
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 5:
          //byProject/PN/Line/StationType
          let classifyParentItem = {}
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyParentItem[k]) {
              classifyParentItem[k].push(tItem[key])
            } else {
              classifyParentItem[k] = [tItem[key]]
            }
          })
          // console.log(classifyParentItem)
          Object.values(classifyParentItem).forEach(res => {
            res.forEach(item => {
              let kList = item.DataLevel.split('/');
              let key = kList[0] + '/' + kList[2] + '/' + kList[3];
              if (classifyItem[key]) {
                classifyItem[key].push(item)
              } else {
                let a = item.DataLevel.split('/');
                a.splice(1, 1)
                item.DataLevel = a.join('/')
                classifyItem[key] = [item]
              }
            })
          })
          break;
        default:
          classifyItem = {};
      }
      return { classifyItem, tableHead }
    },
    BarChartGroup(item, id, target = 0) {
      item = JSON.parse(JSON.stringify(item));

      for (let i = 0; i < item.length; i++) {
        if (item[i].type == '.' || item[i].type == 'completeRate') {
          item.splice(i, 1);
          i--
        }
      }

      let xAxis = Array.from(new Set(item.map(res => res.StationType)));
      // 去掉无效label
      xAxis.forEach((res, index) => {
        if (!res) {
          xAxis.splice(index, 1)
        }
      })

      let itemList = {};
      let fillItem = [];

      // 填充数据
      item.forEach(res => {
        let arr = this.fillData(res.StationType, res.IsRPTYield, res.sumInput, res.sumOutput, res);
        fillItem = [...fillItem, ...arr]
      })
      fillItem = [...fillItem, ...item]

      // 按xAxis排序
      let sortList = [];
      xAxis.forEach(StationType => {
        fillItem.forEach(item => {
          if (item.StationType === StationType) {
            sortList.push(item)
          }
        })
      })

      // 转成echart 数据
      sortList.forEach(res => {
        if (itemList[res.type]) {
          itemList[res.type].push(res.total === null ? null : parseFloat(res.total))
        } else {
          itemList[res.type] = [res.total === null ? null : parseFloat(res.total)]
        }
      })


      this.chartContext[id] = echarts.init(
        document.querySelector(`#${id}`),
        { renderer: 'svg' }
      )

      let listObj = {};
      ["Input", "Output", "NG", "SCRAP", "Yield"].forEach(key => {
        listObj[key] = itemList[key];
      })

      const colors = ['#5470C6', '#91CC75', '#44f0cf', '#EE6666', '#222222'];
      let option = {
        color: colors,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          right: '90',
          left: '60',
          top: '60',
          bottom: '30'
        },
        legend: {
          data: Object.keys(listObj),
          top: '10'
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              interval: 0,
              overflow: 'truncate',
              width: 90,
              ellipsis: '...',
              // rotate: -90
            },
            alignTicks: true,
            data: xAxis,
            /*  axisLabel: {
               show: true,
               overflow: 'truncate',
               // rotate: -45,
               ellipsis: '...',
               height: 60,
               width: 70
             } */
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'quantity',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[0]
              }
            },
            axisTick: {
              show: true,
            },
            splitLine: {
              show: false,
            },
          },
          {
            type: 'value',
            name: 'Yield',
            position: 'right',
            alignTicks: true,
            max: 100,
            interval: 20,
            min: 0,
            splitLine: {
              show: true,
            },
            axisTick: {
              show: true,
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: colors[1]
              }
            },
            axisLabel: {
              formatter: '{value} %'
            }
          }
        ],
        series: []
      };

      Object.keys(listObj).forEach(key => {
        if (key === 'Yield') {
          option.series.push(
            {
              name: key,
              type: 'line',
              yAxisIndex: 1,
              tooltip: {
                valueFormatter: value => value + ' %'
              },
              label: {
                show: true,
                formatter: '{c} %',
              },
              data: listObj[key],
              markLine: {
                symbol: 'none',
                show: false,
                label: {
                  position: 'end',
                  show: true,
                  color: 'red',
                  ellipsis: 'target',
                  formatter: `target {c}%`,
                },
                silent: true,
                data: [
                  {
                    lineStyle: {
                      type: 'dashed',
                      color: '#fa3934',
                    },
                    name: 'target',
                    yAxis: target,
                  },
                ],
              },
            }
          )
        } else {
          // if (key === 'SCRAP') {
          //   option.series.push(
          //     {
          //       name: key,
          //       type: 'bar',
          //       itemStyle: {
          //         color: '#EE6666',
          //       },
          //       data: listObj[key]
          //     }
          //   )
          // } else {
          option.series.push(
            {
              name: key,
              type: 'bar',
              data: listObj[key]
            }
          )
          // }

        }
      })

      this.chartContext[id].setOption(option);
    },

    //第一版
    FormatData(data = [], levelValue = 3) {
      if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
      let tableHead = ['StationType'];
      data[0].forEach(res => {
        tableHead.push(res.CDate/* .split(/\s/)[1] */)
      })
      tableHead.push('total');
      /* 按时间段+ 层级分类*/
      let listObj = {};
      let listKey = Object.keys(data[1][0]);
      data[2].forEach(res => {
        let key = res.CDate.replaceAll(/\s/g, "");
        listKey.forEach(k => {
          key += '_' + res[k]
        })
        // if (listObj[key]) {
        //   listObj[key].Input += res.Input ? res.Input : 0;
        //   listObj[key].Output += res.Output ? res.Output : 0;
        //   listObj[key].NG += res.NG ? res.NG : 0;
        // } else {
        listObj[key] = {};
        listObj[key]['CDate'] = res.CDate;
        listObj[key]['StationType'] = res.StationType;
        listObj[key]['Line'] = res.Line;
        listObj[key]['Project'] = res.Project;
        listObj[key]['PartNumber'] = res.PartNumber;
        listObj[key]['Input'] = res.Input ? res.Input : 0;
        listObj[key]['Output'] = res.Output ? res.Output : 0;
        listObj[key]['NG'] = res.NG ? res.NG : 0;
        // }
      })

      let tItem = {}
      //横向转换成表格数据
      Object.values(listObj).forEach(res => {
        let key = "";
        listKey.forEach((k, i) => {
          key += (i === 0 ? '' : '/') + res[k]
        })
        if (tItem[key]) {
          tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
          tItem[key]['total'] += res.Output
        } else {
          tItem[key] = {};
          tItem[key]['StationType'] = res.StationType;
          tItem[key]['DataLevel'] = key;
          tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
          tItem[key]['total'] = res.Output
        }
      })

      /* 数据分屏 按层级*/
      let classifyItem = {};
      switch (levelValue) {
        case 2:
          //byStationType
          Object.values(tItem).forEach(res => {
            res.DataLevel = 'byStationType'
          })
          classifyItem['byStationType'] = Object.values(tItem);
          break;
        case 3:
          //byProject/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              tItem[key].DataLevel = tItem[key].DataLevel.split('/').shift()
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 4:
          //byProject/Line/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').pop()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              let a = tItem[key].DataLevel.split('/');
              a.splice(1, 1)
              tItem[key].DataLevel = a.join('/')
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 5:
          //byProject/PN/Line/StationType
          let classifyParentItem = {}
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').pop()
            if (classifyParentItem[k]) {
              classifyParentItem[k].push(tItem[key])
            } else {
              classifyParentItem[k] = [tItem[key]]
            }
          })
          // console.log(classifyParentItem)
          Object.values(classifyParentItem).forEach(res => {
            res.forEach(item => {
              let kList = item.DataLevel.split('/');
              let key = kList[2] + '/' + kList[3];
              if (classifyItem[key]) {
                classifyItem[key].push(item)
              } else {
                let a = item.DataLevel.split('/');
                a.splice(1, 1)
                item.DataLevel = a.join('/')
                classifyItem[key] = [item]
              }
            })
          })
          break;
        default:

      }

      // console.log(classifyItem)

      return { classifyItem, tableHead }
    },
    BarChart(item, id) {
      // debugger
      let data = { xAxis: item.map(res => res.StationType), list: item.map(res => res.total) }
      this.chartContext[id] = echarts.init(
        document.querySelector(`#${id}`),
        { renderer: 'svg' }
      )
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '5%',
          right: '5%',
          bottom: '40',
          containLabel: true
        },
        /*    dataZoom: [
             {
               type: 'inside'
             },
             {
               type: 'slider'
             }
           ], */
        xAxis: [
          {
            type: 'category',
            data: data.xAxis,
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              show: true,
              overflow: 'truncate',
              // rotate: -45,
              ellipsis: '...',
              height: 60,
              width: 70
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'top'
            },
            data: data.list
          }
        ]
      };

      this.chartContext[id].setOption(option);
      // let that = this;
      /*  window.addEventListener('resize', function () {
         that.chartContext[id].resize();
       }); */
    },

    handleWindowResize() {
      let that = this
      if (that.time) {
        clearTimeout(that.time)
      }
      that.time = setTimeout(() => {
        for (let key in that.chartContext) {
          that.chartContext[key] &&
            that.chartContext[key].resize({
              animation: {
                duration: 3,
              },
            })
        }
      }, 1000)
    },
  },
}
</script>

<style lang="scss" scoped>
.link_class {
  border-bottom: 1px solid #415fff;
  color: #415fff;
  cursor: pointer;
}

.output_bar {
  height: inherit;
  min-height: 440px;
  width: inherit;

  .chart_box {
    height: inherit;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    .show_content {
      height: calc(100% - 46px) !important;
      box-sizing: border-box;

      .table_content {
        height: 80%;
      }

      .chart_content {
        height: 20%;
        position: relative;

        .target_input {
          position: absolute;
          z-index: 100;
          top: 10px;
          right: 10px;
        }
      }
    }
  }
}

::v-deep {
  .el-carousel__button {
    background-color: red;
  }

  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #222;
  }

  .el-table--border .el-table__cell {
    border-right: 1px solid #222;
  }

  .el-table__row {
    margin-bottom: 10px;
  }
}
</style>
