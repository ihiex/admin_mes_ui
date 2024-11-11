<template>
  <div v-loading="loading" class="main_content">
    <el-row :gutter="10">
      <el-col :xl="24">
        <div class="cum_qty">
          <div class="cum_total_box" :style="{ width: hiddenXsOnly ? '100%' : '' }">
            <div class="cum_total">
              <div class="date">
                <GaugeClock style="height: 100%" :pid="pid" />
              </div>
              <div class="total">
                <div class="cum_item_qty">
                  <div>
                    <!-- <img src="@/assets/svg/rise.svg" alt="" /> -->
                    <!-- {{ chartItemsKey }} -->
                    Cum
                  </div>
                  <el-statistic v-show="total[0] && total[0].Input" group-separator="," :precision="0"
                    :value="total[0] ? total[0].Input : ''">
                    <template slot="prefix">
                      <span
                        style="display: inline-block; width: 70px; height: 20px; text-overflow: ellipsis; overflow: hidden; position: relative; top: 2px;">
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
          <div v-if="!hiddenXsOnly" id="CumsItemOverView" class="cum_item_box">
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
                <el-statistic v-show="item[0] && item[0].Input" group-separator="," :precision="0"
                  :value="item[0].Input">
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
              </div>
            </div>
          </div>
          <div v-else :id="'CumsItemOverView'" class="cum_item_box"
            style="display: block; width: 100%; margin: 5px 0 0 0">
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
                <el-statistic v-show="item[0] && item[0].Input" group-separator="," :precision="0" :value="item[0].Input">
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
          <div v-if="!hiddenXsOnly" :id="'MainLineItemOverView'" class="main_line_item_box">
            <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH" >
                <span style="position: absolute; top: 12px; left: 20px; font-weight: bold;">{{ item.Yield + '%'
                  }}</span>
                <span>{{ $t('dayCapacity') }}</span>
              </div>
              <div :id="'LPOverView' + item.Line.replace(/[^\w]/g, '_')"></div>
            </div>
          </div>
          <div v-else :id="'MainLineItemOverView'" class="main_line_item_box"
            style="display: block; width: 96%; margin: 0 10px 10px 10px">
            <div v-for="item in lineProgress" :key="item.Line.replace(/[^\w]/g, '_')" class="main_line_item clear_fix">
              <div class="last_day_UPH">
                <span>{{ $t('dayCapacity') }}</span>
              </div>
              <div :id="'LPOverView' + item.Line.replace(/[^\w]/g, '_')"></div>
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
      <div id="CumItemBarOverView" class="cum_item_content"></div>
    </div>
  </div>
</template>

<script>

import { GetOutputSum } from '@/api/report.js'
import GaugeClock from '@/components/chart/GaugeClock'
import OverView from '@/components/mixin/OverViewMixin'

/* 概览 */
export default {
  name: 'OverView',
  components: {
    GaugeClock,
  },
  mixins: [OverView],
  props: {
    pid: {
      type: String,
      default: () => {
        return 'OverView'
      },
    },
  },

  methods: {
    //
    handleAddEvent(mDom, cDom) {
      this.time1 = this.handleScroll('CumsItemOverView', 'cDomFlag')
      this.time2 = this.handleScroll('MainLineItemOverView', 'mDomFlag')
      //
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
      clearInterval(this.time1)
    },
    handleClearTime2() {
      clearInterval(this.time2)
    },
    handleAddEvent1() {
      this.time1 = this.handleScroll('CumsItemOverView', 'cDomFlag')
    },
    handleAddEvent2() {
      this.time2 = this.handleScroll('MainLineItemOverView', 'mDomFlag')
    },
    //

    handleChartItems(key) {
      this.chartItemsKey = key
      let datas = (this.chartItems[key] && this.handleFormatData(this.chartItems[key])) ?? {}

      this.handleEchart(
        this.$el.querySelector('#CumItemBarOverView'),
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

          this.lineProgress = data?.[3] ?? []
          this.$nextTick(function () {
            this.lineProgress.forEach((item) => {
              this.handleLineProgressChart(
                this.$el.querySelector('#LPOverView' + item.Line.replace(/[^\w]/g, '_')),
                item,
                item.Line
              )
            })
          })

          this.total = data?.[0] ?? []

          this.chartItems = this.getChartItemData(data?.[2])
          this.chartItemsKey = Object.keys(this.chartItems)?.[0]

          let datas = this.handleFormatData(this.chartItems[this.chartItemsKey])

          this.handleEchart(
            this.$el.querySelector('#CumItemBarOverView'),
            'barAndPie',
            datas
          )

          this.AlarmType1 = data?.[4]?.[0] ?? {}
          this.AlarmType2 = data?.[4]?.[1] ?? {}

          this.$nextTick(function () {
            this.isFirstInit = false
            this.mDom = document.querySelector('#MainLineItemOverView')
            this.cDom = document.querySelector('#CumsItemOverView')

            this.handleAddEvent(this.mDom, this.cDom)
          })

          this.loading = false
        }
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

        &:hover .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area_active.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
          position: relative;
        }

        &>div {
          width: 50%;
          float: left;
          height: 100px;
        }

        .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
          display: flex;
          align-items: flex-end;
          position: relative;

          span {
            position: relative;
            left: 13px;
            bottom: 2px;
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
<!-- <style lang="scss" scoped>
::v-deep {
  .el-statistic .con {
    justify-content: space-between;
  }
}

.main_content {
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
              font-size: 1.1rem;
              font-weight: 600;

              &:first-child {
                height: 40px;
                font-size: 1.8rem;

                img {
                  height: 30px;
                  margin-right: 10px;
                }
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

        &:hover .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area_active.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
        }

        &>div {
          width: 50%;
          float: left;
          height: 100px;
        }

        .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
          display: flex;
          align-items: flex-end;
          position: relative;

          span {
            position: relative;
            left: 13px;
            bottom: 2px;
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
</style> -->

<!-- <style lang="scss" scoped>
.main_content {
  // position: relative;
  // height: calc(100vh - 170px);
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
        min-width: 290px;
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
              font-size: 1.1rem;
              font-weight: 600;

              &:first-child {
                height: 40px;
                font-size: 2rem;

                img {
                  height: 30px;
                  margin-right: 10px;
                }
              }

              &>img {
                height: 20px;
                position: relative;
                top: 6px;
              }

              &:nth-child(2) {
                position: relative;
                right: -6px;
                top: -5px;

                .input_icon {
                  position: relative;
                  right: 3px;
                  top: 8px;
                }
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
      width: calc(100% - 300px);

      .cum_item {
        height: inherit;
        width: 290px;
        min-width: 240px;
        display: inline-block;
        margin: 0 10px;
        background-color: #fff;
        border: #222 1px solid;
        box-sizing: border-box;
        border-radius: 10px;

        .cum_item_img {
          height: inherit;
          display: inline-block;
          width: 40%;

          div {
            height: inherit;
          }
        }

        .cum_item_qty {
          display: inline-block;
          height: 140px;
          min-height: 140px;
          // width: calc(100% - 60px);
          width: 60%;
          text-align: right;
          position: relative;
          top: -14px;
          user-select: none;
          color: #222;
          margin-left: -10px;
          box-sizing: border-box;

          &>div {
            margin: 0;
            padding: 0;
            height: 22px;
            font-size: 1.2rem;
            font-weight: 600;

            &:first-child {
              height: 32px;
              font-size: 1.5rem;
            }

            &>img {
              height: 20px;
              position: relative;
              top: 5px;
            }

            &:nth-child(2) {
              position: relative;
              right: -5px;

              .input_icon {
                position: relative;
                right: 3px;
                top: 5px;
              }
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

    .line_item_over_view {
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
        width: 290px;
        min-width: 260px;
        margin: 10px;
        text-align: left;
        box-shadow: #8a9ec6 1px 1px 5px 1px;

        &:hover .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area_active.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
        }

        &>div {
          width: 50%;
          float: left;
          height: 100px;
        }

        .last_day_UPH {
          background: #fff url('../../assets/svg/chart_line_area.svg') no-repeat center left;
          background-size: 60px;
          background-position: 10px 20px;
          display: flex;
          align-items: flex-end;
          position: relative;
          span {
            position: relative;
            left: 13px;
            bottom: 2px;
          }
        }
      }
    }
  }

  .cum_echart {
    height: calc(100vh - 450px);
    box-sizing: border-box;
    margin-top: 10px;
    min-height: 100px;
    background-color: #fff;
    overflow: hidden;

    &>div {
      min-height: 100px;
      // border: 1px solid red;
      height: inherit;
    }
  }
}
</style> -->
