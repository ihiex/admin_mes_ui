<template>
  <div v-loading="loading" class="page_container">
    <el-container class="main_container">
      <el-header class="header">
        <div class="header_left">
          <!-- <el-button type="primary" @click="getCapacity">概要 Summary</el-button> -->
          <el-popover v-model="visible" style="position: absolute; left: 15px; top:10px;z-index: 101;" width="900"
            placement="bottom" trigger="click">
            <div>
              <query-condition v-model="query" :is-show-data-level="true"></query-condition>
              <div style="text-align: right; padding-top: 10px;">
                <el-switch v-model="isAuto" :active-text="$t('Auto')" :inactive-text="$t('UnAuto')"
                  style="margin-right: 20px;">
                </el-switch>
                <el-button @click="handleReset">{{ $t('reset') }}</el-button>
                <el-button type="primary" @click="handleQuery(true)">{{ $t('query') }}</el-button>
              </div>
            </div>
            <el-button slot="reference" icon="el-icon-search" circle></el-button>
          </el-popover>
        </div>
        <div class="header_middle">
          Softgoods产线可视化看板
        </div>
        <div class="header_right" @click="test">
          {{ dateTiming }}
        </div>
      </el-header>
      <el-container class="container">
        <el-aside class="left_aside">
          <div class="left_aside_top">
            <div :id="BarChart" style="height: 100%; width: 100%;"></div>
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
          <div class="left_aside_bottom">
            <div :id="PieChart" style="height: 100%; width: inherit"></div>
          </div>
        </el-aside>
        <el-main class="main">
          <div class="main_top">
            <div style="text-align: center;">
              <!--  <el-date-picker v-model="params.date" value-format="yyyy-MM-dd" style="width: 130px; margin-right: 20px;"
                size="mini" type="date" placeholder="日期" @change="handleDateChange">
              </el-date-picker> -->
              <el-select v-model="params.date" size="mini" placeholder="请选择" style="width: 200px"
                @change="handleDateChange">
                <el-option v-for="item in dateArray" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>

              <el-select v-model="params.line" size="mini" placeholder="请选择" style="width: 200px"
                @change="handleSelectLine">
                <el-option v-for="item in lineOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>

            </div>
            <div class="main_top_show_number">
              <div>
                <el-statistic group-separator="," :value="FQCDailyOutput" title=""></el-statistic>
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
          <div id="LineAndBarChart" class="main_middle">
            <DefectByColor ref="DefectByColor" style="height: 100%" :cid="LineAndBarChart" />
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div style="display: inline-block; margin: 0 5px">top:</div>
                <el-input v-model="query.S_TopQTY" type="number" style="width: 80px" @input="handleTopInput"></el-input>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </el-main>
        <el-aside class="right_aside">
          <div class="right_aside_top">
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
          <div class="right_aside_bottom" style="padding-top: 3px;">
            <el-table :data="tableDataV2" size="mini" :border="false"
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
        </el-aside>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GetDefectYield, GetUPH } from '@/api/report.js'
import DefectByColor from '@/components/chart/DefectByColor'
import QueryCondition from '@/components/QueryCondition'
import { getTimeChangeTimeRangeNew, uuid } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  name: 'Test',
  components: {
    DefectByColor,
    QueryCondition
  },
  data() {
    let date = new Date()
    let sDate = new Date(date.setDate(date.getDate() - 6)).format(
      'yyyy-MM-dd 00:00:00'
    )
    /*  let shift = getShift(this.$store.getters['user/shiftTable'])
     let s = getUserShift(this.$store.getters['user/shiftTable']); */
    return {
      LineChart: uuid(),
      LineAndBarChart: uuid(),
      PieChart: uuid(),
      BarChart: uuid(),
      BottomBarChart: uuid(),
      dateTiming: new Date().format('yyyy-MM-dd hh:mm:ss'),
      timer: null,
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
      query: {
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
      dateArray: [],
      lineOptions: [],
      cacheOverAllYield: {},
      dailyOverallYield: '--',
      FQCDailyOutput: 0,
      cacheCapacity: {},
      loading: false,
      carouselData: {},
      isAuto: true,
      visible: false,
      time: null,
      capacityTarget: localStorage.getItem('CapacityTargetBySoftGoods')
        ? localStorage.getItem('CapacityTargetBySoftGoods')
        : 4500,
      yieldTarget: localStorage.getItem('YieldTargetBySoftGoods')
        ? localStorage.getItem('YieldTargetBySoftGoods')
        : 99.9,
      daily: '',
      lineTimer: null,
      lineIndex: 0,
      defectParams: {},
      tableDataV2: []
    }
  },
  computed: {
    ...mapGetters({
      YieldLevelOptions: 'common/YieldLevel',
      timeOptions: 'common/timeOptions'
    })
  },
  watch: {
    isAuto: function (val, oval) {
      if (val) {
        this.handleReset()
        this.handleSetIntervalAuto(val)
      }
    },
    "query.S_StartDateTime": function (val, oval) {
      this.$set(this.params, 'date', new Date(val).format('yyyy-MM-dd'))
    },
    tableData: function (val, oval) {
      // console.log(val)
      this.getDailyDataOutput(val)
    },
    tableDataV2: function (val, oval) {
      this.getDailyDataOverallYield(val)
    },
    "query.S_DataType": function (val, oval) {
      this.daily = this.timeOptions.find(r => r.value === val).label
    },
    yieldTarget: function (val, oval) {
      this.handleYieldTarget(val)
    }
  },
  mounted() {

    this.startTimer();
    this.autoScroll()
    this.daily = this.timeOptions.find(r => r.value === this.query.S_DataType)?.label
    this.handleQuery(true)
  },
  beforeDestroy() {
    this.handleClearTimer();
    this.autoScroll(true)
  },
  methods: {
    test(val) {
      console.log(this.lineOptions)
      console.log(this.cacheTableData)
      console.log(val)
    },
    startTimer() {
      let _this = this
      _this.timer && clearInterval(_this.timer);
      _this.timer = setInterval(() => {
        _this.dateTiming = new Date().format('yyyy-MM-dd hh:mm:ss')
      }, 1000);

      this.handleSetIntervalAuto()
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
        }, 1000 * 30)
      }
    },

    // Overall yield target
    handleYieldTarget(val) {
      localStorage.setItem('YieldTargetBySoftGoods', val)
      this.setTargetValue(this.cacheOverAllYield, val)
      let seriesName = this.YieldLevelOptions?.find(item => item.value == this.query.YieldLevel)?.label

      this.setLineChart(this.LineChart, {
        seriesData: this.cacheOverAllYield[this.params.line]?.value,
        target: this.cacheOverAllYield[this.params.line]?.target,
        axis: this.dateArray//.map(value => value.split('-').splice(1).join('-'))
      }, seriesName)
    },
    // Capacity target
    handleOutputTarget(val) {
      localStorage.setItem('CapacityTargetBySoftGoods', val)
      this.setTargetValue(this.cacheCapacity, val)
      this.setBarChart(this.BarChart, {
        seriesData: this.cacheCapacity[this.params.line]?.value,
        target: this.cacheCapacity[this.params.line]?.target,
        axis: this.dateArray//.map(value => value.split('-').splice(1).join('-'))
      })
    },

    setTargetValue(obj, val) {
      Object.values(obj).forEach(item => {
        item.value.forEach((value, index) => {
          if (value) {
            // if (item.value[index]) {
            item.target[index] = val
            // }
          }
        })
      })
    },

    handleQuery(flag) {
      this.visible = false

      if (this.isAuto) {
        /*  let shift = getShift(this.$store.getters['user/shiftTable'])
         let s = getUserShift(this.$store.getters['user/shiftTable']);
         this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
         this.$set(this.query, 'S_Shift', s)
         this.$set(this.query, 'S_StartDateTime', shift.sTime) */
        let date = new Date()
        let sDate = new Date(date.setDate(date.getDate() - 6)).format(
          'yyyy-MM-dd 00:00:00'
        )
        this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
        this.$set(this.query, 'S_StartDateTime', sDate)
      }

      if (flag) {
        this.lineIndex = 0;
      }

      // this.handleSetIntervalAuto(this.isAuto)
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
      if (!val) return;
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
      let seriesName = this.YieldLevelOptions?.find(item => item.value == this.query.YieldLevel)?.label
      // overall yield
      this.setLineChart(this.LineChart, {
        seriesData: this.cacheOverAllYield[val]?.value,
        target: this.cacheOverAllYield[val]?.target,
        axis: this.dateArray//.map(value => value.split('-').splice(1).join('-'))
      },
        seriesName
      )

      // capacity
      this.setBarChart(this.BarChart, {
        seriesData: this.cacheCapacity[val]?.value,
        target: this.cacheCapacity[val]?.target,
        axis: this.dateArray//.map(value => value.split('-').splice(1).join('-'))
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
      let params = JSON.parse(JSON.stringify(this.query))
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

      // params.S_LineID = lineId
      /* params.S_StartDateTime = date + ' 00:00:00'
      params.S_EndDateTime = date + ' 23:59:59' */

      GetDefectYield(params, '', true).then((res) => {
        // console.log(res)
        let data = res.ResData;
        if (res.Success && data) {
          /*   this.catchData = JSON.parse(JSON.stringify(res.ResData))
            this.setData(res.ResData) */
          this.setPieChart(this.PieChart, data[6])
          this.$refs.DefectByColor.show(
            data[3],
            `Top ${params.S_TopQTY} Defect By Color`,
            data[5],
            {
              titleColor: '#6ad6e1',
              titleTextAlign: 'center',
              legendColor: '#fff',
              axisColor: '#fff'
            }
          )
        }
        // this.loading = false
      })
    },
    handleSearch(flag) {
      // this.show = false
      let params = JSON.parse(JSON.stringify(this.query))
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
            console.log(obj)

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
            console.log(this.defectParams)

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
                    yt = item.YieldTarget

                    // if (item.StationType.includes('FQC')) {
                    actualOutput += item.Output
                    targetOutput += item.UPHTarget
                    // }
                  })

                  // let y = output / input * 100;
                  // oy[key].push(y?.toString()?.includes('.') ? parseFloat(y.toFixed(2)) : y)
                  yv = yv * 100;
                  oy[key].target.push(yt)
                  oy[key].value.push(yv?.toString()?.includes('.') ? parseFloat(yv.toFixed(2)) : yv)

                  // ao[key].push(actualOutput)
                  ao[key].target.push(targetOutput)
                  ao[key].value.push(actualOutput)

                } else {
                  /*  oy[key].push(null)
                   ao[key].push(null) */

                  oy[key].target.push(null)
                  oy[key].value.push(null)
                  ao[key].target.push(null)
                  ao[key].value.push(null)
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

    getKey(item) {
      let key = ""
      switch (this.query.S_DataLevel) {
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
      /* switch (this.query.S_DataLevel) {
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
      // 拿到表格中承载数据的div元素
      const divData = document.querySelector(".el-table__body-wrapper")

      // 拿到元素后，对元素进行定时增加距离顶部距离，实现滚动效果(此配置为每100毫秒移动1像素)
      if (stop) {
        //再通过事件监听，监听到 组件销毁 后，再执行关闭计时器。
        window.clearInterval(this.scrolltimer)
      } else {
        this.scrolltimer = window.setInterval(() => {
          // 元素自增距离顶部1像素
          divData.scrollTop += 1
          // 判断元素是否滚动到底部(可视高度+距离顶部=整个高度)
          if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
            // 重置table距离顶部距离
            divData.scrollTop = 0
            // 重置table距离顶部距离。值=(滚动到底部时，距离顶部的大小) - 整个高度/2
            // divData.scrollTop = divData.scrollTop - divData.scrollHeight / 2
          }
        }, 50) // 滚动速度
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
    setBarChart(id, data) {
      if (!this.chartContext[id]) {
        this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      } else {
        this.chartContext[id].clear()
      }
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
          bottom: "10%",
          left: "5%",
          right: "5%",
          top: "20%",
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
      let _this = this;
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      })
    },
    setPieChart(id, data) {
      if (!this.chartContext[id]) {
        this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      } else {
        this.chartContext[id].clear()
      }

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
      let _this = this
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      })
    },
    setLineChart(id, data, seriesName) {
      if (!this.chartContext[id]) {
        this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      } else {
        this.chartContext[id].clear()
      }
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
            return val[0].name + '<br/>' + val[0].marker + ' ' + val[0].seriesName + ': ' + (val[0].value ? val[0].value : '--') + '%<br/>' + val[1].marker + ' ' + val[1].seriesName + ': ' + (val[1].value ? val[1].value : '--') + '%'
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
          right: '10%',
          bottom: '5%',
          top: '24%',
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
          type: 'value'
        },
        series: [
          {
            name: 'Target Yield',
            type: 'line',
            label: {
              show: true,
              position: 'top',
              formatter: '{c} %'
            },
            data: data.target //[99.9, 99.9, 99.9, 99.9, 99.9, 99.9]
          },
          {
            name: seriesName,
            type: 'line',
            label: {
              show: true,
              position: 'bottom',
              formatter: '{c} %'
            },
            data: data.seriesData //[97.68, 97.46, 97.56, 97.55, 97.17, 99.1]
          }
        ]
      };

      this.chartContext[id].setOption(option, true)
      let _this = this
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      })
    },
    setLineAndBarChart(id, data) {

      if (!this.chartContext[id]) {
        this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      } else {
        this.chartContext[id].clear()
      }

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
      let _this = this
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      })
    },
    setBottomBarChart(id, subTitle, barName) {
      if (!this.chartContext[id]) {
        this.chartContext[id] = echarts.init(document.querySelector('#' + id))
      } else {
        this.chartContext[id].clear()
      }

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
      let _this = this
      window.addEventListener('resize', () => {
        _this.chartContext[id].resize();
      })
    }
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
  }
}

.page_container {
  height: inherit;
  background-color: #07256e;
  min-width: 1024px;
  overflow: visible;

  .main_container {
    height: 100%;

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
      }
    }

    .container {
      height: 100%;
      display: flex;

      .left_aside {
        flex: 3;
        position: relative;
        display: flex;
        justify-content: center;
        overflow: visible;

        div {
          height: 48%;
          width: 96%;
        }

        .left_aside_top {
          margin-top: 5px;
          @extend .item_style;
          position: relative;
        }

        .left_aside_bottom {
          position: absolute;
          bottom: 5px;
          @extend .item_style
        }
      }

      .main {
        flex: 4;
        position: relative;
        display: flex;
        justify-content: center;
        flex-direction: column;
        margin: 0;
        padding: 0;
        overflow: visible;

        div {
          margin: 5px;
        }

        .main_top {
          height: 30%;

          /*    background-color: rgba(202, 205, 216, 0.2);
          border-radius: 5px; */

          @extend .item_style;

          ::v-deep {
            .el-radio-group .el-radio__label {
              color: #fff;
            }
          }

          &>div:first-child {
            height: 40%;
            overflow: hidden;
          }

          .main_top_show_number {
            height: 35%;
            display: flex;

            &>div {
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0;
              padding: 0;
              width: 50%;
              // border: 1px solid blue;

              height: 100%;
              font-size: 2.6rem;
              color: #f7e987;

              &:last-child {
                border-left: 1px solid #999;
              }

              ::v-deep {
                .el-statistic .con .number {
                  font-size: 2.6rem;
                  color: #f7e987;
                }
              }
            }
          }

          .main_top_show_number_describe {
            // border: 1px solid red;
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
        }

        .main_middle {
          // height: 36%;
          position: relative;
          height: 70%;
          @extend .item_style;

          .el-dropdown {
            position: absolute;
            top: 0;
            right: 0;
            z-index: 101;
          }
        }




      }

      .right_aside {
        flex: 3;
        position: relative;
        display: flex;
        justify-content: center;
        overflow: visible;

        div {
          height: 48%;
          width: 96%;
        }

        .right_aside_top {
          margin-top: 5px;
          @extend .item_style;
          position: relative;
        }

        .right_aside_bottom {
          // border: 1px solid red;
          position: absolute;
          bottom: 5px;
          @extend .item_style;
          overflow: hidden;

          ::v-deep {
            .el-table thead tr th {
              background-color: transparent !important;
            }
          }
        }
      }
    }
  }
}
</style>
