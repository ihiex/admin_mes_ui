<template>
  <div class="table_content">
    <el-table :data="tableData" border style="width: 100%;" height="calc(100% - 0px)" size="mini"
      :span-method="objectSpanMethod" :row-style="handleRowStyle" :cell-style="handleCellStyle"
      :header-cell-style="headerCellStyle">
      <el-table-column v-for="(item, key) in tableHead" :key="key" :label="key" :min-width="'200'" align='center'>
        <el-table-column v-for="res in item" :key="res" :prop="res"
          :label="res === 'StationType' ? 'Station' : res.split(/\s/g).pop()" align='center' min-width="55">
          <template slot-scope="scope">
            <span style="display: inline-block; height: 100%; width: 100%;"
              :style="{ 'background-color': handleReturnColor(scope.row, res)}">{{
                scope.row[res] }}</span>
          </template>
        </el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { downloadFile } from '@/utils'
import getDownLoadData from '@/utils/excel.js'

export default {
  name: 'OutputOverview',
  data() {
    return {
      dateTime: '',
      tableHead: {},
      shiftText: 'AllShift',
      time: null,
      dataList: {},
      tableData: [],
      targetData: [],
      isFullscreen: false
    }
  },
  methods: {
    headerCellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.label != 'StationType' && column.level === 1) {
        return { 'border-left': '1px solid #222' }
      } else if (column.level === 2 && column.label === 'total') {
        return { 'border-left': '1px solid #222' }
      }
    },
    handleReturnColor(item, key) {
      /* #f8696b , #63be7b*/
      // if (key.includes('0') || key.includes('2') || key.includes('1')) {
      //   let bColor = '#63be7b'
      //   let k = `${item.StationType}`
      //   for (let i = 0; i < this.targetData.length; i++) {
      //     let kk = `${this.targetData[i].StationType}`
      //     if (k === kk) {
      //       if (item.type === 'NG' || item.type === 'SCRAP') {
      //         bColor = ''
      //       } else if (item.type === 'Yield') {
      //         bColor = ''
      //         //查找对应的output与目标对比
      //         /*  let obj = this.tableData.find(res=> res.StationType === k && res.type === 'Output')
      //          if(obj){
      //             if(obj[key] >= this.targetData[i][key]){
      //               bColor = '#63be7b'
      //             }else{
      //               bColor = '#f8696b'
      //             }
      //           }else{
      //             bColor = ''
      //           } */
      //       } else if (item.type === 'Output' && !key.includes('total')) {
      //         if (parseFloat(item[key]) < parseFloat(this.targetData[i][key])) {
      //           bColor = '#f8696b'
      //         } else {
      //           bColor = '#63be7b'
      //         }
      //       } else {
      //         bColor = ''
      //       }
      //       break;
      //     }
      //   }
      //   return bColor
      // } else {
      //   return ''
      // }
    },
    handleCellStyle({ row, column, rowIndex, columnIndex }) {
      if(column.property.includes('total')){
        return { 'border-left': '1px solid #222' }
      }
    },
    handleRowStyle({ row, rowIndex }) {
      if (row.type === 'Yield') {
        return { 'background-color': '#e8e8e8' }
      }
    },
    /*
    IsRPTYield：
    0：只显示output
    1: 只显示input
    2: 只显示input, output
    3：input, output, ng
    4: input, output, ng, SCRAP
    5：5个都显示
    */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (row.IsRPTYield === 0 && row.type === 'Output') {
          return {
            rowspan: this.getRowspan(row.IsRPTYield), //row.IsRPTYield === 0 ? 2 : 5,
            colspan: 1
          };
        } else if (row.type === 'Input') {
            return {
              rowspan: this.getRowspan(row.IsRPTYield), //row.IsRPTYield === 0 ? 2 : 5,
              colspan: 1
            };
          }
        /* if (rowIndex % 5 === 0) {
          return {
            rowspan: 5,
            colspan: 1
          };
        }  */else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
      }
    },

    getRowspan(val) {
      switch (val) {
        case 0:
        case 1:
          return 1;
        case 2:
          return 2;
        case 3:
          return 3;
        case 4:
          return 4;
        default:
          return 5;
      }
    },
    handleExport() {
      // downloadFile()
      let data = {}
      Object.values(this.dataList).forEach((res) => {
        data[res[0].DataLevel.replaceAll(/\//g, '-')] = res
      })
      downloadFile(
        getDownLoadData(data, 'xlsx', this.tableHead),
        `Output_${new Date().format('yyyy/MM/dd hh:mm:ss')}.xlsx`
      )
      return false;
    },
    show(data, levelValue = 3, shift = [], dateTime = new Date().format('yyyy-MM-dd hh:mm:ss')) {
      // debugger
      this.dateTime = dateTime
      this.shiftText = this.getShift(shift);
      let InputData = this.HandleFormatData(data, levelValue, 'Input');
      let dataList = this.HandleFormatDataIntegrate(InputData.classifyItem,
        this.HandleFormatData(data, levelValue, 'Output').classifyItem,
        this.HandleFormatData(data, levelValue, 'NG').classifyItem,
        // this.HandleFormatData(data, levelValue, 'Other').classifyItem,
        this.HandleFormatData(data, levelValue, 'SCRAP').classifyItem,
        this.HandleFormatData(data, levelValue, 'Yield').classifyItem,
        this.HandleFormatData(data, levelValue, 'UPHTarget').classifyItem,
      );
      /*
      IsRPTYield：
      0：只显示output
      1: 只显示input
      2: 只显示input, output
      3：input, output, ng
      4: input, output, ng, SCRAP
      5：5个都显示
      */
      Object.keys(dataList).forEach(key => {
        for (let i = 0; i < dataList[key].length; i++) {
          switch (dataList[key][i].IsRPTYield) {
            case 0:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield' || dataList[key][i].type === 'Input') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 1:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield' || dataList[key][i].type === 'Output') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 2:
              if (dataList[key][i].type === 'NG' || dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 3:
              if (dataList[key][i].type === 'SCRAP' || dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            case 4:
              if (dataList[key][i].type === 'Yield') {
                dataList[key].splice(i--, 1);
              }
              break;
            default:
          }
        }
      })
      this.dataList = dataList;
      //
      this.tableHead = {
        StationType: ['StationType', 'type'],
      };
      this.tableData = [];
      this.targetData = [];
      let integrateData = [];
      let len = data[0].length - 3;
      Object.entries(dataList).forEach((item, index) => {
        let th = []
        data[0].forEach((res, i) => {
          if (i >= len) {
            th.push(`${item[0]}-${res.CDate}`)
          }
        })
        this.tableHead[item[0]] = [`${item[0]} total`, ...th]
        if (integrateData.length === 0) {
          integrateData = [...item[1]]
        } else {
          item[1].forEach(res => {
            let flag = false;
            for (let i = 0; i < integrateData.length; i++) {
              if (integrateData[i].StationType + integrateData[i].type === res.StationType + res.type) {
                flag = true;
                integrateData[i] = { ...integrateData[i], ...res }
                break;
              }
            }
            if (!flag) {
              integrateData.push(res)
            }
          })

        }
      })
      this.tableData = integrateData.filter(res => res.type !== 'UPHTarget');

      this.targetData = integrateData.filter(res => res.type === 'UPHTarget');
    },
    getShift(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },

    HandleFormatDataIntegrate(...argument) {
      // 整合
      let obj = {};
      argument.forEach(res => {
        Object.keys(res).forEach(key => {
          if (obj[key]) {
            obj[key] = [...obj[key], ...res[key]]
          } else {
            obj[key] = [...res[key]]//.sort((a, b) => a.StationType - b.StationType)
          }
        })
      })

      //排序 并计算良率
      let sortObj = {};
      Object.keys(obj).forEach(res => {
        sortObj = {}
        obj[res].forEach(item => {
          Object.keys(item).forEach(r => {
            if (r.includes('1') || r.includes('0') || r.includes('2') || r.includes('UPHTarget')) {
              item[`${res}-${r}`] = item[r];
              delete item[r];
            }
            if (r === 'total') {
              item[`${res} ${r}`] = item[r];
              delete item[r];
            }
          })
          if (item.type === 'Yield') {
            Object.keys(item).forEach(key => {
              if (key.includes('0') || key.includes('1') || key.includes('2')) {
                item[key] = parseFloat(item[key].toFixed(1)) + '%'
              }
              if (key.includes('total')) {
                item[key] = parseFloat((item.sumOutput / item.sumInput * 100).toFixed(1)) + '%'
              }
            })
          }
          if (sortObj[item.StationType]) {
            sortObj[item.StationType].push(item)
          } else {
            sortObj[item.StationType] = [item]
          }
        })
        obj[res] = JSON.parse(JSON.stringify(Object.values(sortObj).flat()))
      })
      return obj
    },
    /* 第二版 */
    HandleFormatData(data = [], levelValue = 3, type = 'Output') {
      if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
      let tableHead = ['StationType', 'type'];
      let len = data[0].length - 3; //只取最后三列
      data[0].forEach((res, index) => {
        if (index >= len) {
          tableHead.push(res.CDate/* .split(/\s/)[1] */)
        }
      })
      tableHead.push('total');
      /* 按时间段+ 层级分类*/
      let listObj = {};
      let listKey = Object.keys(data[1][0]);
      data[2].forEach(res => {
        let key = res.CDate.replaceAll(/\s/g, "");
        listKey.forEach(k => {
          key += '_' + res[k]
        })
        //处理异常返回的数据 作加减用
        listObj[key] = {};
        listObj[key]['CDate'] = res.CDate;
        listObj[key]['StationType'] = res.StationType;
        listObj[key]['Line'] = res.Line;
        listObj[key]['Project'] = res.Project;
        listObj[key]['PartNumber'] = res.PartNumber;
        listObj[key]['Input'] = res.Input ? res.Input : 0;
        listObj[key]['Output'] = res.Output ? res.Output : 0;
        listObj[key]['NG'] = res.NG ? res.NG : 0;
        listObj[key]['SCRAP'] = res.SCRAP ? res.SCRAP : 0;
        listObj[key]['Other'] = res.Other ? res.Other : 0;
        listObj[key]['Yield'] = res.Yield ? res.Yield : 0;
        listObj[key]['UPHTarget'] = res.UPHTarget ? res.UPHTarget : 0;
        listObj[key]['IsRPTYield'] = res.IsRPTYield;
        listObj[key]['LineID'] = res.LineID ? res.LineID : null;
        listObj[key]['PartID'] = res.PartID ? res.PartID : null;
        listObj[key]['StationTypeID'] = res.StationTypeID ? res.StationTypeID : null;
        listObj[key]['PartFamilyTypeID'] = res.PartFamilyTypeID ? res.PartFamilyTypeID : null;
        listObj[key]['ProductionOrderID'] = res.ProductionOrderID ? res.ProductionOrderID : null;
      })
      let tItem = {}
      //横向转换成表格数据
      Object.values(listObj).forEach(res => {
        let key = "";
        listKey.forEach((k, i) => {
          key += (i === 0 ? '' : '/') + res[k]
        })
        if (tItem[key]) {
          tItem[key][res.CDate] = res[type]
          tItem[key]['total'] += res[type]
          tItem[key]['sumOutput'] += res.Output
          tItem[key]['sumInput'] += res.Input
          tItem[key]['sumNG'] += res.NG
        } else {
          tItem[key] = {};
          tItem[key]['StationType'] = res.StationType;
          tItem[key]['DataLevel'] = key;
          tItem[key][res.CDate] = res[type]
          tItem[key]['total'] = res[type]
          tItem[key]['type'] = type
          tItem[key]['sumOutput'] = res.Output
          tItem[key]['sumInput'] = res.Input
          tItem[key]['sumNG'] = res.NG
          tItem[key]['IsRPTYield'] = res.IsRPTYield;
          tItem[key]['LineID'] = res.LineID;
          tItem[key]['PartID'] = res.PartID;
          tItem[key]['StationTypeID'] = res.StationTypeID;
          tItem[key]['PartFamilyTypeID'] = res.PartFamilyTypeID;
          tItem[key]['ProductionOrderID'] = res.ProductionOrderID;
        }
      })
      /* 数据分屏 按层级*/
      let classifyItem = {};
      switch (levelValue) {
        case 2:
          //byStationType
          Object.values(tItem).forEach(res => {
            res.DataLevel = 'byStationType'
          })
          classifyItem['byStationType'] = Object.values(tItem);
          break;
        case 3:
          //byProject/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              tItem[key].DataLevel = tItem[key].DataLevel.split('/').shift()
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 4:
          //byProject/Line/StationType
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyItem[k]) {
              classifyItem[k].push(tItem[key])
            } else {
              let a = tItem[key].DataLevel.split('/');
              a.splice(1, 1)
              tItem[key].DataLevel = a.join('/')
              classifyItem[k] = [tItem[key]]
            }
          })
          break;
        case 5:
          //byProject/PN/Line/StationType
          let classifyParentItem = {}
          Object.keys(tItem).forEach(key => {
            let k = key.split('/').shift() + '/' + key.split('/').pop()
            if (classifyParentItem[k]) {
              classifyParentItem[k].push(tItem[key])
            } else {
              classifyParentItem[k] = [tItem[key]]
            }
          })
          Object.values(classifyParentItem).forEach(res => {
            res.forEach(item => {
              let kList = item.DataLevel.split('/');
              let key = kList[0] + '/' + kList[2] + '/' + kList[3];
              if (classifyItem[key]) {
                classifyItem[key].push(item)
              } else {
                let a = item.DataLevel.split('/');
                a.splice(1, 1)
                item.DataLevel = a.join('/')
                classifyItem[key] = [item]
              }
            })
          })
          break;
        default:
          classifyItem = {};
      }
      return { classifyItem, tableHead }
    },
  },
}
</script>

<style lang="scss" scoped>
.table_content {
  height: inherit;
  min-height: 440px;


}

::v-deep {

  .el-table td .cell,
  .el-table th .cell {
    font-size: 12px;
    padding: 0;
  }

  .el-table__row.UPHTarget {
    display: none !important;
  }

  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #222;
  }

  .el-table--border .el-table__cell {
    border-right: 1px solid #222;
  }
}
</style>
