<template>
  <div class="UPH_chart">
    <el-carousel class="chart_box" :autoplay="true" :interval="1000 * 5" height="100%" width="100%"
      @change="handleCarouselChange">
      <el-carousel-item v-for="item in carouselItem" :id="'UPHChart' + cid + item.replace(/[^\w]/g, '_')"
        :key="item"></el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'UPHChart',
  props: {
    cid: {
      type: String,
      default: () => {
        return 'AD34CF42E'
      },
    },
  },

  data() {
    return {
      carouselItem: [],
      chartContext: {},
      time: null,
    }
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
    //
    for (let key in this.chartContext) {
      this.chartContext[key] && this.chartContext[key].dispose()
    }
  },
  methods: {
    handleCarouselChange(index) {
      if (index == this.carouselItem.length - 1) {
        this.$emit('prestrainUpdate')
      }
    },
    handleWindowResize() {
      let that = this
      if (this.time) {
        clearTimeout(this.time)
      }
      this.time = setTimeout(() => {
        for (let key in that.chartContext) {
          that.chartContext[key] &&
            that.chartContext[key].resize({
              animation: {
                duration: 3,
              },
            })
        }
      }, 2000)
    },
    show(datas) {
      //注：原数据中的[3]为目标值
      window.addEventListener('resize', this.handleWindowResize)

      let data = this.handleFormatData(datas)
      this.carouselItem = data.series ? Object.keys(data.series) : []
      //
      // if (JSON.stringify(this.chartContext) != '{}') {
      for (let key in this.chartContext) {
        this.chartContext[key] && this.chartContext[key].dispose()
      }
      // }
      this.carouselItem.forEach((item) => {
        this.$nextTick(function () {
          this.handleLineBar(
            document.querySelector(
              `#UPHChart${this.cid}${item.replace(/[^\w]/g, '_')}`
            ),
            data.series[item],
            data.xAxis,
            item
          )
        })
      })
    },
    handleFormatData(lists) {
      if (!Array.isArray(lists) || lists.length == 0) {
        return { xAxis: [], series: {} }
      }
      //第一张表 x轴数据
      let xAxis = lists[0].map((res) => res.CDate)
      //第二张表 对应的组合
      let keys = lists[1][0] ? Object.keys(lists[1][0]) : []
      //第三张表 数据
      let sArr = {}
      lists[2].forEach((res) => {
        let item = ''
        keys.forEach((k, i) => {
          if (i < keys.length - 1) {
            item += res[k] + '_'
          } else {
            item += res[k]
          }
        })
        if (sArr[item]) {
          sArr[item].push({
            Input: res.Input,
            Output: res.Output,
            NG: res.NG,
            cDate: res.CDate,
            target: res.UPHTarget,
          })
        } else {
          sArr[item] = [
            {
              Input: res.Input,
              Output: res.Output,
              NG: res.NG,
              cDate: res.CDate,
              target: res.UPHTarget,
            },
          ]
        }
      })

      //获取对应的数据并与xAxis长度对齐
      let series = {}
      let len = xAxis.length
      for (let key in sArr) {
        series[key] = {}
        series[key][`${key}_Target`] = sArr[key]
          .map((res) => res.target)
          .slice(0, len)
        series[key][`${key}_Input`] = sArr[key]
          .map((res) => res.Input)
          .slice(0, len)
        series[key][`${key}_Output`] = sArr[key]
          .map((res) => res.Output)
          .slice(0, len)
        series[key][`${key}_NG`] = sArr[key].map((res) => res.NG).slice(0, len)
      }

      return { xAxis, series }
    },

    handleLineBar(dom, data, xAxis, key) {
      this.$set(this.chartContext, key, echarts.init(dom, { renderer: 'svg' }))

      let legendData = JSON.stringify(data) != '{}' ? Object.keys(data) : []
      let option = {
        title: {
          text: key,
          left: 50,
          top: 20,
          textStyle: {
            fontSize: 24,
          },
        },
        grid: {
          top: 90,
          left: 60,
          right: 60,
        },
        backgroundColor: '#efefef',
        tooltip: {
          trigger: 'axis',
          show: true,
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (arr) {
            let str = '<div>' + `<div>${arr[0].axisValueLabel}</div>`
            arr.forEach((res) => {
              if (legendData.includes(res.seriesName)) {
                str += `${res.marker}&nbsp;${res.seriesName}&nbsp;&nbsp;${res.value ? res.value : ''
                  }<br/>`
              }
            })
            str += '<div/>'
            return str
          },
        },
        legend: {
          data: legendData,
          textStyle: {
            color: '#222',
          },
          type: 'scroll',
          show: true,
          top: 50,
        },
        xAxis: [
          {
            data: xAxis,
            gridIndex: 0,
            axisLine: {
              lineStyle: {
                color: '#222',
              },
            },
          },
        ],
        yAxis: [
          {
            splitLine: { show: false },
            gridIndex: 0,
            axisLine: {
              lineStyle: {
                color: '#222',
              },
            },
          },
        ],
        series: [],
      }
      legendData.forEach((res) => {
        if (res.includes('Input')) {
          option.series.push({
            name: res,
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            // z: 1000,
            label: {
              show: true,
              // rotate: -90,
              align: 'center',
              offset: [0, -5],
              position: 'top',
              valueAnimation: true,
              color: '#0838c9',
            },
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              color: '#0838c9',
            },
            data: data[res],
          })
        } else if (res.includes('Output')) {
          option.series.push({
            name: res,
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            encode: {
              single: 3,
            },

            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#178d34' },
                { offset: 0.2, color: '#178d34' },
                { offset: 1, color: '#178d34' },
              ]),
            },
            data: data[res],
            z: 9,
          })
        } else if (res.includes('NG')) {
          option.series.push({
            name: res,
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              borderRadius: [5, 5, 0, 0],
              color: '#c72513',
            },
            data: data[res],
            z: 10,
          })
        } else if (res.includes('Target')) {
          option.series = [
            ...option.series,
            ...[
              {
                name: res,
                type: 'line',
                smooth: true,
                showAllSymbol: true,
                symbol: 'emptyCircle',
                symbolSize: 15,
                data: data[res],
              },
              {
                name: res,
                type: 'bar',
                barWidth: 10,
                barGap: '-100%',
                itemStyle: {
                  //渐变色 根据output颜色设置
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(23,141,52,0.5)' },
                    { offset: 0.2, color: 'rgba(23,141,52,0.2)' },
                    { offset: 1, color: 'rgba(23,141,52,0)' },
                  ]),
                },
                z: -12,
                data: data[res],
              },
              {
                name: 'line1',
                type: 'pictorialBar',
                symbol: 'rect',
                itemStyle: {
                  //渐变色 与背景色相似
                  color: '#eee',
                },
                symbolRepeat: true,
                symbolSize: [10, 4],
                symbolMargin: 1,
                z: -10,
                data: data[res],
              },
            ],
          ]
        }
      })

      this.chartContext[key].setOption(option, true)
    },
  },
}
</script>

<style lang="scss" scoped>
.UPH_chart {
  height: inherit;

  .chart_box {
    height: inherit;
    min-height: 200px;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
