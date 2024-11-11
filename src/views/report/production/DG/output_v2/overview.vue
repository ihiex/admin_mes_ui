<template>
  <div class="page_container">
    <div class="table_content">
      <div
        style="height: 40px; line-height: 40px; color: black; font-size: 24px; font-weight: 800; text-align: right; padding: 0 20px; user-select: none;">
        <span style="position: absolute; left: 10px">{{ title }} {{ getShiftText(query.S_Shift) }}</span>
        {{ query.S_EndDateTime }}
        <span style="margin-left: 20px;" @click="handleFullScreen">
          <vab-icon :icon="[
          'fas',
          isFullscreen ? 'compress-arrows-alt' : 'expand-arrows-alt',
        ]"></vab-icon>
        </span>
      </div>
      <div style="height: calc(100% - 40px);">
        <OutputV2Common ref="OutputV2Common" style="height: 100%;" size="mini" @setTitle="setTitle"></OutputV2Common>
      </div>
    </div>
    <FullScreen ref="RefFullScreen" @setFullScreen="setFullScreen"></FullScreen>
  </div>
</template>

<script>
// import QueryCondition from '@/components/QueryCondition'
import { mapGetters } from 'vuex'
import { GetUPHCum } from '@/api/report.js'
import OutputV2Common from './common/OutputV2Common'
import FullScreen from './common/fullScreen.vue'
import { getShift, getUserShift } from '@/utils'
import { getData } from './common/dataFormat'

//产出电视看板V2
export default {
  name: 'OutputTVDashboardV2',
  components: {
    // QueryCondition,
    OutputV2Common,
    FullScreen,
  },
  data() {
    let shift = getShift(this.$store?.getters?.['user/shiftTable'])
    return {
      show: false,
      query: {
        S_StartDateTime: /* new Date('2021-07-12 08:00:00').format('yyyy-MM-dd hh:mm:ss'),// */shift?.sTime,
        S_EndDateTime: /* new Date('2021-07-12 18:00:00').format('yyyy-MM-dd hh:mm:ss'),// */new Date()?.format?.('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: this.$store?.getters?.['user/userShiftTable'], //班次
        S_DataLevel: 4, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      loading: false,
      isFullscreen: false,
      time: null,
      title: '',
      // shiftText: 'AllShift'
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    isFullscreen: function (val, oval) {
      if (val) {
        if (this.time) {
          clearInterval(this.time)
          this.time = null
        };
      } else {
        let shift = getShift(this?.$store?.getters?.['user/shiftTable'])
        let s = getUserShift(this?.$store?.getters?.['user/shiftTable']);
        this.$set(this.query, 'S_StartDateTime', shift?.sTime)
        this.$set(this.query, 'S_EndDateTime', new Date()?.format?.('yyyy-MM-dd hh:mm:ss'))
        this.$set(this.query, 'S_Shift', s)
        this.handleSearch(true)

        this?.start()
      }
    },
    /* 'query.S_Shift': function (val, oval) {
      this.shiftText = this.getShiftText(val)
    } */
  },
  created() {
    this?.handleSearch(false)
    this?.start()
  },
  activated() {
    if (!this.time && !this.isFullscreen) {
      this?.start()
    }
  },
  deactivated() {
    if (this.time) {
      clearInterval(this.time)
      this.time = null
    }
  },
  methods: {
    getShiftText(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },
    setTitle(val) {
      this.title = val
    },

    setFullScreen(val) {
      this.isFullscreen = val;
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
      }, 1000 * 60 * 5)
    },

    handleFullScreen() {
      this.isFullscreen = !this.isFullscreen
      let params = JSON.parse(JSON.stringify(this.query))
      let shift = getShift(this?.$store?.getters?.['user/shiftTable'])
      let s = getUserShift(this?.$store?.getters?.['user/shiftTable']);
      this.$set(params, 'S_StartDateTime', shift?.sTime)
      this.$set(params, 'S_EndDateTime', new Date()?.format?.('yyyy-MM-dd hh:mm:ss'))
      this.$set(params, 'S_Shift', s)
      this.$refs?.RefFullScreen?.handleShow?.(params, this.isFullscreen)
    },

    handleSearch(noShow) {
      this.show = false
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query?.[key])) {
          params[key] = this.query?.[key]?.join(',')
        } else {
          params[key] = this.query?.[key]
        }
      }
      GetUPHCum(params, noShow).then((res) => {
        let data = res?.ResData;
        if (res?.Success && data) {
          let obj = getData(data, params?.S_DataLevel)
          this.$refs?.OutputV2Common?.setData(obj, this.query, true, data)
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

  .table_content {
    // height: calc(100vh - 230px);
    margin: 0;
    padding: 0;
    height: inherit;
    overflow: auto;
  }
}
</style>
