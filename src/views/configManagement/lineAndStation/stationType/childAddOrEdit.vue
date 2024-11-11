<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('attributeName')" prop="StationTypeDetailDefID">
          <el-select v-model="form.StationTypeDetailDefID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" filterable clearable>
            <el-option v-for="item in options" :key="item.ID" :label="item.Description" :value="item.ID">
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
  MesStationTypeInsertDetail,
  MesStationTypeUpdateDetail,
} from '@/api/config.js'
import { GetluStationTypeDetailDef } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        StationTypeID: ''
      },
      options: [],
      title: '',
      loading: false,
      rules: {
        Content: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        StationTypeDetailDefID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, item, id) {
      this.getStationType()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          if (key === 'StationTypeDetailDefID') {
            this.$set(this.form, key, parseInt(item[key]))
          } else {
            this.$set(this.form, key, item[key])
          }
        })
      } else if (id) {
        this.$set(this.form, 'ParentId', id)
        this.$set(this.form, 'StationTypeID', id)
      }
      console.log(this.form)
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {};
          Object.keys(this.form).forEach(key => {
            params[key] = this.form[key] + '';
          })
          this.loading = true
          if (this.form.ID) {
            MesStationTypeUpdateDetail(params).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            MesStationTypeInsertDetail({ ParentId: this.form.ParentId }, params).then(res => {
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
    getStationType() {
      GetluStationTypeDetailDef().then(res => {
        if (res.Success) {
          this.options = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
