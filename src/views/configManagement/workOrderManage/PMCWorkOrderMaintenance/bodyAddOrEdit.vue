<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <el-form-item :label="$t('PartFamilyType')" prop="PartFamilyTypeID">
          <el-select v-model="form.PartFamilyTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable @change="handlePartFamilyTypeChange">
            <el-option v-for="item in partFamilyTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartFamily')" prop="PartFamilyID">
          <el-select v-model="form.PartFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable
            filterable @change="handlePartFamilyChange">
            <el-option v-for="item in partFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('WorkOrderNumber')" prop="ProductionOrderNumber">
          <el-input v-model="form.ProductionOrderNumber" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('WorkOrderQty')" prop="OrderQuantity">
          <el-input v-model="form.OrderQuantity" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="isAdd" :label="$t('lineType')" prop="LineType">
          <el-select v-model="form.LineType" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable
            @change="handleLineTypeChange">
            <el-option v-for="item in lineTypeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="isAdd" :label="$t('Line')" prop="LineID">
          <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :reserve-keyword="true"
            :collapse-tags="true" multiple clearable filterable>
            <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
  PMCWorkOrderMaintenanceInsertAsync,
  WorkOrderMaintenanceUpdateAsync,
  WorkOrderMaintenanceCloneAsync,
  PartFamilyTypeFindWithAllPagerAsync,
  GetPartFamilyByParentId,
  GetPartByParentId
} from '@/api/config.js'
import {
  GetmesLinePMC, // {LineTypeID, PartFamilyID}
  GetLineTypePMC
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        LineID: []
      },
      lineTypeOptions: [],
      lineOptions: [],
      partFamilyTypeOptions: [],
      partFamilyOptions: [],
      partOptions: [],
      title: '',
      loading: false,
      flag: '',
      isAdd: true,
      rules: {
        PartFamilyTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartFamilyID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        OrderQuantity: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        ProductionOrderNumber: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        /*  Description: [
           { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
         ], */
        LineType: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getLineTypeOption()
      this.getParFamilyTypeOptions()
      this.title = title
      this.flag = flag
      this.isAdd = false;
      if (flag === 'Add') {
        this.isAdd = true;
      }
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
        this.getParFamilyOptions(this.form.PartFamilyTypeID)
        this.getParOptions(this.form.PartFamilyID)
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
            WorkOrderMaintenanceUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            PMCWorkOrderMaintenanceInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkOrderMaintenanceCloneAsync(this.form).then(res => {
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
    handlePartFamilyTypeChange(val) {
      this.partFamilyOptions = []
      this.partOptions = []
      this.$set(this.form, 'PartFamilyID', '')
      this.$set(this.form, 'PartID', '')
      if (this.isAdd) {
        this.lineOptions = []
        this.$set(this.form, 'LineID', '')
      }

      this.getParFamilyOptions(val);

    },
    handlePartFamilyChange(val) {
      this.partOptions = []
      this.$set(this.form, 'PartID', '')
      this.getParOptions(val)
      if (this.isAdd) {
        this.$set(this.form, 'LineID', [])
        this.lineOptions = []
        this.form.LineType && this.getLineOption({ LineTypeID: this.form.LineType, PartFamilyID: val })
      }
    },
    handleLineTypeChange(val) {
      this.lineOptions = []
      this.$set(this.form, 'LineID', [])

      this.form.PartFamilyID && this.getLineOption({ LineTypeID: val, PartFamilyID: this.form.PartFamilyID })
    },
    handleClose() {
      this.form = {}
      this.partFamilyOptions = []
      this.partOptions = []
      this.lineOptions = []
      this.dialogVisible = false
    },
    getLineOption(data) {
      GetmesLinePMC(data).then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
          let index = this.lineOptions.findIndex(item => item.ID === -1)
          if (index >= 0) {
            this.lineOptions.splice(index, 1)
          }
        }
      })
    },
    getLineTypeOption() {
      GetLineTypePMC().then(res => {
        if (res.Success) {
          this.lineTypeOptions = [...res.ResData]
        }
      })
    },
    getParFamilyTypeOptions() {
      PartFamilyTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
        }
      })
    },
    getParFamilyOptions(id) {
      GetPartFamilyByParentId(id).then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
        }
      })
    },
    getParOptions(id) {
      GetPartByParentId(id).then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
