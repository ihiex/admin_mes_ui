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
            </div>
          </div>
          <div slot="two" style="height: 100%;">
            <z-row direction="column" :min="5" :max="300" :trigger-length="22"
              :pane-length-percent.sync="paneLengthPercent2" :title="$t('message')"
              :title-style="{ 'line-height': '22px' }">
              <div slot="one" style="height: 100%; overflow-y: auto; display: flex;">
                <div class="input_data">
                  <div v-if="true" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div class="form_box sidebar">

                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                            <el-form-item label="SN" prop="S_SN">
                              <el-input ref="ScanSN" v-model.trim="query.S_SN" :disabled="isLockBoxSN" autocomplete="off"
                                clearable :autofocus="true" style="width: 100%"
                                @keypress.native.enter="handleMainSn(query.S_SN)"></el-input>
                            </el-form-item>
                            <el-form-item label="MPN">
                              <el-input v-model.trim="query.MPN" autocomplete="off" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="UPC">
                              <el-input v-model.trim="query.UPC" autocomplete="off" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="SCC">
                              <el-input v-model.trim="query.SCC" autocomplete="off" type="number" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="LabelPath">
                              <el-input v-model.trim="printerParams.LabelPath" autocomplete="off" disabled></el-input>
                            </el-form-item>
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="PalletSN">
                                  <el-input v-model.trim="query.PalletSN" autocomplete="off" disabled></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="BoxQty">
                                  <span style="margin-left: 20px;">{{ query.CurrentCount ? query.CurrentCount : '--'
                                  }}</span>
                                  <span>/</span>
                                  <span>{{ query.BoxQty ? query.BoxQty : '--' }}</span>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <!-- 按钮控制 -->
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right;">
                                  <el-button style="margin-left: 15px; padding: 5px 8px; position: relative; top: 3px;"
                                    size="small" :disabled="!isConnectPrint" @click="handlePrint">
                                    <print-button ref="PrintButton" style="position: relative; top: -2px;"
                                      :disabled="!isConnectPrint" @IsConnectPrint="handleConnectPrint"
                                      @error="handleSocketError" @success="handleSocketMsg">
                                      <span slot="append" style="padding-left: 5px;">{{ $t('Print') }}</span>
                                    </print-button>
                                  </el-button>
                                  <el-button style="margin: 0 5px 0 15px;" size="small" @click="handleRework">
                                    <vab-icon :icon="['fas', 'undo-alt']"></vab-icon>
                                    {{ $t('Rework') }}</el-button>
                                  <el-button style="margin: 0 5px 0 15px;" size="small" :disabled="!isConnectPrint" @click="handlePrintAndRework">{{
                                    $t('Rework') + '/' +
                                    $t('Print') }}</el-button>
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
import StationMixin from "@/views/application/mixin/mixin.js";
import {
  OOBA_GetPageInitializeAsync,
  OOBA_BoxSnCheckAsync,
  OOBA_BoxSnReworkAsync
} from "@/api/application.js";

//OOBA print and rework
/*
00008859096851403927
00008859096853937383
00008859096853938854
00008859096859643486
00008859096859639021
00008859096855006896
00008859096865928508
00008859096853936089
00008859096855008401
00008859096859643967
*/
export default {
  name: "OOBA",
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      paneLengthPercent: 64,
      paneLengthPercent1: 6,
      paneLengthPercent2: 75,
      IsNotPrint: true,
      printerParams: {
        IsPrint: false,
        LabelCommand: "",
        LabelPath: "",
        SNFormatName: "",
        PrintSnList: []
      },
    };
  },

  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
    this.$set(this.query, 'S_UnitStatus', '')
  },
  methods: {
    handlePrintAndRework() {
      this.$confirm(this.$t('ExecutionConfirmation'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.print()
        this.rework()
      }).catch(() => {

      });
    },
    print() {
      if (!this.IsNotPrint) {
        this.$message({
          showClose: true,
          message: 'Please Add print config',
          type: 'warning'
        })
        return
      }
      if (!this.printerParams.PrintSnList || this.printerParams.PrintSnList.length === 0) {
        this.$message({
          showClose: true,
          message: 'Not print data',
          type: 'warning'
        })
        return
      }
      //格式 "PRINT|工站|SN|模板|料号"
      let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${this.printerParams.PrintSnList.join(',')}|${this.printerParams.LabelCommand}|${this.query.CurrPartID}`
      this.isConnectPrint && this.$refs.PrintButton.send(printStr)
    },
    handlePrint() {
      this.$confirm(this.$t('printConfirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.print()
      }).catch(() => {

      });
    },
    rework() {
      let params = {
        "Id": "",
        "S_PartFamilyTypeID": "",
        "S_PartFamilyID": "",
        "S_PartID": "",
        "S_POID": "",
        "S_UnitStatus": "",
        "S_URL": this.query.S_URL,
        "S_DefectID": "",
        "S_SN": this.query.S_SN
      }
      OOBA_BoxSnReworkAsync(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "success",
            });
            this.handleInfoReset()

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
        } finally {
          this.handleFinally(res.Sounds)
         /*  if (res.Sounds === "OK") {
            document.querySelector("#OKPlay").play();
          } else if (res.Sounds === "RE") {
            document.querySelector("#REPlay").play();
          } else {
            document.querySelector("#NGPlay").play();
          } */
        }
      }, (error) => {
        document.querySelector("#NGPlay").play();
        this.hintInfos.unshift({
          msg: error.toString(),
          result: "error",
        });
      })
    },
    handleRework() {
      this.$confirm(this.$t('Rework') + this.$t('affirm'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.rework()
      }).catch(() => {

      });
    },
    handleInfoReset() {
      this.isLockBoxSN = false
      this.$set(this.query, 'S_SN', '')
      this.$set(this.query, 'BoxQty', '--')
      this.$set(this.query, 'CurrentCount', '--')
      this.$set(this.query, 'MPN', '')
      this.$set(this.query, 'UPC', '')
      this.$set(this.query, 'SCC', '')
      this.$set(this.query, 'PalletSN', '')
      this.$set(this.printerParams, 'LabelPath', '')
      this.$set(this.printerParams, 'LabelCommand', '')
      this.$set(this.printerParams, 'LabelPath', '')
      this.$set(this.printerParams, 'SNFormatName', null)
      this.$set(this.printerParams, 'PrintSnList', [])
      this.$nextTick(function () {
        this.$refs.ScanSN.focus()
      })
    },
    //箱码
    handleMainSn(val) {
      if (!val) return
      let params = {
        "Id": "",
        "S_PartFamilyTypeID": "",
        "S_PartFamilyID": "",
        "S_PartID": "",
        "S_POID": "",
        "S_UnitStatus": "",
        "S_URL": this.query.S_URL,
        "S_DefectID": "",
        "S_SN": val
      }
      OOBA_BoxSnCheckAsync(params, false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              Object.keys(data.BoxInformation).forEach(key => {
                this.$set(this.query, key, data.BoxInformation[key])
              })
              this.$set(this.printerParams, 'IsPrint', data.PrinterParams.IsPrint)
              this.$set(this.printerParams, 'LabelCommand', data.PrinterParams.LabelCommand)
              this.$set(this.printerParams, 'LabelPath', data.PrinterParams.LabelPath)
              this.$set(this.printerParams, 'SNFormatName', data.PrinterParams.SNFormatName)
              this.$set(this.printerParams, 'PrintSnList', data.PrintSnList ? data.PrintSnList : [])
              this.isLockBoxSN = true;
              this.quantity++

            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.$set(this.query, "S_SN", "");
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}:  ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "S_SN", "");
          } finally {
            this.handleFinally(res.Sounds)
           /*  if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
            } */
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
    //初始化
    GetPageInitialize() {
      OOBA_GetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = res.ResData.CurrentInitPageInfo.IsLegalPage;
            // this.IsCheckPN = obj.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = obj.IsCheckPO === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            this.socketAddress = obj.PrintIPPort ? obj.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';

            /* Object.keys(this.comItem).forEach(key => {
              this.$set(this.comItem, key, obj[key])
            }) */

            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t("TheSelectedPageDoesNotMatchTheSite"),
                type: "warning",
                showClose: true,
              });
            } else {
              // IsNotPrint 0打印，1不打印
              if (obj.IsNotPrint !== '1') {
                this.$nextTick(function () {
                  this.$refs.PrintButton.init(this.socketAddress)
                })
              } else {
                this.IsNotPrint = false
              }
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "error",
            });
          }
        } catch (error) {
          // this.IsCheckPN = false;
          this.IsCheckPO = false;
          this.IsLegalPage = false;
          this.ApplicationType = false;
        }
      });
    },


  },
};
</script>
<style lang="scss" scoped>
.el-form-item--small.el-form-item {
  margin-bottom: 8px;
}
</style>
