<template>
  <div v-loading="loading" class="dashboard" :style="{ backgroundImage: `url(/assets/images/${bgImage}.jpeg)` }">
    <div class="header">
      <span :style="{ color: color }" @click="test">
        {{ titles[index] }}
      </span>
      <el-popover v-model="visible" style="position: absolute; left: 15px; top:0px;z-index: 101;" width="900"
        placement="bottom" trigger="click">
        <div>
          <query-condition v-model="params" :is-show-data-level="true"></query-condition>
          <div style="text-align: right; padding-top: 10px;">
            <span style="display: inline-block; margin-right: 20px;">
              <el-select v-model="bgImage" placeholder="" size="mini" style="width: 70px; margin-right: 10px"
                @change="handleBgChange">
                <el-option v-for="item in bgOptions" :key="item" :label="item" :value="item">
                </el-option>
              </el-select>
              <el-color-picker v-model="color" color-format="hex" size="mini" style="position: relative; top:10px;"
                @change="handleChangeColor"></el-color-picker>
              <el-color-picker v-model="barColor" color-format="hex" size="mini" style="position: relative; top:10px;"
                @change="handleChangeBarColor"></el-color-picker>
            </span>
            <el-switch v-model="isAuto" :active-text="$t('Auto')" :inactive-text="$t('UnAuto')"
              style="margin-right: 20px;">
            </el-switch>
            <el-button @click="handleReset">{{ $t('reset') }}</el-button>
            <el-button type="primary" @click="handleQuery(true)">{{ $t('query') }}</el-button>
          </div>
        </div>
        <el-button slot="reference" icon="el-icon-search" circle type="text"></el-button>
      </el-popover>
    </div>
    <el-container style="margin-bottom: 0; padding-bottom: 0; ">
      <el-aside width="50%" style="display: flex; position: relative;">
        <div class="target_input">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="display: inline-block; margin: 0 5px">target:</div>
              <el-input v-model="target" type="number" style="width: 80px" @input="handleTargetInput"></el-input>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-carousel indicator-position="none" style="height: 96%;width: 96%;" class="shadow_style" :autoplay="true"
          :interval="1000 * 5">
          <el-carousel-item v-for="(item, key) in targetOutput[titles[index]]"
            :id="ids + '_' + titles[index].replaceAll(/\/|\.|\(|\)|\+|\s/g, '_') + '_' + key.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')"
            :key="key" style="height: 100%;">
          </el-carousel-item>
        </el-carousel>
      </el-aside>

      <el-main id="M_header" v-loading="oneEven" indicator-position="none"
        style="margin: 0; padding: 0; position: relative; display: flex;">
        <div class="top_input">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="width: 200px; padding-left: 15px;">
                <div>
                  <div style="display: inline-block; margin: 0 5px">Top:</div>
                  <el-input v-model="params.S_TopQTY" type="number" style="width: 150px"
                    @input="handleTopInput"></el-input>
                </div>
                <div style="margin-top: 5px;">
                  <div style="display: inline-block; margin: 0 5px">CumTarget:</div>
                  <el-input v-model="yieldCumTarget" type="number" style="width: 105px"
                    @input="handleCumTargetInput"></el-input>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div :id="ids + 'M_footer'" style="height: 96%;width: 98%;" class="shadow_style">
        </div>
      </el-main>
    </el-container>

    <div class="pn_button">
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-left" circle
        @click="handlePrev"></el-button>
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-right" circle
        style="position: absolute; right: 20px" @click="handleNext"></el-button>
    </div>
  </div>
</template>

<script>
import { GetUPH, GetDefectYield } from '@/api/report.js'
import { getData } from '@/views/multiServer/multiObjectDashboard/data'
import QueryCondition from '@/components/QueryCondition'
import { getShift, getUserShift, uuid } from '@/utils'
import Mixin from '@/views/multiServer/multiObjectDashboard/mixin'
import * as echarts from 'echarts'
import { EnUsFormatData } from '@/utils'

export default {
  name: 'DashboardComponent',
  components: {
    QueryCondition,
  },
  mixins: [Mixin],
  props: {
    ids: {
      type: String,
      default: () => {
        return uuid()
      }
    },
    headerHeight: {
      type: String,
      default: () => {
        return '78vh'
      }
    },
    footerHeight: {
      type: String,
      default: () => {
        return '76vh'
      }
    }
  },
  data() {
    let shift = getShift(this.$store.getters['user/shiftTable'])
    let UPHTarget = localStorage.getItem('UPHTarget')
    let yieldCumTarget = localStorage.getItem('YieldCumTarget')
    return {
      // projectName: process.env.VUE_APP_PROJECT_NAME.split('-'),
      bgOptions: this.$store.state.common.bgOptions,
      color: localStorage.getItem('DashboardV2FontColor') ? localStorage.getItem('DashboardV2FontColor') : '#ffffff',
      barColor: localStorage.getItem('DashboardV2BarColor') ? localStorage.getItem('DashboardV2BarColor') : '#71aeed',
      visible: false,
      params: {
        S_StartDateTime: shift.sTime,
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: this.$store.getters['user/userShiftTable'], //班次
        S_DataLevel: 8, //数据层级 7是cum, 8是最后一站
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //是否合并良率
        S_TopQTY: localStorage.getItem('YieldTop')
          ? localStorage.getItem('YieldTop')
          : 20
      },
      fontSize: 12,
      titleFontSize: 16,
      time: null,
      target: UPHTarget ? UPHTarget : 270,
      carouselData: {},
      processYield: {},
      outputData: {},
      targetOutput: {},
      titles: [],
      index: 0,
      time2: null,
      byColorId: uuid(),
      isAuto: true,
      once: true,
      chartCxt: {},
      dyId: '',
      dyData: {},
      yieldCumTarget: yieldCumTarget ? yieldCumTarget : 98,
      yieldCumActual: {},
      cacheParams: {},
      loading: true,
      oneEven: true,
      one: true,
      bgImage: localStorage.getItem('DashboardV2BgImage') ? localStorage.getItem('DashboardV2BgImage') : 'bg3',
    }
  },
  watch: {
    index: function (val, oval) {
      let key = this.titles[val]
      this.setData(key)
      this.getDefectYield(this.cacheParams[key], key)
    },
    isAuto: function (val, oval) {
      if (val) {
        this.handleReset()
      }
    }
  },

  activated() {
    this.handleSwitchLine(true)
    window.addEventListener('resize', this.handleResize())
  },
  deactivated() {
    this.destroyTimer()
    window.removeEventListener('resize', this.handleResize())
  },
  beforeDestroy() {
    this.destroyTimer()
  },
  mounted() {
    this.dyId = '#' + this.ids + 'M_footer';

  },
  methods: {
    test() {
      console.log(this.targetOutput)
      console.log(this.carouselData)
      console.log(this.cacheParams)
      console.log(this.dyData)
    },
    handleChangeBarColor(val) {
      localStorage.setItem('DashboardV2BarColor', val);
    },
    handleBgChange(val) {
      localStorage.setItem('DashboardV2BgImage', val);
    },
    handleChangeColor(val) {
      localStorage.setItem('DashboardV2FontColor', val)
      this.handleSwitchLine(false)
    },
    // 换线
    handleSwitchLine(bool) {
      this.handleQuery(bool)
      let that = this
      that.time2 && clearInterval(that.time2)
      that.time2 = setInterval(function () {
        if (that.index >= that.titles.length - 1) {
          that.index = 0
        } else {
          ++that.index
        }
      }, 1000 * 50)
    },

    destroyTimer() {
      if (this.time2) {
        clearInterval(this.time2)
        this.time2 = null
      }
      if (this.time) {
        clearInterval(this.time)
        this.time = null
      }
    },
    // 刷新数据
    handleRefreshData() {
      let that = this;
      that.time && clearInterval(that.time)
      that.time = setInterval(function () {
        if (that.isAuto) {
          let shift = getShift(that.$store.getters['user/shiftTable'])
          let s = getUserShift(that.$store.getters['user/shiftTable']);
          that.$set(that.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
          that.$set(that.params, 'S_Shift', s)
          that.$set(that.params, 'S_StartDateTime', shift.sTime)

          that.handleQuery(true)
        }
      }, 1000 * 60 * 3)
    },


    handleQuery(isShow) {
      this.visible = false
      this.carouselData = {}
      this.processYield = {}
      this.outputData = {}
      this.targetOutput = {}
      this.dyData = {}
      if (this.isAuto) {
        let shift = getShift(this.$store.getters['user/shiftTable'])
        let s = getUserShift(this.$store.getters['user/shiftTable']);
        this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
        this.$set(this.params, 'S_Shift', s)
        this.$set(this.params, 'S_StartDateTime', shift.sTime)
        this.$set(this.params, 'S_DataLevel', 8) //
      }
      this.getData(isShow)
      if (this.once) {
        this.once = false
        this.handleRefreshData()
      }
    },

    clearData(obj = {}) {
      if (!(obj instanceof Object)) {
        return
      }

      for (let [key, value] of obj) {
        if (obj[key] instanceof Object) {
          this.clearData(obj[key])
        } else {
          if (Array.isArray(obj[key])) {
            this.$set(obj, key, [])
          } else if (typeof obj[key] == 'string') {
            this.$set(obj, key, '')
          } else if (typeof obj[key] == 'number') {
            this.$set(obj, key, 0)
          } else {
            this.$set(obj, key, null)
          }
        }
      }
    },

    getData(isShow) {
      let params = JSON.parse(JSON.stringify(this.params))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      isShow && (this.loading = true)
      this.one = true
      GetUPH(params, true).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          let list = getData(data, params.S_DataLevel)
          Object.keys(list).forEach(key => {
            let set = new Set();
            let pfIds = new Set();
            list[key]?.forEach(res => {
              set.add(res.LineID);
              pfIds.add(res.PartFamilyTypeID);
            })
            params.S_PartFamilyTypeID = Array.from(pfIds)
            params.S_LineID = Array.from(set);
            this.cacheParams[key] = JSON.parse(JSON.stringify(params))
          })
          this.dataFormat(list)
          if (this.one) {
            let key = this.titles[this.index]
            this.getDefectYield(this.cacheParams[key], key)
            this.one = false;
          }
          // this.oneEven = false
          this.loading = false
        } else {
          this.oneEven = false
          this.loading = false
        }
      }, error => {
        this.oneEven = false
        this.loading = false
      })
    },

    getDefectYield(param, key) {

      if (!param) {
        this.oneEven = false
        this.loading = false
        return
      }
      // debugger
      let params = JSON.parse(JSON.stringify(param))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.oneEven = true
      GetDefectYield(params, '').then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          let list = {
            yAxis: data[4] ? data[4].map((r) => r.DefectCodeDesc) : [],
            Data: data[4] ? data[4].map((r) => r.DefectRate) : [],
          }
          // debugger
          this.dyData[key] = list
          // if (this.oneEven) {
          // this.oneEven = false;
          let lineName = this.titles[this.index]
          let yieldCumActual = this.getCumActual(lineName)

          this.handleDefectChart(this.dyData[lineName], this.dyId, yieldCumActual, this.yieldCumTarget, this.params.S_TopQTY, lineName, Object.keys(this.carouselData?.[lineName] ?? {})?.[0]);
          // }
        }
        this.oneEven = false

        this.loading = false
      }, error => {
        this.loading = false
        this.oneEven = false
      })
    },

    dataFormat(obj) {
      this.titles = Object.keys(obj)
      let toObj = {};
      Object.keys(obj).forEach(key => {
        let o = {};
        let c = {};
        let to = {};
        obj[key].forEach(item => {
          // Process Yield
          if (!o.axis) {
            o.axis = []
          }
          if (!o.axis.includes(item.StationType)) {
            if (o.axis && Array.isArray(o.axis)) {
              o.axis.push(item.StationType)
            } else {
              o['axis'] = [item.StationType]
            }
            let y = item.sumOutput / item.sumInput * 100
            if (o.data && Array.isArray(o.data)) {
              o.data.push(y == 100 ? y + '' : y.toFixed(1))
            } else {
              o['data'] = [y == 100 ? y + '' : y.toFixed(1)]
            }
          }

          // carousel
          if (!c[item.StationType]) {

            c[item.StationType] = {}
            c[item.StationType]['Input'] = item.sumInput;
            c[item.StationType]['Output'] = item.sumOutput;
            let y = item.sumOutput / item.sumInput * 100
            c[item.StationType]['Yield'] = y == 100 ? y + '' : y.toFixed(1);

          }

          // target output
          if (to[item.StationType]) {
            if (item.type === 'UPHTarget' || item.type === 'Output') {
              to[item.StationType][item.type] = item
            }
          } else {
            to[item.StationType] = {}
          }
        })

        o['target'] = this.target;
        this.processYield[key] = Object.assign({}, o)

        this.carouselData[key] = Object.assign({}, c)

        toObj[key] = Object.assign({}, to)
      })

      // target output
      let flag = false
      Object.keys(toObj).forEach(key => {
        Object.keys(toObj[key]).forEach(k => {
          let yAxis = [], target = [], data = [];
          Object.keys(toObj[key][k].Output).forEach(kk => {
            if (new Date(kk) != 'Invalid Date' || kk.includes('WK')) {
              yAxis.push(kk)
              let t = toObj?.[key]?.[k]?.UPHTarget?.[kk];
              flag = t ? true : false;
              target.push(t ? t : parseFloat(this.target))
              // target.push(300)
              data.push(toObj[key][k].Output[kk])
            }
          })
          toObj[key][k] = { yAxis, target, data, flag }
        })
      })
      this.targetOutput = JSON.parse(JSON.stringify(toObj))

      // outputStart
      this.outputData = {}
      Object.keys(this.carouselData).forEach(key => {
        if (!this.outputData[key]) {
          this.outputData[key] = []
        }
        Object.keys(this.carouselData[key]).forEach(k => {
          let arr = [k]
          arr.push(this.carouselData[key][k].Output)
          arr.push(this.carouselData[key][k].Input - this.carouselData[key][k].Output)
          this.outputData[key].push(arr)
        })
      })

      /*  let sumInput = 0;
       let sumOutput = 0;

       Object.values(this.carouselData).forEach(value => {
         Object.values(value).forEach(val => {
           Object.keys(val).forEach(key => {
             sumInput += val.Input
             sumOutput += val.Output
           })
         })
       })
       console.log(this.carouselData)
       this.yieldCumActual = (sumOutput / sumInput * 100).toFixed(2) */

      this.setData(this.titles[this.index])

    },
    // 左边视图
    handleUPHChart(id, data, station, target) {
      // debugger
      let list = [];
      let CUMActual = 0;
      let CUMTarget = 0;
      let dMax = Math.max.apply(Math, data.data)
      let tMax = Math.max.apply(Math, data.target)

      data.data.forEach((val, index) => {
        list.push({ value: val, itemStyle: { color: !data.target[index] ? this.barColor : val > data.target[index] ? this.barColor : '#ad2424' } })
        CUMActual += val
      })
      data.target.forEach(val => {
        CUMTarget += val
      })
      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }
      window.removeEventListener('resize', resize);

      let myChart = echarts.init(
        dom,
        {
          renderer: 'svg',
        }
      )
      this.chartCxt[id] = myChart
      myChart && myChart.clear()

      let option = {
        // backgroundColor: '#fff',
        title: [
          {
            text: station,
            textStyle: {
              fontSize: this.titleFontSize,
              fontWeight: '800',
              color: this.color
            },
            left: '10%',
            top: 10
          },
          {
            subtext: `CUMTarget: ${CUMTarget ? EnUsFormatData(CUMTarget) : '--'}`,
            left: '35%',
            top: 28,
            subtextStyle: {
              fontWeight: 800,
              color: this.color
            }
          },
          {
            subtext: `CUMActual: ${CUMActual ? EnUsFormatData(CUMActual) : '--'}`,
            left: '65%',
            top: 28,
            subtextStyle: {
              color: CUMActual < CUMTarget ? 'red' : this.color,
              fontWeight: 800
            }
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
            // type: 'cross'
          },
          /* formatter: (val) => {
            switch (val.length) {
              case 1:
                return val[0].axisValueLabel + '<br/>' + val[0].marker + station + '_' + val[0].seriesName + ': ' + val[0].value
              case 2:
                return val[0].axisValueLabel + '<br/>' + val[0].marker + station + '_' + val[0].seriesName + ': ' + val[0].value + '<br/>' + val[1].marker + station + '_' + val[1].seriesName + ': ' + val[1].value
              default:
                return ''
            }
          } */
        },
        legend: {
          data: [{ name: 'output', itemStyle: { color: this.barColor } }],
          textStyle: {
            color: this.color
          },
          left: '10%',
          top: 34
        },
        yAxis: {
          name: 'UPH',
          type: 'value',
          position: 'left',
          alignTicks: true,
          splitLine: { show: true },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.color
            },
            symbol: ['none', 'arrow'],
            // symbolSize: [20, 25],
            symbolOffset: [10, 10]
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          },
        },
        xAxis: {
          name: 'Hour',
          data: data.yAxis,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: this.color
            },
            symbol: ['none', 'arrow'],
            symbolOffset: [10, 10]
          },
          axisLabel: {
            interval: 0,
            overflow: 'truncate',
            ellipsis: '...',
            margin: 15,
            width: 100,
            formatter: (val) => {
              if (val.split(' ').length >= 2) {
                return val.split(' ')[1]
              } else {
                return val
              }
            }
          }
        },
        grid: {
          left: 50,
          bottom: 50,
          right: 80,
          top: 100,
        },
        series: [
          {
            name: 'output',
            type: 'bar',
            barWidth: 10,
            itemStyle: {
              borderRadius: 5,
            },
            data: list,
            label: {
              show: true
            },
            markLine: {
              symbol: 'none',
              show: true,
              label: {
                position: 'end',
                show: true,
                color: 'red',
                // ellipsis: 'target',
                formatter: `target {c}`,
              },
              silent: true,
              data: [
                {
                  lineStyle: {
                    type: 'dashed',
                    color: '#fa3934',
                  },
                  name: 'target',
                  yAxis: data?.target?.[0] ? data?.target?.[0] : target,
                },
              ],
            },
          },
          /*  {
             name: 'target',
             type: 'pictorialBar',
             symbol: 'roundRect',
             barWidth: 10,
             itemStyle: {
               color: '#eee'
             },
             emphasis: {
               disabled: true,
             },
             symbolRepeat: true,
             symbolSize: [8, 10],
             z: -10,
             data: data.target,
             label: {
               show: true,
               position: ['105%', '-2%'],
             },
           }, */

        ]
      };
      if (dMax < tMax) {
        option.yAxis.max = tMax
      }
      if (!tMax) {
        if (dMax > target) {
          option.yAxis.max = dMax
        } else {
          option.yAxis.max = target
        }
      }

      myChart.setOption(option, true)
      window.addEventListener('resize', resize);

      function resize() {
        myChart.resize();
      }

    },
    // 右边视图
    handleDefectChart(datas, id, CumActual, CumTarget, top, lineName, station) {
      // debugger
      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }

      window.removeEventListener('resize', resize);

      let myChart = echarts.init(
        dom, { renderer: 'svg' }
      )
      this.chartCxt[id] = myChart;
      myChart && myChart.clear()

      let option = {
        title: [
          {
            text: `${station ? station : ''} Yield`,
            // subtext: `Tops ${top ? top : ''} Defects by ${lineName ? lineName : ''}`,
            left: '10%',
            top: 10,
            textStyle: {
              color: this.color,
              fontSize: this.titleFontSize,
              fontWeight: 800
            },

          },
          {
            text: ' ',
            subtext: `Tops ${top ? top : ''} Defects ${lineName ? 'by ' + lineName : ''}`,
            left: 'center',
            top: 30,
            subtextStyle: {
              color: this.color,
              //  fontSize: this.titleFontSize,
              fontWeight: 800,
            },
          },
          {
            text: ' ',
            subtext: 'CUMTarget: ' + (CumTarget ? CumTarget + '%' : '--'),
            left: '10%',
            top: 10,
            subtextStyle: {
              color: this.color,
              //  fontSize: this.titleFontSize,
              fontWeight: 800
            },
          },
          {
            text: ' ',
            subtext: 'CUMActual: ' + (CumActual ? CumActual + '%' : '--'),
            left: '70%',
            top: 10,
            subtextStyle: {
              color: parseFloat(CumActual) < parseFloat(CumTarget) ? 'red' : this.color,
              // fontSize: this.titleFontSize,
              fontWeight: 800
            },
          }
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (arr) {
            let str = '<div>' + `<div>${arr[0].axisValueLabel}</div>`
            arr.forEach((res) => {
              str += `${res.marker}&nbsp;${res.seriesName}&nbsp;&nbsp;${res.value}%<br/>`
            })
            str += '<div/>'
            return str
          },
        },
        legend: {
          top: '9%',
          type: 'scroll',
          show: true,
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 10,
          top: 95,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          // boundaryGap: [0, 0.01],
          axisLabel: {
            formatter: '{value} %',
            color: this.color
          },
          axisLine: {
            lineStyle: {
              color: this.color
            },
          }
        },
        yAxis: {
          type: 'category',
          data: datas?.yAxis,
          axisLabel: {
            interval: '0',
            rotate: 0,
            overflow: 'truncate',
            ellipsis: '...',
            // height: 24,
            width: 60,
            // margin: 18,
            color: this.color
          },
          axisTick: {
            alignWithLabel: true,
            interval: '0',
          },
          axisLine: {
            lineStyle: {
              color: this.color
            },
          }
        },
        series: [
          {
            // name: 'Defect Rate',
            type: 'bar',
            // width: 30,
            // barMaxWidth: '20%',
            data: datas?.Data,
            itemStyle: {
              color: this.barColor,
            },
            label: {
              show: true,
              formatter: function (obj) {
                if (obj.data) {
                  return obj.data ? obj.data + '%' : '--' + `%`
                }
                return ''
              },
              precision: 1,
              position: 'right',
              valueAnimation: true,
              fontFamily: 'monospace',
            },
          },
        ],
      }
      myChart.setOption(option, true)
      window.addEventListener('resize', resize);

      function resize() {
        myChart.resize();
      }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-carousel__container {
    height: 100%;
  }
}

.shadow_style {
  margin: auto;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 1px 1px 2px #eee, 0 0 25px #efefef, 0 0 5px var(--themeColor, $base-color-default);

  & div {
    height: 100%;
    width: 100%;
  }
}

.dashboard {
  display: flex;
  position: relative;
  background-color: #fff;
  min-width: 1000px;
  height: inherit;
  background-size: cover;

  .pn_button {
    position: absolute;
    top: 50%;
    z-index: 101;
    width: 96%;
    padding: 0 20px;
    display: none;

    .el-button {
      background-color: #eee;
      border: #eee;

      &:hover {
        background-color: #ccc;
        border: #ccc;
      }
    }
  }

  &:hover {
    .pn_button {
      display: block;
    }
  }

  // background: url('../../../../assets/dashboard/bg03.png') no-repeat;
  // background-size: cover;
  // background-color: rgba(2,123,207, 0.05);
  .target_input {
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 101;
  }

  .top_input {
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 101;
  }

  .header {
    width: 100%;
    position: absolute;
    text-align: center;
    font-size: 1.8rem;
    color: #222;
    // line-height: 94px;
    background-size: 100%;
    padding-top: 10px;
  }

  .el-container {
    // border: 1px solid red;
    padding-top: 50px;

    .el-aside {
      box-sizing: border-box;
      // overflow: hidden; #054d05, #9b1111
      // color: #066b06;
      // color: #ad2424;
    }

    .el-header {
      // border: 1px solid #2b83eb;
      margin: 5px;
      // height: calc(78vh / 2) !important;
      // height: inherit;
    }

    .el-footer {
      // border: 1px solid #2b83eb;
      margin: 5px;
      // height: calc(76vh / 2) !important;
      // height: inherit;
    }
  }
}
</style>
