import { mapGetters } from 'vuex'
import { getMoneyFormat, lastDate, sleep, getShift } from '@/utils'
import * as echarts from 'echarts'

export default {
  data() {
    let yieldTarget = localStorage.getItem('YieldTarget');
    return {
      barAndPie: null,
      cums: [],
      lineProgress: [],
      lineChartContext: {},
      total: [],
      time: null,
      AlarmType1: {},
      AlarmType2: {},
      hiddenXsOnly: window.innerWidth <= 640,
      mDomFlag: true,
      cDomFlag: true,
      mDom: null,
      cDom: null,
      time1: null,
      time2: null,
      timer: null,
      isFirstInit: true,
      scrollTimer: {},
      chartItems: {},
      chartItemsKey: '',
      visible: false,
      pointInTime: 'Total',
      loading: false,
      timing: null,
      yieldTarget: yieldTarget ? parseFloat(yieldTarget) : 100,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      this.handleWindowResize()
    }
  },
  created() {
    this.handleGetOutputSum({
      S_StartDateTime: '2000-01-01',
      S_EndDateTime: '2000-01-01',
      YieldLevel: 1, //良率层级
      IsCombineYield: 0, //良率合并
      S_DataLevel: 7
    }, true)

    // this.setTiming()
  },
  deactivated() {
    window.removeEventListener('resize', this.handleWindowResize)
    if (this.mDom && this.cDom) {
      this.handleRemoveEvent(this.mDom, this.cDom)
    }
    // this.clearTiming()
  },
  activated() {
    this.handleWindowResize()
    window.addEventListener('resize', this.handleWindowResize)
    !this.isFirstInit && this.handleAddEvent(this.mDom, this.cDom)

    // this.setTiming()
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    if (this.mDom && this.cDom) {
      this.handleRemoveEvent(this.mDom, this.cDom)
    }
    Object.keys(this.scrollTimer).forEach(key => {
      this.scrollTimer[key] && clearInterval(this.scrollTimer[key])
    })
    // this.clearTiming()
  },
  methods: {
    handleYieldTarget(val) {
      if (val < 0) {
        this.yieldTarget = 0;
      } else if (val > 100) {
        this.yieldTarget = 100
      }

      localStorage.setItem('YieldTarget', val)
    },
    clearTiming() {
      if (this.timing) {
        clearInterval(this.timing)
        this.timing = null
      }
    },
    setTiming() {

      let that = this;
      that.timing && clearInterval(that.timing)

      that.timing = setInterval(function () {
        that.handleGetOutputSum(that.changeTime(that.pointInTime), false);
      }, 1000 * 60 * 5)
    },

    handleChangeTime(val) {
      this.visible = false
      this.pointInTime = val
      this.handleGetOutputSum(this.changeTime(val), true);
    },

    changeTime(val) {
      let shift = getShift(this.$store.getters['user/shiftTable'])
      let params = {
        S_StartDateTime: '2000-01-01',
        S_EndDateTime: '2000-01-01',
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
        S_DataLevel: 7
      }
      switch (val) {
        case 'CurrentShift':
          this.$set(params, 'S_StartDateTime', shift.sTime)
          this.$set(params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
          break;

        case 'LastWeek':
          let date = new Date();
          date.setDate(date.getDate() - 7)
          this.$set(params, 'S_StartDateTime', date.format('yyyy-MM-dd hh:mm:ss'))
          this.$set(params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
          break;
        default:
      }

      return params
    },

    handleScroll(id, key) {
      // debugger
      let that = this;
      let sLen = 0
      let pScroll = document.querySelector('#' + id)
      // if (!pScroll.scrollLeft) return null;
      /* if (that[id + key]) {
        clearInterval(that[id + key])
      } */
      that[id + key] = setInterval(async function () {
        !pScroll && (pScroll = document.querySelector('#' + id))
        sLen = pScroll?.scrollLeft
        if (!pScroll) return;
        if (that[key]) {
          pScroll.scrollLeft += 1
          if (pScroll?.scrollLeft <= sLen) {
            await sleep(1000 * 2)
            that[key] = false
          }
        } else {
          pScroll.scrollLeft -= 1
          if (pScroll?.scrollLeft <= 0) {
            await sleep(1000 * 2)
            that[key] = true
          }
        }
      }, 50)

      return that[id + key]
    },

    getMoneyFormat(val) {
      return getMoneyFormat(val)
    },

    //当前产能
    handleLineProgressChart(dom, data, key) {
      this.lineChartContext[key] && this.lineChartContext[key].dispose()
      this.lineChartContext[key] = echarts.init(dom, { renderer: 'svg' })
      let option = {
        title: [
          {
            text: 'Output',
            x: '50%',
            y: '17%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
            },
          },
          /* {
            text: (data.CompletedRate ? data.CompletedRate : '-') + '%',
            x: '50%',
            y: '29%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
            },
          }, */
          {
            text: 'A:' + data.Output,
            x: '50%',
            // y: '41%',
            y: '34%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
              color: data.CompletedRate >= 100 ? '#178d34' : '#c72513',
            },
          },
          {
            text: 'T:' + (data.UPHTarget ? data.UPHTarget : '-'),
            x: '50%',
            // y: '54%',
            y: '50%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              textAlign: 'center',
            },
          },
          {
            text: data.Line,
            left: '50%',
            top: '82%',
            textAlign: 'center',
            textStyle: {
              fontSize: '12',
              // fontWeight: '400',
              // color: '#C7CFDC',
              textAlign: 'center',
              // fontFamily: 'DigitalDismay',
            },
            z: 20,
          },
        ],
        polar: {
          radius: ['64%', '84%'],
          center: ['52%', '43.5%'],
        },
        angleAxis: {
          max: data.UPHTarget,
          show: false,
          startAngle: 90,
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        series: [
          {
            name: '',
            type: 'bar',
            roundCap: true,
            radius: ['90%', '100%'],
            // barWidth: 200,
            showBackground: true,
            backgroundStyle: {
              color: '#ccc',
            },
            data: [{ value: data.Output, itemStyle: { color: data.CompletedRate >= 100 ? '#178d34' : '#c72513' } }],
            coordinateSystem: 'polar',
          },
        ],
      }
      this.lineChartContext[key].setOption(option, true)
    },
    handleFormatData(lists) {
      if (!Array.isArray(lists) || !lists.length) return
      let byMonth = {}
      lists.forEach((res) => {
        if (byMonth[res.CMonth]) {
          byMonth[res.CMonth].push(res)
        } else {
          byMonth[res.CMonth] = [res]
        }
      })
      let obj = { NG: {}, Input: {}, Output: {}, Yield: {} }
      for (let key in byMonth) {
        let ld = lastDate(key)
        let j = 0
        let sd = byMonth[key][j].CDay
        for (let i = 0; i < ld; i++) {
          //比对日期 注意safari浏览不支持日期格式 '-'
          if (
            sd ===
            new Date(`${key.replace(/\-/g, '/')}/${i + 1}`).format('yyyy-MM-dd')
          ) {
            if (obj.NG[key]) {
              obj.NG[key].push(byMonth[key][j].NG)
            } else {
              obj.NG[key] = [byMonth[key][j].NG]
            }
            if (obj.Input[key]) {
              obj.Input[key].push(byMonth[key][j].Input)
            } else {
              obj.Input[key] = [byMonth[key][j].Input]
            }
            if (obj.Output[key]) {
              obj.Output[key].push(byMonth[key][j].Output)
            } else {
              obj.Output[key] = [byMonth[key][j].Output]
            }
            if (obj.Yield[key]) {
              obj.Yield[key].push(byMonth[key][j].Yield)
            } else {
              obj.Yield[key] = [byMonth[key][j].Yield]
            }
            sd = byMonth[key][++j] ? byMonth[key][j].CDay : null
          } else {
            if (obj.NG[key]) {
              obj.NG[key].push(null)
            } else {
              obj.NG[key] = [null]
            }
            if (obj.Input[key]) {
              obj.Input[key].push(null)
            } else {
              obj.Input[key] = [null]
            }
            if (obj.Output[key]) {
              obj.Output[key].push(null)
            } else {
              obj.Output[key] = [null]
            }
            if (obj.Yield[key]) {
              obj.Yield[key].push(null)
            } else {
              obj.Yield[key] = [null]
            }
          }
        }
      }
      return obj
    },
    handleShowTotalAnimation(total) {
      let that = this
      that.total.Input = 0
      that.total.NG = 0
      that.total.Output = 0
      that.total.SCRAP = 0

      let flagObj = {
        f1: false,
        f2: false,
        f3: false,
        f4: false,
      }
      let random = parseInt(Math.random() * 100000)
      let time = setInterval(function () {
        if (that.total.Input < total.Input) {
          that.$set(that.total, 'Input', (that.total.Input += random))
        } else {
          flagObj.f1 = true
          that.$set(that.total, 'Input', getMoneyFormat(total.Input))
        }
        if (that.total.NG < total.NG) {
          that.$set(that.total, 'NG', (that.total.NG += random))
        } else {
          that.$set(that.total, 'NG', getMoneyFormat(total.NG))
          flagObj.f2 = true
        }
        if (that.total.Output < total.Output) {
          that.$set(that.total, 'Output', (that.total.Output += random))
        } else {
          that.$set(that.total, 'Output', getMoneyFormat(total.Output))
          flagObj.f3 = true
        }
        if (that.total.SCRAP < total.SCRAP) {
          that.$set(that.total, 'SCRAP', (that.total.SCRAP += random))
        } else {
          that.$set(that.total, 'SCRAP', getMoneyFormat(total.SCRAP))
          flagObj.f3 = true
        }
        if (flagObj.f1 && flagObj.f2 && flagObj.f3 && flagObj.f4) {
          clearInterval(time)
        }
      }, 0)
    },

    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.barAndPie && that.barAndPie.resize()
      }, 500)

      that.hiddenXsOnly = window.innerWidth <= 640
    },

    handleEchart(dom, barAndPie, datas) {
      this[barAndPie] && this[barAndPie].clear()
      window.removeEventListener('resize', this.handleWindowResize)
      this[barAndPie] = echarts.init(dom, { renderer: 'svg' })
      var dataMap = {}
      let timelineData = []
      function dataFormatter(obj) {
        timelineData = Object.keys(obj)
        for (let key in obj) {
          var sum = 0
          for (let i = 0, l = lastDate(key); i < l; i++) {
            obj[key][i] = {
              name: `${i + 1}`,
              value: obj[key][i],
            }
            sum += obj[key][i].value == null ? 0 : obj[key][i].value
          }
          obj[key + '-sum'] = sum
        }
        return obj
      }
      dataMap.NG = dataFormatter(datas.NG)
      dataMap.Input = dataFormatter(datas.Input)
      dataMap.Output = dataFormatter(datas.Output)
      dataMap.Yield = dataFormatter(datas.Yield)
      let that = this

      function getXAxisData(index = 0) {
        let datas = []
        let lastD = lastDate(timelineData[index])
        for (let i = 1; i <= lastD; i++) {
          if (that.hiddenXsOnly) {
            if (i % 2 != 0) {
              datas.push('\n' + i)
            } else {
              datas.push(i)
            }
          } else {
            datas.push(i)
          }
        }
        return datas
      }
      let option = {
        backgroundColor: '#fff',
        baseOption: {
          timeline: {
            show: true,
            axisType: 'category',
            autoPlay: true,
            playInterval: 3000,
            data: timelineData,
            left: 0,
            right: 30,
            bottom: 30,
          },
          tooltip: {},
          legend: {
            left: 'left',
            top: '7%',
          },
          calculable: true,
          grid: {
            top: '25%',
            bottom: 100,
            left: 100,
            right: 80,
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                type: 'shadow',
                label: {
                  show: true,
                  formatter: function (params) {
                    return params.value.replace('\n', '')
                  },
                },
              },
            },
          },
          xAxis: {
            type: 'category',
            name: this.$t('day'),
            data: [],
            axisLabel: { interval: 0 },
            splitLine: { show: false },
          },
          yAxis: [
            {
              type: 'value',
              name: this.$t('yield'),
            },
            {
              type: 'value',
              name: 'yield',
              // min: 10,
              show: false,
              axisLabel: {
                formatter: '{value} %'
              }
            }
          ],
          series: [
            { name: 'Input', type: 'bar', itemStyle: { color: '#0838c9' } },
            {
              name: 'Output', type: 'bar', itemStyle: { color: '#178d34' }, label: {
                show: true, align: 'center',
                offset: [0, 5],
                position: 'top',
                valueAnimation: true,
                color: '#178d34'
              }
            },
            { name: 'NG', type: 'bar', itemStyle: { color: '#c72513' } },
            {
              name: this.$t('ProductionOf'),
              type: 'pie',
              center: ['80%', '12%'],
              radius: '18%',
              z: 100,
              label: {
                formatter: function (val) {
                  return getMoneyFormat(val.value) + '\n' + val.name
                },
              },
            },
            // {
            //   name: 'Yield', type: 'line', yAxisIndex: 1, itemStyle: { color: '#dd7d04' }, tooltip: {
            //     valueFormatter: function (value) {
            //       return value + ' %';
            //     }
            //   }, label: {
            //     show: true,
            //     position: 'top',
            //     formatter: `{c} %`,
            //     // offset: [0, -10]
            //   },
            // },
          ],
        },
        options: [],
      }

      for (let item of timelineData) {
        option.options.push({
          backgroundColor: '#fff',
          title: { text: item + ' ' + this.$t('monthOutput') },
          series: [
            { data: dataMap.Input[item] },
            { data: dataMap.Output[item] },
            { data: dataMap.NG[item] },
            {
              data: [
                {
                  name: 'Input',
                  value: dataMap.Input[item + '-sum'],
                  itemStyle: { color: '#0838c9' },
                },
                {
                  name: 'Output',
                  value: dataMap.Output[item + '-sum'],
                  itemStyle: { color: '#178d34' },
                },
                {
                  name: 'NG',
                  value: dataMap.NG[item + '-sum'],
                  itemStyle: {
                    color: '#c72513',
                  },
                },
              ],
            },
            // { data: dataMap.Yield[item] },
          ],
        })
      }

      option.baseOption.xAxis.data = getXAxisData(0)

      this[barAndPie].setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)

      this[barAndPie].on('timelinechanged', function (obj) {
        option.baseOption.xAxis.data = getXAxisData(obj.currentIndex)
        that[barAndPie].setOption(option)
      })
    },

    getChartItemData(list) {
      if (!Array.isArray(list)) return;
      let obj = {}

      list.forEach(item => {
        if (obj[item.StationType]) {
          obj[item.StationType].push(item)
        } else {
          obj[item.StationType] = [item]
        }
      })

      return obj
    },

    //获取各项目的cum
    getCumsData(list) {
      if (!Array.isArray(list)) return;
      let obj = {}
      list.forEach(item => {
        if (obj[item.ProjectName]) {
          obj[item.ProjectName].push(item)
        } else {
          obj[item.ProjectName] = [item]
        }
      })
      /*  Object.keys(obj).forEach(key => {
         obj[key] = this.formatArrayToObject(obj[key])
       }) */
      return obj
    },

    // 弃用
    formatArrayToObject(arr) {
      if (!Array.isArray(arr)) return
      let obj = {}
      arr.forEach(item => {
        Object.keys(item).forEach(key => {
          if (key != 'ProjectIcon') {
            obj[item.StationType + '_' + key] = item[key]
          } else if (key === 'ProjectIcon') {
            obj[key] = item[key]
          }
        })
      })
      return obj
    },
  },
}
