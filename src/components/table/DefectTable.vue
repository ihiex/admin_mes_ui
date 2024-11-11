<template>
  <div class="common_table">
    <div class="table_title">{{ title }}</div>
    <div class="table">
      <el-table
        :data="tableData"
        style="width: 100%"
        height="inherit"
        border
        stripe
        size="mini"
      >
        <el-table-column
          v-if="tableColumns.length > 0"
          type="index"
          label="Item"
          width="50"
        ></el-table-column>
        <el-table-column
          v-for="item in tableColumns"
          :key="item"
          :prop="item"
          :label="item"
          :show-overflow-tooltip="true"
          :min-width="item == 'DefectCodeDesc' ? '200' : '100'"
        >
          <template slot-scope="scope">
            {{ scope.row[item] | AddPerCent }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DefectTable',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      tableColumns: [],
      tableData: [],
    }
  },
  methods: {
    show(tData, tHead) {
      tHead.splice(
        tHead.findIndex((res) => res == 'ID'),
        1
      )
      this.tableColumns = tHead
      this.tableData = tData
    },
  },
}
</script>

<style lang="scss" scoped>
.common_table {
  height: inherit;
  box-sizing: border-box;
  overflow: hidden;
  padding: 0 10px;
  .table_title {
    font-size: 1rem;
    font-weight: 600;
    color: #222;
  }
  .table {
    height: calc(100% - 0.7rem);
  }
}
</style>