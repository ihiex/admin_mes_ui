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
              <div slot="one" style="height: 100%; overflow-y: auto; box-sizing: border-box; display: flex;">
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <el-form ref="ruleForm" :model="query" label-width="200px" class="demo-ruleForm" @submit.native.prevent>
                          <el-form-item v-for="item in query.DataList" :key="item.Id" :label="item.PartNumber">
                            <el-input :id="'ID' + item.Id + 'ID'" v-model.trim="item.Barcode"
                              :style="{ width: item.ScanType == 3 ? '35%' : '70%' }" :disabled="item.isLock"
                              @keypress.native.enter="handleSetSN(item)"></el-input>
                            <el-input v-show="item.ScanType == 3" v-model.trim="item.TrayBatchSN" disabled
                              :title="item.TrayBatchSN" style="width: 34%; margin-left: 5px">
                              <template slot="prepend">{{ $t('batch') }}</template>
                            </el-input>
                            <el-button v-show="item.ScanType !== 1 || (item.IsMainSn && IsShowReleaseBtn)"
                              style="margin-left: 5px;" @click="handleLock(item)">{{
                                item.isLock ? $t('unlock') : $t('lock') }}</el-button>
                            <el-button v-show="item.ScanType == 3 || item.ScanType == 6"
                              @click="handleRelease(item)">{{ $t('Release') }}</el-button>
                          </el-form-item>
                          <el-form-item v-show="comItem.AutoStation == '1'" :label="$t('SerialStatus')">
                            <!--  <span :style="{ color: serialMsg.flag ? '#85ce62' : '#be4036' }">{{ serialMsg.message
                              }}</span> -->
                            <serial-button ref="SerialButton" style="margin-left: 5px;" @StatusMsg="handleStatusMsg"
                              @SerialLog="handleSerialLog" @SerialRead="handleSerialRead"></serial-button>
                          </el-form-item>
                        </el-form>
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
  AssemblyDynamicGetPageInitialize, //页面初始化
  AssemblyDynamicSetConfirmPO, //确认
  AssemblyDynamicSnVerifyAsync, //条码
  ReleaseMachineSNAsync
} from "@/api/application.js";

//动态组装
/*
MF：
TOR06F1956002106GW008107220051704
TOR06F1956002106GW008107220051946
TOR06F1956002106GW008107230003671
TOR06F1956002106GW008107230003697
TOR06F1961002106GW008107230009504
TOR06F1961002106GW008107230009599
TOR06F2087002106GW016107220028823
TOR06F2087002106GW016107220028824
TOR06F2087002106GW016107220029185
TOR06F2087002106GW016107220029253
TOR06F2087002106GW016107220029302
TOR06F2087002106GW016107220029304
TOR06F2087002106GW016107220029309
TOR06F2087002106GW016107220032621

SHELL
TGPK0LQ5780AACOG1413
TGPK15Q5780AACOG1413
TGPK03U5780AACOG1416
TGPK0K75780AACOG1416
TGPK0PA5780AACOG1416
TGPK13Q5780AACOG1414
TGPK0S55780AACOG1414
TGPK0RR5780AACOG1416
TGPK08F5780AACOG1416
TGPK1265780AACOG1416
TGPK17F5780AACOG1416
TGPK18E5780AACOG1414
TGPK0MV5780AACOG1414
TGPK0QC5780AACOG1416

Adhesive：
ADVBOX-001

Buck：
Buck_S14_00000001


Magnet：
P01613-18227-0102B150210821-09

RCAM：
HTL1336A08580620051AAO1
HTL1315A49480620051AAO1
NFC：任意字符

HBF：
HBF000070614207R141500001

0000703858600001131800003
0000703858600001131800004
HBF000070614207R131800005
HBF000070614207R131800006
HBF000070614207R131900001



*/
export default {
  name: "AssemblyDynamic",
  mixins: [StationMixin],
  data() {
    return {
      IsShowReleaseBtn: false,
      paneLengthPercent: 64,
      paneLengthPercent1: 27,
      paneLengthPercent2: 79,
    };
  },

  mounted() {
    this.$set(this.query, 'DataList', [])
  },
  methods: {
    handleRelease(item) {
      if (!item.Barcode) {
        this.$message({
          message: this.$t('ThereIsNoDataToRelease'),
          type: 'warning'
        })
        return
      }
      this.$confirm(this.$t('IsItReleased'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        this.query.DataList.forEach(res => {
          this.$set(res, 'IsCurrentItem', false)
        })
        this.$set(item, 'IsCurrentItem', true)
        this.$set(item, 'IsScanFinished', false)
        ReleaseMachineSNAsync(this.FormData(this.query)).then(res => {
          if (res.Success && res.ResData) {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "success",
            });
            this.$set(item, 'Barcode', '')
            this.$set(item, 'isLock', false)
            this.$set(item, 'IsScanFinished', false)
            this.$set(item, 'TrayBatchSN', '')

            this.$forceUpdate()
            document.querySelector("#OKPlay").play();
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: "error",
            });
            this.$set(item, 'Barcode', '')
            document.querySelector("#NGPlay").play();
          }
        })
      }).catch(() => {

      });
    },
    handleLock(item) {
      if (!item.isLock) {
        if (!item.Barcode) {
          this.$message({
            message: this.$t('unlockable'),
            type: 'warning'
          })
        } else {
          this.$set(item, 'isLock', true)
          this.$set(item, 'IsScanFinished', true)
          this.$forceUpdate()
        }
        return
      }
      this.$confirm(this.$t('ItIsUnlock'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        if (item.IsMainSn && item.IsShowReleaseBtn) {
          this.$set(item, 'isLock', false)
          this.$set(item, 'Barcode', '')
          this.$set(item, 'IsScanFinished', false)
          this.query.DataList.forEach(res => {
            if ([1, 4, 5, 6,].includes(res.ScanType)) {
              this.$set(res, 'isLock', false)
              this.$set(res, 'Barcode', '')
              this.$set(res, 'IsScanFinished', false)
            }
          })
        } else {
          this.$set(item, 'isLock', false)
          this.$set(item, 'Barcode', '')
          this.$set(item, 'IsScanFinished', false)
          if (item.ScanType == 3 || item.ScanType == 6) {
            this.$set(item, 'TrayBatchSN', '')
          }
        }
        this.$forceUpdate()
      }).catch(() => {

      });
    },

    //初始化
    GetPageInitialize() {
      AssemblyDynamicGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            let obj = data.CurrentInitPageInfo.stationAttribute
            let cItem = data.CurrentInitPageInfo
            this.ApplicationType = cItem.stationAttribute.ApplicationType;
            let pn = cItem.stationAttribute.IsCheckPN;
            let po = cItem.stationAttribute.IsCheckPO;
            let page = cItem.IsLegalPage;
            this.IsCheckPN = pn === "1" ? true : false;
            this.IsCheckPO = po === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            //串口
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
      this.$set(this.query, 'DataList', [])
    },
    FormData(list) {
      let data = JSON.parse(JSON.stringify(list))
      Object.keys(data).forEach(key => {
        if (typeof data[key] == 'number') {
          data[key] = data[key] + ''
        }
      })
      return data
    },
    //扫描条码
    handleSetSN(item) {
      this.query.DataList.forEach(res => {
        this.$set(res, 'IsCurrentItem', false)
      })
      this.$set(item, 'IsCurrentItem', true)
      let params = this.FormData(this.query);
      console.log(params)
      AssemblyDynamicSnVerifyAsync(params, false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              let dataObj = data.DataList.find(res => res.Id === item.Id)
              if (dataObj) {

                this.$set(item, 'isLock', true)
                this.$set(item, 'IsScanFinished', dataObj.IsScanFinished)
                // this.$set(item, 'IsClearInput', dataObj.IsClearInput)
                if (dataObj.ScanType === 3) {
                  this.$set(item, 'TrayBatchSN', dataObj.TrayBatchSN)
                }
                this.$forceUpdate()
              }

              //定位焦点
              let obj = this.query.DataList.find(res => res.IsScanFinished === false)
              if (obj) {
                this.$nextTick(function () {
                  document.querySelector('#ID' + obj.Id + 'ID').focus();
                });
              } else {
                //已满时，清空ScanType=1，4，5，6的类型
                this.query.DataList.forEach(res => {
                  if (res.ScanType == 1 || res.ScanType == 4 || res.ScanType == 5 || res.ScanType == 6) {
                    this.$set(res, 'IsScanFinished', false);
                    this.$set(res, 'IsCurrentItem', false);
                    this.$set(res, 'Barcode', '');
                    this.$set(res, 'isLock', false);
                  }
                })
                this.quantity++
                //定位焦点
                let obj = this.query.DataList.find(res => res.IsScanFinished === false)
                if (obj) {
                  this.$nextTick(function () {
                    document.querySelector('#ID' + obj.Id + 'ID').focus();
                  });
                }
              }
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })

              if (!data.DataList) {
                this.$set(item, 'Barcode', '')
              } else {
                // 其它项有错误 更改当前项
                let dataObj = data.DataList.find(res => res.Id === item.Id)
                if (dataObj) {
                  this.$set(item, 'isLock', true)
                  this.$set(item, 'IsScanFinished', dataObj.IsScanFinished)
                  // this.$set(item, 'IsClearInput', dataObj.IsClearInput)
                  if (dataObj.ScanType === 3) {
                    this.$set(item, 'TrayBatchSN', dataObj.TrayBatchSN)
                  }
                  this.$forceUpdate()
                }

                //清除IsClearInput=true的项
                data.DataList.forEach(item => {
                  let obj = this.query.DataList.find(r => r.Id === item.Id)
                  if (item.IsClearInput && obj) {
                    this.$set(obj, 'IsScanFinished', false);
                    this.$set(obj, 'IsCurrentItem', false);
                    this.$set(obj, 'Barcode', '');
                    this.$set(obj, 'TrayBatchSN', '')
                    this.$set(obj, 'isLock', false);

                  }
                })

                let obj2 = this.query.DataList.find(res => res.IsScanFinished === false)
                if (obj2) {
                  this.$nextTick(function () {
                    document.querySelector('#ID' + obj2.Id + 'ID').focus();
                  });
                }
              }
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(item, 'Barcode', '')
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
              // this.$set(item, 'Barcode', '')
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
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
      params.S_LineNumber && delete params.S_LineNumber
      AssemblyDynamicSetConfirmPO(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              let obj = data.CurrentInitPageInfo.stationAttribute
              this.IsShowReleaseBtn = obj.IsShowReleaseBtn == '1' ? true : false
              this.$set(this.comItem, 'AutoStation', obj.AutoStation)

              this.query.DataList = [...data.DataList]
              this.query.DataList.forEach(item => {
                this.$set(item, 'isLock', false)
              })
              let mesObj = data.UniversalConfirmPoOutput

              this.BOMtableData = mesObj.MesProductStructures ? mesObj.MesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0].ParentPartNumber;

              this.$nextTick(function () {
                this.comItem.AutoStation == '1' && this.initSerial()
              })
              mesObj.RouteDataDiagram1.forEach((element) => {
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
              this.completed = mesObj.ProductionOrderQTY[0].currentCount || 0;
              this.target = mesObj.ProductionOrderQTY[0].prodCount || 0;

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
::v-deep {
  .el-form {
    .el-form-item {
      margin-bottom: 10px;
    }
  }
}
</style>