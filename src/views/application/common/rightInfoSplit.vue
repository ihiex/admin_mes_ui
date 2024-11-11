<template>
  <div class="right_container1">
    <z-row direction="column" :min="5" :max="300" :trigger-length="22" :pane-length-percent.sync="paneLengthPercent"
      :title="$t('RouteDetail')" :title-style="{ 'line-height': '22px' }">
      <div slot="one" style="height: 100%; ">
        <!-- BOM信息 -->
        <div style="height: 100%;">
          <h3>{{ $t('DOMDetail') }}</h3>
          <el-table v-if="tableValue.length > 0" :data="tableValue" style="width: 100%" size="mini"
            height="calc(100% - 20px)" :row-class-name="BOMRowClassName">
            <el-table-column prop="PartNumber" :label="orderDesc"></el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="two" style="height: 100%;">
        <z-row direction="column" :min="5" :max="300" :trigger-length="22"
          :pane-length-percent.sync="paneLengthPercent1" :title="$t('PODetail')"
          :title-style="{ 'line-height': '22px' }">
          <div slot="one" style="height: 100%;">
            <!-- 工艺流程 -->
            <!-- <div> -->
            <!-- <h3>{{ $t('RouteDetail') }}</h3> -->
            <el-table :data="craftTableValue" style="width: 100%" size="mini" row-key="ID" height="calc(100% - 100px)"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" :row-class-name="CraftRowClassName">
              <el-table-column prop="StationType" :label="$t('StationType')" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="CurrentStation" :label="$t('CurrentStation')" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="OutputStation" :label="$t('PreviousStation')" :show-overflow-tooltip="true">
              </el-table-column>
              <el-table-column prop="Status" :label="$t('Status')" width="60" :show-overflow-tooltip="true">
              </el-table-column>
            </el-table>
            <!-- </div> -->
            <!-- 数量统计 -->
            <div style="padding: 10px 0; box-sizing: border-box">
              <el-form label-width="120px" class="demo-ruleForm">
                <el-form-item :label="$t('OverStationQTY') + ':'">
                  <el-input v-model="quantity" autocomplete="off" :readonly="true" type="number" style="width: 188px"
                    size="mini"></el-input>
                  <el-button size="mini" style="margin-left: 20px" @click="handleReset">
                    {{ $t('reset') }}
                  </el-button>
                </el-form-item>
                <el-form-item :label="$t('DefectQTY') + ':'">
                  <el-input v-model="rejectQuantity" autocomplete="off" :readonly="true" type="number"
                    style="width: 90px" size="mini"></el-input>
                  <span style="padding-left: 7px">
                    <span style="color: #606266; padding-right: 10px">
                      {{ $t('scrapQuantity') }}:
                    </span>
                    <el-input v-model="scrapQuantity" autocomplete="off" :readonly="true" type="number"
                      style="width: 90px" size="mini"></el-input>
                  </span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div slot="two" style="height: 100%; position: relative; z-index: 100; background-color: #fff;">
            <!-- 工单明细 -->
            <div class="work_container">
              <!-- <h3>{{ $t('PODetail') }}</h3> -->
              <div class="work_detail">
                <div>
                  <el-progress :text-inside="true" :stroke-width="20" :percentage="progress" status="success"></el-progress>
                </div>
                <div>
                  <span>{{ completed }}/{{ target }}</span>
                </div>
              </div>
            </div>
          </div>
        </z-row>
      </div>
    </z-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ZRow from 'z-layouts/ZRow.vue'

export default {
  name: 'RightInfoSplit',
  components: {
    ZRow
  },
  props: {
    progress: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    target: {
      type: Number,
      default: 0,
    },
    quantityValue: {
      type: Number,
      default: 0,
    },
    rejectQuantityValue: {
      type: Number,
      default: 0,
    },
    scrapQuantityValue: {
      type: Number,
      default: 0,
    },
    craftTableValue: {
      type: Array,
      default: () => {
        return new Array()
      },
    },
    tableValue: {
      type: Array,
      default: () => {
        return new Array()
      },
    },
    orderDesc: {
      type: String,
      default: '',
    },
  },

  data() {
    return {
      quantity: 0,
      rejectQuantity: 0,
      scrapQuantity: 0,
      paneLengthPercent: 25,
      paneLengthPercent1: 85,
    }
  },
  computed: {
    ...mapGetters({
      Station: 'stationSet/currentStation',
    }),
  },
  watch: {
    rejectQuantityValue(val, oval) {
      this.rejectQuantity = val
    },
    scrapQuantityValue(val, oval) {
      this.scrapQuantity = val
    },
    quantityValue(val, oval) {
      this.quantity = val
    },
  },
  methods: {
    BOMRowClassName({ row, rowIndex }) {
      if(row.PartNumber == this.orderDesc){
        return 'black_row'
      }else{
        return ''
      }
    },
    CraftRowClassName({ row, rowIndex }) {
      if (row.StationTypeID == this.Station.StationTypeID) {
        return 'black_row'
      } else {
        return ''
      }
    },
    handleReset() {
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
          this.rejectQuantity = 0
          this.quantity = 0
          this.scrapQuantity = 0
          this.$emit('reset')
        })
        .catch(() => { })
    },
  },
}
</script>

<style lang="scss" scoped>
.right_container1 {
  height: inherit;
  min-width: 410px;
  display: flex;
  flex-direction: column;
  width: inherit;

  &>div {
    &:nth-child(1) {
      flex: 3;
      height: 30%;
    }

    &:nth-child(2) {
      flex: 5;
      border-bottom: 1px solid #ccc;
      height: 50%;
    }

    &:nth-child(3) {
      flex: 1;

      .el-form {
        .el-form-item {
          margin: 0;
        }
      }
    }

    /*   &:nth-child(4) {
      // flex: 1;

      .work_detail {
        align-items: center;
        justify-content: center;
        display: flex;
        height: calc(100% - 20px);

        &>div {
          width: 50%;
          display: inline-block;

          >span {
            padding-left: 20px;
          }
        }
      }
    } */
  }
}

.work_container {
  height: inherit;
  width: 100%;
  padding: 0 5px;
  box-sizing: border-box;

  .work_detail {
    align-items: center;
    justify-content: center;
    display: flex;
    // height: calc(100% - 20px);
    height: inherit;

    &>div {
      width: 50%;
      display: inline-block;

      >span {
        padding-left: 20px;
      }
    }
  }
}

h3 {
  padding: 0 10px;
  margin: 0;
  height: 20px;
  line-height: 20px;
  background-color: #cecece;
  font-weight: normal;
  font-size: 14px;
}

::v-deep {
  .black_row {
    .cell {
      color: #000 !important;
      font-weight: 800;
    }
  }
  .red_row {
    .cell {
      color: #ff0000 !important;
      font-weight: 800;
    }
  }
}

.over_station {
  .el-form-item__content {
    width: 100%;
    margin-left: 0 !important;
  }
}

/* .work_detail {
  .el-progress-bar__inner {
    text-align: center;

    .el-progress-bar__innerText {
      color: #85ce61;
    }
  }
} */

::v-deep {
  .el-progress-bar__innerText {
    color: #000;
  }
}
</style>
