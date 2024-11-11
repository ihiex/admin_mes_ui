<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="300" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('StartDateTime')" prop="StartTime">
          <el-time-picker v-model="form.StartTime" :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }" :placeholder="$t('pleaseSelect')" value-format="HH:mm:ss" style="width: 100%">
          </el-time-picker>
        </el-form-item>
        <el-form-item :label="$t('EndDateTime')" prop="EndTime">
          <el-time-picker v-model="form.EndTime" :picker-options="{
            selectableRange: '00:00:00 - 23:59:59'
          }" :placeholder="$t('pleaseSelect')" value-format="HH:mm:ss" style="width: 100%">
          </el-time-picker>
        </el-form-item>
        <el-form-item :label="$t('status')" prop="State">
          <el-select v-model="form.State" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            clearable filterable>
            <el-option v-for="item in stateOptions" :key="item.Id" :label="item.ItemName" :value="item.ItemCode">
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
  ShiftDetailInsert,
  ShiftDetailUpdate,
} from '@/api/config.js'
import { GetDictDataDetail } from '@/api/common'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        State: '1',
        StartTime: '',
        EndTime: '' //new Date().format('hh:00:00')
      },
      title: '',
      loading: false,
      rules: {
        StartTime: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        EndTime: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        State: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ]
      },
      stateOptions: [],
    }
  },
  methods: {
    show(title, item, id) {
      // debugger
      this.getState()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          if (key == 'State') {
            this.$set(this.form, key, item[key] ? '1' : '0')
          } else {
            this.$set(this.form, key, item[key])
          }
          // this.$set(this.form, key, item[key] + '')
        })
      } else if (id) {
        this.$set(this.form, 'ShiftCodeID', id)
      }

      // this.form.State = this.form.State == 1 ? '1' : '0';

      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form));
          /*  for (let key in this.form) {
             if (this.form[key]) {
               this.$set(params, key, this.form[key] + '');
             } else {
               this.$set(params, key, this.form[key]);
             }
           } */
          this.loading = true
          if (this.form.ID) {
            ShiftDetailUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            ShiftDetailInsert(params).then(res => {
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
    getState() {
      GetDictDataDetail({ S_EnCode: 'ShiftStateItem' }).then(res => {
        if (res.Success) {
          this.stateOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
