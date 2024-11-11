<template>
  <div class="output_bar">
    <el-carousel class="chart_box" :autoplay="autoplay" :interval="interval" indicator-position="none" height="100%"
      width="100%" @change="handleCarouselChange">
      <el-carousel-item v-for="(item, index) in carouselItem" :key="index">
        <div
          style="height: 40px; line-height: 40px; color: black; font-size: 24px; font-weight: 800; position: relative;">
          {{ item[0].DataLevel }} {{ shiftText }}
          <span style="position: absolute; right: 10px;">{{ dateTime }}</span>
        </div>
        <div class="show_content">
          <div class="table_content">
            <el-table :data="item" border style="width: 100%;" height="100%" size="mini">
              <el-table-column v-for="(h, i) in tableHead" :key="i" :prop="h" :label="h.split(/\s/g).pop()"
                :min-width="'100'">
                <template slot-scope="scope">
                  <span v-if="!isNaN(scope.row[h])" style="cursor: pointer;" @click="handleGoToRawData(scope.row, h)">
                    {{ scope.row[h] }}
                  </span>
                  <span v-else>
                    {{ scope.row[h] }}
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="chart_content">
            <div :id="ids[index]" style="height: 100%;">
              {{ handleShowChart(carouselItem[index], ids[index]) }}
            </div>
          </div>
        </div>
        <!-- <el-table :data="item" border style="width: 100%;" height="400">
          <el-table-column v-for="(h, i) in tableHead" :key="i" :prop="h" :label="h.split(/\s/g).pop()"
            :min-width="h === 'StationType' ? '200' : '60'">
          </el-table-column>
        </el-table>
        <div :id="ids[index]" class="chart_content">
          {{ handleShowChart(carouselItem[index], ids[index]) }}
        </div> -->
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { uuid, downloadFile, getTimeChangeTimeRange, getTimeChangeTimeRangeNew } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

export default {
  name: 'OutputBarTH',
  data() {
    return {
      chartContext: {},
      carouselItem: [],
      dateTime: '',
      tableHead: [],
      ids: [],
      shiftText: 'AllShift',
      time: null,
      interval: 1000 * 10,
      autoplay: true,
      dataList: {},
      filters: [],
      params: {},
      cacheParams: {},
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
    handleGoToRawData(item, time) {
      switch (item.type) {
        case 'Output':
          this.$set(this.params, 'S_UnitStatusID', [1])
          break;
        case 'NG':
          this.$set(this.params, 'S_UnitStatusID', [2])
          break;
        case 'SCRAP':
          this.$set(this.params, 'S_UnitStatusID', [3])
          break;
        default:
          this.$set(this.params, 'S_UnitStatusID', [])
      }
      this.$set(this.params, 'S_PartFamilyTypeID', item.PartFamilyTypeID ? [item.PartFamilyTypeID] : '')
      this.$set(this.params, 'S_ProductionOrderID', item.ProductionOrderID ? [item.ProductionOrderID] : '')
      this.$set(this.params, 'S_StationTypeID', item.StationTypeID ? [item.StationTypeID] : '')
      this.$set(this.params, 'S_PartID', item.PartID ? [item.PartID] : '')
      this.$set(this.params, 'S_LineID', item.LineID ? [item.LineID] : '')
      this.$set(this.params, 'S_Type', 'RawData')
      this.$set(this.params, 'Shift', this.params.S_Shift)
      this.$set(this.params, 'S_PageIndex', 1)
      this.$set(this.params, 'S_PageQTY', 100)
      if (time != 'total') {
        // let res = getTimeChangeTimeRange(time, [this.cacheParams.S_StartDateTime, this.cacheParams.S_EndDateTime], this.cacheParams.S_DataType)
        let res = getTimeChangeTimeRangeNew(time, this.cacheParams, this.$store.getters['user/shiftTable'])
        this.$set(this.params, 'S_StartDateTime', res[0])
        this.$set(this.params, 'S_EndDateTime', res[1])
      } else {
        this.$set(this.params, 'S_StartDateTime', this.cacheParams.S_StartDateTime)
        this.$set(this.params, 'S_EndDateTime', this.cacheParams.S_EndDateTime)
      }
      this.$router.push({
        path: '/report/quality/rawData',
        name: 'RawData',
        params: this.params,
      })
    },
    handleExport() {
      /*  let data = {}
       Object.values(this.dataList).forEach((res) => {
         data[res[0].DataLevel.replaceAll(/\//g, '-')] = res
       }) */

      /*  console.log(data)
       console.log(this.tableHead)

       downloadFile(
         getDownLoadData(data, 'xlsx', this.tableHead),
         `THOutput_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
       ) */

      let data = {}
      let headData = {}
      Object.values(this.dataList).forEach((res) => {
        data[res[0].DataLevel.replaceAll(/\//g, '-')] = res
        headData[res[0].DataLevel.replaceAll(/\//g, '-')] = this.tableHead
      })

      downloadFile(
        getDownLoadData(data, 'xlsx', headData),
        `Output_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )

      return false;
    },
    setAutoPlay(bool) {
      this.autoplay = bool;
    },
    show(data, levelValue = 3, shift = [], dateTime = new Date().format('yyyy-MM-dd hh:mm:ss'), params) {
      if (params) {
        this.params = JSON.parse(JSON.stringify(params))
        this.cacheParams = params
      }
      this.dateTime = dateTime
      this.shiftText = this.getShift(shift);
      let list = this.FormatData(data, levelValue)
      Object.keys(this.chartContext).forEach(key => {
        this.chartContext[key] && this.chartContext[key].dispose()
      })

      let that = this
      this.ids = [];
      this.tableHead = [];
      this.carouselItem = [];
      this.tableHead = list.tableHead;
      this.dataList = list.classifyItem;
      Object.values(list.classifyItem).forEach(() => {
        this.ids.push(uuid())
      })
      this.$nextTick(function () {
        Object.values(list.classifyItem).forEach((item) => {
          this.carouselItem.push(item)
        })
        //
        if (that.carouselItem.length === 0 || that.carouselItem.length === 1) {
          return setTimeout(function () {
            that.$emit('LastCarousel')
          }, that.interval)
        }
      })
      window.addEventListener('resize', this.handleWindowResize)

    },
    getShift(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },
    handleCarouselChange(val) {
      if (val == this.carouselItem.length - 1) {
        let that = this;
        setTimeout(function () {
          that.$emit('LastCarousel')
        }, that.interval - 2000)
      }
    },
    handleShowChart(item, id) {
      this.$nextTick(function () {
        this.BarChart(item, id)
      })
    },
    FormatData(data = [], levelValue = 3) {
      if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
      let tableHead = ['StationType'];
      data[0].forEach(res => {
        tableHead.push(res.CDate/* .split(/\s/)[1] */)
      })
      tableHead.push('total');
      /* 按时间段+ 层级分类*/
      let listObj = {};
      let listKey = Object.keys(data[1][0]);
      data[2].forEach(res => {
        let key = res.CDate.replaceAll(/\s/g, "");
        listKey.forEach(k => {
          key += '_' + res[k]
        })
        if (listObj[key]) {
          listObj[key].Input += res.Input ? res.Input : 0;
          listObj[key].Output += res.Output ? res.Output : 0;
          listObj[key].NG += res.NG ? res.NG : 0;
        } else {
          listObj[key] = {};
          listObj[key]['CDate'] = res.CDate;
          listObj[key]['StationType'] = res.StationType;
          listObj[key]['Line'] = res.Line;
          listObj[key]['Project'] = res.Project;
          listObj[key]['PartNumber'] = res.PartNumber;
          listObj[key]['Input'] = res.Input ? res.Input : 0;
          listObj[key]['Output'] = res.Output ? res.Output : 0;
          listObj[key]['NG'] = res.NG ? res.NG : 0;
          // listObj[key]['SCRAP'] = res.SCRAP ? res.SCRAP : 0;
          // listObj[key]['Other'] = res.Other ? res.Other : 0;
          // listObj[key]['Yield'] = res.Yield ? res.Yield : 0;
          // listObj[key]['UPHTarget'] = res.UPHTarget ? res.UPHTarget : 0;
          // listObj[key]['IsRPTYield'] = res.IsRPTYield;
          listObj[key]['LineID'] = res.LineID ? res.LineID : null;
          listObj[key]['PartID'] = res.PartID ? res.PartID : null;
          listObj[key]['StationTypeID'] = res.StationTypeID ? res.StationTypeID : null;
          listObj[key]['PartFamilyTypeID'] = res.PartFamilyTypeID ? res.PartFamilyTypeID : null;
          listObj[key]['ProductionOrderID'] = res.ProductionOrderID ? res.ProductionOrderID : null;
        }
      })

      let tItem = {}
      //横向转换成表格数据
      Object.values(listObj).forEach(res => {
        let key = "";
        listKey.forEach((k, i) => {
          key += (i === 0 ? '' : '/') + res[k]
        })
        if (tItem[key]) {
          tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
          tItem[key]['total'] += res.Output
        } else {
          tItem[key] = {};
          tItem[key]['StationType'] = res.StationType;
          tItem[key]['DataLevel'] = key;
          tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
          tItem[key]['total'] = res.Output
          // tItem[key]['IsRPTYield'] = res.IsRPTYield;
          tItem[key]['LineID'] = res.LineID;
          tItem[key]['PartID'] = res.PartID;
          tItem[key]['StationTypeID'] = res.StationTypeID;
          tItem[key]['PartFamilyTypeID'] = res.PartFamilyTypeID;
          tItem[key]['ProductionOrderID'] = res.ProductionOrderID;
        }
      })

      /* 数据分屏 按层级*/
      let classifyItem = {};
      switch (levelValue) {
        case 2:
          //byStationType
          Object.values(tItem).forEach(res => {
            res.DataLevel = 'byStationType'
          })
          classifyItem['byStationType'] = Object.values(tItem);
          break;
        case 3:
          //byProject/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              tItem[key].DataLevel = tItem[key].DataLevel.split('/').shift()
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 4:
          //byProject/Line/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              let a = tItem[key].DataLevel.split('/');
              a.splice(1, 1)
              tItem[key].DataLevel = a.join('/')
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 5:
          //byProject/PN/Line/StationType
          let classifyParentItem = {}
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyParentItem[k]) {
              classifyParentItem[k].push(tItem[key])
            } else {
              classifyParentItem[k] = [tItem[key]]
            }
          })
          // console.log(classifyParentItem)
          Object.values(classifyParentItem).forEach(res => {
            res.forEach(item => {
              let kList = item.DataLevel.split('/');
              let key = kList[0] + '/' + kList[2] + '/' + kList[3];
              if (classifyItem[key]) {
                classifyItem[key].push(item)
              } else {
                let a = item.DataLevel.split('/');
                a.splice(1, 1)
                item.DataLevel = a.join('/')
                classifyItem[key] = [item]
              }
            })
          })
          break;
        default:

      }

      // console.log(classifyItem)

      return { classifyItem, tableHead }
    },
    BarChart(item, id) {
      // debugger
      let data = { xAxis: item.map(res => res.StationType), list: item.map(res => res.total) }
      this.chartContext[id] = echarts.init(
        document.querySelector(`#${id}`),
        { renderer: 'svg' }
      )
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          right: '40',
          left: '40',
          top: '25',
          bottom: '10',
          containLabel: true
        },
        /*    dataZoom: [
             {
               type: 'inside'
             },
             {
               type: 'slider'
             }
           ], */
        xAxis: [
          {
            type: 'category',
            data: data.xAxis,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: 'Direct',
            type: 'bar',
            barWidth: '60%',
            label: {
              show: true,
              position: 'top'
            },
            data: data.list
          }
        ]
      };

      this.chartContext[id].setOption(option);
      let that = this;
      /*  window.addEventListener('resize', function () {
         that.chartContext[id].resize();
       }); */
    },
    handleWindowResize() {
      let that = this
      if (that.time) {
        clearTimeout(that.time)
      }
      that.time = setTimeout(() => {
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
  },
}
</script>

<style lang="scss" scoped>
.output_bar {
  height: inherit;
  min-height: 440px;

  .chart_box {
    height: inherit;
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    .show_content {
      height: calc(100% - 40px);
      box-sizing: border-box;

      .table_content {
        height: 75%;
      }

      .chart_content {
        height: 25%;
      }
    }
  }
}

::v-deep {
  .el-carousel__button {
    background-color: red;
  }

  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #222;
  }

  .el-table--border .el-table__cell {
    border-right: 1px solid #222;
  }
}
</style>
