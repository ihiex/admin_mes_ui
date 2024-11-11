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
        <el-form-item :label="$t('PathType')" prop="RouteType">
          <el-select v-model="form.RouteType" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in pathOptions" :key="item.value" :label="item.label" :value="item.value">
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
  WorkflowNameInsert,
  WorkflowNameUpdate,
  WorkflowNameClone
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "Name": "",
        "Description": "",
        "XMLRoute": "",
        "XMLRouteV2": "",
        "RouteType": ""
      },
      SNFamilyOptions: [],
      pathOptions: [
        {
          value: '0',
          label: 'TableRoute'
        },
        {
          value: '1',
          label: 'DiagramRoute'
        }
      ],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Name: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        RouteType: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
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
          /*  let params = {}
           Object.keys(this.form).forEach(key => {
             this.$set(params, key, this.form[key] + '')
           }) */
          this.loading = true
          if (this.flag === 'Edit') {
            WorkflowNameUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            WorkflowNameInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkflowNameClone(this.form).then(res => {
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
