<template>
  <el-dialog :title="$t('Feedback')" :visible.sync="drawer" size="70%" :before-close="handleClose"
    :destroy-on-close="true" :wrapper-closable="false" append-to-body>
    <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="30px" class="demo-ruleForm">
      <!-- <el-form-item label="标题" prop="title">
                <el-input v-model="ruleForm.title"></el-input>
            </el-form-item> -->
      <!-- maxlength="3000" show-word-limit -->
      <el-form-item label="" prop="Feedback">
        <el-input v-model="ruleForm.Feedback" type="textarea" :rows="20"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" @click="submitForm('ruleForm')">{{ $t('Feedback') }}</el-button>
        <el-button @click="resetForm('ruleForm')">{{ $t('cancel') }}</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import { WinUploadFileUrl } from '@/api/basebasic.js'

export default {

  data() {
    return {
      drawer: false,
      ruleForm: {},
      rules: {
        Feedback: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$set(this.ruleForm, 'isFeedback', '1')
          WinUploadFileUrl(this.ruleForm).then(res => {
            if (res.Success) {
              this.$emit('getContent', this.ruleForm)
              this.resetForm('ruleForm')
              this.handleClose()
            }
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.handleClose()
    },

    show(data) {
      this.ruleForm = { ...data }
      this.drawer = true
    },
    handleClose() {
      Object.keys(this.ruleForm).forEach(key => {
        this.$set(this.ruleForm, key, '')
      })
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>
.demo-ruleForm {
  padding-right: 15px;
  box-sizing: border-box;
}
</style>
