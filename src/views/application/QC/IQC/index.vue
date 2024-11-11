<template>
  <div v-if="IsLegalPage" class="app_container">
    <z-column direction="row" :min="5" :max="300" :pane-length-percent.sync="paneLengthPercent" :is-show-down="isUnfold"
      :title-style="{ width: '5px' }">
      <div slot="one" style="height: inherit; width: 100%;">
        <!-- :danger-warning="dangerWarning" -->
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
                  <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                    :is-show-work-order="IsCheckPO" :is-disable-unit-status="false"
                    @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm" @Reset="handleQueryReset"
                    @setPartItem="handlePartItem"></MesQuery>
                </transition>
              </div>
            </div>
          </div>
          <div slot="two" style="height: 100%;">
            <z-row direction="column" :min="5" :max="300" :trigger-length="22"
              :pane-length-percent.sync="paneLengthPercent2" :title="$t('message')"
              :title-style="{ 'line-height': '22px' }">
              <div slot="one" style="height: 100%; display: flex;">
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container sn_input_box">
                      <el-row>
                        <el-col :span="24">
                          <div style="font-size: 60px; text-align: center"
                            :class="'unitStatusColor' + query.S_UnitStatus">{{ unitStatus.Description }}</div>
                        </el-col>
                        <el-col :span="24">
                          <div class="box_container">
                            <div class="box_title">{{ $t('ScanSN') }}:</div>
                            <div class="box_number">
                              <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                :class="'unitStatusBG' + query.S_UnitStatus" :disabled="snDisabled" style="width: 90%"
                                @keypress.native.enter="handleSNEnterQueue(query.S_SN)"></el-input>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row v-if="!isShowChildSN">
                        <el-col :span="24">
                          <div class="box_container">
                            <div class="box_title">{{ $t('InnerSN') }}:</div>
                            <div class="box_number">
                              <el-input ref="childSNInput" v-model.trim="query.S_ChildSN" autocomplete="off" clearable
                                style="width: 90%" :disabled="childSNDisabled"
                                @keypress.native.enter="handleChildSNEnter(query.S_ChildSN)"></el-input>
                            </div>
                          </div>
                        </el-col>
                      </el-row>
                      <el-row v-if="query.S_UnitStatus === 2 || query.S_UnitStatus === 3">
                        <el-col :span="22" :offset="2" :class="'unitStatusColor' + query.S_UnitStatus"
                          class="show_defect_code">
                          DefectCode: {{ query.DefectCode }}
                        </el-col>
                      </el-row>
                    </div>
                  </div>
                </div>
              </div>
              <div slot="two" style="height: 100%">
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
    <ErrorQC ref="ErrorQC"></ErrorQC>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'
import RightInfoSplit from '../../common/rightInfoSplit.vue'
import { IQCGetPageInitialize, IQCSetConfirmPO, IQCSetScanChildSN, IQCSetScanSN } from '@/api/application.js'
//IQC

export default {
  name: 'IQC',
  components: {
    RightInfoSplit
  },
  mixins: [StationMixin],
  data() {
    return {
      isShowChildSN: false,
      childSNDisabled: true,
    }
  },
  created() {
    this.$set(this.query, 'S_ChildSN', '')
  },
  methods: {
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.snDisabled = false
      this.$set(this.query, 'S_SN', '')
      this.$set(this.query, 'S_ChildSN', '')
    },
    handleChildSNEnter(val) {
      IQCSetScanChildSN(this.query).then(res => {
        try {
          if (res.Success && res.ResData) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg}`,
              result: 'success',
            })
            this.snDisabled = false;
            this.childSNDisabled = true;
            this.$set(this.query, 'S_SN', '')
            this.$set(this.query, 'S_ChildSN', '')
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
            this.$set(this.query, 'S_ChildSN', '')
          }
        } catch (error) {
          this.hintInfos.unshift({
            msg: err,
            result: 'error',
          })
        } finally {
          this.handleFinally(res.Sounds)
        }
      }, (error) => {
        document.querySelector('#NGPlay').play()
        this.snDisabled = false
        this.$nextTick(function () {
          this.$refs.snInput.focus()
        })
        this.$set(this.query, 'S_SN', '')
        this.hintInfos.unshift({
          msg: res.ResultMsg,
          result: 'error',
        })
        this.handleShowQCError()
      })
    },
    /* 队列模式 */
    handleSNEnterQueue(val) {
      // debugger
      if (!val) return
      this.SNList.push(val)
      this.isShowChildSN && this.$set(this.query, 'S_SN', '')
      if (this.SNList.length > 0 && !this.isRunning) {
        this.isRunning = true
        this.handleSNEnter(this.SNList.shift())
      }
    },
    /* 扫描 */
    handleSNEnter(val) {
      if (!val) return
      // 增加只扫条码时快扫功能
      !this.isShowChildSN && (this.snDisabled = true)
      let params = JSON.parse(JSON.stringify(this.query))
      params.S_SN = val
      IQCSetScanSN(params, false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg}`,
                result: 'success',
              })

              if (!this.isShowChildSN) {
                this.childSNDisabled = false
                this.$nextTick(function () {
                  this.$refs.childSNInput.focus()
                })
              } else {
                /*  this.snDisabled = false
                 this.$set(this.query, 'S_SN', '') */
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              }

              if (this.query.S_UnitStatus == 1) {
                this.quantity++
              } else if (this.query.S_UnitStatus == 2) {
                this.rejectQuantity++
              } else if (this.query.S_UnitStatus == 3) {
                this.scrapQuantity++
              }
              // this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
              // this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
              this.$set(this.query, 'S_SN', '')
              if (!this.isShowChildSN) {
                this.snDisabled = false
                this.$nextTick(function () {
                  this.$refs.snInput.focus()
                })
              }
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: err,
              result: 'error',
            })
          } finally {
            this.handleFinally(res.Sounds)
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.snDisabled = false
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
          this.$set(this.query, 'S_SN', '')
          this.hintInfos.unshift({
            msg: res.ResultMsg,
            result: 'error',
          })
          this.handleShowQCError()
        }
      )
    },
    GetPageInitialize() {
      IQCGetPageInitialize({ S_URL: this.$route.path }, true, true).then((res) => {
        try {
          let data = res.ResData[0];
          if (res.Success && data) {
            this.ApplicationType = data.ApplicationType;
            let pn = data.IsCheckPN
            let po = data.IsCheckPO
            let page = data.IsLegalPage
            this.IsCheckPN = pn === '1' ? true : false
            this.IsCheckPO = po === '1' ? true : false
            this.IsLegalPage = page === '1' ? true : false
            this.isPrint = data.IsPrint === '1';
            this.socketAddress = data.PrintIPPort ? data.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';
            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t('TheSelectedPageDoesNotMatchTheSite'),
                type: 'warning',
                showClose: true,
              })
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        } catch (error) {
          this.IsCheckPN = false
          this.IsCheckPO = false
          this.IsLegalPage = false
          this.ApplicationType = false
        }
      })
    },
    /* 确定 */
    handleConfirm(query, isShowLoading) {
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
      IQCSetConfirmPO(params, true)
        .then((res) => {
          let data = res.ResData
          if (res.Success && data) {
            this.disabledConfirm = true
            this.isDisable = true
            this.isShowInfo = true
            this.childSNDisabled = true
            this.BOMtableData = data ? data.mesProductStructures : []
            this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
            this.$set(this.query, 'S_InnerSN_Pattern', data.InnerSN_Pattern)
            this.isShowChildSN = data.InnerSN_Pattern == 0 //为0时 不显示

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
            this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
            this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0

            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        })
    },
  }
}
</script>
