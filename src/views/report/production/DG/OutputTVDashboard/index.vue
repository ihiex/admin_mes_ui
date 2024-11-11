<template>
  <div v-loading="loading" class="tv_dashboard">
    <div class="select_container">
      <el-select v-model="query.S_LineID" style="width: 250px" clearable placeholder="" size="medium" filterable
        multiple collapse-tags :reserve-keyword="true" @change="handleLineChange" @visible-change="handleVisibleChange">
        <el-option v-for="item in LineOptions" :key="item.ID" :label="item.LineName" :value="item.ID"></el-option>
      </el-select>
    </div>
    <OutputBar ref="OutputBar" style="height: 100%;" @LastCarousel="handleLastCarousel"></OutputBar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import OutputBar from '@/components/chart/OutputBar'
import { GetUPH } from '@/api/report.js'
import { getShift, getUserShift } from '@/utils'

/* 产出TV看板 */
export default {
  name: 'OutputTVDashboard',
  components: {
    OutputBar
  },
  data() {
    let shift = getShift(this.$store.getters['user/shiftTable'])
    return {
      title: '电视看板产出',
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
      loading: false,
      time: null,
      visible: false,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
      LineOptions: 'common/LineOptions',
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
    this.handleSearch(true)
    this.GetLine()
  },
  methods: {
    ...mapActions({
      GetLine: 'common/setLineOptions',
    }),
    handleVisibleChange(val) {
      this.visible = val
      if (!val) {
        this.handleLastCarousel(true)
      }
    },
    handleLineChange() {
      if (this.visible) return;
      let that = this
      if (that.time) {
        clearTimeout(that.time)
        that.time = null
      }
      that.time = setTimeout(function () {
        that.handleLastCarousel(true)
        clearTimeout(that.time)
        that.time = null
      }, 500)
    },

    handleLastCarousel(bool = false) {
      if (!this.isActivePage) return;
      let s = getUserShift(this.$store.getters['user/shiftTable']);
      let shift = getShift(this.$store.getters['user/shiftTable'])
      this.$set(this.query, 'S_StartDateTime', shift.sTime)
      this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.query, 'S_Shift', s)
      this.handleSearch(bool)
    },
    handleResizeGather() {
        // this.handleLastCarousel()
        this.$refs.OutputBar.handleWindowResize()
    },

    handleSearch(showLoading) {
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      this.loading = showLoading
      GetUPH(params, true).then((res) => {
        this.loading = false
        let data = res.ResData;
        if (res.Success && data) {
          this.isActivePage && this.$refs.OutputBar.show(data, this.query.S_DataLevel, this.query.S_Shift, this.query.S_EndDateTime, this.query)
        } else {
          this.isActivePage && this.$refs.OutputBar.show([], this.query.S_DataLevel, this.query.S_Shift, this.query.S_EndDateTime, this.query)
        }
      }, error => {
        this.isActivePage && this.$refs.OutputBar.show([], this.query.S_DataLevel, this.query.S_Shift, this.query.S_EndDateTime, this.query)
      }).catch(error=>{
        this.isActivePage && this.$refs.OutputBar.show([], this.query.S_DataLevel, this.query.S_Shift, this.query.S_EndDateTime, this.query)
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
  position: relative;

  .select_container {
    position: absolute;
    top: 3px;
    left: calc(50% - 125px);
    z-index: 100;
  }
}
</style>
