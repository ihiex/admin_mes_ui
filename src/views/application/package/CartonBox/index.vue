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
                <div class="input_data" style="height: inherit;">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div class="form_box sidebar">

                          <el-form ref="ruleForm" :model="query" label-width="80px" class="demo-ruleForm" @submit.native.prevent>
                            <el-row :gutter="10" style="margin-top: 30px;">
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                <el-form-item label="MPN">
                                  <el-input v-model.trim="query.MPN" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                <el-form-item label="UPC">
                                  <el-input v-model.trim="query.UPC" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                <el-form-item :label="$t('BoxQty')">
                                  <el-input v-model.trim="query.BoxQty" autocomplete="off" readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8">
                                <el-form-item :label="$t('CurrentQty')">
                                  <el-input v-model.trim="query.CurrentQTY" autocomplete="off" type="number"
                                    readonly></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col v-if="isGenerateBoxSN" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('templateName')">
                                  <el-input v-model.trim="query.LabelPath" autocomplete="off" :title="query.LabelPath"
                                    readonly></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <el-form-item :label="$t('BoxSN')" prop="S_SN">
                              <el-input ref="ScanSN" v-model.trim="query.S_SN" autocomplete="off" clearable
                                :autofocus="true" :disabled="isLockBoxSN || isGenerateBoxSN" style="width: 70%"
                                @keypress.native.enter="handleMainSn(query.S_SN, 'ruleForm')"></el-input>
                            </el-form-item>
                            <!-- 动态框 -->
                            <div v-for="(item, key) in dataList" :key="key">
                              <el-form-item v-if="item.IsEnable" :label="item.Description">
                                <el-input :id="item.ref" v-model.trim="item.Value" :disabled="item.isLock"
                                  style="width: 70%"
                                  @keypress.native.enter="handleDynamicSn(item, 'ruleForm', key)"></el-input>
                                <span style="margin-left: 15px; color: #008000;">{{ item.DefaultSpec }} </span>
                              </el-form-item>
                            </div>
                            <!-- 按钮控制 -->
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right;">
                                  <el-form-item v-show="comItem.AutoStation == '1'" :label="''"
                                    style="display: inline-block; text-align: right;">
                                    <!--   <span :style="{ color: serialMsg.flag ? '#85ce62' : '#be4036' }">{{ serialMsg.message
                                    }}</span> -->
                                    <serial-button ref="SerialButton" style="margin-left: 5px;"
                                      @StatusMsg="handleStatusMsg" @SerialLog="handleSerialLog"
                                      @SerialRead="handleSerialRead" @error="handleSocketError" @success="handleSocketMsg"
                                      @IsConnectPrint="handleConnectPrint"></serial-button>
                                  </el-form-item>
                                  <el-button v-if="isGenerateBoxSN" style="margin-left: 15px; padding: 5px 8px; position: relative; top: 3px;"
                                    size="small" :disabled="!isConnectPrint" @click="handlePrint">
                                    <print-button ref="PrintButton" style="position: relative; top: -2px;"
                                      :disabled="!isConnectPrint" @IsConnectPrint="handleConnectPrint"
                                      @error="handleSocketError" @success="handleSocketMsg">
                                      <span slot="append" style="padding-left: 5px;">{{ $t('patchPrint') }}</span>
                                    </print-button>
                                  </el-button>
                                  <el-button v-show="isLastBox" style="margin-left: 15px;" size="small" icon="el-icon-box"
                                    @click="handleLastBox">{{ $t('LastCase') }}</el-button>
                                  <el-button style="margin-left: 15px;" size="small" type="danger" icon="el-icon-remove"
                                    plain @click="handleRemove">{{ $t('remove') }}</el-button>
                                </div>
                              </el-col>
                            </el-row>
                          </el-form>
                        </div>
                        <i class="sideslip_btn" :class="{
                          'el-icon-caret-right': sideslipFlag,
                          'el-icon-caret-left': !sideslipFlag,
                        }" @click="sideslipFlag = !sideslipFlag"></i>
                      </div>
                      <div v-show="sideslipFlag" class="sn_container_right">
                        <el-table :data="SNList" stripe border style="width: 100%" height="100%" size="mini">
                          <el-table-column prop="SEQNO" :label="$t('SerialNumber')" width="60">
                          </el-table-column>
                          <el-table-column prop="SN" :label="$t('FGSN')">
                          </el-table-column>
                        </el-table>
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
    <RemoveDialog ref="RemoveDialog" @confirm="handleDialogConfirm"></RemoveDialog>
  </div>
</template>

<script>
import StationMixin from "../../mixin/mixin";
import {
  SimplifyGetPageInitializeAsync,
  SimplifySetConfirmPOAsync,
  SimplifyMainSnVerifyAsync,
  SimplifyDynamicSnVerifyAsync,
  SimplifyRemoveSingleAsync,
  SimplifyReprintBoxSnAsync,
  SimplifyLastBoxSubmitAsync
} from "@/api/application.js";
import RemoveDialog from './remove.vue'
//中箱
/*
00008859096850982003

箱码
COO:CN,sG54G30FT192M
COO:CN,sG54G30J5192M
COO:CN,sG54G30ME192M

COO:CN,sG54G30NA192M
COO:CN,sG54G30TW192M
COO:CN,sG54G30UF192M

COO:CN,sG54G30UY192M
COO:CN,sG54G30VF192M
COO:CN,sG54G30VJ192M
COO:CN,sG54G30VP192M
*/
export default {
  name: "CartonBox",
  components: {
    RemoveDialog
  },
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: true,
      // snDisabled: true,
      paneLengthPercent: 64,
      paneLengthPercent1: 28,
      paneLengthPercent2: 80,
      sideslipFlag: true,
      isLastBox: false, //是否显示尾箱按钮
      dataList: {},
      refList: [],
      isGenerateBoxSN: false,
      SNList: [],
      query: {
        MPN: '',
        UPC: '',
        BoxQty: '', //每箱数量
        LabelPath: '', //模板
        CurrentQTY: 0,
      },
      printerParams: {
        IsPrint: false,
        LabelCommand: "",
        LabelPath: "",
        PrintIPPort: "",
        SNFormatName: ""
      },
    };
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
    this.$set(this.query, 'DataList', {})
  },
  methods: {
    handleDialogConfirm(data) {
      let params = this.formatData(JSON.parse(JSON.stringify(this.query)));
      params.S_SN = data.S_SN ? data.S_SN : '';
      params.InnerSN = data.InnerSN ? data.InnerSN : '';

      SimplifyRemoveSingleAsync(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "success",
            });
            this.SNList = [...data.CartonBoxConfirmeds]
            if ((this.query.S_SN === params.S_SN) && params.S_SN) {
              this.$set(this.query, 'CurrentQTY', this.SNList.length)
            }
          }
        } catch (err) {
          this.hintInfos.unshift({
            msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
            result: "error",
          });
        } finally {
          if (res.Sounds === "OK") {
            document.querySelector("#OKPlay").play();
          } else if (res.Sounds === "RE") {
            document.querySelector("#REPlay").play();
          } else {
            document.querySelector("#NGPlay").play();
          }
        }
      }, (error) => {
        document.querySelector("#NGPlay").play();
        this.hintInfos.unshift({
          msg: error.toString(),
          result: "error",
        });
      })
    },
    handlePrint() {
      this.$prompt(this.$t('PleaseScanOrEnterTheReprintedBoxCode'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      }).then(({ value }) => {
        let params = this.formatData(JSON.parse(JSON.stringify(this.query)));
        this.$set(params, 'S_SN', value.trim())
        SimplifyReprintBoxSnAsync(params).then(res => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              //格式 "PRINT|工站|SN|模板|料号"
              let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${this.query.S_SN}|${this.printerParams.LabelCommand}|${this.query.S_PartID}`
              this.isConnectPrint && this.$refs.PrintButton.send(printStr)
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
            }
          }
        }, (error) => {
          document.querySelector("#NGPlay").play();
          this.hintInfos.unshift({
            msg: error.toString(),
            result: "error",
          });
        })
      }).catch(() => {
      })
    },
    handleRemove() {
      this.$refs.RemoveDialog.show({ S_SN: this.query.S_SN, InnerSN: this.query.InnerSN })
    },
    handleLastBox() {
      this.$confirm(this.$t('WhetherToPerformTailBoxOperations'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        let params = this.formatData(JSON.parse(JSON.stringify(this.query)));

        SimplifyLastBoxSubmitAsync(params).then(res => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              let objArr = Object.keys(this.dataList)

              //自动生成箱码
              if (this.isGenerateBoxSN) {
                this.isGenerateBoxSN = true;
                //清空数值，全解锁
                objArr.forEach(k => {
                  this.$set(this.dataList[k], 'isLock', false)
                  this.$set(this.dataList[k], 'IsScanFinished', false)
                  this.$set(this.dataList[k], 'Value', '')
                })
                this.$nextTick(function () {
                  document.querySelector(`#${this.dataList[Object.keys(this.dataList)[0]].ref}`).focus()
                })
                //格式 "PRINT|工站|SN|模板|料号"
                let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${this.query.S_SN}|${this.printerParams.LabelCommand}|${this.query.S_PartID}`
                this.isConnectPrint && this.$refs.PrintButton.send(printStr)
              } else {
                //非自动生成箱码
                this.isGenerateBoxSN = false;
                this.$nextTick(function () {
                  this.$refs.ScanSN.focus();
                });
                //清空数值，全锁上
                objArr.forEach(k => {
                  this.$set(this.dataList[k], 'isLock', true)
                  this.$set(this.dataList[k], 'IsScanFinished', false)
                  this.$set(this.dataList[k], 'Value', '')
                })
              }
              this.isLockBoxSN = false;
              this.$set(this.query, 'CurrentQTY', 0)
              this.$set(this.query, "S_SN", "");
              this.SNList = []
            }

          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
            }
          }
        }, (error) => {
          document.querySelector("#NGPlay").play();
          this.hintInfos.unshift({
            msg: error.toString(),
            result: "error",
          });
        })

      }).catch(() => {

      });
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
      for (let k in data.DataList) {
        params.DataList[k].DefaultSpec = data.DataList[k].DefaultSpec ? data.DataList[k].DefaultSpec.split(',') : []
      }
      return params
    },
    //初始化
    GetPageInitialize() {
      SimplifyGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = res.ResData.CurrentInitPageInfo.IsLegalPage;
            this.IsCheckPN = obj.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = obj.IsCheckPO === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            this.isLastBox = obj.IsLastBox === '1' ? true : false
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
      this.isLockBoxSN = true;
      this.isGenerateBoxSN = false;
      // this.snDisabled = true;
      //清空录入信息相关
      this.dataList = {};
      this.$set(this.query, 'S_SN', '')
      this.$set(this.query, 'MPN', '')
      this.$set(this.query, 'UPC', '')
      this.$set(this.query, 'BoxQty', '') //每箱数量
      this.$set(this.query, 'LabelPath', '') //模板
      this.$set(this.query, 'CurrentQTY', 0)
      this.SNList = []
    },
    //主条码
    handleMainSn(val, formName) {
      if (!val) return
      SimplifyMainSnVerifyAsync(this.formatData(this.query), false, true).then(
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
              this.SNList = [...data.CartonBoxConfirmeds]
              this.$set(this.query, 'CurrentQTY', this.SNList.length)
              this.$set(this.query, 'S_SN', data.BoxSN)

              Object.keys(this.dataList).forEach((res, index) => {
                this.dataList[res].isLock = false;
                if (index === 0) {
                  this.$nextTick(function () {
                    document.querySelector('#' + this.dataList[res].ref).focus()
                  })
                }
              })
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
    //动态条码
    handleDynamicSn(val, formName, key) {
      if (!val.Value) return;

      for (let k in this.dataList) {
        if (k === key) {
          this.$set(this.dataList[k], 'IsCurrentItem', true)
        } else {
          this.$set(this.dataList[k], 'IsCurrentItem', false)
        }
      }
      this.$set(this.query, 'DataList', this.dataList)
      let params = this.formatData(JSON.parse(JSON.stringify(this.query)));
      SimplifyDynamicSnVerifyAsync(params, false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              this.quantity++;
              this.$set(val, 'isLock', true)
              let obj = data.CurrentInitPageInfo.DataList
              this.$set(this.query, 'S_SN', data.BoxSN)
              this.SNList = [...data.CartonBoxConfirmeds]

              this.$set(val, 'IsScanFinished', obj[key].IsScanFinished)
              let objArr = Object.keys(this.dataList)
              let some = null;
              for (let i = 0; i < objArr.length; i++) {
                if (!this.dataList[objArr[i]].isLock) {
                  some = this.dataList[objArr[i]]
                  break;
                }
              }
              this.$set(this.query, 'CurrentQTY', this.SNList.length);
              //判断最后一个
              if (!some) {
                //完成一箱数量
                if ((this.query.CurrentQTY == this.query.BoxQty) && this.query.BoxQty) {
                  //自动生成箱码
                  if (this.isGenerateBoxSN) {
                    this.isGenerateBoxSN = true;
                    //清空数值，全解锁
                    objArr.forEach(k => {
                      this.$set(this.dataList[k], 'isLock', false)
                      this.$set(this.dataList[k], 'IsScanFinished', false)
                      this.$set(this.dataList[k], 'Value', '')
                    })
                    this.$nextTick(function () {
                      document.querySelector(`#${this.dataList[Object.keys(this.dataList)[0]].ref}`).focus()
                    })
                    if (data.IsPackingFinish) {
                      //格式 "PRINT|工站|SN|模板|料号"
                      let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${this.query.S_SN}|${this.printerParams.LabelCommand}|${this.query.S_PartID}`
                      this.isConnectPrint && this.$refs.PrintButton.send(printStr)
                    }
                  } else {
                    //非自动生成箱码
                    this.isGenerateBoxSN = false;
                    this.$nextTick(function () {
                      this.$refs.ScanSN.focus();
                    });
                    //清空数值，全锁上
                    objArr.forEach(k => {
                      this.$set(this.dataList[k], 'isLock', true)
                      this.$set(this.dataList[k], 'IsScanFinished', false)
                      // this.$set(this.dataList[k], 'IsEnable', false)
                      this.$set(this.dataList[k], 'Value', '')
                    })
                  }
                  this.isLockBoxSN = false;
                  this.$set(this.query, 'CurrentQTY', 0)
                  this.$set(this.query, "S_SN", "");
                  this.SNList = []
                } else {
                  //完成一次循环
                  objArr.forEach(k => {
                    this.$set(this.dataList[k], 'isLock', false)
                    this.$set(this.dataList[k], 'IsScanFinished', false)
                    this.$set(this.dataList[k], 'Value', '')
                  })
                  this.$nextTick(function () {
                    document.querySelector(`#${this.dataList[Object.keys(this.dataList)[0]].ref}`).focus()
                  })
                }
              } else {
                //判断是否还有空的没填
                document.querySelector(`#${some.ref}`).focus()
              }
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
              if (this.comItem.AutoStation === '1') {
                this.$refs.SerialButton.send({
                  content: this.comItem.FAIL,
                  hexSend: false
                })
              }
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
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
              this.$set(val, 'Value', '')
            }
          }
        },
        (error) => {
          document.querySelector("#NGPlay").play();
          this.$set(val, 'Value', '')
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
      SimplifySetConfirmPOAsync(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.UniversalConfirmPoOutput.MesProductStructures;
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';
              let obj = JSON.parse(JSON.stringify(data.CurrentInitPageInfo.DataList));
              let poAttributes = data.CurrentInitPageInfo.poAttributes;
              this.printerParams = data.PrinterParams;
              this.$set(this.query, 'MPN', poAttributes.MPN)
              this.$set(this.query, 'UPC', poAttributes.UPC)
              this.$set(this.query, 'BoxQty', poAttributes.BoxQty)
              this.$set(this.query, 'CurrentQTY', 0)
              //如果配置为自动生成箱码则不起用箱号条码输入
              if (poAttributes.IsGenerateBoxSN === '1') {
                this.$set(this.query, 'LabelPath', this.printerParams.LabelPath)
                this.isGenerateBoxSN = true;
                this.isLockBoxSN = true;
                //初始化打印服务
                this.$nextTick(function () {
                  this.$refs.PrintButton.init(this.socketAddress/* '172.16.32.82:45210' */)
                })
              } else {
                this.isGenerateBoxSN = false;
                this.isLockBoxSN = false;
                this.$set(this.query, 'LabelPath', '')
              };
              for (let key in obj) {
                this.$set(this.dataList, key, {})
                for (let k in obj[key]) {
                  if (Array.isArray(obj[key][k])) {
                    this.dataList[key][k] = obj[key][k].join(',')
                  } else {
                    this.$set(this.dataList[key], k, obj[key][k])
                  }
                  this.dataList[key]['ref'] = obj[key].Name.replace(/\s/g, '')
                  if (this.isLockBoxSN) {
                    this.dataList[key]['isLock'] = false
                  } else {
                    this.dataList[key]['isLock'] = true
                  }
                }
              }
              if (this.isLockBoxSN && this.dataList[0]) {
                this.$nextTick(function () {
                  document.querySelector('#' + this.dataList[0].ref).focus()
                })
              } else {
                this.$nextTick(function () {
                  this.$refs.ScanSN.focus();
                });
              }
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
              /* 初始化串口 */
              this.$nextTick(function () {
                this.comItem.AutoStation == '1' && this.initSerial()
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
