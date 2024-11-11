<template>
  <div v-loading="loading" class="page_container">
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
        <el-button v-hasPermi="['Quality/MaterialTraceability/ExportData']" :icon="downLoading ? 'el-icon-loading' : ''" :disabled="downLoading" size="mini" @click="handleExport">
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
      <el-table :data="tableData" style="width: 100%" height="calc(100% - 48px)" border stripe size="mini"
        :highlight-current-row="true">
        <!--  <el-table-column v-for="item in tableHeader" :key="item.name" :prop="item.name" :min-width="item.width"
          :label="item.name" show-overflow-tooltip></el-table-column> -->
        <el-table-column v-for="item in tableColumns" :key="item" :prop="item" :label="item" sortable
          :show-overflow-tooltip="true" :min-width="item == 'Item' || item == 'ID' ? '80' : '240'"></el-table-column>
      </el-table>
      <el-pagination style="text-align: left;" :current-page="query.S_PageIndex" :page-sizes="pageSizes"
        :page-size="query.S_PageQTY" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/TT-Query'
import { GetWIPComponentList, GetExportExcel } from '@/api/report.js'
import { downloadFile } from '@/utils'

//物料追溯
/*
TGPG08M56609AAP41254,
TOR05F2094002105GW00417070000024097,
C07071DE02041KZ0139,
G5FG20YZ1930,
G52G212K1937,
TGPG0ET56607AAP41221,
TGPG0G957807AAOG1212,
TOR05F2441002105GW03117010000024885,
TGPG08M56609AAP41254,TOR05F2094002105GW00417070000024097,C07071DE02041KZ0139,
TGPG11H57809AAP41265,
*/
export default {
  name: 'MaterialTraceability',
  components: {
    QueryCondition,
  },
  data() {
    let date = new Date()
    let sDate = new Date(date.setDate(date.getDate() - 6)).format(
      'yyyy-MM-dd 00:00:00'
    )
    return {
      show: true,
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //[2, 8], //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_UnitStateID: null,
        S_UnitStatusID: null,
        S_PageIndex: 1,
        S_PageQTY: 100,
      },
      tableData: [],
      total: 0,
      pageSizes: [50, 100, 200, 300, 400, 500],
      loading: false,
      downLoading: false,
      tableColumns: [],
      tableHeader: [
        { name: 'Item', width: 50 },
        { name: 'ProductionOrderNumber', width: 180 },
        { name: 'RCAM', width: 230 },
        { name: 'SHELL', width: 200 },
        { name: 'MAGNET', width: 270 },
        { name: 'NFC', width: 150 },
        { name: 'Line', width: 150 },
        { name: 'ParentLine', width: 130 },
        { name: 'ParentPartNumber', width: 170 },
        { name: 'ParentProductionOrderNumber', width: 220 },
        { name: 'ParentSerialNumber', width: 180 },
        { name: 'ParentStation', width: 150 },
        { name: 'ParentStationType', width: 150 },
        { name: 'ParentUnitID', width: 110 },
        { name: 'ParentUnitState', width: 150 },
        { name: 'ParentUnitStatus', width: 140 },
        { name: 'PartNumber', width: 170 },
        { name: 'StationType', width: 100 },
        { name: 'UnitState', width: 120 },
        { name: 'UnitStatus', width: 100 },
        { name: 'Employee', width: 100 },
        { name: 'LastUpdate', width: 160 },
        { name: 'ParentEmployee', width: 130 },
        { name: 'ParentLastUpdate', width: 160 },
        { name: 'AssemblyEmployee', width: 150 },
        { name: 'AssemblyTime', width: 160 },
        { name: 'CreationTime', width: 160 },
      ]
    }
  },

  methods: {
    handleSizeChange(val) {
      this.$set(this.query, 'S_PageQTY', val)
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.$set(this.query, 'S_PageIndex', val)
      this.getTableData()
    },
    handleExport() {
      this.downLoading = true
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      delete params.Shift;
      delete params.YieldLevel;
      delete params.IsCombineYield;
      params.S_PageIndex = 1
      params.S_PageQTY = 0
      params.S_Type = 'WIPComponentList'
      GetExportExcel(params)
        .then((res) => {
          var url = res.ResData
          if (res.Success && url) {
            downloadFile(
              url,
              url.substring(url.lastIndexOf('/') + 1, url.lastIndexOf('.'))
            )
          }
          this.downLoading = false
        })
        .catch((error) => {
          this.downLoading = false
        })
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
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
    },
    handleSearch() {
      this.$set(this.query, 'S_PageIndex', 1)
      this.getTableData()
    },
    getTableData() {
      this.show = false
      this.loading = true
      let params = JSON.parse(JSON.stringify(this.query))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      delete params.Shift;
      delete params.YieldLevel;
      delete params.IsCombineYield;
      this.tableData = []
      GetWIPComponentList(params).then((res) => {
        try {
          let data = res.ResData
          if (res.Success && Array.isArray(data) && data.length > 0) {
            this.tableColumns = Object.keys(data[0][0])
            this.$nextTick(function () {
              this.tableData = [...data[0]]
            })
            this.total = data[1][0].TotalRecord
          }
        } catch (err) {
          this.$message({
            message: err.toString(),
            type: 'error'
          })
        } finally {
          this.loading = false
        }
      }, error => {
        this.loading = false
      })
    }
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  // height: inherit;
  overflow: hidden;

  .table_content {
    box-sizing: border-box;
  }
}
</style>
