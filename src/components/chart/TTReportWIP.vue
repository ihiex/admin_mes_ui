<template>
  <div :id="`TTReportWIP${cid}`"></div>
</template>

<script>
import * as echarts from 'echarts'
import { maxIndex } from '@/utils'

export default {
  name: 'TTReportWIP',
  props: {
    cid: {
      type: String,
      require: true,
      default: () => {
        return '90ac90ef'
      },
    },
  },
  data() {
    return {
      mychart: null,
      timer: null,
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.mychart && this.mychart.dispose()
  },
  methods: {
    show(lists) {
      this.mychart && this.mychart.clear()
      let chartData = this.handleFormatData(lists)
      this.handleChart(document.querySelector(`#TTReportWIP${this.cid}`), chartData)
    },
    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.mychart && that.mychart.resize()
      }, 800)
    },
    handleFormatData(datas) {
      if (!Array.isArray(datas) || datas.length == 0)
        return { xAxis: [], series: [], series1: [] }
      let objs = [],
        xAxis = []
      datas.forEach((item) => {
        xAxis.push(item.Description)
        objs.push({
          value: parseInt(item.QTY),
          label: item.Description,
          PType: item.PType,
        })
      })

      let mIndex = maxIndex(objs.map((res) => res.value))
      let series = new Array(objs.length)
      series[series.length - 1] = objs[mIndex]

      let val = objs.splice(mIndex, 1)
      objs[objs.length] = {
        value: null,
        label: val[0].label,
        PType: val[0].PType,
      }

      let x = xAxis[mIndex]
      xAxis.splice(mIndex, 1)
      xAxis[xAxis.length] = x

      return { xAxis, series: objs, series1: series }
    },
    handleChart(dom, obj) {
      if (!dom) return
      window.removeEventListener('resize', this.handleWindowResize)
      let name = this.$t('quantity')
      this.mychart = echarts.init(dom)
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999',
            },
          },
          formatter: function (params) {
            let str = '<div>' + params[0].axisValueLabel
            params.forEach((item) => {
              if (item.value) {
                str +=
                  `<div style="color:${item.color}">` +
                  item.marker +
                  '&nbsp;' +
                  item.seriesName +
                  '&nbsp;&nbsp;&nbsp;&nbsp;' +
                  item.value +
                  '</div>'
              }
            })
            str += '</div>'
            return str
          },
        },
        grid: {
          bottom: 120,
          left: 80,
          right: 80,
          top: 100,
        },
        toolbox: {
          feature: {
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true },
          },
          top: 15,
          left: 0,
        },
        legend: {
          data: [name, name + '.'],
          //   top: 15
        },
        xAxis: [
          {
            type: 'category',
            data: obj.xAxis,
            axisPointer: {
              type: 'shadow',
            },
            axisLabel: {
              interval: '0',
              rotate: -90,
              overflow: 'break',
              ellipsis: '...',
              height: 14,
              width: 100,
              // margin: 18,
              color: function (val, index) {
                return obj.series[index].PType == '0' ? '#a90000' : 'black'
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: name,
            offset: 5,
            axisLabel: {
              color: '#5470c6',
            },
            nameTextStyle: {
              color: '#5470c6',
              align: 'right',
            },
            splitLine: {
              show: true,
            },
          },
          {
            type: 'value',
            name: name + '.',
            offset: 8,
            axisLabel: {
              color: '#91cc75',
            },
            nameTextStyle: {
              color: '#91cc75',
              align: 'left',
            },
            splitLine: {
              show: false,
            },
          },
        ],
        series: [
          {
            name: name,
            type: 'bar',
            barGap: '-100%',
            label: {
              show: true,
              distance: 0,
              rotate: -90,
              align: 'right',
              verticalAlign: 'middle',
              position: 'top',
              distance: 10,
              color: '#5470c6',
            },
            itemStyle: {
              color: '#5470c6',
            },
            data: obj.series,
          },

          {
            name: name + '.',
            type: 'bar',
            yAxisIndex: 1,
            barGap: '-100%',
            label: {
              show: true,
              distance: 0,
              rotate: -90,
              align: 'right',
              verticalAlign: 'middle',
              position: 'top',
              distance: 10,
              color: '#91cc75',
            },
            itemStyle: {
              color: '#91cc75',
            },
            data: obj.series1,
          },
        ],
      }

      this.mychart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>