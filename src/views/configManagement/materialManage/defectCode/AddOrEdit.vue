<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

        <el-form-item :label="$t('DefectType')" prop="DefectTypeID">
          <el-select v-model="form.DefectTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in DefectTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('DefectCode')" prop="DefectCode">
          <el-input v-model="form.DefectCode" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('status')" prop="Status">
          <el-select v-model="form.Status" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
            </el-option>
          </el-select>
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
  DefectCodeInsertAsync,
  DefectCodeUpdateAsync,
  // MesLineClone,
  DefectTypeFindWithAllPagerAsync
} from '@/api/config.js'
import { GetsysStatus } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      statusOptions: [],
      DefectTypeOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        DefectCode: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Status: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        DefectTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getStatus()
      this.getDefectType()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
          // this.$set(this.form, key, item[key] + '')
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            DefectCodeUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            DefectCodeInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } /* else {
            MesLineClone(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } */
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.form = {}
      this.dialogVisible = false
    },
    getStatus() {
      GetsysStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
        }
      })
    },
    getDefectType() {
      DefectTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.DefectTypeOptions = [...res.ResData]
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
