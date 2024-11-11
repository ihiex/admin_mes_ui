<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item :label="$t('PathName')" prop="RouteID">
          <el-select v-model="form.RouteID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable>
            <el-option v-for="item in pathNameOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartFamily')" prop="PartFamilyID">
          <el-select v-model="form.PartFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable @change="handlePartFamilyChange">
            <el-option v-for="item in partFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Line')" prop="LineID">
          <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable>
            <el-option v-for="item in lineOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('WorkOrderNumber')" prop="ProductionOrderID">
          <el-select v-model="form.ProductionOrderID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in workOrderOptions" :key="item.ID" :label="item.SN" :value="item.ID">
              <div class="select_option">
                <span>{{ item.SN }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <!--  <el-form-item :label="$t('name')" prop="Name">
          <el-input v-model="form.Name" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item> -->

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
  WorkflowAllotInsert,
  WorkflowAllotUpdate,
  WorkflowAllotClone
} from '@/api/config.js'
import {
  GetmesRoute,
  GetluPartFamily,
  GetmesPart_PartFamilyID,
  GetmesLine,
  GetmesProductionOrder
} from '@/api/configCommon.js'
export default {
  data() {
    return {
      dialogVisible: false,
      pathNameOptions: [],
      partFamilyOptions: [],
      partOptions: [],
      lineOptions: [],
      workOrderOptions: [],

      form: {
        "ID": "",
        "PartFamilyID": "",
        "PartID": "",
        "LineID": "",
        "RouteID": "",
        "ProductionOrderID": ""
      },
      title: '',
      loading: false,
      flag: '',
      rules: {
        RouteID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        /*  Name: [
           { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
         ], */
      }
    }
  },
  created() {


  },
  methods: {
    show(title, flag, item) {
      this.getPathName();
      this.getPartFamily();
      this.getLine();
      this.getWorkOrder();
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
        this.getPart(this.form.PartFamilyID)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            WorkflowAllotUpdate(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            WorkflowAllotInsert(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkflowAllotClone(this.form).then(res => {
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
      this.partOptions = []
      this.dialogVisible = false
    },
    handlePartFamilyChange(val) {
      this.partOptions = []
      this.$set(this.form, 'PartID', '')
      this.getPart(val)
    },
    getPathName() {
      GetmesRoute().then(res => {
        if (res.Success) {
          this.pathNameOptions = [...res.ResData]
          this.pathNameOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })

    },
    getPartFamily() {
      GetluPartFamily().then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
          this.partFamilyOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getPart(id) {
      GetmesPart_PartFamilyID({ PartFamilyID: id }).then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
          this.partOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
          this.lineOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    },
    getWorkOrder() {
      GetmesProductionOrder().then(res => {
        if (res.Success) {
          this.workOrderOptions = [...res.ResData]
          this.workOrderOptions.forEach(item => {
            item.ID = item.ID + ''
          })
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
