<template>
  <el-dialog :title="'上传'" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <el-table ref="multipleTable" v-loading="loading" :data="tableData" :select-on-indeterminate="isSelect"
      style="width: 100%;" border height="500" @selection-change="handleSelectionChange">
      <el-table-column v-if="tableHeader.length > 0" type="selection" min-width="55">
      </el-table-column>
      <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item" :label="item" min-width="120"
        show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-switch v-model="isLock" active-text="锁定" inactive-text="解锁" style="margin-right: 10px;">
      </el-switch>
      <el-button @click="getTemplate">{{ $t('Template') }}</el-button>
      <el-button @click="dialogVisible = false">{{ $t('cancel') }}</el-button>
      <div style="display: inline-block; margin:0 10px">
        <el-upload class="upload-demo" action="#" accept=".xlsx,.xls,.csv" :multiple="false" :show-file-list="false"
          :auto-upload="false" :on-change="handleChangeFile">
          <el-button size="small">导入csv文件</el-button>
        </el-upload>
      </div>
      <el-button v-loading="cLoading" element-loading-spinner="el-icon-loading" type="primary" :disabled="cLoading"
        @click="handleConfirm">上传</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { readFile } from '@/utils/excel.js'
export default {
  name: 'ImportDialog',
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      tableHeader: [],
      multipleSelection: [],
      loading: false,
      isSelect: false,
      cLoading: false,
      isLock: true
    }
  },
  methods: {
    getTemplate() {
      this.$message("待添加模板")
    },
    handleConfirm() {
      console.log({isLock: this.isLock, SNs: this.multipleSelection.map(res=>res.SN)})

    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChangeFile(file, fileList) {
      this.loading = true
      readFile(file.raw, ['Ship date'], '/').then(res => {
        let data = {};
        Object.keys(res).forEach(key => {
          data[key] = [];
          res[key].forEach(item => {
            let obj = {}
            Object.keys(item).forEach(k => {
              obj[k.replace(/'|#|\s/g, '_')] = item[k]// + ''
            })
            data[key].push(JSON.parse(JSON.stringify(obj)))
          })
        })
        let arr = data[Object.keys(data)[0]];
        this.tableHeader = Object.keys(arr[0])
        this.$nextTick(function () {
          this.tableData = [...arr]

          this.$nextTick(function () {
            this.tableData.forEach(row => {
              this.$refs.multipleTable.toggleRowSelection(row, true)
            })
          })

        })
        this.loading = false
      })
    },

    handleClose() {
      this.tableData = []
      this.tableHeader = []
      this.multipleSelection = []
      this.dialogVisible = false
    },
    show() {
      this.dialogVisible = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog-footer {

  ::v-deep {
    .el-loading-mask {
      top: unset;
      font-size: 14px;

    }
  }
}
</style>
