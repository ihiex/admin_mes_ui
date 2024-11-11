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
                <div class="input_data">
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <div class="form_box sidebar">
                          <el-form ref="ruleForm" :model="query" label-width="100px" class="demo-ruleForm" @submit.native.prevent>
                            <el-form-item :label="$t('SN')" prop="S_SN">
                              <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off"
                                clearable :autofocus="true" style="width: 100%"
                                @keypress.native.enter="handleSNEnterQueue(query.S_SN)"></el-input>
                            </el-form-item>
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
import StationMixin from "../../mixin/mixin";
import {
  RMAGetPageInitializeAsync,
  RMASetConfirmPOAsync,
  RMASnCheckAsync
} from "@/api/application.js";

//RMA 退货
export default {
  name: "RMA",
  mixins: [StationMixin],
  data() {
    return {
      paneLengthPercent: 64,
      paneLengthPercent1: 28,
      paneLengthPercent2: 80,
    };
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
  },

  methods: {

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
      return params
    },
    //初始化
    GetPageInitialize() {
      RMAGetPageInitializeAsync({ S_URL: this.$route.path }).then((res) => {
        try {
          if (res.Success && res.ResData) {
            let obj = res.ResData.CurrentInitPageInfo.stationAttribute
            this.ApplicationType = obj.ApplicationType;
            let page = res.ResData.CurrentInitPageInfo.IsLegalPage;
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
    //重置
    handleQueryReset() {
      this.disabledConfirm = false;
      this.isShowInfo = false;
      this.isDisable = false;
    },

    handleSNEnter(val) {
      // debugger
      let params = this.formatData(this.query)
      params.S_SN = val
      // !params.S_DefectID && (params.S_DefectID = "");
      delete params.S_LineNumber
      delete params.DefectCode

      RMASnCheckAsync(params, false, true).then(
        (res) => {
          try {
            if (res.Success) {
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
              let data = res.ResData
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
            // this.snDisabled = false
            // this.$set(this.query, 'S_SN', '')
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.isRunning = false;
          // this.snDisabled = false
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
          // this.$set(this.query, 'S_SN', '')
          this.hintInfos.unshift({
            msg: res.ResultMsg,
            result: 'error',
          })
          this.handleShowQCError()
        }
      )
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
      RMASetConfirmPOAsync(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.UniversalConfirmPoOutput.MesProductStructures;
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';

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
