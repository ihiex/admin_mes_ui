<template>
  <div v-if="IsLegalPage" class="app_container">
    <z-column direction="row" :min="5" :max="300" :pane-length-percent.sync="paneLengthPercent" :is-show-down="isUnfold"
      :title-style="{ width: '5px' }">
      <div slot="one" style="height: inherit; width: 100%; ">
        <z-row direction="column" :min="5" :max="300" :trigger-length="22" :pane-length-percent.sync="paneLengthPercent1"
          :title="$t('InputData')" :title-style="{ 'line-height': '22px' }">
          <div slot="one" style="height: 100%; ">
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
              <div v-if="false" class="query_box">
                <transition name="slide-fade">
                  <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                    :is-show-work-order="IsCheckPO" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
                    @Reset="handleQueryReset" @setPartItem="handlePartItem"></MesQuery>
                </transition>
              </div>
            </div>
          </div>
          <div slot="two" style="height: 100%;">
            <z-row direction="column" :min="5" :max="300" :trigger-length="22"
              :pane-length-percent.sync="paneLengthPercent2" :title="$t('message')"
              :title-style="{ 'line-height': '22px' }">
              <div slot="one" style="height: 100%; box-sizing: border-box; overflow-y: auto ; display: flex;">
                <div class="input_data" style="height: inherit;">
                  <div v-if="true" class="input_box" style="height: 100%;">
                    <div class="sn_container sn_input_box">
                      <div class="sn_container_left">
                        <div class="form_box">

                          <div class="form_container">
                            <el-row :gutter="10">
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="input_container">
                                <div>{{ $t('operationType') }}</div>
                                <div>
                                  <el-radio-group v-model="query.S_Type" :disabled="true">
                                    <el-radio v-for="item in optionType" :key="item.value" :label="item.value">{{
                                      item.label }}</el-radio>
                                  </el-radio-group>
                                </div>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="input_container">
                                <div>{{ $t('ScanSN') }}</div>
                                <div>
                                  <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" autofocus
                                    :disabled="snDisabled" @keypress.native.enter="handleSNEnter(query.S_SN)"></el-input>
                                </div>
                              </el-col>
                              <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" style="text-align: right;">
                                <el-button plain class="print_btn" :disabled="isDisabledButton" @click="handlePrint">
                                  <print-button ref="PrintButton" :disabled="isDisabledButton"
                                    @IsConnectPrint="handleConnectPrint" @error="handleSocketError"
                                    @success="handleSocketMsg">
                                    <span slot="append" style="padding-left: 5px;">{{ $t('Print') }}</span>
                                  </print-button>
                                </el-button>
                                <el-button plain :disabled="isDisabledButton" @click="handleUnbind">{{ $t('Unbind')
                                }}</el-button>
                                <el-button plain @click="handleResetRework">{{ $t('reset') }}</el-button>
                              </el-col>
                            </el-row>
                          </div>
                          <div class="table_container">
                            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                              height="calc(100% - 1px)" border size="mini" @selection-change="handleSelectionChange">
                              <el-table-column type="selection" width="55">
                              </el-table-column>
                              <el-table-column prop="ID" label="ID" width="100" show-overflow-tooltip>
                              </el-table-column>
                              <el-table-column prop="SerialNumber" label="Serial Number" show-overflow-tooltip>
                              </el-table-column>
                              <el-table-column prop="Part" label="Part" width="150" show-overflow-tooltip>
                              </el-table-column>
                              <el-table-column prop="InsertedTime" label="Inserted Time" width="160"
                                show-overflow-tooltip>
                              </el-table-column>
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
    <!--  <div id="HintMenu" class="hint_menu" @click="handleClearShowHint">
      {{ $t('cleanHintMsg') }}
    </div> -->
    <showDefectCode ref="showDefectCode" @confirm="handleDefectConfirm"></showDefectCode>
  </div>
</template>

<script>
import StationMixin from '../../mixin/mixin'

import {
  ReworkGetPageInitialize,
  ReworkSetScanSNGetRework,
  SetRework,
  ReworkPrint
} from '@/api/application.js'

//组装解绑
/*
G52GK0EF193K
G52GK0ZN193K
G52GK1YH193K
G52GK1YK193K
G52GK1ZT193K
G52GK215193K
G5CGK0UQ192X
G5CGK2D5192X
G53GK04U1935
G53GK07B1935

G53GH0RZ193J
G53GH106193J
G53GH14J193J
G53GH1Q9193J
G53GJ1ZZ193K
G5DGJ2A51936
G5DGJ32H1936
G5DGJ34N1936
*/
export default {
  name: 'Rework',
  mixins: [StationMixin],
  data() {
    return {
      paneLengthPercent: 64,
      paneLengthPercent1: 8,
      paneLengthPercent2: 75,
      optionType: [
        { value: 1, label: 'SN' },
        { value: 2, label: 'UPC' },
        { value: 3, label: 'MultiPack' },
        { value: 4, label: 'Pallet' },
      ],
      tableData: [],
      multipleSelection: [],
      isDisabledButton: true,
      snCache: '',
    }
  },
  watch: {
    tableData: function (val, oval) {
      if (val.length === 0) {
        this.isDisabledButton = true
      } else {
        this.isDisabledButton = false
      }
    }
  },
  created() {
    this.$set(this.query, 'S_Type', null)
  },
  methods: {
    handleAllSelect() {
      this.$refs.multipleTable.toggleAllSelection()
    },
    handleResetRework() {
      this.$confirm(
        this.$t('cleanTheDataDoYouWantToContinue'),
        this.$t('hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.tableData = []
          this.multipleSelection = []
          this.snCache = ''
          this.$set(this.query, 'S_SN', '')
        })
        .catch(() => { })
    },
    handleUnbind() {
      this.$confirm(this.$t('ClickUnderstandBindingOperation'), this.$t('hint'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {

        SetRework({ S_SN: this.snCache, S_Type: this.query.S_Type, S_URL: this.query.S_URL }).then(res => {
          if (res.Success && res.ResData) {
            this.hintInfos.unshift({
              msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
              result: 'success',
            })

            this.handleResetRework()
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        }, error => {
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        })
      }).catch(() => {
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handlePrint() {
      let sns = this.multipleSelection.map(res => res.SerialNumber)
      ReworkPrint({
        S_SN: this.snCache,
        S_ListSN: sns.join(';'),
        S_Type: this.query.S_Type,
        S_URL: this.query.S_URL
      }).then(res => {
        let data = res.ResData
        if (res.Success && data) {
          this.hintInfos.unshift({
            msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${res.ResultMsg}`,
            result: 'success',
          })
          let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${sns.join(',')}|${data.LabelPath}|${data.PartID}`
          this.isConnectPrint && this.$refs.PrintButton.send(printStr)

        } else {
          this.hintInfos.unshift({
            msg: res.ResultMsg,
            result: 'error',
          })
        }
      }, error => {
        this.hintInfos.unshift({
          msg: error.toString(),
          result: 'error',
        })
      })
    },
    /* 扫描 */
    handleSNEnter(val) {
      if (!val) return
      this.snCache = val
      this.snDisabled = true
      ReworkSetScanSNGetRework(
        { S_SN: val, S_URL: this.query.S_URL, S_Type: this.query.S_Type },
        false,
        true
      ).then(
        (res) => {
          try {
            let data = res.ResData
            if (res.Success && data) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg
                  }`,
                result: 'success',
              })
              this.quantity++
              this.tableData = [...data.ReworkData]
              this.$nextTick(function () {
                this.handleAllSelect()
              })
            } else {
              this.hintInfos.unshift({
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
            if (res.Sounds === 'OK') {
              document.querySelector('#OKPlay').play()
            } else if (res.Sounds === 'RE') {
              document.querySelector('#REPlay').play()
            } else {
              document.querySelector('#NGPlay').play()
            }
            this.snDisabled = false
            this.$set(this.query, 'S_SN', '')
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.$set(this.query, 'S_SN', '')
          this.snDisabled = false
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
          this.hintInfos.unshift({
            msg: error.toString(),
            result: 'error',
          })
        }
      )
    },
    GetPageInitialize() {
      ReworkGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
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
            //初始化打印服务
            if (this.isPrint && this.socketAddress) {
              this.$nextTick(function () {
                this.$refs.PrintButton && this.$refs.PrintButton.init(this.socketAddress)
              })
            }
            let obj = this.optionType.find(item => item.label === data.OperationType)
            obj && this.$set(this.query, 'S_Type', obj.value)
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
</script >
<style lang="scss" scoped>
.form_box {
  flex-direction: column;

  .form_container {
    flex: 2;
    margin-top: 10px;
    width: 100%;

    .input_container {
      display: flex;
      margin: 5px 0;

      &>div {
        height: 32px;
        line-height: 32px;

        &:first-child {
          flex: 70px;
          min-width: 70px;
          padding: 0 15px;
        }

        &:last-child {
          width: 100%;
        }
      }
    }
  }

  .table_container {
    flex: 8;
    width: 100%;
  }
}


.print_btn {
  margin: 0;
  padding: 5px 10px;
  position: relative;
  top: 3px;

  .print-button {
    position: relative;
    top: -2px;
  }
}</style>
