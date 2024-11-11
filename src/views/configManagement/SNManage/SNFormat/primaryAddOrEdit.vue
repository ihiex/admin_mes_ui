<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item :label="$t('name')" prop="Name">
          <el-input v-model="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('SNFamily')" prop="SNFamilyID">
          <el-select v-model="form.SNFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in SNFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Format')">
          <el-input v-model="form.Format" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  SNFormatInsert,
  SNFormatUpdate,
  SNFormatClone
} from '@/api/config.js'
import { GetluSNFamily } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "Name": "",
        "Description": "",
        "SNFamilyID": "",
        "Format": ""
      },
      SNFamilyOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Name: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        SNFamilyID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
    }
  },
  methods: {
    show(title, flag, item) {
      this.getSNFamily()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'SNFamilyID') {
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
          let params = {}
          Object.keys(this.form).forEach(key => {
            this.$set(params, key, this.form[key] + '')
          })
          this.loading = true
          if (this.flag === 'Edit') {
            SNFormatUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            SNFormatInsert(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            SNFormatClone(params).then(res => {
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
    getSNFamily() {
      GetluSNFamily().then(res => {
        if (res.Success) {
          this.SNFamilyOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
