<template>
  <div style="overflow: hidden;">
    <el-row :gutter="20">
      <!-- 料号类别 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">
          {{ $t('MaterialGroupType') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_PartFamilyTypeID" style="width: 220px" clearable placeholder="" filterable
            size="medium" collapse-tags :disabled="isDisable" @change="handlePartFamilyTypeChange"
            @clear="handlePartFamilyTypeClear">
            <el-option v-for="item in MesPartFamilyType" :key="item.ID" :label="item.Description" :value="item.ID">
              <div class="option_container">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 料号组 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('MaterialGroup') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_PartFamilyID" style="width: 220px" clearable placeholder="" filterable
            size="medium" collapse-tags :disabled="isDisable" @change="handlePartFamilyChange"
            @clear="handlePartFamilyClear">
            <el-option v-for="item in MesPartFamily" :key="item.ID" :label="item.Name" :value="item.ID">
              <div class="option_container">
                <span>{{ item.Name }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 料号 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('MaterialNum') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="partItem" style="width: 220px" clearable placeholder="" size="medium" value-key="ID"
            filterable collapse-tags :disabled="isDisable" @change="handlePartNumberChange"
            @clear="handlePartNumberClear">
            <el-option v-for="item in MesPart" :key="item.ID" :label="item.PartNumber" :value="item">
              <div class="option_container">
                <span>
                  <span style="
                      display: inline-block;
                      height: 15px;
                      width: 20px;
                      position: relative;
                      top: 3px;"
                      :style="{ 'background-color': `rgb(${item.ColorValue})` }"></span>
                  {{ item.PartNumber }}
                </span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 工单 -->
      <el-col v-if="isShowWorkOrder" :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }"
        class="zy_box">
        <el-col :span="8" class="search_desc">
          {{ $t('ProductionOrder') }}
        </el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_POID" style="width: 220px" clearable placeholder="" size="medium" filterable
            collapse-tags :disabled="isDisable" @change="handleProductionOrderChange">
            <el-option v-for="item in MesProductionOrder" :key="item.ID" :label="item.ProductionOrderNumber"
              :value="item.ID">
              <div class="option_container" >
                <span style="flex: 3;">{{ item.ProductionOrderNumber }}</span>
                <span style="flex: 4; margin: 0 10px; text-align: left; padding: 0 5px;">{{ item.Description }}</span>
                <span style="flex: 3;">{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 单元状态 -->
      <el-col v-if="isShowStatus" :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }"
        class="zy_box">
        <el-col :span="8" class="search_desc">{{ $t('Unit_State') }}</el-col>
        <el-col :span="16" class="search_box">
          <el-select v-model="query.S_UnitStatus" style="width: 220px" placeholder="" size="medium"
            :class="'unitStatusColor' + unitStatusID" filterable collapse-tags :disabled="isDisableUnitStatus"
            @change="handleUnitStateChange">
            <el-option v-for="item in LuUnitStatus" :key="item.ID" :label="item.Description" :value="item.ID" :disabled="item.ID === 4 || (isDisableUnitStatusByFail && item.ID === 2)">
              <div class="option_container" :class="'unitStatusColor' + item.ID" @click="handleUnitStateClick(item)">
                <span>{{ item.Description }}</span>
                <span>{{ item.ID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 线号 -->
      <el-col v-if="isShowWorkOrder || isShowLine" :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <el-col v-if="isShowLine" :span="8" class="search_desc">{{ $t('LineNumber') }}</el-col>
        <el-col v-if="isShowLine" :span="16" class="search_box">
          <el-select v-model="query.S_LineNumber" style="width: 220px" placeholder="" size="medium" filterable
            collapse-tags @change="handleLineChange">
            <el-option v-for="item in line" :key="item.ID" :label="item.LineName" :value="item.LineID">
              <div class="option_container">
                <span>{{ item.LineName }}</span>
                <span>{{ item.LineID }}</span>
              </div>
            </el-option>
          </el-select>
        </el-col>
      </el-col>
      <!-- 按钮 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
        <!-- <el-col :span="8" class="search_desc"></el-col> -->
        <el-col :span="16" :offset="10" style="text-align: right">
          <el-button size="mini" @click="handleReset">
            {{ $t('reset') }}
          </el-button>
          <el-button type="primary" size="mini" :disabled="disabledConfirm" @click="handleConfirm">
            {{ $t('confirm') }}
          </el-button>
        </el-col>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  MesGetPartFamily,
  MesGetPart,
  MesGetProductionOrder,
} from '@/api/common'
import { PrintMesLineGroup } from '@/api/application'

/*
Mes过站 查询条件组件
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
    disabledConfirm: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    isDisable: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    isShowWorkOrder: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    isDisableUnitStatus: {
      type: Boolean,
      default: () => {
        return true
      },
    },
    isDisableUnitStatusByFail: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    isShowLine: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isShowStatus: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },

  data() {
    return {
      MesPartFamily: [], //料号组
      MesPart: [], //料号
      MesProductionOrder: [], //工单
      query: {
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_POID: null, //工单
        S_UnitStatus: null,
        S_DefectID: null, //不良代码
      },
      unitStatusID: 1,
      partItem: null,
      line: [] //线号
    }
  },
  computed: {
    ...mapGetters({
      MesPartFamilyType: 'common/MesPartFamilyType', //料号组类别
      LuUnitStatus: 'common/LuUnitStatus', //单元状态
    }),
  },
  watch: {
    LuUnitStatus: function (val, oval) {
      this.$set(this.query, 'S_UnitStatus', val[0].ID)
      this.handleUnitStateClick(val[0])
    },
  },
  created() {
    if (JSON.stringify(this.value) != '{}') {
      for (let key in this.value) {
        if (this.value[key]) {
          this.$set(this.query, key, this.value[key])
        }
      }
    }
    this.value.S_PartFamilyTypeID &&
      this.getMesPartFamily(this.value.S_PartFamilyTypeID)
    this.value.S_PartFamilyID && this.getMesPart(this.value.S_PartFamilyID)
    this.value.S_PartID && this.getMesProductionOrder(this.value.S_PartID)
  },
  mounted() {
    this.GetPartFamilyType()
    this.GetUnitState()
    // this.handleGetLine()
  },
  methods: {
    handleReset() {
      this.$confirm(this.$t('isResetEnterInfo'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {

        this.$set(this.query, 'S_PartFamilyTypeID', '') //料号类别
        this.$set(this.query, 'S_PartFamilyID', '') //料号组
        this.$set(this.query, 'S_PartID', '') //料号
        this.$set(this.query, 'S_POID', '') //工单
        this.$set(this.query, 'S_UnitStatus', this.LuUnitStatus[0].ID) //
        this.$set(this.query, 'S_DefectID', '') //
        this.$set(this.query, 'S_POID', '') //
        this.query.S_LineNumber && this.$set(this.query, 'S_LineNumber', '') //线号
        this.unitStatusID = 1
        this.partItem = null
        this.$emit('input', this.query)
        this.$emit('Reset')
        this.$emit('setPartItem', { color: '', colorValue: '' })
        this.handlePartFamilyTypeClear()

      }).catch(() => {

      });
    },
    handleConfirm() {
      this.$emit('Confirm', this.query)
    },
    handleUnitStateClick(val) {
      if(val.ID === 4) return;
      this.$emit('UnitStateClickItem', val)
    },
    ...mapActions({
      GetPartFamilyType: 'common/setMesPartFamilyType', //料号组类别
      GetUnitState: 'common/setLuUnitStatus', //单元状态
    }),
    setData(value) {
      for (let key in value) {
        if (value[key]) {
          this.$set(this.query, key, value[key])
        }
      }
      let obj = this.MesPart.find((res) => res.ID === value.S_PartID)
      this.partItem = obj
    },
    /*
    获取料号组
    */
    getMesPartFamily(pid) {
      this.MesPartFamily = []
      MesGetPartFamily({ PartFamilyTypeID: pid }).then((res) => {
        if (res.Success) {
          this.MesPartFamily = [...res.ResData]
        }
      })
    },
    /*
    获取料号
    */
    getMesPart(pid) {
      this.MesPart = []
      MesGetPart({ PartFamilyID: pid }).then((res) => {
        if (res.Success) {
          this.MesPart = [...res.ResData]
        }
      })
    },
    /*
    获取工单
     */
    getMesProductionOrder(pid) {
      if (!pid) return
      this.MesProductionOrder = []
      MesGetProductionOrder({ PartID: pid }).then((res) => {
        if (res.Success) {
          this.MesProductionOrder = [...res.ResData]
        }
      })
    },
    handleUnitStateChange(val) {
      this.unitStatusID = val
      this.$emit('input', this.query)
    },

    getData() {
      return this.query
    },

    handleStationChange() {
      this.$emit('input', this.query)
    },
    handleProductionOrderChange(val) {
      this.$emit('input', this.query)
    },

    //料号 联动工单
    handlePartNumberChange(val) {
      this.handlePartNumberClear()
      this.getMesProductionOrder(val.ID)
      this.$set(this.query, 'S_PartID', val.ID)
      this.$emit('input', this.query)
      this.$emit('setPartItem', {
        color: val.Color,
        colorValue: val.ColorValue,
      })
    },
    handlePartNumberClear() {
      this.$set(this.query, 'S_POID', '')
      this.MesProductionOrder = []
    },
    //料号组 联动 料号
    handlePartFamilyClear() {
      this.partItem = null
      this.$set(this.query, 'S_PartID', '')
      this.$set(this.query, 'S_POID', '')
      this.MesPart = []
      this.MesProductionOrder = []
      this.$emit('setPartItem', {
        color: '',
        colorValue: '',
      })
    },
    handlePartFamilyChange(val) {
      this.handlePartFamilyClear()
      this.getMesPart(val)
      this.$emit('input', this.query)
    },
    //料号类 联动料号组
    handlePartFamilyTypeClear() {
      this.partItem = null
      this.$set(this.query, 'S_PartFamilyID', '')
      this.$set(this.query, 'S_PartID', '')
      this.$set(this.query, 'S_POID', '')
      this.$set(this.query, 'S_LineNumber', '')
      this.MesPartFamily = []
      this.MesPart = []
      this.MesProductionOrder = []
      this.line = []
    },
    handlePartFamilyTypeChange(val) {
      this.handlePartFamilyTypeClear()
      this.getMesPartFamily(val)
      this.isShowLine && this.handleGetLine(val)
      this.$emit('input', this.query)
    },
    //线号
    handleGetLine(val) {
      this.line = []
      PrintMesLineGroup({ LineType: 'M', PartFamilyTypeID: val }).then(res => {
        if (res.Success && res.ResData) {
          this.line = [...res.ResData]
        }
      })
    },
    handleLineChange(val) {
      this.$emit('input', this.query)
    }
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
