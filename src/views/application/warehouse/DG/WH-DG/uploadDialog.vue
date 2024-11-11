<template>
  <el-dialog :title="$t('import')" :visible.sync="dialogVisible" width="90%" :close-on-click-modal="false"
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
      <el-button @click="getTemplate">{{ $t('Template') }}</el-button>
      <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
      <div style="display: inline-block; margin:0 10px">
        <el-upload class="upload-demo" action="#" accept=".xlsx,.xls" :multiple="false" :show-file-list="false"
          :auto-upload="false" :on-change="handleChangeFile">
          <el-button size="small">{{ $t('importExcel') }}</el-button>
        </el-upload>
      </div>
      <el-button @click="handleChecked">{{ $t('inspection') }}</el-button>
      <el-button v-loading="cLoading" element-loading-spinner="el-icon-loading" type="primary" :disabled="cLoading"
        @click="handleConfirm">{{ $t('confirm') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { readFile } from '@/utils/excel.js'
import { DG_ImportCheck, DG_ImportEnter } from '@/api/application.js'
export default {
  name: 'UploadDialog',
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      tableHeader: [],
      multipleSelection: [],
      loading: false,
      isSelect: false,
      cLoading: false
    }
  },
  methods: {
    getTemplate() {
      let dom = document.createElement('a');
      dom.href = '/static/template/shippingDataTemplate.xls';
      dom.download = 'ShippingDataTemplate';
      dom.click();
    },
    handleConfirm() {
      this.cLoading = true
      DG_ImportEnter(JSON.parse(JSON.stringify(this.multipleSelection))).then(res => {
        try {
          if (res.Success) {
            this.$emit('confirm', this.multipleSelection)
            this.$message({
              type: 'success',
              message: res.ResultMsg
            })
            this.handleClose()
          }else{
            this.$message.error(res.ResultMsg);
          }

        } catch (error) {
          this.$message.error(error.toString());
        } finally {
          this.cLoading = false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleChecked() {
      this.loading = true
      DG_ImportCheck(JSON.parse(JSON.stringify(this.multipleSelection))).then(res => {
        this.tableData = []
        this.tableHeader = []
        this.multipleSelection = []
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.tableHeader = Object.keys(data.WH_ExcelDT[0])
            let index = this.tableHeader.findIndex(r => r === 'import')
            if (index > -1) {
              this.tableHeader.splice(index, 1)
            }
            this.$nextTick(function () {
              this.tableData = [...data.WH_ExcelDT]
              this.$nextTick(function () {
                this.tableData.forEach(row => {
                  this.$refs.multipleTable.toggleRowSelection(row, row.import)
                })
              })
            })
          }
        } catch (error) {
          this.$message.error(error.toString());
        }
        finally {
          this.loading = false
        }
      })
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
