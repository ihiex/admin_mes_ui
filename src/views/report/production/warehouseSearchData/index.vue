<template>
  <div class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition v-model="query" :is-show-data-level="true" :is-show-shift="false"
              :is-show-yield-level="false" :is-show-is-combine-yield="false"></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <!-- <el-button @click="test">test</el-button> -->
        <el-button v-hasPermi="['WarehouseSearch/ExportData']" :icon="loading ? 'el-icon-loading' : ''" :disabled="loading"
          size="mini" @click="handleExport">
          {{ $t('export') }}
        </el-button>
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" size="mini" @click="handleSearch(query, true)">
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
    <div :class="{ table_content: !show, table_content_show: show }">
      <WIPDetailTable ref="RawData" type="RawData" />
    </div>
  </div>
</template>

<script>
import { GetReportGeneral, GetExportExcel } from '@/api/report.js'
import QueryCondition from '@/components/TT-Query'
import WIPDetailTable from '@/components/table/WIPDetailTable.vue'
import { downloadFile } from '@/utils'
/* 仓库数据查询 */
export default {
  name: 'WarehouseSearchData',
  components: {
    QueryCondition,
    WIPDetailTable,
  },
  data() {
    let sDate = new Date().format('yyyy-MM-dd 00:00:00')
    return {
      title: '仓库查询',
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
        S_Type: 'WHSearchData',
        S_PageIndex: 1,
        S_PageQTY: 100,
        // YieldLevel: 1, //良率层级
        // IsCombineYield: 0, //良率合并
      },
      loading: false,
    }
  },
  mounted() {
    // this.handleSearch(this.query, true)
  },
  methods: {
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
      params.S_PageQTY = 0
      params.S_PageIndex = 1
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
    handleSearch(query, isShowLoading) {
      this.$set(this.query, 'S_PageIndex', query.S_PageIndex)
      this.$set(this.query, 'S_PageQTY', query.S_PageQTY)
      this.show = false
      let params = {}
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(',')
        } else {
          params[key] = query[key]
        }
      }

      delete params.Shift
      delete params.YieldLevel
      delete params.IsCombineYield
      //清空数据
      this.$refs.RawData.show([], [], query, 0)
      GetReportGeneral(params, isShowLoading).then((res) => {
        if (res.Success) {
          let headers =
            res.ResData[0] && res.ResData[0][0]
              ? Object.keys(res.ResData[0][0])
              : []
          this.$refs.RawData.show(
            res.ResData ? res.ResData[0] : [],
            headers,
            query,
            res.ResData[1] && res.ResData[1][0]
              ? res.ResData[1][0].TotalRecord
              : res.ResData[0]
                ? res.ResData[0].length
                : 0
          )
        } else {
          this.$refs.RawData.show([], [], query, 0)
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

  .table_content {
    height: calc(100vh - 230px);
    box-sizing: border-box;
  }

  .table_content_show {
    height: calc(100vh - 414px);
    box-sizing: border-box;
  }
}
</style>
