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
                      :is-show-work-order="IsCheckPO" :is-disable-unit-status="true" :is-show-status="false"
                      :is-show-line="false" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
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
                        <div class="form_box sidebar">

                          <el-form ref="ruleForm" :model="query" :rules="rules" label-width="110px" class="demo-ruleForm" @submit.native.prevent>
                            <el-row :gutter="10" style="margin-top: 30px;">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('vendor')" prop="Vendor">
                                  <el-select v-model="query.Vendor" placeholder="" style="width: 100%" clearable
                                    value-key="ID" @change="handleVendorChange">
                                    <el-option v-for="item in vendorOptions" :key="item.ID" :label="item.Description"
                                      :value="item">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('batch')" prop="LotCode">
                                  <el-input v-model.trim="query.LotCode" autocomplete="off"
                                    :disabled="!isDisableBatch"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('rollCode')">
                                  <el-input v-model.trim="query.RollCode" autocomplete="off"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('Unit')">
                                  <el-select v-model="query.Unit" placeholder="" style="width: 100%" clearable>
                                    <el-option v-for="item in ['pcs', 'm']" :key="item" :label="item" :value="item">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('batchQTY')" prop="Quantity">
                                  <el-input v-model.number.trim="query.Quantity" type="number"
                                    autocomplete="off"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('MaterialDate')" prop="MaterialDate">
                                  <el-date-picker v-model="query.MaterialDate" type="date" placeholder=""
                                    value-format="yyyyMMdd" style="width:100%">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item label="MPN">
                                  <el-input v-model.trim="query.MPN" autocomplete="off"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('ProductDate')">
                                  <el-date-picker v-model="query.DateCode" type="date" placeholder=""
                                    value-format="yyyyMMdd" style="width:100%">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="12">
                                <el-form-item :label="$t('ExpiringDate')" prop="ExpiringTime">
                                  <el-date-picker v-model="query.ExpiringTime" type="date" placeholder=""
                                    style="width:100%" value-format="yyyy-MM-dd">
                                  </el-date-picker>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('TranceCode')">
                                  <el-input v-model.trim="query.TranceCode" autocomplete="off"
                                    :disabled="!isDisableTrance"
                                    @keypress.native.enter="handleMainSn(query.TranceCode)"></el-input>
                                </el-form-item>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item :label="$t('MaterialAssigned')">
                                  <el-radio-group v-model="query.Type">
                                    <el-radio :label="'0'">{{ $t('publicProject') }}</el-radio>
                                    <el-radio :label="'1'">{{ $t('designatedProject') }}</el-radio>
                                    <el-radio :label="'2'">{{ $t('ExcludedItems') }}</el-radio>
                                  </el-radio-group>
                                </el-form-item>
                              </el-col>
                              <el-col v-if="query.Type != '0'" :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <el-form-item label="">
                                  <el-select v-model="query.Assigned" placeholder="" style="width: 100%" multiple
                                    clearable>
                                    <el-option v-for="item in AssignedOptions" :key="item.PartID"
                                      :label="item.Description" :value="item.PartID">
                                    </el-option>
                                  </el-select>
                                </el-form-item>
                              </el-col>
                            </el-row>

                            <!-- 按钮控制 -->
                            <el-row :span="20">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
                                <div style="text-align: right;">
                                  <el-button style="margin-left: 15px; padding: 5px 8px; position: relative; top: 3px;"
                                    size="small" :disabled="!isConnectPrint" @click="handlePrint">
                                    <print-button ref="PrintButton" style="position: relative; top: -2px;"
                                      :disabled="!isConnectPrint" @IsConnectPrint="handleConnectPrint"
                                      @error="handleSocketError" @success="handleSocketMsg">
                                      <span slot="append" style="padding-left: 5px;">{{ $t('patchPrint') }}</span>
                                    </print-button>
                                  </el-button>
                                  <el-button type="primary" size="small" @click="handleRegister('ruleForm')">{{
                                    $t('register') }}</el-button>
                                </div>
                              </el-col>
                            </el-row>
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
  </div>
</template>

<script>
import StationMixin from "../../mixin/mixin";
import {
  MaterialInitGetPageInitialize,
  MaterialInitSetConfirmPO,
  MaterialInitTranceCodeKeyDown,
  MaterialInitSetRePrint,
  MaterialInitSetRegister,
} from "@/api/application.js";
//物料初始化
export default {
  name: "MaterialInit",
  components: {
  },
  mixins: [StationMixin],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value <= 0 || value > this.query.MaterialBatchQTY) {
        callback(new Error(this.$t('TheQuantityDoesNotMeetTheRequirement')));
      } else {
        callback();
      }
    };
    var validatePassDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('canNotBeEmpty')));
      }
      let d = new Date().getTime();
      let currentDate = new Date(value.replace(/-/g, '/')).getTime()
      if (currentDate <= d) {
        callback(new Error(this.$t('TheExpirationDateCannotBeLaterThanTheCurrentTime')));
      } else {
        callback();
      }
    };
    return {
      // isLockBoxSN: true,
      // snDisabled: true,
      paneLengthPercent: 64,
      paneLengthPercent1: 25,
      paneLengthPercent2: 85,
      sideslipFlag: true,
      isDisableBatch: false,
      isDisableTrance: false,
      params: {
        MPN: '',
        Vendor: '',
        VendorID: '',
        LotCode: '',
        RollCode: '',
        VendorCode: '',
        Unit: '',
        Quantity: '',
        MaterialDate: '',
        DateCode: '',
        ExpiringTime: '',
        TranceCode: '',
        Type: '0',
        Assigned: []
      },
      printerParams: {
        IsPrint: false,
        LabelCommand: "",
        LabelPath: "",
        PrintIPPort: "",
        SNFormatName: ""
      },
      AssignedOptions: [],
      vendorOptions: [],
      Expires_Time: '',
      rules: {
        Vendor: [{ required: true, message: this.$t('canNotBeEmpty'), trigger: 'change' }],
        Quantity: [
          { validator: validatePass, trigger: 'blur' }
        ],
        LotCode: [{ required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' }],
        ExpiringTime: [
          { required: true, validator: validatePassDate, trigger: 'change' },
        ],
      }
    };
  },
  created() {
    this.$set(this.query, 'S_URL', this.$route.path)
    this.$nextTick(function () {

      Object.keys(this.params).forEach(key => {
        if (key === 'Type') {
          this.$set(this.query, key, '0')
        } else if (Array.isArray(this.params[key])) {
          this.$set(this.query, key, [])
        } else {
          this.$set(this.query, key, '')
        }
      })
    })
  },
  methods: {
    handleVendorChange(item) {
      this.$set(this.query, 'VendorID', item.ID)
      this.$set(this.query, 'VendorCode', item.Code)
    },
    handleRegister(formName) {
      let params = JSON.parse(JSON.stringify(this.query));
      this.$set(params, 'Assigned', params.Assigned.join(','))
      this.$refs[formName].validate((valid) => {
        if (valid) {
          MaterialInitSetRegister(params).then(res => {
            try {
              let data = res.ResData
              if (res.Success && data) {
                this.hintInfos.unshift({
                  msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
                  result: "success",
                });
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
            }
          }, error => {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${error}`,
              result: "error",
            });
            document.querySelector("#NGPlay").play();
          })

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    print(listSN, LabelPath) {
      if ((!listSN && listSN.length === 0) || !this.isConnectPrint) {
        return;
      }
      let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${listSN.join(',')}|${LabelPath}|${this.query.S_PartID}`
      this.$refs.PrintButton.send(printStr)
    },
    handlePrint() {
      this.$prompt(this.$t(this.$t('PleaseScanOrEnterTheBatchNumber')), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
      }).then(({ value }) => {
        let params = this.formatData(JSON.parse(JSON.stringify(this.query)));
        this.$set(params, 'LotCode', value.trim())
        MaterialInitSetRePrint(params).then(res => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "success",
              });
              this.print(data.ListSN, data.LabelPath)
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
      MaterialInitGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
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
            // this.$set(this.printerParams, 'IsPrint', data.IsPrint === '1')
            // this.$set(this.printerParams, 'LabelCommand', data.)
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
      // this.isLockBoxSN = true;
      // this.snDisabled = true;
      //清空录入信息相关
      Object.keys(this.query).forEach(key => {
        if (key === 'Type') {
          this.$set(this.query, key, '0')
        } else if (Array.isArray(this.query[key])) {
          this.$set(this.query, key, [])
        } else {
          this.$set(this.query, key, '')
        }
      })
    },
    //追溯码
    handleMainSn(val) {
      if (!val) return
      let params = {
        TranceCode: this.query.TranceCode,
        MaterialCodeRules: this.query.MaterialCodeRules,
        MaterialDate: this.query.MaterialDate,
        Expires_Time: this.Expires_Time
      }
      MaterialInitTranceCodeKeyDown(params, false, true).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')} : ${res.ResultMsg}`,
                result: "success",
              });
              // this.isLockBoxSN = true;
              this.$set(this.query, 'LotCode', data.LotCode)
              this.$set(this.query, 'DateCode', data.DateCode)
              this.$set(this.query, 'MaterialDate', data.MaterialDate)
              this.$set(this.query, 'ExpiringTime', `${data.ExpiringTime.slice(0, 4)}-${data.ExpiringTime.slice(4, 6)}-${data.ExpiringTime.slice(6)}`)

              let item = this.vendorOptions.find(r => r.Code === data.VendorCode)
              if (item) {
                this.$set(this.query, 'VendorID', item.ID)
                this.$set(this.query, 'VendorCode', item.Code)
                this.$set(this.query, 'Vendor', item)
              }

              this.quantity++


            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: "error",
              });
              this.$set(this.query, "S_SN", "");

            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: `${this.$t("dataException")}:  ${new Date().format('yyyy-MM-dd hh:mm:ss')} ` + err,
              result: "error",
            });
            this.$set(this.query, "S_SN", "");

          } finally {
            if (res.Sounds === "OK") {
              document.querySelector("#OKPlay").play();
            } else if (res.Sounds === "RE") {
              document.querySelector("#REPlay").play();
            } else {
              document.querySelector("#NGPlay").play();
              this.$set(this.query, "S_SN", "");
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
      MaterialInitSetConfirmPO(params, true, true).then(
        (res) => {
          try {
            let data = res.ResData;
            if (res.Success && data) {
              this.disabledConfirm = true;
              this.isDisable = true;
              this.isShowInfo = true;
              this.BOMtableData = data.mesProductStructures ? data.mesProductStructures : [];
              this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : '';
              this.vendorOptions = [...data.Vendor]
              this.AssignedOptions = [...data.GetMaterailBomData]

              this.isDisableBatch = data.LotCode;
              this.isDisableTrance = data.TranceCode;
              if (this.isDisableTrance) {
                this.Expires_Time = data.Expires_Time
              }
              this.$set(this.query, 'Unit', data.Unit);

              this.$set(this.query, 'B_LotCode', data.LotCode)
              this.$set(this.query, 'B_TranceCode', data.TranceCode)
              this.$set(this.query, 'MaterialCodeRules', data.MaterialCodeRules)
              this.$set(this.query, 'MaterialAuto', data.MaterialAuto)
              this.$set(this.query, 'M_UnitConversion_PCS', data.M_UnitConversion_PCS)
              this.$set(this.query, 'MaterialLable', data.MaterialLable)
              this.$set(this.query, 'MaterialBatchQTY', data.MaterialBatchQTY)
              this.$set(this.query, 'Batch_Pattern', data.Batch_Pattern)
              this.$set(this.query, 'Quantity', data.MaterialBatchQTY)


              this.$set(this.printerParams, 'IsPrint', data.MaterialLable === '1')
              this.$set(this.printerParams, 'LabelCommand', data.LabelPath)

              if (data.MaterialLable === '1') {
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

