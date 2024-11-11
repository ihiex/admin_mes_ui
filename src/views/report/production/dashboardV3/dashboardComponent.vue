<template>
  <div v-loading="loading" class="page_container">
    <el-container class="main_container">
      <el-header class="header">
        <div class="header_left">
          <el-popover v-model="visible" style="position: absolute; left: 15px; top:10px;z-index: 101;" width="900"
            placement="bottom" trigger="click">
            <div>
              <query-condition :key="qKey" v-model="$store.state.reportParams.paramsV3"
                :is-show-data-level="true"></query-condition>
              <div style="text-align: right; padding-top: 10px;">
                <el-switch v-model="$store.state.reportParams.isAutoV3" :active-text="$t('Auto')"
                  :inactive-text="$t('UnAuto')" style="margin-right: 20px;">
                </el-switch>
                <el-button @click="handleReset">{{ $t('reset') }}</el-button>
                <el-button type="primary" @click="handleQuery(true)">{{ $t('query') }}</el-button>
              </div>
            </div>
            <el-button slot="reference" icon="el-icon-search" circle type="text"></el-button>
          </el-popover>
        </div>
        <div class="header_middle">
          {{ $t('DashboardOfProductionLine') }}
        </div>
        <div class="header_right" @click="test">
          {{ dateTiming }}
        </div>
      </el-header>
      <el-container class="container">
        <el-main class="main">
          <div class="main_top">
            <div class="main_top_left">
              <div :id="BarChart" style="height: 100%; width: 100%"></div>
              <div style="height: 20px; width: 20px; position: absolute; top: 5px; left: 0; text-align: center">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon-setting"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <div style="display: inline-block; margin: 0 5px">target:</div>
                    <el-input v-model="capacityTarget" type="number" style="width: 80px"
                      @input="handleOutputTarget"></el-input>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
            <div class="main_top_middle">
              <div class="main_top_left_top">
                <div class="select_box">
                  <el-select v-model="params.date" size="mini" placeholder="请选择"
                    style="width: 180px; margin-right: 5px;" @change="handleDateChange">
                    <el-option v-for="item in dateArray" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>

                  <el-select v-model="params.line" size="mini" placeholder="请选择" style="width: 180px"
                    @change="handleSelectLine">
                    <el-option v-for="item in lineOptions" :key="item" :label="item" :value="item">
                    </el-option>
                  </el-select>

                </div>
                <div class="main_top_show_number">
                  <div>
                    <el-statistic group-separator="," :value="FQCDailyOutput" title=""></el-statistic>
                    <i class="line"></i>
                  </div>
                  <div>
                    {{ dailyOverallYield }}%
                  </div>
                </div>
                <div class="main_top_show_number_describe">
                  <div>{{ daily }} Output</div>
                  <div>{{ daily }} Overall Yield</div>
                </div>
              </div>
              <div class="main_top_left_bottom">
                <el-table :id="TableId" :data="tableDataV2" size="mini" :border="false"
                  style="width: 105%; background-color: transparent;" height="98%" row-class-name="row_class_name"
                  header-row-class-name="row_class_name" header-cell-class-name="row_class_name"
                  @mouseenter.native="autoScroll(true)" @mouseleave.native="autoScroll(false)">
                  <el-table-column prop="StationType" label="Station" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="Input" label="Input" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="Output" label="Output" show-overflow-tooltip align="center">
                  </el-table-column>
                  <el-table-column prop="Yield" label="Yield" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                      {{ percentageFormat(scope.row.Yield) }}
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div class="main_top_right">
              <div :id="LineChart" style="height: 100%; width: 100%;"></div>
              <div style="height: 20px; width: 20px; position: absolute; top: 5px; right: 0; text-align: center">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down el-icon-setting"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <div style="display: inline-block; margin: 0 5px">yield:</div>
                    <el-input v-model="yieldTarget" type="number" style="width: 80px"></el-input>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
          <div class="main_bottom">
            <div class="main_bottom_left">
              <div :id="PieChart" style="height: 96%;width: 100%;">

              </div>
            </div>
            <div class="main_bottom_right">
              <div :id="DefectByColorChart" style="height: 100%; width: 100%;"></div>
              <el-dropdown>
                <span class="el-dropdown-link">
                  <i class="el-icon-arrow-down el-icon-setting"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <div style="display: inline-block; margin: 0 5px">top:</div>
                  <el-input v-model="$store.state.reportParams.paramsV3.S_TopQTY" type="number" style="width: 80px"
                    @input="handleTopInput"></el-input>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GetDefectYield, GetUPH } from '@/api/report.js'
import QueryCondition from '@/components/QueryCondition'
import { getTimeChangeTimeRangeNew, uuid, sleep } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Test',
  components: {
    QueryCondition
  },
  data() {
    /*  let date = new Date()
     let sDate = new Date(date.setDate(date.getDate() - 6)).format(
       'yyyy-MM-dd 00:00:00'
     ) */
    /*  let shift = getShift(this.$store.getters['user/shiftTable'])
     let s = getUserShift(this.$store.getters['user/shiftTable']); */
     let capacityTarget = localStorage.getItem('CapacityTargetBySoftGoods');
     let yieldTarget = localStorage.getItem('YieldTargetBySoftGoods')
    return {
      LineChart: uuid(),
      LineAndBarChart: uuid(),
      PieChart: uuid(),
      BarChart: uuid(),
      BottomBarChart: uuid(),
      DefectByColorChart: uuid(),
      dateTiming: new Date().format('yyyy-MM-dd hh:mm:ss'),
      timer: null,
      qKey: uuid(),
      TableId: uuid(),
      params: {
        date: '', //new Date(sDate).format('yyyy-MM-dd'),//new Date().format('yyyy-MM-dd'),
        radio: 1,
        selectVal: 'OP ID',
        line: ''
      },
      tableData: [],
      cacheTableData: {},
      options: [{
        value: 'OP ID',
        label: 'OP ID'
      }, {
        value: 'Machine',
        label: 'Machine'
      }, {
        value: 'Fixture',
        label: 'Fixture'
      }],
      chartContext: {},

      dateArray: [],
      lineOptions: [],
      cacheOverAllYield: {},
      dailyOverallYield: '--',
      FQCDailyOutput: 0,
      cacheCapacity: {},
      loading: false,
      carouselData: {},
      visible: false,
      time: null,
      capacityTarget: capacityTarget ? capacityTarget : 4500,
      yieldTarget: yieldTarget ? yieldTarget : 99.9,
      daily: '',
      lineTimer: null,
      lineIndex: 0,
      defectParams: {},
      tableDataV2: [],
      chartTimeout: null
    }
  },
  computed: {
    ...mapGetters({
      YieldLevelOptions: 'common/YieldLevel',
      timeOptions: 'common/timeOptions',
      commonParams: 'reportParams/params'
    })
  },
  watch: {
    '$store.state.reportParams.isAutoV3': function (val, oval) {
      if (val) {
        this.handleReset()
        this.handleSetIntervalAuto(val)
      } else {
        this.lineTimer && clearInterval(this.lineTimer);
      }
    },
    "$store.state.reportParams.paramsV3.S_StartDateTime": function (val, oval) {
      this.$set(this.params, 'date', new Date(val).format('yyyy-MM-dd'))
    },
    tableData: function (val, oval) {
      // console.log(val)
      this.getDailyDataOutput(val)
    },
    tableDataV2: function (val, oval) {
      this.getDailyDataOverallYield(val)
    },
    "$store.state.reportParams.paramsV3.S_DataType": function (val, oval) {
      this.daily = this.timeOptions.find(r => r.value === val).label
    },
    yieldTarget: function (val, oval) {
      this.handleYieldTarget(val)
    },
  },
  activated() {
    this.startTimer();
  },
  deactivated() {
    this.handleClearTimer();
  },
  mounted() {

    this.start()
    window.addEventListener('resize', this.handleChartResize)
  },
  beforeDestroy() {
    this.handleClearTimer();
    this.autoScroll(true);
    this.handleRemoveWindowResize()
  },
  methods: {
    test(val) {
      console.log(this.lineOptions)
      console.log(this.cacheTableData)
      console.log(val)
    },
    start() {
      this.qKey = uuid();
      this.startTimer();
      this.autoScroll(false)
      this.daily = this.timeOptions.find(r => r.value === this.$store.state.reportParams.paramsV3.S_DataType)?.label
      this.handleQuery(true)
    },
    handleRemoveWindowResize() {
      window.removeEventListener('resize', this.handleChartResize)
    },
    handleChartResize() {
      let dom = document.querySelector('.dashboard_page')
      let dom_full = document.querySelector('.dashboard_full_page')
      dom.style.height = '98%';
      dom_full.style.height = '98%';
      let _this = this;
      _this.chartTimeout && clearTimeout(_this.chartTimeout)
      _this.chartTimeout = setTimeout(function () {
        Object.keys(_this.chartContext).forEach(key => {
          dom.style.height = '100%';
          dom_full.style.height = '100%';
          if (_this.chartContext[key]) {
            _this.chartContext[key].resize()
          }
        })

      }, 500)
    },
    startTimer() {
      let _this = this
      _this.timer && clearInterval(_this.timer);
      _this.timer = setInterval(() => {
        _this.dateTiming = new Date().format('yyyy-MM-dd hh:mm:ss')
      }, 1000);

      this.handleSetIntervalAuto(this.$store.state.reportParams.isAutoV3)
    },
    handleClearTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null;
      }
      if (this.time) {
        clearInterval(this.time);
        this.time = null
      }
      if (this.lineTimer) {
        clearInterval(this.lineTimer);
        this.lineTimer = null;
      }
      this.autoScroll(true)
    },

    handleSetIntervalAuto(auto) {
      let _this = this;
      _this.lineTimer && clearInterval(_this.lineTimer);
      if (auto) {
        _this.lineTimer = setInterval(() => {
          _this.$set(_this.params, 'line', _this.lineOptions[_this.lineIndex++])
          _this.handleSelectLine(_this.params.line)
          if (_this.lineIndex > _this.lineOptions.length) {
            _this.lineIndex = 0;
            _this.handleQuery(false)
          }
        }, 1000 * 20)
      }
    },

    // Overall yield target
    handleYieldTarget(val) {
      localStorage.setItem('YieldTargetBySoftGoods', val)
      this.setTargetValue(this.cacheOverAllYield, val)
      let seriesName = this.YieldLevelOptions?.find(item => item.value == this.$store.state.reportParams.paramsV3.YieldLevel)?.label

      this.setLineChart(this.LineChart, {
        seriesData: this.cacheOverAllYield[this.params.line]?.value,
        target: this.cacheOverAllYield[this.params.line]?.target,
        axis: this.formatAxis(this.dateArray) //.map(value => value.split('-').splice(1).join('-'))
      }, seriesName)
    },
    // Capacity target
    handleOutputTarget(val) {
      if (isNaN(val)) return;
      localStorage.setItem('CapacityTargetBySoftGoods', val)
      this.setTargetValue(this.cacheCapacity, val)

      this.setBarChart(this.BarChart, {
        seriesData: this.cacheCapacity[this.params.line]?.value,
        target: this.cacheCapacity[this.params.line]?.target,
        axis: this.formatAxis(this.dateArray) //.map(value => value.split('-').splice(1).join('-'))
      })
    },

    setTargetValue(obj, val) {
      Object.values(obj).forEach(item => {
        if (!item.flag) {
          item.value.forEach((value, index) => {
            if (value) {
              // if (item.value[index]) {
              item.target[index] = val
              // }
            }
          })
        }
      })
    },

    handleQuery(flag) {
      this.visible = false

      if (this.$store.state.reportParams.isAutoV3) {
        /*  let shift = getShift(this.$store.getters['user/shiftTable'])
         let s = getUserShift(this.$store.getters['user/shiftTable']);
         this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
         this.$set(this.query, 'S_Shift', s)
         this.$set(this.query, 'S_StartDateTime', shift.sTime) */
        let date = new Date()
        let sDate = new Date(date.setDate(date.getDate() - 6)).format(
          'yyyy-MM-dd 00:00:00'
        )
        let query = this.$store.state.reportParams.paramsV3
        this.$set(query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
        this.$set(query, 'S_StartDateTime', sDate)
        this.$store.dispatch('reportParams/setParamsV3', query)
      }

      if (flag) {
        this.lineIndex = 0;
      }

      // this.handleSetIntervalAuto(this.$store.state.reportParams.isAutoV3)
      this.handleSearch(flag)
    },

    handleReset() {
      // let shift = getShift(this.$store.getters['user/shiftTable'])
      // let s = getUserShift(this.$store.getters['user/shiftTable']);
      let date = new Date()
      let sDate = new Date(date.setDate(date.getDate() - 6)).format(
        'yyyy-MM-dd 00:00:00'
      )
      this.$set(this.params, 'S_StartDateTime', sDate)
      this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.params, 'S_DataType', '0')
      this.$set(this.params, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.params, 'S_PartFamilyID', null) //料号组
      this.$set(this.params, 'S_PartID', null) //料号
      this.$set(this.params, 'S_ProductionOrderID', null) //工单
      this.$set(this.params, 'S_StationTypeID', null) //工站类型
      this.$set(this.params, 'S_StationID', null) //工站
      this.$set(this.params, 'S_LineID', null) //产线
      this.$set(this.params, 'S_Shift', null) //班次
      this.$set(this.params, 'S_DataLevel', 4) //
    },
    handleTopInput(val) {
      if (isNaN(val)) return;
      localStorage.setItem('DefectTopBySoftGoods', val)
      this.getDefectYield(this.defectParams[this.params.line]?.[this.params.date], this.params.date)
    },
    percentageFormat(val) {
      // if (!val) return;
      // val += "";
      if ((val + '').includes('.')) {
        return val.toFixed(2) + '%'
      } else {
        return val + '%'
      }
    },

    getTableDataV2(line, date) {
      let l = line?.split('/')
      let k = "";
      this.tableDataV2 = [];

      if (l && l.length == 1) {
        return this.tableDataV2 = this.cacheTableData[line]?.[date]
      } else {
        l = l?.slice(0, l.length - 1)
        k = l?.join('/')
      }
      if (!k) return this.tableDataV2 = [];

      Object.keys(this.cacheTableData).forEach(key => {
        if (key.includes(k)) {
          // this.tableDataV2 = [...this.tableDataV2, ...this.cacheTableData[key][date]];
          this.cacheTableData?.[key]?.[date]?.forEach(item => {
            this.tableDataV2.push(item)
          })
        }
      })
    },

    handleSelectLine(val) {
      this.tableData = this.cacheTableData[val]?.[this.params.date]

      this.getTableDataV2(val, this.params.date)
      let seriesName = this.YieldLevelOptions?.find(item => item.value == this.$store.state.reportParams.paramsV3.YieldLevel)?.label
      // overall yield
      this.setLineChart(this.LineChart, {
        seriesData: this.cacheOverAllYield[val]?.value,
        target: this.cacheOverAllYield[val]?.target,
        axis: this.formatAxis(this.dateArray) //.map(value => value.split('-').splice(1).join('-'))
      },
        seriesName
      )

      // capacity
      this.setBarChart(this.BarChart, {
        seriesData: this.cacheCapacity[val]?.value,
        target: this.cacheCapacity[val]?.target,
        axis: this.formatAxis(this.dateArray) //.map(value => value.split('-').splice(1).join('-'))
      })
      // Top 10 Defect
      this.params.date && this.getDefectYield(this.defectParams[val]?.[this.params.date], this.params.date)

      let index = this.lineOptions.findIndex(value => value == val);
      if (index + 1 >= this.lineOptions.length - 1) {
        this.lineIndex = 0;

        let _this = this;
        setTimeout(function () {
          _this.handleQuery(false)
        }, 1000 * 10)

      } else {
        this.lineIndex = ++index;
      }

    },
    getDefectYield(itemInfo, date) {
      let params = JSON.parse(JSON.stringify(this.$store.state.reportParams.paramsV3))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      let res = getTimeChangeTimeRangeNew(date, params, this.$store.getters['user/shiftTable'])
      this.$set(params, 'S_StartDateTime', res[0])
      this.$set(params, 'S_EndDateTime', res[1])

      itemInfo && Object.keys(itemInfo).forEach(key => {
        this.$set(params, key, itemInfo[key]);
      })

      GetDefectYield(params, '', true).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          this.setPieChart(this.PieChart, data[6])
          this.handleDefectByColor(
            data[3],
            `Top ${params.S_TopQTY} Defect By Color`,
            data[5]
          )
        }
        // this.loading = false
      })
    },
    handleSearch(flag) {
      // this.show = false
      let params = JSON.parse(JSON.stringify(this.$store.state.reportParams.paramsV3))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }

      //清空数据
      this.cacheTableData = {}
      this.tableData = []
      flag && (this.loading = true)
      // GetUPHYield(params, null, true).then((res) => {
      // 清空defect 图表
      this.setPieChart(this.PieChart, [])
      this.handleDefectByColor(
        [],
        `Top ${params.S_TopQTY} Defect By Color`,
        []
      )
      this.tableDataV2 = []

      GetUPH(params, true).then((res) => {
        try {
          let data = res.ResData;
          // console.log(data);
          if (res.Success) {
            this.dateArray = data?.[0]?.map(r => r.CDate)
            // let typeGroup = data?.[3]?.map(r => { return r.Project + (r.Line ? ',' : '') + r.Line + (r.StationType ? ',' : '') + r.StationType + (r.PartNumber ? ',' : '') + r.PartNumber })
            // let tg = data?.[0]?.map(r => { return r.Project + (r.Line ? ',' : '') + r.Line + (r.StationType ? ',' : '') + r.StationType + (r.PartNumber ? ',' : '') + r.PartNumber })

            // 表格数据格式化 开始
            let obj = {};
            data?.[2]?.forEach(r => {
              let key = this.getKey(r)

              if (obj[key]) {
                if (obj[key][r.CDate]) {
                  obj[key][r.CDate].push(r)
                } else {
                  obj[key][r.CDate] = [r]
                }
              } else {
                obj[key] = {}
                obj[key][r.CDate] = [r]
              }
            })
            this.lineOptions = Object.keys(obj)
            this.$set(this.params, 'line', this.lineOptions[0])
            this.$set(this.params, 'date', this.dateArray[this.dateArray.length - 1])
            this.cacheTableData = obj
            // this.tableData = this.cacheTableData[this.params.line]?.[this.dateArray[0]]
            // 调用日期或线别都可以
            this.params.date && this.handleDateChange(this.params.date)
            // 表格数据格式 结束
            // console.log(obj)

            Object.keys(obj).forEach(key => {
              let stationTypeID = new Set();
              let lineID = new Set();
              let partID = new Set();
              this.defectParams[key] = {}

              Object.keys(obj[key]).forEach(k => {

                obj[key][k].forEach(item => {
                  stationTypeID.add(item.StationTypeID)
                  lineID.add(item.LineID)
                  partID.add(item.PartID)
                })

                this.defectParams[key][k] = {
                  S_StationTypeID: Array.from(stationTypeID).join(','),
                  S_LineID: Array.from(lineID).join(','),
                  S_PartID: Array.from(partID).join(',')
                }

                stationTypeID.clear();
                lineID.clear();
                partID.clear();
              })

            })
            // console.log(this.defectParams)

            // 最终良率数据 开始
            let oy = {} //Overall yield
            let ao = {} //Capacity
            Object.keys(obj).forEach(key => {
              /*  oy[key] = []
               ao[key] = [] */

              oy[key] = { target: [], value: [] }
              ao[key] = { target: [], value: [] }

              this.dateArray.forEach(dk => {
                if (obj[key][dk]) {
                  // debugger
                  // let input = 0;
                  // let output = 0;
                  let actualOutput = 0;
                  let targetOutput = 0;
                  let yv = 0;
                  let yt = null
                  let yFlag = false;
                  let oFlag = false;
                  obj[key][dk].forEach((item, index) => {
                    // debugger
                    // input += item.Input;
                    // output += item.Output;
                    /*  if(key == "S12/S12_Main_Line" && dk == '2021-09-24'){
                       debugger
                     } */
                    if (index == 0) {
                      yv = item.Yield / 100;
                    } else {
                      yv *= (item.Yield / 100);
                    }
                    yFlag = item.YieldTarget ? true : false;
                    yt = item.YieldTarget || parseFloat(this.yieldTarget)

                    // if (item.StationType.includes('FQC')) {
                    actualOutput += item.Output
                    oFlag = (item.UPHTarget || item.UPHTargetByHour) ? true : false;

                    let t = item.UPHTarget || item.UPHTargetByHour || parseFloat(this.capacityTarget)
                    targetOutput += t
                    // }
                  })

                  // let y = output / input * 100;
                  // oy[key].push(y?.toString()?.includes('.') ? parseFloat(y.toFixed(2)) : y)
                  yv = yv * 100;
                  oy[key].target.push(yt)
                  oy[key].value.push(yv?.toString()?.includes('.') ? parseFloat(yv.toFixed(2)) : yv)
                  oy[key].flag = yFlag

                  // ao[key].push(actualOutput)
                  ao[key].target.push(targetOutput)
                  ao[key].value.push(actualOutput)
                  ao[key].flag = oFlag

                } else {
                  /*  oy[key].push(null)
                   ao[key].push(null) */

                  oy[key].target.push(null)
                  oy[key].value.push(null)
                  oy[key].flag = false
                  ao[key].target.push(null)
                  ao[key].value.push(null)
                  ao[key].flag = false
                }
              })
            })
            this.cacheOverAllYield = oy
            this.cacheCapacity = ao

            this.handleOutputTarget(this.capacityTarget);
            this.handleYieldTarget(this.yieldTarget);
            // 最终良率数据 结束
          }
        } finally {
          this.loading = false
        }
      }, error => {
        this.loading = false
      })
    },
    handleDefectByColor(lists, title, lines) {
      let chartData = this.handleDefectByColorFormatData(lists)
      let lineObj = this.handleLinesFormatData(lines)
      this.setLineAndBarChart(
        this.DefectByColorChart,
        chartData ? chartData : { xAxis: [] },
        title,
        lineObj
      )
    },
    handleLinesFormatData(list) {
      if (!list) return []
      let arr = list.map((r) => r.CumRate)
      return arr
    },
    handleDefectByColorFormatData(lists) {
      if (!Array.isArray(lists) || lists.length == 0) return
      let xAxis = [],
        objs = {},
        series = {}

      //按接口返回的顺序获取x轴数据
      xAxis = Array.from(new Set(lists.map((res) => res.DefectCodeDesc)))
      objs.xAxis = xAxis

      //按PartNumber分类
      let PartNumberType = []
      lists.forEach((item) => {
        if (PartNumberType[item.Color + '-' + item.PartNumber]) {
          PartNumberType[item.Color + '-' + item.PartNumber].push(item)
        } else {
          PartNumberType[item.Color + '-' + item.PartNumber] = [item]
        }
      })
      let sortData = Object.keys(PartNumberType)
      /*   for (let i in PartNumberType) {
          sortData.push(i)
        } */
      sortData.sort()
      let ParNumbers = []
      sortData.forEach((res) => {
        ParNumbers[res] = PartNumberType[res]
      })
      PartNumberType = ParNumbers

      //按x轴补全PartNumber所对应的x轴数据
      for (let key in PartNumberType) {
        xAxis.forEach((res) => {
          let obj = PartNumberType[key].find((r) => r.DefectCodeDesc == res)
          if (!obj) {
            PartNumberType[key].push({
              DefectCodeDesc: res,
              DefectRate: null,
              ColorValue: '',
            })
          }
        })
      }
      //按x轴的顺序获得数据
      for (let key in PartNumberType) {
        series[key] = {}
        xAxis.forEach((res) => {
          let obj = PartNumberType[key].find((r) => r.DefectCodeDesc == res)
          if (obj) {
            if (series[key].Data) {
              obj.ColorValue && (series[key].ColorValue = obj.ColorValue)
              series[key].Data.push(obj.DefectRate)
            } else {
              series[key].ColorValue = obj.ColorValue
              series[key].Data = [obj.DefectRate]
            }
          }
        })
      }
      //计算同一柱子叠加总和
      let sums = {}
      for (let key in series) {
        series[key].Data.forEach((res, key) => {
          if (sums[key]) {
            res && (sums[key] += parseFloat(res))
          } else {
            sums[key] = parseFloat(res)
          }
        })
      }
      //保留4位小数
      let sList = []
      for (let key in sums) {
        sList.push((sums[key] + '').includes('.') ? sums[key].toFixed(4) : sums[key])
      }
      objs.series = series

      objs['sums'] = sList
      return objs
    },
    getKey(item) {
      let key = ""
      switch (this.$store.state.reportParams.paramsV3.S_DataLevel) {
        case 2:
          key = item.StationType
          break;
        case 3:
          key = item.Project + (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '')
          break;
        case 4:
          key = item.Project + (item.Line ? '/' : '') + (item.Line ? item.Line : '') + (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '')
          break;
        case 5:
          key = item.Project + (item.Line ? '/' : '') + (item.Line ? item.Line : '') + (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '') + (item.PartNumber ? '/' : '') + (item.PartNumber ? item.PartNumber : '')
          break;
        case 7:
        case 8:
          key = item.Project + (item.Line ? '/' : '') + (item.Line ? item.Line : '')
          break;
        default:
      }
      /* switch (this.$store.state.reportParams.paramsV3.S_DataLevel) {
        case 2:
          key = item.StationType
          break;
        case 3:
          key = item.Project //+ (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '')
          break;
        case 4:
          key = item.Project + (item.Line ? '/' : '') + (item.Line ? item.Line : '') //+ (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '')
          break;
        case 5:
          key = item.Project + (item.Line ? '/' : '') + (item.Line ? item.Line : '') + (item.StationType ? '/' : '') + (item.StationType ? item.StationType : '') //+ (item.PartNumber ? '/' : '') + (item.PartNumber ? item.PartNumber : '')
          break;
        case 7:
        case 8:
          key = item.Project// + (item.Line ? '/' : '') + (item.Line ? item.Line : '')
          break;
        default:
      } */
      return key;
    },
    getDailyDataOverallYield(tableList) {
      // let dailyOutput = 0;
      let dailyYield = 0;
      tableList?.forEach((item, index) => {
        // dailyOutput += item.Output
        if (index === 0) {
          dailyYield = item.Yield / 100;
        } else {
          dailyYield *= (item.Yield / 100);
        }
      })
      // this.FQCDailyOutput = dailyOutput
      dailyYield = dailyYield * 100;
      let d = dailyYield + '';
      this.dailyOverallYield = dailyYield == 0 ? '--' : (d.includes('.') ? dailyYield.toFixed(2) : dailyYield)
    },
    getDailyDataOutput(tableList) {
      let dailyOutput = 0;
      // let dailyYield = 0;
      tableList?.forEach((item, index) => {
        dailyOutput += item.Output
        /*   if (index === 0) {
            dailyYield = item.Yield / 100;
          } else {
            dailyYield *= (item.Yield / 100);
          } */
      })
      this.FQCDailyOutput = dailyOutput
      /*  dailyYield = dailyYield * 100;
       let d = dailyYield + ''; */
      // this.dailyOverallYield = dailyYield == 0 ? '--' : (d.includes('.') ? dailyYield.toFixed(2) : dailyYield)
    },
    autoScroll(stop) {
      // const table = this.$refs.scroll_Table.layout.table.refs
      // debugger

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      if (stop) {
        //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
        window.clearInterval(this.scrollTimer)
      } else {
        this.scrollTimer && clearInterval(this.scrollTimer);
        // 拿到表格中承载数据的div元素
        const divData = document.querySelector('#' + this.TableId + " .el-table__body-wrapper")
        this.scrollTimer = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
            // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
          }
        }, 200) // 滚动速度
      }
    },
    handleDateChange(val) {
      this.tableData = this.cacheTableData[this.params.line]?.[val]
      this.getTableDataV2(this.params.line, val)

      // Top 10 Defect
      this.getDefectYield(this.defectParams[this.params.line]?.[val], val)
    },
    handleSelectChange(val) {
      this.setBottomBarChart(this.BottomBarChart, 'Tearing @ Textile', val)
    },
    formatAxis(list) {
      if (!list || list.length == 0) return [];
      let arr = []
      list.forEach(item => {
        switch (this.$store.state.reportParams.paramsV3.S_DataType) {
          case '0':
            arr.push(item?.split('-')?.splice(2)?.join('-'))
            break;
          case '2':
            arr.push(item?.split(' ')?.[1])
            break;
          case '1':
            arr.push(item?.split('-')?.splice(1)?.join('-'))
            break;
          default:
            arr.push(item)
        }
      })
      return arr
    },
    setBarChart(id, data) {
      if (this.chartContext[id]) {
        this.chartContext[id].dispose()
      }

      this.chartContext[id] = echarts.init(document.querySelector('#' + id))

      const colors = ['#5470C6', '#91CC75'];
      let option = {
        color: colors,
        title: {
          text: 'Capacity',
          textStyle: {
            color: '#6ad6e1'
          },
          left: 'center',
          top: '2%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        grid: {
          bottom: "5%",
          left: "5%",
          right: "10%",
          top: "22%",
          containLabel: true
        },
        legend: {
          data: ['Output Target', 'Output Actual'],
          textStyle: {
            color: '#eee'
          },
          top: "9%"
        },
        xAxis: [
          {
            type: 'category',
            axisTick: {
              alignWithLabel: true
            },
            data: data.axis, //['09-10', '09-11', '09-12', '09-13', '09-14', '09-15'],
            axisLabel: {
              color: '#eee'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            alignTicks: true,
            axisLine: {
              show: false,
              lineStyle: {
                color: colors[0]
              }
            }
          }
        ],
        series: [
          {
            name: 'Output Target',
            type: 'bar',
            itemStyle: {
              borderRadius: [20, 20, 0, 0]
            },
            label: {
              show: true,
              position: 'inside'
            },
            data: data.target //[4500, 4500, 4500, 4500, 4500, 4500]
          },
          {
            name: 'Output Actual',
            type: 'bar',
            itemStyle: {
              borderRadius: [20, 20, 0, 0]
            },
            label: {
              show: true,
              position: 'inside',
              color: '#fff'
            },
            data: data.seriesData //[ 2807, 2707, 1756, 1822, 2487, 2188 ]
          }
        ]
      };
      this.chartContext[id].setOption(option, true)
      /*let _this = this;
     window.addEventListener('resize', () => {
       _this.chartContext[id].resize();
     }) */
    },
    setPieChart(id, data) {
      if (this.chartContext[id]) {
        this.chartContext[id].dispose()
      }
      this.chartContext[id] = echarts.init(document.querySelector('#' + id))

      let legendData = []
      let seriesData = []
      data?.forEach(res => {
        legendData.push(res.DefectCode)
        seriesData.push({ value: parseFloat(res.DefectQTYPercent), qty: res.DefectQTY, name: res.DefectCode })
      })

      let m = Math.max.apply(null, seriesData?.map(res => res.value))
      let obj = seriesData?.find(res => res.value === m)
      obj && (obj['selected'] = true);

      let option = {
        title: {
          text: 'Defect Analysis',
          left: 'center',
          textStyle: {
            color: '#6ad6e1'
          },
          top: '2%'
        },
        tooltip: {
          trigger: 'item',
          formatter: (val) => {
            // console.log(val)
            let desc = data.find(item => item.DefectCode == val.name)?.DefectCodeDesc

            return `${desc} </br> ${val.marker} ${val.name}: ${val.data.qty} (${val.value >= 0 ? val.value : '--'}%)`
          }//'{b}: {c} ({d}%)'
        },
        legend: {
          data: legendData, /* [
            'Bump @ Texti',
            'Wrinkle @ Textile',
            'Tearing @ Textile',
          ], */
          type: 'scroll',
          bottom: '5%',
          textStyle: {
            color: '#eee'
          },
          pageTextStyle: {
            color: '#fff'
          },
          pageIconColor: '#fff'
        },
        series: [
          {
            name: '',
            type: 'pie',
            selectedMode: 'single',
            radius: [0, '30%'],
            label: {
              //position: 'inner',
              fontSize: 14
            },
            data: seriesData/* [
              { value: 1548, name: 'Bump @ Texti', selected: true },
              { value: 2775, name: 'Wrinkle @ Textile' },
              { value: 679, name: 'Tearing @ Textile' }
            ] */
          }
        ]
      };
      this.chartContext[id].setOption(option, true)
      /*  let _this = this
       window.addEventListener('resize', () => {
         _this.chartContext[id].resize();
       }) */
    },
    setLineChart(id, data, seriesName) {
      // debugger
      /*  let arr = [...data.seriesData, ...data.target];
       let min = Math.max(...arr);
       let max = min;

       arr.forEach(item => {
         if (item && item < min) {
           min = item
         }
       })
       min = min - Math.ceil((max-min)/4) */

      if (this.chartContext[id]) {
        this.chartContext[id].dispose()
      }
      this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      let option = {
        title: {
          text: 'Overall Yield',
          left: 'center',
          textStyle: {
            color: '#6ad6e1'
          },
          top: '2%'
        },
        tooltip: {
          trigger: 'axis',
          formatter: val => {
            let str = val[0].name + '<br/>';
            val.forEach(item => {
              str += item.marker + ' ' + item.seriesName + ': ' + (item.value ? item.value : '--') + '%<br/>'
            })
            // return val[0].marker + ' ' + val[0].seriesName + ': ' + (val[0].value ? val[0].value : '--') + '%<br/>' + val[1].marker + ' ' + val[1].seriesName + ': ' + (val[1].value ? val[1].value : '--') + '%'
            return str;
          }
        },
        legend: {
          data: ['Target Yield', seriesName],
          textStyle: {
            color: '#eee'
          },
          top: '8%'
        },
        grid: {
          left: '5%',
          right: '12%',
          bottom: '8%',
          top: '25%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: data.axis, //['09-10', '09-11', '09-12', '09-13', '09-14', '09-15'],
          axisLabel: {
            color: '#eee'
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            color: '#eee',
            formatter: function (value, index) {
              return value + ' %';
            }
          },
          // min: min
        },
        series: [
          {
            name: 'Target Yield',
            type: 'line',
            label: {
              show: true,
              // position: 'top',
              formatter: '{c} %'
            },
            data: data.target //[99.9, 99.9, 99.9, 99.9, 99.9, 99.9]
          },
          {
            name: seriesName,
            type: 'line',
            label: {
              show: true,
              // position: 'bottom',
              formatter: '{c} %'
            },
            data: data.seriesData //[97.68, 97.46, 97.56, 97.55, 97.17, 99.1]
          }
        ]
      };

      this.chartContext[id].setOption(option, true)
      /*  let _this = this
       window.addEventListener('resize', () => {
         _this.chartContext[id].resize();
       }) */
    },
    /*  setLineAndBarChart(id, data) {

       if (this.chartContext[id]) {
         this.chartContext[id].dispose()
       }
       this.chartContext[id] = echarts.init(document.querySelector('#' + id))

       let option = {
         title: {
           text: 'FQC前10大不良 Top 10 Defect',
           left: 'center',
           textStyle: {
             color: '#6ad6e1'
           },
           top: '2%'
         },
         tooltip: {
           trigger: 'axis',
           axisPointer: {
             type: 'cross'
           }
         },
         grid: {
           left: '5%',
           right: '5%',
           bottom: '5%',
           top: '26%',
           containLabel: true
         },
         legend: {
           data: ['KPI不良总数', 'Defect ratio'],
           textStyle: {
             color: '#eee'
           },
           top: '11%'
         },
         xAxis: [
           {
             type: 'category',
             axisTick: {
               alignWithLabel: true
             },
             // prettier-ignore
             data: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
             axisLabel: {
               color: '#eee'
             }
           }
         ],
         yAxis: [
           {
             type: 'value',
             name: '',
             position: 'right',
             alignTicks: true,
             axisLine: {
               show: false
             },
             axisLabel: {
               formatter: '{value} %'
             }
           },
           {
             type: 'value',
             name: '',
             position: 'left',
             alignTicks: true,
             axisLine: {
               show: false
             }
           }
         ],
         series: [
           {
             name: 'KPI不良总数',
             type: 'bar',
             label: {
               show: true,
               position: 'top',
             },
             data: [76.7, 135.6, 162.2, 32.6, 20.0]
           },
           {
             name: 'Defect ratio',
             type: 'line',
             yAxisIndex: 1,
             label: {
               show: true,
               position: 'bottom',
               formatter: '{c} %'
             },
             data: [10.2, 20.3, 23.4, 23.0, 16.5]
           }
         ]
       };

       this.chartContext[id].setOption(option, true)
     }, */
    setBottomBarChart(id, subTitle, barName) {
      if (this.chartContext[id]) {
        this.chartContext[id].dispose()
      }
      this.chartContext[id] = echarts.init(document.querySelector('#' + id))

      let option = {
        title: [{
          text: 'Analysis - OP ID/Machine/Fixture',
          left: 'center',
          textStyle: {
            color: '#6ad6e1',
            align: 'right',
          },
          top: '2%',
        },
        {
          text: ' ',
          left: 'right',
          textStyle: {
            color: '#6ad6e1',
            align: 'right',
          },
          top: '2%',
          subtext: subTitle, //'Tearing @ Textile',
          subtextStyle: {
            color: '#eee',
            fontSize: 26,
          }
        }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        legend: {
          textStyle: {
            color: '#eee'
          },
          top: '25%',
          itemStyle: {
            opacity: 0
          }
        },
        grid: {
          left: '3%',
          right: '10%',
          bottom: '3%',
          top: '40%',
          containLabel: true
        },
        xAxis: {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['10915545']
        },
        series: [
          {
            name: barName, //'OP ID',
            type: 'bar',
            data: [12],
            barMaxWidth: '50%',
            label: {
              show: true,
              position: 'right'
            }
          }
        ]
      }

      this.chartContext[id].setOption(option, true)
      /* let _this = this
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      }) */
    },
    setLineAndBarChart(id, datas, title, line) {
      // debugger
      if (this.chartContext[id]) {
        this.chartContext[id].dispose()
      }
      this.chartContext[id] = echarts.init(document.querySelector('#' + id))

      let option = {
        title: {
          text: title,
          textStyle: {
            color: '#6ad6e1',
            fontSize: 14,
          },
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (arr) {
            let str = '<div>' + `<div>${arr[0].axisValueLabel}</div>`
            arr.forEach((res) => {
              if (res.value && res.seriesName !== 'sum') {
                str += `${res.marker}&nbsp;${res.seriesName.slice(
                  res.seriesName.indexOf('-') + 1
                )}&nbsp;&nbsp;${res.value}%<br/>`
              }
            })
            str += '<div/>'
            return str
          },
        },
        legend: {
          top: 30,
          type: 'scroll',
          show: true,
          padding: [0, 80],
          textStyle: {
            color: '#fff'
          },
          formatter: function (val) {
            if (val === 'sum') {
              return ''
            }
            if (val !== 'CumRate') {
              return val.slice(val.indexOf('-') + 1)
            }
            return val
          },
          pageTextStyle: {
            color: '#fff'
          },
          pageIconColor: '#fff'
        },
        grid: {
          left: 40,
          right: 40,
          bottom: 20,
          top: 80,
          containLabel: true,
        },
        boundaryGap: true,
        position: 'bottom',
        xAxis: {
          type: 'category',
          data: datas.xAxis,
          axisLabel: {
            interval: '0',
            overflow: 'break',
            // rotate: -75,
            width: 50,
            margin: 18,
            color: '#fff'
          },
          axisTick: {
            alignWithLabel: true,
            interval: '0',
          },
        },
        yAxis: [
          {
            name: 'Cum FR',
            type: 'value',
            axisLabel: {
              formatter: '{value} %',
              color: '#fff'
            },
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              verticalAlign: 'middle',
              align: 'left',
              color: '#fff'
            },
            splitLine: {
              show: true,
            },
          },
          {
            type: 'value',
            splitLine: {
              show: false,
            },
            axisLabel: {
              formatter: '{value} %',
              color: '#5470c6',
            },
          },
        ],
        series: [
          {
            data: line,
            type: 'line',
            smooth: true,
            yAxisIndex: 1,
            name: 'CumRate',
            label: {
              show: true,
              formatter: '{c}%',
              color: '#5470c6',
            },
            lineStyle: {
              color: '#5470c6',
            },
          },
        ],
      }

      for (let key in datas.series) {
        option.series.push({
          name: key,
          type: 'bar',
          stack: 'total',
          label: {
            show: false,
            formatter: function (obj) {
              if (obj.data) {
                return obj.data + `%`
              }
              return ''
            },
            position: 'top',
            color: '#fff'
          },
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: datas.series[key].ColorValue
              ? `rgb(${datas.series[key].ColorValue})`
              : '',
          },
          data: datas.series[key].Data,
        })
      }

      option.series.push({
        name: 'sum',
        type: 'line',
        lineStyle: {
          opacity: 0,
        },
        itemStyle: {
          color: 'rgba(0,0,0,0)',
        },
        label: {
          show: true,
          formatter: function (obj) {
            if (obj.data) {
              return obj.data + `%`
            }
            return ''
          },
          distance: -8,
        },
        symbolOffset: [0, -5],
        // markPoint:{
        //   data: datas.sumList
        // },
        data: datas.sums,
      })
      this.chartContext[id].setOption(option, true)
    },
  }
}
</script>

<style lang="scss" scoped>
$item-background-color: rgba(202, 205, 216, 0.1);
$item-border-radius: 5px;

.item_style {
  background-color: $item-background-color;
  border-radius: $item-border-radius;
}

::v-deep {

  .row_class_name {
    background-color: transparent !important;

    .cell {
      color: #fff
    }
  }
}

.page_container {
  height: inherit;
  overflow: visible;
  box-sizing: border-box;

  .main_container {
    height: 100%;
    background-color: #07256e;

    .header {
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      div {
        line-height: 40px;
        display: flex;
        color: #7fdced;

      }

      .header_left {
        width: 200px;
        align-items: center;
      }

      .header_middle {
        width: 400px;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 600;
      }

      .header_right {
        width: 200px;
        justify-content: end;
        margin-right: 30px;
        align-items: center;
      }
    }

    .container {
      // height: 98%;
      display: flex;
      flex-direction: row;

      .main {
        // flex: 7;
        width: 60%;
        position: relative;
        display: flex;
        // justify-content: center;
        flex-direction: column;
        margin: 0;
        padding: 0;
        overflow: visible;

        .main_top {
          height: 50%;
          display: flex;
          margin: 0 5px 5px 5px;

          .main_top_left {
            width: 30%;
            @extend .item_style;
            position: relative;
            // margin-left: 5px;
          }

          .main_top_middle {
            width: 40%;
            margin: 0 5px;
            display: flex;
            flex-direction: column;

            .main_top_left_top {
              height: 40%;
              display: flex;
              flex-direction: column;
              overflow: hidden;

              .select_box {
                text-align: center;
                height: 30%;
                padding: 4px 0 2px 0;
              }

              .main_top_show_number {
                // flex: 5;
                height: 50%;
                display: flex;
                border: 1px solid rgba(202, 205, 216, 0.2);
                margin: 0 5px;

                &>div {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  margin: 0;
                  padding: 0;
                  flex: 5;
                  height: 100%;
                  font-size: 2.6rem;
                  color: #f7e987;

                  ::v-deep {
                    .el-statistic .con .number {
                      font-size: 2.6rem;
                      color: #f7e987;
                    }
                  }

                  .line {
                    display: inline-block;
                    width: 2px;
                    height: 50%;
                    background-color: #999;
                    // border: 1px solid red;
                  }
                }

                position: relative;

                &::before {
                  display: block;
                  content: ' ';
                  height: 15px;
                  width: 40px;
                  position: absolute;
                  top: -1px;
                  left: -1px;
                  border-top: 2px solid #7fdced;
                  border-left: 2px solid #7fdced;
                }

                &::after {
                  display: block;
                  content: ' ';
                  height: 15px;
                  width: 40px;
                  position: absolute;
                  bottom: -1px;
                  right: -1px;
                  border-bottom: 2px solid #7fdced;
                  border-right: 2px solid #7fdced;
                }
              }

              .main_top_show_number_describe {
                // flex: 2;
                height: 20%;
                font-size: 12px;
                display: flex;
                color: #aaa;

                &>div {
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 50%;
                }
              }

              @extend .item_style
            }

            .main_top_left_bottom {
              // flex: 6;
              height: 60%;
              margin-top: 10px;
              @extend .item_style
            }
          }

          .main_top_right {
            // flex: 4;
            // margin-right: 5px;
            width: 30%;
            position: relative;
            @extend .item_style;
          }
        }

        .main_bottom {
          height: 48%;
          display: flex;
          flex-direction: row;

          .main_bottom_left {
            flex: 3;
            margin-left: 5px;
            @extend .item_style;
          }

          .main_bottom_right {
            height: 100%;
            width: 69.6%;
            position: relative;
            margin: 0 5px;
            @extend .item_style;

            .el-dropdown {
              position: absolute;
              top: 5px;
              right: 5px;
              z-index: 101;
            }
          }
        }
      }
    }
  }
}
</style>
