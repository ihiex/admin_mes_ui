export function getData(data, levelValue = 3) {
  let dataList = HandleFormatDataIntegrate(
    HandleFormatData(data, levelValue, 'Input')?.classifyItem,
    HandleFormatData(data, levelValue, 'Output')?.classifyItem,
    // HandleFormatData(data, levelValue, 'NG').classifyItem,
    // this.HandleFormatData(data, levelValue, 'Other').classifyItem,
    // HandleFormatData(data, levelValue, 'SCRAP').classifyItem,
    // HandleFormatData(data, levelValue, 'Yield').classifyItem,
    // HandleFormatData(data, levelValue, 'UPHTarget').classifyItem,
  );

  let header = {}
  data?.[0].forEach?.(item => {
    header[item.CDate] = [item?.CDate + ' Input', item?.CDate + ' Output']
  })
  // console.log(dataList)

  let list = getTableData(dataList)
  return { header, list } //dataList
}

function getTableData(data) {
  let obj = {}
  Object.keys(data).forEach(key => {
    data[key].forEach(item => {
      if (obj[key]) {
        if (obj[key][item.StationType]) {
          Object.keys(item).forEach(k => {
            if (new Date(k) != 'Invalid Date') {
              obj[key][item.StationType][k + ' ' + item.type] = item[k]
            } else {
              if (k == 'total') {
                obj[key][item.StationType][k + ' ' + item.type] = item[k]
              }
              obj[key][item.StationType][k] = item[k]
            }
          })
        } else {
          obj[key][item.StationType] = {}
          Object.keys(item).forEach(k => {
            if (new Date(k) != 'Invalid Date') {
              obj[key][item.StationType][k + ' ' + item.type] = item[k]
            } else {
              if (k == 'total') {
                obj[key][item.StationType][k + ' ' + item.type] = item[k]
              }
              obj[key][item.StationType][k] = item[k]
            }
          })
        }
      } else {
        obj[key] = {}
        if (obj[key][item.StationType]) {
          Object.keys(item).forEach(k => {
            if (new Date(k) != 'Invalid Date') {
              obj[key][item.StationType][k + ' ' + item.type] = item[k]
            } else {
              if (k == 'total') {
                obj[key][item.StationType][k + ' ' + item.type] = item[k]
              }
              obj[key][item.StationType][k] = item[k]
            }
          })
        } else {
          obj[key][item.StationType] = {}
          Object.keys(item).forEach(k => {
            if (new Date(k) != 'Invalid Date') {
              obj[key][item.StationType][k + ' ' + item.type] = item[k]
            } else {
              if (k == 'total') {
                obj[key][item.StationType][k + ' ' + item.type] = item[k]
              }
              obj[key][item.StationType][k] = item[k]
            }
          })
        }
      }
    })
  })

  let list = {}

  Object.keys(obj)?.forEach(key => {
    Object.keys(obj?.[key])?.forEach(k => {
      if (list?.[key]) {
        list[key].push(obj?.[key]?.[k])
      } else {
        list[key] = [obj?.[key]?.[k]]
      }
    })

  })

  return list
}

export function HandleFormatDataIntegrate(...argument) {
  let obj = {};
  argument?.forEach(res => {
    Object.keys(res)?.forEach(key => {
      if (obj[key]) {
        obj[key] = [...obj?.[key], ...res?.[key]]
      } else {
        obj[key] = [...res?.[key]]
      }
    })
  })

  let sortObj = {};
  Object.keys(obj)?.forEach(res => {
    sortObj = {}
    obj?.[res]?.forEach(item => {
      if (item?.type === 'Yield') {
        Object.keys(item)?.forEach(key => {
          if (key?.includes('0') || key?.includes('1') || key?.includes('2')) {
            item[key] = parseFloat(item?.[key]?.toFixed(1)) + '%'
          }
          if (key === 'total') {
            item[key] = parseFloat((item?.sumOutput / item?.sumInput * 100)?.toFixed(1)) + '%'
          }
        })
      }
      if (sortObj?.[item?.StationType]) {
        sortObj?.[item?.StationType]?.push(item)
      } else {
        sortObj[item?.StationType] = [item]
      }
    })
    obj[res] = JSON.parse(JSON.stringify(Object.values(sortObj)?.flat()))
  })
  return obj
}

export function HandleFormatData(data = [], levelValue = 3, type = 'Output') {
  if (data && data[0].length === 0) { return { classifyItem: {}, tableHead: [] } }
  let tableHead = ['StationType', 'type'];
  data?.[0]?.forEach(res => {
    tableHead.push(res?.CDate/* .split(/\s/)[1] */)
  })
  tableHead.push('total');

  let listObj = {};
  let listKey = Object.keys(data?.[1]?.[0]);
  data?.[2]?.forEach(res => {
    let key = res.CDate?.replaceAll?.(/\s/g, "");
    listKey.forEach(k => {
      key += '_' + res?.[k]
    })

    listObj[key] = {};
    listObj[key]['CDate'] = res?.CDate;
    listObj[key]['StationType'] = res?.StationType;
    listObj[key]['Line'] = res?.Line;
    listObj[key]['Project'] = res?.Project;
    listObj[key]['PartNumber'] = res?.PartNumber;
    listObj[key]['Input'] = res?.Input ?? 0;
    listObj[key]['Output'] = res?.Output ?? 0;
    listObj[key]['NG'] = res?.NG ?? 0;
    listObj[key]['SCRAP'] = res?.SCRAP ?? 0;
    listObj[key]['Other'] = res?.Other ?? 0;
    listObj[key]['Yield'] = res?.Yield ?? 0;
    listObj[key]['UPHTarget'] = res?.UPHTarget ?? 0;
    listObj[key]['IsRPTYield'] = res?.IsRPTYield;
    listObj[key]['LineID'] = res?.LineID;
    listObj[key]['PartID'] = res?.PartID;
    listObj[key]['StationTypeID'] = res?.StationTypeID;
    listObj[key]['PartFamilyTypeID'] = res?.PartFamilyTypeID;
    listObj[key]['ProductionOrderID'] = res?.ProductionOrderID;
    // listObj[key][type] = 0;
    /*  listObj[key]['SumFPYInput'] = res.SumFPYInput ? res.SumFPYInput : null;
     listObj[key]['SumFPYOutput'] = res.SumFPYOutput ? res.SumFPYOutput : null;
     listObj[key]['SumFYInput'] = res.SumFYInput ? res.SumFYInput : null;
     listObj[key]['SumFYOutput'] = res.SumFYOutput ? res.SumFYOutput : null; */


    listObj[key]['SumFPY'] = res?.SumFPY;
    listObj[key]['SumFY'] = res?.SumFY;
    listObj[key]['CumFYInput'] = res?.CumFYInput;
    listObj[key]['CumFYOutput'] = res?.CumFYOutput;
    listObj[key]['CumFYWIP'] = res?.CumFYWIP;
    listObj[key]['CumFYScrap'] = res?.CumFYScrap;



  })

  let tItem = {}

  Object.values(listObj).forEach(res => {
    let key = "";
    listKey.forEach((k, i) => {
      key += (i === 0 ? '' : '/') + res[k]
    })
    if (tItem[key]) {
      tItem[key][res.CDate] = res?.[type]
      tItem[key]['total'] += res?.[type]
      tItem[key]['DailyOutput'] += res?.Output
      tItem[key]['DailyInput'] += res?.Input
      tItem[key]['DailyNG'] += res?.NG
      // tItem[key]['UPHTarget'] += res.UPHTarget;
    } else {
      tItem[key] = {};
      tItem[key]['StationType'] = res?.StationType;
      tItem[key]['DataLevel'] = key;
      tItem[key][res.CDate] = res?.[type]
      tItem[key]['total'] = res?.[type]
      tItem[key]['type'] = type
      tItem[key]['DailyOutput'] = res?.Output
      tItem[key]['DailyInput'] = res?.Input
      tItem[key]['DailyNG'] = res?.NG
      tItem[key]['IsRPTYield'] = res?.IsRPTYield;
      tItem[key]['LineID'] = res?.LineID;
      tItem[key]['PartID'] = res?.PartID;
      tItem[key]['StationTypeID'] = res?.StationTypeID;
      tItem[key]['PartFamilyTypeID'] = res?.PartFamilyTypeID;
      tItem[key]['ProductionOrderID'] = res?.ProductionOrderID;

      tItem[key]['SumFPY'] = res?.SumFPY;
      tItem[key]['SumFY'] = res?.SumFY;
      tItem[key]['CumFYInput'] = res?.CumFYInput;
      tItem[key]['CumFYOutput'] = res?.CumFYOutput;
      tItem[key]['CumFYWIP'] = res?.CumFYWIP;
      tItem[key]['CumFYScrap'] = res?.CumFYScrap;
      tItem[key]['UPHTarget'] = res?.UPHTarget;
    }
  })

  let classifyItem = {};
  switch (levelValue) {
    case 2:
      //byStationType
      Object.values(tItem).forEach(res => {
        res.DataLevel = 'byStationType'
      })
      classifyItem['byStationType'] = Object.values(tItem);
      break;
    case 3: //byProject/StationType
    case 7: //byProject/LineType
      Object.keys(tItem)?.forEach(key => {
        let k = key.split('/').shift()
        if (classifyItem[k]) {
          classifyItem[k].push(tItem?.[key])
        } else {
          tItem[key].DataLevel = tItem?.[key]?.DataLevel?.split('/')?.shift()
          classifyItem[k] = [tItem?.[key]]
        }
      })
      break;
    case 4:
    case 8:
      //byProject/Line/StationType
      Object.keys(tItem)?.forEach(key => {
        let k = key?.split('/')?.shift() + '/' + key?.split('/')?.pop()
        if (classifyItem[k]) {
          classifyItem[k]?.push(tItem?.[key])
        } else {
          let a = tItem?.[key]?.DataLevel?.split('/');
          a.splice(1, 1)
          tItem[key].DataLevel = a?.join('/')
          classifyItem[k] = [tItem?.[key]]
        }
      })
      break;
    case 5:
      //byProject/PN/Line/StationType
      let classifyParentItem = {}
      Object.keys(tItem)?.forEach(key => {
        let k = key?.split('/')?.shift() + '/' + key?.split('/')?.pop()
        if (classifyParentItem?.[k]) {
          classifyParentItem?.[k].push(tItem?.[key])
        } else {
          classifyParentItem[k] = [tItem?.[key]]
        }
      })
      // console.log(classifyParentItem)
      Object.values(classifyParentItem).forEach(res => {
        res.forEach(item => {
          let kList = item?.DataLevel?.split('/');
          let key = kList?.[0] + '/' + kList?.[2] + '/' + kList?.[3];
          if (classifyItem?.[key]) {
            classifyItem?.[key]?.push(item)
          } else {
            let a = item?.DataLevel?.split('/');
            a?.splice(1, 1)
            item.DataLevel = a?.join('/')
            classifyItem[key] = [item]
          }
        })
      })
      break;
    default:
      classifyItem = {};
  }

  // 处理数据显示方式
  Object.keys(classifyItem).forEach(key => {
    classifyItem[key].forEach(item => {
      Object.keys(item).forEach(k => {
        if (!isNaN(item[k])) {
          if (k === 'SumFPY' || k === 'SumFY') {
            item[k] = item[k] ? (item[k] + '').includes('.') ? item[k].toFixed(1) + '%' : item[k] + '%' : item[k]
          } else {
            item[k] = item[k] ? item[k].toLocaleString('en-US', { minimumFractionDigits: 0 }) : item[k]
          }
        }
      })
    })
  })

  return { classifyItem, tableHead }
}

