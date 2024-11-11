<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item :label="$t('name')" prop="Name">
          <el-input v-model.trim="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model.trim="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('Definition')" prop="Definition">
          <el-input v-model.trim="form.Definition" :placeholder="$t('pleaseInput')" readonly
            @focus="handleFocus"></el-input>
        </el-form-item>
      </el-form>
      <div style="text-align: right;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">{{ $t('cancel') }}</el-button>
          <el-button type="primary" @click="confirm('form')">{{ $t('confirm') }}</el-button>
        </span>
      </div>
    </div>
    <LabelDialog ref="LabelDialog" @confirm="handleLabelDialog"></LabelDialog>
  </el-dialog>
</template>

<script>
import {
  LabelFieldDefinitionInsert,
  LabelFieldDefinitionUpdate,
  LabelFieldDefinitionClone
} from '@/api/config.js'
import {
  GetVModuleName,
  GetVFunctionName,
  GetDBField
} from "@/api/configCommon.js"
import LabelDialog from './common/labelDialog.vue'

export default {
  components: {
    LabelDialog
  },
  data() {
    return {
      dialogVisible: false,
      form: {
      },
      title: '',
      loading: false,
      flag: '',
      rules: {
        Name: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Definition: [
          { required: true, message: this.$t('pleaseSelect'), trigger: ['blur', 'change'] }
        ]
      },
      moduleOptions: [],
      functionOptions: [],
      fieldOptions: [],
    }
  },
  methods: {
    handleLabelDialog(val) {
      this.$set(this.form, 'Definition', val)
    },
    handleFocus() {
      this.$refs.LabelDialog.show(this.form.Definition ? this.form.Definition : '')
    },
    show(title, flag, item) {
      this.getModuleOptions();
      this.getFunctionOptions();
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
          let params = JSON.parse(JSON.stringify(this.form))
          Object.keys(params).forEach(key => {
            params[key] = params[key] + ''
          })
          this.loading = true
          if (this.flag === 'Edit') {
            LabelFieldDefinitionUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            LabelFieldDefinitionInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            LabelFieldDefinitionClone(params).then(res => {
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
    getModuleOptions() {
      GetVModuleName().then(res => {
        if (res.Success) {
          this.moduleOptions = [...res.ResData];
        }
      })
    },
    getFunctionOptions() {
      GetVFunctionName().then(res => {
        if (res.Success) {
          this.functionOptions = [...res.ResData];
        }
      })
    },
    getFieldOptions(id) {
      GetDBField({ S_Type: id }).then(res => {
        if (res.Success) {
          this.fieldOptions = [...res.ResData];
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
