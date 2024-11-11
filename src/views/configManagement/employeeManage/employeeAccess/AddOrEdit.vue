<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item :label="$t('compellation')" prop="EmployeeID">
          <el-select v-model="form.EmployeeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in employeeOptions" :key="item.ID" :label="item.Employee" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Employee }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('StationType')" prop="StationTypeID">
          <el-select v-model="form.StationTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in stationTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('status')" prop="Status">
          <el-select v-model="form.Status" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
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
  EmployeeInsert,
  EmployeeUpdate,
  EmployeeClone
} from '@/api/config.js'
import {
  GetmesStationType,
  GetEmployee,
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "StationTypeID": "",
        "EmployeeID": "",
        "Status": ""
      },
      title: '',
      loading: false,
      flag: '',
      employeeOptions: [],
      stationTypeOptions: [],
      statusOptions: [
        {
          value: '1',
          label: 'true',
        },
        {
          value: '0',
          label: 'false'
        }
      ],
      rules: {
        EmployeeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        StationTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        Status: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getStationType();
      this.getEmployee();
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
          this.loading = true
          if (this.flag === 'Edit') {
            EmployeeUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            EmployeeInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            EmployeeClone(this.form).then(res => {
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
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
          this.stationTypeOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getEmployee() {
      GetEmployee().then(res => {
        if (res.Success) {
          this.employeeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
