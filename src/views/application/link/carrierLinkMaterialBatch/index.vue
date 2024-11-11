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
                  <el-button class="unfold_btn" type="text" size="mini"
                    :icon="isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="isUnfold = !isUnfold">
                  </el-button>
                </div>
              </div>
              <div v-if="IsCheckPN" class="query_box">
                <transition name="slide-fade">
                  <div>
                    <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                      :is-show-work-order="IsCheckPO" :is-disable-unit-status="false"
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
              <div slot="one" style="height: 100%; overflow-y: auto; display: flex;">
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div>
                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                            <!-- 托盘条码 -->
                            <el-row>
                              <el-col :span="24" style="margin-top: 5px">
                                <div class="box_container">
                                  <div class="box_title">{{ $t("TraySN") }}:</div>
                                  <div class="box_number">
                                    <el-input ref="BoxSNInput" v-model.trim="query.S_CarrierSN" autocomplete="off"
                                      clearable :disabled="isLockBoxSN" style="width: 90%"
                                      @keypress.native.enter="handleBoxSNEnter(query.S_CarrierSN)"></el-input>
                                  </div>
                                </div>
                              </el-col>
                            </el-row>
                            <!-- 批次条码 -->
                            <el-row>
                              <el-col :span="24">
                                <div class="box_container">
                                  <div class="box_title">{{ $t("BatchSN") }}:</div>
                                  <div class="box_number">
                                    <el-input ref="snInput" v-model.trim="query.S_BatchNumber" autocomplete="off"
                                      :disabled="snDisabled" clearable style="width: 90%"
                                      @keypress.native.enter="handleSNEnter(query.S_BatchNumber)">
                                    </el-input>
                                  </div>
                                </div>
                              </el-col>
                            </el-row>
                          </el-form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
                  <!-- <h3>{{ $t("message") }}</h3> -->
                  <!-- @mousedown.stop.prevent="handleShowHintMouse" -->
                  <div id="ShowHint" class="show_hint">
                    <!-- success_info -->
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
      <!-- 右侧 -->
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
import StationMixin from "../../mixin/mixin";
import {
  LinkGetPageInitializeAsync, //页面初始化
  LinkSetConfirmPOAsync,
  LinkCarrierSnVerifyAsync, //托盘SN
  LinkBatchNumberVerifyAsync, //批次条码
} from "@/api/application.js";

//托盘绑定条码
/* 
Carrier_S0001

TOR05F2823002105GW020107210006992
*/
export default {
  name: "CarrierLinkMaterialBatch",
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      snDisabled: true,
      drawer: false,
      isShowParams: true,
    };
  },
  methods: {
    //初始化
    GetPageInitialize() {
      // debugger
      LinkGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = res.ResData.CurrentInitPageInfo.IsLegalPage;
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
    //重置
    handleQueryReset() {
      this.disabledConfirm = false;
      this.isDisable = false;
      this.isShowInfo = false;
      this.$set(this.query, "S_BatchNumber", "");
      this.$set(this.query, "S_CarrierSN", "");
      this.isLockBoxSN = false;
      this.snDisabled = true;
    },
    //托盘条码
    handleBoxSNEnter(val) {
      let params = {}
      for (let key in this.query) {
        if (typeof this.query[key] == 'number') {
          this.$set(params, key, this.query[key] + '')
        } else if (Array.isArray(this.query[key])) {
          this.$set(params, key, this.query[key].join(','))
        } else {
          this.$set(params, key, this.query[key])
        }
      }
      LinkCarrierSnVerifyAsync(params, false, true).then(
        (res) => {
          try {
            if (res.Success && res.ResData) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              this.isLockBoxSN = true;
              this.snDisabled = false;
              this.$nextTick(function () {
                this.$refs.snInput.focus();
              });
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.$set(this.query, "S_CarrierSN", "");
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "S_CarrierSN", "");
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
              this.$set(this.query, "S_CarrierSN", "");
            }
          }
        },
        (error) => {
          document.querySelector("#NGPlay").play();
          this.hintInfos.unshift({
            msg: error.toString(),
            result: "error",
          });
        }
      );
    },
    //批次条码
    handleSNEnter(val) {
      let params = {}
      for (let key in this.query) {
        if (typeof this.query[key] == 'number') {
          this.$set(params, key, this.query[key] + '')
        } else if (Array.isArray(this.query[key])) {
          this.$set(params, key, this.query[key].join(','))
        } else {
          this.$set(params, key, this.query[key])
        }
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          LinkBatchNumberVerifyAsync(params, false, true).then(
            (res) => {
              try {
                if (res.Success && res.ResData) {
                  this.hintInfos.unshift({
                    msg: res.ResultMsg,
                    result: "success",
                  });
                  this.quantity++;

                  this.$set(this.query, "S_CarrierSN", "");
                  this.$set(this.query, "S_BatchNumber", "");
                  //托盘扫描成功后转入到批次
                  this.isLockBoxSN = false;
                  this.snDisabled = true;
                  this.$nextTick(function () {
                    this.$refs.BoxSNInput.focus();
                  });
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
              } finally {
                this.$set(this.query, "S_BatchNumber", "");
                if (res.Sounds === "OK") {
                  document.querySelector("#OKPlay").play();
                } else if (res.Sounds === "RE") {
                  document.querySelector("#REPlay").play();
                } else {
                  document.querySelector("#NGPlay").play();
                }
              }
            },
            (error) => {
              document.querySelector("#NGPlay").play();
              this.hintInfos.unshift({
                msg: error.toString(),
                result: "error",
              });
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleConfirm(query) {
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
      LinkSetConfirmPOAsync(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.UniversalConfirmPoOutput.MesProductStructures;
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';

              data.UniversalConfirmPoOutput.RouteDataDiagram1.forEach((element) => {
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
              this.completed = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].currentCount || 0;
              this.target = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].prodCount || 0;
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
  },
};
</script>
