<template>
  <div class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition
              v-model="query"
              :is-show-data-level="true"
            ></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" size="mini" @click="handleSearch(false)">
          {{ $t('search') }}
        </el-button>
        <span v-if="!show" size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('unfold') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <span v-else size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('packUp') }}
          <i class="el-icon-arrow-up el-icon--right"></i>
        </span>
      </div>
    </div>
    <div style="width: 100%; height: 5px; background-color: #f6f8f9"></div>
    <div :class="{ table_content: !show, table_content_show: show }">
      <!--  <el-carousel class="chart_box" :autoplay="false" :interval="5000">
        <el-carousel-item
          v-for="item in carouselItem"
          :id="'UPHChartLine' + item"
          :key="item"
          :class="{ chart_item: !show, chart_item_show: show }"
        ></el-carousel-item>
      </el-carousel> -->
      <UPHChart
        ref="UPHChart"
        cid="UPHByLine"
        style="height: 100%"
        @prestrainUpdate="prestrainUpdate"
      />
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/QueryCondition'
import { mapGetters } from 'vuex'
import { GetUPH } from '@/api/report.js'
import UPHChart from '@/components/chart/UPHChart'
//UPH
export default {
  name: 'UPHPage',
  components: {
    QueryCondition,
    UPHChart,
  },
  data() {
    let sDate = new Date().format('yyyy-MM-dd 00:00:00')
    return {
      show: true,
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: null, //班次
        S_DataLevel: 2, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      time: null,
      chartContext: {},
      carouselItem: [],
      isActivePage: false,
    }
  },
  computed: {
    ...mapGetters({
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      this.isActivePage && this.$refs.UPHChart.handleWindowResize()
    },
    show: function () {
      this.isActivePage && this.$refs.UPHChart.handleWindowResize()
    },
  },
  created() {
    // this.handleSearch(false)
  },
  activated() {
    this.isActivePage = true
    this.$refs.UPHChart.handleWindowResize()
    window.addEventListener('resize', this.$refs.UPHChart.handleWindowResize)
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener('resize', this.$refs.UPHChart.handleWindowResize)
  },
  methods: {
    prestrainUpdate() {
      this.isActivePage && this.handleSearch(true, true)
    },
    handleReset() {
      let sDate = new Date().format('yyyy-MM-dd 00:00:00')
      this.$set(this.query, 'S_StartDateTime', sDate)
      this.$set(
        this.query,
        'S_EndDateTime',
        new Date().format('yyyy-MM-dd hh:mm:ss')
      )
      this.$set(this.query, 'S_DataType', '0')
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
      this.$set(this.query, 'S_Shift', null) //班次
      this.$set(this.query, 'S_DataLevel', 2) //
    },
    handleSearch(noShow, isClean) {
      this.show = false
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      if(this.isActivePage && !isClean){
        this.$refs.UPHChart.show([]) //清数据
      }
      GetUPH(params, noShow).then((res) => {
        if (res.Success) {
          this.isActivePage && this.$refs.UPHChart.show(res.ResData)
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
    height: calc(100vh - 230px);
    box-sizing: border-box;
  }
  .table_content_show {
    height: calc(100vh - 506px);
    box-sizing: border-box;
  }
}
</style>

