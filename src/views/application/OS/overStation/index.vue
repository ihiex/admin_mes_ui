<template>
  <div v-if="IsLegalPage" class="app_container">
    <z-column direction="row" :min="5" :max="300" :pane-length-percent.sync="paneLengthPercent" :is-show-down="isUnfold"
      :title-style="{ width: '5px' }">
      <div slot="one" style="height: inherit; width: 100%;">
        <z-row direction="column" :min="5" :max="300" :trigger-length="22"
          :pane-length-percent.sync="paneLengthPercent1" :title="$t('InputData')"
          :title-style="{ 'line-height': '22px' }">
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
                    <el-button class="unfold_btn" type="text" size="mini" :icon="
                      isUnfold ? 'el-icon-d-arrow-right' : 'el-icon-d-arrow-left'
                    " @click="isUnfold = !isUnfold"></el-button>
                  </div>
              </div>
              <div v-if="IsCheckPN" class="query_box">
                <transition name="slide-fade">
                  <div>
                    <MesQuery ref="mesQuery" v-model="query" :disabled-confirm="disabledConfirm" :is-disable="isDisable"
                      :is-show-work-order="IsCheckPO" @UnitStateClickItem="UnitStateClickItem" @Confirm="handleConfirm"
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
                <div slot="one" style="height: 100%; display: flex;" >
                  <div class="input_data" style="display: flex;">
                    <div v-if="isShowInfo" class="input_box" style="margin: auto; width: 100%;">
                      <div class="sn_container sn_input_box">
                        <div class="sn_container_left">
                          <div class="form_box">
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
            :craft-table-value="craftTableData" :table-value="BOMtableData" :order-desc="pOrderDesc"
            @reset="handleReset">
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

//过站
export default {
  name: 'OverStationOperation',
  mixins: [StationMixin],
}
</script>

