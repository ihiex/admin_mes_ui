<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="130px">
        <el-form-item :label="$t('lineGroupName')" prop="lineGroup">
          <el-select v-model="form.lineGroup" :placeholder="$t('pleaseSelect')" value-key="ID" style="width: 100%;"
            filterable clearable>
            <el-option v-for="item in lineGroupOptions" :key="item.ID" :label="item.Name" :value="item">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Line')" prop="LineID">
          <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable clearable>
            <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('LineNumber')" prop="LineNumber">
          <el-input v-model.number="form.LineNumber" type="Number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('partGroupName')" prop="PartFamilyTypeID">
          <el-select v-model="form.PartFamilyTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" filterable
            clearable>
            <el-option v-for="item in partFamilyTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
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
  MesLineGroupInsert,
  MesLineGroupUpdate,
  MesLineGroupClone
} from '@/api/config.js'
import { GetluPartFamilyType, GetmesLine, GetLineGroupName } from '@/api/configCommon.js'

export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error(this.$t('pleaseEnterNumberValue')));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      form: {
        lineGroup: {}
      },
      title: '',
      loading: false,
      flag: '',
      rules: {
        LineNumber: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        lineGroup: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        LineID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartFamilyTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
      lineOptions: [],
      partFamilyTypeOptions: [],
      lineGroupOptions: [],
    }
  },
  methods: {
    show(title, flag, item) {
      this.getLine();
      this.getLineGroup();
      this.getPartFamilyType();
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          if (key === 'ID') {
            this.$set(this.form, 'Id', item[key])
          } else {
            this.$set(this.form, key, isNaN(item[key]) ? item[key] : parseInt(item[key]))
            // this.$set(this.form, key, item[key])
          }
        })
        this.$set(this.form, 'lineGroup', {
          ID: item.LineType,
          Name: item.LineGroupName
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$set(this.form, 'LineGroupName', this.form.lineGroup ? this.form.lineGroup.Name : '')
      this.$set(this.form, 'LineType', this.form.lineGroup ? this.form.lineGroup.ID : '')

      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.form))
          Object.keys(params).forEach(key => {
            params[key] = params[key] + ''
          })
          this.loading = true
          if (this.flag === 'Edit') {
            MesLineGroupUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            MesLineGroupInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            MesLineGroupClone(params).then(res => {
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

    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
        }
      })
    },
    getLineGroup() {
      GetLineGroupName().then(res => {
        if (res.Success) {
          this.lineGroupOptions = [...res.ResData]
        }
      })
    },
    getPartFamilyType() {
      GetluPartFamilyType().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
