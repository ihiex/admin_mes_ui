<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('PartFamilyType')" prop="PartFamilyTypeID">
          <el-select v-model="form.PartFamilyTypeID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable disabled>
            <el-option v-for="item in partFamilyTypeOption" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('attributeName')" prop="PartFamilyTypeDetailDefID">
          <el-select v-model="form.PartFamilyTypeDetailDefID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
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
  PartFamilyTypeChildInsertAsync,
  PartFamilyTypeChildUpdateAsync,
  PartFamilyTypeAttributeFindWithAllPagerAsync,
  PartFamilyTypeFindWithAllPagerAsync
} from '@/api/config.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      attributeOptions: [],
      title: '',
      loading: false,
      partFamilyTypeOption: [],
      rules: {
        Content: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        PartFamilyTypeDetailDefID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartFamilyTypeID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, item, id) {
      this.getPartFamilyTypeAttributeOptions()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else if (id) {
        this.$set(this.form, 'PartFamilyTypeID', id)
      }
      this.getPartFamilyTypeOptions()
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            PartFamilyTypeChildUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            PartFamilyTypeChildInsertAsync(this.form).then(res => {
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
    getPartFamilyTypeOptions() {
      // this.partFamilyTypeOption = [];
      PartFamilyTypeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partFamilyTypeOption = [...res.ResData]
        }
      })
    },
    getPartFamilyTypeAttributeOptions() {
      PartFamilyTypeAttributeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.attributeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
