<template>
  <div :id="`DefectByColor${cid}`" class="common_chart"></div>
</template>

<script>
import * as echarts from 'echarts'

/* 不良堆叠柱状图-按颜色 */
export default {
  name: 'DefectByColor',
  props: {
    cid: {
      type: String,
      require: true,
      default: () => {
        return 'a8b9c0d8'
      },
    },
  },
  data() {
    return {
      DefectBarChart: null,
      timer: null,
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    this.DefectBarChart && this.DefectBarChart.dispose()
  },
  methods: {
    /**
     * lists 数据源
     * title
     */
    show(lists, title, lines) {
      let chartData = this.handleDefectByColorFormatData(lists)
      let lineObj = this.handleLinesFormatData(lines)
      this.handleDefectByColor(
        chartData ? chartData : { xAxis: [] },
        title,
        lineObj
      )
    },
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
        sList.push((sums[key] + '').includes('.') ? sums[key].toFixed(4) : sums[key])
      }
      objs.series = series

      objs['sums'] = sList
      return objs
    },
    handleWindowResize() {
      let that = this
      that.timer && clearTimeout(that.timer)
      that.timer = setTimeout(() => {
        that.DefectBarChart && that.DefectBarChart.resize()
      }, 300)
    },
    handleDefectByColor(datas, title, line) {
      // console.log(datas)
      // console.log(line)
      // debugger
      this.DefectBarChart && this.DefectBarChart.clear()
      window.removeEventListener('resize', this.handleWindowResize)
      this.DefectBarChart = echarts.init(
        document.querySelector(`#DefectByColor${this.cid}`),
        { renderer: 'svg' }
      )
      let option = {
        title: {
          text: title,
          textStyle: {
            color: '#222',
            fontSize: 14,
          },
          left: 'auto'
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
          top: 30,
          type: 'scroll',
          show: true,
          padding: [0, 80],
          textStyle: {
            color: '#6e7079'
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
          pageTextStyle:{
            color: '#6e7079'
          },
          pageIconColor: '#6e7079'
        },
        grid: {
          left: 40,
          right: 40,
          bottom: 50,
          top: 80,
          containLabel: true,
        },
        boundaryGap: true,
        position: 'bottom',
        xAxis: {
          type: 'category',
          data: datas.xAxis,
          axisLabel: {
            interval: '0',
            overflow: 'break',
            width: 50,
            margin: 18,
            color:'#6e7079'
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
            },
            nameLocation: 'middle',
            nameGap: 50,
            nameTextStyle: {
              verticalAlign: 'middle',
              align: 'left',
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
            position: 'top',
            color: '#fff'
          },
          emphasis: {
            focus: 'series',
          },
          itemStyle: {
            color: datas.series[key].ColorValue
              ? `rgb(${datas.series[key].ColorValue})`
              : '',
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
      this.DefectBarChart.setOption(option, true)
      window.addEventListener('resize', this.handleWindowResize)
    },
  },
}
</script>
