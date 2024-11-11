<template>
  <el-dialog title="" :fullscreen="true" :append-to-body='true' :show-close="false" :visible.sync="isFullscreen" top="0"
    :destroy-on-close="true">
    <div style="height: inherit; width: 100%; user-select: none;">
      <div
        style="height: 40px; line-height: 40px; color: black; font-size: 24px; font-weight: 800; text-align: right; padding: 0 20px;">
        <span style="position: absolute; left: 10px">{{ title }} {{ getShiftText(query.S_Shift) }}</span>
        {{ query.S_EndDateTime }}
        <span style="margin-left: 20px;" @click="handleFullScreen">
          <vab-icon :icon="[
    'fas',
    isFullscreen ? 'compress-arrows-alt' : 'expand-arrows-alt',
  ]"></vab-icon>
        </span>
      </div>
      <div v-loading="loading" style="height: calc(100% - 40px);">
        <OutputV2Common ref="OutputOverviewFullScreen" style="height: 100%;" size="mini" @setTitle="setTitle">
        </OutputV2Common>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import OutputV2Common from './OutputV2Common.vue'
import { GetUPHCum } from '@/api/report.js'
import { getData } from './dataFormat'
import { getShift, getUserShift } from '@/utils'

export default {
  components: {
    OutputV2Common
  },
  data() {
    return {
      isFullscreen: false,
      dateTime: '',
      query: {},
      time: null,
      title: '',
      loading: false,
      // shiftText: 'AllShift'
    }
  },
  watch: {
    isFullscreen: function (val, oval) {
      if (!val) {
        this.$emit('setFullScreen', val)
      }
    }
  },
  beforeDestroy() {
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  },
  methods: {
    getShiftText(shift) {
      if (shift?.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },
    setTitle(val) {
      this.title = val
    },
    handleFullScreen() {
      this.isFullscreen = false;
      if (this.time) {
        clearInterval(this.time)
        this.time = null;
      }
    },
    handleShow(data, isFullscreen) {
      Object.keys(data).forEach(key => {
        this.$set(this.query, key, data[key])
      })
      this.isFullscreen = isFullscreen;
      this.handleSearch(false)
      this.start()
      // this.shiftText = this.getShiftText(data.S_Shift)
    },
    start() {
      let that = this
      this.time && clearInterval(this.time)
      this.time = setInterval(function () {
        let shift = getShift(that?.$store?.getters?.['user/shiftTable'])
        let s = getUserShift(that?.$store?.getters?.['user/shiftTable']);
        that.$set(that.query, 'S_StartDateTime', shift?.sTime)
        that.$set(that.query, 'S_EndDateTime', new Date()?.format?.('yyyy-MM-dd hh:mm:ss'))
        that.$set(that.query, 'S_Shift', s)
        that.handleSearch(true)
        // that.shiftText = that.getShiftText(that.query.S_Shift)
        console.log(that.query)
      }, 1000 * 60 * 5)
    },
    handleSearch(noShow) {
      this.show = false
      if (!noShow) this.loading = true;
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query?.[key])) {
          params[key] = this.query?.[key]?.join?.(',')
        } else {
          params[key] = this.query?.[key]
        }
      }
      GetUPHCum(params, noShow).then((res) => {
        // this.$refs.OutputOverviewFullScreen.setData(staticData, this.query, true)
        let data = res?.ResData;
        if (res?.Success && data) {
          let obj = getData(data, params?.S_DataLevel)
          this.$refs?.OutputOverviewFullScreen?.setData?.(obj, this.query, true)
        }
        this.loading = false
      }).catch(error => { this.loading = false })
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-dialog__header {
    display: none;
  }

  .el-dialog__body {
    height: inherit;
    width: inherit;
    padding: 0;
    box-sizing: border-box;
  }
}
</style>
