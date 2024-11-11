<template>
  <div>
    <el-row :gutter="20">
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('StartDateTime') }}</el-col>
        <el-col :span="16" class="search_box">
          <!-- :picker-options="startPickerOptions" -->
          <el-date-picker
            v-model="query.S_StartDateTime"
            type="datetime"
            style="width: 250px"
            clearable
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleStartDatePicker"
          ></el-date-picker>
        </el-col>
      </el-col>
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('EndDateTime') }}</el-col>
        <el-col :span="16" class="search_box">
          <!-- :picker-options="endPickerOptions" -->
          <el-date-picker
            v-model="query.S_EndDateTime"
            type="datetime"
            style="width: 250px"
            clearable
            size="medium"
            value-format="yyyy-MM-dd HH:mm:ss"
            @change="handleEndDatePicker"
          ></el-date-picker>
        </el-col>
      </el-col>
      <!-- 产品大类 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">
          {{ $t('PartFamilyType') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_PartFamilyTypeID"
            style="width: 250px"
            clearable
            placeholder=""
            filterable
            multiple
            size="medium"
            collapse-tags
            :reserve-keyword="true"
            @change="handlePartFamilyTypeChange"
            @clear="handlePartFamilyTypeClear"
          >
            <el-option
              v-for="item in PartFamilyTypeOptions"
              :key="item.ID"
              :label="item.PartFamilyType"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 产品小类 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('PartFamily') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_PartFamilyID"
            style="width: 250px"
            clearable
            placeholder=""
            filterable
            size="medium"
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handlePartFamilyChange"
            @clear="handlePartFamilyClear"
            @visible-change="handlePartFamilyVisibleChange"
          >
            <el-option
              v-for="item in PartFamilyOptions"
              :key="item.ID"
              :label="item.PartFamilyType"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 料号 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('PartNumber') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_PartID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handlePartNumberChange"
            @clear="handlePartNumberClear"
            @visible-change="handlePartNumberVisibleChange"
          >
            <el-option
              v-for="item in PartNumberOptions"
              :key="item.ID"
              :label="item.PartNumber"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工单 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">
          {{ $t('ProductionOrder') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_ProductionOrderID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleProductionOrderChange"
            @visible-change="handleProductionOrderVisibleChange"
          >
            <el-option
              v-for="item in ProductionOrderOptions"
              :key="item.ID"
              :label="item.ProductionOrder"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工序 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('WorkStage') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_StationTypeID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleStationTypeChange"
            @clear="handleStationTypeClear"
          >
            <el-option
              v-for="item in StationTypeOptions"
              :key="item.ID"
              :label="item.StationType"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工站 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('Station') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_StationID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleStationChange"
            @visible-change="handleStationVisibleChange"
          >
            <el-option
              v-for="item in StationOptions"
              :key="item.ID"
              :label="item.Station"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 线别 -->
      <el-col
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('Line') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_LineID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleLineChange"
          >
            <el-option
              v-for="item in LineOptions"
              :key="item.ID"
              :label="item.LineName"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>

      <!-- 过站状态 -->
      <el-col
        v-if="isShowDataLevel"
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('UnitState') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select
            v-model="query.S_UnitStateID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleStationStateChange"
          >
            <el-option
              v-for="item in StationState"
              :key="item.ID"
              :label="item.UnitState"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 过站结果 -->
      <el-col
        v-if="isShowDataLevel"
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">{{ $t('UnitStatus') }}</el-col>
        <el-col :span="16" class="search_box">
           <el-select
            v-model="query.S_UnitStatusID"
            style="width: 250px"
            clearable
            placeholder=""
            size="medium"
            filterable
            multiple
            collapse-tags
            :reserve-keyword="true"
            @change="handleUnitStateChange"
          >
            <el-option
              v-for="item in UnitState"
              :key="item.ID"
              :label="item.UnitStatus"
              :value="item.ID"
            ></el-option>
          </el-select>
        </el-col>
      </el-col>
       <!-- 班次 -->
       <el-col v-if="isShowShift" :sm="24" :md="{span: 12, offset: 2}" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('Shift') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.Shift" style="width: 250px" clearable placeholder="" size="medium" filterable
            multiple collapse-tags @change="handleShiftChange">
            <el-option v-for="item in ShiftOptions" :key="item.ID" :label="item.Shift" :value="item.ID"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 良率层级 -->
      <el-col v-if="isShowYieldLevel" :sm="24" :md="{span: 12, offset: 2}" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('YieldLevel') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.YieldLevel" placeholder="" style="width: 250px" size="medium" clearable
            @change="handleYieldLevelChange">
            <el-option v-for="item in YieldLevelOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 是否合并良率 -->
      <el-col v-if="isShowIsCombineYield" :sm="24" :md="{span: 12, offset: 2}" :lg="{ span: 8, offset: 2 }" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('CombineYield') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.IsCombineYield" placeholder="" style="width: 250px" size="medium"
            @change="handleIsCombineYieldChange">
            <el-option v-for="item in IsCombineYieldOptions" :key="item.value" :label="item.label"
              :value="item.value"></el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- sn -->
      <el-col
        v-if="isShowDataLevel"
        :sm="24"
        :md="{span: 12, offset: 2}"
        :lg="{ span: 8, offset: 2 }"
        :xl="{ span: 8, offset: 2 }"
        class="zy_box"
      >
        <el-col :span="8" class="search_desc">SN</el-col>
        <el-col :span="16" class="search_box">
          <el-input
            v-model.trim="query.S_SNs"
            size="medium"
            style="width: 250px"
            placeholder=""
            @change="handleSNChange"
          >
            <template slot="suffix">
              <el-popover placement="bottom" trigger="click">
                <i
                  slot="reference"
                  class="el-icon-view sn_eye"
                  @click="handleShowSN"
                ></i>
                <el-input
                  v-model="filterValue"
                  clearable
                  style="margin-bottom: 10px; width: 250px"
                  size="mini"
                  @input="handleFilterSN"
                >
                  <template slot="prefix">
                    <i class="el-icon-search search_icon"></i>
                  </template>
                </el-input>
                <el-button size="mini" style="margin-left: 20px" @click="handleRemoveAllSN">{{$t('removeAll')}}</el-button>
                <el-table :data="gridData" height="300" size="mini">
                  <el-table-column
                    min-width="280"
                    property="SN"
                    label="SN"
                  ></el-table-column>
                  <el-table-column
                    :label="$t('remove')"
                    width="70"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <i
                        class="el-icon-close remove_btn"
                        @click="handleRemoveSN(scope.row.index)"
                      ></i>
                    </template>
                  </el-table-column>
                </el-table>
              </el-popover>
            </template>
          </el-input>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
/*
TT-报表 查询条件组件
*/
export default {
  name: 'TTQuery',
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
    isShowYieldLevel: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    isShowShift: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    isShowIsCombineYield: {
      type: Boolean,
      default: () => {
        return true
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
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_UnitStateID: null,
        S_UnitStatusID: null,
        S_SNs: '',
        IsCombineYield: 0,
        YieldLevel: null,
        Shift: '',
      },
      startPickerOptions: {
        disabledDate: startDisabledDate,
      },
      endPickerOptions: {
        disabledDate: endDisabledDate,
      },
      gridData: [],
      catchGridData: [],
      splitFlag: ' ',
      filterValue: '',
    }
  },
  computed: {
    ...mapGetters({
      PartFamilyTypeOptions: 'common/PartFamilyTypeAll',
      catchPartFamilyOptions: 'common/PartFamilyAll',
      catchPartNumberOptions: 'common/PartNumberAll',
      catchProductionOrderOptions: 'common/ProductionOrderAll',
      StationTypeOptions: 'common/StationTypeAll',
      catchStationOptions: 'common/StationAll',
      LineOptions: 'common/LineAll',
      UnitState: 'common/UnitState', //单元状态
      StationState: 'common/StationState', //过站状态
      ShiftOptions: 'common/ShiftOptions',
      YieldLevelOptions: 'common/YieldLevel',
      IsCombineYieldOptions: 'common/IsCombineYield',
    }),
  },
  watch: {
    value: function (val, oval) {
      for (let key in val) {
        if (val[key]) {
          this.$set(this.query, key, val[key])
        }
      }
    }
  },
  created() {
    if (JSON.stringify(this.value) != '{}') {
      for (let key in this.value) {
        if (this.value[key]) {
          this.$set(this.query, key, this.value[key])
        }
      }
    }
    //处理展开时下拉框不回显
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
    this.GetLine()
    this.GetUnitState()
    this.GetStationState()
    this.GetShift()
  },
  methods: {
    ...mapActions({
      GetPartFamilyType: 'common/setPartFamilyTypeAll',
      GetPartFamily: 'common/setPartFamilyAll',
      GetPart: 'common/setPartNumberAll',
      GetProductionOrder: 'common/setProductionOrderAll',
      GetStationType: 'common/setStationTypeAll',
      GetStation: 'common/setStationAll',
      GetLine: 'common/setLineAll',
      GetUnitState: 'common/setUnitState', //单元状态
      GetStationState: 'common/setStationState', //过站状态
      GetShift: 'common/setShiftOptions',

    }),
    handleShiftChange() {
      this.$emit('input', this.query)
    },
    handleYieldLevelChange() {
      this.$emit('input', this.query)
    },
    handleIsCombineYieldChange() {
      this.$emit('input', this.query)
    },
    handleRemoveAllSN(){
      this.$set(this.query, 'S_SNs', '');
      this.gridData = []
      this.$emit('input', this.query)
    },
    handleStationStateChange() {
      this.$emit('input', this.query)
    },
    handleUnitStateChange() {
      this.$emit('input', this.query)
    },

    handleFilterSN(val) {
      this.gridData = this.catchGridData.filter((res) => res.SN.includes(val))
    },
    handleRemoveSN(index) {
      this.gridData.splice(
        this.gridData.findIndex((item) => item.index === index),
        1
      )
      this.catchGridData.splice(
        this.catchGridData.findIndex((item) => item.index === index),
        1
      )
      let arr = this.catchGridData.map((res) => res.SN)
      this.$set(this.query, 'S_SNs', arr.join(this.splitFlag))
    },
    handleStartDatePicker() {
      this.$emit('input', this.query)
    },
    handleEndDatePicker() {
      this.$emit('input', this.query)
    },
    setData(item){
      Object.keys(item).forEach(key=>{
        this.$set(this.query, key, item[key])
      })
    },
    getData() {
      return this.query
    },
    handleShowSN() {
      this.filterValue = ''
      this.gridData = []
      let val = this.query.S_SNs
      this.splitFlag =
        val.indexOf(',') == -1 ? ' ' : val.indexOf(' ') == -1 ? ',' : ' '
      if (val) {
        let arr = val.split(this.splitFlag)
        //特殊处理
        for(let i = 0; i < arr.length; i++){
          if(arr[i] === 'COO:TH' || arr[i] === 'COO:CN'){
            arr[i] = arr[i] +','+ arr[i+1];
            arr.splice(i+1, 1);
            i--
          }
        }

        arr.forEach((el, i) => {
          el && this.gridData.push({ SN: el, index: i })
        })

        this.catchGridData = JSON.parse(JSON.stringify(this.gridData))
      }
    },
    handleSNChange(val) {
      this.$set(this.query,'S_SNs', val.replace(/ /g,','))
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
      this.$set(this.query, 'S_ProductionOrderID', [])
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

<style lang="scss" scoped>
.sn_eye {
  cursor: pointer;
  position: relative;
  top: 10px;
  left: -5px;
}
.remove_btn {
  cursor: pointer;
}
.search_icon {
  transform: rotate(90deg);
  position: relative;
  top: 5px;
}
</style>
