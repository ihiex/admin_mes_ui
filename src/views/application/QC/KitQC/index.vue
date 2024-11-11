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
              <div slot="one" style="height: 100%;display: flex;">
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
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
    <ErrorQC ref="ErrorQC"></ErrorQC>
  </div>
</template>

<script>
import StationMixin from '@/views/application/mixin/mixin'
import RightInfoSplit from '@/views/application/common/rightInfoSplit.vue'
import { KitQCGetPageInitialize, KitQCSetConfirmPO, KitQCMainSnVerifyAsync } from '@/api/application'

//KitQC
/*
COO:CN,sG51H40BL1Q41
COO:CN,sG51H40C71Q41
*/
export default {
  name: 'KitQC',
  components: {
    RightInfoSplit
  },
  mixins: [StationMixin],
  watch: {
    "query.S_UnitStatus": function (val, oval) {
      console.log(this.query)
    }
  },
  methods: {
    handleSNEnter(val) {
      if (!val) return;
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = (this.query[key] ? this.query[key] : '') + ''
        }
      }
      params.S_SN = val

      // this.snDisabled = true
      KitQCMainSnVerifyAsync(params).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg}`,
                result: 'success',
              })

              if (this.query.S_UnitStatus == 1) {
                this.quantity++
              } else if (this.query.S_UnitStatus == 2) {
                this.rejectQuantity++
              } else if (this.query.S_UnitStatus == 3) {
                this.scrapQuantity++
              }

              this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
              this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: err.toString(),
              result: 'error',
            })
          } finally {
            this.handleFinally(res.Sounds)
            this.snDisabled = false
            this.$set(this.query, 'S_SN', '')
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
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
    /* 确定 */
    handleConfirm(query, isShowLoading) {
      let params = {}
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(',')
        } else {
          params[key] = query[key] ? query[key] : '' + ','
        }
      }
      this.BOMtableData = []
      this.craftTableData = []
      KitQCSetConfirmPO(params, true)
        .then((res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.disabledConfirm = true
              this.isDisable = true
              this.isShowInfo = true
              let un = data.UniversalConfirmPoOutput
              this.BOMtableData = un ? un.MesProductStructures : []
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
              un.RouteDataDiagram1 && un.RouteDataDiagram1.forEach((element) => {
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
              this.completed = un.ProductionOrderQTY ? un.ProductionOrderQTY[0].currentCount : 0
              this.target = un.ProductionOrderQTY ? un.ProductionOrderQTY[0].prodCount : 0
              this.$nextTick(function () {
                this.$refs.snInput.focus()
              })
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
            }
          } catch (error) {
            this.$message.error(error.toString())
            this.hintInfos.unshift({
              msg: error.toString(),
              result: 'error',
            })
          }
        })
    },

    GetPageInitialize() {
      KitQCGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData;
          if (res.Success && data) {
            let sab = data.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = sab.ApplicationType;

            this.IsCheckPN = sab.IsCheckPN === '1' ? true : false
            this.IsCheckPO = sab.IsCheckPO === '1' ? true : false
            this.IsLegalPage = data.CurrentInitPageInfo.IsLegalPage === '1' ? true : false

            /*  this.$set(this.query, 'S_IsCheckCardID', data.IsCheckCardID)
             this.$set(this.query, 'S_CardIDPattern', data.CardIDPattern) */

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
  },
}
</script>
