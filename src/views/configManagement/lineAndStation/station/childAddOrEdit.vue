<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('attributeName')" prop="DetailName">
          <el-input v-model="form.DetailName" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('attributeValue')" prop="DetailValue">
          <el-input v-model="form.DetailValue" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="DetailDescription">
          <el-input v-model="form.DetailDescription" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  MesStationInsertDetail,
  MesStationUpdateDetail,
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      title: '',
      loading: false,
      rules: {
        DetailName: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        DetailValue: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        DetailDescription: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    show(title, item, id) {
      this.title = title
      if (item && JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else if (id) {
        this.$set(this.form, 'ParentId', id)
        this.$set(this.form, 'StationID', id)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            MesStationUpdateDetail(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else {
            MesStationInsertDetail({ ParentId: this.form.ParentId }, this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                // this.handleClose()
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
