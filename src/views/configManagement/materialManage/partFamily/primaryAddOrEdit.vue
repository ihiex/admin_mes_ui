<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('PartFamilyType')" prop="PartFamilyTypeID">
          <el-select v-model="form.PartFamilyTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in partFamilyTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('name')" prop="Name">
          <el-input v-model="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  PartFamilyInsertAsync,
  PartFamilyUpdateAsync,
  PartFamilyCloneAsync,
  PartFamilyTypeFindWithAllPagerAsync
} from '@/api/config.js'
import { GetsysStatus } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      statusOptions: [],
      partFamilyTypeOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        PartFamilyTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        Name: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Status: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getStatus()
      this.getPartFamilyTypeOptions()
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
            PartFamilyUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            PartFamilyInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            PartFamilyCloneAsync(this.form).then(res => {
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
    getStatus() {
      GetsysStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
        }
      })
    },
    getPartFamilyTypeOptions() {
      PartFamilyTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
