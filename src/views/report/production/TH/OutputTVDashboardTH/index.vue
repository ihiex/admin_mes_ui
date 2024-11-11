<template>
  <div v-loading="loading" class="tv_dashboard">
    <OutputBar ref="OutputBar" style="height: 100%;" @LastCarousel="handleLastCarousel"></OutputBar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import OutputBar from '@/components/chart/OutputBarTH'
import { GetUPH } from '@/api/report.js'
import { getShift, getUserShift } from '@/utils'

/* 产出TV看板 */
export default {
  name: 'OutputTVDashboardTH',
  components: {
    OutputBar
  },
  data() {
    let shift = getShift(this.$store.getters['user/shiftTable'])
    return {
      title: '泰国电视看板产出',
      query: {
        S_StartDateTime: shift.sTime, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: this.$store.getters['user/userShiftTable'], //班次
        S_DataLevel: 4, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      isActivePage: false,
      isShowLoading: true,
      loading: false,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      if (this.isActivePage) {
        this.handleResizeGather()
      }
    },
  },
  activated() {
    this.isActivePage = true
    this.handleResizeGather()
    window.addEventListener(
      'resize',
      this.$refs.OutputBar.handleWindowResize
    )
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener(
      'resize',
      this.$refs.OutputBar.handleWindowResize
    )
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    handleLastCarousel() {
      if (!this.isActivePage) return;
      let shift = getShift(this.$store.getters['user/shiftTable'])
      let s = getUserShift(this.$store.getters['user/shiftTable']);
      this.$set(this.query, 'S_StartDateTime', shift.sTime)
      this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.query, 'S_Shift', s)
      this.handleSearch(true)
    },
    handleResizeGather() {
      this.$refs.OutputBar.handleWindowResize()
    },

    handleSearch(noShow) {
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      GetUPH(params, noShow).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          this.isActivePage && this.$refs.OutputBar.show(data, this.query.S_DataLevel, this.query.S_Shift, this.query.S_EndDateTime, this.query)
        }
      })
    },
  },
}
</script>

<style lang="scss">
.tv_dashboard {
  background-color: #fff;
  height: inherit;
  overflow: auto;
}
</style>
