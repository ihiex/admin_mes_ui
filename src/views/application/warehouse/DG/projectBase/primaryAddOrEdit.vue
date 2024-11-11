<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('ProjectNO')" prop="FProjectNO">
          <el-input v-model.trim="form.FProjectNO"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CountByPallet')" prop="FCountByPallet">
          <el-input v-model.number="form.FCountByPallet" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CountByCase')" prop="FCountByCase">
          <el-input v-model.number="form.FCountByCase" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByCase')" prop="FWeightByCase">
          <el-input v-model.number="form.FWeightByCase" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByPallet')" prop="FWeightByPallet">
          <el-input v-model.number="form.FWeightByPallet" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('TotalWeight')" prop="FTotalWeight">
          <el-input v-model.number="form.FTotalWeight" type="number"></el-input>
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

import { DGProjectBaseUpdate, DGProjectBaseInsert } from '@/api/application.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      title: '',
      loading: false,
      flag: '',
      rules: {
        FProjectNO: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        FCountByPallet: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        FCountByCase: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        FWeightByCase: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        FWeightByPallet: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        FTotalWeight: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            DGProjectBaseUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            DGProjectBaseInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Clone') {
            DGProjectBaseInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }else{
                this.$message.error(res.ResultMsg)
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
  },
}
</script>

<style lang="scss" scoped></style>
