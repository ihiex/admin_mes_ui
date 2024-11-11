<template>
  <div v-loading="loading" class="page_container">
    <div class="title">
      {{ $t('ModifyPage') }}
    </div>
    <!-- <el-tabs v-model="activeName" type="border-card">
      <el-tab-pane :label="$t('ModifyPage')" name="first"> -->
    <el-form ref="editFrom" :model="editFrom" :rules="rules" class="yuebon-setting-form" @submit.native.prevent>
      <el-form-item :label="$t('originalPassword')" :label-width="formLabelWidth" prop="OldPassword">
        <!-- <el-input v-model="editFrom.OldPassword" style="width: 100%" type="password"
          :placeholder="$t('PleaseInputOldPassword')" autocomplete="off" clearable /> -->
        <z-password v-model.trim="editFrom.OldPassword" tabindex="1" style="width: 100%" :autofocus="true" :placeholder="$t('pleaseEnterPassword')"
          @keypress.native.enter="handleLogin"></z-password>
      </el-form-item>
      <el-form-item :label="$t('newPassword')" :label-width="formLabelWidth" prop="NewPassword">
        <!-- <el-input v-model="editFrom.NewPassword" style="width: 100%" type="password"
          :placeholder="$t('pleaseEnterNewPassword')" autocomplete="off" clearable /> -->
        <z-password v-model.trim="editFrom.NewPassword" tabindex="2" style="width: 100%" :placeholder="$t('pleaseEnterPassword')"
          @keypress.native.enter="handleLogin"></z-password>
      </el-form-item>
      <el-form-item :label="$t('enterAgain')" :label-width="formLabelWidth" prop="NewPassword2">
        <!-- <el-input v-model="editFrom.NewPassword2" style="width: 100%" type="password"
          :placeholder="$t('PleaseEnteTtheNewPasswordAgain')" autocomplete="off" clearable /> -->
        <z-password v-model.trim="editFrom.NewPassword2" tabindex="3" style="width: 100%" :placeholder="$t('pleaseEnterPassword')"
          @keypress.native.enter="handleLogin"></z-password>
      </el-form-item>
      <el-form-item style="text-align: right">
        <el-button v-if="!saveAndLogin" type="primary" @click="saveEditForm">
          {{ $t('save') }}
        </el-button>

        <el-button v-else type="primary" style="margin-left: 15px;" @click="handleSaveAndResetLogin">
          {{ $t('SaveAndResetLogin') }}
        </el-button>
      </el-form-item>
    </el-form>
    <!-- </el-tab-pane>
    </el-tabs> -->
  </div>
</template>
<script>
import { modifyPassword } from '@/api/security/userservice'
import ZPassword from 'z-password'

export default {
  name: 'ModifyPage',
  components: {
    ZPassword
  },
  props: {
    saveAndLogin: {
      type: Boolean,
      default: () => { return false }
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('pleaseEnterNewPassword')));
      } else if (value.length < 6 || value.length > 50) {
        callback(new Error(this.$t('Contains6to32characters')));

      } else if (this.editFrom.NewPassword2 && value !== this.editFrom.NewPassword2) {
        callback(new Error(this.$t('TheTwoPasswordsAreInconsistent')));
      } else {
        /*  if (this.ruleForm.checkPass !== '') {
           this.$refs.ruleForm.validateField('checkPass');
         } */
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('PleaseEnteTtheNewPasswordAgain')));
      } else if (value.length < 6 || value.length > 50) {
        callback(new Error(this.$t('Contains6to32characters')));

      } else if (value !== this.editFrom.NewPassword) {
        callback(new Error(this.$t('TheTwoPasswordsAreInconsistent')));
      } else {
        callback();
      }
    };
    return {
      activeName: 'first',
      editFrom: {
        OldPassword: '',
        NewPassword: '',
        NewPassword2: '',
      },
      rules: {
        OldPassword: [
          { required: true, message: this.$t('PleaseInputOldPassword'), trigger: 'blur' },
          /* {
            min: 6,
            max: 50,
            message: this.$t('Contains6to32characters'),
            trigger: 'blur',
          }, */
        ],
        NewPassword: [
          { required: true, validator: validatePass, trigger: 'blur' },
          /* {
            min: 6,
            max: 50,
            message: this.$t('Contains6to32characters'),
            trigger: 'blur',
          }, */
        ],
        NewPassword2: [
          { required: true, validator: validatePass2, trigger: 'blur' },
          /* {
            min: 6,
            max: 50,
            message: this.$t('Contains6to32characters'),
            trigger: 'blur',
          }, */
        ],
      },
      formLabelWidth: '150px',
      loading: false
    }
  },
  methods: {
    handleSaveAndResetLogin() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            oldpassword: this.editFrom.OldPassword,
            password: this.editFrom.NewPassword,
            password2: this.editFrom.NewPassword2,
          }
          this.loading = true;
          modifyPassword(data).then(async (res) => {
            this.loading = false
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.$refs['editFrom'].resetFields()

              await this.$store.dispatch('user/logout')
              this.$router.push({ path: '/login' })
              location.reload()
            }
          })
        } else {
          return false
        }
      })
    },
    /**
     * 新增/修改保存
     */
    saveEditForm() {
      this.$refs['editFrom'].validate((valid) => {
        if (valid) {
          const data = {
            oldpassword: this.editFrom.OldPassword,
            password: this.editFrom.NewPassword,
            password2: this.editFrom.NewPassword2,
          }
          this.loading = true;
          modifyPassword(data).then((res) => {
            if (res.Success) {
              this.$message({
                message: this.$t('operateSuccessfully'),
                type: 'success',
              })
              this.$refs['editFrom'].resetFields()
            }
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  height: inherit;
  background-color: #fff;

  .title {
    height: 38px;
    line-height: 38px;
    padding: 5px 15px;
    margin-bottom: 10px;
    box-shadow: 1px 1px 5px 1px #efefef;
  }

  .el-form {
    .el-form-item {
      min-width: 300px;
      max-width: 500px;
    }
  }
}

.yuebon-setting-form .el-input {
  width: 40%;
}

.yuebon-setting-form .el-select .el-input {
  width: 100%;
}
</style>
