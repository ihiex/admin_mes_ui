// 作废
export function setCircleData(data) {
  let color = '#185bff'
  let keys = Object.keys(data)
  let index = keys.length;
  let list = []
  switch (index) {
    case 1:
      list = [
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['44%', '46%'],
          data: [
            { value: 234, name: keys[0] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[0]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[0]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        },
      ]
      break;

    case 2:
      list = [
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['20%', '74%'],
          data: [
            { value: 335, name: keys[0] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[0]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[0]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        },
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['68%', '74%'],
          data: [
            { value: 135, name: keys[1] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[1]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[2]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        }
      ]
      break;

    case 3:
      list = [
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['20%', '74%'],
          data: [
            { value: 335, name: keys[0] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[0]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[0]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        },
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['44%', '46%'],
          data: [
            { value: 234, name: keys[1] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[1]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[1]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        },
        {
          type: 'pie',
          radius: ['17%', '19%'],
          center: ['68%', '74%'],
          data: [
            { value: 135, name: keys[2] },
          ],
          label: {
            formatter: [
              '{head|{b}}',
              '{value|Yield' + data[keys[2]].Yield + '%} ',
              '{hr|}',
              '{head|Output}',
              '{value|' + data[keys[2]].Output + '}'
            ].join('\n'),
            borderRadius: 4,
            position: 'center',
            overflow: 'truncate',
            ellipsis: '...',
            width: 72,
            rich: {
              head: {
                height: 14,
                align: 'center',
                fontSize: 10,
                color: color
              },
              hr: {
                borderColor: '#777',
                width: '100%',
                borderWidth: 2,
                height: 0,
                align: 'left',
              },
              value: {
                width: 20,
                padding: [0, 20, 0, 30],
                align: 'center',
                height: 14,
                fontSize: 10,
                color: color
              }
            }
          },
        }
      ]
      break;

    case 4:
      list = [{
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['20%', '74%'],
        data: [
          { value: 335, name: keys[0] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[0]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[0]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['28%', '55%'],
        data: [
          { value: 310, name: keys[1] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[1]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[1]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      /*  {
         type: 'pie',
         radius: ['17%', '19%'],
         center: ['44%', '46%'],
         data: [
           { value: 234, name: '联盟广告' },
         ],
         label: {
           formatter: [
             '{head|{b}}',
             '{value|Yield' + ' 99.9' + '%} ',
             '{hr|}',
             '{head|Output}',
             '{value|' + '55.3' + '%}'
           ].join('\n'),
           borderRadius: 4,
           position: 'center',
           rich: {
             head: {
               height: 14,
               align: 'center',
               fontSize: 10,
               color: color
             },
             hr: {
               borderColor: '#777',
               width: '100%',
               borderWidth: 2,
               height: 0,
               align: 'left',
             },
             value: {
               width: 20,
               padding: [0, 20, 0, 30],
               align: 'center',
               height: 14,
               fontSize: 10,
               color: color
             }
           }
         },
       }, */
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['60%', '55%'],
        data: [
          { value: 135, name: keys[2] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[2]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[2]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['68%', '74%'],
        data: [
          { value: 135, name: keys[3] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[3]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[3]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      }]
      break;

    case 5:
    default:
      list = [{
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['20%', '74%'],
        data: [
          { value: 335, name: keys[0] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[0]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[0]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['28%', '55%'],
        data: [
          { value: 310, name: keys[1] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[1]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[1]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['44%', '46%'],
        data: [
          { value: 234, name: keys[2] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[2]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[2]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['60%', '55%'],
        data: [
          { value: 135, name: keys[3] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[3]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[3]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      },
      {
        type: 'pie',
        radius: ['17%', '19%'],
        center: ['68%', '74%'],
        data: [
          { value: 135, name: keys[4] },
        ],
        label: {
          formatter: [
            '{head|{b}}',
            '{value|Yield' + data[keys[4]].Yield + '%} ',
            '{hr|}',
            '{head|Output}',
            '{value|' + data[keys[4]].Output + '}'
          ].join('\n'),
          borderRadius: 4,
          position: 'center',
          overflow: 'truncate',
          ellipsis: '...',
          width: 72,
          rich: {
            head: {
              height: 14,
              align: 'center',
              fontSize: 10,
              color: color
            },
            hr: {
              borderColor: '#777',
              width: '100%',
              borderWidth: 2,
              height: 0,
              align: 'left',
            },
            value: {
              width: 20,
              padding: [0, 20, 0, 30],
              align: 'center',
              height: 14,
              fontSize: 10,
              color: color
            }
          }
        },
      }]
      break;

  }
  return list;
}


export function getData(data, levelValue = 3) {
  let dataList = HandleFormatDataIntegrate(
    HandleFormatData(data, levelValue, 'Input').classifyItem,
    HandleFormatData(data, levelValue, 'Output').classifyItem,
    // HandleFormatData(data, levelValue, 'NG').classifyItem,
    // this.HandleFormatData(data, levelValue, 'Other').classifyItem,
    // HandleFormatData(data, levelValue, 'SCRAP').classifyItem,
    HandleFormatData(data, levelValue, 'Yield').classifyItem,
    HandleFormatData(data, levelValue, 'UPHTarget').classifyItem,
  );
  return dataList
}

export function HandleFormatDataIntegrate(...argument) {

  let obj = {};
  argument.forEach(res => {
    Object.keys(res).forEach(key => {
      if (obj[key]) {
        obj[key] = [...obj[key], ...res[key]]
      } else {
        obj[key] = [...res[key]]
      }
    })
  })

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
}

export function HandleFormatData(data = [], levelValue = 3, type = 'Output') {
  if (data && data?.[0]?.length === 0) { return { classifyItem: {}, tableHead: [] } }
  let tableHead = ['StationType', 'type'];
  data?.[0]?.forEach(res => {
    tableHead.push(res?.CDate/* .split(/\s/)[1] */)
  })
  tableHead.push('total');

  let listObj = {};
  let listKey = Object.keys(data?.[1]?.[0] ?? {});
  data?.[2]?.forEach(res => {
    let key = res?.CDate?.replaceAll(/\s/g, "");
    listKey?.forEach(k => {
      key += '_' + res[k]
    })

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
    // listObj[key][type] = 0;
  })

  let tItem = {}

  Object.values(listObj)?.forEach(res => {
    let key = "";
    listKey?.forEach((k, i) => {
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
    case 8:
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
