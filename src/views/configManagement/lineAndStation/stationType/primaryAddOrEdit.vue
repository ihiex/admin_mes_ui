<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item :label="$t('ApplicationType')" prop="ApplicationTypeID">
          <el-select v-model="form.ApplicationTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in appOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
  MesStationTypeInsert,
  MesStationTypeUpdate,
  MesStationTypeClone
} from '@/api/config.js'
import { GetluApplicationType } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        ID: ''
      },
      appOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        ApplicationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
    this.getApplicationType()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'ApplicationTypeID') {
            this.$set(this.form, key, parseInt(item[key]))
          } else {
            this.$set(this.form, key, item[key])
          }
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          Object.keys(this.form).forEach(key => {
            params[key] = this.form[key] + '';
          })
          this.loading = true
          if (this.flag === 'Edit') {
            MesStationTypeUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            MesStationTypeInsert(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else {
            MesStationTypeClone(params).then(res => {
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
    getApplicationType() {
      GetluApplicationType().then(res => {
        if (res.Success) {
          this.appOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
