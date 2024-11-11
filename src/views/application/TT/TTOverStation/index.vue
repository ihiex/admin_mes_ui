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
              <div slot="one" style="height: 100%; display: flex;">
                <div class="input_data" style="height: inherit;">
                  <div v-if="true" class="input_box">
                    <div class="sn_container sn_input_box">
                      <div class="sn_container_left" style="width: 100%; ">
                        <div class="form_box">
                          <el-form ref="form" :model="query" label-width="120px" @submit.native.prevent>
                            <el-form-item v-if="query.S_IsCheckCardID == 1" :label="$t('InputCardNumber')">
                              <el-input ref="CartInput" v-model.trim="query.S_CardID" autocomplete="off" clearable
                                :disabled="CartDisabled" style="width: 90%" :autofocus="true"
                                @keyup.native.enter="handleCheckCartID(query.S_CartID)">
                                <template slot="append">
                                  <el-button @click="CartDisabled = !CartDisabled">
                                    {{ CartDisabled ? $t('unlock') : $t('lock') }}
                                  </el-button>
                                </template>
                              </el-input>
                            </el-form-item>
                            <el-form-item :label="$t('ScanSN')">
                              <el-input ref="snInput" v-model.trim="query.S_SN" autocomplete="off" clearable
                                :disabled="snDisabled" style="width: 90%"
                                @keyup.native.enter="handleSNEnterQueue(query.S_SN)">
                              </el-input>
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
import { SetScanSN_TT, GetScanTTCardID } from '@/api/application.js'
//TT过站
export default {
  name: 'TTOverStation',
  mixins: [StationMixin],
  data() {
    return {
      paneLengthPercent: 64,
      paneLengthPercent1: 8,
      paneLengthPercent2: 75,
      CartDisabled: false,
    }
  },
  watch: {
    "query.S_IsCheckCardID": function (val, oval) {
      if (val === undefined || val == 0) {
        this.snDisabled = false;
      } else if (val == 1) {
        this.snDisabled = true;
      }
    },
    CartDisabled: function (val, oval) {
      if (!val && this.query.S_IsCheckCardID == 1) {
        this.snDisabled = true;
      } else {
        this.snDisabled = false;
      }
    }
  },

  methods: {
    handleCheckCartID(id) {
      GetScanTTCardID({ S_CardID: id, S_IsCheckCardID: this.query.S_IsCheckCardID, S_CardIDPattern: this.query.S_CardIDPattern }).then(res => {
        if (res.Success) {
          this.snDisabled = false;
          this.CartDisabled = true;
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
        }
      })
    },
    /* 扫描 */
    handleSNEnter(val) {
      if (!val) return
      // this.snDisabled = true
      SetScanSN_TT(
        { S_SN: val,
          S_URL: this.query.S_URL,
          S_CardID: this.query.S_CardID,
          S_IsCheckCardID: this.query.S_IsCheckCardID,
          S_CardIDPattern: this.query.S_CardIDPattern
        },
        false,
        true
      ).then(
        (res) => {
          try {
            if (res.Success /* && res.ResData */) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg
                  }`,
                result: 'success',
              })
              this.quantity++
              //TT过站 没有以下数据返回
              /*  if (this.query.S_UnitStatus == 1) {
                this.quantity++
              } else if (this.query.S_UnitStatus == 2) {
                this.rejectQuantity++
              } */
              /*  let data = res.ResData
              this.completed = data[0][0] ? data[0][0].currentCount : 0
              this.target = data[0][0] ? data[0][0].prodCount : 0 */
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
            this.handleFinally(res.Sounds)
            // if (res.Sounds === 'OK') {
            //   document.querySelector('#OKPlay').play()
            // } else if (res.Sounds === 'RE') {
            //   document.querySelector('#REPlay').play()
            // } else {
            //   document.querySelector('#NGPlay').play()
            // }
            // this.snDisabled = false
            // this.$set(this.query, 'S_SN', '')
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
  },
}
</script>
<style lang="scss" scoped>
@import '../tt-style.scss';
</style>
