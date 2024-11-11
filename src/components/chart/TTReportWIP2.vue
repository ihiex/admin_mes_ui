<template>
  <div id="TTReportWIP2"></div>
</template>

<script>
import * as echarts from 'echarts'
import { maxIndex } from '@/utils'

export default {
  name: 'TTReportWIP2',
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
      this.handleChart(document.querySelector('#TTReportWIP2'), chartData)
    },
    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.mychart && that.mychart.resize()
      }, 800)
    },
    /**
     * 格式化数据 分双y轴显示
     */
    handleFormatData(datas) {
      if (!Array.isArray(datas) || datas.length == 0){
        return { yAxisIndex: [], yAxisIndex2: [], xAxis: [] }
      }
      let maxData = datas.splice(maxIndex(datas.map((res) => res.Total)), 1)
      let yAxisIndex = {}
      let yAxisIndex2 = maxData[0]
      datas.forEach((res) => {
        Object.keys(res).forEach((key) => {
          if (yAxisIndex[key]) {
            yAxisIndex[key].push(res[key])
          } else {
            yAxisIndex[key] = [res[key]]
          }
        })
      })
      //如果数据中只有一个值时 需补上
      if (!yAxisIndex.Grade1) {
        yAxisIndex = {
          Grade1: [],
          Grade2: [],
          Grade3: [],
          OK: [],
          Total: [],
          UnitState: [],
        }
      }
      yAxisIndex.Grade1[yAxisIndex.Grade1 ? yAxisIndex.Grade1.length : 1] = null
      yAxisIndex.Grade2[yAxisIndex.Grade2 ? yAxisIndex.Grade2.length : 1] = null
      yAxisIndex.Grade3[yAxisIndex.Grade3 ? yAxisIndex.Grade3.length : 1] = null
      yAxisIndex.OK[yAxisIndex.OK ? yAxisIndex.OK.length : 1] = null
      yAxisIndex.Total[yAxisIndex.Total ? yAxisIndex.Total.length : 1] = null

      yAxisIndex2.Grade1 = [
        ...new Array(yAxisIndex.Grade1 ? yAxisIndex.Grade1.length - 1 : 0),
        yAxisIndex2.Grade1,
      ]
      yAxisIndex2.Grade2 = [
        ...new Array(yAxisIndex.Grade2 ? yAxisIndex.Grade2.length - 1 : 0),
        yAxisIndex2.Grade2,
      ]
      yAxisIndex2.Grade3 = [
        ...new Array(yAxisIndex.Grade3 ? yAxisIndex.Grade3.length - 1 : 0),
        yAxisIndex2.Grade3,
      ]
      yAxisIndex2.OK = [
        ...new Array(yAxisIndex.OK ? yAxisIndex.OK.length - 1 : 0),
        yAxisIndex2.OK,
      ]
      yAxisIndex2.Total = [
        ...new Array(yAxisIndex.Total ? yAxisIndex.Total.length - 1 : 0),
        yAxisIndex2.Total,
      ]

      let xAxis = [...yAxisIndex.UnitState, yAxisIndex2.UnitState]
      delete yAxisIndex.UnitState
      delete yAxisIndex2.UnitState

      return { yAxisIndex, yAxisIndex2, xAxis }
    },
    handleChart(dom, obj) {
      if (!dom) return
      window.removeEventListener('resize', this.handleWindowResize)
      let colors = {
        Total: '#3e8ef7',
        OK: '#008000',
        Grade1: '#ffcc00',
        Grade2: '#ff9900',
        Grade3: '#ff0000',
      }
      let name = this.$t('quantity')
      let index = 0
      this.mychart = echarts.init(dom)
      let option = {
        title: {
          // text: obj.Title,
          textStyle: {
            fontSize: 16,
          },
        },
        dataZoom: [
          {
            type: 'inside',
            // bottom: -10,
            // height: 5
          },
          {
            type: 'slider',
            bottom: 20,
            height: 5,
          },
        ],
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
              //过滤两个不同y轴 的显示数据 为null 不显示
              if (item.dataIndex != index - 1) {
                //y0轴
                if (item.value !== null && item.value !== undefined) {
                  str +=
                    `<div style="color:${item.color}">` +
                    item.marker +
                    '&nbsp;' +
                    item.seriesName +
                    '&nbsp;&nbsp;&nbsp;&nbsp;' +
                    item.value +
                    '</div>'
                }
              } else {
                //为''不显示 y1轴
                if (item.value !== '' && item.value !== undefined) {
                  str +=
                    `<div style="color:${item.color}">` +
                    item.marker +
                    '&nbsp;' +
                    item.seriesName +
                    '&nbsp;&nbsp;&nbsp;&nbsp;' +
                    item.value +
                    '</div>'
                }
              }
            })
            str += '</div>'
            return str
          },
        },
        grid: {
          bottom: 160,
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
          left: 10,
        },
        legend: {
          // data: [name, name + '.'],
          // top: 15,
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
            },
          },
          {
            type: 'category',
            data: obj.xAxis,
            axisPointer: {
              type: 'shadow',
            },
            axisLabel: {
              // interval: '0',
              // rotate: -90,
              // overflow: 'break',
              // ellipsis: '...',
              // height: 14,
              // width: 100,
              show: false,
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            name: name,
            axisLabel: {
              color: '#5470c6',
            },
            nameTextStyle: {
              color: '#5470c6',
              align: 'right',
            },
            // nameLocation: 'middle',
            // nameGap: 50,
            splitLine: {
              show: true,
            },
          },
          {
            type: 'value',
            name: name + '.',
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
        series: [],
      }
      for (let key in obj) {
        if (key == 'yAxisIndex') {
          for (let k in obj[key]) {
            index = obj[key][k].length
            //对非汇总的数据叠加显示
            if (k != 'Total') {
              option.series.push({
                name: k,
                type: 'bar',
                // barGap: '-100%',
                barGap: 0,
                stack: 'yAxisIndex',
                color: colors[k],
                label: {
                  show: true,
                  distance: 0,
                  rotate: -90,
                  align: 'right',
                  verticalAlign: 'middle',
                  position: 'top',
                  distance: 10,
                  color: '#5470c6',
                  formatter: function (value) {
                    return ''
                  },
                },
                data: obj[key][k],
              })
            } else {
              option.series.push({
                name: k,
                type: 'bar',
                barGap: 0,
                color: colors[k],
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
                data: obj[key][k],
              })
            }
          }
        } else if (key == 'yAxisIndex2') {
          for (let k in obj[key]) {
            //对非汇总的数据叠加显示
            if (k != 'Total') {
              option.series.push({
                name: k,
                type: 'bar',
                yAxisIndex: 1,
                xAxisIndex: 1,
                stack: 'yAxisIndex2',
                barGap: 0,
                color: colors[k],
                label: {
                  show: true,
                  distance: 0,
                  rotate: -90,
                  align: 'right',
                  verticalAlign: 'middle',
                  position: 'top',
                  distance: 10,
                  color: '#91cc75',
                  formatter: function (value) {
                    return ''
                  },
                },
                data: obj[key][k],
              })
            } else {
              option.series.push({
                name: k,
                type: 'bar',
                yAxisIndex: 1,
                xAxisIndex: 1,
                barGap: 0,
                color: colors[k],
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
                data: obj[key][k],
              })
            }
          }
        }
      }
      this.mychart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
  },
}
</script>

<style lang="scss" scoped>
</style>