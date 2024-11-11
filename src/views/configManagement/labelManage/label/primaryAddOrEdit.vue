<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item :label="$t('name')" prop="Name">
          <el-input v-model="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('LabelFamily')" prop="LabelFamilyID">
          <el-select v-model="form.LabelFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in labelFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('LabelType')" prop="LabelType">
          <el-select v-model="form.LabelType" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            clearable filterable>
            <el-option v-for="item in labelTypeOptions" :key="item.ID" :label="item.LabelTypeName" :value="item.ID">
              <div class="select_option">
                <span>{{ item.LabelTypeName }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('TargetPath')">
          <el-input v-model="form.TargetPath" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('SourcePath')">
          <el-input v-model="form.SourcePath" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('OutputType')" prop="OutputType">
          <el-select v-model="form.OutputType" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in outputTypeOptions" :key="item.ID" :label="item.OutputTypeName" :value="item.ID">
              <div class="select_option">
                <span>{{ item.OutputTypeName }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PageCapacity')" prop="PageCapacity">
          <el-input v-model="form.PageCapacity" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('PrintCMD')" prop="PrintCMD">
          <el-input v-model="form.PrintCMD" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  LabelInsert,
  LabelUpdate,
  LabelClone
} from '@/api/config.js'
import {
  GetsysStatus,
  GetluLabelFamily,
  GetVLabelType,
  GetVOutputType,
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      statusOptions: [],
      labelFamilyOptions: [],
      labelTypeOptions: [],
      outputTypeOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Name: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        LabelFamilyID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        LabelType: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        OutputType: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getLabelFamily()
      this.getLabelType()
      this.getOutputType()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (item[key]) {
            this.$set(this.form, key, isNaN(item[key]) ? item[key] : parseInt(item[key]))
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
          for (let key in this.form) {
            this.$set(params, key, this.form[key] + '');
          }
          this.loading = true
          if (this.flag === 'Edit') {
            LabelUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            LabelInsert(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            LabelClone(params).then(res => {
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
    getLabelFamily() {
      GetluLabelFamily().then(res => {
        if (res.Success) {
          this.labelFamilyOptions = [...res.ResData]
        }
      })
    },
    getLabelType() {
      GetVLabelType().then(res => {
        if (res.Success) {
          this.labelTypeOptions = [...res.ResData]
        }
      })
    },
    getOutputType() {
      GetVOutputType().then(res => {
        if (res.Success) {
          this.outputTypeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
