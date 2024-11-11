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
          :show-header="false"
          height="100%"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column prop="ID" label="ID" width="80"></el-table-column>
          <el-table-column
            prop="Description"
            label="Description"
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
            :min-width="item == 'ID' ? '90' : '200'"
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
  name: 'RouteInfo',
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
      title: 'RouteInfo',
      FooterTableData: [],
      FooterTableHead: [],
      tableData: [],
      params: {},
      load: false,
    }
  },
  methods: {
    getTableData() {
      return this.FooterTableData
    },
    show(data, params) {
      this.FooterTableData = []
      this.tableData = []
      this.params = JSON.parse(JSON.stringify(params))
      this.$set(this.params, 'S_Type', 'RouteInfoDetail')

      this.tableData = data.length == 0 ? [] : data[0] ? [...data[0]] : []

      (this.tableData && this.tableData.length > 0) && this.$refs.headerTable.setCurrentRow(this.tableData[0])
    },
    handleCurrentChange(val) {
      this.$set(this.params, 'S_SNs', val ? val.ID : '')
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
