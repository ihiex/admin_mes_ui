<template>
  <div v-loading="loading" class="main_content">
    <el-popover v-model="visible" style="position: absolute; left: 72px; top:5%; z-index: 11;" placement="bottom"
      trigger="click">
      <div>
        <el-button :type="pointInTime == 'CurrentShift' ? 'primary' : ''"
          @click="handleChangeTime('CurrentShift')">CurrentShift</el-button>
        <el-button :type="pointInTime == 'LastWeek' ? 'primary' : ''"
          @click="handleChangeTime('LastWeek')">LastWeek</el-button>
        <el-button :type="pointInTime == 'Total' ? 'primary' : ''" @click="handleChangeTime('Total')">Total</el-button>
      </div>
      <div style="margin-top: 10px;">
        <el-input v-model="yieldTarget" type="number" placeholder="Yield target" style="width: 260px;"
          @input="handleYieldTarget">
          <template slot="prepend">YieldTarget</template>
        </el-input>
      </div>
      <el-button slot="reference" type="text" icon="el-icon-setting"></el-button>
    </el-popover>
    <el-row :gutter="10">
      <el-col :xl="24">
        <div class="cum_qty">
          <div class="cum_total_box" :style="{ width: hiddenXsOnly ? '100%' : '' }">
            <div class="cum_total">
              <div class="date">
                <GaugeClock style="height: 100%" pid="Index" />
              </div>
              <div class="total">
                <div class="cum_item_qty">
                  <div>
                    <!-- <img src="@/assets/svg/rise.svg" alt="" /> -->
                    {{ pointInTime }}
                    Cum
                  </div>
                  <el-statistic v-show="total[0] && total[0].Input" group-separator="," :precision="0"
                    :value="total[0] ? total[0].Input : ''">
                    <template slot="prefix">
                      <span
                        style="display: inline-block; width: 70px; height: 20px; text-overflow: ellipsis; overflow: hidden;  position: relative; top: 2px;">
                        {{ total[0] ? total[0].StationType : '' }}
                      </span>
                    </template>
                    <template slot="suffix">
                      <img src="@/assets/svg/input.svg" alt="" style="height: 20px; position: relative; top: 1px;" />
                    </template>
                  </el-statistic>
                  <el-statistic v-for="item in total" :key="item.StationTypeID" group-separator="," :precision="0"
                    :value="item.Output">
                    <template slot="prefix">
                      <span
                        style="display: inline-block; width: 70px; height: 20px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
                        {{ item.StationType }}
                      </span>
                    </template>
                    <template slot="suffix">
                      <img src="@/assets/svg/output.svg" alt="" style="height: 20px; position: relative; top: 1px;" />
                    </template>
                  </el-statistic>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!hiddenXsOnly" id="CumsItem" class="cum_item_box">
            <div v-for="(item, key) in cums" :key="key" class="cum_item">
              <div class="cum_item_img">
                <div :style="{
                  background: `url(${item[0].ProjectIcon
                    ? item[0].ProjectIcon
                    : '/assets/images/Default.png'
                    }) no-repeat center`,
                  backgroundSize: '85px',
                }"></div>
              </div>
              <div class="cum_item_qty">
                <div>{{ key }}</div>
                <el-statistic group-separator="," :precision="0" :value="item[0].Input">
                  <template slot="prefix">
                    <span
                      style="display: inline-block; width: 70px; height: 20px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
                      {{ item[0].StationType }}
                    </span>
                  </template>
                  <template slot="suffix">
                    <img src="@/assets/svg/input.svg" alt="" style="height: 23px; position: relative; top: 1px;" />
                  </template>
                </el-statistic>
                <el-statistic v-for="res in item" :key="res.StationTypeID" group-separator="," :precision="0"
                  :value="res.Output">
                  <template slot="prefix">
                    <span
                      style="display: inline-block; width: 70px; height: 22px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
                      {{ res.StationType }}
                    </span>
                  </template>
                  <template slot="suffix">
                    <img src="@/assets/svg/output.svg" alt="" style="height: 20px; position: relative; top: 1px;" />
                  </template>
                </el-statistic>

                <!--  <div style="position: relative; top: -4px; color: #0838c9">
                  {{ getMoneyFormat(item.Input) }}

                  <img src="@/assets/svg/input.svg" alt="" style="height: 25px; position: relative; right: 3px" />
                </div>
                <div style="color: #c72513">
                  {{ getMoneyFormat(item.NG) }}

                  <img src="@/assets/svg/ng.svg" alt="" />
                </div>
                <div style="color: #178d34">
                  {{ getMoneyFormat(item.Output) }}

                  <img src="@/assets/svg/output.svg" alt="" />
                </div>
                <div style="color: #d56934">
                  {{ getMoneyFormat(item.SCRAP) }}

                  <img src="@/assets/svg/scrap.svg" alt="" style="height: 24px; position: relative; right: -1px" />
                </div> -->
              </div>
            </div>
          </div>
          <div v-else id="CumsItem" class="cum_item_box" style="display: block; width: 100%; margin: 5px 0 0 0">
            <div v-for="(item, key) in cums" :key="key" class="cum_item">
              <div class="cum_item_img">
                <div :style="{
                  background: `url(${item[0].ProjectIcon
                    ? item[0].ProjectIcon
                    : '/assets/images/Default.png'
                    }) no-repeat center`,
                  backgroundSize: '85px',
                }"></div>
              </div>
              <div class="cum_item_qty">

                <div>{{ key }}</div>
                <el-statistic group-separator="," :precision="0" :value="item[0].Input">
                  <template slot="prefix">
                    <span
                      style="display: inline-block; width: 70px; height: 20px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
                      {{ item[0].StationType }}
                    </span>
                  </template>
                  <template slot="suffix">
                    <img src="@/assets/svg/input.svg" alt="" style="height: 23px; position: relative; top: 1px;" />
                  </template>
                </el-statistic>
                <el-statistic v-for="res in item" :key="res.StationTypeID" group-separator="," :precision="0"
                  :value="res.Output">
                  <template slot="prefix">
                    <span
                      style="display: inline-block; width: 70px; height: 22px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
                      {{ res.StationType }}
                    </span>
                  </template>
                  <template slot="suffix">
                    <img src="@/assets/svg/output.svg" alt="" style="height: 20px; position: relative; top: 1px;" />
                  </template>
                </el-statistic>
                <!-- <div>{{ item.ProjectName }}</div>
                <div style="position: relative; top: -4px">
                  {{ getMoneyFormat(item.Input) }}

                  <img src="@/assets/svg/input.svg" alt="" style="height: 25px; position: relative; right: 3px" />
                </div>
                <div style="color: #c72513">
                  {{ getMoneyFormat(item.NG) }}

                  <img src="@/assets/svg/ng.svg" alt="" />
                </div>
                <div style="color: #178d34">
                  {{ getMoneyFormat(item.Output) }}

                  <img src="@/assets/svg/output.svg" alt="" />
                </div>
                <div style="color: #d56934">
                  {{ getMoneyFormat(item.SCRAP) }}

                  <img src="@/assets/svg/scrap.svg" alt="" style="height: 24px; position: relative; right: -1px" />
                </div> -->
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 预警 -->
      <el-col :xl="24">
        <div class="line_progress">
          <div class="error_main_line clear_fix" :style="{
            width: hiddenXsOnly ? '96%' : '',
            'box-sizing': 'border-box',
          }">
            <div
              :style="{ backgroundImage: AlarmType1.Numbers > 0 || AlarmType2.Numbers > 0 ? `url(${require('@/assets/svg/warning_height_active.svg')})` : `url(${require('@/assets/svg/warning_height.svg')})` }">
              <span>TT-Alarm</span>
            </div>
            <div>
              <div>
                <el-badge v-if="AlarmType1.Numbers" :value="AlarmType1.Numbers" class="item">
                  <el-button size="small" style="width: 106px">
                    {{ AlarmType1.AlarmType }}
                  </el-button>
                </el-badge>
                <el-button v-else size="small" style="width: 106px">
                  {{ AlarmType1.AlarmType }}
                </el-button>
              </div>
              <div>
                <el-badge v-if="AlarmType2.Numbers" :value="AlarmType2.Numbers" class="item">
                  <el-button size="small" style="width: 106px">
                    {{ AlarmType2.AlarmType }}
                  </el-button>
                </el-badge>
                <el-button v-else size="small" style="width: 106px">
                  {{ AlarmType2.AlarmType }}
                </el-button>
              </div>
            </div>
          </div>
          <div v-if="!hiddenXsOnly" id="MainLineItem" class="main_line_item_box">
            <!-- <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH">
                <span style="position: absolute; top: 12px; left: 20px; font-weight: bold;">{{ item.Yield + '%'
                  }}</span>
                <span>{{ $t('dayCapacity') }}</span>
              </div>
              <div :id="'LP' + item.Line.replace(/[^\w]/g, '_')"></div>
            </div> -->
            <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH">
                <div>
                  <span>Yield</span>
                  <span :style="{ color: item.Yield < yieldTarget ? '#c72513' : '' }">Actual: {{ item.Yield + '%' }}</span>
                  <span>Target: {{ yieldTarget }} %</span>
                  <span>{{ $t('dayCapacity') }}</span>
                </div>
              </div>
              <div :id="'LP' + item.Line.replace(/[^\w]/g, '_')"></div>
            </div>
          </div>
          <div v-else id="MainLineItem" class="main_line_item_box"
            style="display: block; width: 96%; margin: 0 10px 10px 10px">
            <!-- <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH">
                <span>{{ $t('dayCapacity') }}</span>
              </div>
              <div :id="'LP' + item.Line.replace(/[^\w]/g, '_')"></div>
            </div> -->
            <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH">
                <div>
                  <span>Yield</span>
                  <span :style="{ color: item.Yield < yieldTarget ? '#c72513' : '' }">Actual: {{ item.Yield + '%' }}</span>
                  <span>Target: {{ yieldTarget }} %</span>
                  <span>{{ $t('dayCapacity') }}</span>
                </div>
              </div>
              <div :id="'LP' + item.Line.replace(/[^\w]/g, '_')"></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="cum_echart">
      <div
        style="position: absolute; z-index: 101; width: 100%; height: 34px; display: flex; justify-content: center; align-items: center;">
        <el-button v-for="(item, key) in chartItems" :key="key" :type="chartItemsKey == key ? 'primary' : ''"
          size="mini" @click="handleChartItems(key)">{{ key
          }}</el-button>
      </div>
      <div id="CumItemBar" class="cum_item_content"></div>
    </div>
  </div>
</template>

<script>
import { GetOutputSum } from '@/api/report.js'
import GaugeClock from '@/components/chart/GaugeClock'
import OverViewMixin from '@/components/mixin/OverViewMixin'

/* 概览 */
export default {
  name: 'Index',
  components: {
    GaugeClock,
  },
  mixins: [OverViewMixin],
  created() {
    this.setTiming()
  },
  deactivated() {
    this.clearTiming()
  },
  activated() {
    this.setTiming()
  },

  beforeDestroy() {
    this.clearTiming()
  },
  methods: {
    //自动播放开始
    handleAddEvent(mDom, cDom) {
      let that = this
      that.time1 = that.handleScroll('CumsItem', 'cDomFlag')
      that.time2 = that.handleScroll('MainLineItem', 'mDomFlag')
      //hover控制
      mDom.addEventListener('mouseover', this.handleClearTime2, false)
      mDom.addEventListener('mouseout', this.handleAddEvent2, false)
      cDom.addEventListener('mouseover', this.handleClearTime1, false)
      cDom.addEventListener('mouseout', this.handleAddEvent1, false)
    },

    handleRemoveEvent(mDom, cDom) {
      this.handleClearTime1()
      this.handleClearTime2()
      mDom.removeEventListener('mouseover', this.handleClearTime2, false)
      mDom.removeEventListener('mouseout', this.handleAddEvent2, false)
      cDom.removeEventListener('mouseover', this.handleClearTime1, false)
      cDom.removeEventListener('mouseout', this.handleAddEvent1, false)
    },

    handleClearTime1() {
      if (this.time1) {
        clearInterval(this.time1)
        this.time1 = null;
      }
    },

    handleClearTime2() {
      if (this.time2) {
        clearInterval(this.time2)
        this.time2 = null
      }
    },

    handleAddEvent1() {
      this.time1 = this.handleScroll('CumsItem', 'cDomFlag')
    },

    handleAddEvent2() {
      this.time2 = this.handleScroll('MainLineItem', 'mDomFlag')
    },
    //自动播放结束

    handleChartItems(key) {
      if (!key) return;
      this.chartItemsKey = key
      let datas = (this.chartItems[key] && this.handleFormatData(this.chartItems[key])) ?? {}

      this.handleEchart(
        this.$el.querySelector('#CumItemBar'),
        'barAndPie',
        datas
      )
    },

    handleGetOutputSum(params, isShow) {
      isShow && (this.loading = true)
      GetOutputSum(params, false).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          this.cums = this.getCumsData(data?.[1])
          // 预警
          this.lineProgress = data?.[3] ?? []
          this.$nextTick(function () {
            this.lineProgress.forEach((item) => {
              this.handleLineProgressChart(
                this.$el.querySelector('#LP' + item?.Line?.replace(/[^\w]/g, '_')),
                item,
                item?.Line
              )
            })
          })

          this.total = data?.[0] ?? []

          this.chartItems = this.getChartItemData(data?.[2])
          this.chartItemsKey = Object.keys(this.chartItems)?.[0] ?? ''

          let datas = this.handleFormatData(this.chartItems[this.chartItemsKey])

          this.handleEchart(
            this.$el.querySelector('#CumItemBar'),
            'barAndPie',
            datas
          )

          this.AlarmType1 = data?.[4]?.[0] ?? {}
          this.AlarmType2 = data?.[4]?.[1] ?? {}

          //动态轮播
          this.$nextTick(function () {
            this.isFirstInit = false
            this.mDom = this.$el.querySelector('#MainLineItem')
            this.cDom = this.$el.querySelector('#CumsItem')
            this.handleRemoveEvent(this.mDom, this.cDom)
            this.handleAddEvent(this.mDom, this.cDom)
          })
        }
        this.loading = false

      }).catch(error => { this.loading = false })
    },

  },
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-statistic .con {
    justify-content: space-between;
  }
}

.main_content {
  // position: relative;
  // height: calc(100vh - 170px);
  // overflow: hidden;
  background-color: #fff;
  padding: 0 !important;

  .cum_qty {
    min-height: 140px;
    margin: 10px;
    white-space: nowrap;
    box-sizing: border-box;
    overflow: hidden;

    .cum_total_box {
      position: relative;
      top: -1px;
      display: inline-block;
      box-sizing: border-box;
      height: 140px;
      margin: 0 3px 0 0;

      .cum_total {
        height: inherit;
        box-sizing: border-box;
        // width: 340px;
        min-width: 340px;
        display: flex;
        flex-direction: row;
        border-radius: 10px;
        user-select: none;
        border: 1px solid #222;
        // background-color: #efefef;
        margin-top: 1px;

        .date {
          flex: 4;
          height: 100%;
          margin-left: 5px;
          background-color: transparent;
        }

        .total {
          flex: 6;
          text-align: right;
          padding: 3px 10px 0;
          box-sizing: border-box;
          color: #303133;

          .cum_item_qty {
            display: inline-block;
            text-align: right;
            user-select: none;

            &>div {
              margin: 0;
              padding: 0;
              height: 22px;
              font-size: 1.2rem;
              font-weight: 600;

              &:first-child {
                height: 32px;
                line-height: 32px;
                font-size: 1.3rem;
                position: relative;
                top: -3px;
                /*  img {
                  height: 30px;
                  margin-right: 10px;
                } */
              }
            }
          }
        }
      }
    }

    .cum_item_box {
      white-space: nowrap;
      overflow: hidden;
      height: 140px;
      display: inline-block;
      box-sizing: border-box;
      margin-left: 10px;
      padding-right: 15px;
      width: calc(100% - 350px);

      .cum_item {
        height: inherit;
        // width: 340px;
        min-width: 340px;
        padding-right: 10px;
        display: inline-block;
        margin: 0 10px;
        background-color: #fff;
        border: #222 1px solid;
        box-sizing: border-box;
        border-radius: 10px;

        .cum_item_img {
          height: inherit;
          // display: inline-block;
          width: 40%;
          float: left;

          div {
            height: inherit;
          }
        }

        .cum_item_qty {
          float: left;
          // display: inline-block;
          height: 140px;
          min-height: 140px;
          // width: calc(100% - 60px);
          width: 60%;
          text-align: right;
          /*  position: relative;
          top: -14px; */
          user-select: none;
          color: #222;
          // margin-left: -10px;
          box-sizing: border-box;

          &>div {
            margin: 0;
            padding: 0;
            height: 22px;
            font-size: 1.2rem;
            font-weight: 600;

            &:first-child {
              // border: 1px solid red;
              height: 32px;
              line-height: 32px;
              font-size: 1.3rem;
            }
          }
        }

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }

  .line_progress {
    min-height: 120px;
    // height: 120px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;

    .error_main_line {
      display: inline-block;
      height: 100px;
      width: 290px;
      min-width: 290px;
      margin: 10px;
      padding: 5px 0;
      box-sizing: border-box;
      box-shadow: #8a9ec6 1px 1px 5px 1px;
      vertical-align: bottom;

      &:hover>div:first-child {
        background: #fff url('../../assets/svg/warning_height_active.svg') no-repeat center left;
        background-size: 60px;
        background-position: 10px 10px;
      }

      &>div {
        float: left;
        height: 100%;

        &:first-child {
          background: #fff url('../../assets/svg/warning_height.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 10px;
          display: flex;
          width: 40%;
          align-items: flex-end;

          span {
            position: relative;
            left: 15px;
          }
        }

        &>div {
          height: 50%;
          padding-right: 50px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          text-align: right;
        }
      }
    }

    .main_line_item_box {
      display: inline-block;
      overflow: hidden;
      box-sizing: border-box;
      white-space: nowrap;
      height: 120px;
      width: calc(100% - 320px);
      vertical-align: bottom;

      .main_line_item {
        height: 100px;
        display: inline-block;
        width: 260px;
        min-width: 260px;
        margin: 10px;
        text-align: left;
        box-shadow: #8a9ec6 1px 1px 5px 1px;

        // &:hover .last_day_UPH {
        // background: #fff url('../../assets/svg/chart_line_area_active.svg') no-repeat center left;
        // background-size: 60px;
        // background-position: 10px 20px;
        // }

        &>div {
          width: 50%;
          float: left;
          height: 100px;
        }

        .last_day_UPH {
          // background: #fff url('../../assets/svg/chart_line_area.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
          display: flex;
          // align-items: flex-end;
          position: relative;
          justify-content: center;
          align-items: center;
          font-weight: 600;

          div {
            span {
              // position: relative;
              left: 13px;
              // bottom: 2px;
              display: block;
              padding: 3px 5px;
            }
          }
        }
      }
    }
  }

  .cum_echart {
    height: calc(100vh - 470px);
    box-sizing: border-box;
    margin-top: 10px;
    min-height: 200px;
    background-color: #fff;
    overflow: hidden;
    position: relative;

    .cum_item_content {
      min-height: 200px;
      height: inherit;
    }
  }
}
</style>
