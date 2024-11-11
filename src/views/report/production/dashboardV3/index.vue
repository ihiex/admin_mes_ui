<template>
  <div class="dashboard_page">
    <DashboardComponent ref="DashboardComponent"></DashboardComponent>
    <div style="position: absolute; right: 10px; top: 17px; z-index: 101; width: 30px; height: 30px; "
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

export default {
  name: 'DashboardV3',
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
        this.$refs.DashboardComponent.handleClearTimer()
      } else {
        this.$refs.DashboardComponent.start(true)
        this.$refs.DashboardComponent.handleChartResize()
      }
    }
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

<style lang="scss" scoped>
.dashboard_page {
  height: 100%;
  min-height: 610px !important;
  min-width: 1024px !important;
  position: relative;
}
</style>
