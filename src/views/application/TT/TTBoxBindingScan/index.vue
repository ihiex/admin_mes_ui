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
                <div class="input_data" style="height: inherit;">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div style="width: 100%; padding: 5px 0; box-sizing: border-box;">
                          <!-- <div class="form_box sidebar"> -->
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_title">{{ $t('BoxSN') }}:</div>
                                <div class="box_number">
                                  <el-input ref="BoxSNInput" v-model.trim="query.S_BoxSN" autocomplete="off" clearable
                                    :disabled="isLockBoxSN" style="width: 90%" @keypress.native.enter="
                                      handleBoxSNEnter(query.S_BoxSN)
                                      "></el-input>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_title">{{ $t('ScanSN') }}:</div>
                                <div class="box_number">
                                  <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                    :disabled="snDisabled" style="width: 90%" @keypress.native.enter="
                                      handleSNEnter(query.S_SN, false)
                                      "></el-input>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="9" :xs="24" :sm="24" :md="12" :lg="9" :xl="9">
                              <div class="box_container">
                                <div class="box_title">{{ $t('CaseQty') }}:</div>
                                <div class="box_number">
                                  <el-input v-model.trim="FullBoxQTY" style="min-width: 60px; width: 90%" readonly>
                                  </el-input>
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="9" :xs="24" :sm="24" :md="12" :lg="9" :xl="9">
                              <div class="box_container">
                                <div class="box_title">
                                  {{ $t('PackingQuantity') }}:
                                </div>
                                <div class="box_number">
                                  <el-input v-model.trim="BoxQTY" style="min-width: 60px; width: 90%" readonly>
                                  </el-input>
                                </div>
                              </div>
                            </el-col>
                            <el-col :span="6" :xs="24" :sm="24" :md="12" :lg="6" :xl="6">
                              <div class="box_container">
                                <el-button style="margin: 0 0 0 5px" @click="handleLastBox(true)">
                                  {{ $t('LastCase') }}
                                </el-button>
                                <print-button v-show="isPrint" ref="PrintButton" @IsConnectPrint="handleConnectPrint"
                                  @error="handleSocketError" @success="handleSocketMsg"></print-button>
                              </div>
                            </el-col>
                          </el-row>
                          <!-- </div> -->
                          <i class="sideslip_btn" :class="{
                            'el-icon-caret-right': sideslipFlag,
                            'el-icon-caret-left': !sideslipFlag,
                          }" @click="sideslipFlag = !sideslipFlag"></i>
                        </div>
                      </div>
                      <div v-if="sideslipFlag" class="sn_container_right">
                        <div>
                          <p v-for="(item, index) in SNList" :key="index" style="padding: 0 10px">
                            {{ item.ChildSN }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
                  <!-- <h3>{{ $t('message') }}</h3> -->
                  <!-- @mousedown.stop.prevent="handleShowHintMouse" -->
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
    <!-- <div id="HintMenu" class="hint_menu" @click="handleClearShowHint">
      {{ $t('cleanHintMsg') }}
    </div> -->
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'
import {
  SetConfirmPO_TTBindBox,
  SetScanSN_TTBoxSN,
  SetScanSN_TTChildSN,
} from '@/api/application.js'

//TT箱子绑定扫描
/*
工单190000983
料号群  S11

'C12081DE11060KY0002',
'C12081DE11060KY0003',
'C12081DE11060KY0004',
'C12081DE11060KY0005',
'C12081DE11060KY0006',
'C12081DE11060KY0007',
'C12081DE11060KY0008',
'C12081DE11060KY0009',
'C12081DE11060KY0010',
'C12081DE11060KY0011',
'C12081DE11060KY0012',
'C12081DE11060KY0013',
'C12081DE11060KY0014',
'C12081DE11060KY0015',
'C12081DE11060KY0016',
'C12081DE11060KY0017',
'C12081DE11060KY0018',
'C12081DE11060KY0019',
'C12081DE11060KY0020'

当前页流程：
相关配置 http://172.16.10.165:2401/Menu/MenuMain# 测试：

*/
export default {
  name: 'TTBoxBindingScan',
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      snDisabled: true,
      FullBoxQTY: 0,
      BoxQTY: 0,
      BoxType: '1',
      drawer: false,
      SNList: [],
      sideslipFlag: true,
    }
  },
  watch: {
    isShowInfo(val, oval) {
      if (val) {
        this.$nextTick(function () {
          if (this.isPrint && this.socketAddress) {
            this.$refs.PrintButton.init(this.socketAddress)
          }
        })
      }
    }
  },
  methods: {
    //重置
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.$set(this.query, 'S_SN', '')
      this.$set(this.query, 'S_BoxSN', '')
      this.FullBoxQTY = 0
      this.BoxQTY = 0
      this.isLockBoxSN = false
      this.snDisabled = true
      this.BoxType = '1'
      this.SNList = [],
        this.isPrint = false,
        this.socketAddress = ''
    },
    //箱子条码
    handleBoxSNEnter(val) {
      SetScanSN_TTBoxSN(this.query).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format(
                  'yyyy-MM-dd hh:mm:ss'
                )}: BoxSN: ${val} ${res.ResultMsg}`,
                result: 'success',
              })
              this.isLockBoxSN = true
              this.snDisabled = false

              this.$set(this.query, 'S_BoxSN', data.BoxSN)
              this.$nextTick(function () {
                this.$refs.snInput.focus()
              })
              this.SNList = data.ChildList || []
              this.BoxQTY = this.SNList.length
            } else {
              this.hintInfos.unshift({
                // msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
                msg: res.ResultMsg,
                result: 'error',
              })
              this.$set(this.query, 'S_BoxSN', '')
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t('dataException')}: ` + err,
              result: 'error',
            })
            this.$set(this.query, 'S_BoxSN', '')
          } finally {
            this.handleFinally(res.Sounds)
            /* if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              this.$set(this.query, 'S_BoxSN', '')
              document.querySelector('#NGPlay').play()
            } */
            /*  this.snDisabled = false
            this.$set(this.query, 'S_BoxSN', '')
            this.$nextTick(function () {
              this.$refs.BoxSNInput.focus()
            }) */
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
    //扫描条码
    handleSNEnter(val, bool) {
      this.$set(this.query, 'B_IsEndBox', bool)
      SetScanSN_TTChildSN(this.query).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${!bool ? 'SN' : 'BoxSN'
                  }: ${!bool ? val : this.query.S_BoxSN} ${res.ResultMsg}`,
                result: 'success',
              })
              this.quantity++
              this.SNList = data.ChildList
              // this.isLockBoxSN = false
              // this.$set(this.query, 'S_BoxSN', '')
              // this.$set(this.query, 'S_SN', '')
              this.BoxQTY = data.BindQTY || 0
              if (this.isPrint && data.PrintData) {
                // let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${data.PrintData.join(',')}|${data.LabelPath}|${this.query.S_PartID}`
                this.isConnectPrint && this.$refs.PrintButton.send(data.PrintData)
              }

              //当BoxType == 2时 应停在条码输入框
              if (this.BoxType == '2') {
                //系统自动生成箱号条码
                this.snDisabled = false
                if (this.FullBoxQTY === this.BoxQTY || bool) {
                  this.BoxQTY = 0
                  this.SNList = []
                  this.$set(this.query, 'S_BoxSN', '')
                } else {
                  if (!this.query.S_BoxSN) {
                    let that = this
                    // let v = val
                    setTimeout(function () {
                      that.$set(that.query, 'S_SN', val)
                      that.handleSNEnter(val, false)
                    }, 1)
                  }

                  this.$set(this.query, 'S_BoxSN', data.BoxSN)
                }
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              } else {
                //用户输入箱号条码  C12081DE11060KY0010
                //是否满箱

                if (this.FullBoxQTY === this.BoxQTY || bool) {
                  this.isLockBoxSN = false
                  this.snDisabled = true
                  this.BoxQTY = 0
                  this.SNList = []
                  this.$set(this.query, 'S_BoxSN', '')
                  this.$nextTick(function () {
                    this.$refs.BoxSNInput.focus()
                  })
                } else {
                  this.isLockBoxSN = true
                  this.snDisabled = false
                  this.$nextTick(function () {
                    this.$refs.snInput.focus()
                  })
                }
              }
            } else {
              this.hintInfos.unshift({
                // msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
                msg: res.ResultMsg,
                result: 'error',
              })
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t('dataException')}: ` + err,
              result: 'error',
            })
          } finally {
            this.$set(this.query, 'S_SN', '')
            this.handleFinally(res.Sounds)
           /*  if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              document.querySelector('#NGPlay').play()
            } */
            /*  this.snDisabled = false
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            }) */
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
    handleLastBox(bool) {
      //添加确认提示 TODO:
      this.$confirm(this.$t('youOptionLastBoxClick'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(() => {
          this.handleSNEnter(this.query.S_SN, bool)
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
      this.FullBoxQTY = 0
      // this.completed = 0
      // this.target = 0
      SetConfirmPO_TTBindBox(params).then(
        (res) => {
          if (res.Success && res.ResData) {
            this.disabledConfirm = true
            this.isDisable = true
            this.isShowInfo = true
            let data = res.ResData
            this.BOMtableData = data ? data.mesProductStructures : []
            this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
            // this.craftTableData = data ? data[1] : []
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

            // if (data[4] && data[4][0]) {
            this.FullBoxQTY = data.FullBoxQTY || 0
            this.BoxType = data.BoxType
            if (this.BoxType != '2') {
              this.snDisabled = true
            } else {
              this.isLockBoxSN = true
              this.snDisabled = false
            }
            // }
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
  },

}
</script>

<style lang="scss" scoped>
@import '../tt-style.scss';
</style>
