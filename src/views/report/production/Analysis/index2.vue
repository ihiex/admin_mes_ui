<template>
  <div v-loading="loading" class="Analysis">
    <div style="height: 40px; margin-bottom: 5px;">
      <h1 style="text-align: center; margin: 0; font-size: 20px;">Auto Data Analysis</h1>
      <div style="text-align: right; padding-right: 5%;">
        <span>Refresh: {{ new Date().format('yyyy-MM-dd hh:mm:ss') }} </span>
        <span style="position: relative; right: -30px;">
          <el-switch v-model="switchValue" active-text="表格" inactive-text="仪表" active-color="#13ce66"
            inactive-color="#ccc">
          </el-switch>
        </span>
      </div>
    </div>
    <div class="split_style gauge">
      <div v-if="!switchValue" id="GaugeContent" class="gauge_content">
        <div v-for="item in tableData" :id="item.id" :key="item.id">
          {{ setGaugeChart(item.id, item) }}
        </div>
      </div>
      <el-table v-else :data="tableData" style="width: 100%" border size="mini" header-align="center" height="100%"
        :span-method="objectSpanMethod">
        <el-table-column prop="TriggerDescription" label="Condition" min-width="300" align="left"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="StationType" label="StationType" min-width="100" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="Carrier" label="Carrier" min-width="100" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="TriggerFATarget" label="FATarget" min-width="80" align="center"
          :show-overflow-tooltip="true">
          <template slot-scope="scope">
            {{ scope.row.TriggerFATarget | AddPerCent }}
          </template>
        </el-table-column>
        <el-table-column prop="NGTarget" label="NGTarget" min-width="105" align="center"
          :show-overflow-tooltip="true"></el-table-column>
          <el-table-column prop="TriggerDefectCode" label="DefectCode" min-width="105" align="center"
          :show-overflow-tooltip="true"></el-table-column>
       <!--  <el-table-column prop="TriggerNGQtyHourly" label="NGQtyHourly" min-width="105" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="TriggerNGQTYShift" label="NGQTYShift" min-width="100" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="TriggerContinualQTY" label="ContinualQTY" min-width="110" align="center"
          :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="TriggerCumulationQTY" label="CumulationQTY" min-width="130" align="center"
          :show-overflow-tooltip="true"></el-table-column> -->
        <el-table-column prop="IsRunning" label="State" min-width="70" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.IsRunning" active-color="#13ce66" inactive-color="#bbb">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="IsAlarm" label="IsAlarm" min-width="80" align="center">
          <template slot-scope="scope">
            <div style="display: flex;">
              <div :class="{ is_alarm_active: scope.row.IsAlarm, is_alarm: !scope.row.IsAlarm }">
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div id="By_Carrier" class="split_style"></div>
    <div id="By_Machine" class="split_style"></div>

  </div>
</template>

<script>
import * as echarts from 'echarts'
import { uuid, sleep } from '@/utils'
import { GetAutoAnalysisAlarmDashboard } from '@/api/report.js'
/* 表格，仪表可切换 */
export default {
  name: 'Analysis',
  data() {
    // let ids = [];
    let list = [
      {
        Trigger: 'FailureRate>Target by machine',
        Machine: 'M49A',
        Carrier: '',
        FaTarget: 5,
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'FailureRate>Target by machine',
        Machine: 'M48',
        Carrier: '',
        FaTarget: 8,
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'NGQty>Target by machine per hour',
        Machine: 'M49A',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: 3,
        NGTargetShift: '',
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'NGQty>Target by machine per hour',
        Machine: 'M48',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: 5,
        NGTargetShift: '',
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'NGQty>Target by machine per shift',
        Machine: 'M49A',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: 57,
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'NGQty>Target by machine per shift',
        Machine: 'M48',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: 70,
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'Continual NGQty>Target by machine',
        Machine: 'M49A',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: 3,
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'Continual NGQty>Target by machine',
        Machine: 'M48',
        Carrier: '',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: 5,
        State: true,
        IsAlarm: false,
      },
      {
        Trigger: 'FailureRate>Target by Carrier',
        Machine: '',
        Carrier: 'FalseTest',
        FaTarget: 5,
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: '',
        State: true,
        IsAlarm: true,
      },
      {
        Trigger: 'Continual NGQty>Target by Carrier',
        Machine: '',
        Carrier: 'FalseTest',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: 3,
        State: false,
        IsAlarm: false,
      },
      {
        Trigger: 'NGQty>Target by Carrier per hour',
        Machine: '',
        Carrier: 'FalseTest',
        FaTarget: '',
        NGTargetHourly: '',
        NGTargetShift: '',
        NGTarget: 3,
        State: true,
        IsAlarm: true,
      },
    ]
    list.forEach(res => {
      res['id'] = uuid()
    })

    return {
      tableData: [],
      gaugeData: list,
      transformScrollSwitch: false,
      timer: null,
      switchValue: false,
      loading: false
    }
  },
  watch: {
    switchValue: function (val, oval) {
      if (!val) {
        this.timer = this.handleScroll('GaugeContent', 'transformScrollSwitch')
      } else {
        if (this.timer) {
          clearInterval(this.timer)
          this.timer = null
        }
      }
    }
  },
  mounted() {
    // this.tableData = this.formatRowSpan(this.gaugeData);
    this.getData()

    this.handleByMachine()
    this.handleByCarrier()

    this.$nextTick(function () {
      if (!this.switchValue) {
        this.timer = this.handleScroll('GaugeContent', 'transformScrollSwitch')
      }
    })

  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },
  methods: {

    handleScroll(id, key) {
      let that = this;
      let sLen = 0
      let pScroll = document.querySelector('#' + id)
      // if (!pScroll.scrollLeft) return null;
      if (that[id + key]) {
        clearInterval(that[id + key])
      }
      that[id + key] = setInterval(async function () {
        !pScroll && (pScroll = document.querySelector('#' + id))
        sLen = pScroll.scrollLeft
        if (that[key]) {
          pScroll.scrollLeft += 1
          if (pScroll.scrollLeft <= sLen) {
            await sleep(1000 * 3)
            that[key] = false
          }
        } else {

          pScroll.scrollLeft -= 1
          if (pScroll.scrollLeft <= 0) {
            await sleep(1000 * 3)
            that[key] = true
          }
        }
      }, 50)

      return that[id + key]
    },

    async setGaugeChart(id, data) {
      await sleep(100)
      let myChart = echarts.init(document.querySelector('#' + id), { type: 'svg' });

      var e = 10;
      let option = {
        title: {
          text: data.TriggerCondition,
          left: 'center',
          bottom: '2%',
          textStyle: {
            fontSize: 10,
            width: 290,
            color: '#111',
            overflow: 'truncate',
            ellipsis: '...'
          }
        },
        grid: {
          top: '15%'
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '70%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 10,
            itemStyle: {
              color: '#111'
            },
            progress: {
              show: true,
              width: 20
            },
            pointer: {
              show: true
            },
            axisLine: {
              lineStyle: {
                width: 20
              }
            },
            axisTick: {
              distance: -45,
              splitNumber: 5,
              lineStyle: {
                width: 1,
                color: '#000'
              }
            },
            splitLine: {
              distance: -52,
              length: 14,
              lineStyle: {
                width: 2,
                color: '#000'
              }
            },
            axisLabel: {
              distance: -15,
              color: '#000',
              fontSize: 14
            },
            anchor: {
              show: false
            },
            title: {
              show: false
            },
            detail: {
              valueAnimation: true,
              width: '60%',
              lineHeight: 40,
              borderRadius: 8,
              offsetCenter: [0, '-25%'],
              fontSize: 14,
              fontWeight: 'bolder',
              formatter: '{value}',
              color: '#000'
            },
            data: [
              {
                value: 6
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '65%'],
            radius: '70%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: 100,
            splitNumber: 10,
            z: 10,
            itemStyle: {
              color: '#0f49f7'
            },
            progress: {
              show: true,
              width: 10
            },
            pointer: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisLabel: {
              show: false,
              // distance: -12,
              color: '#000',
              fontSize: 8
            },
            detail: {
              show: true,
              valueAnimation: true,
              //width: '60%',
              lineHeight: 20,
              borderRadius: 8,
              //offsetCenter: [0, '-25%'],
              fontSize: 12,
              //fontWeight: 'bolder',
              formatter: 'Target:{value}',
              color: '#000'
            },
            data: [{
              value: data.NGTarget ? data.NGTarget : 0
            }]
          }
        ]
      };

      // setInterval(function () {
      //   const random = +(Math.random() * 60).toFixed(2);
      //   myChart.setOption({
      //     series: [
      //       {
      //         data: [
      //           {
      //             value: random * 1.5
      //           }
      //         ]
      //       },
      //       {
      //         data: [
      //           {
      //             value: random*0.5
      //           }
      //         ]
      //       }
      //     ]
      //   });
      // }, 1000);

      myChart.setOption(option);

      window.addEventListener('resize', function () {
        myChart.resize()
      })
    },
    handleByMachine() {
      var dom = document.getElementById('By_Machine');
      var myChart = echarts.init(dom, {
        renderer: 'svg',
      });

      var option = {
        title: {
          text: 'Failure Rate by machine by hour'
        },
        grid: {
          top: '25%',
          left: 30,
          right: 60,
          bottom: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['T31_Line1_M49A-1-左穴', 'T32_Line1_M49A-1-左穴', 'M49A FA'],
          right: 0
        },
        xAxis: [
          {
            type: 'category',
            data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
            /*  axisPointer: {
               type: 'shadow'
             }, */
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'NG QTY',
            min: 0,
            max: 7,
            // interval: 1,
            axisLabel: {
              formatter: '{value}'
            },
            splitLine: {
              show: true
            }
          },
          {
            type: 'value',
            name: 'FA',
            min: 0,
            max: 10
            ,
            // interval: 1,
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'T31_Line1_M49A-1-左穴',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },
            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 90,
              verticalAlign: 'center'
            },
            data: [
              2.0, 4, 5.0, 3, 5, {
                value: 7,
                itemStyle: {
                  color: '#a90000'
                }
              }, 5, 2, 2, 1.0, 6, 3
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' },

              ],
            }
          },
          {
            name: 'T32_Line1_M49A-1-左穴',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },

            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 90,
              verticalAlign: 'center'
            },
            data: [
              2, 5, 4, 2, {
                value: 6,
                itemStyle: {
                  color: '#a90000'
                }
              }, 1, 5, 2, 5, 6, 5.0, 2
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            }
          },

          {
            name: 'T33_Line1_M49A-1-左穴',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },
            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 90,
              verticalAlign: 'center'
            },
            data: [
              3.0, 3, 4.0, 3, 5, 2, 3, 1, 2, 0, 4, 1
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            }
          },

          {
            name: 'M49A FA',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: [2.5, 6.2, 5.3, 4.5, 7.3, 8.2, 6.3, 3.4, 6.0, 7.5, 8.0, 6.2],
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
                  yAxis: 8,
                },
              ],
            },
          }
        ]
      };

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }

      window.addEventListener('resize', myChart.resize);
    },
    handleByCarrier() {
      var dom = document.getElementById('By_Carrier');
      var myChart = echarts.init(dom, {
        renderer: 'svg',
      });

      var option = {
        title: {
          text: 'Failure Rate by Carrier by hour'
        },
        grid: {
          top: '25%',
          left: 30,
          right: 60,
          bottom: 20
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          show: false,
          feature: {
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        legend: {
          data: ['T32L1M1C2012', 'T32L1M1C1008', 'T32L1M1C2013', 'FA'],
          right: 0
        },
        xAxis: [
          {
            type: 'category',
            data: ['8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: 'NG QTY',
            min: 0,
            max: 7,
            // interval: 1,
            axisLabel: {
              formatter: '{value}'
            }
          },
          {
            type: 'value',
            name: 'FA',
            min: 0,
            max: 10
            ,
            // interval: 1,
            axisLabel: {
              formatter: '{value} %'
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: 'T32L1M1C2012',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },
            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 60,
              verticalAlign: 'center'
            },
            data: [
              2.0, 1, 2, 0, 3, 4, 4, 0, 0, 1.0, 4, 3
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            }
          },
          {
            name: 'T32L1M1C1008',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },
            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 60,
              verticalAlign: 'center'
            },
            data: [
              2, 1, 4, 2, 3, 1, 0, 0, 4, 4, 0, 2
            ],
            markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            }
          },

          {
            name: 'T32L1M1C2013',
            type: 'bar',
            tooltip: {
              valueFormatter: function (value) {
                return value + ' ';
              }
            },
            label: {
              rotate: 90,
              position: 'insideBottom',
              show: true,
              formatter: '"{c}"  {a}',
              fontSize: 9,
              distance: 60,
              verticalAlign: 'center'
            },
            data: [
              2.0, 1, 3.0, 1, 5, 2, 3, 0, 2, 0, 2, 1
            ], markPoint: {
              data: [
                { type: 'max', name: 'Max' }
              ]
            }
          },

          {
            name: 'FA',
            type: 'line',
            yAxisIndex: 1,
            tooltip: {
              valueFormatter: function (value) {
                return value + ' %';
              }
            },
            data: [2.5, 6.2, 5.3, 4.5, 5.3, 6.2, 5.3, 3.4, 6.0, 6.5, 8.0, 6.2],
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
                  yAxis: 5,
                },
              ],
            },
          }
        ]
      };

      if (option && typeof option === 'object') {
        myChart.setOption(option);
      }

      window.addEventListener('resize', myChart.resize);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if ((columnIndex === 0 || columnIndex === 6) && row.span == 2) {
        if (row.isSpan) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    formatRowSpan(arr) {
      if (!Array.isArray(arr)) return;
      let indexObj = {}
      arr.forEach((res, index) => {
        if (indexObj[res.TriggerCondition]) {
          ++indexObj[res.TriggerCondition]
        } else {
          indexObj[res.TriggerCondition] = 1
        }
      })

      let flag = 0;
      arr.forEach(res => {
        if (indexObj[res.TriggerCondition] && flag == 0) {
          flag++
          res['isSpan'] = indexObj[res.TriggerCondition] > 1 ? true : false
          res['span'] = indexObj[res.TriggerCondition]
          if (flag >= indexObj[res.TriggerCondition]) {
            flag = 0
          }
        } else {
          res['isSpan'] = false
          res['span'] = indexObj[res.TriggerCondition]
          flag++
          if (flag >= indexObj[res.TriggerCondition]) {
            flag = 0
          }
        }
      })
      return arr
    },
    getData() {
      this.loading = true
      GetAutoAnalysisAlarmDashboard().then(res => {
        let data = res.ResData
        if (res.Success && data && data.length > 0) {
          data[0].forEach(item => {
            item['id'] = uuid()
            item.IsRunning = item.IsRunning == 1 ? true : false
            item.IsAlarm = item.IsAlarm == 1 ? true : false
          })
          this.tableData = this.formatRowSpan(data[0]);
          // debugger
          console.log(this.tableData)
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })

    }
  },
}
</script>

<style lang="scss" scoped>
.Analysis {
  height: 82vh;
  background-color: #fff;
  padding: 5px 10px;
  box-sizing: border-box;

  .split_style {
    height: calc((100vh - 150px - 40px - 55vh));
  }

  .gauge {
    // height: 100%;
    // border: 1px solid #ccc;
    margin: 0 0 5px 0;
    box-sizing: border-box;
    overflow: hidden;
    // border-radius: 10px;
    // box-shadow: 1px 1px 2px #eee, 0 0 25px #efefef, 0 0 5px #185bff;
// color: #0f49f7;
    .gauge_content {
      overflow: hidden;
      height: inherit;
      white-space: nowrap;
      box-sizing: border-box;

      // display: flex;
      &>div {
        // margin: auto;
        border-radius: 10px;
        display: inline-block;
        height: 92%;
        width: 300px;
        border: 1px solid #eee;
        margin: 10px 5px;
      }

      // height: 300px;
    }
  }

  .is_alarm_active {
    background: url('../../../../assets/svg/warning_height_active.svg') no-repeat;
    background-size: 22px;
    height: 22px;
    width: 22px;
    text-align: center;
    margin: auto;
  }

  .is_alarm {
    background: url('../../../../assets/svg/warning_height.svg') no-repeat;
    background-size: 22px;
    height: 22px;
    width: 22px;
    text-align: center;
    margin: auto;
  }

}
</style>
