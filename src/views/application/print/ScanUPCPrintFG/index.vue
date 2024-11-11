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
                      :is-show-work-order="true" :is-show-line="false" :is-show-status="true"
                      :is-disable-unit-status="true" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
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
              <div slot="one" style="height: 100%; overflow: auto; display: flex;">
                <div class="input_data">
                  <!-- 录入信息 -->
                  <div v-if="isShowInfo" class="input_box">
                    <div class="sn_container">
                      <div class="sn_container_left">
                        <!-- <div class="form_box sidebar"> -->
                        <div style="width: 92%;">
                          <el-form ref="ruleForm" :model="query" :rules="rules" label-width="110px" class="demo-ruleForm" @submit.native.prevent>
                            <el-form-item :label="$t('templateName')" prop="templateName">
                              <el-input ref="BoxSNInput" v-model.trim="query.templateName" :title="query.templateName"
                                autocomplete="off" clearable :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item :label="$t('ScanOtherSN', { 0: 'UPC' })" prop="S_SN">
                              <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                @keypress.native.enter="handleCreateAndPrint('ruleForm', query.S_SN)">
                              </el-input>
                            </el-form-item>
                          </el-form>
                          <el-row>
                            <el-col :span="24">
                              <div class="box_container">
                                <div class="box_number">
                                  <print-button ref="PrintButton" @IsConnectPrint="handleConnectPrint"
                                    @error="handleSocketError" @success="handleSocketMsg"></print-button>
                                  <!--  <el-button type="primary" style="margin-top: 1px;" :disabled="!isConnectPrint"
                                    @click="handleCreateAndPrint('ruleForm')">
                                    {{ $t('createAndPrint') }}
                                  </el-button> -->
                                </div>
                              </div>
                            </el-col>
                          </el-row>
                        </div>
                        <!-- </div> -->
                        <!--  <i class="sideslip_btn" :class="{
                          'el-icon-caret-right': sideslipFlag,
                          'el-icon-caret-left': !sideslipFlag,
                        }" @click="sideslipFlag = !sideslipFlag"></i> -->
                      </div>
                      <!--  <div v-if="sideslipFlag" class="sn_container_right">
                        <div>
                          <p v-for="(item, index) in SNList" :key="index" style="padding: 0 10px">
                            {{ item }}
                          </p>
                        </div>
                      </div> -->
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
import StationMixin from '../../mixin/mixin'
import {
  ScanUPCToFGSetScanSN,
  ScanUPCToFGGetPageInitialize,
  ScanUPCToFGSetConfirmPO,
} from '@/api/application.js'

//扫描UPC条码打印FG

export default {
  name: 'ScanUPCPrintFG',
  mixins: [StationMixin],
  data() {
    return {
      SNList: [],
      sideslipFlag: true,
      webSocket: null,
      rules: {
        S_SN: [
          { required: true, message: this.$t('canNotBeEmpty'), trigger: 'blur' },
        ]
      },
    }
  },
  watch: {
    isShowInfo(val, oval) {
      if (val) {
        this.$nextTick(function () {
          this.$refs.PrintButton.init(this.socketAddress)
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
      this.$set(this.query, 'templateName', '')
      this.SNList = []
    },
    //创建并打印
    handleCreateAndPrint(formName, val) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //添加确认提示
          // this.$confirm(this.$t('printConfirm'), this.$t('hint'), {
          //   confirmButtonText: this.$t('confirm'),
          //   cancelButtonText: this.$t('cancel'),
          //   type: 'warning',
          // })
          //   .then(() => {
          this.query.S_LineNumber && delete this.query.S_LineNumber
          ScanUPCToFGSetScanSN(this.query).then(res => {
            if (res.Success && res.ResData) {
              this.SNList = res.ResData.ListSN
              //格式 "PRINT|工站|SN|模板|料号"
              let printStr = `PRINT|${this.$store.getters['stationSet/currentStation'].Description}|${res.ResData.ListSN.join(',')}|${res.ResData.LabelPath}|${this.query.S_PartID}`
              this.isConnectPrint && this.$refs.PrintButton.send(printStr)
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
            }
            this.$set(this.query, 'S_SN', '')
          }, (error) => {
            this.hintInfos.unshift({
              msg: error.toString(),
              result: 'error',
            })
            this.$set(this.query, 'S_SN', '')
          })
          // })
          // .catch(() => { })
        } else {
          return false;
        }
      });
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
      ScanUPCToFGSetConfirmPO(params, true, true).then(
        (res) => {
          if (res.Success && res.ResData) {
            this.disabledConfirm = true
            this.isDisable = true
            this.isShowInfo = true
            let data = res.ResData
            this.$set(this.query, 'templateName', data.LabelPath)
            this.BOMtableData = data ? data.mesProductStructures : []
            this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
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
    GetPageInitialize() {
      ScanUPCToFGGetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData[0]
          if (res.Success && data) {
            this.socketAddress = data.PrintIPPort ? data.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210'
            this.ApplicationType = data.ApplicationType;
            let pn = data.IsCheckPN
            let po = data.IsCheckPO
            let page = data.IsLegalPage
            this.IsCheckPN = pn === '1' ? true : false
            this.IsCheckPO = po === '1' ? true : false
            this.IsLegalPage = page === '1' ? true : false
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
<style lang="scss" scoped>
.box_number {
  min-width: 150px;
  text-align: right;
}
</style>
