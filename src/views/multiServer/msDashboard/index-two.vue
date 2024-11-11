<template>
  <div class="main_multiserver">
    <div v-loading="oneEvent">
      <div class="multiserver_title" @click="test">
        ProjectName: {{ title }}
      </div>
      <el-carousel id="MultiserverDashborad" ref="MultiServerCar" indicator-position="none" :autoplay="autoplay"
        :interval="interval" height="calc(100vh - 100px)" @change="handleCarouselChange">
        <el-carousel-item style="overflow: auto;">
          <OutputDashboard ref="OutputDashboard" style="height: 100%;"
            @OutputTitle="getOutputTitle"></OutputDashboard>
            <!-- @completeOutputOnce="handleLastCarousel" -->
        </el-carousel-item>
        <el-carousel-item>
          <!-- Weekly Trend chart per latest 7 weeks 折线-->
          <div>
            <YieldChartLine ref="DetailYield7WeekM" style="height: 100%" cid="DetailYield7WeekM" />
          </div>
          <!-- Pareto(CUM) -->
          <div>
            <ParetoChartBar ref="ParetoChartBarM" style="height: 100%" cid="ParetoChartBarM" />
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <!-- Daily trend chart per latest 7 days 折线-->
          <div>
            <YieldChartLine ref="DetailYield7DaysTV" style="height: 100%" cid="DetailYield7DaysTV" />
          </div>
          <!-- Defect Distribution 表格-->
          <div>
            <DefectTable ref="DefectTableTV" style="height: 100%" title="Defect Distribution" />
          </div>
        </el-carousel-item>
        <el-carousel-item>
          <div>
            <DefectRateChartLine :ref="`DefectRateChartLineM`" style="height: 100%" :cid="`DefectRateChartLineM`" />
          </div>
          <div>
            <DefectByColor :ref="`DefectByColorM`" style="height: 100%" :cid="`DefectByColorM`" />
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/user.js'
import { GetUPHYield } from '@/api/report.js'
import { GetDefectYield } from '@/api/report.js'
import YieldChartLine from '@/components/chart/YieldChartLine'
import DefectByColor from '@/components/chart/DefectByColor'
import DefectRateChartLine from '@/components/chart/DefectRateChartLine'
import ParetoChartBar from '@/components/chart/ParetoChartBar'
import DefectTable from '@/components/table/DefectTable'
import OutputDashboard from './output.vue'
import {
  multiServer,
  multiServerForm,
  appId,
  tokenGrantType,
  appSecret,
} from '@/config'
import { resetRouter } from '@/router/index.js'
import { encryptedData } from '@/utils/encrypt.js'

/* 多服务器看板 */
export default {
  name: 'MultiServerDashboardPage',
  components: {
    YieldChartLine,
    DefectByColor,
    DefectRateChartLine,
    ParetoChartBar,
    DefectTable,
    OutputDashboard
  },
  data() {
    let nDate = new Date()
    let sDate = new Date(nDate.setDate(nDate.getDate() - 48)).format(
      'yyyy-MM-dd 00:00:00'
    )
    let eDate = new Date().format('yyyy-MM-dd hh:mm:ss')
    return {
      autoplay: false,
      title: '',
      devServer: Object.keys(multiServer),
      objData: {},
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: eDate,
        S_DataType: '2',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: null, //班次
        S_DataLevel: 2, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      index: 0,
      form: multiServerForm,
      temporaryToken: '',
      Token: '',
      serverIndex: 0,
      oneEvent: true,
      top: sessionStorage.getItem('S_TopQTY')
        ? sessionStorage.getItem('S_TopQTY')
        : 20,
      interval: 1000 * 20,
      tokenData: {
        grant_type: tokenGrantType,
        appid: appId,
        secret: appSecret,
      },
      initialIndex: 0
    }
  },
  mounted() {
    // this.handleServerSwitch()
  },
  async beforeDestroy() {
    resetRouter()
    this.$store.dispatch('user/resetAccessToken')
  },
  methods: {
    getOutputTitle(val) {
      // console.log(val)
      this.title = val
    },
    handleLastCarousel() {
      this.$refs.OutputDashboard.setAutoPlay(false);
      this.$refs.MultiServerCar.setActiveItem(1)
      this.autoplay = true
    },
    handleCarouselChange(index) {
      if (index === 0) {
        //完成所有项目的一次循环
        if (this.serverIndex === this.devServer.length) {
          //开始产出自动播放
          this.$refs.OutputDashboard.setAutoPlay(true);
          //跳转至首屏
          this.$refs.MultiServerCar.setActiveItem(0)
          //暂停当前自动播放
          this.autoplay = false
          this.serverIndex = 0
          console.log('index=0, initialIndex = 0')
        } else {
          console.log('index=0, initialIndex = 1')
          // 跳转至第二屏
          this.$refs.MultiServerCar.setActiveItem(1)
        }
        //將緩存的數據更新到視圖
        this.handleSetData(this.devServer[this.serverIndex++])
      } else {
        //手动切换时--暂停第一屏
        this.$refs.OutputDashboard.setAutoPlay(false);
        this.autoplay = true
      }

      if (index == 2) {
        //更新数据
        this.handleGetToken(this.tokenData, this.devServer[this.index++])
        // this.index++
        // if (this.index >= this.devServer.length) {
        //重置
        if (!this.devServer[this.index]) {
          this.index = 0
        }
      }
    },
    //
    start(bool) {
      if (bool) {
        this.oneEvent = false
        // this.autoplay = true
        this.handleSetData(this.devServer[this.serverIndex++])
      }
    },

    handleGetToken(data, api) {
      // this.loading = true
      getToken(data, api).then((res) => {
        if (res.Success) {
          this.$store.dispatch(
            'user/setTemporaryToken',
            `Bearer ${res.ResData.AccessToken}`
          )
          let params = JSON.parse(JSON.stringify(this.form))
          this.$set(params, 'password', encryptedData(params.password))
          this.$store
            .dispatch('user/loginNoKey', { userInfo: params, api })
            .then(() => {
              this.$store.dispatch('user/getUserInfo', api).then(() => {
                // this.loading = false
                this.handleSearch(api)
              })
            })
            .catch(() => {
              // this.loading = false
            })
        }
      })
    },
    handleServerSwitch() {
      // this.objData[this.devServer[this.index] + 'GetUPHYieldByDay'] = null
      // this.objData[this.devServer[this.index] + 'GetUPHYieldByWeek'] = null
      // this.objData[this.devServer[this.index] + 'GetDefectYield'] = null

      this.handleGetToken(this.tokenData, this.devServer[this.index])
      this.index++
    },
    handleSetData(key) {
      this.title = key.split('_').pop()
      /* Daily Trend Chart Per Latest 7 Days */
      if (
        this.objData[key + 'GetUPHYieldByDay'] &&
        this.objData[key + 'GetUPHYieldByDay'].length
      ) {
        this.$refs.DetailYield7DaysTV.show(
          this.objData[key + 'GetUPHYieldByDay'][0],
          ['Project', 'PartNumber', 'Line', 'StationType'],
          this.objData[key + 'GetUPHYieldByDay'][2],
          `Daily Trend Chart Per Latest 7 Days`
        )
      } else {
        this.$refs.DetailYield7DaysTV.show(
          [],
          ['Project', 'PartNumber', 'Line', 'StationType'],
          [],
          `Daily Trend Chart Per Latest 7 Days`
        )
      }
      /* Weekly Trend Chart Per Latest 7 Weeks */
      if (
        this.objData[key + 'GetUPHYieldByWeek'] &&
        this.objData[key + 'GetUPHYieldByWeek'].length
      ) {
        this.$refs.DetailYield7WeekM.show(
          this.objData[key + 'GetUPHYieldByWeek'][0],
          ['Project', 'PartNumber', 'Line', 'StationType'],
          this.objData[key + 'GetUPHYieldByWeek'][2],
          `Weekly Trend Chart Per Latest 7 Weeks`
        )
      } else {
        this.$refs.DetailYield7WeekM.show(
          [],
          ['Project', 'PartNumber', 'Line', 'StationType'],
          [],
          `Weekly Trend Chart Per Latest 7 Weeks`
        )
      }

      //表格
      let dData = this.objData[key + 'GetDefectYield']
      if (dData && dData.length) {
        this.$refs.DefectTableTV.show(
          dData[0],
          dData[0] ? Object.keys(dData[0][0]) : []
        )
        //Pareto(CUM)
        let datas = {
          yAxis: dData[4] ? dData[4].map((r) => r.DefectCodeDesc) : [],
          Data: dData[4] ? dData[4].map((r) => r.DefectRate) : [],
        }
        this.$refs.ParetoChartBarM.show(datas, 'Pareto(CUM)')
        //7 Week  Top Issues
        this.$refs.DefectRateChartLineM.show(
          dData[1],
          dData[2],
          `Top ${this.top} Issues`
        )
        //Top Defect by color
        this.$refs.DefectByColorM.show(
          dData[3],
          `Top ${this.top} Defect By Color`,
          dData[5] ? dData[5] : []
        )
      } else {
        this.$refs.DefectTableTV.show([], [])
        this.$refs.ParetoChartBarM.show({ yAxis: [], Data: [] }, 'Pareto(CUM)')
        this.$refs.DefectRateChartLineM.show([], [], `Top ${this.top} Issues`)
        this.$refs.DefectByColorM.show(
          [],
          `Top ${this.top} Defect By Color`,
          []
        )
      }
    },
    handleSearch(api) {
      let params = JSON.parse(JSON.stringify(this.query))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      //良率 7days
      let query = JSON.parse(JSON.stringify(params))
      query.S_DataType = '1'
      let n7Date = new Date()

      query.S_StartDateTime = new Date(
        n7Date.setDate(n7Date.getDate() - 6)
      ).format('yyyy-MM-dd 00:00:00')

      let flagObj = { flag1: false, flag2: false, flag3: false }
      GetUPHYield(query, api, true)
        .then((res) => {
          if (res.Success) {
            this.objData[api + 'GetUPHYieldByDay'] = res.ResData
            flagObj.flag1 = true
            this.start(
              this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
            )
          }
        })
        .catch((error) => {
          flagObj.flag1 = true
          this.start(
            this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
          )
        })

      //良率 7week
      GetUPHYield(params, api, true)
        .then((res) => {
          if (res.Success) {
            this.objData[api + 'GetUPHYieldByWeek'] = res.ResData
            flagObj.flag2 = true
            this.start(
              this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
            )
          }
        })
        .catch((error) => {
          flagObj.flag2 = true
          this.start(
            this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
          )
        })

      //不良 7week
      GetDefectYield(
        {
          ...params,
          S_TopQTY: this.top,
        },
        api,
        true
      )
        .then((res) => {
          if (res.Success) {
            this.objData[api + 'GetDefectYield'] = res.ResData
            flagObj.flag3 = true
            this.start(
              this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
            )
          }
        })
        .catch((error) => {
          flagObj.flag3 = true
          this.start(
            this.oneEvent && flagObj.flag1 && flagObj.flag2 && flagObj.flag3
          )
        })
    },
  },
}
</script>

<style lang="scss">
.main_multiserver {
  height: calc(100vh - 100px);
  padding: 50px;
  box-sizing: border-box;
  position: relative;

  .multiserver_title {
    position: absolute;
    //   border: 1px solid red;
    margin: 0 auto;
    height: 40px;
    top: 0;
    left: calc(100vw / 2 - 80px);
    z-index: 100;
    line-height: 40px;
    margin-top: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    text-shadow: 3px 3px 3px rgb(173, 170, 170);
    // border-radius: 5px;
    padding: 0 10px;
    background-color: transparent;
    // box-shadow: 2px 5px -2px rgb(173, 170, 170);
  }

  .el-carousel {
    height: inherit;
    min-height: 300px;
    .el-carousel__container {
      height: inherit;

      .el-carousel__item {
        box-sizing: border-box;
        // height: inherit;
        // overflow: auto;

        &>div {
          height: 50%;
        }
      }
    }
  }

  /* */
}
</style>
