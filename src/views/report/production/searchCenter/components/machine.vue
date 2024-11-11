<template>
  <div v-loading="loading" class="page_container">
    <el-table
      :data="tableData"
      style="width: 100%"
      size="mini"
      stripe
      :fit="true"
      height="100%"
      border
    >
      <el-table-column
        v-for="item in TableHead"
        :key="item"
        :prop="item"
        :label="item"
        :min-width="item == 'ID' ? '90' : '180'"
        :show-overflow-tooltip="true"
        sortable
      ></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'Machine',
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
      title: 'Machine',
      TableHead: [],
      tableData: [],
    }
  },
  methods: {
    show(data) {
      this.tableData = []
      this.TableHead =
        data[0] && data[0].length > 0 ? Object.keys(data[0][0]) : []
      this.$nextTick(function () {
        this.tableData = data[0] ? data[0] : []
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.page_centaier {
}
</style>
