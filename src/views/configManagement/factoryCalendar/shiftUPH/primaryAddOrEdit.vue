<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('type')" prop="ShiftType">
          <el-select v-model="form.ShiftType" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in shiftTypeOptions" :key="item.Id" :label="item.ItemName" :value="item.ItemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('code')" prop="ShiftCode">
          <el-input v-model="form.ShiftCode" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('status')" prop="State">
          <el-select v-model="form.State" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            clearable filterable>
            <el-option v-for="item in stateOptions" :key="item.Id" :label="item.ItemName" :value="item.ItemCode">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="ShiftDesc">
          <el-input v-model="form.ShiftDesc" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  ShiftInsert,
  ShiftUpdate,
  ShiftClone
} from '@/api/config.js'

import { GetDictDataDetail } from '@/api/common'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ShiftType": "",
        "ShiftCode": "",
        "ShiftDesc": "",
        "State": '1'
      },
      title: '',
      loading: false,
      flag: '',
      rules: {
        ShiftCode: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        ShiftType: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        State: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        /*  ShiftDesc: [
           { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
         ], */
      },
      stateOptions: [],
      shiftTypeOptions: [],
    }
  },
  methods: {
    show(title, flag, item) {
      this.getShiftType()
      this.getState()

      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          /*   if (item[key]) {
              this.$set(this.form, key, isNaN(item[key]) ? item[key] : parseInt(item[key]))
            } else {
              this.$set(this.form, key, item[key])
            } */
          if (key == 'State') {
            this.$set(this.form, key, item[key] + '')
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
          // this.form.State = true
          for (let key in this.form) {
            this.$set(params, key, this.form[key] + '');
          }
          this.loading = true
          if (this.flag === 'Edit') {
            ShiftUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            ShiftInsert(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            ShiftClone(params).then(res => {
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
    getState() {
      GetDictDataDetail({ S_EnCode: 'ShiftStateItem' }).then(res => {
        if (res.Success) {
          this.stateOptions = [...res.ResData]
        }
      })
    },

    getShiftType() {
      GetDictDataDetail({ S_EnCode: 'ShiftTypeItem' }).then(res => {
        if (res.Success) {
          this.shiftTypeOptions = [...res.ResData]
        }
      })
    },

  },
}
</script>

<style lang="scss" scoped></style>
