<template>
  <div :id="`DefectRateChartLine${cid}`" class="common_chart"></div>
</template>

<script>
import * as echarts from 'echarts'
/* 不良 Top 10 Defect Rate Trend Chart */
export default {
  name: 'DefectRateChartLine',
  props: {
    cid: {
      type: String,
      require: true,
      default: () => {
        return 'lko297326kjsdfi'
      },
    },
  },
  data() {
    return {
      DefectRateChartLine: null,
      timer: null,
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.DefectRateChartLine && this.DefectRateChartLine.dispose()
  },
  methods: {
    /**
     * lists 数据源
     * AxisData x/y轴对象数组
     * title
     */
    show(lists, AxisData, title) {
      let chartData = this.handleYieldTrendChartFormatData(lists, AxisData)
      this.handleYieldTrendChart(
        chartData ? chartData : { AxisData: [], series: [] },
        title
      )
    },
    handleYieldTrendChartFormatData(lists, keys) {
      if (!Array.isArray(lists) || lists.length == 0) return
      let xAxis = keys.map((res) => res.CDate)
      //
      let objs = {}
      lists.forEach((res) => {
        if (objs[res.DefectCodeDesc]) {
          objs[res.DefectCodeDesc].push(res)
        } else {
          objs[res.DefectCodeDesc] = [res]
        }
      })
      let arr = [],
        j = 0
      for (let key in objs) {
        arr = []
        j = 0
        xAxis.forEach((res) => {
          // debugger
          if (objs[key][j] && res === objs[key][j].CDate) {
            arr.push(objs[key][j].DefectRate)
            j++
          } else {
            arr.push(null)
          }
        })
        objs[key] = arr
      }
      return { AxisData: xAxis, series: objs }
    },
    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.DefectRateChartLine && that.DefectRateChartLine.resize()
      }, 300)
    },
    handleYieldTrendChart(chartData, title) {
      this.DefectRateChartLine && this.DefectRateChartLine?.clear()
      window.removeEventListener('resize', this.handleWindowResize)
      let dom = document.querySelector(`#DefectRateChartLine${this.cid}`)
      if(!dom) return;

      this.DefectRateChartLine = echarts.init(
        dom,
        { renderer: 'svg' }
      )
      let option = {
        title: {
          text: title,
          textStyle: {
            color: '#222',
            fontSize: 14
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
              if (res.value) {
                str += `${res.marker}&nbsp;${res.seriesName}&nbsp;&nbsp;${res.value}%<br/>`
              }
            })
            str += '<div/>'
            return str
          },
        },
        legend: {
          type: 'scroll',
          show: true,
          top: 30,
          padding: [0, 80],
          // right: 0,
          // orient: 'vertical'
        },
        grid: {
          left: 30,
          right: 80,
          bottom: 0,
          top: 80,
          containLabel: true,
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
          data: chartData.AxisData,
        },
        yAxis: {
          type: 'value',
          show: true,
          // min: 94,
          // max: 100,
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
        option.series.push({
          name: key,
          type: 'line',
          data: chartData.series[key],
          label: {
            show: true,
            formatter: `{c}%`,
          },
          // lineStyle: {
          //   color: '#5676a8',
          // },
          // itemStyle: {
          //   color: '#5676a8',
          // },
        })
      }
      this.DefectRateChartLine.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
  },
}
</script>
