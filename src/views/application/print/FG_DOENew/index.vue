<template>
  <div v-if="IsLegalPage" class="app_container">
    <z-column direction="row" :min="5" :max="300" :pane-length-percent.sync="paneLengthPercent" :is-show-down="isUnfold"
      :title-style="{ width: '5px' }">
      <div slot="one" style="height: inherit; width: 100%;">
        <z-row direction="column" :min="5" :max="300" :trigger-length="22" :pane-length-percent.sync="paneLengthPercent1"
          :title="$t('InputData')" :title-style="{ 'line-height': '22px' }">
          <div slot="one" style="height: 100%; overflow: hidden;">
            <div class="query_bar">
              <div class="query_bar_title clearfix">
                <span>
                  {{ ApplicationType }}
                </span>
                <div>
                  <span v-show="colorValue" class="color_value"
                    :style="{ 'background-color': `rgb(${colorValue})` }"></span>
                  <span style="font-size: 16px">{{ color }}</span>

                  <el-button class="unfold_btn" type="text" size="mini" :icon="isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
                    " @click="isUnfold = !isUnfold"></el-button>
                </div>
              </div>
              <div v-if="IsCheckPN" class="query_box">
                <transition name="slide-fade">
                  <div>
                    <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                      :is-show-work-order="true" :is-show-line="true" :is-show-status="false"
                      @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm" @Reset="handleQueryReset"
                      @setPartItem="handlePartItem"></MesQuery>
                  </div>
                </transition>
              </div>
            </div>
          </div>
          <div slot="two" style="height: 100%;">
            <z-row direction="column" :min="5" :max="300" :trigger-length="22"
              :pane-length-percent.sync="paneLengthPercent2" :title="$t('message')"
              :title-style="{ 'line-height': '22px' }">
              <div slot="one" style="height: 100%; overflow: auto; display: flex;">
                <div class="input_data" style="height: inherit;">
                  <!-- 录入信息 -->
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <!-- <div class="form_box sidebar"> -->
                        <div style="width: 92%;">
                          <el-form ref="ruleForm" :model="query" :rules="rules" label-width="100px" class="demo-ruleForm">
                            <el-form-item :label="$t('templateName')" prop="templateName">
                              <el-input ref="BoxSNInput" v-model.trim="query.templateName" autocomplete="off" clearable
                                :disabled="true"></el-input>
                            </el-form-item>
                            <el-row :gutter="0" style="margin: 0; padding: 0;">
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item label="ColoCode" prop="ET">
                                  <el-select v-model="query.ET" placeholder="" style="width: 100%" :disabled="!lock">
                                    <el-option v-for="item in listET" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item label="Build(0-9)" prop="B">
                                  <el-input v-model.trim="query.B" autocomplete="off" clearable
                                    :disabled="!lock"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row>
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item label="CCCC(4)" prop="SPAC">
                                  <el-input v-model.trim="query.SPAC" autocomplete="off" clearable
                                    :disabled="!lock"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item label="PP(2)" prop="PP">
                                  <el-input v-model.trim="query.PP" autocomplete="off" clearable
                                    :disabled="!lock"></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-row :gutter="0" style="margin: 0; padding: 0;">
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('printCount')" prop="I_QTY" style="padding: 0; margin: 0;">
                                  <el-input ref="snInput" v-model.number="query.I_QTY" autocomplete="off" clearable
                                    type="number">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('ProjectedQty')" prop="PredictQTY">
                                  <el-input ref="snInput" v-model.number="query.PredictQTY" autocomplete="off" clearable
                                    type="number" :disabled="!lock">
                                  </el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                          </el-form>
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_number">
                                  <span style="position: absolute; left: 20px; top: 7px">
                                    <el-switch v-model="lock" :active-text="$t('open')" :inactive-text="$t('lock')">
                                    </el-switch>
                                  </span>
                                  <print-button ref="PrintButton" @IsConnectPrint="handleConnectPrint"
                                    @error="handleSocketError" @success="handleSocketMsg"></print-button>
                                  <el-button type="primary" style="margin-top: 1px;" :disabled="!isConnectPrint"
                                    @click="handleCreateAndPrint('ruleForm')">
                                    {{ $t('createAndPrint') }}
                                  </el-button>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                        <!-- </div> -->
                        <i class="sideslip_btn" :class="{
                          'el-icon-caret-right': sideslipFlag,
                          'el-icon-caret-left': !sideslipFlag,
                        }" @click="sideslipFlag = !sideslipFlag"></i>
                      </div>
                      <div v-if="sideslipFlag" class="sn_container_right">
                        <div>
                          <p v-for="(item, index) in SNList" :key="index" style="padding: 0 10px">
                            {{ item }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
                  <div id="ShowHint" class="show_hint">
                    <div>
                      <p v-for="(item, index) in hintInfos" :key="index"
                        :class="item.result == 'error' ? 'danger_info' : 'success_info'">
                        {{ item.msg }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </z-row>
          </div>
        </z-row>
      </div>
      <div slot="two" style="height: inherit;">
        <div style="overflow: hidden; position: absolute; right: 0; width: 100%; height: inherit;">
          <right-info-split :progress="progress" :completed="completed" :target="target" :quantity-value="quantity"
            :reject-quantity-value="rejectQuantity" :scrap-quantity-value="scrapQuantity"
            :craft-table-value="craftTableData" :table-value="BOMtableData" :order-desc="pOrderDesc" @reset="handleReset">
          </right-info-split>
        </div>
      </div>
    </z-column>
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'
import {
  PrintPageInitialize,
  PrintSetConfirmPO,
  PrintCreateSN
} from '@/api/application.js'

//FG_DOENew打印
export default {
  name: 'PrintFGDOENew',
  mixins: [StationMixin],
  data() {
    var checkQty = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('printQuantityCannotBeEmpty')));
      } else if (!Number.isInteger(value) || value <= 0) {
        callback(new Error(this.$t('InvalidInteger')));
      } else {
        callback();
      }
    };
    var CheckPredictQTY = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('canNotBeEmptyOrZero')));
      } else if (!Number.isInteger(value) || value < 0) {
        callback(new Error(this.$t('InvalidInteger')));
      } else {
        callback();
      }
    };
    return {
      SNList: [],
      sideslipFlag: true,
      webSocket: null,
      rules: {
        I_QTY: [
          { validator: checkQty, trigger: 'blur' }
        ],
        ET: [
          { required: true, message: this.$t('common.placeholder'), trigger: 'change' }
        ],
        B: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' },
        ],
        SPAC: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' },
          { min: 4, message: this.$t('NotLessThenChar', { 0: 4 }), trigger: 'blur' }
        ],
        PP: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' },
          { min: 2, message: this.$t('NotLessThenChar', { 0: 2 }), trigger: 'blur' }
        ],
        PredictQTY: [
          { validator: CheckPredictQTY, trigger: 'blur' }
        ]
      },
      listET: [],
      lock: true
    }
  },
  watch: {
    isShowInfo(val, oval) {
      if (val) {
        this.$nextTick(function () {
          this.$refs.PrintButton.init(this.socketAddress)
        })
      }
    }
  },
  mounted() {
    this.$set(this.query, 'PredictQTY', 500)
  },
  methods: {
    //重置
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.$set(this.query, 'I_QTY', null)
      this.$set(this.query, 'Type', 'FG_DOENew')
      this.$set(this.query, 'templateName', '')
      this.$set(this.query, 'ET', '')
      this.$set(this.query, 'SPAC', '')
      this.$set(this.query, 'PredictQTY', 500)
      this.SNList = []
    },
    //创建并打印
    handleCreateAndPrint(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //添加确认提示
          this.$confirm(this.$t('printConfirm'), this.$t('hint'), {
            confirmButtonText: this.$t('confirm'),
            cancelButtonText: this.$t('cancel'),
            type: 'warning',
          })
            .then(() => {
              this.$set(this.query, 'Type', 'FG_DOENew')
              PrintCreateSN(this.query).then(res => {
                if (res.Success && res.ResData) {
                  this.SNList = res.ResData.ListSN
                  //格式 "PRINT|工站|SN|模板|料号"
                  let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${res.ResData.ListSN.join(',')}|${res.ResData.LabelPath}|${this.query.S_PartID}`
                  this.isConnectPrint && this.$refs.PrintButton.send(printStr)
                  this.$set(this.query, 'PredictQTY', this.query.PredictQTY - this.query.I_QTY)

                } else {
                  this.hintInfos.unshift({
                    msg: res.ResultMsg,
                    result: 'error',
                  })
                }
              }, (error) => {
                this.hintInfos.unshift({
                  msg: error.toString(),
                  result: 'error',
                })
              })
            })
            .catch(() => { })
        } else {
          return false;
        }
      });
    },
    handleConfirm(query) {
      let params = {}
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(',')
        } else {
          params[key] = query[key]
        }
      }
      this.$set(params, 'Type', 'FG_DOENew')
      this.BOMtableData = []
      this.craftTableData = []
      PrintSetConfirmPO(params, true, true).then(
        (res) => {
          let data = res.ResData
          if (res.Success && data) {
            this.disabledConfirm = true
            this.isDisable = true
            this.isShowInfo = true
            this.$set(this.query, 'templateName', data.LabelPath)
            this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : []
            this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
            this.listET = data.ET ? data.ET : []
            data.RouteDataDiagram1 && data.RouteDataDiagram1.forEach((element) => {
              let obj = this.craftTableData.find(
                (r) => r.StationTypeID === element.StationTypeID
              )
              if (obj) {
                if (obj.children) {
                  obj.children.push(element)
                } else {
                  obj.children = [element]
                }
              } else {
                this.craftTableData.push(element)
              }
            })
            if (data.ProductionOrderQTY) {
              this.completed = data.ProductionOrderQTY[0].currentCount || 0
              this.target = data.ProductionOrderQTY[0].prodCount || 0
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        },
        (error) => {
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        }
      )
    },
    GetPageInitialize() {
      PrintPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData[0]
          if (res.Success && data) {
            this.socketAddress = data.PrintIPPort ? data.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210'
            this.ApplicationType = data.ApplicationType;
            let pn = data.IsCheckPN
            let po = data.IsCheckPO
            let page = data.IsLegalPage
            this.IsCheckPN = pn === '1' ? true : false
            this.IsCheckPO = po === '1' ? true : false
            this.IsLegalPage = page === '1' ? true : false
            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t('TheSelectedPageDoesNotMatchTheSite'),
                type: 'warning',
                showClose: true,
              })
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        } catch (error) {
          this.IsCheckPN = false
          this.IsCheckPO = false
          this.IsLegalPage = false
          this.ApplicationType = false
        }
      })
    },
  },

}
</script>
<style lang="scss" scoped>
.box_number {
  min-width: 150px;
  text-align: right;
}
</style>
