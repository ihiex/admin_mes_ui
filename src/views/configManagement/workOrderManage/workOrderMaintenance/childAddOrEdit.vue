<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('attributeName')" prop="ProductionOrderDetailDefID">
          <el-select v-model="form.ProductionOrderDetailDefID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in attributeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('attributeValue')" prop="Content">
          <el-input v-model="form.Content" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('CheckList')" prop="IsCheckList">
          <el-select v-model="form.IsCheckList" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in checkOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Order')" prop="Order">
          <el-input v-model="form.Sequence" type="number" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  WorkOrderMaintenanceChildInsertAsync,
  WorkOrderMaintenanceChildUpdateAsync,
  WorkOrderAttributeFindWithAllPagerAsync,
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      attributeOptions: [],
      checkOptions: [
        {
          value: true,
          label: 'true'
        },
        {
          value: false,
          label: 'false'
        }
      ],
      title: '',
      loading: false,
      rules: {
        Content: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        ProductionOrderDetailDefID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ]
      }
    }
  },

  methods: {
    show(title, item, id) {
      this.getAttributeOptions()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
        !this.form.IsCheckList && this.$set(this.form, 'IsCheckList', false)
      } else if (id) {
        this.$set(this.form, 'ProductionOrderID', id)
        this.$set(this.form, 'IsCheckList', false)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            WorkOrderMaintenanceChildUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            WorkOrderMaintenanceChildInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
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
    getAttributeOptions() {
      WorkOrderAttributeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.attributeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
