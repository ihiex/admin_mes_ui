<template>
  <div class="dashboard" :style="{ backgroundImage: `url(/assets/images/${bgImage}.jpeg)` }">
    <div class="header">
      <span :style="{ color: color }" @click="test">
        <!-- {{ title }} -->
        {{ titles[index] }}
      </span>
      <!--  <span style="display: block; font-size: 16px; padding-top: 5px;">
        {{ titles[index] }}
      </span> -->
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
            <el-button type="primary" @click="handleQuery(false)">{{ $t('query') }}</el-button>
          </div>
        </div>
        <el-button slot="reference" icon="el-icon-search" circle type="text"></el-button>
      </el-popover>
    </div>
    <el-container style="margin-bottom: 0; padding-bottom: 0;">
      <el-header height="50%" style=" padding: 0;margin: 0;" :style="{ height: 'calc(' + headerHeight + ' / 2)' }">
        <el-container style="height: inherit; padding: 0; margin: 0;">

          <el-aside width="38%" style="display: flex;">
            <el-carousel indicator-position="none" style="height: 96%;width: 96%;" class="shadow_style" :autoplay="true"
              :interval="1000 * 5">
              <el-carousel-item v-for="(item, key) in targetOutput[titles[index]]"
                :id="ids + '_' + titles[index].replaceAll(/\/|\.|\(|\)|\+|\s/g, '_') + '_' + key.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')"
                :key="key" style="height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-aside>

          <el-main id="M_header" indicator-position="none" style="margin: 0; padding: 0; display: flex;">
            <el-carousel style="height: 96%; width: 94%;" class="shadow_style" direction="vertical" :autoplay="true"
              :interval="1000 * 5">
              <el-carousel-item v-for="(item, k) in carouselData[titles[index]]"
                :id="ids + '_' + k.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')" :key="k"
                style="box-sizing: border-box; height: 100%;">
              </el-carousel-item>
            </el-carousel>
          </el-main>
          <el-aside width="38%" style="display: flex;">
            <div :id="ids + 'R_header'" style="height: 96%;width: 96%;" class="shadow_style">

            </div>
          </el-aside>
        </el-container>
      </el-header>
      <el-footer style="padding: 0;margin: 0; position: relative;"
        :style="{ height: 'calc(' + footerHeight + ' / 2)' }">
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
        <el-container style="height: 98%; padding: 0; margin: 0; position: relative;">
          <el-aside v-loading="loading" width="33%" style="display: flex;">
            <div :id="'L_footer' + byColorId" style="height: 96%; width: 96%;" class="shadow_style"></div>
          </el-aside>
          <div class="top_input">
            <el-dropdown>
              <span class="el-dropdown-link">
                <i class="el-icon-arrow-down el-icon-setting"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <div style="display: inline-block; margin: 0 5px">top:</div>
                <el-input v-model="params.S_TopQTY" type="number" style="width: 80px"
                  @input="handleTopInput"></el-input>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <el-main v-loading="loading" style="display: flex; margin: 0; padding: 0;">
            <div :id="ids + 'M_footer'" style="height: 96%;width: 98%;" class="shadow_style">
            </div>
          </el-main>
          <el-aside width="33%" style="display: flex;">
            <div :id="ids + 'R_footer'" style="height: 96%;width: 96%;" class="shadow_style">
            </div>
          </el-aside>
        </el-container>
      </el-footer>
    </el-container>

    <div class="pn_button">
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-left" circle
        @click="handlePrev"></el-button>
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-right" circle
        style="position: absolute; right: 20px" @click="handleNext"></el-button>
    </div>
    <!-- <div class="bgModal"></div> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { GetUPH, GetDefectYield } from '@/api/report.js'
import { getData } from './data'
import QueryCondition from '@/components/QueryCondition'
import { getShift, getUserShift, uuid } from '@/utils'

/* actual */
export default {
  name: 'DashboardComponent',
  components: {
    QueryCondition,
  },
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
    return {
      projectName: process.env.VUE_APP_PROJECT_NAME.split('-'),
      visible: false,
      bgOptions: this.$store.state.common.bgOptions,
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
        S_DataLevel: 4, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //是否合并良率
        S_TopQTY: localStorage.getItem('YieldTop')
          ? localStorage.getItem('YieldTop')
          : 20
      },
      color: localStorage.getItem('DashboardFontColor') ? localStorage.getItem('DashboardFontColor') : '#ffffff',
      barColor: localStorage.getItem('DashboardBarColor') ? localStorage.getItem('DashboardBarColor') : '#71aeed',
      fontSize: 14,
      titleFontSize: 16,
      time: null,
      target: localStorage.getItem('YieldTarget')
        ? localStorage.getItem('YieldTarget')
        : 95,
      carouselData: {},
      processYield: {},
      outputData: {},
      targetOutput: {},
      titles: [],
      index: 0,
      time2: null,
      byColorId: uuid(),
      isAuto: true,
      chartCxt: {},
      defectLineIds: {},
      loading: false,
      bgImage: localStorage.getItem('DashboardBgImage') ? localStorage.getItem('DashboardBgImage') : 'bg3',
    }
  },
  watch: {
    index: function (val, oval) {
      this.setData(this.titles[val])
      this.getDefectYield(true)

    },
    isAuto: function (val, oval) {
      if (val) {
        this.handleReset()
      }
    }
  },
  mounted() {
    this.startTimer(false)
    // this.handleQuery(false)
  },
  activated() {
    this.startTimer(true)
    window.addEventListener('resize', this.handleResize())
  },
  deactivated() {
    this.destroyTimer()
    window.removeEventListener('resize', this.handleResize())
  },
  beforeDestroy() {
    this.destroyTimer()
  },
  methods: {
    test() {
      console.log(this.titles)
      console.log(this.carouselData)
      console.log(this.defectLineIds)
    },
    handleBgChange(val) {
      localStorage.setItem('DashboardBgImage', val);
    },
    handleChangeBarColor(val){
      localStorage.setItem('DashboardBarColor', val)
      this.startTimer(true)
    },
    handleChangeColor(val) {
      console.log(val)
      localStorage.setItem('DashboardFontColor', val)
      this.startTimer(true)
    },
    handleResize() {
      let dom = document.querySelector('.dashboardV1_page')
      let domFull = document.querySelector('.dashboardV1_full_page')
      dom.style.height = '98%';
      domFull.style.height = '98%';
      this.$nextTick(function () {
        dom.style.height = '100%';
        domFull.style.height = '100%';
        Object.keys(this.chartCxt).forEach(key => {
          this.chartCxt?.[key]?.resize()
        })
      })
    },
    handlePrev() {
      if (this.index <= 0) {
        this.index = this.titles.length - 1
      } else {
        --this.index
      }
    },
    handleNext() {
      if (this.index >= this.titles.length - 1) {
        this.index = 0
      } else {
        ++this.index
      }
    },
    handleTopInput(val) {
      if (!val) return;
      localStorage.setItem('YieldTop', val)
      this.getDefectYield(true)
    },
    startTimer(bool) {
      this.handleBgChange(this.bgImage)
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

    handleTargetInput(val) {
      localStorage.setItem('YieldTarget', val)

      Object.keys(this.processYield).forEach(key => {
        this.$set(this.processYield[key], 'target', val)
      })

      this.handleRightFooterChart('#' + this.ids + 'R_footer', 'Process Yield', this.processYield[Object.keys(this.processYield)[0]]);

      Object.keys(this.carouselData).forEach(key => {
        Object.keys(this.carouselData[key]).forEach(k => {
          this.carouselData[key][k]['yTarget'] = val
        })
      })

      this.setHeaderMiddleChart(this.carouselData[this.titles[this.index]])
    },

    setHeaderMiddleChart(obj) {
      obj && Object.keys(obj).forEach(id => {
        let i = this.ids + '_' + id.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')
        this.handleHeaderMiddleChart('#' + i, obj[id], id)
      })
    },

    setInterval() {
      let that = this;
      that.time && clearInterval(that.time)
      if (that.isAuto) {
        that.time = setInterval(function () {
          let shift = getShift(that.$store.getters['user/shiftTable'])
          let s = getUserShift(that.$store.getters['user/shiftTable']);
          that.$set(that.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
          that.$set(that.params, 'S_Shift', s)
          that.$set(that.params, 'S_StartDateTime', shift.sTime)
          that.handleQuery(true)
        }, 1000 * 60 * 3)
      } /* else {
        that.handleQuery(true)
      } */

    },

    handleReset() {
      // debugger
      let shift = getShift(this.$store.getters['user/shiftTable'])
      let s = getUserShift(this.$store.getters['user/shiftTable']);
      this.$set(this.params, 'S_StartDateTime', shift.sTime)
      this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.params, 'S_DataType', '0')
      this.$set(this.params, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.params, 'S_PartFamilyID', null) //料号组
      this.$set(this.params, 'S_PartID', null) //料号
      this.$set(this.params, 'S_ProductionOrderID', null) //工单
      this.$set(this.params, 'S_StationTypeID', null) //工站类型
      this.$set(this.params, 'S_StationID', null) //工站
      this.$set(this.params, 'S_LineID', null) //产线
      this.$set(this.params, 'S_Shift', s) //班次
      this.$set(this.params, 'S_DataLevel', 4) //
    },

    handleQuery(isShow) {
      this.visible = false
      this.carouselData = {}
      this.processYield = {}
      this.outputData = {}
      this.targetOutput = {}
      if (this.isAuto) {
        let shift = getShift(this.$store.getters['user/shiftTable'])
        let s = getUserShift(this.$store.getters['user/shiftTable']);
        this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
        this.$set(this.params, 'S_Shift', s)
        this.$set(this.params, 'S_StartDateTime', shift.sTime)
      }
      this.getData(isShow)
      // this.getDefectYield(isShow)
      this.setInterval()
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

    handleHeaderLeftChart(id, data, station) {
      let list = [];
      data.data.forEach((val, index) => {
        list.push({ value: val, itemStyle: { color: !data.target[index] ? this.barColor : val > data.target[index] ?  this.barColor : '#ad2424' } })
      })

      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }
      this.chartCxt[id] && this.chartCxt[id].dispose()

      window.removeEventListener('resize', resize);

      this.chartCxt[id] = echarts.init(
        dom,
        {
          renderer: 'svg',
        }
      )


      let option = {
        // backgroundColor: '#fff',
        title: {
          text: station,
          textStyle: {
            fontSize: this.titleFontSize,
            fontWeight: '800',
            color: this.color
          },
          left: 'center',
          top: 10
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
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
          data: ['target', {name: 'output', itemStyle:{color: this.barColor}}],
          textStyle: {
            color: this.color
          },
          top: 30
        },
        xAxis: {
          show: false,
          splitLine: { show: false },
          axisLine: {
            lineStyle: {
              color: this.color
            }
          },
        },
        yAxis: [{
          data: data.yAxis,
          axisTick: {
            show: true,
            alignWithLabel: true
          },
          axisLabel: {
            interval: 0,
            overflow: 'truncate',
            ellipsis: '...',
            width: 100,
            color: this.color,
            formatter: (val) => {
              if (val.split(' ').length >= 2) {
                return val.split(' ')[1]
              } else {
                return val
              }
            }
          }
        }, {
          type: 'category',
          axisTick: { show: false },
          axisLine: {
            show: false,
          },
          data: data.target,
          axisLabel: {
            color: this.color
          }
        }],
        grid: {
          left: 105,
          bottom: 20,
          right: 60
        },
        series: [
          {
            name: 'output',
            type: 'bar',
            barWidth: 10,
            // barGap: '30%',
            itemStyle: {
              borderRadius: 5,
            },
            data: list,
            label: {
              show: true
            },
          },
          {
            name: 'target',
            type: 'pictorialBar',
            symbol: 'roundRect',
            // barGap: '-20%', // 类型为pictorialBar 时 无效
            barWidth: 10,
            itemStyle: {
              color: '#eee'
            },
            emphasis: {
              disabled: true
            },
            symbolRepeat: true,
            symbolSize: [8, 10],
            // symbolMargin: 1,
            z: -10,
            data: data.target,
            label: {
              show: false,
              position: ['105%', '-2%'],
            },
          }
        ]
      };

      this.chartCxt[id] && this.chartCxt[id].setOption(option, true)
      window.addEventListener('resize', resize);

      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }

    },
    handleFooterMiddleChart(datas, title, id) {

      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }
      this.chartCxt[id] && this.chartCxt[id].dispose()

      window.removeEventListener('resize', resize);

      this.chartCxt[id] = echarts.init(
        dom, { renderer: 'svg' }
      )

      let option = {
        title: {
          text: title,
          left: 'center',
          top: 10,
          textStyle: {
            color: this.color,
            fontSize: this.titleFontSize,
            fontWeight: 800
          },
        },
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
          textStyle: {
            color: this.color
          }
        },
        grid: {
          left: 10,
          right: 50,
          bottom: 10,
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          // boundaryGap: [0, 0.01],
          axisLabel: {
            formatter: '{value} %',
            color: this.color
          },
        },
        yAxis: {
          type: 'category',
          data: datas.yAxis,
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
        },
        series: [
          {
            name: 'Defect Rate',
            type: 'bar',
            data: datas.Data,
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
      this.chartCxt[id] && this.chartCxt[id].setOption(option, true)
      window.addEventListener('resize', resize);

      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }
    },

    handleRightFooterChart(id, title, data, rotate = 80) {
      let list = [];
      data.data.forEach(val => {
        list.push({ value: val, itemStyle: { color: !data.target ? this.color : parseFloat(val) < data.target ? '#ad2424' : this.barColor } })
      })

      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }

      this.chartCxt[id] && this.chartCxt[id].dispose()

      window.removeEventListener('resize', resize);

      this.chartCxt[id] = echarts.init(
        dom,
        {
          renderer: 'svg',
        }
      )

      let option = {
        title: [
          {
            text: title,
            textStyle: {
              fontSize: this.titleFontSize,
              fontWeight: '800',
              color: this.color,
            },
            left: 'center',
            top: 10
          },
        ],
        grid: {
          top: 90,
          right: 90,
          bottom: '14%'
        },
        // legend: {},
        tooltip: {
          formatter: function (item) {
            return item.marker + ' ' + item.name + ' ' + '<span style="color:' + item.color + '">' + item.value + ' %</span>'
          }
        },
        xAxis: {
          type: 'category',
          data: data.axis,
          axisLabel: {
            overflow: 'truncate',
            ellipsis: '...',
            rotate: -90,
            width: 40,
            color: this.color
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        yAxis: {
          type: 'value',
          show: false,
        },
        series: [
          {
            data: list,
            type: 'bar',
            label: {
              show: true,
              position: ['50%', '-2%'],
              verticalAlign: 'bottom',
              valueAnimation: true,
              formatter: '{c} %',
              rotate: rotate,
            },
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
                  yAxis: data.target,
                },
              ],
            },
          }
        ],
      }
      this.chartCxt[id] && this.chartCxt[id].setOption(option, true)
      window.addEventListener('resize', resize);

      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }
    },
    handleHeaderRightChart(id, source) {
      /*  source.forEach(item=>{
         item.push(29)
       }) */
      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }
      this.chartCxt[id] && this.chartCxt[id].dispose();

      window.removeEventListener('resize', resize)

      this.chartCxt[id] = echarts.init(
        dom,
        {
          renderer: 'svg',
        }
      )

      let option = {
        title: {
          text: 'Output',
          textStyle: {
            fontSize: this.titleFontSize,
            fontWeight: '800',
            color: this.color,
          },
          left: 'center',
          top: 10
        },
        grid: {
          left: 80,
          bottom: 20,
          right: 60
        },
        legend: {
          top: '8%',
          type: 'scroll',
          show: true,
          textStyle: {
            color: this.color
          }
        },
        tooltip: {
          show: true,
        },
        dataset: {
          source: source
        },
        xAxis: {
          show: false,
          axisLabel: {
            overflow: 'truncate',
            ellipsis: '...'
          }
        },
        yAxis: {
          type: 'category',
          axisLabel: {
            overflow: 'truncate',
            ellipsis: '...',
            width: 65,
            color: this.color
          },
          axisTick: {
            show: true,
            alignWithLabel: true
          }
        },
        series: [
          {
            type: 'bar',
            // color: '#6790d8',
            name: 'output',
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
              // formatter: '{c} %',
              // color: this.color,
              // fontWeight: '800',
              // fontSize: this.fontSize
            },
            itemStyle:{
              color: this.barColor
            }
          },
          {
            type: 'bar',
            name: 'wip',
            label: {
              show: true,
              position: 'right',
              valueAnimation: true,
              // formatter: '{c} K',
              color: this.color
            }
          }
        ]
      };
      this.chartCxt[id] && this.chartCxt[id].setOption(option, true);
      window.addEventListener('resize', resize);

      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }
    },

    // 上 中间 图表
    handleHeaderMiddleChart(id, data, title) {
      let dom = document.querySelector(id);
      if (!dom) {
        return;
      }
      this.chartCxt[id] && this.chartCxt[id].dispose()

      window.removeEventListener('resize', resize)
      let handleCompare = (actual, target) => {
        let str = ''
        actual = parseFloat(actual)
        target = parseFloat(target)

        /*   console.log(actual)
          console.log(target) */
        // debugger
        if (actual > target) {
          str = '↑'
        } else if (actual < target) {
          str = '↓'
        }

        return str;
      }
      this.chartCxt[id] = echarts.init(dom, { renderer: 'svg' })

      let outputValue = data.Output / data.target * 100

      let option = {
        title: {
          text: title,
          left: 'center',
          fontSize: this.titleFontSize,
          top: 10,
          textStyle: {
            color: this.color
          }
        },
        legend: {
          left: 'center',
          textStyle: {
            color: this.color
          },
          data: [{
            name: 'Yield',
            itemStyle: {
              color: '#6790D8'
            },
          }, {
            name: 'Output',
            itemStyle: {
              color: this.barColor
            }
          }],
          top: 30
        },
        series: [
          {
            type: 'pie',
            radius: ['65%', '85%'],
            // center: ['50%', '50%'],
            data: [{ value: 100, name: '' }],
            itemStyle: {
              color: '#e9e9e9', //进度完成部分填充颜色
            },
            top: 50,
            animation: false,
            silent: true,
            label: {
              formatter: [
                // '{head|{b}}',  ↑ ← → ↓
                '{value|Yield}\n',
                '{value|Target:' + (data.yTarget ? data.yTarget : '--') + '%}\n',
                '{value|Actual:' + (data.Yield ? data.Yield : '--') + '% ' + handleCompare(data.Yield, data.yTarget) + '}\n',
                '{hr|}\n',
                // '{head|Output}',
                '{value|Target:' + (data.target ? data.target : '--') + '}\n',
                '{value|Actual:' + (data.Output ? data.Output : '--') + ' ' + handleCompare(data.Output, data.target) + '}\n',
                '{value|CompleteRate:' + (data.Output / data.target * 100).toFixed(0) + '%}\n',
                '{value|Output}',
              ].join('\n'),
              borderRadius: 4,
              position: 'center',
              rich: {
                hr: {
                  borderColor: this.color,
                  width: '100%',
                  borderWidth: 2,
                  height: 0,
                  align: 'left',
                  color: this.color
                },
                value: {
                  width: 100,
                  // padding: [0, 20, 0, 30],
                  align: 'center',
                  height: 5,
                  fontSize: this.fontSize,
                  color: this.color,
                  // fontWeight: 600
                }
              }
            },
          },
          {
            name: 'Yield',
            type: 'pie',
            radius: ['75%', '85%'],
            hoverAnimation: false,
            top: 50,
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: data.Yield,
                name: '',
                itemStyle: {
                  color: '#6790D8', //进度完成部分填充颜色
                  borderRadius: 100
                },
              },
              {
                value: 100 - data.Yield,
                name: '',
                itemStyle: {
                  color: '#e9e9e9'
                }
              }
            ]
          },
          {
            name: 'Output',
            type: 'pie',
            radius: ['65%', '75%'],
            top: 50,
            hoverAnimation: false,
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: outputValue,
                name: '',
                itemStyle: {
                  color: this.barColor, //进度完成部分填充颜色
                  borderRadius: 100
                },
              },
              {
                value: 100 - outputValue,
                name: '',
                itemStyle: {
                  color: '#e9e9e9'
                }
              }
            ]
          },
        ]
      }

      this.chartCxt[id] && this.chartCxt[id].setOption(option, true)

      window.addEventListener('resize', resize);
      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }
    },

    // defect by color start
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
        sList.push(sums[key].toFixed(4))
      }
      objs.series = series

      objs['sums'] = sList
      return objs
    },

    handleFooterLeftChart(lists, title, lines) {
      let chartData = this.handleDefectByColorFormatData(lists)
      let lineObj = this.handleLinesFormatData(lines)
      this.handleDefectByColor(
        chartData ? chartData : { xAxis: [] },
        title,
        lineObj,
        'L_footer' + this.byColorId
      )
    },


    handleDefectByColor(datas, title, line, id) {

      let dom = document.querySelector(`#${id}`)
      if (!dom) return;

      this.chartCxt[id] && this.chartCxt[id].dispose()
      window.removeEventListener('resize', resize)

      this.chartCxt[id] = echarts.init(
        dom,
        { renderer: 'svg' }
      )

      let option = {
        title: {
          text: title,
          left: 'center',
          top: '10',
          textStyle: {
            fontSize: this.titleFontSize,
            fontWeight: '800',
            color: this.color,
          },
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
          top: 40,
          type: 'scroll',
          show: true,
          padding: [0, 80],
          textStyle: {
            color: this.color
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
            color: this.color
          },
          pageIconColor: this.color
        },
        grid: {
          left: 40,
          right: 10,
          bottom: 10,
          top: 90,
          containLabel: true,
        },
        boundaryGap: true,
        position: 'bottom',
        xAxis: {
          type: 'category',
          data: datas.xAxis,
          axisLabel: {
            // formatter: (value) => {
            //   return value.replace('--', '\n')
            // },
            interval: '0',
            rotate: -90,
            overflow: 'truncate',
            ellipsis: '...',
            // height: 40,
            width: 40,
            color: this.color
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
              color: this.color
            },
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              verticalAlign: 'middle',
              align: 'left',
              color: this.color
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
          },
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: datas.series[key].ColorValue
              ? `rgb(${datas.series[key].ColorValue})`
              : this.barColor,
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
      this.chartCxt[id] && this.chartCxt[id].setOption(option, true)

      window.addEventListener('resize', resize);

      let _this = this;
      function resize() {
        _this.chartCxt[id] && _this.chartCxt[id].resize();
      }
    },
    // defect by color end

    getData(isShow) {
      let params = JSON.parse(JSON.stringify(this.params))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      GetUPH(params, isShow).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          let list = getData(data, params.S_DataLevel)
          this.dataFormat(list)
          this.getDefectYield(isShow)
        }
      })
    },

    getDefectYield(isShow) {
      let params = JSON.parse(JSON.stringify(this.params))
      params.S_LineID = this.defectLineIds[this.titles[this.index]]?.lineIds

      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.loading = true
      GetDefectYield(params, '', true).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          let list = {
            yAxis: data[4] ? data[4].map((r) => r.DefectCodeDesc) : [],
            Data: data[4] ? data[4].map((r) => r.DefectRate) : [],
          }
          // this.handleFooterMiddleChart('#' + this.ids + 'M_footer', list.yAxis, list.Data, 'Defect Pareto');
          this.handleFooterMiddleChart(list, 'Defect Pareto', '#' + this.ids + 'M_footer')
          this.handleFooterLeftChart(data[3],
            `Top ${params.S_TopQTY} Defect By Color`,
            data[5])
        }
        this.loading = false
      }, error => {
        this.loading = false
      })
    },

    dataFormat(obj) {
      this.titles = Object.keys(obj)
      let toObj = {};
      Object.keys(obj).forEach(key => {
        let o = {};
        let c = {};
        let to = {};

        let set = new Set()
        obj[key].forEach(item => {
          // Process Yield
          set.add(item.LineID)
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
        this.defectLineIds[key] = { lineIds: Array.from(set) }

        o['target'] = this.target;
        this.processYield[key] = Object.assign({}, o)

        this.carouselData[key] = Object.assign({}, c)

        toObj[key] = Object.assign({}, to)
      })

      // target output
      Object.keys(toObj).forEach(key => {
        Object.keys(toObj[key]).forEach(k => {
          let yAxis = [], target = [], data = [];
          Object.keys(toObj[key][k].Output).forEach(kk => {
            if (new Date(kk) != 'Invalid Date' || kk.includes('WK')) {
              yAxis.push(kk)
              target.push(toObj[key][k].UPHTarget[kk])
              // target.push(300)
              data.push(toObj[key][k].Output[kk])
            }
          })
          toObj[key][k] = { yAxis, target, data }
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

      this.setData(this.titles[this.index])
    },
    handleSum(arr) {
      if (!Array.isArray(arr) || !arr) { return }

      let sum = 0;
      arr.forEach(res => {
        sum += isNaN(res) ? 0 : res
      })
      return sum
    },
    setData(key) {
      this.$nextTick(function () {

        this.targetOutput[key] && Object.keys(this.targetOutput[key]).forEach(kk => {
          // debugger
          this.carouselData[key][kk]['target'] = this.handleSum(this.targetOutput[key][kk].target)
          this.carouselData[key][kk]['yTarget'] = this.target
          let id = this.ids + '_' + this.titles[this.index].replaceAll(/\/|\.|\(|\)|\+|\s/g, '_') + '_' + kk.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')
          this.handleHeaderLeftChart('#' + id, this.targetOutput[key][kk], kk)
        })
        this.outputData[key] && this.handleHeaderRightChart('#' + this.ids + 'R_header', this.outputData[key])
        this.processYield[key] && this.handleRightFooterChart('#' + this.ids + 'R_footer', 'Process Yield', this.processYield[key]);

        this.setHeaderMiddleChart(this.carouselData[key])

      })
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
  // background-image: url('./images/bg3.jpeg');
  // background-image: url('./images/bg5.jpg');
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
    right: 2%;
    top: 15px;
    z-index: 101;
  }

  .top_input {
    position: absolute;
    left: 25px;
    top: 15px;
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
      // color: #066b06;
      // color: #ad2424;
      overflow: unset;
    }

    .el-header {
      // border: 1px solid #2b83eb;
      margin: 5px;
      // height: calc(78vh / 2) !important;
      // height: inherit;
      overflow: unset;
    }

    .el-footer {
      // border: 1px solid #2b83eb;
      margin: 5px;
      // height: calc(76vh / 2) !important;
      // height: inherit;
      overflow: unset;
    }

    .el-main {
      overflow: unset;
    }
  }

  /*   .bgModal{
    pointer-events: none;
    height: 100%;
    width: 100%;
    position: absolute;
    background-color: #ccc;
    opacity: 0.5;
    z-index: 1;
  } */
}
</style>
