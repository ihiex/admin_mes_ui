<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" :label-width="labelWidth">
        <el-form-item :label="$t('PartNumber')" prop="PartID">
          <el-select v-model="form.PartID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable disabled>
            <el-option v-for="item in partOption" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('attributeName')" prop="PartDetailDefID">
          <el-select v-model="form.PartDetailDefID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable @change="handleAttributeChange">
            <el-option v-for="item in attributeOptions" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('attributeValue')" prop="Content">
          <el-input v-if="form.PartDetailDefID !== 4" v-model="form.Content" :placeholder="$t('pleaseInput')"
            clearable></el-input>
          <el-select v-else v-model="form.Content" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
            <el-option v-for="item in remarksList" :key="item.value" :label="item.label" :value="item.value">
              <div class="select_option">
                <span>{{ item.label }}</span>
                <span>{{ item.value }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div :style="{ boxSizing: 'border-box', paddingLeft: labelWidth }">
        <p v-for="item in remarksList" :key="item.value" style="margin: 0;">{{ item.label }}</p>
      </div>
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
  PartChildInsertAsync,
  PartChildUpdateAsync,
  PartAttributeFindWithAllPagerAsync,
  PartFindWithAllPagerAsync
} from '@/api/config.js'

export default {
  data() {
    return {
      labelWidth: '120px',
      dialogVisible: false,
      form: {},
      attributeOptions: [],
      title: '',
      loading: false,
      partOption: [],
      rules: {
        Content: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        PartDetailDefID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        PartID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      },
      /*  remarksList: [
         "ScanType 说明:",
         "(1) 系统存在数据(SN)",
         "(2) 非系统注册批次(Batch校验数量,不校验唯一性)",
         "(3) 设备数据,绑定过批次(类似托盘)",
         "(4) 设备数据,无批次(类似夹具)",
         "(5) 非系统注册SN(校验唯一性)",
         "(6) 设备数据,包含3/4类型,ValidFrom工位可以重复绑定",
         "(7) 系统注册批次(Batch校验数量)",
       ], */
      remarksList: [
        { value: "1", label: "(1) 系统存在数据(SN)" },
        { value: "2", label: "(2) 非系统注册批次(Batch校验数量,不校验唯一性)" },
        { value: "3", label: "(3) 设备数据,绑定过批次(类似托盘)" },
        { value: "4", label: "(4) 设备数据,无批次(类似夹具)" },
        { value: "5", label: "(5) 非系统注册SN(校验唯一性)" },
        { value: "6", label: "(6) 设备数据,包含3/4类型,ValidFrom工位可以重复绑定" },
        { value: "7", label: "(7) 系统注册批次(Batch校验数量)" },
        { value: "8", label: "(8) 共享系统注册批次(Batch校验数量)" },
      ],
    }
  },
  methods: {
    handleAttributeChange(val) {
      console.log(val)
      this.$set(this.form, 'Content', '')
    },
    show(title, item, id) {
      // debugger
      this.$store.getters['common/IsUnit']
      this.getPartFamilyTypeAttributeOptions()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
        })
      } else if (id) {
        this.$set(this.form, 'PartID', id)
        // this.$set(this.form, 'DefID', id)
      }
      this.getPartFamilyOptions()
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            PartChildUpdateAsync(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            PartChildInsertAsync(this.form).then(res => {
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
    getPartFamilyOptions() {
      // this.partFamilyOption = []
      PartFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.partOption = [...res.ResData]
        }
      })
    },
    getPartFamilyTypeAttributeOptions() {
      PartAttributeFindWithAllPagerAsync().then(res => {
        if (res.Success) {
          this.attributeOptions = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
