<template>
  <div v-loading="isDisabled" class="page_container">
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
        <el-input ref="SNKeywordRef" v-model.trim="query.S_SNs" :disabled="isDisabled" size="mini"
          style="width: 250px; margin-right: 10px;" placeholder="Please Enter SN" clearable
          @keyup.native.enter="handleSNEnter(query.S_SNs)">
        </el-input>

        <el-button v-hasPermi="['SearchCenter/ExportData']" :icon="downLoading ? 'el-icon-loading' : ''" :disabled="downLoading" size="mini" @click="handleExport">
          {{ $t('export') }}
        </el-button>
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button :disabled="isDisabled" type="primary" size="mini" @click="handleSearch(true)">
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
      <el-container style="height: 100%">
        <el-aside width="240px">
          <el-table ref="singleTable" v-loadMore="load" :data="SNTableData" style="width: 100%; overflow: auto"
            height="100%" border stripe size="mini" :fit="true" highlight-current-row
            @current-change="handleCurrentChange">
            <el-table-column prop="ID" label="ID" sortable width="60"></el-table-column>
            <el-table-column prop="SN" label="SN" sortable min-width="160"
              :show-overflow-tooltip="true"></el-table-column>
          </el-table>
        </el-aside>
        <el-main>
          <!-- type="border-card" -->
          <el-tabs v-model="activeName" class="search_center" type="border-card" @tab-click="handleClick">
            <el-tab-pane label="UnitInfor" name="UnitInfor">
              <span slot="label">
                <i class="el-icon-s-opportunity"></i>
                UnitInfor
              </span>
              <unit-info ref="UnitInfor" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></unit-info>
            </el-tab-pane>
            <el-tab-pane label="Traceability" name="TraceabilityView">
              <span slot="label">
                <!-- <vab-icon :icon="['fas', 'database']"></vab-icon> -->
                <vab-icon :icon="['fas', 'coins']"></vab-icon>
                Traceability
              </span>
              <traceability ref="Traceability" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></traceability>
            </el-tab-pane>
            <el-tab-pane label="Part" name="PartView">
              <span slot="label">
                <vab-icon :icon="['fas', 'dice-d6']"></vab-icon>
                Part
              </span>
              <part ref="Part" :class="{ tabs_container: !show, tabs_container_: show }" :loading="loading"></part>
            </el-tab-pane>
            <el-tab-pane label="ProductionOrder" name="ProductionOrder">
              <span slot="label">
                <!-- <vab-icon :icon="['fas', 'tablet-alt']"></vab-icon> -->
                <!-- <i class="luggage-cart"></i> -->
                <vab-icon :icon="['fas', 'luggage-cart']"></vab-icon>
                ProductionOrder
              </span>
              <production-order ref="ProductionOrder" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></production-order>
            </el-tab-pane>
            <el-tab-pane label="MaterialUnit" name="MaterialUnit">
              <span slot="label">
                <vab-icon :icon="['fas', 'boxes']"></vab-icon>
                MaterialUnit
              </span>
              <material-unit ref="MaterialUnit" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></material-unit>
            </el-tab-pane>
            <el-tab-pane label="RouteInfo" name="RouteInfoView">
              <span slot="label">
                <vab-icon :icon="['fas', 'route']"></vab-icon>
                RouteInfo
              </span>
              <route-info ref="RouteInfo" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></route-info>
            </el-tab-pane>
            <el-tab-pane label="TestRecord" name="TestRecord">
              <span slot="label">
                <!-- <vab-icon :icon="['fas', 'record-vinyl']"></vab-icon> -->
                <vab-icon :icon="['fas', 'check-double']"></vab-icon>
                TestRecord
              </span>
              <test-record ref="TestRecord" :class="{ tabs_container: !show, tabs_container_: show }"
                :loading="loading"></test-record>
            </el-tab-pane>
            <el-tab-pane label="Machine" name="Machine">
              <span slot="label">
                <vab-icon :icon="['fas', 'tractor']"></vab-icon>
                Machine
              </span>
              <machine ref="Machine" :class="{ tabs_container: !show, tabs_container_: show }" :loading="loading">
              </machine>
            </el-tab-pane>
            <el-tab-pane label="Package" name="PackageView">
              <span slot="label">
                <vab-icon :icon="['fas', 'box']"></vab-icon>
                Package
              </span>
              <package ref="Package" :class="{ tabs_container: !show, tabs_container_: show }" :loading="loading">
              </package>
            </el-tab-pane>
            <el-tab-pane label="Shipment" name="Shipment">
              <span slot="label">
                <vab-icon :icon="['fas', 'truck-moving']"></vab-icon>
                Shipment
              </span>
              <shipment ref="Shipment" :class="{ tabs_container: !show, tabs_container_: show }" :loading="loading">
              </shipment>
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/TT-Query'
import { GetSearchCenter } from '@/api/report.js'
import UnitInfo from './components/unitInfo.vue'
import Traceability from './components/traceability.vue'
import TestRecord from './components/testRecord.vue'
import Shipment from './components/shipment.vue'
import RouteInfo from './components/routeInfo.vue'
import ProductionOrder from './components/productionOrder.vue'
import Part from './components/part.vue'
import Package from './components/package.vue'
import MaterialUnit from './components/materialUnit.vue'
import Machine from './components/machine.vue'
import { downloadFile } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

export default {
  name: 'SearchCenter',
  components: {
    QueryCondition,
    UnitInfo,
    Traceability,
    TestRecord,
    Shipment,
    RouteInfo,
    ProductionOrder,
    Part,
    Package,
    MaterialUnit,
    Machine,
  },
  data() {
    let sDate = new Date().format('yyyy-MM-dd 00:00:00')
    return {
      title: '查询中心',
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
        S_Type: 'Search', // Search/UnitInfor/Traceability/Package/Part/ProductionOrder/RouteInfo
      },
      SNTableData: [],
      activeName: 'UnitInfor',
      params: {},
      cacheSNTableData: [],
      pageSize: 200,
      currentPage: 0,
      loading: false,
      downLoading: false,
      excelData: null,
      isDisabled: false
    }
  },
  watch: {
    "query.S_SNs": function (val, oval) {
      if (!val && oval && !this.isDisabled) {
        this.$nextTick(function () {
          this.$refs.SNKeywordRef.focus()
        })
      }
    }
  },
  created() {
    this.params = JSON.parse(JSON.stringify(this.query))
    this.$set(this.params, 'S_Type', this.activeName)
  },
  mounted() {
  },
  methods: {
    handleSNEnter(val) {
      if (!val) return
      this.handleSearch(true)
    },
    handleExport() {
      let that = this
      this.downLoading = true

      switch (this.activeName) {
        case 'TraceabilityView':
          this.excelData = this.excelData.concat([
            this.$refs.Traceability.getTableData(),
          ])
          break
        case 'PartView':
          this.excelData = this.excelData.concat([
            this.$refs.Part.getTableData(),
          ])
          break
        case 'PackageView':
          this.excelData = this.excelData.concat(
            this.$refs.Package.getTableData()
          )
          break
        case 'RouteInfoView':
          this.excelData = this.excelData.concat([
            this.$refs.RouteInfo.getTableData(),
          ])
          break
        case 'Shipment':
          this.excelData = this.excelData.concat([
            this.$refs.Shipment.getTableData(),
          ])
          break
        default:
          break
      }

      let data = {}
      if(!this.excelData){
        that.downLoading = false
        return
      }
      this.excelData.forEach((res, index) => {
        if(res && res.length != 0){
          data['sheet' + index] = res
        }
      })

      downloadFile(
        getDownLoadData(data, 'xlsx'),
        `${this.activeName}_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )
      that.downLoading = false
    },
    load() {
      if (this.currentPage * this.pageSize >= this.cacheSNTableData.length) {
        return
      }
      this.currentPage++
      this.SNTableData = [
        ...this.SNTableData,
        ...this.cacheSNTableData.slice(
          this.currentPage * this.pageSize,
          this.currentPage * this.pageSize + this.pageSize
        ),
      ]
    },
    handleClick(tab, event) {
      /*
        Search,UnitInfor,
        TraceabilityView,
        TraceabilityDetail,
        TestRecord,
        PackageView,
        PackageDetail,
        PartView,
        PartDetail,
        ProductionOrder,
        RouteInfo,
        RouteInfoView,
        RouteInfoDetail,
        MaterialUnit,
        Machine,
        Shipment,
        MultipackDetail
        */
      let arr = [
        'UnitInfor',
        'TraceabilityView',
        'PartView',
        'ProductionOrder',
        'MaterialUnit',
        'RouteInfoView',
        'TestRecord',
        'Machine',
        'PackageView',
        'Shipment',
      ]
      this.$set(this.params, 'S_Type', arr[tab.index])

      this.handleQuery(this.params)
    },
    handleCurrentChange(val) {
        if (!val) return

      this.$set(this.params, 'S_StartDateTime', this.query.S_StartDateTime)
      this.$set(this.params, 'S_EndDateTime', this.query.S_EndDateTime)
      this.$set(this.params, 'S_SNs', val ? val.SN : '')
      this.$set(this.params, 'S_Type', this.activeName)
      this.handleQuery(this.params)
    },
    handleSearch() {
      this.show = false
      this.handleQuery(this.query, true)
    },

    handleQuery(query/* , isShowLoading */) {
      // debugger
      let params = {}
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(',')
        } else {
          params[key] = query[key]
        }
      }
      if (query.S_Type === 'Search') {
        this.isDisabled = true
        this.SNTableData = []
      } else {
        this.loading = true
      }
      this.distribute(query.S_Type, []) //清数据
      GetSearchCenter(params/* , isShowLoading */)
        .then((res) => {
          if (res.Success) {
            this.distribute(query.S_Type, res.ResData)
          }
          if(query.S_Type === 'Search' && this.isDisabled){
            this.isDisabled = false
            this.$set(this.query, 'S_SNs', '')
          }else{
            this.loading = false
          }
        })
        .catch((error) => {
          this.loading = false
          this.isDisabled = false
        })
    },
    distribute(val, data) {
      if (val != 'Search') {
        this.excelData = JSON.parse(JSON.stringify(data))
      }
      switch (val) {
        case 'Search':
          this.cacheSNTableData = data[0] ? data[0] : []
          this.currentPage = 0
          this.SNTableData = this.cacheSNTableData.slice(
            this.currentPage,
            this.pageSize
          )
          //获取到第一个sn
          this.$refs.singleTable.setCurrentRow(
            this.SNTableData ? this.SNTableData[0] : []
          )
          break
        case 'UnitInfor':
          this.$refs.UnitInfor.show(data)
          break
        case 'TraceabilityView':
          this.$refs.Traceability.show(data, this.params)
          break
        case 'PartView':
          this.$refs.Part.show(data, this.params)
          break
        case 'ProductionOrder':
          this.$refs.ProductionOrder.show(data)
          break
        case 'MaterialUnit':
          this.$refs.MaterialUnit.show(data)
          break
        case 'RouteInfoView':
          this.$refs.RouteInfo.show(data, this.params)
          break
        case 'TestRecord':
          this.$refs.TestRecord.show(data)
          break
        case 'Machine':
          this.$refs.Machine.show(data)
          break
        case 'PackageView':
          this.$refs.Package.show(data, this.params)
          break
        case 'Shipment':
          this.$refs.Shipment.show(data, this.params)
          break
        default:
      }
    },
    handleReset() {
      this.isDisabled = false
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
      this.$set(this.query, 'S_Type', 'Search') //
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
    height: calc(100vh - 415px);
    box-sizing: border-box;
  }

  .el-main {
    padding: 0;
    margin: 0 10px;

    .tabs_container {
      height: calc(100vh - 302px);
      // transition: height 0.4s;
    }

    .tabs_container_ {
      height: calc(100vh - 487px);
      transition: height 0.4s;
    }
  }
}

::v-deep {

  .el-tabs__nav-prev,
  .el-tabs__nav-next {
    font-size: 22px;

    [class*='el-icon-arrow-'] {
      font-weight: 700;
    }
  }
}
</style>
