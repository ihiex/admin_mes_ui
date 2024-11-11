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
        <el-form-item :label="$t('status')" prop="StatusID">
          <el-select v-model="form.StatusID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in statusOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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
  WorkOrderMaintenanceInsertAsync,
  WorkOrderMaintenanceUpdateAsync,
  WorkOrderMaintenanceCloneAsync,
  /*   GetluPartFamilyType,
    GetluPartFamily */
} from '@/api/config.js'
import {
  GetluProductionOrderStatus,
  // GetmesPart,
  GetluPartFamilyType,
  GetPartFamily_PartFamilyTypeID, //PartFamilyTypeID
  GetmesPart_PartFamilyID, //PartFamilyID
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {

      },
      statusOptions: [],
      partFamilyTypeOptions: [],
      partFamilyOptions: [],
      partOptions: [],
      title: '',
      loading: false,
      flag: '',
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
        StatusID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },

  methods: {
    handlePartFamilyTypeChange(val){
      this.$set(this.form, 'PartFamilyID' ,'')
      this.$set(this.form, 'PartID' ,'')
      this.partFamilyOptions = []
      this.partOptions = []

      this.getPartFamily(val)
    },
    getPartFamilyType() {
      GetluPartFamilyType().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
        }
      })
    },

    handlePartFamilyChange(val){
      this.$set(this.form, 'PartID' ,'')
      this.partOptions = []

      this.getParOptions(val)
    },
    getPartFamily(id) {
      GetPartFamily_PartFamilyTypeID({ PartFamilyTypeID: id }).then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
        }
      })
    },

    show(title, flag, item) {
      this.getStatus()
      this.getPartFamilyType()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else {
        this.$set(this.form, "CreationTime", new Date().format('yyyy-MM-dd hh:mm:ss'))
      }

      this.form.PartFamilyTypeID && this.getPartFamily(this.form.PartFamilyTypeID)
      this.form.PartFamilyID && this.getParOptions(this.form.PartFamilyID)

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
            WorkOrderMaintenanceInsertAsync(this.form).then(res => {
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
    handleClose() {
      this.form = {}
      this.partFamilyTypeOptions = []
      this.partFamilyOptions = []
      this.partOptions = []
      this.dialogVisible = false
    },
    getStatus() {
      GetluProductionOrderStatus().then(res => {
        if (res.Success) {
          this.statusOptions = [...res.ResData]
        }
      })
    },
    getParOptions(id) {
      GetmesPart_PartFamilyID({ PartFamilyID: id }).then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
