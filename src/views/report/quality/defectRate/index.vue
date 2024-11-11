<template>
  <div v-loading="loading" class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition ref="QueryConditionRef" v-model="query" :is-show-data-level="true"></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <el-button v-hasPermi="['Quality/Defect/ExportData']" size="mini" @click="handleExport">
          {{ $t('export') }}
        </el-button>
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" size="mini" @click="handleSearch">
          {{ $t('search') }}
        </el-button>
        <span v-if="!show" size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('unfold') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <span v-else size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('packUp') }}
          <i class="el-icon-arrow-up el-icon--right"></i>
        </span>
      </div>
    </div>
    <div style="width: 100%; height: 5px; background-color: #f6f8f9"></div>
    <div class="table_content">
      <span class="top_box">
        <div class="goto_yield">
          <a @click="gotoYield">{{ $t('Yield') }}</a>
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            <i class="el-icon-arrow-down el-icon-setting"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <div style="display: inline-block; margin: 0 5px">top:</div>
            <el-input v-model="top" type="number" style="width: 80px" @change="handleTopInput"></el-input>
          </el-dropdown-menu>
        </el-dropdown>
      </span>
      <div>
        <DefectTable ref="DefectTable" style="height: 100%" :title="`Top ${top} Defect Distribution`" />
      </div>
      <div>
        <DefectRateChartLine ref="DefactRateLineChart" style="height: 100%" cid="DefactRateLineChart" />
      </div>
      <div>
        <DefectByColor ref="DefectByColor" style="height: 100%" cid="DefectByColor" />
      </div>
      <div>
        <ParetoChartBar ref="DefactRateBarChart" style="height: 100%" cid="DefactRateBarChart" />
      </div>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/QueryCondition'
import { mapGetters } from 'vuex'
import { GetDefectYield } from '@/api/report.js'
import DefectByColor from '@/components/chart/DefectByColor'
import DefectRateChartLine from '@/components/chart/DefectRateChartLine'
import ParetoChartBar from '@/components/chart/ParetoChartBar'
import DefectTable from '@/components/table/DefectTable'
import { downloadFile } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

//DefectRate 不良
export default {
  name: 'DefectRatePage',
  components: {
    QueryCondition,
    DefectByColor,
    DefectRateChartLine,
    ParetoChartBar,
    DefectTable,
  },
  data() {
    let date = new Date()
    let sDate = new Date(date.setDate(date.getDate() - 6)).format(
      'yyyy-MM-dd 00:00:00'
    )
    return {
      show: true,
      query: {
        S_StartDateTime: sDate, //new Date('2021/08/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '1',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: null, //班次
        S_DataLevel: 2, //数据层级
        S_TopQTY: sessionStorage.getItem('S_TopQTY')
          ? sessionStorage.getItem('S_TopQTY')
          : 20,
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      isActivePage: false,
      catchData: null,
      top: sessionStorage.getItem('S_TopQTY')
        ? sessionStorage.getItem('S_TopQTY')
        : 20,
      loading: false
    }
  },
  computed: {
    ...mapGetters({
      dateType: 'common/timeOptions',
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      if (this.isActivePage) {
        this.$refs.DefactRateLineChart.handleWindowResize()
        this.$refs.DefectByColor.handleWindowResize()
        this.$refs.DefactRateBarChart.handleWindowResize()
      }
    }
  },
  activated() {
    let data = this.$route.params
    if (JSON.stringify(data) != '{}') {
      for (let key in data) {
        this.$set(this.query, key, data[key])
        if (key === 'S_DataLevel') {
          this.$set(this.query, key, parseInt(data[key]))
        }
      }
      this.$refs.QueryConditionRef.setData(this.query)
      this.handleSearch()
    }
    this.isActivePage = true
    this.$refs.DefactRateLineChart.handleWindowResize()
    this.$refs.DefectByColor.handleWindowResize()
    this.$refs.DefactRateBarChart.handleWindowResize()
    window.addEventListener(
      'resize',
      this.$refs.DefactRateLineChart.handleWindowResize
    )
    window.addEventListener(
      'resize',
      this.$refs.DefectByColor.handleWindowResize
    )
    window.addEventListener(
      'resize',
      this.$refs.DefactRateBarChart.handleWindowResize
    )
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener(
      'resize',
      this.$refs.DefactRateLineChart.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs.DefectByColor.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs.DefactRateBarChart.handleWindowResize
    )
  },
  mounted() {
    // this.handleSearch()
  },
  methods: {
    gotoYield() {
      this.$router.push({
        // path: '/report/quality/yield',
        name: 'Yield',
        params: this.query,
      })
    },
    handleTopInput(val) {
      this.top = val > 20 ? 20 : val <= 1 ? 1 : val
      this.$set(this.query, 'S_TopQTY', this.top)
      sessionStorage.setItem('S_TopQTY', this.top)
      // this.GetDefectYield()
    },
    setData(ResData) {
      //第一张表格
      this.$refs.DefectTable.show(
        ResData[0],
        ResData[0] ? Object.keys(ResData[0][0]) : []
      )
      //第二张折线图
      let title = this.dateType.find(
        (res) => res.value == this.query.S_DataType
      ).label

      this.$refs.DefactRateLineChart.show(
        ResData[1],
        ResData[2],
        `Top ${this.top} Defect Rate Trend Chart(By ${title})`
      )
      //第三张柱状图
      this.$refs.DefectByColor.show(
        ResData[3],
        `Top ${this.top} Defect By Color`,
        ResData[5]
      )
      //第四张图表
      let datas = {
        yAxis: ResData[4] ? ResData[4].map((r) => r.DefectCodeDesc) : [],
        Data: ResData[4] ? ResData[4].map((r) => r.DefectRate) : [],
      }
      this.$refs.DefactRateBarChart.show(datas, 'Pareto(CUM)')
    },
    GetDefectYield() {
      let params = JSON.parse(JSON.stringify(this.query))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      this.catchData = null

      //清空数据
      //第一张表格
      this.$refs.DefectTable.show([], [])
      //第二张折线图
      this.$refs.DefactRateLineChart.show(
        [],
        [],
        `Top -- Defect Rate Trend Chart(By --)`
      )
      //第三张柱状图
      this.$refs.DefectByColor.show([], `Top -- Defect By Color`, [])
      //第四张图表
      this.$refs.DefactRateBarChart.show(
        {
          yAxis: [],
          Data: [],
        },
        'Pareto(CUM)'
      )
      this.loading = true
      GetDefectYield(params, '', true).then((res) => {
        if (res.Success) {
          this.catchData = JSON.parse(JSON.stringify(res.ResData))
          this.setData(res.ResData)
        }
        this.loading = false
      })
    },
    handleExport() {
      if (!this.catchData || this.catchData.length === 0) return;
      let fd = JSON.parse(JSON.stringify(this.catchData[0]))
      fd.forEach(res => {
        Object.keys(res).forEach(key => {
          if (!isNaN(res[key]) && key != 'ID') {
            res[key] = res[key] ? res[key] + '%' : ''
          }
        })
      })

      let dt = JSON.parse(JSON.stringify(this.catchData[1]))
      dt.forEach(res => {
        Object.keys(res).forEach(key => {
          if (!isNaN(res[key])) {
            res[key] = res[key] + '%'
          }
        })
      })
      let db = JSON.parse(JSON.stringify(this.catchData[3]))
      db.forEach(res => {
        Object.keys(res).forEach(key => {
          if (!isNaN(res[key]) && key === 'DefectRate') {
            res[key] = res[key] + '%'
          }
        })
      })
      let pc = JSON.parse(JSON.stringify(this.catchData[4]))
      pc.forEach(res => {
        Object.keys(res).forEach(key => {
          if (!isNaN(res[key])) {
            res[key] = res[key] + '%'
          }
        })
      })

      let data = {
        "Top20DefectDistribution": fd,
        "Top20DefectRateTrendChart-ByDat": dt,
        "Top20DefectByColor": db,
        "Pareto-CUM": pc
      }
      let headers = {
        "Top20DefectDistribution": [],
        "Top20DefectRateTrendChart-ByDat": [],
        "Top20DefectByColor": [],
        "Pareto-CUM": []
      }
      downloadFile(
        getDownLoadData(data, 'xlsx', headers),
        `${this.$t('DefectRate')}_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )
    },
    handleReset() {
      let date = new Date()
      let sDate = new Date(date.setDate(date.getDate() - 6)).format(
        'yyyy-MM-dd 00:00:00'
      )
      this.$set(this.query, 'S_StartDateTime', sDate)
      this.$set(
        this.query,
        'S_EndDateTime',
        new Date().format('yyyy-MM-dd hh:mm:ss')
      )
      this.$set(this.query, 'S_DataType', '1')
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
      this.$set(this.query, 'S_Shift', null) //班次
      this.$set(this.query, 'S_DataLevel', 2) //数据层级
    },
    handleSearch() {
      this.show = false
      this.GetDefectYield()
    },
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  overflow: hidden;

  .table_content {
    // overflow: hidden;
    padding: 10px;
    margin-bottom: 15px;
    position: relative;

    .top_box {
      position: absolute;
      right: 15px;
      top: 5px;

      .goto_yield {
        display: inline-block;
        margin-right: 20px;

        a {
          font-size: 14px;
          cursor: pointer;
          font-weight: normal;
          border-bottom: 1px solid #ccc;
        }
      }
    }

    &>div {
      height: 360px;
      min-height: 360px;
    }
  }
}
</style>
