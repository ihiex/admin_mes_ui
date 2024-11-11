<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="160px">
        <el-form-item :label="$t('ProjectNO')" prop="FProjectNO">
          <el-input v-model.trim="form.FProjectNO"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CountByPallet')" prop="FCountByPallet">
          <el-input v-model="form.FCountByPallet" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('CountByCase')" prop="FCountByCase">
          <el-input v-model="form.FCountByCase" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByCase')" prop="FWeightByCase">
          <el-input v-model="form.FWeightByCase" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByPallet')" prop="FWeightByPallet">
          <el-input v-model="form.FWeightByPallet" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('TotalWeight')" prop="FTotalWeight">
          <el-input v-model="form.FTotalWeight" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByEmptyPallet')" prop="FWeightByEmptyPallet">
          <el-input v-model="form.FWeightByEmptyPallet" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('WeightByPiece')" prop="FWeightByPiece">
          <el-input v-model="form.FWeightByPiece" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('TypeID')" prop="TypeID">
          <el-input v-model="form.TypeID" type="number"></el-input>
        </el-form-item>
        <el-form-item :label="$t('IsMixedPO')" prop="IsMixedPO">
          <el-switch v-model="form.IsMixedPO" active-text="Yes" inactive-text="No">
          </el-switch>
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

import { DGProjectBaseNewUpdate, DGProjectBaseNewInsert } from '@/api/application.js'

export default {
  data() {
    var handleValidate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('canNotBeEmpty')));
      } else if (isNaN(value)) {
        callback(new Error(this.$t('InvalidInteger')));
      } else {
        callback();
      }
    };
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
          { required: true, pattern: /^-?\d+(\.\d+)?(e[+-]?\d+)?$/, message: this.$t('InvalidInteger'), trigger: 'blur' },
          /*  { required: true, pattern: /^(([0-9]+.[0-9][1-9][0-9])|([0-9][1-9][0-9].[0-9]+)|([0-9][1-9][0-9]))$/, message: this.$t('InvalidInteger'), trigger: 'blur' },
            { required: true, pattern: /^((-\d+(.\d+)?)|(0+(.0+)?))$/, message: this.$t('InvalidInteger'), trigger: 'blur' },
            { required: true, pattern:  /^(-(([0-9]+.[0-9][1-9][0-9])|([0-9][1-9][0-9].[0-9]+)|([0-9][1-9][0-9])))$/, message: this.$t('InvalidInteger'), trigger: 'blur' },
            { required: true, pattern:  /^(-?\d+)(.\d+)?$/, message: this.$t('InvalidInteger'), trigger: 'blur' },
            { required: true, pattern:  /^\d+(.\d+)?$/, message: this.$t('InvalidInteger'), trigger: 'blur' }, */
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FCountByCase: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FWeightByCase: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FWeightByPallet: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FTotalWeight: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FWeightByEmptyPallet: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        FWeightByPiece: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        TypeID: [
          { required: true, validator: handleValidate, trigger: 'blur' }
        ],
        IsMixedPO: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'IsMixedPO') {
            this.$set(this.form, key, item[key] ? true : false)
          } else {
            this.$set(this.form, key, item[key])
          }
        })
      } else {
        this.$set(this.form, 'IsMixedPO', false)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            DGProjectBaseNewUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            DGProjectBaseNewInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Clone') {
            DGProjectBaseNewInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              } else {
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
