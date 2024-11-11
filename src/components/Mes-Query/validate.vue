<template>
  <div style="overflow: hidden;">
    <el-row :gutter="20">
      <el-form ref="ruleForm" :model="query" :rules="rules" label-width="100px" class="demo-ruleForm">
        <!-- 料号类别 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item :label="$t('MaterialGroupType')" prop="S_PartFamilyTypeID">
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
          </el-form-item>
        </el-col>
        <!-- 料号组 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item :label="$t('MaterialGroup')" prop="S_PartFamilyID">
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
          </el-form-item>
        </el-col>
        <!-- 料号-->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item :label="$t('MaterialNum')" prop="S_PartID_Target">
            <el-select v-model="query.S_PartID_Target" style="width: 220px" clearable placeholder="" size="medium"
              filterable collapse-tags :disabled="isDisable" @change="handlePartNumberChange"
              @clear="handlePartNumberClear">
              <el-option v-for="item in MesPart" :key="item.ID" :label="item.PartNumber" :value="item.ID">
                <div class="option_container">
                  <span>
                    <span style="display: inline-block; height: 15px; width: 20px; position: relative; top: 3px;"
                      :style="{ 'background-color': `rgb(${item.ColorValue})` }"></span>
                    {{ item.PartNumber }}
                  </span>
                  <span>{{ item.ID }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 工单 -->
        <el-col v-if="isShowWorkOrder" :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item :label="$t('ProductionOrder')" prop="S_POID_Target">
            <el-select v-model="query.S_POID_Target" style="width: 220px" clearable placeholder="" size="medium"
              filterable collapse-tags :disabled="isDisable" @change="handleProductionOrderChange">
              <el-option v-for="item in MesProductionOrder" :key="item.ID" :label="item.ProductionOrderNumber"
                :value="item.ID">
                <div class="option_container">
                  <span style="flex: 3;">{{ item.ProductionOrderNumber }}</span>
                  <span style="flex: 3; margin: 0 15px;">{{ item.Description }}</span>
                  <span style="flex: 3;">{{ item.ID }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 单元状态 -->
        <el-col v-show="isShowStatus" :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item v-show="true" :label="$t('Unit_State')" prop="S_UnitStatus">
            <el-select v-model="query.S_UnitStatus" style="width: 220px" placeholder="" size="medium"
              :class="'unitStatusColor' + unitStatusID" filterable collapse-tags :disabled="isDisableUnitStatus"
              @change="handleUnitStateChange">
              <el-option v-for="item in LuUnitStatus" :key="item.ID" :label="item.Description" :value="item.ID"
                :disabled="item.ID === 4">
                <div class="option_container" :class="'unitStatusColor' + item.ID" @click="handleUnitStateClick(item)">
                  <span>{{ item.Description }}</span>
                  <span>{{ item.ID }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 线号 -->
        <!--   <el-col v-if="!isShowWorkOrder || isShowLine" :sm="24" :md="12" :lg="{ span: 8, offset: 2 }"
          :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item :label="$t('LineNumber')" prop="S_LineNumber">
            <el-select v-model="query.S_LineNumber" style="width: 220px" placeholder="" size="medium" filterable
              collapse-tags @change="handleLineChange">
              <el-option v-for="item in line" :key="item.ID" :label="item.LineName" :value="item.LineID">
                <div class="option_container">
                  <span>{{ item.LineName }}</span>
                  <span>{{ item.LineID }}</span>
                </div>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box">
          <el-form-item style="text-align: right;">
          </el-form-item>
        </el-col>
        <!-- 按钮 -->
        <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="{ span: 8, offset: 2 }" class="zy_box" style="">
          <el-form-item style="text-align: right;">
            <div style="width:220px">
              <el-button size="mini" @click="handleReset">
                {{ $t('reset') }}
              </el-button>
              <el-button type="primary" size="mini" :disabled="validateFlag" @click="handleConfirm('ruleForm')">
                {{ $t('confirm') }}
              </el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-form>

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
Mes过站 查询条件组件 带非空校验
*/
export default {
  name: 'TTQueryValidate',
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isDisable: { //是否禁用选择
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
    isShowLine: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isShowStatus: {
      type: Boolean,
      default: () => {
        return false
      }
    },
  },

  data() {
    return {
      MesPartFamily: [], //料号组
      MesPart: [], //料号
      MesProductionOrder: [], //工单
      query: {
        S_PartFamilyTypeID: '', //料号类别
        S_PartFamilyID: '', //料号组
        S_PartID_Target: '', //料号
        // partItem: null, //料号
        S_POID_Target: '', //工单
        S_UnitStatus: '',
        S_LineNumber: '', //线号
      },
      unitStatusID: 1,
      // partItem: null,
      line: [], //线号
      validateFlag: false,
      rules: {
        S_PartFamilyTypeID: [{ required: true, message: '不能为空', trigger: 'change' }],
        S_PartFamilyID: [{ required: true, message: '不能为空', trigger: 'change' }],
        S_PartID_Target: [{ required: true, message: '不能为空', trigger: 'change' }],
        S_POID_Target: [{ required: true, message: '不能为空', trigger: 'change' }],
      }
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
    this.value.S_PartID_Target && this.getMesProductionOrder(this.value.S_PartID_Target)
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
        this.$set(this.query, 'S_PartID_Target', '') //料号
        this.$set(this.query, 'S_POID_Target', '') //工单
        this.$set(this.query, 'S_UnitStatus', this.LuUnitStatus[0].ID) //
        this.query.S_LineNumber && this.$set(this.query, 'S_LineNumber', '') //线号
        this.unitStatusID = 1
        // this.partItem = null
        // this.$set(this.query, 'partItem', null) //
        this.$emit('input', this.query)
        this.$emit('Reset')
        // this.$emit('setPartItem', { color: '', colorValue: '' })
        this.handlePartFamilyTypeClear()
        this.validateFlag = false;
        this.$emit('getValidateFlag', this.validateFlag)
        this.$nextTick(function () {
          this.$refs.ruleForm.clearValidate()
        })
      }).catch(() => {

      });
    },
    handleConfirm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.validateFlag = true;
          this.$emit('getValidateFlag', this.validateFlag)
          this.$emit('Confirm', this.query)
        } else {
          this.validateFlag = false;
          this.$emit('getValidateFlag', this.validateFlag)
          return false;
        }
      });
    },
    handleUnitStateClick(val) {
      this.$emit('UnitStateClickItem', val)
    },
    ...mapActions({
      GetPartFamilyType: 'common/setMesPartFamilyType', //料号组类别
      GetUnitState: 'common/setLuUnitStatus', //单元状态
    }),
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
      this.getMesProductionOrder(val)
      this.$emit('input', this.query)
    },
    handlePartNumberClear() {
      this.$set(this.query, 'S_POID_Target', '')
      this.MesProductionOrder = []
    },
    //料号组 联动 料号
    handlePartFamilyClear() {
      this.$set(this.query, 'S_PartID_Target', '')
      this.$set(this.query, 'S_POID_Target', '')
      this.MesPart = []
      this.MesProductionOrder = []
      /*  this.$emit('setPartItem', {
         color: '',
         colorValue: '',
       }) */
    },
    handlePartFamilyChange(val) {
      this.handlePartFamilyClear()
      this.getMesPart(val)
      this.$emit('input', this.query)
    },
    //料号类 联动料号组
    handlePartFamilyTypeClear() {
      this.$set(this.query, 'S_PartFamilyID', '')
      this.$set(this.query, 'S_PartID_Target', '')
      this.$set(this.query, 'S_POID_Target', '')
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