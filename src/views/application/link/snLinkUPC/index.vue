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
                <div class="input_data" style="display: flex; width: 100%;">
                  <div v-if="isShowInfo" class="input_box" style="margin: auto; width: 100%;">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div class="form_box">
                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                           
                            <el-form-item :label="$t('ScanSN')" prop="S_SN">
                              <el-input ref="ScanSN" v-model.trim="query.S_SN" autocomplete="off" clearable
                                :autofocus="true" :disabled="isLockBoxSN" style="width: 70%"
                                @keypress.native.enter="handleMainSn(query.S_SN, 'ruleForm')"></el-input>
                              <el-button style="margin-left: 15px;" size="small" @click="handleResetImportParam">{{
                                $t('reset') }}</el-button>
                            </el-form-item>
                            <div v-for="(item, key) in dataList" :key="key">
                              <el-form-item v-if="item.IsEnable" :label="item.Description">
                                <el-input :id="item.ref" v-model.trim="item.Value" :disabled="item.isLock"
                                  style="width: 70%"
                                  @keypress.native.enter="handleDynamicSn(item, 'ruleForm', key)"></el-input>
                                <span style="margin-left: 15px; color: #008000;">{{ item.DefaultSpec }} </span>
                              </el-form-item>
                            </div>
                            <el-form-item v-show="comItem.AutoStation == '1'" :label="$t('SerialStatus')">
                             <!--  <span :style="{ color: serialMsg.flag ? '#85ce62' : '#be4036' }">{{ serialMsg.message
                              }}</span> -->
                              <serial-button ref="SerialButton" style="margin-left: 5px;" @StatusMsg="handleStatusMsg"
                                @SerialLog="handleSerialLog" @SerialRead="handleSerialRead"></serial-button>
                            </el-form-item>
                            <!-- <el-form-item :label="$t('FGSN')" prop="S_BatchNumber">
                            <el-input ref="ScanSN" v-model.trim="query.S_BatchNumber" autocomplete="off" clearable
                              :disabled="isLockBoxSN" style="width: 90%"
                              @keypress.native.enter="handleBoxSNEnter(query.S_BatchNumber, 'ruleForm')"></el-input>
                          </el-form-item> -->
                            <!-- <el-form-item :label="$t('ScanSN')" prop="S_SN">
                            <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" :disabled="snDisabled"
                              clearable style="width: 90%; margin-bottom: 10px;"
                              @keypress.native.enter="handleSNEnter(query.S_SN, 'ruleForm')">
                            </el-input>
                          </el-form-item> -->
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
  UPCGetPageInitializeAsync,
  UPCSetConfirmPOAsync,
  UPCMainSnVerifyAsync,
  UPCDynamicSnVerifyAsync
} from "@/api/application.js";

//条码绑定商品统一代码
/* 
C12250DE11003KY0015
TestC12250DE11003KY0015
*/
export default {
  name: "SNLinkUPC",
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      snDisabled: true,
      drawer: false,
      isShowParams: true,
      dataList: {},
      srcDataList: {},
      refList: [],
     /*  comItem: {
        AutoStation: '0',  //是否开始com口，1开始，0关闭
        FAIL: 'FAIL', //请求失败 发送的数据
        PASS: 'PASS', //请求成功 发送的数据
        Port: 'COM1', //串口
        COM_BaudRate: "9600", //校验位
        COM_DataBits: "8", //数据位
        COM_Parity: "None", //校验位
        COM_StopBits: "1", //停止位
      } */
    };
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
    this.$set(this.query, 'DataList', {})
  },
  methods: {
    handleResetImportParam(flag) {
      if (flag) {
        this.$set(this.query, "S_SN", "");
        this.isLockBoxSN = false;

        this.dataList = JSON.parse(JSON.stringify(this.srcDataList))
        return;
      }

      this.$confirm(this.$t('isResetEnterInfo'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.$set(this.query, "S_SN", "");
        this.isLockBoxSN = false;

        this.dataList = JSON.parse(JSON.stringify(this.srcDataList))
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
      // debugger
      UPCGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            let obj = data.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = data.CurrentInitPageInfo.IsLegalPage;
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
      this.snDisabled = true;
      this.handleResetImportParam(true)
    },
    //主条码
    handleMainSn(val, formName) {
      if (!val) return
      /*    this.$refs[formName].validate((valid) => {
           if (valid) { */
      UPCMainSnVerifyAsync(this.formatData(this.query), false, true).then(
        (res) => {
          try {
            if (res.Success && res.ResData) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              this.isLockBoxSN = true;

              Object.keys(this.dataList).forEach((res, index) => {
                this.dataList[res].isLock = false;
                if (index === 0) {
                  this.$nextTick(function () {
                    document.querySelector('#' + this.dataList[res].ref).focus()
                  })
                }
              })
            } 
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}:  ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "S_SN", "");
            this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
              content: this.comItem.FAIL,
              hexSend: false
            })
          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.PASS,
                hexSend: false
              })
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.$set(this.query, "S_SN", "");
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
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
      /*  } else {
         return false;
       }
     }) */
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
      // this.$set(this.query, 'DataList', JSON.parse(JSON.stringify(this.dataList)))
      let params = this.formatData(JSON.parse(JSON.stringify(this.query)));

      /*  this.$refs[formName].validate((valid) => {
         if (valid) {*/
      UPCDynamicSnVerifyAsync(params, false, true).then(
        (res) => {
          try {
            if (res.Success && res.ResData) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              this.quantity++;
              this.$set(val, 'isLock', true)
              let obj = res.ResData.CurrentInitPageInfo.DataList

              this.$set(val, 'IsScanFinished', obj[key].IsScanFinished)

              let objArr = Object.keys(this.dataList)
              let some = null;
              for (let i = 0; i < objArr.length; i++) {
                if (!this.dataList[objArr[i]].isLock) {
                  some = this.dataList[objArr[i]]
                  break;
                }
              }
              //判断最后一个
              if (!some) {
                this.$set(this.query, "S_SN", "");
                this.isLockBoxSN = false;
                // this.snDisabled = true;
                this.$nextTick(function () {
                  this.$refs.ScanSN.focus();
                });
                objArr.forEach(k => {
                  this.$set(this.dataList[k], 'isLock', true)
                  this.$set(this.dataList[k], 'IsScanFinished', false)
                  this.$set(this.dataList[k], 'Value', '')
                })
              } else {
                //判断是否还有空的没填
                  document.querySelector(`#${some.ref}`).focus()
              }
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.PASS,
                hexSend: false
              })
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
              content: this.comItem.FAIL,
              hexSend: false
            })
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
      /*} else {
        return false;
      }
    }); */
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
      UPCSetConfirmPOAsync(params, true, true).then(
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

              for (let key in obj) {
                this.$set(this.dataList, key, {})
                for (let k in obj[key]) {
                  if (Array.isArray(obj[key][k])) {
                    this.dataList[key][k] = obj[key][k].join(',')
                  } else {
                    this.$set(this.dataList[key], k, obj[key][k])
                  }
                  this.dataList[key]['ref'] = obj[key].Name.replace(/\s/g, '')
                  this.dataList[key]['isLock'] = true
                }
              }

              this.srcDataList = JSON.parse(JSON.stringify(this.dataList))

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
