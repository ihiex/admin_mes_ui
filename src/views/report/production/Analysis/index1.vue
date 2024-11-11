<template>
  <div class="Analysis">

    <!-- <el-container style="height: inherit; width: 100%;">
      <el-header style="height: auto; margin: 0;padding: 0;"> -->
    <h1 style="text-align: center; margin: 0; font-size: 20px;">Auto Data Analysis</h1>
    <div style="text-align: right; padding-right: 10%; padding-bottom: 5px;">Refresh: {{ new
      Date().format('yyyy-MM-dd hh:mm:ss') }}</div>
    <el-table :data="tableData" style="width: 100%" border size="mini" header-align="center"
      :span-method="objectSpanMethod">
      <el-table-column prop="Trigger" label="Trigger" min-width="240" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Machine" label="Machine" min-width="100" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="Carrier" label="Carrier" min-width="100" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="FaTarget" label="FA Target" min-width="100" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{ scope.row.FaTarget | AddPerCent }}
        </template>
      </el-table-column>
      <el-table-column prop="NGTargetHourly" label="NG Target Hourly" min-width="130" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="NGTargetShift" label="NG Target Shift" min-width="130" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="NGTarget" label="NG Target" min-width="100" align="center"
        :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="State" label="State" min-width="100" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.State" active-color="#13ce66" inactive-color="#bbb">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="IsAlarm" label="IsAlarm" min-width="100" align="center">
        <template slot-scope="scope">
          <div style="display: flex;">
            <div v-if="scope.row.IsAlarm" class="is_alarm">
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- </el-header>
      <el-main style="padding: 0;margin: 0; "> -->
    <!--  <el-container style="height: 98%; width: 100%; padding: 0;margin: 0; box-sizing: border-box;">
          <el-main style="border: 1px solid #ccc; padding: 0; box-sizing: border-box; overflow: hidden;">
            <div id="By_Machine" style="height: 40%;"></div>
          </el-main>
          <el-aside width="50%" style="border: 1px solid #ccc; border-left-color: transparent; height: inherit;">
            <div id="By_Carrier"></div>
          </el-aside>
        </el-container> -->
    <div id="By_Carrier" style="height: 22vh;"></div>
    <div id="By_Machine" style="height: 25vh;"></div>
    <!-- </el-main>
    </el-container> -->
  </div>
</template>

<script>
import * as echarts from 'echarts'

/* 表格 静态数据 */
export default {
  name: 'Analysis',
  data() {
    return {
      tableData: [],
      tableDataBefore: [
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
    }
  },
  mounted() {
    this.tableData = this.formatRowSpan(this.tableDataBefore);

    this.handleByMachine()
    this.handleByCarrier()
    this.formatRowSpan()
  },
  methods: {
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
      // debugger
      /*  if ((columnIndex === 0 || columnIndex === 7) && rowIndex < 8) {
         if (rowIndex % 2 === 0) {
           return {
             rowspan: 2,
             colspan: 1
           }
         } else {
           return {
             rowspan: 0,
             colspan: 0
           };
         }
       } */

      if ((columnIndex === 0 || columnIndex === 7) && row.span == 2) {
        if (row.isSpan) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }

    },
    formatRowSpan(arr) {
      if (!Array.isArray(arr)) return;
      let indexObj = {}
      arr.forEach((res, index) => {
        if (indexObj[res.Trigger]) {
          ++indexObj[res.Trigger]
        } else {
          indexObj[res.Trigger] = 1
        }
      })

      let flag = 0;
      arr.forEach(res => {
        if (indexObj[res.Trigger] && flag == 0) {
          flag++
          res['isSpan'] = indexObj[res.Trigger] > 1 ? true : false
          res['span'] = indexObj[res.Trigger]
          if (flag >= indexObj[res.Trigger]) {
            flag = 0
          }
        } else {
          res['isSpan'] = false
          res['span'] = indexObj[res.Trigger]
          flag++
          if (flag >= indexObj[res.Trigger]) {
            flag = 0
          }
        }
      })
      return arr
    }
  },
}
</script>

<style lang="scss" scoped>
.Analysis {
  height: auto;
  background-color: #fff;
  padding: 5px 10px;
  box-sizing: border-box;
  // border: 1px solid red;

  .is_alarm {
    background: url('../../../../assets/svg/warning_height_active.svg') no-repeat;
    background-size: 22px;
    height: 22px;
    width: 22px;
    text-align: center;
    margin: auto;
  }
}
</style>
