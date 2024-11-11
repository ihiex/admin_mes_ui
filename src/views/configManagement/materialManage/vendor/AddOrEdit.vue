<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">

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
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" clearable filterable>
            <el-option v-for="item in partOptions" :key="item.ID" :label="item.Description" :value="item.ID">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('VendorCode')" prop="Code">
          <el-input v-model="form.Code" :placeholder="$t('pleaseInput')" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('describe')" prop="Description">
          <el-input v-model="form.Description" :placeholder="$t('pleaseInput')" clearable></el-input>
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
  VendorInsertAsync,
  VendorUpdateAsync,
  PartFamilyTypeFindWithAllPagerAsync,
  GetPartFamilyByParentId,
  GetPartByParentId
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      partFamilyTypeOptions: [],
      partFamilyOptions: [],
      partOptions: [],
      title: '',
      loading: false,
      flag: '',
      rules: {
        Code: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        Description: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        PartFamilyTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartFamilyID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, flag, item) {
      this.getPartFamilyTypeOptions()
      this.title = title
      this.flag = flag
      if (item) {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
          // this.$set(this.form, key, item[key] + '')
        })
        this.getPartFamilyOptions(item.PartFamilyTypeID)
        this.getPartOptions(item.PartFamilyID)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.flag === 'Edit') {
            VendorUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false
            })
          } else if (this.flag === 'Add') {
            VendorInsertAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm', this.flag)
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } /* else {
            MesLineClone(this.form).then(res => {
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
      this.partFamilyOptions = []
      this.partOptions = []
      this.dialogVisible = false
    },
    handlePartFamilyTypeChange(val) {
      this.partFamilyOptions = [];
      this.partOptions = [];
      this.$set(this.form, 'PartFamilyID', '');
      this.$set(this.form, 'PartID', '');
      this.getPartFamilyOptions(val)
    },
    handlePartFamilyChange(val) {
      this.partOptions = [];
      this.$set(this.form, 'PartID', '');
      this.getPartOptions(val)
    },
    getPartFamilyTypeOptions() {
      PartFamilyTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partFamilyTypeOptions = [...res.ResData]
        }
      })
    },
    getPartFamilyOptions(id) {
      if (!id) return
      GetPartFamilyByParentId(id).then(res => {
        if (res.Success) {
          this.partFamilyOptions = [...res.ResData]
        }
      })
    },
    getPartOptions(id) {
      if (!id) return
      GetPartByParentId(id).then(res => {
        if (res.Success) {
          this.partOptions = [...res.ResData]
        }
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>
