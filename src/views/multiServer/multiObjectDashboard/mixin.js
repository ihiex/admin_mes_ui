import * as echarts from 'echarts'
import { EnUsFormatData } from '@/utils'
import { getShift, getUserShift, uuid } from '@/utils'


export default {
  methods: {
    handleUPHChart(id, data, station, target) {
      let list = [];
      let CUMActual = 0;
      let CUMTarget = 0;
      let dMax = Math.max.apply(Math, data.data)
      let tMax = Math.max.apply(Math, data.target)

      data.data.forEach((val, index) => {
        list.push({ value: val, itemStyle: { color: !data.target[index] ? '#6790d8' : val > data.target[index] ? '#6790d8' : '#ad2424' } })
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
              // color: this.color
            },
            left: '10%',
            top: 10
          },
          {
            subtext: `CUMTarget: ${CUMTarget ? EnUsFormatData(CUMTarget) : '--'}`,
            left: '35%',
            top: 28,
            subtextStyle: {
              fontWeight: 800
            }
          },
          {
            subtext: `CUMActual: ${CUMActual ? EnUsFormatData(CUMActual) : '--'}`,
            left: '65%',
            top: 28,
            subtextStyle: {
              color: CUMActual < CUMTarget ? 'red' : '#777881',
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
          data: ['output'],
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
              color: '#6e7079'
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
              color: '#6e7079'
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
            subtext: `Tops ${top ? top : ''} Defects ${lineName ? 'by '+lineName : ''}`,
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
              //  color: this.color,
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
              color: parseFloat(CumActual) < parseFloat(CumTarget) ? 'red' : '#777881',
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
          },
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
          },
          axisTick: {
            alignWithLabel: true,
            interval: '0',
          },
        },
        series: [
          {
            // name: 'Defect Rate',
            type: 'bar',
            // width: 30,
            // barMaxWidth: '20%',
            data: datas?.Data,
            itemStyle: {
              color: '#6790d8',
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
    handleDefectChartV1(datas, id) {

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
        title: {
          text: 'Defect Rate',
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
          },
          axisTick: {
            alignWithLabel: true,
            interval: '0',
          },
        },
        series: [
          {
            // name: 'Defect Rate',
            type: 'bar',
            width: 30,
            data: datas.Data,
            itemStyle: {
              color: '#6790d8',
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

    handleReset() {
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
      this.$set(this.params, 'S_DataLevel', 8) //
    },
    handleCumTargetInput(val) {
      if (isNaN(val)) return;
      localStorage.setItem('YieldCumTarget', val)
      let yieldCumActual = this.getCumActual(this.titles[this.index])

      Object.keys(this.processYield).forEach(key=>{
        if(!this.processYield[key].srcFlag){
          this.$set(this.processYield[key], 'target', parseFloat(val))
        }else{
          return;
        }
      })

      this.handleDefectChart(this.dyData[this.titles[this.index]], this.dyId, yieldCumActual, val);
    },
    handleTargetInput(val) {
      if (isNaN(val)) return;
      localStorage.setItem('UPHTarget', val)
      Object.values(this.targetOutput).forEach(value => {
        Object.values(value).forEach(item => {
          if (!item.flag) {
            item?.target.forEach((res, index) => {
              item.target[index] = parseFloat(val)
            })
          }else{
            return
          }
        })
      })
      this.setData(this.titles[this.index])
    },
    handleResize() {
      this.$nextTick(function () {
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
      let key = this.titles[this.index]
      this.oneEven = true;

      Object.values(this.cacheParams).forEach(value => {
        this.$set(value, 'S_TopQTY', val)
      })

      console.log(this.cacheParams)

      this.getDefectYield(this.cacheParams[key], key)
    },

    getCumActual(key) {
      let sumInput = 0;
      let sumOutput = 0;
      this.carouselData?.[key] && Object.values(this.carouselData?.[key]).forEach(value => {
        sumInput += value.Input
        sumOutput += value.Output
      })

      return (sumOutput / sumInput * 100).toFixed(2)
    }
  }
}
