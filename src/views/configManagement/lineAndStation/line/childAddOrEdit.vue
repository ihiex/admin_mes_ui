<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="400" :close-on-click-modal="false"
    :destroy-on-close="true" :before-close="handleClose">
    <div v-loading="loading">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-form-item :label="$t('Line')" prop="LineID">
          <el-select v-model="form.LineID" :placeholder="$t('pleaseSelect')" style="width: 100%;" :collapse-tags="true"
            filterable clearable disabled>
            <el-option v-for="item in lines" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="select_option">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('attributeName')" prop="LineTypeDefID">
          <el-select v-model="form.LineTypeDefID" :placeholder="$t('pleaseSelect')" style="width: 100%;"
            :collapse-tags="true" clearable filterable>
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
  MesLineInsertDetail,
  MesLineUpdateDetail,
} from '@/api/config.js'
import { GetluLineTypeDef, GetmesLine } from '@/api/configCommon.js'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      options: [],
      title: '',
      loading: false,
      lines: [],
      rules: {
        Content: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }
        ],
        LineTypeDefID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
        LineID: [
          { required: true, message: this.$t('pleaseSelect'), trigger: 'change' }
        ],
      }
    }
  },
  methods: {
    show(title, item, id) {
      this.getLineType()
      this.getLine()
      this.title = title
      if (JSON.stringify(item) !== '{}') {
        Object.keys(item).forEach(key => {
          this.$set(this.form, key, item[key])
          // this.$set(this.form, key, item[key] + '')
        })
      } else if (id) {
        this.$set(this.form, 'ParentId', id)
        this.$set(this.form, 'LineID', parseInt(id))
        // this.$set(this.form, 'LineID', id)
      }
      this.dialogVisible = true
    },
    confirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.form.ID) {
            MesLineUpdateDetail(this.form).then(res => {
              if (res.Success) {
                this.$emit('confirm')
                this.handleClose()
              }
              this.loading = false
            }, error => {
              this.loading = false

            })
          } else {
            MesLineInsertDetail({ ParentId: this.form.ParentId }, this.form).then(res => {
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
    getLineType() {
      GetluLineTypeDef().then(res => {
        if (res.Success) {
          this.options = [...res.ResData]
        }
      })
    },
    getLine() {
      GetmesLine().then(res => {
        if (res.Success) {
          this.lines = [...res.ResData]
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped></style>
