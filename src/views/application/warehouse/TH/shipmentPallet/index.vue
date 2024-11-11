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
              <div slot="one" style="height: 100%; overflow: auto; display: flex;">
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div class="form_box sidebar" style="flex-direction: column; margin: 0;">

                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm"
                            @submit.native.prevent>
                            <el-row :gutter="10" style="margin-top: 30px;">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('BillNo')" prop="S_SN">
                                  <el-input ref="BoxSNInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                    :autofocus="true" :disabled="isLockBoxSN" style="width: 100%" @keypress.native.enter="
                                      handleBoxSNEnter(query.S_SN)
                                      "></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('MultipackSN')" prop="MultipackSn">
                                  <el-input ref="snInput" v-model.trim="query.MultipackSn" autocomplete="off" clearable
                                    :disabled="snDisabled" style="width: 100%" @keypress.native.enter="
                                      handleSNEnter(query.MultipackSn)
                                      "></el-input>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <!-- 按钮控制 -->
                            <el-row :span="10">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right; padding-right: 10px;">
                                  <serial-button v-if="comItem.AutoStation == '1'" ref="SerialButton"
                                    style="margin-left: 5px;" @StatusMsg="handleStatusMsg" @SerialLog="handleSerialLog"
                                    @SerialRead="handleSerialRead"></serial-button>
                                  <el-button style="margin-left: 15px; padding: 5px 8px; position: relative; top: 3px;"
                                    size="small" :disabled="!isConnectPrint" @click="handlePrint">
                                    <print-button ref="PrintButton" style="position: relative; top: -2px;"
                                      :disabled="!isConnectPrint" @IsConnectPrint="handleConnectPrint"
                                      @error="handleSocketError" @success="handleSocketMsg">
                                      <span slot="append" style="padding-left: 5px;">{{ $t('patchPrint') }}</span>
                                    </print-button>
                                  </el-button>
                                  <!--  <el-button type="primary" size="small" @click="handleSplit">{{
                                    $t('cutting') }}</el-button> -->

                                  <!--   <el-button style="margin: 0 0 0 5px" @click="handleInfoReset">
                                    {{ $t('print') }}
                                  </el-button> -->
                                  <el-button style="margin: 0 0 0 5px" @click="handleExchangeSN">
                                    {{ $t('ExchangeSN') }}
                                  </el-button>
                                  <el-button style="margin: 0 0 0 5px" @click="handleUnbindBoxSN">
                                    {{ $t('UnbindBoxSN') }}
                                  </el-button>
                                  <el-button style="margin: 0 0 0 5px" @click="handleDisconnect">
                                    {{ $t('Disassociation') }}
                                  </el-button>
                                  <el-button style="margin: 0 0 0 5px" @click="handleInfoReset">
                                    {{ $t('reset') }}
                                  </el-button>
                                </div>
                              </el-col>
                            </el-row>
                          </el-form>
                          <div v-loading="snLoading" style="height: 200px; width: 100%;">
                            <!-- <el-divider content-position="left">Shipment Detail</el-divider> -->
                            <el-table :data="ShipMentDatas" style="width: 100%" height="100%" size="mini">
                              <el-table-column prop="FLineItem" label="LineItem" width="80" :show-overflow-tooltip="true">
                              </el-table-column>
                              <el-table-column prop="FKPONO" label="KPO#" min-width="120" :show-overflow-tooltip="true">
                              </el-table-column>
                              <el-table-column prop="FMPNNO" label="MPN" min-width="120" :show-overflow-tooltip="true">
                              </el-table-column>
                              <el-table-column prop="FCTN" label="CTN" min-width="60" :show-overflow-tooltip="true">
                              </el-table-column>
                              <el-table-column prop="FOutSN" label="OutSN" min-width="120" :show-overflow-tooltip="true">
                              </el-table-column>
                            </el-table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 提示信息显示 -->
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
          <!--  <right-info-split :progress="progress" :completed="completed" :target="target" :quantity-value="quantity"
            :reject-quantity-value="rejectQuantity" :scrap-quantity-value="scrapQuantity"
            :craft-table-value="craftTableData" :table-value="BOMtableData" :order-desc="pOrderDesc" @reset="handleReset">
          </right-info-split> -->
          <el-table :data="ShipMentDetailDatas" style="width: 100%; border-color: transparent;" height="inherit" border>
            <el-table-column prop="ID" label="ID" width="80">
            </el-table-column>
            <el-table-column prop="MultiPackSN" label="MultiPackSN" :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </z-column>
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
    <DialogPage ref="ExchangeSN" @confirm="handleExchangeSNConfirm"></DialogPage>
    <DialogPage ref="UnlockBoxSN" @confirm="handleUnbindBoxSNConfirm"></DialogPage>
    <DialogPage ref="Disconnect" @confirm="handleDisconnectConfirm"></DialogPage>
  </div>
</template>

<script>
import StationMixin from '@/views/application/mixin/mixin'
import {
  ShipmentPalletGetPageInitializeAsync,
  ShipmentPalletSetConfirmPOAsync,
  ShipmentPalletMainSnVerifyAsync,
  ShipmentPalletMultipackSnVerifyAsync,
  ShipmentPalletReplaceBillNOAsync,
  ShipmentPalletReprintSnAsync,
  ShipmentPalletRemoveMultipackSnAsync,
  ShipmentPalletUnpackShipmentPalletAsync,
} from '@/api/application.js'
import DialogPage from './dialogPage.vue'
//出货卡板
/*
BillNO
S14-8DW2121-0625490949-1

已用 -----单号互换的单号 须在出货联单页面 -- 已扫描出库状态 改为发货， 互换后又回到已扫描出库状态
S14-8DW2121TT-0625490949-1
箱码
00008859096866249329
00008859096866249336
00008859096866249343

00008859096866249350
00008859096866249367
00008859096866249374

00008859096866249381
00008859096866249398
00008859096866249404

00008859096866249411

00008859096866249428
00008859096866249435
00008859096866249442
00008859096866249459
00008859096866249466
00008859096866249473
00008859096866249480
00008859096866249497
00008859096866249503
00008859096866249510
00008859096866249527
00008859096866249534

06/05
BKKCOS000999-2
00008859096866249541
00008859096866249558
00008859096866249565
00008859096866249572
-----
BKKCOS000999-4
00008859096866249602
00008859096866249619
-----
00008859096866249626
00008859096866249633
00008859096866249640
00008859096866249657

00008859096866249664
00008859096866249671
00008859096866249688
00008859096866249695

00008859096866249701
00008859096866249718
00008859096866249725
00008859096866249732
00008859096866249749

BKKCOS000999-3
00008859096863403458
00008859096863403465

00008859096866249589
00008859096866249596
-----
00008859096863409450
00008859096863409054
*/
export default {
  name: 'ShipmentPallet',
  components: {
    DialogPage
  },
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      snDisabled: true,
      // FullBoxQTY: 0,
      // BoxQTY: 0,
      query: {
        MultipackSn: '',
        ShippingPallet: '',
        "OriginalBillNO": '',
        "TargetBillNO": '',
      },
      printerParams: {
        IsPrint: false,
        LabelCommand: "",
        LabelPath: "",
        PrintIPPort: "",
      },
      ShipMentDatas: [],
      snLoading: false,
      ShipMentDetailDatas: [],
      PrintType: '',
      UnlockBoxSNItem: {},
      ExchangeSNItem: {},
      DisconnectItem: {},
    }
  },
  methods: {
    // 单号替换
    handleExchangeSN() {
      this.$refs.ExchangeSN.show({ label1: this.$t('OldBillNo'), label2: this.$t('NewBillNo') }, this.$t('NumberSignExchange'))
    },
    handleExchangeSNConfirm(item) {
      console.log('单号替换', item)
      this.$set(this.ExchangeSNItem, 'OriginalBillNO', item.params1)
      this.$set(this.ExchangeSNItem, 'TargetBillNO', item.params2)

      let params = this.formatParams(this.query)
      this.$set(params, 'OriginalBillNO', item.params1)
      this.$set(params, 'TargetBillNO', item.params2)
      ShipmentPalletReplaceBillNOAsync(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${res.ResultMsg}`,
              result: 'success',
            })
          }
          this.printExChange(data)
        } catch (err) {
          this.hintInfos.unshift({
            msg: `${this.$t('dataException')}: ` + err,
            result: 'error',
          })
        } finally {
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        }
      },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        })
    },
    // 解绑单个条码
    handleUnbindBoxSN() {
      this.$refs.UnlockBoxSN.show({ label1: this.$t('BillNo'), label2: this.$t('MultipackSN') }, this.$t('UnbindSingleBarCode'))
    },
    handleUnbindBoxSNConfirm(item) {
      console.log('解绑单个条码', item)
      this.$set(this.UnlockBoxSNItem, 'S_SN', item.params1)
      this.$set(this.UnlockBoxSNItem, 'MultipackSn', item.params2)

      let params = this.formatParams(this.query)
      this.$set(params, 'S_SN', item.params1)
      this.$set(params, 'MultipackSn', item.params2)
      console.log(params)
      ShipmentPalletRemoveMultipackSnAsync(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'success',
            })
            //处理当前扫码的装运单号解绑
            if (this.UnlockBoxSNItem.S_SN && this.UnlockBoxSNItem.S_SN === this.query.S_SN) {
              this.ShipMentDetailDatas = [...data.ShipMentDetailDatas]
              this.ShipMentDatas = [...data.ShipMentDatas]
            }

          }
        } catch (err) {
          this.hintInfos.unshift({
            msg: `${this.$t('dataException')}: ` + err,
            result: 'error',
          })
        } finally {
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        }
      },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        })

    },
    // 解除关联
    handleDisconnect() {
      this.$refs.Disconnect.show({ label1: this.$t('BillNo'), label2: this.$t('ShipmentPalletSN') }, this.$t('Disassociate'))
    },
    handleDisconnectConfirm(item) {
      console.log('解除关联', item)
      this.$set(this.DisconnectItem, 'S_SN', item.params1)
      this.$set(this.DisconnectItem, 'ShippingPallet', item.params2)

      let params = this.formatParams(this.query)
      this.$set(params, 'S_SN', item.params1)
      this.$set(params, 'ShippingPallet', item.params2)
      ShipmentPalletUnpackShipmentPalletAsync(params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${res.ResultMsg}`,
              result: 'success',
            })
          }
        } catch (err) {
          this.hintInfos.unshift({
            msg: `${this.$t('dataException')}: ` + err,
            result: 'error',
          })
        } finally {
          if (res.Sounds === 'OK') {
            document.querySelector('#OKPlay').play()
          } else if (res.Sounds === 'RE') {
            document.querySelector('#REPlay').play()
          } else {
            document.querySelector('#NGPlay').play()
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        }
      },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        })

    },
    print(printStr) {
      this.isConnectPrint && this.$refs.PrintButton.send(printStr)
    },
    printExChange(data, isCompensation) {
      let printParams = data.PrinterParams
      if (printParams.IsPrint) {
        switch (data.PrintType) {
          case '1': //打两张
            if (data.IsPackingFinish || isCompensation) {
              let printList = data.ShipmentPrintData ? data.ShipmentPrintData.map(m => m.SerialNumber) : []
              let p1 = '';
              if (printParams.IsNormalSKU) {
                p1 = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${data.ShipmentSiglePrintData}|${printParams.GSCommand}|${this.query.S_PartID}`
              } else {
                p1 = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${data.ShippingPallet}|${printParams.GSCommand}|${this.query.S_PartID}`
              }
              this.print(p1)
              let p2 = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${printList.join(',')}|${printParams.LabelCommand}|${this.query.S_PartID}`
              this.print(p2)
            }
            break;
          case '2':  //每次都打印，只打一张
            let p3 = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${data.ShipmentSiglePrintData}|${printParams.LabelCommand}|${this.query.S_PartID}`
            this.print(p3)
            console.log(p3)
            break;
          default:
        }
      }
    },
    // 补打印
    handlePrint() {
      this.$prompt(this.$t('PleaseScanOrEnterTheReprintedBoxCode'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      }).then(({ value }) => {
        let params = this.formatParams(this.query);
        this.$set(params, 'S_SN', value.trim())
        ShipmentPalletReprintSnAsync(params).then(res => {
          // debugger
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              //格式 "PRINT|工站|SN|模板|料号"
              // let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${this.query.S_SN}|${this.printerParams.LabelCommand}|${this.query.S_PartID}`
              // this.print(printStr)
              // data.PrinterParams.IsPrint = true
              // printParams.IsPrint = true
              this.printExChange(data, true)
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
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
      }).catch(() => {
      })
    },
    //重置
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false

      this.$set(this.query, 'OriginalBillNO', '')
      this.$set(this.query, 'TargetBillNO', '')
      this.reset()
    },
    formatParams(items) {
      let params = {};
      Object.keys(items).forEach(key => {
        if (Array.isArray(items[key])) {
          this.$set(params, key, items[key].join(','))
        } else {
          this.$set(params, key, items[key] + '')
        }
      })
      return params
    },
    //装运单号条码
    handleBoxSNEnter(val) {

      ShipmentPalletMainSnVerifyAsync(this.formatParams(this.query)).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'success',
              })
              this.PrintType = data.PrintType
              this.ShipMentDatas = data.ShipMentDatas ? [...data.ShipMentDatas] : []
              this.ShipMentDetailDatas = data.ShipMentDetailDatas ? [...data.ShipMentDetailDatas] : []

              this.$set(this.query, 'ShippingPallet', data.ShippingPallet)
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t('dataException')}: ` + err,
              result: 'error',
            })
            this.$set(this.query, 'S_SN', '')
            this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
              content: this.comItem.FAIL,
              hexSend: false
            })
          } finally {
            if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.PASS,
                hexSend: false
              })
              this.isLockBoxSN = true;
              this.snDisabled = false;
              this.$nextTick(function () {
                this.$refs.snInput.focus()
              })

            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              document.querySelector('#NGPlay').play()
              this.$set(this.query, 'S_SN', '')
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
            }
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        }
      )
    },
    //卡通箱条码
    handleSNEnter(val) {
      ShipmentPalletMultipackSnVerifyAsync(this.formatParams(this.query)).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'success',
              })
              this.ShipMentDatas = [...data.ShipMentDatas]

              this.ShipMentDetailDatas = [...data.ShipMentDetailDatas]
              if (data.IsPackingFinish) {
                this.reset()
                // this.isLockBoxSN = false;
                // this.snDisabled = true;
                this.$nextTick(function () {
                  this.$refs.BoxSNInput.focus()
                })
                // this.$set(this.query, 'S_SN', '')
              } else {
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              }
              // 打印
              let printParams = data.PrinterParams
              Object.keys(printParams).forEach(key => {
                this.$set(this.printerParams, key, printParams[key])
              })
              this.printExChange(data)

            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t('dataException')}: ` + err,
              result: 'error',
            })
          } finally {
            this.$set(this.query, 'MultipackSn', '')
            if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.PASS,
                hexSend: false
              })
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              document.querySelector('#NGPlay').play()
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
              this.comItem.AutoStation == '1' && this.$refs.SerialButton.send({
                content: this.comItem.FAIL,
                hexSend: false
              })
            }
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        }
      )
    },
    reset() {
      this.isLockBoxSN = false;
      this.snDisabled = true;
      this.ShipMentDatas = []
      this.ShipMentDetailDatas = []
      this.$set(this.query, 'S_SN', '')
      this.$set(this.query, 'MultipackSn', '')
      this.$set(this.query, 'ShippingPallet', '')

      Object.keys(this.UnlockBoxSNItem).forEach(key => {
        this.$set(this.UnlockBoxSNItem, key, '')
      })
      Object.keys(this.ExchangeSNItem).forEach(key => {
        this.$set(this.ExchangeSNItem, key, '')
      })
      Object.keys(this.DisconnectItem).forEach(key => {
        this.$set(this.DisconnectItem, key, '')
      })
    },
    handleInfoReset() {
      //添加确认提示
      this.$confirm(this.$t('resetOptionInfoClick'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(() => {
          this.reset()
        })
        .catch(() => { })
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
      this.BOMtableData = []
      this.craftTableData = []
      // this.FullBoxQTY = 0
      // this.completed = 0
      // this.target = 0
      ShipmentPalletSetConfirmPOAsync(params).then(
        (res) => {
          let data = res.ResData
          try {
            if (res.Success && data) {
              this.disabledConfirm = true
              this.isDisable = true
              this.isShowInfo = true
              // debugger
              //通用右侧显示
              // this.BOMtableData = data.UniversalConfirmPoOutput ? data.UniversalConfirmPoOutput.MesProductStructures : []
              // this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
              //添加打印相关数据
              Object.keys(data.PrinterParams).forEach(key => {
                this.$set(this.printerParams, key, data.PrinterParams[key])
              })
              // 连接打印机 补打印不受确认中的isPrint控制
              // if (!this.printerParams && this.printerParams.IsPrint) {
              this.$nextTick(function () {
                this.$refs.PrintButton.init(this.socketAddress)
                this.comItem.AutoStation == '1' && this.initSerial()

              })
              // }

              //右侧公共显示已去除
              /*  data.UniversalConfirmPoOutput.RouteDataDiagram1.forEach((element) => {
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

               this.completed = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].currentCount || 0
               this.target = data.UniversalConfirmPoOutput.ProductionOrderQTY[0].prodCount || 0
               this.FullBoxQTY = data.FullBoxQTY || 0 */



            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
            }
          } catch (error) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}: ` + error,
              result: "error",
            });
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
    //初始化
    GetPageInitialize() {
      ShipmentPalletGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            let o = data.CurrentInitPageInfo
            let com = o.stationAttribute
            this.ApplicationType = com.ApplicationType;

            let pn = com.IsCheckPN;
            let po = com.IsCheckPO;

            let page = o.IsLegalPage;
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
            //打印相关socket
            this.socketAddress = com.PrintIPPort ? com.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';
            this.$set(this.printerParams, 'PrintIPPort', this.socketAddress)
            //串口
            Object.keys(this.comItem).forEach(key => {
              this.$set(this.comItem, key, com[key])
            })
            // 连接打印机
            /*  this.$nextTick(function () {
               this.socketAddress && this.$refs.PrintButton.init(this.socketAddress)
             }) */

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

  },

}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-switch__label {
    &>span[aria-hidden="true"] {
      opacity: 0;
    }

    &.is-active {
      &>span {
        opacity: 1;
      }
    }
  }

}
</style>
