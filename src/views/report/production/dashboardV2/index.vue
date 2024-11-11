<template>
  <div style="height: inherit; position: relative;">
    <DashboardComponent ref="DashboardComponent"></DashboardComponent>
    <div style="position: absolute; right: 10px; top: 11px; z-index: 101; width: 30px; height: 30px; "
      @click="handleFullScreen">
      <vab-icon style="font-weight: normal; font-size: 24px;"
        :icon="['fas', isFullScreen ? 'compress-arrows-alt' : 'expand-arrows-alt']"></vab-icon>
    </div>
    <DashboardFullScreen ref="DashboardFullScreen" @close="handleClose"></DashboardFullScreen>

  </div>
</template>

<script>
import DashboardComponent from './dashboardComponent.vue'
import DashboardFullScreen from './dashboardFullScreen.vue'
import { mapState } from 'vuex'
import { getShift, getUserShift, uuid } from '@/utils'

export default {
  name: 'DashboardV2',
  components: {
    DashboardComponent,
    DashboardFullScreen
  },
  computed: {
    ...mapState({
      isFullScreen: state => state.common.isFullScreen
    })
  },
  watch: {
    isFullScreen: function (val, oval) {
      if (val) {
        this.$refs.DashboardComponent.destroyTimer()
      } else {
        // this.$refs.DashboardComponent.startTimer(true)
        this.$refs.DashboardComponent.handleSwitchLine(true)
      }
    }
  },
  created() {

    let shift = getShift(this.$store.getters['user/shiftTable'])
    let s = getUserShift(this.$store.getters['user/shiftTable']);
    let params = this.$store.state.reportParams.paramsV2

    this.$set(params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
    this.$set(params, 'S_Shift', s)
    this.$set(params, 'S_StartDateTime', shift.sTime)

    this.$store.dispatch('reportParams/setParamsV2', params)
  },
  methods: {
    handleClose() {
      this.$store.dispatch('common/setFullScreen', false)
    },
    handleFullScreen() {

      this.$store.dispatch('common/setFullScreen', !this.$store.getters['common/isFullScreen'])
      if (!this.isFullScreen) {
        this.$refs.DashboardFullScreen.close()
      } else {
        this.$refs.DashboardFullScreen.show()
      }

    },
  },
}
</script>

<style lang="scss" scoped></style>
