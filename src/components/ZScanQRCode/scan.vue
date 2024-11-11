<template>
  <el-dialog title="" :visible.sync="centerDialogVisible" :fullscreen="true" center>
    <SCaner ref="SCaner" :stop-on-scanned="true" :draw-on-found="true" :responsive="false" @code-scanned="codeScanned"
      @error-captured="errorCaptured" @close="handleClose"/>
  </el-dialog>
</template>

<script>

import SCaner from './SCaner';
import i18n from '@/language'
export default {
  name: 'Scan',
  components: {
    SCaner
  },
  props:{
    isContinuously:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      errorMessage: "",
      centerDialogVisible: false
    }
  },
  mounted() {
    var str = navigator.userAgent.toLowerCase();
    var ver = str.match(/cpu iphone os (.*?) like mac os/);
    if (ver && ver[1].replace(/_/g, ".") < '10.3.3') {
      this.$message({
        showClose: true,
        message: i18n.t('cameraCallFailed'),
        type: 'error',
        duration: 5000
      });
    }
  },
  methods: {
    handleClose(){
      this.$refs.SCaner.fullStop()
      this.centerDialogVisible = false;
    },
    show() {
      this.centerDialogVisible = true;
      // let that = this
      // setTimeout(function(){
      // }, 0)
      this.$nextTick(function(){
        this.$refs.SCaner.setup()
      })
    },
    codeScanned(code) {
      this.$emit('ScanValue', code)
      if(!this.isContinuously){
        this.handleClose();
      }
    },
    errorCaptured(error) {
      switch (error.name) {
        case "NotAllowedError":
          this.errorMessage = "Camera permission denied.";
          break;
        case "NotFoundError":
          this.errorMessage = "There is no connected camera.";
          break;
        case "NotSupportedError":
          this.errorMessage =
            "Seems like this page is served in non-secure context.";
          break;
        case "NotReadableError":
          this.errorMessage =
            "Couldn't access your camera. Is it already in use?";
          break;
        case "OverconstrainedError":
          this.errorMessage = "Constraints don't match any installed camera.";
          break;
        default:
          this.errorMessage = "UNKNOWN ERROR: " + error.message;
      }
      console.error(this.errorMessage);
      this.$message({
        showClose: true,
        message: i18n.t('cameraCallFailed'),
        type: 'error',
        duration: 5000
      });
    }
  },
}
</script>

<style lang="scss" scoped>

::v-deep{
  .el-dialog__body {
    border-top: none;
    padding: 0;
  }
  .el-dialog__header{
    display: none;
  }
}

.scan .nav .close {
  display: inline-block;
  height: 22px;
  width: 22px;
  background: url('../../assets/images/back.png') no-repeat center;
  background-size: auto 100%;
  position: absolute;
  left: 16px;
  top: 14px;
}
</style>