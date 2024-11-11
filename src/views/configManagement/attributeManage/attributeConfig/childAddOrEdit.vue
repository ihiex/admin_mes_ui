<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('attributeName')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  AttributeInsertAsync,
  AttributeUpdateAsync,
  AttributeCloneAsync,
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      title: '',
      loading: false,
      rules: {
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
      },
      flag: ''
    }
  },

  methods: {
    show(title, item, flag) {
      this.title = title
      this.flag = flag
      if (JSON.stringify(item) !== '{}') {
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
          let params = { TableName: this.form.TableName, Description: this.form.Description, ID: this.form.ID }
          switch (this.flag) {
            case 'Add':
              AttributeInsertAsync(params).then(res => {
                if (res.Success) {
                  this.$emit('confirm', this.flag)
                  this.handleClose()
                }
                this.loading = false
              }, error => {
                this.loading = false

              })
              break;
            case 'Edit':
              AttributeUpdateAsync(params).then(res => {
                if (res.Success) {
                  this.$emit('confirm', this.flag)
                  this.handleClose()
                }
                this.loading = false
              }, error => {
                this.loading = false

              })
              break;

            default:
              AttributeCloneAsync(params).then(res => {
                if (res.Success) {
                  this.$emit('confirm', this.flag)
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
