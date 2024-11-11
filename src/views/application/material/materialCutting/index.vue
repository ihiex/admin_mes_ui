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
                  <el-button class="unfold_btn" type="text" size="mini"
                    :icon="isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'" @click="isUnfold = !isUnfold">
                  </el-button>
                </div>
              </div>
              <div v-if="IsCheckPN" class="query_box">
                <transition name="slide-fade">
                  <div>
                    <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                      :is-show-work-order="IsCheckPO" :is-disable-unit-status="true" :is-show-status="false"
                      :is-show-line="true" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
                      @Reset="handleQueryReset" @setPartItem="handlePartItem"></MesQuery>
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
                        <div class="form_box sidebar" style="flex-direction: column; margin: 0;">

                          <el-form ref="ruleForm" :model="params" label-width="100px" class="demo-ruleForm">
                            <el-row :gutter="10" style="margin-top: 30px;">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('operationType')">
                                  <el-radio-group v-model="Type" disabled>
                                    <el-radio :label="'SmallBatch'">{{ $t('SmallBatch') }}</el-radio>
                                    <el-radio :label="'BatchToSN'">{{ $t('BatchToSN') }}</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('BatchNo')" prop="Batch">
                                  <el-select v-model="params.Batch" placeholder="" style="width: 100%" clearable
                                    value-key="ID" @change="handleBatchChange">
                                    <div
                                      style="display: flex; padding: 0 0 0 20px; background-color: #eee; height: 28px; line-height: 28px;">
                                      <span
                                        style="width: 300px; overflow: hidden; text-overflow: ellipsis;">SerialNumber</span>
                                      <span style="width: 80px; ">Quantity</span>
                                      <span>UsageQTY</span>
                                    </div>
                                    <el-option v-for="item in batchOptions" :key="item.ID" :label="item.SerialNumber"
                                      :value="item">
                                      <div style="display: flex;">
                                        <span style="width: 300px; overflow: hidden; text-overflow: ellipsis;"
                                          :title="item.SerialNumber">{{ item.SerialNumber }}</span>
                                        <span style="width: 80px; ">{{ item.Quantity }}</span>
                                        <span>{{ item.UsageQTY }}</span>
                                      </div>
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('rollCode')">
                                  <el-input v-model.trim="params.RollNO" autocomplete="off"
                                    :disabled="isRollDisabled"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('specificationCount')" prop="SpecQTY">
                                  <el-input v-model.number.trim="params.SpecQTY" type="number" :disabled="!IsForceSplit"
                                    autocomplete="off"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('progressBar')">
                                  <el-progress :text-inside="true" text-color="#000" :stroke-width="24"
                                    :percentage="params.percentage" style="position: relative; top: 5px;"
                                    status="success"></el-progress>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <!-- 按钮控制 -->
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right; padding-right: 10px;">
                                  <!-- <el-button style="margin-left: 15px; padding: 5px 8px; position: relative; top: 3px;"
                                    size="small" :disabled="!isConnectPrint" @click="handlePrint"> -->
                                  <print-button ref="PrintButton" style="position: relative; top: -2px;"
                                    :disabled="!isConnectPrint" @IsConnectPrint="handleConnectPrint"
                                    @error="handleSocketError" @success="handleSocketMsg">
                                    <!-- <span slot="append">{{ $t('patchPrint') }}</span> -->
                                  </print-button>
                                  <!-- </el-button> -->
                                  <el-button type="primary" size="small" @click="handleSplit">{{
                                    $t('cutting') }}</el-button>
                                </div>
                              </el-col>
                            </el-row>
                          </el-form>
                          <div v-loading="snLoading" style="height: 200px; width: 97%;">

                            <el-table :data="tableData" style="width: 100%" height="100%" size="mini">
                              <el-table-column width="60" type="index" label="#">
                              </el-table-column>
                              <el-table-column prop="SN" label="SN" :show-overflow-tooltip="true">
                              </el-table-column>
                              <!-- <el-table-column prop="name" label="TmpPath" width="120">
                              </el-table-column>
                              <el-table-column prop="province" label="TargetPath" width="120">
                              </el-table-column>
                              <el-table-column prop="city" label="PartID" width="120">
                              </el-table-column>
                              <el-table-column prop="address" label="CreateTime" width="300">
                              </el-table-column>
                              <el-table-column prop="zip" label="PrintTime" width="120">
                              </el-table-column> -->
                            </el-table>
                          </div>
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
  </div>
</template>

<script>
import StationMixin from "../../mixin/mixin";
import {
  MaterialCuttingGetPageInitialize,
  MaterialCuttingSetConfirmPO,
  MaterialCuttingSetSplit,
  MaterialCuttingParentBatchNoValueChanged,
} from "@/api/application.js";
//物料切割SN

export default {
  name: "MaterialCutting",
  components: {
  },
  mixins: [StationMixin],
  data() {
    return {
      // isLockBoxSN: true,
      // snDisabled: true,
      paneLengthPercent: 64,
      paneLengthPercent1: 26,
      paneLengthPercent2: 85,
      isRollDisabled: false,
      Type: 'BatchToSN',
      params: {
        BatchNo: '',
        Type: 'BatchToSN', //SmallBatch（大批次切小批次）BatchToSN(批次切SN)
        RollNO: '',
        SpecQTY: null,
        UsageQTY: null,
        BatchQTY: null,
        ParentID: '',
        SN_Pattern: '',
        percentage: 0, //进度条
      },
      printerParams: {
        IsPrint: false,
        LabelCommand: "", //真打印模板
        LabelPath: "", //显示打印模板
        PrintIPPort: "", //打印ip,端口
        SNFormatName: ""
      },
      batchOptions: [],
      IsForceSplit: false,
      tableData: [],
      snLoading: false,
    };
  },
  watch: {
    /*  "params.percentage": function (val, oval) {
       console.log(val)
     } */
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
  },
  methods: {
    handleBatchChange(item) {
      console.log(item)
      this.isRollDisabled = item.RollCode != ""
      // this.$set(this.params, 'VendorCode', item.VendorCode)
      this.$set(this.params, 'BatchNo', item.SerialNumber)
      this.$set(this.params, 'ParentID', item.ID)
      this.$set(this.params, 'RollNO', item.RollCode)
      this.$set(this.params, 'UsageQTY', item.UsageQTY)
      this.$set(this.params, 'BatchQTY', item.Quantity)
      let result = item.UsageQTY / item.Quantity * 100
      this.$set(this.params, 'percentage', isNaN(result) ? 0 : parseFloat(result.toFixed(2)))
    },
    handleSplit() {
      Object.keys(this.query).forEach(key => {
        this.$set(this.params, key.replace(/S_/, ''), this.query[key])
      })
      // console.log(this.params)
      this.tableData = [];
      this.snLoading = true
      MaterialCuttingSetSplit(this.params).then(res => {
        try {
          let data = res.ResData
          if (res.Success && data) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
              result: "success",
            });
            // this.print(data.ListSN, data.LabelPath)
            data.ListSN.forEach(item => {
              this.tableData.push({ SN: item })
            })
            let obj = this.batchOptions.find(r => r.ID === this.params.ParentID)
            if (obj) {
              this.$set(obj, 'UsageQTY', data.UsageQTY)
              let result = obj.UsageQTY / obj.Quantity * 100
              this.$set(this.params, 'percentage', isNaN(result) ? 0 : parseFloat(result.toFixed(2)))
            }
            //打印
            this.print(data.ListSN, data.LabelPath)
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
        } finally {
          if (res.Sounds === "OK") {
            document.querySelector("#OKPlay").play();
          } else if (res.Sounds === "RE") {
            document.querySelector("#REPlay").play();
          } else {
            document.querySelector("#NGPlay").play();
          }
          this.snLoading = false
        }
      }, error => {
        this.hintInfos.unshift({
          msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${error}`,
          result: "error",
        });
        document.querySelector("#NGPlay").play();
        this.snLoading = false
      })
    },
    print(listSN, LabelPath) {
      if ((!listSN && listSN.length === 0) || !this.isConnectPrint) {
        return;
      }
      let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${listSN.join(',')}|${LabelPath}|${this.query.S_PartID}`
      this.$refs.PrintButton.send(printStr)
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
      return params
    },
    //初始化
    GetPageInitialize() {
      MaterialCuttingGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData[0]
          if (res.Success && data) {
            this.ApplicationType = data.ApplicationType;
            let page = data.IsLegalPage;
            this.IsCheckPN = data.IsCheckPN === "1" ? true : false;
            this.IsCheckPO = data.IsCheckPO === "1" ? true : false;
            this.IsLegalPage = page === "1" ? true : false;
            this.socketAddress = data.PrintIPPort ? data.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';

            this.$set(this.printerParams, 'PrintIPPort', this.socketAddress)
            this.$set(this.printerParams, 'IsPrint', data.IsPrint === '1')

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
      this.isRollDisabled = false;
      // this.isLockBoxSN = true;
      // this.snDisabled = true;
      //清空录入信息相关
      Object.keys(this.params).forEach(key => {
        if (key === 'Type') {
          this.$set(this.params, key, 'BatchToSN')
        } else if (Array.isArray(this.query[key])) {
          this.$set(this.params, key, [])
        } else {
          this.$set(this.params, key, '')
        }
      })
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
      this.$set(params, 'Type', 'BatchToSN');
      this.BOMtableData = [];
      this.craftTableData = [];
      this.completed = 0;
      this.target = 0;
      this.batchOptions = []
      MaterialCuttingSetConfirmPO(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';

              /*  let arr =  data.List_MaterailBatchData.map(r=>r.ID)
               Array.from(new Set(arr)).forEach(item=>{
                 let obj = data.List_MaterailBatchData.find(r=>r.ID === item)
                 this.batchOptions.push(obj)
               }) */
              this.batchOptions = data.List_MaterailBatchData ? [...data.List_MaterailBatchData] : []

              this.IsForceSplit = data.IsForceSplit


              this.$set(this.params, 'SN_Pattern', data.SN_Pattern)
              this.$set(this.params, 'Batch_Pattern', data.Batch_Pattern)
              this.$set(this.params, 'SpecQTY', data.SplitBatchQTY)

              //初始化打印服务
              this.$set(this.printerParams, 'LabelCommand', data.LabelPath)
              if (this.printerParams.IsPrint) {
                this.$nextTick(function () {
                  this.$refs.PrintButton.init(this.socketAddress)
                })
              }

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
  margin-bottom: 5px;
}

::v-deep {
  .el-progress-bar__innerText {
    color: #000;
  }
}
</style>
