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
                  <el-button class="unfold_btn" type="text" size="mini" :icon="
                    isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
                  " @click="isUnfold = !isUnfold"></el-button>
                </div>
              </div>
              <div v-if="IsCheckPN" class="query_box">
                <transition name="slide-fade">
                  <div>
                    <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                      :is-show-work-order="IsCheckPO" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
                      @Reset="handleQueryReset" @setPartItem="handlePartItem"></MesQuery>
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
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container sn_input_box">
                      <div class="sn_container_left">
                        <!-- <div class="form_box"> -->
                          <el-row style="margin-top: 60px;">
                            <el-col :span="24">
                              <MesQueryValidate ref="MesQueryValidate" v-model="queryItem" :is-disable="isDisableValidate"
                                :is-show-work-order="true" @getValidateFlag="getValidateFlag"
                                @Confirm="handleValidateConfirm" @Reset="handleValidateReset"></MesQueryValidate>
                            </el-col>
                            <el-col v-show="validateFlag" :span="24">
                              <div class="box_container">
                                <div class="box_title">{{ $t('ScanSN') }}:</div>
                                <div class="box_number">
                                  <el-input ref="snInput" v-model.trim="queryItem.S_SN" autocomplete="off" clearable
                                    :disabled="snDisabled" style="width: 90%"
                                    @keypress.native.enter="handleSNEnter(queryItem.S_SN)"></el-input>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        <!-- </div> -->
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- @mousedown.stop.prevent="handleShowHintMouse" -->
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
                  <!-- <h3>{{ $t('message') }}</h3> -->
                  <div id="ShowHint" class="show_hint">
                    <!-- @click="handleClickMsg(item.msg)" -->
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

    <!--   <div id="HintMenu" class="hint_menu" @click="handleClearShowHint">
      {{ $t('cleanHintMsg') }}
    </div> -->
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'
import { CPGetPageInitialize, SetConfirmChangePOAndPN, ScanChangePOAndPN } from '@/api/application.js'
import MesQueryValidate from '@/components/Mes-Query/validate.vue'

//改变料号和工单
/*
G51JW001192V
G51JW002192V
G51JW003192V
G51JW004192V
G51JW005192V
G51JW006192V
G51JW007192V
G51JW008192V
G51JW009192V
G51JW00A192V
G54K5001192V
G55K5001192V
G51K6001192V
G51K6002192V
G51K6003192V
G51K6004192V
G51K6005192V
G51K6006192V
G51K6007192V
G51K6008192V
G51K602W192V
G51K605J192V
G51K6086192V
G51K60AU192V
G51K60DG192V
G51K60G4192V
G51K60JS192V
G51K60ME192V
G53K6001192V
G53K6002192V
G53K6047192V
G53K605Y192V

src:
S11
S11_FG
Part_S11_FG_BA(蓝10)
PO_S11_FG_BA(蓝10)

target:
S11
S11_FG
Part_S11_FG_BK(玄黑)
PO_S11_FG(玄黑)

*/
export default {
  name: 'ChangePOAndPN',
  components: {
    MesQueryValidate
  },
  mixins: [StationMixin],
  data() {
    return {
      validateFlag: false,
      isDisableValidate: false,
      queryItem: {}
    }
  },
  created() {
    this.$set(this.query, 'S_COF', '')
  },
  methods: {
    handleSNEnter(val) {
      if (!val) return;
      this.snDisabled = true
      ScanChangePOAndPN(JSON.parse(JSON.stringify(this.queryItem))).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "success",
            });

            this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
            this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "error",
            });
          }
        } catch (err) {
          this.hintInfos.unshift({
            msg: err,
            result: 'error',
          })
        } finally {
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
          }
          this.snDisabled = false
          this.$set(this.queryItem, 'S_SN', '')
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
        }
      })
    },
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.$set(this.query, 'S_COF', '')
      this.handleValidateReset()
    },
    handleValidateConfirm() {
      this.isDisableValidate = true
    },
    handleValidateReset() {
      this.isDisableValidate = false
      this.snDisabled = false
      this.$set(this.queryItem, 'S_SN', '')
    },
    getValidateFlag(bool) {
      this.validateFlag = bool
    },
    //初始化
    GetPageInitialize() {
      CPGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData[0]
            this.ApplicationType = obj.ApplicationType;
            let page = obj.IsLegalPage;
            this.IsCheckPN = obj.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = obj.IsCheckPO === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t("TheSelectedPageDoesNotMatchTheSite"),
                type: "warning",
                showClose: true,
              });
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "error",
            });
          }
        } catch (error) {
          this.IsCheckPN = false;
          this.IsCheckPO = false;
          this.IsLegalPage = false;
          this.ApplicationType = false;
        }
      });
    },
    handleConfirm(query) {
      //给目标赋值
      this.queryItem = JSON.parse(JSON.stringify(query))
      this.$set(this.queryItem, 'S_PartID_Target', query.S_PartID)
      this.$set(this.queryItem, 'S_POID_Target', query.S_POID)

      let params = {};
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(",");
        } else {
          params[key] = query[key];
        }
      }
      this.BOMtableData = [];
      this.craftTableData = [];
      this.completed = 0;
      this.target = 0;
      // debugger
      SetConfirmChangePOAndPN(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';
              this.$set(this.query, 'S_COF', data.COF)

              data.RouteDataDiagram1.forEach((element) => {
                let obj = this.craftTableData.find(
                  (r) => r.StationTypeID === element.StationTypeID
                );
                if (obj) {
                  if (obj.children) {
                    obj.children.push(element);
                  } else {
                    obj.children = [element];
                  }
                } else {
                  this.craftTableData.push(element);
                }
              });
              // 工单明细
              this.completed = data.ProductionOrderQTY[0].currentCount || 0;
              this.target = data.ProductionOrderQTY[0].prodCount || 0;
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
          }
        },
        (error) => {
          this.hintInfos.unshift({
            msg: error.toString(),
            result: "error",
          });
        }
      );
    },
  }
}
</script>

