<template>
  <div v-loading="loading" class="tv_dashboard">
    <el-carousel indicator-position="none" :autoplay="true" :interval="1000 * 20" height="calc(100vh - 180px)"
      @change="handleCarouselChange">
      <el-carousel-item>
        <!-- 首页概榄-->
        <div style="height: 100%">
          <OverView ref="OverView" pid="TVDashboard"></OverView>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <!-- Weekly Trend chart per latest 7 weeks 折线-->
        <div>
          <YieldChartLine ref="DetailYield7WeekTV" style="height: 100%" cid="DetailYield7WeekTV" />
        </div>
        <!-- Pareto(CUM) -->
        <div>
          <ParetoChartBar ref="ParetoChartBarTV" style="height: 100%" cid="ParetoChartBarTV" />
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
          <DefectRateChartLine :ref="`DefectRateChartLineTV`" style="height: 100%" :cid="`DefectRateChartLineTV`" />
        </div>
        <div>
          <DefectByColor :ref="`DefectByColorTV`" style="height: 100%" :cid="`DefectByColorTV`" />
        </div>
      </el-carousel-item>
      <!--   <el-carousel-item>
        <UPHChart ref="UPHChartTV" style="height: 100%" cid="TVDashboardUPH" />
      </el-carousel-item> -->
      <!-- <el-carousel-item style="position: relative;">
        <TTReportWIP ref="TVDashboardWIP" style="height: 100%" cid="TVDashboardWIP" />
        <div style="position: absolute; top: 10px; right: 30px;">WIP Total: {{ total }}</div>
      </el-carousel-item> -->

      <el-carousel-item>
        <Analysis style="height: 100%" />
      </el-carousel-item>
      <el-carousel-item style="margin: 0; padding: 0;">
        <Dashboard style="height: 100%;"/>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
import { GetUPHYield } from '@/api/report.js'
import { GetDefectYield, GetReportGeneral } from '@/api/report.js'
import YieldChartLine from '@/components/chart/YieldChartLine'
import DefectByColor from '@/components/chart/DefectByColor'
import DefectRateChartLine from '@/components/chart/DefectRateChartLine'
import ParetoChartBar from '@/components/chart/ParetoChartBar'
import DefectTable from '@/components/table/DefectTable'
// import UPHChart from '@/components/chart/UPHChart'
// import { GetUPH } from '@/api/report.js'
import { mapGetters } from 'vuex'
import OverView from '@/components/chart/OverView.vue'
import { BaseUrl } from '@/utils/request'
// import TTReportWIP from '@/components/chart/TTReportWIP'
import Analysis from '@/views/report/production/Analysis'
import Dashboard from '@/views/report/production/dashboard/dashboardComponent.vue'

/* TV看板 */
export default {
  name: 'TVDashboardPage',
  components: {
    YieldChartLine,
    DefectByColor,
    DefectRateChartLine,
    ParetoChartBar,
    DefectTable,
    // UPHChart,
    OverView,
    // TTReportWIP
    Analysis,
    Dashboard
  },
  data() {
    let date = new Date()
    let sDate = new Date(date.setDate(date.getDate() - 48)).format(
      'yyyy-MM-dd 00:00:00'
    )
    return {
      title: '电视看板',
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date()?.format('yyyy-MM-dd hh:mm:ss'),
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
      isActivePage: false,
      loading: false,
      top: sessionStorage.getItem('S_TopQTY') ?? 20,
      total: 0
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      if (this.isActivePage) {
        this.handleResizeGather()
      }
    },
  },
  activated() {
    this.isActivePage = true
    this.handleResizeGather()
    window.addEventListener(
      'resize',
      this.$refs?.DetailYield7WeekTV?.handleWindowResize
    )
    window.addEventListener(
      'resize',
      this.$refs?.ParetoChartBarTV?.handleWindowResize
    )
    window.addEventListener(
      'resize',
      this.$refs?.DetailYield7DaysTV?.handleWindowResize
    )
    // window.addEventListener('resize', this.$refs?.UPHChartTV?.handleWindowResize)
    window.addEventListener(
      'resize',
      this.$refs?.DefectRateChartLineTV?.handleWindowResize
    )
    window.addEventListener(
      'resize',
      this.$refs?.DefectByColorTV?.handleWindowResize
    )
    /*  window.addEventListener(
       'resize',
       this.$refs.TVDashboardWIP.handleWindowResize
     ) */
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener(
      'resize',
      this.$refs?.DetailYield7WeekTV?.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs?.ParetoChartBarTV?.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs?.DetailYield7DaysTV?.handleWindowResize
    )
    /*     window.removeEventListener(
          'resize',
          this.$refs?.UPHChartTV?.handleWindowResize
        ) */
    window.removeEventListener(
      'resize',
      this.$refs?.DefectRateChartLineTV?.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs?.DefectByColorTV?.handleWindowResize
    )
    /*   window.removeEventListener(
        'resize',
        this.$refs.TVDashboardWIP.handleWindowResize
      ) */
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleCarouselChange(val) {
      if (val == 4) {
        this.isActivePage && this.$refs?.OverView?.handleGetOutputSum({
          S_StartDateTime: '2000-01-01',
          S_EndDateTime: '2000-01-01',
          YieldLevel: 1, //良率层级
          IsCombineYield: 0, //良率合并
          S_DataLevel: 7
        }, false)
        this.isActivePage && this.handleSearch(true)
      }
    },
    handleResizeGather() {
      this.$refs?.DetailYield7WeekTV?.handleWindowResize()
      this.$refs?.ParetoChartBarTV?.handleWindowResize()
      this.$refs?.DetailYield7DaysTV?.handleWindowResize()
      // this.$refs?.UPHChartTV?.handleWindowResize()
      this.$refs?.DefectRateChartLineTV?.handleWindowResize()
      this.$refs?.DefectByColorTV?.handleWindowResize()
      // this.$refs.TVDashboardWIP.handleWindowResize()
    },

    handleSearch(noShow) {
      // let allLoad = {}
      let params = JSON.parse(JSON.stringify(this.query))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      //良率 7days
      let query = JSON.parse(JSON.stringify(params))
      let date = new Date()
      let sDate = new Date(date.setDate(date.getDate() - 6)).format(
        'yyyy-MM-dd 00:00:00'
      )
      query.S_DataType = '1'
      query.S_StartDateTime = sDate
      query.S_EndDateTime = new Date()?.format('yyyy-MM-dd hh:mm:ss')
      GetUPHYield(query, BaseUrl.api, noShow).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          /* Daily Trend Chart Per Latest 7 Days */
          this.isActivePage &&
            this.$refs?.DetailYield7DaysTV?.show(
              data?.[0],
              ['Project', 'PartNumber', 'Line', 'StationType'],
              data?.[2],
              `Daily Trend Chart Per Latest 7 Days`
            )
        }
      })

      //良率 7week
      GetUPHYield(params, BaseUrl.api, noShow).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          /* Weekly Trend Chart Per Latest 7 Weeks */
          this.isActivePage &&
            this.$refs?.DetailYield7WeekTV?.show(
              data?.[0],
              ['Project', 'PartNumber', 'Line', 'StationType'],
              data?.[2],
              `Weekly Trend Chart Per Latest 7 Weeks`
            )
        }
      })

      //不良 7week
      GetDefectYield(
        {
          ...params,
          S_TopQTY: this.top,
        },
        BaseUrl.api,
        noShow
      ).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          //表格
          this.isActivePage &&
            this.$refs?.DefectTableTV?.show(
              data?.[0] ?? [],
              data?.[0] ? Object.keys(data?.[0]?.[0]) : []
            )
          //Pareto(CUM)
          let datas = {
            yAxis: data?.[4]?.map((r) => r.DefectCodeDesc) ?? [],
            Data: data?.[4]?.map((r) => r.DefectRate) ?? [],
          }
          this.isActivePage &&
            this.$refs?.ParetoChartBarTV?.show(datas, 'Pareto(CUM)')
          //7 Week  Top Issues
          this.$refs?.DefectRateChartLineTV?.show(
            data?.[1],
            data?.[2],
            `Top ${this.top} Issues`
          )
          //Top Defect by color
          this.isActivePage &&
            this.$refs?.DefectByColorTV?.show(
              data?.[3],
              `Top ${this.top} Defect By Color`,
              data?.[5]
            )
        }
      })

      // UPH
      /*  let paramsUPH = JSON.parse(JSON.stringify(params))
       let sud = new Date().format('yyyy-MM-dd 00:00:00')
       paramsUPH.S_DataType = '0'
       paramsUPH.S_StartDateTime = sud
       paramsUPH.S_EndDateTime = new Date().format('yyyy-MM-dd hh:mm:ss') */
      //UPH
      /*  GetUPH(paramsUPH, noShow).then((res) => {
         if (res.Success) {
           this.isActivePage && this.$refs?.UPHChartTV?.show(res.ResData)
         }
       }) */

      //TT-WIP
      /*  let par = {
         S_StartDateTime: '2000-01-01 00:00:00',
         S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
         S_Type: 'TTWIP'
       }
       GetReportGeneral(par, !noShow).then((res) => {
         if (res.Success) {
           res.ResData[0] &&
             res.ResData[0].forEach((item) => {
               this.total += item.QTY
             })
           this.isActivePage && this.$refs.TVDashboardWIP.show(res.ResData[0])
         }
       }) */
    },
  },
}
</script>

<style lang="scss">
.tv_dashboard {
  background-color: #fff;
  height: inherit;

  // min-height: 600px !important;
  .el-carousel {
    height: inherit;
    min-height: 300px;

    .el-carousel__container {

      // height: inherit;
      .el-carousel__item {
        box-sizing: border-box;

        &>div {
          height: calc(100% / 2 - 6px);
          // &:last-child {
          //   margin-top: 25px;
          // }
        }
      }
    }
  }
}
</style>
