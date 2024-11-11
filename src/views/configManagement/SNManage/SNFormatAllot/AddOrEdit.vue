<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">

        <el-form-item :label="$t('SNFormat')" prop="SNFormatID">
          <el-select v-model="form.SNFormatID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in SNFormatOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Part')" prop="PartID">
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

        <el-form-item :label="$t('PartFamily')" prop="PartFamilyID">
          <el-select v-model="form.PartFamilyID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in partFamilyOptions" :key="item.ID" :label="item.Description" :value="item.ID">
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

        <el-form-item :label="$t('ProductionOrder')" prop="ProductionOrderID">
          <el-select v-model="form.ProductionOrderID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in productionOrderOptions" :key="item.ID" :label="item.SN" :value="item.ID">
              <div class="select_option">
                <span>{{ item.SN }}</span>
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
  SNFormatAllotInsert,
  SNFormatAllotUpdate,
  SNFormatAllotClone
} from '@/api/config.js'
import {
  GetmesSNFormat,
  GetmesProductionOrder,
  GetmesStationType,
  GetmesLine,
  GetluPartFamily,
  GetmesPart
} from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        "ID": "",
        "SNFormatID": "",
        "PartID": "",
        "PartFamilyID": "",
        "LineID": "",
        "ProductionOrderID": "",
        "StationTypeID": ""
      },
      title: '',
      loading: false,
      flag: '',
      SNFormatOptions: [],
      productionOrderOptions: [],
      stationTypeOptions: [],
      lineOptions: [],
      partOptions: [],
      partFamilyOptions: [],
      rules: {
        SNFormatID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        /* PartID: [
         { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
       ],
       PartFamilyID: [
         { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
       ],
       LineID: [
         { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
       ],
      ProductionOrderID: [
         { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
       ],
       StationTypeID: [
         { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
       ], */
      }
    }
  },
  created() {

  },
  methods: {
    show(title, flag, item) {
      this.getSNFormat();
      this.getProductionOrder();
      this.getStationType();
      this.getLine();
      this.getPartFamily();
      this.getPart();
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key] && !isNaN(item[key]) ? parseInt(item[key]) : item[key])
        })
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          Object.keys(this.form).forEach(key => {
            this.$set(params, key, this.form[key] ? this.form[key] + "" : this.form[key])
          })
          this.loading = true
          if (this.flag === 'Edit') {
            SNFormatAllotUpdate(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            SNFormatAllotInsert(params).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            SNFormatAllotClone(params).then(res => {
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
    getSNFormat() {
      GetmesSNFormat().then(res => {
        if (res.Success) {
          this.SNFormatOptions = [...res.ResData]
        }
      })
    },
    getProductionOrder() {
      GetmesProductionOrder().then(res => {
        if (res.Success) {
          this.productionOrderOptions = [...res.ResData]
        }
      })
    },
    getStationType() {
      GetmesStationType().then(res => {
        if (res.Success) {
          this.stationTypeOptions = [...res.ResData]
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lineOptions = [...res.ResData]
        }
      })
    },
    getPartFamily() {
      GetluPartFamily().then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
        }
      })
    },
    getPart() {
      GetmesPart().then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
