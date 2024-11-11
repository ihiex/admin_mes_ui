<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">

        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('ParentValueID')" prop="ParentValueID">
          <!-- <el-input v-model="form.ParentValueID" :placeholder="$t('pleaseInput')" clearable></el-input> -->
          <el-select v-model="form.ParentValueID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in parentOptions" :key="item.ID" :label="item.Description" :value="item.ParentValueID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('ParentCheckID')" prop="ParentCheckID">
          <!-- <el-input v-model="form.ParentCheckID" :placeholder="$t('pleaseInput')" clearable></el-input> -->
          <el-select v-model="form.ParentCheckID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable>
            <el-option v-for="item in parentOptions" :key="item.ID" :label="item.Description" :value="item.ParentCheckID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('ValueType')" prop="ValueType">
          <el-input v-model.number="form.ValueType" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('CheckType')" prop="CheckType">
          <!-- <el-input v-model="form.CheckType" :placeholder="$t('pleaseInput')" clearable></el-input> -->
          <el-select v-model="form.CheckType" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in checkTypeOptions" :key="item.Key" :label="item.Value" :value="item.Key">
              <div class="select_option">
                <span>{{ item.Value }}</span>
                <span>{{ item.Key }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Parameters')" prop="Parameters">
          <el-input v-model="form.Parameters" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>

        <el-form-item :label="$t('Required')" prop="Required">
          <el-select v-model="form.Required" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in requiredOptions" :key="item.value" :label="item.label" :value="item.value">
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
  WorkOrderAttributeInsertAsync,
  WorkOrderAttributeUpdateAsync,
  WorkOrderAttributeFindWithAllPagerAsync,
  GetCheckType
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      requiredOptions: [
        {
          value: true,
          label: 'True'
        },
        {
          value: false,
          label: 'False'
        }
      ],
      parentOptions: [],
      checkTypeOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    getParentData() {
      WorkOrderAttributeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.parentOptions = [...res.ResData]
        }
      })
    },
    getCheckType() {
      GetCheckType().then(res => {
        if (res.Success) {
          this.checkTypeOptions = [...res.ResData]
        }
      })

    },
    show(title, flag, item) {
      this.getParentData()
      this.getCheckType()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'ParentValueID' || key === 'ParentCheckID') {
            if (item[key] === 0 || item[key] === null) {
              this.$set(this.form, key, '')
            }
          } else {
            this.$set(this.form, key, item[key])
          }
        })
      } else {
        this.$set(this.form, "CreationTime", new Date().format('yyyy-MM-dd hh:mm:ss'))
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            WorkOrderAttributeUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            WorkOrderAttributeInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } /* else {
            WorkOrderMaintenanceCloneAsync(this.form).then(res => {
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
    }
  },
}
</script>

<style lang="scss" scoped></style>
