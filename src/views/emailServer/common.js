import getDownLoadData from '@/utils/excel.js'
import { downloadFile } from '@/utils'

export function handleExport(dataList, tableHead, api) {
  if (JSON.stringify(dataList) == '{}') {
    return null
  }

  let data = {}
  let headData = {}
  Object.values(dataList).forEach((res) => {
    data[res[0].DataLevel.replaceAll(/\//g, '-')] = res
    headData[res[0].DataLevel.replaceAll(/\//g, '-')] = tableHead
  })

  let fileName = `${api}_Output_${new Date().format('yyyy_MM_dd hh_mm_ss')}.xlsx`;

  downloadFile(
    getDownLoadData(data, 'xlsx', headData),
    fileName
  )
  return fileName;
}
/* output -DG  V1*/
export function getFormatData(data, levelValue = 3) {

  // let list = FormatData(data, levelValue);
  let InputData = HandleFormatData(data, levelValue, 'Input');
  let dataList = HandleFormatDataIntegrate(InputData.classifyItem,
    HandleFormatData(data, levelValue, 'Output').classifyItem,
    HandleFormatData(data, levelValue, 'NG').classifyItem,
    // this.HandleFormatData(data, levelValue, 'Other').classifyItem,
    HandleFormatData(data, levelValue, 'SCRAP').classifyItem,
    HandleFormatData(data, levelValue, 'Yield').classifyItem,
    // this.HandleFormatData(data, levelValue, 'UPHTarget').classifyItem,
  );

  // let copyDataList = JSON.parse(JSON.stringify(dataList))

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
  // this.dataList = dataList;
  let tableHead = InputData.tableHead;

  return { dataList, tableHead }
}

export function HandleFormatData(data = [], levelValue = 3, type = 'Output') {
  if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
  let tableHead = ['StationType', 'type'];
  data[0].forEach(res => {
    tableHead.push(res.CDate/* .split(/\s/)[1] */)
  })
  tableHead.push('total');
  /* 按时间段+ 层级分类*/
  let listObj = {};
  let listKey = Object.keys(data?.[1]?.[0] ?? {});
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
      // console.log(classifyParentItem)
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
}

export function HandleFormatDataIntegrate(...argument) {
  // 融合
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
  //规类排序 并计算良率
  let sortObj = {};
  Object.keys(obj).forEach(res => {
    sortObj = {}
    obj[res].forEach(item => {
      if (item.type === 'Yield') {
        Object.keys(item).forEach(key => {
          if (key.includes('0') || key.includes('1') || key.includes('2')) {
            item[key] = parseFloat(item[key].toFixed(1)) + '%'
          }
          if (key === 'total') {
            let t = parseFloat((item.sumOutput / item.sumInput * 100).toFixed(1))
            item[key] = isNaN(t) ? '--%' : t + '%'
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
}

/* THOutput V1 */
export function getFormatDataTH(data, levelValue = 3) {

  let list = FormatDataTH(data, levelValue)

  let tableHead = list.tableHead;
  let dataList = list.classifyItem;

  return { dataList, tableHead }
}

function FormatDataTH(data = [], levelValue = 3) {
  if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
  let tableHead = ['StationType'];
  data[0].forEach(res => {
    tableHead.push(res.CDate/* .split(/\s/)[1] */)
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
    if (listObj[key]) {
      listObj[key].Input += res.Input ? res.Input : 0;
      listObj[key].Output += res.Output ? res.Output : 0;
      listObj[key].NG += res.NG ? res.NG : 0;
    } else {
      listObj[key] = {};
      listObj[key]['CDate'] = res.CDate;
      listObj[key]['StationType'] = res.StationType;
      listObj[key]['Line'] = res.Line;
      listObj[key]['Project'] = res.Project;
      listObj[key]['PartNumber'] = res.PartNumber;
      listObj[key]['Input'] = res.Input ? res.Input : 0;
      listObj[key]['Output'] = res.Output ? res.Output : 0;
      listObj[key]['NG'] = res.NG ? res.NG : 0;
      // listObj[key]['SCRAP'] = res.SCRAP ? res.SCRAP : 0;
      // listObj[key]['Other'] = res.Other ? res.Other : 0;
      // listObj[key]['Yield'] = res.Yield ? res.Yield : 0;
      // listObj[key]['UPHTarget'] = res.UPHTarget ? res.UPHTarget : 0;
      // listObj[key]['IsRPTYield'] = res.IsRPTYield;
      listObj[key]['LineID'] = res.LineID ? res.LineID : null;
      listObj[key]['PartID'] = res.PartID ? res.PartID : null;
      listObj[key]['StationTypeID'] = res.StationTypeID ? res.StationTypeID : null;
      listObj[key]['PartFamilyTypeID'] = res.PartFamilyTypeID ? res.PartFamilyTypeID : null;
      listObj[key]['ProductionOrderID'] = res.ProductionOrderID ? res.ProductionOrderID : null;
    }
  })

  let tItem = {}
  //横向转换成表格数据
  Object.values(listObj).forEach(res => {
    let key = "";
    listKey.forEach((k, i) => {
      key += (i === 0 ? '' : '/') + res[k]
    })
    if (tItem[key]) {
      tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
      tItem[key]['total'] += res.Output
    } else {
      tItem[key] = {};
      tItem[key]['StationType'] = res.StationType;
      tItem[key]['DataLevel'] = key;
      tItem[key][res.CDate/* .split(/\s/)[1] */] = res.Output
      tItem[key]['total'] = res.Output
      // tItem[key]['IsRPTYield'] = res.IsRPTYield;
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
      // console.log(classifyParentItem)
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

  }

  // console.log(classifyItem)

  return { classifyItem, tableHead }
}
