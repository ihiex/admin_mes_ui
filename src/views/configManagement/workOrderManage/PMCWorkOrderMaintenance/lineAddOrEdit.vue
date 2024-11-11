<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('Line')" prop="LineID">
          <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            clearable filterable>
            <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('quantityAllotted')" prop="LineQuantity">
          <el-input v-model="form.LineQuantity" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirm('form')">{{ $t('confirm') }}</el-button>
        </span>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {
  WorkOrderMaintenanceLineInsertAsync,
  WorkOrderMaintenanceLineUpdateAsync
} from '@/api/config.js'
import { GetmesLine } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      lineOptions: [],
      title: '',
      loading: false,
      rules: {
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        LineID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    show(title, item, id) {
      this.getLineOptions()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
        !this.form.IsCheckList && this.$set(this.form, 'IsCheckList', false)
      } else if (id) {
        this.$set(this.form, 'ProductionOrderID', id)
        this.$set(this.form, 'CreationTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            WorkOrderMaintenanceLineUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkOrderMaintenanceLineInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          }
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.form = {}
      this.dialogVisible = false
    },
    getLineOptions() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
