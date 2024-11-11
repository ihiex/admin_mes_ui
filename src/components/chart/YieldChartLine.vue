<template>
  <div :id="`YieldChartLine${cid}`" class="common_chart"></div>
</template>

<script>
import * as echarts from 'echarts'

/* 良率折线图 */
export default {
  name: 'YieldChartLine',
  props: {
    cid: {
      type: String,
      require: true,
      default: () => {
        return '87ac90ef'
      },
    },
  },
  data() {
    return {
      yieldLineChart: null,
      timer: null,
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.yieldLineChart && this.yieldLineChart.dispose()
  },

  methods: {
    /**
     * lists 数据源
     * keys 用于拼接的key字符串数组
     * AxisData x轴的日期数组对象
     * title
     */
    show(lists, keys, AxisData, title, target) {
      let chartData = this.handleDataFormat(
        this.handleDataFormatToDate(lists, keys),
        AxisData
      )

      this.handleLine(chartData, title, target)
    },
    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.yieldLineChart && that.yieldLineChart.resize()
      }, 300)
    },
    handleLine(chartData, title, target) {
      this.yieldLineChart && this.yieldLineChart.clear()
      window.removeEventListener('resize', this.handleWindowResize)
      this.yieldLineChart = echarts.init(
        document.querySelector(`#YieldChartLine${this.cid}`),
        { renderer: 'svg' }
      )

      let option = {
        title: {
          text: title,
          textStyle: {
            color: '#222',
          },
        },
        legend: {
          top: '8%',
          type: 'scroll',
          show: true,
          padding: [0, 80],
        },
        grid: {
          left: 30,
          right: 80,
          bottom: 20,
          top: 80,
          containLabel: true,
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (arr) {
            let str = '<div>' + `<div>${arr[0].axisValueLabel}</div>`
            arr.forEach((res) => {
              if (/\d/.test(res.value)) {
                str += `${res.marker}&nbsp;${res.seriesName}&nbsp;&nbsp;${res.value}%<br/>`
              }
            })
            str += '<div/>'
            return str
          },
        },
        toolbox: {
          left: 0,
          top: 20,
          feature: {
            // saveAsImage: {},
            restore: {},
            magicType: {
              type: ['bar'],
            },
          },
        },
        xAxis: {
          type: 'category',
          // boundaryGap: false,
          axisLine: {
            onZero: false,
            lineStyle: {
              color: '#222',
            },
          },
          data: chartData.xAxisData,
        },
        yAxis: {
          type: 'value',
          show: true,
          min: chartData.min ? chartData.min : 0, //Math.floor(datas.min),
          max: 100,
          axisLabel: {
            formatter: '{value} %',
          },
          axisLine: {
            show: true,
            onZero: false,
          },
        },
        series: [],
      }

      for (let key in chartData.series) {
        if (target >= 0) {
          option.series.push({
            name: key,
            type: 'line',
            data: chartData.series[key],
            label: {
              show: true,
              formatter: `{c}%`,
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
                  yAxis: target,
                },
              ],
            },
          })
        } else {
          option.series.push({
            name: key,
            type: 'line',
            data: chartData.series[key],
            label: {
              show: true,
              formatter: `{c}%`,
            },
          })
        }
      }
      this.yieldLineChart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
    /**
     * 格式成echarts可以渲染的line数据类型
     */
    handleDataFormat(lists, dates) {
      if (!Array.isArray(dates) || dates.length == 0) return {}
      let arr = []
      let list = {}
      let min = lists[Object.keys(lists)[0]][0].Yield
      for (let key in lists) {
        arr = []
        dates.forEach((item, index) => {
          arr.push(item.CDate)
          if (lists[key][index] && item.CDate === lists[key][index].CDate) {
            min > lists[key][index].Yield
              ? (min = lists[key][index].Yield)
              : min
          } else {
            lists[key].splice(index, 0, { CDate: item.CDate, Yield: null })
          }
        })
      }
      list['xAxisData'] = arr
      list['series'] = {}
      list['min'] = min - 20 <= 0 ? 0 : Math.floor(min - 20)
      for (let key in lists) {
        list.series[key] = lists[key].map((res) => res.Yield)
      }
      return list
    },
    /**
     * 将数据格式化成带日期的对象数据类型
     */
    handleDataFormatToDate(lists, keys) {
      if (!Array.isArray(lists) || lists.length == 0) return {}
      let series = {},
        sKey = ''

      lists.forEach((res) => {
        if (res.CDate !== 'Total') {
          sKey = ''
          keys.forEach((r) => {
            sKey += res[r] ? `${res[r]}_` : ''
          })
          sKey = sKey.substring(0, sKey.length - 1)
          if (series[sKey]) {
            series[sKey].push({
              CDate: res.CDate,
              Yield: res.Yield,
            })
          } else {
            series[sKey] = [{ CDate: res.CDate, Yield: res.Yield }]
          }
        }
      })
      return series
    },
  },
}
</script>