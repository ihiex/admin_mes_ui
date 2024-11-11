<template>
  <div>
    <el-row :gutter="20">
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('StartDateTime') }}</el-col>
        <el-col :span="16" class="search_box">
          <!-- :picker-options="startPickerOptions" -->
          <el-date-picker v-model="query.S_StartDateTime" type="datetime" style="width: 250px" size="medium"
            value-format="yyyy-MM-dd HH:mm:ss" @change="handleStartDatePicker"></el-date-picker>
        </el-col>
      </el-col>
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('EndDateTime') }}</el-col>
        <el-col :span="16" class="search_box">
          <!-- :picker-options="endPickerOptions" -->
          <el-date-picker v-model="query.S_EndDateTime" type="datetime" style="width: 250px" size="medium"
            value-format="yyyy-MM-dd HH:mm:ss" @change="handleEndDatePicker"></el-date-picker>
        </el-col>
      </el-col>
      <!-- 料号类别 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">
          {{ $t('PartFamilyType') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_PartFamilyTypeID" style="width: 250px" clearable placeholder="" filterable
            multiple size="medium" collapse-tags :reserve-keyword="true" @change="handlePartFamilyTypeChange"
            @clear="handlePartFamilyTypeClear">
            <el-option v-for="item in PartFamilyTypeOptions" :key="item.ID" :label="item.PartFamilyType"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 料号组 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('PartFamily') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_PartFamilyID" style="width: 250px" clearable placeholder="" filterable
            size="medium" multiple collapse-tags :reserve-keyword="true" @change="handlePartFamilyChange"
            @clear="handlePartFamilyClear" @visible-change="handlePartFamilyVisibleChange">
            <el-option v-for="item in PartFamilyOptions" :key="item.ID" :label="item.PartFamilyType"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 料号 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('PartNumber') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_PartID" style="width: 250px" clearable placeholder="" size="medium" filterable
            multiple collapse-tags :reserve-keyword="true" @change="handlePartNumberChange"
            @clear="handlePartNumberClear" @visible-change="handlePartNumberVisibleChange">
            <el-option v-for="item in PartNumberOptions" :key="item.ID" :label="item.PartNumber"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工单 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">
          {{ $t('ProductionOrder') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_ProductionOrderID" style="width: 250px" clearable placeholder="" size="medium"
            filterable multiple collapse-tags :reserve-keyword="true" @change="handleProductionOrderChange"
            @visible-change="handleProductionOrderVisibleChange">
            <el-option v-for="item in ProductionOrderOptions" :key="item.ID" :label="item.ProductionOrder"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工站类型 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('StationType') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_StationTypeID" style="width: 250px" clearable placeholder="" size="medium"
            filterable multiple collapse-tags :reserve-keyword="true" @change="handleStationTypeChange"
            @clear="handleStationTypeClear">
            <el-option v-for="item in StationTypeOptions" :key="item.ID" :label="item.StationType"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工站 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('Station') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_StationID" style="width: 250px" clearable placeholder="" size="medium" filterable
            multiple collapse-tags :reserve-keyword="true" @change="handleStationChange"
            @visible-change="handleStationVisibleChange">
            <el-option v-for="item in StationOptions" :key="item.ID" :label="item.Station" :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 产线 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('Line') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_LineID" style="width: 250px" clearable placeholder="" size="medium" filterable
            multiple collapse-tags :reserve-keyword="true" @change="handleLineChange">
            <el-option v-for="item in LineOptions" :key="item.ID" :label="item.LineName" :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 班次 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('Shift') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_Shift" style="width: 250px" clearable placeholder="" size="medium" filterable
            multiple collapse-tags @change="handleShiftChange">
            <el-option v-for="item in ShiftOptions" :key="item.ID" :label="item.Shift" :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 时间类型 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('TimeType') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_DataType" placeholder="" style="width: 250px" size="medium"
            @change="handleTimeTypeChange">
            <el-option v-for="item in timeOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 数据层级 -->
      <el-col v-if="isShowDataLevel" :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }"
        class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('dataLevel') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_DataLevel" placeholder="" style="width: 250px" size="medium"
            @change="handleDataLevelChange">
            <el-option v-for="item in dataLevelOptions" :key="item.ID" :label="item.DataLevel"
              :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 良率层级 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('YieldLevel') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.YieldLevel" placeholder="" style="width: 250px" size="medium"
            @change="handleYieldLevelChange">
            <el-option v-for="item in YieldLevelOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 是否合并良率 -->
      <el-col :sm="24" :md="12" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('CombineYield') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.IsCombineYield" placeholder="" style="width: 250px" size="medium"
            @change="handleIsCombineYieldChange">
            <el-option v-for="item in IsCombineYieldOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
/*
报表查询组件
*/
export default {
  name: 'QueryCondition',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isShowDataLevel: {
      type: Boolean,
      default: () => {
        return false
      },
    },
  },
  data() {
    let that = this
    let nDate = new Date()
    function startDisabledDate(date) {
      return new Date(date) >= nDate
    }
    function endDisabledDate(date) {
      let d = new Date(date)
      d.setDate(d.getDate() + 1)
      return d <= new Date(that.query.S_StartDateTime) || new Date(date) > nDate
    }
    return {
      PartFamilyOptions: this.catchPartFamilyOptions,
      PartNumberOptions: this.catchPartNumberOptions,
      ProductionOrderOptions: this.catchProductionOrderOptions,
      StationOptions: this.catchStationOptions,
      query: {
        S_StartDateTime: new Date().format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: null, //班次
        S_DataLevel: 2,
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      startPickerOptions: {
        disabledDate: startDisabledDate,
      },
      endPickerOptions: {
        disabledDate: endDisabledDate,
      },
    }
  },
  computed: {
    ...mapGetters({
      timeOptions: 'common/timeOptions',
      dataLevelOptions: 'common/dataLevelOptions',
      PartFamilyTypeOptions: 'common/PartFamilyTypeOptions',
      catchPartFamilyOptions: 'common/PartFamilyOptions',
      catchPartNumberOptions: 'common/PartNumberOptions',
      catchProductionOrderOptions: 'common/ProductionOrderOptions',
      StationTypeOptions: 'common/StationTypeOptions',
      catchStationOptions: 'common/StationOptions',
      LineOptions: 'common/LineOptions',
      ShiftOptions: 'common/ShiftOptions',
      YieldLevelOptions: 'common/YieldLevel',
      IsCombineYieldOptions: 'common/IsCombineYield',
    }),
  },

  created() {
    if (JSON.stringify(this.value) != '{}') {
      for (let key in this.value) {
        if (this.value[key]) {
          this.$set(this.query, key, this.value[key])
        }
      }
    }
    //处理展开时不下拉框不回显
    this.PartFamilyOptions = this.catchPartFamilyOptions
    this.PartNumberOptions = this.catchPartNumberOptions
    this.ProductionOrderOptions = this.catchProductionOrderOptions
    this.StationOptions = this.catchStationOptions
  },

  mounted() {
    this.GetPartFamilyType()
    this.GetPartFamily()
    this.GetPart()
    this.GetProductionOrder()
    this.GetStationType()
    this.GetStation()
    this.GetShift()
    this.GetLine()
    this.GetDataLevel()
  },
  methods: {
    ...mapActions({
      GetPartFamilyType: 'common/setPartFamilyTypeOptions',
      GetPartFamily: 'common/setPartFamilyOptions',
      GetPart: 'common/setPartNumberOptions',
      GetProductionOrder: 'common/setProductionOrderOptions',
      GetStationType: 'common/setStationTypeOptions',
      GetStation: 'common/setStationOptions',
      GetShift: 'common/setShiftOptions',
      GetLine: 'common/setLineOptions',
      GetDataLevel: 'common/setDataLevelOptions'
    }),
    handleStartDatePicker() {
      this.$emit('input', this.query)
    },
    handleEndDatePicker() {
      this.$emit('input', this.query)
    },
    setData(params){
      if (JSON.stringify(params) != '{}') {
      for (let key in params) {
        if (params[key]) {
          this.$set(this.query, key, params[key])
        }
      }
    }
    },
    getData() {
      return this.query
    },
    handleYieldLevelChange() {
      this.$emit('input', this.query)
    },
    handleIsCombineYieldChange() {
      this.$emit('input', this.query)
    },
    handleDataLevelChange() {
      this.$emit('input', this.query)
    },
    handleTimeTypeChange() {
      this.$emit('input', this.query)
    },
    handleShiftChange() {
      this.$emit('input', this.query)
    },
    handleLineChange() {
      this.$emit('input', this.query)
    },
    handleStationChange() {
      this.$emit('input', this.query)
    },
    handleProductionOrderChange() {
      this.$emit('input', this.query)
    },
    //料号过滤自己
    handlePartNumberVisibleChange() {
      if (this.query.S_PartFamilyID && this.query.S_PartFamilyID.length > 0) {
        this.PartNumberOptions = this.catchPartNumberOptions.filter((res) =>
          this.query.S_PartFamilyID.includes(res.PartFamilyID)
        )
      } else {
        this.PartNumberOptions = JSON.parse(
          JSON.stringify(this.catchPartNumberOptions)
        )
      }
    },
    //料号组过滤自己
    handlePartFamilyVisibleChange() {
      if (
        this.query.S_PartFamilyTypeID &&
        this.query.S_PartFamilyTypeID.length > 0
      ) {
        this.PartFamilyOptions = this.catchPartFamilyOptions.filter((res) =>
          this.query.S_PartFamilyTypeID.includes(res.PartFamilyTypeID)
        )
      } else {
        this.PartFamilyOptions = JSON.parse(
          JSON.stringify(this.catchPartFamilyOptions)
        )
      }
    },
    //工站展开时过滤自己
    handleStationVisibleChange() {
      if (this.query.S_StationTypeID && this.query.S_StationTypeID.length > 0) {
        this.StationOptions = this.catchStationOptions.filter((res) =>
          this.query.S_StationTypeID.includes(res.StationTypeID)
        )
      } else {
        this.StationOptions = JSON.parse(
          JSON.stringify(this.catchStationOptions)
        )
      }
    },
    //工单展开时过滤自己
    handleProductionOrderVisibleChange() {
      if (this.query.S_PartID && this.query.S_PartID.length > 0) {
        this.ProductionOrderOptions = this.catchProductionOrderOptions.filter(
          (res) => this.query.S_PartID.includes(res.PartID)
        )
      } else {
        this.ProductionOrderOptions = JSON.parse(
          JSON.stringify(this.catchProductionOrderOptions)
        )
      }
    },
    //工站类型 联动工站
    handleStationTypeClear() {
      this.$set(this.query, 'S_StationID', [])
      this.StationOptions = JSON.parse(JSON.stringify(this.catchStationOptions))
    },
    handleStationTypeChange(val) {
      this.handleStationTypeClear()
      this.$emit('input', this.query)
    },
    //料号 联动工单
    handlePartNumberChange(val) {
      this.handlePartNumberClear()
      this.$emit('input', this.query)
    },
    handlePartNumberClear() {
      this.$set(this.query, 'S_ProductionOrderID', [])
      this.ProductionOrderOptions = JSON.parse(
        JSON.stringify(this.catchProductionOrderOptions)
      )
    },
    //料号组 联动 料号
    handlePartFamilyClear() {
      this.$set(this.query, 'S_PartID', '')
      this.$set(this.query, 'S_ProductionOrderID', '')
      this.PartNumberOptions = JSON.parse(
        JSON.stringify(this.catchPartNumberOptions)
      )
      this.ProductionOrderOptions = JSON.parse(
        JSON.stringify(this.catchProductionOrderOptions)
      )
    },
    handlePartFamilyChange(val) {
      this.handlePartFamilyClear()
      this.$emit('input', this.query)
    },
    //料号类 联动料号组
    handlePartFamilyTypeClear() {
      this.$set(this.query, 'S_PartFamilyID', '')
      this.$set(this.query, 'S_PartID', '')
      this.$set(this.query, 'S_ProductionOrderID', '')
      this.PartNumberOptions = JSON.parse(
        JSON.stringify(this.catchPartNumberOptions)
      )
      this.PartFamilyOptions = JSON.parse(
        JSON.stringify(this.catchPartFamilyOptions)
      )
      this.ProductionOrderOptions = JSON.parse(
        JSON.stringify(this.catchProductionOrderOptions)
      )
    },
    handlePartFamilyTypeChange(val) {
      this.handlePartFamilyTypeClear()
      this.$emit('input', this.query)
    },
  },
}
</script>

<style lang="scss" scoped></style>
