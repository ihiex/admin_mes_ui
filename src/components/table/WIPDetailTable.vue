<template>
  <div class="detail_table">
    <!-- :default-sort="{ prop: 'ID', order: 'ascending' }" -->
    <el-table :key="tableKey" :data="tableData" style="width: 100%" :height="height" border stripe size="mini"
      :fit="true">
      <el-table-column v-for="item in tableColumns" :key="item" :prop="item" :label="item" sortable
        :show-overflow-tooltip="true" :min-width="item == 'Item' || item == 'ID' ? '80' : '240'"></el-table-column>
    </el-table>
    <el-pagination :current-page="pagination.currentPage" :page-sizes="pagination.pageSizes"
      :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"
      @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
  </div>
</template>

<script>

export default {
  name: 'WIPDetailTable',
  props: {
    type: {
      type: String,
      require: true,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      pagination: {
        pageSizes: [50, 100, 200, 300, 400, 500],
        currentPage: 1,
        pageSize: 100,
        total: 0,
      },
      tableColumns: [],
      tableData: [],
      cacheData: [],
      query: {
        S_Type: this.type,
      },
      height: 'calc(100% - 50px)',
      tableKey: 0
    }
  },
  methods: {
    show(data, headers, query, total) {
      this.query = query
      this.$set(this.pagination, 'pageSize', query.S_PageQTY)
      this.$set(this.pagination, 'currentPage', query.S_PageIndex)
      total >= 0 && this.$set(this.pagination, 'total', total)
      this.tableColumns = headers
      this.tableData = data
      ++this.tableKey
    },
    handleSizeChange(val) {
      this.$set(this.pagination, 'pageSize', val)
      this.$set(this.pagination, 'currentPage', 1)
      //   this.tableData = this.cacheData.slice(0, val)

      this.$set(this.query, 'S_PageIndex', 1)
      this.$set(this.query, 'S_PageQTY', val)
      this.$parent.handleSearch(this.query, true, true)
    },
    handleCurrentChange(val) {
      this.$set(this.pagination, 'currentPage', val)
      //   let p = this.pagination.pageSize * (val - 1)
      //   this.tableData = this.cacheData.slice(p, p + this.pagination.pageSize)
      this.$set(this.query, 'S_PageIndex', val)

      this.$parent.handleSearch(this.query, true, true)
    },
  },
}
</script>

<style lang="scss" scoped>
.detail_table {
  height: inherit;

  //   border: 1px solid red;
  .el-pagination {
    text-align: left;
  }
}
</style>
