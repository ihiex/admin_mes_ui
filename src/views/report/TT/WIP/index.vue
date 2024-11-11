<template>
  <div class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition
              ref="QueryConditionRef"
              v-model="query"
              :is-show-data-level="true"
              :is-show-shift="false"
              :is-show-yield-level="false"
              :is-show-is-combine-yield="false"
            ></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <el-button
        v-hasPermi="['TT/WIP/ExportData']"
          :icon="loading ? 'el-icon-loading' : ''"
          :disabled="loading"
          size="mini"
          @click="handleExport"
        >
          {{ $t('export') }}
        </el-button>
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" size="mini" @click="handleSearch(true)">
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
    <div class="chart_box">
      <div :class="{ table_content: !show, table_content_show: show }">
        <TTReportWIP ref="TTReportWIP" style="height: 100%" />
      </div>
      <div class="link_detail">
        <span v-if="total >= 0" style="margin-right: 20px; font-size: 16px">
          Total:{{ total }}
        </span>
        <a @click="gotoDetail">{{ $t('WIPList') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/TT-Query'
import { mapGetters } from 'vuex'
import { GetReportGeneral, GetExportExcel } from '@/api/report.js'
import TTReportWIP from '@/components/chart/TTReportWIP'
import { downloadFile } from '@/utils'

//WIP
export default {
  name: 'WIPPage',
  components: {
    QueryCondition,
    TTReportWIP,
  },
  data() {
    let sDate = new Date().format('yyyy-MM-dd 00:00:00')
    return {
      show: true,
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_UnitStateID: null,
        S_UnitStatusID: null,
        S_SNs: '',
        S_Type: 'TTWIP',
        S_PageIndex: 1,
        S_PageQTY: 100,
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      time: null,
      isActivePage: false,
      loading: false,
      once: false,
      total: 0,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      this.isActivePage && this.$refs.TTReportWIP.handleWindowResize()
    },
    show: function (val, oval) {
      this.isActivePage && this.$refs.TTReportWIP.handleWindowResize()
    },
  },
  activated() {
    this.isActivePage = true
    this.$refs.TTReportWIP.handleWindowResize()
    window.addEventListener('resize', this.$refs.TTReportWIP.handleWindowResize)

    let data = this.$route.params
    if (JSON.stringify(data) != '{}') {
      Object.keys(data).forEach((key) => {
        if (key !== 'S_Type') {
          if (key === 'S_PageIndex' || key === 'S_PageQTY') {
            this.$set(this.query, key, parseInt(data[key]))
          } else {
            this.$set(this.query, key, data[key])
          }
        }
      })
      this.$refs.QueryConditionRef.setData(this.query)
      this.once = true
      this.handleSearch(true)
    } else if (!this.once) {
      // this.handleSearch(true)
    }
    this.once = true
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener(
      'resize',
      this.$refs.TTReportWIP.handleWindowResize
    )
  },
  mounted() {},
  methods: {
    gotoDetail() {
      this.$router.push({
        // path: '/report/tt/wip-list-page',
        name: 'WIPListPage',
        params: this.query,
      })
    },
    handleExport() {
      this.loading = true
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      params.S_PageIndex = 1
      params.S_PageQTY = 0
      GetExportExcel(params)
        .then((res) => {
          if (res.Success && res.ResData) {
            var url = res.ResData
            downloadFile(
              url,
              url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
            )
          }
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
        })
    },
    handleReset() {
      let sDate = new Date().format('yyyy-MM-dd 00:00:00')
      this.$set(this.query, 'S_StartDateTime', sDate)
      this.$set(
        this.query,
        'S_EndDateTime',
        new Date().format('yyyy-MM-dd hh:mm:ss')
      )
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
      this.$set(this.query, 'S_SNs', '') //
      this.$set(this.query, 'S_UnitStateID', null) //
      this.$set(this.query, 'S_UnitStatusID', null) //
    },
    handleSearch(isShowLoading) {
      this.show = false
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      this.total = 0
      this.isActivePage && this.$refs.TTReportWIP.show([])
      GetReportGeneral(params, isShowLoading).then((res) => {
        if (res.Success) {
          res.ResData[0] &&
            res.ResData[0].forEach((item) => {
              this.total += item.QTY
            })
          this.isActivePage && this.$refs.TTReportWIP.show(res.ResData[0])
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  height: inherit;
  background-color: #fff;
  .chart_box {
    position: relative;
    .table_content {
      height: calc(100vh - 230px);
      box-sizing: border-box;
    }
    .table_content_show {
      height: calc(100vh - 414px);
      box-sizing: border-box;
    }

    .link_detail {
      position: absolute;
      right: 10px;
      top: 15px;
      a {
        border-bottom: 1px solid #ccc;
      }
    }
  }
}
</style>

