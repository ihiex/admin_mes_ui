<template>
  <div class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition v-model="query" :is-show-data-level="true"></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <el-button v-hasPermi="['DGOutputV2/ExportSourceData']" :icon="srcLoading ? 'el-icon-loading' : ''" :disabled="srcLoading" size="mini" @click="handleSrcDataExport">
          {{ $t('exportSourceData') }}
        </el-button>
         <el-button v-hasPermi="['DGOutputV2/ExportData']" :icon="loading ? 'el-icon-loading' : ''" :disabled="loading" size="mini" @click="handleExport">
          {{ $t('export') }}
        </el-button>
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
    <div class="table_content">
      <div
        style="position: relative; height: 40px; line-height: 40px; color: black; font-size: 24px; font-weight: 800;">
        <span style="padding-left: 10px;">{{ title }} {{ getShiftText(query.S_Shift) }}</span>
        <span style="position: absolute; right: 10px;">{{ query.S_EndDateTime }}</span>
      </div>
      <div v-loading="dataLoading" style="height: calc(100% - 40px); box-sizing: border-box">
        <OutputV2Common ref="OutputV2Common" size="mini" style="height: 100%;" @setTitle="setTitle"></OutputV2Common>
      </div>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/QueryCondition'
import { GetUPHCum } from '@/api/report.js'
import { getShift, getUserShift, sleep } from '@/utils'
import { getData } from './common/dataFormat.js'
import OutputV2Common from './common/OutputV2Common.vue'
// import { staticData } from './common/staticData.js'

//产出 报表V2
export default {
  name: 'OutputV2',
  components: {
    QueryCondition,
    OutputV2Common
  },
  data() {
    let shift = getShift(this.$store?.getters?.['user/shiftTable'])
    return {
      show: true,
      query: {
        S_StartDateTime: shift.sTime,
        S_EndDateTime: new Date()?.format?.('yyyy-MM-dd hh:00:00'),
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
      tableData: [],
      header: [],
      title: '',
      // shiftText: 'AllShift'
      dataLoading: false,
      srcLoading: false
    }
  },
  methods: {
    handleSrcDataExport(){
      this.srcLoading = true;
      this.srcLoading = this.$refs?.OutputV2Common?.handleSourceDataExport()
    },
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
    handleExport() {
      this.$refs?.OutputV2Common?.handleExport()
    },
    handleReset() {
      let shift = getShift(this?.$store?.getters?.['user/shiftTable'])
      let s = getUserShift(this?.$store?.getters?.['user/shiftTable']);
      this.$set(this.query, 'S_StartDateTime', shift?.sTime)
      this.$set(this.query, 'S_EndDateTime', new Date()?.format?.('yyyy-MM-dd hh:00:00'))
      this.$set(this.query, 'S_DataType', '0')
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
      this.$set(this.query, 'S_Shift', s) //班次
      this.$set(this.query, 'S_DataLevel', 4) //
    },
    handleSearch(noShow) {
      this.show = false
      // this.shiftText = this.getShiftText(this.query.S_Shift)

      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query?.[key])) {
          params[key] = this.query?.[key]?.join?.(',')
        } else {
          params[key] = this.query?.[key]
        }
      }
      !noShow && (this.dataLoading=true)
      // this.$refs.OutputV2Common.setData(staticData, this.query, false)
      GetUPHCum(params, true).then(async (res) => {
        let data = res?.ResData;
        if (res?.Success && data) {
          let obj = getData(data, params?.S_DataLevel)
          this.$refs?.OutputV2Common?.setData?.(obj, this.query, false, data[2])
        }
        this.dataLoading = false
      }).catch(error=>{
        this.dataLoading = false
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
    overflow: auto;
  }
}
</style>
