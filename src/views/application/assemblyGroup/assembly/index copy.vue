<template>
  <div v-if="IsLegalPage" class="application page_container">
    <div class="left_container">
      <div class="query_bar">
        <div class="query_bar_title">
          <div class="query_bar_content">
            <span>
              {{ ApplicationType }}
            </span>
            <div>
              <span v-show="colorValue" class="color_value" :style="{ 'background-color': `rgb(${colorValue})` }"></span>
              <span style="font-size: 16px">{{ color }}</span>
              <el-button class="unfold_btn" type="text" size="mini"
                :icon="isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="isUnfold = !isUnfold">
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="IsCheckPN" class="query_box">
          <transition name="slide-fade">
            <div>
              <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                :is-show-work-order="IsCheckPO" :is-disable-unit-status="true" @UnitStateClickItem="UnitStateClickItem"
                @Confirm="handleConfirm" @Reset="handleQueryReset" @setPartItem="handlePartItem"></MesQuery>
            </div>
          </transition>
        </div>
      </div>
      <div class="over_station">
        <z-row direction="column" :min="5" :max="300" :trigger-length="22" :pane-length-percent.sync="paneLengthPercent"
          :title="$t('message')" :title-style="{ 'line-height': '22px' }">
          <div slot="one" style="height: 100%; display: flex;">
            <div class="input_data" style="height: inherit;">
              <h3>
                {{ $t("InputData") }}
              </h3>
              <div v-if="isShowInfo">
                <div class="sn_container">
                  <div class="sn_container_left">
                    <div>
                      <el-form ref="ruleForm" :model="query" :rules="rules" label-width="100px" class="demo-ruleForm">
                        <!-- 主条码 -->
                        <el-row>
                          <el-col :span="24" style="margin-top: 5px">
                            <div class="box_container">
                              <div class="box_title">{{ $t("MainSN") }}:</div>
                              <div class="box_number">
                                <el-input ref="BoxSNInput" v-model.trim="query.MainSN" autocomplete="off" clearable
                                  :disabled="isLockBoxSN" style="width: 70%"
                                  @keypress.native.enter="handleBoxSNEnter(query.MainSN)"></el-input>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                        <!-- 组装条码 -->
                        <el-row>
                          <el-col :span="24">
                            <div class="box_container">
                              <div class="box_title">{{ $t("AssemblySN") }}:</div>
                              <div class="box_number">
                                <el-input ref="snInput" v-model.trim="childSN" autocomplete="off" :disabled="snDisabled"
                                  clearable style="width: 70%" @keypress.native.enter="handleSNEnter(childSN)">
                                </el-input>
                                <el-button size="mini" style="margin: 5px 0 0 5px" @click="handleMsgReset">
                                  {{ $t("reset") }}
                                </el-button>
                                <div style="color: #13ce66; font-size: 12px; margin-top: 3px">
                                  <span v-for="(item, index) in childSNList" :key="index" style="display: inline-block">{{
                                    item
                                  }}{{ childSNList.length - 1 != index ? "," : "" }}</span>
                                </div>
                              </div>
                            </div>
                          </el-col>
                        </el-row>
                        <!-- 参数 -->
                        <el-row v-if="operation" :gutter="1">
                          <el-col :span="24">
                            <div class="box_container">
                              <div class="box_title">
                                {{ $t("Parameter") }}
                                <div>
                                  <el-switch v-model="isShowParams" active-color="#13ce66" inactive-color="#ccc">
                                  </el-switch>
                                </div>
                              </div>
                              <div class="box_number">
                                <el-col :lg="24" :xl="12">
                                  <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom: 0px">
                                    <el-form-item label="ColorCode" prop="sColorCode">
                                      <el-select v-model="query.sColorCode" placeholder="" :disabled="!isShowParams"
                                        style="min-width: 40px; width: 70%">
                                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                                        </el-option>
                                      </el-select>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom: 0px">
                                    <el-form-item label="Build(0-9)" prop="sBuildCode">
                                      <el-input v-model.trim="query.sBuildCode" style="min-width: 40px; width: 70%"
                                        :disabled="!isShowParams"></el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-col>
                                <el-col :lg="24" :xl="12">
                                  <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom: 0px">
                                    <el-form-item label="CCCC(4)" prop="sSpcaCode">
                                      <el-input v-model.trim="query.sSpcaCode" style="min-width: 40px; width: 70%"
                                        :disabled="!isShowParams"></el-input>
                                    </el-form-item>
                                  </el-col>
                                  <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" style="margin-bottom: 0px">
                                    <el-form-item label="PP(2)" prop="sPpCode">
                                      <el-input v-model.trim="query.sPpCode" style="min-width: 40px; width: 70%"
                                        :disabled="!isShowParams"></el-input>
                                    </el-form-item>
                                  </el-col>
                                </el-col>
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
    </div>
    <!-- 右侧 -->
    <div v-if="isUnfold" class="right_container">
      <right-info :progress="progress" :completed="completed" :target="target" :quantity-value="quantity"
        :reject-quantity-value="rejectQuantity" :scrap-quantity-value="scrapQuantity" :craft-table-value="craftTableData"
        :table-value="BOMtableData" :order-desc="pOrderDesc" @reset="handleReset">
      </right-info>
    </div>

    <div id="HintMenu" class="hint_menu" @click="handleClearShowHint">
      {{ $t("cleanHintMsg") }}
    </div>
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from "../../mixin/mixin";
import {
  GetPageInitializeAsync, //页面初始化
  SetConfirmPOAsync, //料号、工单
  MainSnVerifyAsync, //主条码
  ChildSnVerifyAsync, //条码
} from "@/api/application.js";

//组装
/*
TGP203502471PPNAD

HTL2032A06480620051AAY2

Q31613-18227-0101A120210201-01


TOR06F2087002106GW016107220028821
TOR06F2087002106GW016107220028822
TOR06F2087002106GW016107220028823
TOR06F2087002106GW016107220028824
TOR06F2087002106GW016107220028825
TOR06F2087002106GW016107220028826

HBF000070614207R131800005
HBF000070614207R131800006
HBF000070614207R131900001
HBF000070614207R131900002
HBF000070614207R132200001
HBF000070614207R132400001

*/

/*
ScanType说明：
1. 系统存在数据SN
2. 非系统注册批次(Batch校验数量，不校验唯一性)
3. 设备数据，绑定过批次（类似托盘）
4. 设备数据，无批次（类似夹具）
5. 非系统注册SN(校验唯一性)
6. 设备数据，包含3/4类型，ValidFrom工位可以重复绑定
7. 系统注册批次(Batch校验数量)
*/
export default {
  name: "Assembly",
  mixins: [StationMixin],
  data() {
    let validatePass = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!/^\d+$/g.test(value)) {
        callback(new Error(this.$t("pleaseEnterOneOrNineNumber")));
      } else {
        callback();
      }
    };
    return {
      isLockBoxSN: false,
      snDisabled: true,
      FullBoxQTY: 0,
      BoxQTY: 0,
      drawer: false,
      isShowParams: true,
      options: [],
      childSNList: [],
      childSN: "",
      operation: false,
      rules: {
        sPpCode: [
          {
            min: 0,
            max: 2,
            message: this.$t("TheLengthBetween0And2Character"),
            trigger: "blur",
          },
        ],
        sSpcaCode: [
          {
            min: 0,
            max: 4,
            message: this.$t("TheLengthBetween0And4Character"),
            trigger: "blur",
          },
        ],
        sBuildCode: [
          { validator: validatePass, trigger: "blur" },
          {
            min: 0,
            max: 10,
            message: this.$t("TheLengthBetween0And10Character"),
            trigger: "blur",
          },
        ],
      },
      paneLengthPercent: 70
    };
  },
  methods: {
    //录入信息 重置
    handleMsgReset() {
      this.$confirm(this.$t('isResetTypeInInfo'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.childSNList = [];
        this.childSN = "";
        this.$set(this.query, "MainSN", "");
        this.$set(this.query, "sColorCode", "");
        this.$set(this.query, "sBuildCode", "");
        this.$set(this.query, "sSpcaCode", "");
        this.$set(this.query, "sPpCode", "");
        this.isLockBoxSN = false;
        this.snDisabled = true;
      }).catch(() => {

      });
    },
    //初始化
    GetPageInitialize() {
      // debugger
      GetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData[0]) {
            this.ApplicationType = res.ResData[0].ApplicationType;
            let pn = res.ResData[0].IsCheckPN;
            let po = res.ResData[0].IsCheckPO;
            let page = res.ResData[0].IsLegalPage;
            this.IsCheckPN = pn === "1" ? true : false;
            this.IsCheckPO = po === "1" ? true : false;
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
      this.$set(this.query, "ChildSN", "");
      this.$set(this.query, "MainSN", "");
      this.FullBoxQTY = 0;
      this.BoxQTY = 0;
      this.isLockBoxSN = false;
      this.snDisabled = true;
      this.childSN = "";
    },
    //主条码
    handleBoxSNEnter(val) {
      MainSnVerifyAsync(this.query, false, true).then(
        (res) => {
          try {
            if (res.Success && res.ResData) {
              this.hintInfos.unshift({
                /*  msg: `${new Date().format(
                  'yyyy-MM-dd hh:mm:ss'
                )}: BoxSN: ${val} ${res.ResultMsg}`, */
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
              this.$set(this.query, "MainSN", "");
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "MainSN", "");
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
              this.$set(this.query, "MainSN", "");
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
    //组装条码
    handleSNEnter(val) {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.childSNList.push(val);
          this.$set(this.query, "ChildSN", this.childSNList.join(","));
          ChildSnVerifyAsync(this.query, false, true).then(
            (res) => {
              try {
                if (res.Success && res.ResData) {
                  this.hintInfos.unshift({
                    /*   msg: `${new Date().format(
                      'yyyy-MM-dd hh:mm:ss'
                    )}: SN: ${val} ${res.ResultMsg}`, */
                    msg: res.ResultMsg,
                    result: "success",
                  });
                  this.quantity++;

                  this.BoxQTY = this.childSNList.length; //已扫数量

                  this.childSN = "";
                  this.$nextTick(function () {
                    this.$refs.snInput.focus();
                  });
                  //是否已满
                  if (this.FullBoxQTY === this.BoxQTY) {
                    this.isLockBoxSN = false;
                    this.snDisabled = true;
                    this.BoxQTY = 0;
                    this.$set(this.query, "MainSN", "");
                    this.childSNList = [];
                    this.$nextTick(function () {
                      this.$refs.BoxSNInput.focus();
                    });
                  } else {
                    this.isLockBoxSN = true;
                    this.snDisabled = false;
                    this.$nextTick(function () {
                      this.$refs.snInput.focus();
                    });
                  }
                } else {
                  this.hintInfos.unshift({
                    msg: res.ResultMsg,
                    result: "error",
                  });

                  let index = this.childSNList.findIndex((res) => res === val);
                  index >= 0 && this.childSNList.splice(index, 1);
                }
              } catch (err) {
                this.hintInfos.unshift({
                  msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
                  result: "error",
                });
              } finally {
                this.childSN = "";
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

              let index = this.childSNList.findIndex((res) => res === val);
              index >= 0 && this.childSNList.splice(index, 1);
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
      this.FullBoxQTY = 0;
      this.completed = 0;
      this.target = 0;
      // debugger
      SetConfirmPOAsync(params, true, true).then(
        (res) => {
          try {
            if (res.Success && res.ResData) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              let data = res.ResData;
              this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0].ParentPartNumber;
              //参数下的颜色
              this.options = data.initPageInfos.poAttributes
                ? data.initPageInfos.poAttributes.ColorCode
                : [];

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
              //组装条码数量
              this.FullBoxQTY = data.AssemblyQty || 0;
              //参数是否显示
              this.operation =
                data.initPageInfos.stationAttribute.IsDOEPrint === "1" ? true : false;
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
<style lang="scss" scoped>
/* .sn_container {
  width: 100% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  overflow: hidden;

  .sn_container_left {
    height: 100%;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;

    &>div {
      margin: auto;
    }
  }
} */
</style>
