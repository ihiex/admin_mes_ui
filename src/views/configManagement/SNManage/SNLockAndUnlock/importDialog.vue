<template>
  <el-dialog :title="$t('Upload')" :visible.sync="dialogVisible" width="60%" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div style="margin-bottom: 5px; position: relative; height: 45px;">
      <el-input ref="SNRef" v-model="sn" :placeholder="$t('pleaseInput')" clearable
        style="width: 200px; margin-right: 10px;" :disabled="isImport" @keypress.native.enter="handleEnterSn(sn)">
      </el-input>
      <el-button :disabled="isImport" @click="handleEnterSn(sn)">{{ $t('Added') }}</el-button>

      <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="demo-ruleForm"
        style="width: 300px; display: inline-block; position: absolute; right: 0; z-index: 10;">
        <el-form-item :label="$t('LockReason')" prop="reason" :rules="[
          { required: isLock, message: $t('PleaseEnterTheLockReason'), trigger: 'blur' },
        ]">
          <el-input v-model="ruleForm.reason" style="width: 220px;" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>

    <el-table ref="multipleTable" :key="refreshKey" v-loading="loading" :data="tableData"
      :select-on-indeterminate="isSelect" style="width: 100%;" border height="500"
      @selection-change="handleSelectionChange">
      <el-table-column v-if="tableHeader.length > 0" type="selection" min-width="55">
      </el-table-column>
      <el-table-column v-for="(item, index) in tableHeader" :key="index" :prop="item" :label="item" min-width="120"
        show-overflow-tooltip>
      </el-table-column>
      <el-table-column v-if="isError" prop="status" :label="$t('Status')" width="60">
        <template slot-scope="scope">
          <i v-if="scope.row.status == false" class="el-icon-error" style="color: #f56c6c;"></i>
          <i v-if="scope.row.status == true" class="el-icon-success" style="color: #67c23a"></i>
        </template>
      </el-table-column>
    </el-table>

    <span slot="footer" class="dialog-footer">
      <el-button type="danger" style="position: absolute; left: 0;" @click="handleClearTable">{{ $t('ClearMarryList')
        }}</el-button>

      <el-switch v-model="isLock" :active-text="$t('Lock')" :inactive-text="$t('unlock')" style="margin-right: 10px;">
      </el-switch>
      <el-button @click="getTemplate">{{ $t('Template') }}</el-button>
      <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
      <div style="display: inline-block; margin:0 10px">
        <el-upload class="upload-demo" action="#" accept=".xlsx,.xls,.csv" :multiple="false" :show-file-list="false"
          :auto-upload="false" :on-change="handleChangeFile">
          <el-button size="small" :disabled="isInput">{{ $t('ImportCSVFile') }}</el-button>
        </el-upload>
      </div>
      <el-button v-loading="cLoading" element-loading-spinner="el-icon-loading" type="primary" :disabled="cLoading"
        @click="handleConfirm">{{ $t('Upload') }}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { readFile } from '@/utils/excel.js'
import {
  LockSNAsync
} from '@/api/config.js'
import { uuid } from '@/utils'

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
      isLock: true,
      isInput: false,
      sn: '',
      isImport: false,
      isError: false,
      ruleForm: {
        reason: ''
      },
      refreshKey: uuid()
    }
  },
  watch: {
    isLock: function (val, oval) {
      if (!val) {
        this.$refs.ruleForm.resetFields()
      }
    }
  },
  methods: {
    handleClearTable() {
      this.$confirm(this.$t('ClearMarryList'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.tableData = []
        this.multipleSelection = []
        this.isInput = false
        this.isImport = false;
        this.isError = false
        this.cLoading = false;

      }).catch(() => {

      });
    },
    handleEnterSn(val) {
      if (!val) return;

      if (this.tableHeader && this.tableHeader.length == 0) {
        this.tableHeader = ['SN']
      }
      let row = { SN: val }
      this.tableData.unshift(row)
      this.$refs.multipleTable.toggleRowSelection(row, true)
      this.sn = '';
      this.$refs.SNRef.focus()
      this.isInput = true
    },
    getTemplate() {
      let dom = document.createElement('a');
      dom.href = '/static/template/lock_unlock_template.xlsx';
      dom.download = 'lock_unlock_template';
      dom.click();
    },
    handleConfirm() {
      if (this.multipleSelection && this.multipleSelection.length == 0) {
        return this.$message.warning(this.$t('SelectTheBarcodeYouWantToLockOrUnlock'))
      }

      this.$confirm(this.isLock ? this.$t('Lock') : this.$t('unlock'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {

            this.cLoading = true;
            let sns = this.multipleSelection.map(res => res.SN)
            let ms = []

            LockSNAsync({ SNs: sns, isLock: this.isLock, lockMess: this.ruleForm.reason }).then(res => {
              try {
                if (res.Success) {
                  this.handleClose();
                } else {
                  this.isError = true;
                  sns.forEach(f => {
                    let item = this.tableData.find(r => r.SN === f)
                    if (item) {
                      item.status = true
                      ms.push(item)
                    }
                  })
                  let failure = res.ResData;
                  failure.forEach(f => {
                    let item = this.tableData.find(r => r.SN === f)
                    if (item) {
                      item.status = false
                    }
                  })

                  this.refreshKey = uuid();
                  this.$nextTick(function(){
                    ms.forEach(row => {
                      this.$refs.multipleTable.toggleRowSelection(row, true)
                    })
                  })
                }
                this.$emit('confirm')

              } finally {
                this.cLoading = false;
              }
            }, error => {
              this.cLoading = false;
            })

          } else {

            return false;
          }
        });

      }).catch(() => {

      });

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
        this.isImport = true;
        this.loading = false
      })
    },

    handleClose() {
      this.sn = ''
      this.tableData = []
      this.tableHeader = []
      this.multipleSelection = []
      this.isLock = true
      this.isInput = false
      this.isImport = false;
      this.isError = false
      this.cLoading = false;
      this.ruleForm.reason = ''
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
  display: inline-block;
  width: 100%;
  position: relative;

  ::v-deep {
    .el-loading-mask {
      top: unset;
      font-size: 14px;

    }
  }
}
</style>
