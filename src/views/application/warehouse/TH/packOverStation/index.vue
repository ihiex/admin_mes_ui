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
              <div slot="one" style="height: 100%; overflow: auto;">
                <div class="input_data" style="height: inherit;">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div style="width: 100%; padding: 5px 0; box-sizing: border-box;">
                          <!-- <div class="form_box sidebar"> -->
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_title">{{ $t('ScanPalletSN') }}:</div>
                                <div class="box_number">
                                  <el-input ref="BoxSNInput" v-model.trim="query.S_PalletSN" autocomplete="off" clearable
                                    :disabled="isLockBoxSN" style="width: 90%" @keypress.native.enter="
                                      handleBoxSNEnter(query.S_PalletSN)
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
                                  <el-input ref="snInput" v-model.trim="query.S_BoxSN" autocomplete="off" clearable
                                    :disabled="snDisabled" style="width: 90%" @keypress.native.enter="
                                      handleSNEnter(query.S_BoxSN)
                                      "></el-input>
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                          <el-row :gutter="10">
                            <el-col :span="24"
                              style="display: flex; justify-content: center; align-items: center; text-align: center">
                              <div style="min-width: 120px;">
                                <el-switch v-model="query.IsEntry" active-color="#13ce66" inactive-color="#ccc"
                                  :disabled="BoxType == 2" :active-text="$t('inStorage')" :inactive-text="$t('sendBack')">
                                </el-switch>
                              </div>
                              <div style="min-width: 100px;">
                                {{ BoxQTY }} / {{ FullBoxQTY }}
                              </div>
                              <div style="min-width: 100px">
                                <el-button style="margin: 0 0 0 5px" @click="handleInfoReset">
                                  {{ $t('reset') }}
                                </el-button>
                              </div>
                            </el-col>
                            <!-- <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="9">
                              <div class="box_container">
                                <div class="box_title" style="line-height: 32px;">
                                  &nbsp; &nbsp;
                                </div>
                                <div class="box_number">
                                  <el-switch v-model="query.IsEntry" active-color="#13ce66" inactive-color="#ccc"
                                    :active-text="$t('inStorage')" :inactive-text="$t('sendBack')">
                                  </el-switch>
                                </div>
                              </div>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12" :lg="9" :xl="9">
                              <div class="box_container" style="line-height: 32px;">
                                <div class="box_title">
                                  &nbsp; &nbsp;
                                </div>
                                <div class="box_number">
                                  {{ BoxQTY }} / {{ FullBoxQTY }}
                                </div>
                              </div>
                            </el-col>
                            <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6">
                              <div class="box_container">
                                <el-button style="margin: 0 0 0 5px" @click="handleInfoReset">
                                  {{ $t('reset') }}
                                </el-button>
                              </div>
                            </el-col> -->
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
                          <p v-for="item in SNList" :id="item.id" :key="item.id" :title="item.KITSN"
                            :style="{ padding: '0 10px', color: item.IsScan === '1' ? '#13ce66' : '', backgroundColor: item.Current ? '#ccc' : '' }"
                            style="line-height: 24px; margin: 3px 0;">
                            {{ item.KITSN }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
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
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '@/views/application/mixin/mixin'
import {
  PackSetConfirmPOAsync,
  PackPalletSnVerifyAsync,
  PackBoxSnVerifyAsync,
  PackGetPageInitializeAsync,
} from '@/api/application.js'
import { uuid } from '@/utils'
//包装过站
/*
栈板：
AM2AZM0055

箱码：
00008859096853937055
00008859096853936218
00008859096853938984
00008859096853938991
00008859096853939004
00008859096853937543
00008859096853938922
00008859096853938847
00008859096853938922
00008859096853938946

选项：9，21，118，843
AM2KZM0131
00008859096859643868
00008859096859643929
00008859096859643912
00008859096859643905
00008859096859643899
00008859096859643974
*/
export default {
  name: 'PackOverStation',
  mixins: [StationMixin],
  data() {
    return {
      isLockBoxSN: false,
      snDisabled: true,
      FullBoxQTY: 0,
      BoxQTY: 0,
      BoxType: '0',
      drawer: false,
      SNList: [],
      sideslipFlag: true,
      query: {
        S_PalletSN: '',
        IsEntry: true,
      },
      scanPallet: '0', // 扫描类型
    }
  },
  watch: {
    "query.IsEntry": function (val, oval) {
      if (this.BoxType == 1 && !val) {
        this.isLockBoxSN = true
        this.snDisabled = false
        this.$set(this.query, 'S_PalletSN', '')
        this.$nextTick(function () {
          this.$refs.snInput.focus()
        })
      } else if (this.BoxType == 1 && val) {
        this.isLockBoxSN = false
        this.snDisabled = true
        this.$set(this.query, 'S_BoxSN', '')
        this.$nextTick(function () {
          this.$refs.BoxSNInput.focus()
        })
      }
      this.BoxQTY = 0
      this.SNList = []
    }
  },
  methods: {
    scrollInto(id) {
      document.querySelector('#' + id).scrollIntoView({ behavior: 'smooth' })
    },
    //重置
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.$set(this.query, 'S_PalletSN', '')
      this.$set(this.query, 'S_BoxSN', '')
      this.FullBoxQTY = 0
      this.BoxQTY = 0
      this.isLockBoxSN = true
      this.snDisabled = true
      // this.BoxType = '0'
      this.SNList = []
      this.$set(this.query, 'IsEntry', true)
      // this.handleScanType(this.BoxType)
    },
    //栈板条码
    handleBoxSNEnter(val) {
      if (!val) return;
      PackPalletSnVerifyAsync(this.handleFormatData(this.query)).then(
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
              //模式为1
              if (this.BoxType == 1) {
                this.isLockBoxSN = true
                this.snDisabled = false
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              }
              //模式为2
              if (this.BoxType == 2) {
                this.isLockBoxSN = false
                this.snDisabled = true
                this.$set(this.query, 'S_PalletSN', '')
                this.$nextTick(function () {
                  this.$refs.BoxSNInput.focus()
                })
              }

              this.SNList = data.CurrentInitPageInfo.DataList || []
              this.SNList.forEach(item => {
                item['Current'] = false;
                item['id'] = `PO${uuid()}`
              })
              this.FullBoxQTY = this.SNList.length
              this.BoxQTY = this.SNList.filter(val => val.IsScan == '1').length
            } else {
              this.hintInfos.unshift({
                // msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
                msg: res.ResultMsg,
                result: 'error',
              })
              this.$set(this.query, 'S_PalletSN', '')
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t('dataException')}: ` + err,
              result: 'error',
            })
            this.$set(this.query, 'S_PalletSN', '')
          } finally {
            if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              this.$set(this.query, 'S_PalletSN', '')
              document.querySelector('#NGPlay').play()
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
    //扫描条码
    handleSNEnter(val) {
      if (!val) return
      PackBoxSnVerifyAsync(this.handleFormatData(this.query)).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'success',
              })
              this.quantity++
              this.BoxQTY++

              //模式0
              if (this.BoxType === '0' || (this.BoxType == 1 && !this.query.IsEntry)) {
                this.SNList.forEach(item => {
                  item.Current = false
                })
                this.SNList.push({
                  KITSN: val,
                  IsScan: '1',
                  Current: true,
                  id: `PO${uuid()}`,
                })
                this.snDisabled = false
                this.isLockBoxSN = true
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              } else if (this.BoxType === '1' && this.query.IsEntry) { //模式1
                //标注
                let obj = this.SNList.find(item => item.KITSN === val)
                this.SNList.forEach(item => {
                  item.Current = false;
                })
                if (obj) {
                  this.$set(obj, 'IsScan', '1')
                  this.$set(obj, 'Current', true)
                  this.scrollInto(obj.id)
                }
                this.snDisabled = false
                this.isLockBoxSN = true
                if (this.FullBoxQTY === this.BoxQTY) {
                  this.isLockBoxSN = false
                  this.snDisabled = true
                  this.$set(this.query, 'S_BoxSN', '')
                  this.$set(this.query, 'S_PalletSN', '')
                  this.BoxQTY = 0
                  this.FullBoxQTY = 0
                  this.SNList = []
                  this.$nextTick(function () {
                    this.$refs.BoxSNInput.focus()
                  })
                } else {
                  this.$nextTick(function () {
                    this.$refs.snInput.focus()
                  })
                }
              }/*  else if (this.BoxType === 1 && this.query.IsEntry) {
                this.SNList.forEach(item => {
                  item.Current = false
                })
                this.SNList.push({
                  KITSN: val,
                  IsScan: '1',
                  Current: true,
                  id: `PO${uuid()}`,
                })
                this.snDisabled = false
                this.isLockBoxSN = true
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              } */

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
            this.$set(this.query, 'S_BoxSN', '')
            this.handleFinally(res.Sounds)
            /*  if (res.Sounds === 'OK') {
               document.querySelector('#OKPlay').play()
             } else if (res.Sounds === 'RE') {
               document.querySelector('#REPlay').play()
             } else {
               document.querySelector('#NGPlay').play()
             } */
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
    handleInfoReset() {
      //添加确认提示
      this.$confirm(this.$t('resetOptionInfoClick'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning',
      })
        .then(() => {
          this.FullBoxQTY = 0
          this.BoxQTY = 0
          this.SNList = []
          // this.$set(this.query, 'IsEntry', false)
          this.$set(this.query, 'S_BoxSN', '')
          this.$set(this.query, 'S_PalletSN', '')
          this.$set(this.query, 'IsEntry', true)
          this.handleScanType(this.BoxType)
        })
        .catch(() => { })
    },
    handleScanType(scanPallet) {
      /* 说明：
             0： 原始模式，只需要扫描箱码，不能扫描栈板条码 -- 栈板输入框禁用
             1： 先扫栈板再扫条码--                          两输入框都显示
             2： 只扫栈板--                                 扫描条码框禁用
             */
      switch (scanPallet) {
        case '1':
          this.snDisabled = true
          this.isLockBoxSN = false
          this.$nextTick(function () {
            this.$refs.BoxSNInput.focus()
          })
          break;
        case '2':
          this.snDisabled = true
          this.isLockBoxSN = false
          this.$nextTick(function () {
            this.$refs.BoxSNInput.focus()
          })
          break;
        default:
          this.snDisabled = false
          this.isLockBoxSN = true
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
      }
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
      PackSetConfirmPOAsync(params).then(
        (res) => {
          let data = res.ResData
          try {
            if (res.Success && data) {
              this.disabledConfirm = true
              this.isDisable = true
              this.isShowInfo = true
              // debugger
              this.BOMtableData = data.UniversalConfirmPoOutput ? data.UniversalConfirmPoOutput.MesProductStructures : []
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
              data.UniversalConfirmPoOutput.RouteDataDiagram1.forEach((element) => {
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
              this.FullBoxQTY = data.FullBoxQTY || 0

              /* 说明：
             0： 原始模式，只需要扫描箱码，不能扫描栈板条码 -- 栈板输入框隐藏
             1： 先扫栈板再扫条码-- 两输入框都显示
             2： 只扫栈板-- 扫描条码框隐藏
             */
              // this.scanPallet = data.CurrentInitPageInfo.IsScanPalletSNOrCartonBoxSN
              this.BoxType = data.CurrentInitPageInfo.stationAttribute.IsScanPalletSNOrCartonBoxSN
              this.handleScanType(this.BoxType)

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
      PackGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            let o = data.CurrentInitPageInfo
            this.ApplicationType = o.stationAttribute.ApplicationType;

            let pn = o.stationAttribute.IsCheckPN;
            let po = o.stationAttribute.IsCheckPO;

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
    handleFormatData(query) {
      let params = {};
      for (const key in query) {
        if (key != 'IsEntry') {
          params[key] = query[key] + ''
        } else {
          params[key] = query[key]
        }
      }
      delete params.S_DefectID
      return params
    }
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
