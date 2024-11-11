<template>
  <el-drawer :title="$t('edit')" custom-class="demo-drawer" :visible.sync="drawer" direction="rtl" :append-to-body="true"
    :before-close="handleClose" :wrapper-closable="false">
    <div class="drawer__content">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item :label="$t('headPortrait')">
          <el-upload class="avatar-uploader" :show-file-list="false" :headers="$requestHeaders" :action="action"
            :on-success="handleAvatarSuccess">
            <img v-if="ruleForm.pic" :src="ruleForm.pic" class="avatar" style="height: 150px">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

        </el-form-item>
        <el-form-item :label="$t('name')" prop="name">
          <el-input v-model="ruleForm.name" clearable></el-input>
        </el-form-item>
        <el-form-item :label="$t('Position')" prop="title">
          <el-input v-model="ruleForm.title" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="footer_btn">
      <el-button @click="handleCancel">{{ $t('cancel') }}</el-button>
      <el-button type="primary" @click="handleConfirm('ruleForm')">{{ $t('confirm') }}</el-button>
    </div>
  </el-drawer>
</template>

<script>

export default {
  name: 'Drawer',
  data() {
    return {
      drawer: false,
      ruleForm: {},
      imageUrl: '',
      action: this.$baseUrl + 'api/Files/Upload',
      rules: {
        name: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' },
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('pleaseInput'), trigger: 'blur' }
        ],
      },
      stationType: []
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$set(this.ruleForm, 'pic', this.findHeadShot(res.ResData.FilePath))
    },
    show(data) {
      console.log(data)
      /*   console.log(this.$baseUrl)
        console.log(this.$requestHeaders) */
      Object.keys(this.ruleForm).forEach(key => {
        this.ruleForm[key] = ''
      })
      this.ruleForm = { ...data }

      // if (this.ruleForm.pic) {
      //   // if(!this.ruleForm.pic.includes('api')){
      //   this.$set(this.ruleForm, 'pic', /* require("./images/HS" + this.ruleForm.pic) */ this.findHeadShot(this.ruleForm.pic))
      //   // }
      // } else {
      //   this.$set(this.ruleForm, 'pic', require("./images/HSnopic.png"))
      // }
      this.$set(this.ruleForm, 'pic', this.findHeadShot(this.ruleForm.pic))
      this.drawer = true


    },
    findHeadShot(pic) {
      if (!pic) return require("./images/HSnopic.png"); // There are only 16 images on the server
      // 临时走后台数据
      if (pic.length > 20) {
        // console.log(that.$baseUrl + pic)
        return this.$baseUrl + pic
      }
      return require("./images/HS" + pic);
    },
    handleClose() {
      this.drawer = false
    },
    handleCancel() {
      // this.$refs.ruleForm.resetField()
      this.handleClose()
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.ruleForm))
          params.pic = params.pic.replace(this.$baseUrl, '')
          console.log(params)
          this.$emit('confirm', params)
          this.handleCancel()
        } else {
          console.log('error submit!!');
          return false;
        }
      });

    },
  },
}
</script>

<style lang="scss" scoped>
.el-drawer {
  position: relative;

  .drawer__content {
    padding: 0 15px;
  }

  .footer_btn {
    width: 100%;
    /*   position: absolute;
    bottom: 20px; */
    text-align: right;
    padding: 0 20px;
  }

}
</style>
