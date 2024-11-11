<template>
  <el-dialog title="" :visible.sync="dialogVisible" :fullscreen='true' :append-to-body="true" :show-close="true"
    :destroy-on-close="false" @close="close">
    <DashboardComponent ref="DashboardComponentF" style="height: inherit;" header-height="94vh" footer-height="94vh"></DashboardComponent>
    <!-- <div style="height: inherit; background-color: antiquewhite;">

    </div> -->
    <div style="position: absolute; right: 10px; top: 13px; z-index: 101; width: 30px; height: 30px; "
      @click="handleFullScreen">
      <vab-icon style="font-weight: normal; font-size: 24px;" :icon="[
    'fas',
    $store.getters['common/isFullScreen'] ? 'compress-arrows-alt' : 'expand-arrows-alt',
  ]"></vab-icon>
    </div>
  </el-dialog>
</template>
<script>
import DashboardComponent from './dashboardComponent.vue'

export default {
  name: 'DashboardFullScreen',
  components: {
    DashboardComponent
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    show() {
      this.dialogVisible = true
      this.$nextTick(function(){
        // this.$refs.DashboardComponentF.startTimer(true)
        this.$refs.DashboardComponentF.handleSwitchLine(true)
      })
    },
    close() {
      this.dialogVisible = false
      this.$emit('close')
      this.$refs.DashboardComponentF.destroyTimer()
    },
    handleFullScreen() {

      this.$store.dispatch('common/setFullScreen', !this.$store.getters['common/isFullScreen'])
      this.close()

      /*  if (!this.$store.getters['common/isFullScreen']) {
         this.$refs.DashboardFullScreen.close()
       } else {
         this.$refs.DashboardFullScreen.show()
       } */
    },
  },
}

</script>
<style lang="scss" scoped>
::v-deep {

  .el-dialog {
    margin: 0;
    padding: 0;
    border-radius: 0;
    box-sizing: border-box;
    position: relative;
  }

  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
  }
}
</style>
