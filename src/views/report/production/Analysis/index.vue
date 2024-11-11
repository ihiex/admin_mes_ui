<template>
  <div v-loading="loading" class="Analysis">
    <div style="height: 40px; margin-bottom: 5px;">
      <h1 style="text-align: center; margin: 0; font-size: 20px;" @click="test">Auto Data Analysis</h1>
      <div style="text-align: right; padding-right: 5%;">
        <el-popover v-model="visible" style="position: absolute; left: 15px; top:10px;z-index: 101;" width="180"
          placement="bottom" trigger="click">
          <div>
            <span>Refresh: </span>
            <el-input v-model.number="timeInterval" type="number" style="width: 120px;" @input="setTimeInterval">
            </el-input>
          </div>
          <el-button slot="reference" type="text" icon="el-icon-setting"></el-button>
        </el-popover>
        <span>Refresh: {{ new Date().format('yyyy-MM-dd hh:mm:ss') }} </span>
        <span style="position: relative; right: -30px;">
          <el-switch v-model="switchValue" :active-text="$t('Detail')" :inactive-text="$t('DashBoard')"
            active-color="#13ce66" inactive-color="#ccc">
          </el-switch>
        </span>
      </div>
    </div>
    <div class="gauge">
      <div v-show="!switchValue" class="gauge_content">
        <div v-for="item in gaugeData" :id="item.id" :key="item.id">
          {{ setGaugeChart(item.id, item) }}
        </div>
      </div>
      <div v-show="switchValue" class="table_content" style="margin-top: 5px;">
        <div v-for="item in gaugeData" :key="item.id" style="text-align: center;"
          :class="{ show_green: item.IsRunning }">
          <div style="position: relative;">
            <div :class="{ is_alarm_active: item.IsAlarm, is_alarm: !item.IsAlarm }"
              style="display: inline-block; position: absolute; right: 10px; top: 10px">
            </div>
          </div>
          <h1>{{ item.StationType }}</h1>
          <h3 style="width: 100%; word-wrap: break-word;">{{ item.TriggerCondition }}</h3>
          <p>{{ item.Carrier }}</p>
          <!-- <p>FATarget: {{ item.TriggerFATarget }}</p> -->
          <p>NGTarget: <span>{{ item.NGTarget }} {{ item.TriggerFATarget ? '%' : '' }}</span></p>
          <p>DefectCode: <span
              style="display: inline-block; max-width: 200px; overflow: hidden; position: relative; top: 3px; text-align: left; text-overflow: ellipsis;"
              :title="item.TriggerDefectCode">{{ item.TriggerDefectCode }}</span></p>
          <p>
            Actual: <span>{{ item.Actual ? item.Actual.toFixed(2) : 0 }}{{ item.TriggerFATarget ? '%' : ''
              }}</span>
          </p>
          <!-- 拿子表数据 -->
          <p>
            CarrierSN: <span
              style="display: inline-block; max-width: 200px; overflow: hidden; position: relative; top: 3px; text-align: left; text-overflow: ellipsis;"
              :title="item.CarrierSN" @click="handleCopy(item.CarrierSN, $event)">{{ item.CarrierSN }}</span>
          </p>
          <!--  <p>
            ContinualNGTime: <span>{{ item.ContinualNGTime }}</span>
          </p> -->
          <p>
            FailureRate: <span>{{ item.FailureRate }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { uuid, sleep } from '@/utils'
import { GetAutoAnalysisAlarmDashboard } from '@/api/report.js'
import clip from '@/utils/clipboard'

export default {
  name: 'Analysis',
  data() {
    return {
      gaugeData: [],
      loading: false,
      switchValue: true,
      // timer: {},
      time: null,
      visible: false,
      timeInterval: 30,
      // contextList: new Set()
    }
  },
  activated() {
    this.getData(false)
    this.setInterval()
  },
  deactivated() {
    // this.clearIntervalByTimer()
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  },
  mounted() {
    this.getData(true)
    this.setInterval()
  },
  beforeDestroy() {
    // this.clearIntervalByTimer()
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
    this.dispose()

  },
  methods: {
    test() {
      // console.log(this.contextList)
    },
    handleCopy(text, event) {
      clip(text, event)
    },
    setTimeInterval(val) {
      // console.log(val)
      this.timeInterval = val;
      this.setInterval()
    },

    /* clearIntervalByTimer() {
      Object.keys(this.timer).forEach(key => {
        if (this.timer[key]) {
          clearInterval(this.timer[key])
          this.timer[key] = null
        }
      })
    }, */
    setInterval() {
      if (this.time) {
        clearInterval(this.time)
        this.time = null
      }
      let that = this;
      that.time = setInterval(function () {
        // that.clearIntervalByTimer()
        that.getData(false)
      }, 1000 * (that.timeInterval ? that.timeInterval : 0))
    },
    async setGaugeChart(id, data) {

      await sleep(100)
      let dom = document.querySelector('#' + id)
      if (!dom) return;

      this[id] = echarts.init(dom, { type: 'svg' });

      let max = data.NGTarget ? Math.ceil(data.NGTarget * 2 / 10) * 10 : 100;
      let option = {
        title: [
          {
            text: data.TriggerCondition,
            left: 'center',
            bottom: '0',
            textStyle: {
              fontSize: 16,
              width: 280,
              color: '#111',
              overflow: 'break',
            },
            padding: 10,
          },
          {
            text: data.StationType,
            top: '0',
            textStyle: {
              fontSize: 16,
              width: 280,
              color: '#111',
              overflow: 'truncate',
              ellipsis: '...'
            },
            padding: 10,
          }
        ],
        grid: {
          top: '15%'
        },
        series: [
          {
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '55%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: max,
            splitNumber: 10,
            itemStyle: {
              color: data.Actual > data.NGTarget ? 'red' : '#111'
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
              distance: -20,
              color: '#000',
              fontSize: 14,
              formatter: `{value} ${data.TriggerFATarget ? '%' : ''}`
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
              fontSize: 16,
              fontWeight: 'bolder',
              formatter: function (val) {
                return `${val == 0 ? val : val.toFixed(2)} ${data.TriggerFATarget ? '%' : ''}`
              },
              color: '#000'
            },
            data: [
              {
                value: data.Actual ? data.Actual : 0
              }
            ]
          },
          {
            type: 'gauge',
            center: ['50%', '60%'],
            radius: '55%',
            startAngle: 200,
            endAngle: -20,
            min: 0,
            max: max,//data.TriggerFATarget ? 100 : max,
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
              fontSize: 14
            },
            detail: {
              show: true,
              valueAnimation: true,
              //width: '60%',
              lineHeight: 20,
              borderRadius: 8,
              //offsetCenter: [0, '-25%'],
              fontSize: 12,
              //fontWeight: 'bolder',  //+ data.TriggerFATarget ?? '%'
              formatter: function (val) {
                // console.log(val)
                return `Target: ${val}${data.TriggerFATarget ? '%' : ''}`
              },//'Target:{value}',
              color: '#000'
            },
            data: [{
              value: data.NGTarget ? data.NGTarget : 0
            }]
          }
        ]
      };
      this[id].setOption(option);
     /*  let _this = this;
      window.addEventListener('resize', function () {
        _this[id]?.resize()
      }) */
    },
    dispose() {
      // let that = this
      this.gaugeData.forEach(item => {
        this[item.id]?.dispose()
        this[item.id] = null
      })
    },
    getData(isShowLoading) {
      isShowLoading && (this.loading = true)
      GetAutoAnalysisAlarmDashboard(isShowLoading).then(res => {
        let data = res.ResData
        // this.clearIntervalByTimer()
        this.dispose()
        this.gaugeData = []
        if (res.Success && data && data.length > 0) {
          data[0].forEach(item => {
            item['id'] = uuid()
            item.IsRunning = item.IsRunning == 1 ? true : false
            item.IsAlarm = item.IsAlarm == 1 ? true : false
            item.CarrierSN = this.getCarrierSN(item.StationTypeID, item.TriggerCondition, data[1])
          })
          this.gaugeData = [...data[0]]
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    getCarrierSN(StationTypeID, TriggerCondition, subTable) {
      if (!Array.isArray(subTable)) return '';
      let CarrierSN = ''
      let item = subTable?.find(val => val.StationTypeID === StationTypeID && val.TriggerCondition === TriggerCondition)
      if (item) {
        CarrierSN = item.CarrierSN
      }
      return CarrierSN
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

  .gauge {
    height: calc(100% - 50px);
    overflow-y: auto;

    // border-radius: 10px;
    // box-shadow: 1px 1px 2px #eee, 0 0 25px #efefef, 0 0 5px #185bff;

    .gauge_content {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      &>div {
        padding: 10px;
        border-radius: 10px;
        display: inline-block;
        height: 290px;
        width: 290px;
        border: 1px solid #eee;
        margin: 5px 5px 10px 5px;
      }
    }

    .table_content {
      display: flex;
      // justify-content: space-around;
      justify-content: space-between;
      flex-wrap: wrap;

      &>div {
        padding: 10px;
        border-radius: 10px;
        display: inline-block;
        height: auto;
        width: 290px;
        border: 1px solid #eee;
        margin: 5px 5px 10px 5px;
        box-shadow: 1px 1px 2px #eee, 0 0 10px #ccc; //, 0 0 5px #ccc;

        & span {
          font-weight: 800;
        }

        &>p {
          padding: 0;
          margin: 8px 5px;
        }
      }

      .show_red {
        box-shadow: 1px 1px 2px #eee, 0 0 10px #d80606; //, 0 0 5px #d80606;
      }

      .show_green {
        box-shadow: 1px 1px 2px #eee, 0 0 10px var(--themeColor, $base-color-default); //, 0 0 5px #13ce66;
      }
    }
  }

  .is_alarm_active {
    background: url('../../../../assets/svg/warning_height_active.svg') no-repeat;
    background-size: 30px;
    height: 30px;
    width: 30px;
    text-align: center;
    margin: auto;
  }

  .is_alarm {
    background: url('../../../../assets/svg/warning_height.svg') no-repeat;
    background-size: 30px;
    height: 30px;
    width: 30px;
    text-align: center;
    margin: auto;
  }

}
</style>
