<template>
  <div class="page_container">
    <div class="query_bar">
      <div class="query_box">
        <transition name="slide-fade">
          <div v-show="show">
            <query-condition ref="QueryConditionRef" v-model="query" :is-show-data-level="true"></query-condition>
          </div>
        </transition>
      </div>
      <div class="query_btn">
        <el-button v-hasPermi="['Quality/Yield/ExportData']" size="mini" @click="handleExport">
          {{ $t('export') }}
        </el-button>
        <el-button size="mini" @click="handleReset">
          {{ $t('reset') }}
        </el-button>
        <el-button type="primary" size="mini" @click="handleSearch">
          {{ $t('search') }}
        </el-button>
        <span v-if="!show" size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('unfold') }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <span v-else size="mini" class="unfold_btn" @click="show = !show">
          {{ $t('packUp') }}
          <i class="el-icon-arrow-up el-icon--right"></i>
        </span>
      </div>
    </div>
    <div style="width: 100%; height: 5px; background-color: #f6f8f9"></div>
    <div class="table_content">
      <div>
        <div class="table_title">
          Yield Summary By {{ timeType }}
          <a @click="gotoDefect">{{ $t('DefectRate') }}</a>
        </div>
        <!-- :span-method="objectSpanMethod" -->
        <el-table :data="tDatas" style="width: 100%" height="inherit" border stripe size="mini"
          :highlight-current-row="true">
          <el-table-column type="index" width="50" label="Item"></el-table-column>
          <el-table-column prop="Project" label="Project" width="70"></el-table-column>
          <el-table-column prop="PartNumber" label="PartNumber" min-width="120"></el-table-column>
          <el-table-column prop="Color" label="Color" width="80">
            <template slot-scope="scope">
              <div>
                {{ scope.row.Color }}
                <span v-if="scope.row.ColorValue" :style="{ background: `rgb(${scope.row.ColorValue})` }" style="
                    display: inline-block;
                    height: 15px;
                    width: 30px;
                    position: relative;
                    top: 3px;
                  "></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="Line" label="Line"></el-table-column>
          <el-table-column prop="StationType" label="StationType" min-width="90"></el-table-column>
          <el-table-column prop="CDate" label="Date" min-width="100"></el-table-column>
          <el-table-column prop="Input" label="Input">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, 'Input')">
                {{ scope.row.Input | FormatNumber }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Output" label="Output">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, 'Output')">
                {{ scope.row.Output | FormatNumber }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="NG" label="NG">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, 'NG')">
                {{ scope.row.NG | FormatNumber }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="SCRAP" label="SCRAP">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, 'SCRAP')">
                {{ scope.row.SCRAP | FormatNumber }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="Yield" label="Yield">
            <template slot-scope="scope">
              {{ scope.row.Yield | AddPerCent }}
            </template>
          </el-table-column>
        </el-table>
        <div class="target_input">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="display: inline-block; margin: 0 5px">target:</div>
              <el-input v-model="target" type="number" style="width: 80px" @input="handleTargetInput"></el-input>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>

      <div>
        <YieldChartLine ref="OverallYield" style="height: 100%" cid="OverallYield" />
      </div>
      <div>
        <YieldChartLine ref="DetailYield" style="height: 100%" cid="DetailYield" />
      </div>
    </div>
  </div>
</template>

<script>
import QueryCondition from '@/components/QueryCondition'
import { mapGetters } from 'vuex'
import { GetUPHYield } from '@/api/report.js'
import YieldChartLine from '@/components/chart/YieldChartLine'
import { downloadFile, getTimeChangeTimeRangeNew } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

//yield 良率
export default {
  name: 'YieldPage',
  components: {
    QueryCondition,
    YieldChartLine,
  },
  data() {
    let date = new Date()
    let sDate = new Date(date.setDate(date.getDate() - 6)).format(
      'yyyy-MM-dd 00:00:00'
    )
    return {
      show: true,
      query: {
        S_StartDateTime: sDate, //new Date('2021/07/01').format('yyyy-MM-dd 00:00:00'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:00:00'),
        S_DataType: '1',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //[2, 8], //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: null, //班次
        S_DataLevel: 2, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      yieldLineChart: null,
      SummaryYieldLineChart: null,
      tDatas: [],
      timeType: '',
      columnObj: {},
      isActivePage: false,
      target: localStorage.getItem('YieldTarget')
        ? localStorage.getItem('YieldTarget')
        : 95,
      timer: null,
      OverallYield: [],
      DetailYield: [],
      AxisData: null,
    }
  },
  computed: {
    ...mapGetters({
      timeOptions: 'common/timeOptions',
      collapse: 'settings/collapse',
    }),
  },
  watch: {
    collapse: function (val, oval) {
      if (this.isActivePage) {
        this.$refs.OverallYield.handleWindowResize()
        this.$refs.DetailYield.handleWindowResize()
      }
    }
  },
  activated() {
    this.isActivePage = true
    this.$refs.OverallYield.handleWindowResize()
    this.$refs.DetailYield.handleWindowResize()
    window.removeEventListener(
      'resize',
      this.$refs.OverallYield.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs.DetailYield.handleWindowResize
    )
    let data = this.$route.params
    if (JSON.stringify(data) != '{}') {
      for (let key in data) {
        this.$set(this.query, key, data[key])
        if (key === 'S_DataLevel') {
          this.$set(this.query, key, parseInt(data[key]))
        }
      }

      this.$refs.QueryConditionRef.setData(this.query)
      this.handleSearch()
    }
  },
  deactivated() {
    this.isActivePage = false
    window.removeEventListener(
      'resize',
      this.$refs.OverallYield.handleWindowResize
    )
    window.removeEventListener(
      'resize',
      this.$refs.DetailYield.handleWindowResize
    )
  },
  mounted() {
    // this.handleSearch()
  },
  methods: {
    handleGoToRawData(item, type) {
      let params = JSON.parse(JSON.stringify(this.query))
      delete params.S_Shift
      switch (type) {
        case 'Output':
          this.$set(params, 'S_UnitStatusID', [1])
          break;
        case 'NG':
          this.$set(params, 'S_UnitStatusID', [2])
          break;
        case 'SCRAP':
          this.$set(params, 'S_UnitStatusID', [3])
          break;
        default:
          this.$set(params, 'S_UnitStatusID', [])
      }
      this.$set(params, 'S_PartFamilyTypeID', item.PartFamilyTypeID ? [item.PartFamilyTypeID] : '')
      this.$set(params, 'S_StationTypeID', item.StationTypeID ? [item.StationTypeID] : '')
      this.$set(params, 'S_PartID', item.PartID ? [item.PartID] : '')
      this.$set(params, 'S_LineID', item.LineID ? [item.LineID] : '')
      this.$set(params, 'S_Type', 'RawData')
      this.$set(params, 'Shift', this.query.S_Shift)
      this.$set(params, 'S_PageIndex', 1)
      this.$set(params, 'S_PageQTY', 100)

      // let res = getTimeChangeTimeRange(item.CDate, [this.query.S_StartDateTime, this.query.S_EndDateTime], this.query.S_DataType)
      let res = getTimeChangeTimeRangeNew(item.CDate, this.query, this.$store.getters['user/shiftTable'])
      this.$set(params, 'S_StartDateTime', res[0])
      this.$set(params, 'S_EndDateTime', res[1])

      this.$router.push({
        path: '/report/quality/rawData',
        name: 'RawData',
        params: params,
      })
    },
    handleTargetInput(val) {
      this.target = val > 100 ? 100 : val <= 0 ? 0 : val
      localStorage.setItem('YieldTarget', this.target)
      this.timer && clearTimeout(this.timer)
      let that = this
      this.timer = setTimeout(function () {
        that.$refs.OverallYield.show(
          that.OverallYield,
          ['Project', 'Overall', 'Line', 'PartNumber'],
          that.AxisData,
          `Overall Yield Trend Chart By ${that.timeType}`,
          that.target
        )

        that.$refs.DetailYield.show(
          that.DetailYield,
          ['Project', 'PartNumber', 'Line', 'StationType'],
          that.AxisData,
          `Details Yield Trend Chart By ${that.timeType}`,
          that.target
        )
      }, 1000)
    },
    gotoDefect() {
      this.$router.push({
        // path: '/report/quality/defectRate',
        name: 'DefectRate',
        params: this.query,
      })
    },
    handleExport() {

      let Overall = JSON.parse(JSON.stringify(this.OverallYield))
      Overall.forEach(res => {
        res.Yield = res.Yield + "%"
      })
      let Details = JSON.parse(JSON.stringify(this.DetailYield))
      Details.forEach(res => {
        res.Yield = res.Yield + '%'
      })
      let data = {
        "YieldSummaryByDay": this.tDatas,
        "OverallYieldTrendChartByDay": Overall,
        "DetailsYieldTrendChartByDay": Details
      }
      let headers = {
        "YieldSummaryByDay": [
          'PartNumber',
          'Project',
          'Color',
          'Line',
          'StationType',
          'CDate',
          'Input',
          'Output',
          'NG',
          'Yield',
        ],
        "OverallYieldTrendChartByDay": [],
        "DetailsYieldTrendChartByDay": []
      }
      downloadFile(
        getDownLoadData(data, 'xlsx', headers),
        `${this.$t('Yield')}_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )
    },
    handleReset() {
      let date = new Date()
      let sDate = new Date(date.setDate(date.getDate() - 6)).format(
        'yyyy-MM-dd 00:00:00'
      )
      this.$set(this.query, 'S_StartDateTime', sDate)
      this.$set(
        this.query,
        'S_EndDateTime',
        new Date().format('yyyy-MM-dd hh:mm:ss')
      )
      this.$set(this.query, 'S_DataType', '1')
      this.$set(this.query, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.query, 'S_PartFamilyID', null) //料号组
      this.$set(this.query, 'S_PartID', null) //料号
      this.$set(this.query, 'S_ProductionOrderID', null) //工单
      this.$set(this.query, 'S_StationTypeID', null) //工站类型
      this.$set(this.query, 'S_StationID', null) //工站
      this.$set(this.query, 'S_LineID', null) //产线
      this.$set(this.query, 'S_Shift', null) //班次
      this.$set(this.query, 'S_DataLevel', 2) //数据层级
    },
    handleSearch() {
      this.show = false
      let params = JSON.parse(JSON.stringify(this.query))
      for (let key in params) {
        if (Array.isArray(params[key])) {
          params[key] = params[key].join(',')
        }
      }
      //清空数据
      this.tDatas = []
      this.$refs.OverallYield.show(
        [],
        ['Project', 'Overall', 'Line', 'PartNumber'],
        [],
        `Overall Yield Trend Chart By `,
        this.target
      )
      this.$refs.DetailYield.show(
        [],
        ['Project', 'PartNumber', 'Line', 'StationType'],
        [],
        `Details Yield Trend Chart By `,
        this.target
      )
      GetUPHYield(params).then((res) => {
        if (res.Success) {
          this.tDatas = [...res.ResData[0]]
          this.columnObj = this.computedRow(this.tDatas)

          let timeOptions = this.timeOptions.find(
            (res) => res.value == this.query.S_DataType
          )
          this.timeType = timeOptions ? timeOptions.label : ''
          this.AxisData = res.ResData[2]
          this.OverallYield = res.ResData[1]
          this.DetailYield = res.ResData[0]
          //第一个折线图
          this.$refs.OverallYield.show(
            res.ResData[1],
            ['Project', 'Overall', 'Line', 'PartNumber'],
            res.ResData[2],
            `Overall Yield Trend Chart By ${this.timeType}`,
            this.target
          )
          //第二个折线图

          this.$refs.DetailYield.show(
            res.ResData[0],
            ['Project', 'PartNumber', 'Line', 'StationType'],
            res.ResData[2],
            `Details Yield Trend Chart By ${this.timeType}`,
            this.target
          )
        }
      })
    },

    /**
     * 计算表格合并行
     */
    computedRow(tDatas) {
      if (!tDatas.length) {
        return {}
      }
      let obj = {},
        columnList = [],
        columnStationType = [],
        flag = tDatas[0].Project,
        flags = flag + tDatas[0].StationType,
        num = 0,
        ns = 0
      tDatas.forEach((res, index) => {
        //Project
        if (flag === res.Project) {
          num++
        } else {
          if (flag != tDatas[0].Project) {
            columnList.push({
              index: index - num - 1,
              num: num + 1,
            })
          } else {
            columnList.push({
              index: index - num,
              num: num,
            })
          }
          num = 0
          flag = res.Project
        }

        //stationType
        if (flags == res.Project + res.StationType) {
          ns++
        } else {
          if (flags != tDatas[0].Project + tDatas[0].StationType) {
            columnStationType.push({
              index: index - ns - 1,
              num: ns + 1,
            })
          } else {
            columnStationType.push({
              index: index - ns,
              num: ns,
            })
          }
          ns = 0
          flags = res.Project + res.StationType
        }

        //处理最后一种类型时添加
        if (index === tDatas.length - 1) {
          columnList.push({
            index: index - num,
            num: num + 1,
          })
          columnStationType.push({
            index: index - ns,
            num: ns + 1,
          })
        }
      })

      obj['columnList'] = columnList
      obj['columnStationType'] = columnStationType
      return obj
    },
    //表格合并
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      //Project
      let compute = this.columnObj.columnList.filter(
        (item) => item.index == rowIndex
      )
      if (columnIndex == 0 && compute.length) {
        return {
          rowspan: compute[0].num,
          colspan: 1,
        }
      } else if (columnIndex == 0 && !compute.length) {
        return {
          rowspan: 0,
          clospan: 0,
        }
      }

      //stationType
      let arr = this.columnObj.columnStationType.filter(
        (res) => res.index == rowIndex
      )
      if (columnIndex === 1 && arr.length) {
        return {
          rowspan: arr[0].num,
          colspan: 1,
        }
      } else if (columnIndex === 1 && !arr.length) {
        return {
          rowspan: 0,
          colspan: 0,
        }
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.page_container {
  // height: inherit;
  overflow: hidden;

  .table_content {
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 15px;

    &>div {
      height: 300px;
      min-height: 300px;

      &:first-child {
        position: relative;

        .table_title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #222;
          position: relative;

          a {
            position: absolute;
            right: 10px;
            font-size: 14px;
            cursor: pointer;
            font-weight: normal;
            border-bottom: 1px solid #ccc;
          }
        }

        .target_input {
          position: absolute;
          bottom: -80px;
          right: 10px;
          z-index: 100;
        }
      }

      &:nth-child(2n) {
        margin: 50px 0;
      }
    }
  }
}
</style>
