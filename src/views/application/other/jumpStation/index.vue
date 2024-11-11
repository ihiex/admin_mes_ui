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
                      :is-show-work-order="IsCheckPO" :is-disable-unit-status="false"
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
              <div slot="one" style="height: 100%; display: flex;">
                <div class="input_data" style="display: flex;">
                  <div v-if="isShowInfo" class="input_box" style="margin: auto; width: 100%;">
                    <div class="sn_container sn_input_box">
                      <div class="sn_container_left">
                        <div>
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_title">{{ $t('ScanSN') }}:</div>
                                <div class="box_number">
                                  <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                    :disabled="snDisabled" style="width: 90%"
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
                </div>
              </div>
              <!-- @mousedown.stop.prevent="handleShowHintMouse" -->
              <div slot="two" style="height: 100%;">
                <div class="msg_box">
                  <!-- <h3>{{ $t('message') }}</h3> -->
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

    <!--   <div id="HintMenu" class="hint_menu" @click="handleClearShowHint">
      {{ $t('cleanHintMsg') }}
    </div> -->
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'
import { JSGetPageInitialize, JSSetConfirmPO, JSSetScanSN_JumpStation } from '@/api/application.js'

//过站
export default {
  name: 'JumpStation',
  mixins: [StationMixin],
  methods: {
    //初始化
    GetPageInitialize() {
      JSGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData[0]
            this.ApplicationType = obj.ApplicationType;
            let page = obj.IsLegalPage;
            this.IsCheckPN = obj.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = obj.IsCheckPO === "1" ? true : false;
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
      JSSetConfirmPO(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';

              data.RouteDataDiagram1.forEach((element) => {
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
              this.completed = data.ProductionOrderQTY[0].currentCount || 0;
              this.target = data.ProductionOrderQTY[0].prodCount || 0;
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
    handleSNEnter(val) {
      if (!val) return
      // this.snDisabled = true
      let params = JSON.parse(JSON.stringify(this.query))
      params.S_SN = val

      JSSetScanSN_JumpStation(params, false, true).then(
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
              msg: err,
              result: 'error',
            })
          } finally {

            this.handleFinally(res.Sounds)

            /* if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              document.querySelector('#NGPlay').play()
            }
            this.snDisabled = false
            this.$set(this.query, 'S_SN', '') */
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
        }
      )
    },
  }
}
</script>

