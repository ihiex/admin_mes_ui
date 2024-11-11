<template>
  <div v-loading="loading" class="page_container">
    <el-container>
      <el-header height="30%">
        <el-table
          ref="headerTable"
          :data="tableData"
          style="width: 100%"
          size="mini"
          stripe
          height="100%"
          border
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column
            v-for="(item, index) in tableDataHead"

            :key="index"
            :prop="item"
            :label="item"
            sortable
            :width="
              item == 'FInterID' ? '100' : item == 'FBillNO' ? '270' : '220'
            "
          ></el-table-column>
        </el-table>
      </el-header>
      <el-main height="70%">
        <el-table
          v-loading="load"
          :data="FooterTableData"
          style="width: 100%"
          size="mini"
          stripe
          :fit="true"
          height="100%"
          border
        >
          <el-table-column
            v-for="item in FooterTableHead"
            :key="item"
            :prop="item"
            :label="item"
            sortable
            :min-width="
              item == 'ID'
                ? '90'
                : item == 'ProductionOrderNumber'
                ? '230'
                : '200'
            "
            :show-overflow-tooltip="true"
          ></el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { GetSearchCenter } from '@/api/report.js'

export default {
  name: 'Shipment',
  props: {
    loading: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    return {
      title: 'Shipment',
      FooterTableData: [],
      FooterTableHead: [],
      tableData: [],
      tableDataHead: [],
      params: {},
      load: false,
    }
  },
  methods: {
    getTableData() {
      return this.FooterTableData
    },
    show(data, params) {
      this.tableData = []
      this.FooterTableData = []
      this.params = JSON.parse(JSON.stringify(params))
      this.$set(this.params, 'S_Type', 'MultipackDetail')
      this.tableDataHead = data[0] ? Object.keys(data[0][0]) : []
      this.$nextTick(function () {
        this.tableData = Array.isArray(data) && data.length > 0 ? data[0] : []
        this.tableData.length > 0 &&
          this.$refs.headerTable.setCurrentRow(this.tableData[0])
      })
    },
    handleCurrentChange(val) {
      this.$set(this.params, 'S_SNs', val ? val.FDetailID : '')
      this.FooterTableData = []
      this.load = true
      GetSearchCenter(this.params)
        .then((res) => {
          if (res.Success) {
            this.FooterTableHead = res.ResData[0]
              ? Object.keys(res.ResData[0][0])
              : []
            this.$nextTick(function () {
              this.FooterTableData = res.ResData[0]
            })
          }
          this.load = false
        })
        .catch((error) => {
          this.load = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_container {
  .el-container {
    padding: 0;
    height: 100%;
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0;
    }
  }
}
</style>
