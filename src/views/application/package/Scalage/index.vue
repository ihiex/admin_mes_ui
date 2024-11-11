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
                      :is-show-work-order="IsCheckPO" :is-disable-unit-status="true"
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
                        <div class="form_box sidebar">

                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                            <el-row :gutter="10" style="margin-top: 30px;">
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('standardValues')">
                                  <el-input v-model.trim="ScalageConfig.BASE" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('standardValues', { 0: $t('ceil') })">
                                  <el-input v-model.trim="ScalageConfig.UL" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('unit')">
                                  <el-input v-model.trim="ScalageConfig.UNIT" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('standardValues', { 0: $t('floor') })">
                                  <el-input v-model.trim="ScalageConfig.LL" autocomplete="off" type="number"
                                    readonly></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>
                            <el-form-item :label="$t('BoxSN')" prop="S_SN">
                              <el-input ref="ScanSN" v-model.trim="query.S_SN" :disabled="isLockBoxSN" autocomplete="off"
                                clearable :autofocus="true" style="width: 100%"
                                @keypress.native.enter="handleMainSn(query.S_SN)"></el-input>
                            </el-form-item>
                            <el-form-item>
                              <!-- <el-input v-model="query.BoxWeight" autocomplete="off" readonly style="width: 99%"></el-input> -->
                              <div style="height: 46px;
                                width: inherit;
                                border: 1px solid #ccc;
                                border-radius: 4px;
                                font-size: 30px;
                                line-height: 46px;
                                padding: 0 10px;
                                background-color: #f8f8f8;" :style="{ color: weightColor }">
                                {{ query.BoxWeight }}</div>
                            </el-form-item>
                            <!-- 按钮控制 -->
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right;">
                                  <!-- v-show="comItem.AutoStation == '1'" :label="''" -->
                                  <el-form-item style="display: inline-block; text-align: right;">
                                    <serial-button ref="SerialButton" style="margin-left: 5px;"
                                      @StatusMsg="handleStatusMsg" @SerialLog="handleSerialLog"
                                      @SerialRead="handleSerialRead" @error="handleSocketError" @success="handleSocketMsg"
                                      @IsConnectPrint="handleConnectPrint"></serial-button>
                                  </el-form-item>
                                  <el-button style="margin: 0 5px 0 15px;" size="small" @click="handleInfoReset">{{
                                    $t('reset')
                                  }}</el-button>
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
  ScalageGetPageInitializeAsync,
  ScalageSetConfirmPOAsync,
  ScalageMainSnVerifyAsync,
  ScalageFinalWeightSubmitAsync,
} from "@/api/application.js";
//称重
/*
00008859096854018906
00008859096854018890
00008859096854018883
00008859096854018876
00008859096854018869

00008859096854018951
00008859096854018944
00008859096854018937
00008859096854018920
00008859096854019057
00008859096854019040
00008859096854019033
00008859096854019026
00008859096854019019
00008859096854019002
00008859096854018999
*/
export default {
  name: "Scalage",

  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      paneLengthPercent: 64,
      paneLengthPercent1: 28,
      paneLengthPercent2: 80,
      ScalageConfig: {
        BASE: 0,
        LL: 0,
        UL: 0,
        UNIT: "",
        upperLimit: 0,
        lowerLimit: 0
      },
      weightColor: '#14a516'
    };
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
    this.$set(this.query, 'BoxWeight', null)
  },
  methods: {
    handleSerialRead(str) {
      if (!str) return;
      let unit = str.match(/[a-zA-Z]+$/g)
      this.$set(this.ScalageConfig, 'UNIT', unit ? unit[0] : '')
      let srcData = parseFloat(str)
      this.$set(this.query, 'BoxWeight', srcData)
      let params = this.formatData(this.query)
      this.$set(params, 'BoxWeight', srcData)

      if (srcData > this.ScalageConfig.upperLimit) {
        this.weightColor = '#d91414'
      } else if (srcData < this.ScalageConfig.lowerLimit) {
        this.weightColor = '#ccc'
      } else {
        this.weightColor = '#14a516'
        this.query.S_SN && ScalageFinalWeightSubmitAsync(params).then(res => {
          console.log(res)
          if (res.Success) {
            this.isLockBoxSN = false;
            this.$set(this.query, 'S_SN', '')
            this.$set(this.query, 'BoxWeight', null)
            this.$nextTick(function () {
              this.$refs.ScanSN.focus()
            })
          }
        })
      }
    },
    handleInfoReset() {
      this.isLockBoxSN = false
      this.$set(this.query, 'S_SN', '')
      this.$nextTick(function () {
        this.$refs.ScanSN.focus()
      })
    },
    formatData(data) {
      data = JSON.parse(JSON.stringify(data))
      let params = {}
      for (let key in data) {
        if (typeof data[key] == 'number') {
          params[key] = data[key] + ''
        } else if (Array.isArray(data[key])) {
          params[key] = data[key].join(',')
        } else if (!data[key]) {
          params[key] = ''
        } else {
          params[key] = data[key]
        }
      }
      return params
    },
    //初始化
    GetPageInitialize() {
      ScalageGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = res.ResData.CurrentInitPageInfo.IsLegalPage;
            this.IsCheckPN = obj.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = obj.IsCheckPO === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            this.socketAddress = obj.PrintIPPort ? obj.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';

            Object.keys(this.comItem).forEach(key => {
              this.$set(this.comItem, key, obj[key])
            })

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
      this.isLockBoxSN = false;

      Object.keys(this.ScalageConfig).forEach(key => {
        if (typeof this.ScalageConfig[key] === 'number') {
          this.$set(this.ScalageConfig, key, 0)
        } else {
          this.$set(this.ScalageConfig, key, '')
        }
      })
    },
    //箱码
    handleMainSn(val) {
      if (!val) return
      ScalageMainSnVerifyAsync(this.formatData(this.query), false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });

              this.isLockBoxSN = true;
              this.quantity++

              this.query.BoxWeight && this.handleSerialRead(this.query.BoxWeight + this.ScalageConfig.UNIT)

              if (this.comItem.AutoStation === '1') {
                this.$refs.SerialButton.send({
                  content: this.comItem.PASS,
                  hexSend: false
                })
              }

            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.$set(this.query, "S_SN", "");
              if (this.comItem.AutoStation === '1') {
                this.$refs.SerialButton.send({
                  content: this.comItem.FAIL,
                  hexSend: false
                })
              }
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}:  ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "S_SN", "");
            if (this.comItem.AutoStation === '1') {
              this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
            }
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
              this.$set(this.query, "S_SN", "");
            }
          }
        },
        (error) => {
          document.querySelector("#NGPlay").play();
          this.$set(this.query, "S_SN", "");
          this.hintInfos.unshift({
            msg: error.toString(),
            result: "error",
          });
        }
      );
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
      ScalageSetConfirmPOAsync(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.UniversalConfirmPoOutput.MesProductStructures;
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';

              this.ScalageConfig = { ...data.ScalageConfig }

              this.$set(this.ScalageConfig, 'upperLimit', this.ScalageConfig.BASE + this.ScalageConfig.UL)
              this.$set(this.ScalageConfig, 'lowerLimit', this.ScalageConfig.BASE + this.ScalageConfig.LL)

              // if(this.comItem.AutoStation === '1'){}

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
              /*  this.completed = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].currentCount || 0;
               this.target = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].prodCount || 0; */
              /* 初始化串口 */
              this.$nextTick(function () {
                /* this.comItem.AutoStation == '1' &&  */this.initSerial()
              })

            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}:  ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
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
.el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>
