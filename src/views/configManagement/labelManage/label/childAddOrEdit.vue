<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('Label')" prop="LabelID">
          <el-select v-model="form.LabelID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable disabled>
            <el-option v-for="item in labelOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('LabelFormatPos')" prop="LabelFormatPos">
          <el-select v-model="form.LabelFormatPos" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in posOptions" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('DefineName')" prop="FieldDefinitionID">
          <el-select v-model="form.FieldDefinitionID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable @change="handleChangeDefineName">
            <el-option v-for="item in options" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Order')" prop="Order">
          <el-input v-model="form.Order" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable readonly></el-input>
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
  LabelInsertDetail,
  LabelUpdateDetail,
} from '@/api/config.js'
import { GetLabelFormatPosName, GetmesLabel, GetmesLabelFieldDefinition } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      options: [],
      labelOptions: [],
      posOptions: [],
      title: '',
      loading: false,
      lines: [],
      rules: {
        Order: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        LabelID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        LabelFormatPos: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        FieldDefinitionID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleChangeDefineName(id) {
      if (!id) {
        this.$set(this.form, 'Description', '')
        return;
      }
      let item = this.options.find(res => res.ID == id)
      if (item) {
        this.$set(this.form, 'Description', item.Name)
      } else {
        this.$set(this.form, 'Description', '')
      }
    },
    show(title, item, id) {
      this.getPosOptions()
      this.getLabel()
      this.getLabelFieldDefinition()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          if (item[key]) {
            if (isNaN(item[key])) {
              this.$set(this.form, key, item[key])
            } else {
              this.$set(this.form, key, parseInt(item[key]))
            }
          } else {
            this.$set(this.form, key, item[key])
          }
          // this.$set(this.form, key, item[key] + '')
        })
      } else if (id) {
        this.$set(this.form, 'ParentId', id)
        this.$set(this.form, 'LabelID', parseInt(id))
        // this.$set(this.form, 'LineID', id)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          for (let key in this.form) {
            if (this.form[key]) {
              this.$set(params, key, this.form[key] + '');
            } else {
              this.$set(params, key, this.form[key]);
            }
          }
          this.loading = true
          if (this.form.ID) {
            LabelUpdateDetail(params).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            LabelInsertDetail({ ParentId: this.form.ParentId }, params).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                // this.handleClose()
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
    getLabel() {
      GetmesLabel().then(res => {
        if (res.Success) {
          this.labelOptions = [...res.ResData]
        }
      })
    },
    getPosOptions() {
      GetLabelFormatPosName().then(res => {
        if (res.Success) {
          this.posOptions = [...res.ResData]
        }
      })
    },
    getLabelFieldDefinition() {
      GetmesLabelFieldDefinition().then(res => {
        if (res.Success) {
          this.options = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
