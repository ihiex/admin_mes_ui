<template>
  <el-carousel class="smart_table" :interval="interval" arrow="always" :autoplay="autoplay" indicator-position="outside"
    style="box-sizing: border-box;" @change="handleChange">
    <el-carousel-item v-for="(list, k) in listTableData" :key="k">
      <el-table :key="tableKey" :data="list" border style="width: 100%" height="100%" :size="size"
        :cell-style="handleCellStyle" :header-cell-style="handleHeaderCellStyle">
        <el-table-column prop="StationType" label="Station" min-width="60" align="center" :show-overflow-tooltip="true"
          fixed>
        </el-table-column>
        <el-table-column :label="query.S_DataType == '0' ? 'Daily' : 'Sum'" align="center">
          <el-table-column prop="DailyInput" label="Input" align="center" min-width="50" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawDataByDaily(scope.row, 'DailyInput')">
                {{ scope.row['DailyInput'] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="DailyOutput" label="Output" align="center" min-width="50"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawDataByDaily(scope.row, 'DailyOutput')">
                {{ scope.row['DailyOutput'] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="UPHTarget" label="UPH" align="center" min-width="50" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="SumFPY" label="FPY" align="center" min-width="50" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="SumFY" label="FY" align="center" min-width="50" :show-overflow-tooltip="true">
          </el-table-column>
        </el-table-column>
        <template v-if="query.S_DataType == '2'">
          <el-table-column v-for="(item, key) in header" :key="key" :label="key" align="center">
            <el-table-column v-for="res in item" :key="res" :prop="res" :label="res.split(' ').pop()" align="center"
              min-width="50" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, res)">
                  {{ scope.row[res] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
        <template v-else>
          <el-table-column v-for="(item, key) in header" :key="key" :label="key.split(' ').pop()" align="center">
            <el-table-column v-for="res in item" :key="res" :prop="res" :label="res.split(' ').pop()" align="center"
              min-width="50" :show-overflow-tooltip="true">
              <template slot-scope="scope">
                <span style="cursor: pointer;" @click="handleGoToRawData(scope.row, res)">
                  {{ scope.row[res] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
        </template>
        <el-table-column v-if="isShowCum(list)" label="Cum" align="center">
          <el-table-column prop="CumFYInput" label="Input" align="center" min-width="50" :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawDataByDaily(scope.row, 'CumFYInput')">
                {{ scope.row['CumFYInput'] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="CumFYOutput" label="Output" align="center" min-width="50"
            :show-overflow-tooltip="true">
            <template slot-scope="scope">
              <span style="cursor: pointer;" @click="handleGoToRawDataByDaily(scope.row, 'CumFYOutput')">
                {{ scope.row['CumFYOutput'] }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="CumFYWIP" label="WIP" align="center" min-width="50" :show-overflow-tooltip="true">
          </el-table-column>
          <el-table-column prop="CumFYScrap" label="Scrap" align="center" min-width="50" :show-overflow-tooltip="true">
          </el-table-column>
        </el-table-column>
      </el-table>

    </el-carousel-item>
  </el-carousel>
</template>

<script>
import { uuid, downloadFile, getTimeChangeTimeRangeNew } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

export default {
  name: 'OutputV2Common',
  props: {
    size: {
      type: String,
      default: () => {
        return 'medium'
      }
    }
  },
  data() {
    return {
      listTableData: [],
      header: {},
      query: {},
      params: {},
      autoplay: false,
      tableKey: 1,
      interval: 1000 * 20,
      srcData: []
    };
  },

  methods: {
    isShowCum(list) {
      let result = false;
      list.forEach(item => {
        if (item['CumFYInput'] || item['CumFYOutput'] || item["CumFYScrap"] || item["CumFYWIP"]) {
          result = true
        }
      })
      return result
    },
    handleHeaderCellStyle({ row, column, rowIndex, columnIndex }) {
      return { height: '50px' }
    },
    handleCellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label === 'Input') {
        return { backgroundColor: '#efefef', height: '50px' }
      } else {
        return { height: '50px' }
      }
    },
    handleExport() {
      let head = []
      Object.keys(this.header).forEach(key => {
        this.header[key].forEach(item => {
          head.push(item)
        })
      })

      let daily = [
        'StationType',
        'DailyInput',
        'DailyOutput',
        'UPHTarget',
        'SumFPY',
        'SumFY'
      ]

      let cum = [
        'CumFYInput',
        'CumFYOutput',
        'CumFYWIP',
        'CumFYScrap'
      ]

      let hItem = [...daily, ...head, ...cum]

      let exportHead = {}
      let exportData = {}
      Object.keys(this.listTableData).forEach(key => {
        let k = key.replace(/\//g, '-')
        exportHead[k] = hItem
        exportData[k] = this.listTableData[key]
      })

      if (Array.isArray(this.listTableData) && this.listTableData.length == 0) {
        this.$message({
          message: 'No Data!',
          type: 'warning'
        });
        return
      }

      downloadFile(
        getDownLoadData(exportData, 'xlsx', exportHead),
        `OutputV2_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )

    },

    handleSourceDataExport() {
      let srcData = this.srcData
      if (!srcData) {
        this.$message.warning('Data exception')
        return false
      }

      srcData.forEach(res => {
        Object.keys(res).forEach(key => {
          if (res[key] == null) {
            res[key] = res[key] + ""
          }
        })
      })

      downloadFile(
        getDownLoadData({ 'SourceData': srcData }, 'xlsx', { 'SourceData': Object.keys(srcData[0]) }),
        `OutputV2_Source_Data_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`,
      )
      return false
    },

    handleGoToRawDataByDaily(item, type) {
      if (type.includes('Output')) {
        this.$set(this.params, 'S_UnitStatusID', [1])
      } else {
        this.$set(this.params, 'S_UnitStatusID', [])
      }

      this.$set(this.params, 'S_PartFamilyTypeID', item.PartFamilyTypeID ? [item.PartFamilyTypeID] : '')
      this.$set(this.params, 'S_ProductionOrderID', item.ProductionOrderID ? [item.ProductionOrderID] : '')
      this.$set(this.params, 'S_StationTypeID', item.StationTypeID ? [item.StationTypeID] : '')
      this.$set(this.params, 'S_PartID', item.PartID ? [item.PartID] : '')
      this.$set(this.params, 'S_LineID', item.LineID ? [item.LineID] : '')
      this.$set(this.params, 'S_Type', 'RawData')
      this.$set(this.params, 'Shift', this.params.S_Shift)
      this.$set(this.params, 'S_PageIndex', 1)
      this.$set(this.params, 'S_PageQTY', 100)

      if (type.includes('Cum')) {
        this.$set(this.params, 'S_StartDateTime', '2000-01-01')
        this.$set(this.params, 'S_EndDateTime', '2000-01-01')
      } else {
        this.$set(this.params, 'S_StartDateTime', this.query.S_StartDateTime)
        this.$set(this.params, 'S_EndDateTime', this.query.S_EndDateTime)
      }

      this.$router.push({
        path: '/report/quality/rawData',
        name: 'RawData',
        params: this.params,
      })
    },

    handleGoToRawData(item, time) {
      let lio = time.lastIndexOf(' ')
      let t = time.slice(0, lio);
      let type = time.slice(lio).trim()

      switch (type) {
        case 'Output':
          this.$set(this.params, 'S_UnitStatusID', [1])
          break;
        case 'NG':
          this.$set(this.params, 'S_UnitStatusID', [2])
          break;
        case 'SCRAP':
          this.$set(this.params, 'S_UnitStatusID', [3])
          break;
        default:
          this.$set(this.params, 'S_UnitStatusID', [])
      }
      this.$set(this.params, 'S_PartFamilyTypeID', item.PartFamilyTypeID ? [item.PartFamilyTypeID] : '')
      this.$set(this.params, 'S_ProductionOrderID', item.ProductionOrderID ? [item.ProductionOrderID] : '')
      this.$set(this.params, 'S_StationTypeID', item.StationTypeID ? [item.StationTypeID] : '')
      this.$set(this.params, 'S_PartID', item.PartID ? [item.PartID] : '')
      this.$set(this.params, 'S_LineID', item.LineID ? [item.LineID] : '')
      this.$set(this.params, 'S_Type', 'RawData')
      this.$set(this.params, 'Shift', this.params.S_Shift)
      this.$set(this.params, 'S_PageIndex', 1)
      this.$set(this.params, 'S_PageQTY', 100)
      if (t != 'total') {

        // let res = getTimeChangeTimeRange(time, [this.cacheParams.S_StartDateTime, this.cacheParams.S_EndDateTime], this.cacheParams.S_DataType)
        let res = getTimeChangeTimeRangeNew(t, JSON.parse(JSON.stringify(this.query)), this.$store.getters['user/shiftTable'])
        this.$set(this.params, 'S_StartDateTime', res[0])
        this.$set(this.params, 'S_EndDateTime', res[1])
      } else {
        this.$set(this.params, 'S_StartDateTime', this.query.S_StartDateTime)
        this.$set(this.params, 'S_EndDateTime', this.query.S_EndDateTime)
      }
      this.$router.push({
        path: '/report/quality/rawData',
        name: 'RawData',
        params: this.params,
      })
    },
    handleChange(index = 0) {
      let item = Object.keys(this?.listTableData)
      this.$emit('setTitle', this.listTableData ? item?.[index] : '')
      let that = this;
      if (index >= item?.length - 1 || item?.length == 0) {
        return setTimeout(function () {
          that.$emit('LastCarousel')
        }, that.interval)
      }
    },

    setData(objData, params, isAuto, srcData) {
      this.srcData = JSON.parse(JSON.stringify(srcData))
      ++this.tableKey
      this.autoplay = isAuto
      this.header = objData?.header ?? [];
      this.params = JSON.parse(JSON.stringify(params))
      Object.keys(params)?.forEach(key => {
        this.$set(this.query, key, params?.[key])
      });

      this.listTableData = objData?.list ?? [];
      this.$emit('setTitle', this.listTableData ? Object.keys?.(this.listTableData)?.[0] : '')
      let that = this;
      if (JSON.stringify(objData?.list) == '{}') {
        return setTimeout(function () {
          that.$emit('LastCarousel')
        }, that.interval)
      } else if (Object.keys(objData?.list)?.length == 1) {
        return setTimeout(function () {
          that.handleChange(0)
        }, that.interval)
      }

    },
  },
};
</script>

<style scoped lang="scss">
::v-deep {

  .el-carousel__container {
    height: 100%;
    box-sizing: border-box;
  }

  .el-carousel__item {
    height: 100%;
    box-sizing: border-box;
  }

  .el-carousel__indicators {
    display: none;
  }

  .el-table--border th {
    border-bottom: #222 1px solid;
  }

  .el-table--border th,
  .el-table--border td {
    border-right: 1px solid #222;
  }

  .el-table th.is-leaf,
  .el-table td {
    border-bottom: 1px solid #222;
  }

  .el-table--group,
  .el-table--border {
    border: 1px solid #222;
  }

  .el-table {
    .cell {
      padding: 0;
    }
  }

  .el-table--border .el-table__cell:first-child .cell {
    padding-left: 0px;
  }

  .el-table th.el-table__cell>.cell {
    padding-left: 0px;
    padding-right: 0px;
  }
}

.smart_table {
  height: inherit;
}
</style>
