<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-table :data="tableData" style="width: 100%" height="500" highlight-current-row border
        @current-change="handleCurrentChange">
        <el-table-column prop="ID" label="ID" width="80">
        </el-table-column>
        <el-table-column prop="RouteID" label="RouteID" width="80">
        </el-table-column>
        <el-table-column prop="Employee" label="Employee" min-width="80">
        </el-table-column>
        <el-table-column prop="CreateDate" label="CreateDate" min-width="150">
        </el-table-column>
      </el-table>
      <div style="text-align: right;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirm()">{{ $t('confirm') }}</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  GetMesRouteHistory
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      title: '',
      loading: false,
      item: {}
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.item = val
    },
    show(title, id) {
      this.title = title
      this.tableData = []
      this.dialogVisible = true
      this.loading = true;
      this.item = {}
      GetMesRouteHistory({ RouteId: id }).then(res => {
        if (res.Success) {
          this.tableData = res.ResData
        }
        this.loading = false;
      }, error => {
        this.loading = false;
      }).catch(error => {
        this.loading = false;
      })
    },
    confirm() {
      if (this.item && JSON.stringify(this.item) === '{}') {
        this.$message({
          message: this.$t('SelectDataItemToReset'),
          type: 'warning'
        })
        return;
      }
      this.$emit('confirm', this.item, this.title)
      this.handleClose()
    },
    handleClose() {
      this.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
