<template>
  <div :id="`ParetoBarChart${cid}`" class="common_chart"></div>
</template>

<script>
import * as echarts from 'echarts'

/* 不良 Pareto bridge */
export default {
  name: 'ParetoBarChart',
  props: {
    cid: {
      type: String,
      require: true,
      default: () => {
        return 'a8b9c0cc'
      },
    },
  },
  data() {
    return {
      ParetoBarChart: null,
      timer: null,
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.ParetoBarChart && this.ParetoBarChart.dispose()
  },
  methods: {
    /**
     * lists 数据源
     * title
     */
    show(chartData, title) {
      this.handleYieldBridge(chartData, title)
    },

    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.ParetoBarChart && that.ParetoBarChart.resize()
      }, 300)
    },
    handleYieldBridge(datas, title) {
      this.ParetoBarChart && this.ParetoBarChart.clear()
      window.removeEventListener('resize', this.handleWindowResize)
      this.ParetoBarChart = echarts.init(
        document.querySelector(`#ParetoBarChart${this.cid}`),
        { renderer: 'svg' }
      )
      let option = {
        title: {
          text: title,
          textStyle: {
            color: '#222',
            fontSize: 14,
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
          top: '7%',
          type: 'scroll',
          show: true,
        },
        grid: {
          left: 30,
          right: 70,
          bottom: 0,
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
            // rotate: -30,
            overflow: 'break',
            // ellipsis: '...',
            // height: 24,
            // width: 50,
            // margin: 18,
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
              color: '#75ac39',
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
      this.ParetoBarChart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
  },
}
</script>

