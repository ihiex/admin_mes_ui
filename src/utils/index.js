/**
 * @author Jason.zou 305043598@qq.com
 * @description 格式化时间
 * @param time
 * @param cFormat
 * @returns {string|null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  let format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  let formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  let time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 格式化时间
 * @param time
 * @param option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  let d = new Date(time)
  let now = Date.now()

  let diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 将url请求参数转为json格式
 * @param url
 * @returns {{}|any}
 */
export function paramObj(url) {
  let search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
    decodeURIComponent(search)
      .replace(/"/g, '\\"')
      .replace(/&/g, '","')
      .replace(/=/g, '":"')
      .replace(/\+/g, ' ') +
    '"}'
  )
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 父子关系的数组转换成树形结构数据
 * @param data
 * @returns {*}
 */
export function translateDataToTree(data) {
  let parent = data.filter(
    (value) => value.parentId === 'undefined' || value.parentId == null
  )
  let children = data.filter(
    (value) => value.parentId !== 'undefined' && value.parentId != null
  )
  let translator = (parent, children) => {
    parent.forEach((parent) => {
      children.forEach((current, index) => {
        if (current.parentId === parent.id) {
          let temp = JSON.parse(JSON.stringify(children))
          temp.splice(index, 1)
          translator([current], temp)
          typeof parent.children !== 'undefined'
            ? parent.children.push(current)
            : (parent.children = [current])
        }
      })
    })
  }
  translator(parent, children)
  return parent
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 树形结构数据转换成父子关系的数组
 * @param data
 * @returns {[]}
 */
export function translateTreeToData(data) {
  let result = []
  data.forEach((item) => {
    let loop = (data) => {
      result.push({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
      })
      let child = data.children
      if (child) {
        for (let i = 0; i < child.length; i++) {
          loop(child[i])
        }
      }
    }
    loop(item)
  })
  return result
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 10位时间戳转换
 * @param time
 * @returns {string}
 */
export function tenBitTimestamp(time) {
  let date = new Date(time * 1000)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d = date.getDate()
  d = d < 10 ? '' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 13位时间戳转换
 * @param time
 * @returns {string}
 */
export function thirteenBitTimestamp(time) {
  let date = new Date(time / 1)
  let y = date.getFullYear()
  let m = date.getMonth() + 1
  m = m < 10 ? '' + m : m
  let d = date.getDate()
  d = d < 10 ? '' + d : d
  let h = date.getHours()
  h = h < 10 ? '0' + h : h
  let minute = date.getMinutes()
  let second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '年' + m + '月' + d + '日 ' + h + ':' + minute + ':' + second //组合
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 获取随机id
 * @param length
 * @returns {string}
 */
export function uuid(length = 32) {
  let num = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890'
  let base = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let str = base.charAt(Math.floor(Math.random() * base.length))

  for (let i = 0; i < length - 1; i++) {
    str += num.charAt(Math.floor(Math.random() * num.length))
  }
  return str
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description m到n的随机数
 * @param m
 * @param n
 * @returns {number}
 */
export function random(m, n) {
  return Math.floor(Math.random() * (m - n) + n)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export let on = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture)
    }
  }
})()

/**
 * @author Jason.zou 305043598@qq.com
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export let off = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture)
    }
  }
})()
// 指定长度和基数
/**
 * @author Jason.zou 305043598@qq.com
 * @param {*} len 长度
 * @param {*} radix 基数
 * @returns 指定长度的uuid
 */
export function getUuid2(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}
// getUuid2(16, 16) // "277571702EE33E11"
/**
 * @author Jason.zou 305043598@qq.com
 * @returns uuid
 */
export function getUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
// getUuid() // "a1ca0f7b-51bd-4bf3-a5d5-6a74f6adc1c7"
/**
 * @author Jason.zou 305043598@qq.com
 * @description 获取LocalStorage 数据
 * @returns
 */
export function getLocalStorageData(key) {
  return localStorage.getItem(key)
}
/**
 * @author Jason.zou 305043598@qq.com
 * @description 存储
 * @param 添加LocalStorage 数据
 * @returns
 */
export function setLocalStorage(key, value) {
  return localStorage.setItem(key, value)
}
/**
 * @author Jason.zou 305043598@qq.com
 * @description 移除LocalStorage数据
 * @returns
 */
export function removeLocalStorage(key) {
  return localStorage.removeItem(key)
}
/**
 * @author Jason.zou 305043598@qq.com
 * @description 获取当年的第几周
 * @param {日期或时间戳} val
 * @returns 返回当年的第几周
 */
export function getWeekOnYears(val) {
  if (!val) return val;
  let date = new Date(val);
  let year = date.getFullYear() //获取年
  let month = date.getMonth() + 1 //获取月
  let day = date.getDate() //获取天
  let isLeapYear = (year % 400 === 0) || (year % 4 === 0 && year % 100 !== 0) //判断是否为闰年
  let second = isLeapYear ? 29 : 28
  let monthList = [31, second, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31].splice(0, month - 1) //获取月份数组
  let currentDays; //当前日期天数
  let currentWeek; //当前周数
  //计算天数
  currentDays = month === 1 ? day : (monthList.reduce((t, v) => {
    return t + v
  }, 0)) + day
  //计算是第几周
  currentWeek = currentDays % 7 === 0 ? currentDays / 7 : Math.ceil(currentDays / 7)
  return currentWeek
}
/**
 * @author Jason.zou 305043598@qq.com
 * @description 金钱格式化 9,123,456
 * @param {*} str
 */
export function getMoneyFormat(str) {
  if (!str) return str;
  return str.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1,')
}

/**

   *根据年月返回该月的最后一天

   *参数说明

   * @param {string} yearAndMonth 年月

   * @returns 返回该月的最后一天

   * @memberof ExhibitionHallComponent

   */

export function lastDate(yearAndMonth) {
  let lastDate = null;
  let newDate;
  let ymStr = new String(yearAndMonth)
  let ym = ymStr.replace(/\-/g, '/');
  let month = new Date(ym + '/01').getMonth() + 1
  let separator = ym.slice(ym.search(/[^\d]/g), ym.search(/[^\d]/g) + 1)
  for (let i = 1; i <= 31; i++) {
    newDate = new Date(ym + separator + i);
    if ((newDate.getMonth() + 1) > parseInt(month)) {
      break;
    }
    lastDate = newDate.getDate();
  }
  return lastDate;
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 根据路径查找对应的router对象
 */
export function findPathObj(path, Routers) {
  let obj = null;
  (function fPath(menus) {
    for (let i = 0; i < menus.length; i++) {
      if (path === menus[i].path) {
        obj = menus[i]
        return menus[i]
      }
      if (menus[i].children && menus[i].children.length > 0) {
        fPath(menus[i].children)
      }
    }
  })(Routers)
  return obj
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description下载文件调用
 * @param 接口返回数据 文件名
 */
export function downloadFile(resUrl, fileName) {
  if (!resUrl) {
    return
  }
  // 创建下载链接
  const url = resUrl
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', fileName)// 文件名
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link) // 下载完成移除元素
  window.URL.revokeObjectURL(url) // 释放掉blob对象
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断数组1中是否包含数组2的所有元数
 * */
export function Array1IncludesArray2(arr1, arr2) {
  if (!(Array.isArray(arr1) && arr1.length > 0 && Array.isArray(arr2) && arr2.length > 0)) return false;
  let arr = []
  for (let i = 0; i < arr2.length; i++) {
    let r = arr1.find(res => res === arr2[i])
    if (r) {
      arr.push(r)
    } else {
      return false
    }
  }
  return arr
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 查找数组中最大值的下标
 */
export function maxIndex(list) {
  if (!Array.isArray(list)) return -1;
  let index = 0;
  let flag = true;
  list.forEach((element, i) => {
    //处理首个没数据的bug
    if (element && flag) {
      index = i;
      flag = false
    }
    if (parseInt(element) > parseInt(list[index])) {
      index = i
    }
  });
  return index
}

/**
 * @author Jason.zou 305043598@qq.com
 * @param {*} paths
 * @returns
 */
export function getFirstFullPath(paths) {
  let path = ""
    ; (function getPath(list) {
      if (!list) return

      for (let i = 0; i < list.length; i++) {
        if (list[i].meta.permissions && list[i].meta.permissions.length > 0) {
          let p = list[i].path
          if (p.indexOf('/') != -1) {
            path += list[i].path
          } else {
            if (path.substring(path.length - 1) == '/') {
              path += list[i].path
            } else {
              path += '/' + list[i].path
            }
          }
          getPath(list[i].children)
          break;
        }
      }
    })(paths)

  return path
}

//转换
export function Encode(strEncode) {
  var strReturn = "";//  存储转换后的编码
  for (var i = 0; i < strEncode.length; i++) {
    if (strReturn == "")
      strReturn = strEncode.charCodeAt(i).toString(16).slice(-4);
    else
      strReturn += "00" + strEncode.charCodeAt(i).toString(16).slice(-4);
  }
  return strReturn;
}

//反转换
export function Decode(strDecode) {
  var sResult = "";
  var arr = strDecode.split(",");
  for (var i = 0; i < arr.length; i++) {
    sResult += String.fromCharCode(parseInt(arr[i], 16));
  }
  return sResult;
}

//tony 加解密
//注意：key的长度，建议1-2位数字符，超过4位必死
export function EncryptPassword(v_Password, v_key) {
  var i, j;
  var a = 0, b = 0, c = 0;
  var hexS = "", hexskey = "", midS = "", tmpstr = "";

  hexS = Encode(v_Password);
  hexskey = Encode(v_key);
  midS = hexS;

  for (i = 1; i <= hexskey.length / 2; i++) {
    if (i != 1) {
      midS = tmpstr;
    }
    tmpstr = "";
    for (j = 1; j <= midS.length / 2; j++) {
      var AA = midS.substring((j - 1) * 2, 2);
      var BB = hexskey.substring((i - 1) * 2, 2);

      a = Encode(AA);  //(midS.Substring((j - 1) * 2, 2).charCodeAt());
      b = Encode(BB);   //(hexskey.Substring((i - 1) * 2, 2).charCodeAt());

      c = a ^ b;
      //tmpstr += Encode(Convert.ToString((Convert.ToChar(c))));
      tmpstr += Encode(c.toString());
    }
  }
  return tmpstr;
}

/**
 * @author Jason.Zou
 * @description 判断班次
 * @time 2023-08-22
 * @param {*} shiftInfo --> D: {
          end: 20,
          start: 8,
          isSpan: false,
          s_end: '20:00:00',
          s_start: '08:00:00'
        }
 * @returns 班次 ['D']
 */
export function getUserShift(shiftInfo) {
  let shift = [];
  let d = new Date()
  let currentHours = d.getHours() + d.getMinutes() / 60 + d.getSeconds() / 3600

  Object.keys(shiftInfo).forEach(key => {
    if (shiftInfo[key].isSpan && (shiftInfo[key].start <= currentHours && currentHours <= 24 || currentHours >= 0 && currentHours < shiftInfo[key].end)) {
      shift = [key]
    } else if (currentHours >= shiftInfo[key].start && currentHours < shiftInfo[key].end) {
      shift = [key]
    }
  })

  return shift
}

/**
 * @author Jason.Zou
 * @description 根据班次获取对应的班次时间
 * @time 2023-08-22
 * @param {*} shiftInfo --> D: {
          end: 20,
          start: 8,
          isSpan: false,
          s_end: '20:00:00',
          s_start: '08:00:00'
        }
 * @returns {sTime: 'yyyy-MM-dd hh:mm:ss', eTime: 'yyyy-MM-dd hh:mm:ss'}
 */
export function getShift(shiftInfo) {
  let currentShift = getUserShift(shiftInfo)
  let shift = { sTime: '', eTime: '' };
  let d = new Date()

  let item = shiftInfo[currentShift[0]]

  if (item.isSpan) {
    let oDate = new Date();
    let hour = oDate.getHours() + oDate.getMinutes() / 60 + oDate.getSeconds() / 3600
    if (hour >= 0 && hour < item.end) {
      let od = new Date()
      od.setDate(od.getDate() - 1)
      shift.sTime = `${od.format('yyyy-MM-dd')} ${item.s_start}`
      shift.eTime = `${d.format('yyyy-MM-dd')} ${item.s_end}`
    } else if (hour >= item.start && hour <= 24) {
      let od = new Date()
      od.setDate(od.getDate() + 1)
      shift.sTime = `${d.format('yyyy-MM-dd')} ${item.s_start}`
      shift.eTime = `${od.format('yyyy-MM-dd')} ${item.s_end}`
    }

  } else {
    shift.sTime = `${d.format('yyyy-MM-dd')} ${item.s_start}`
    shift.eTime = `${d.format('yyyy-MM-dd')} ${item.s_end}`
  }

  return shift
}

/**
 * @deprecated 已弃用
 * @author Jason.Zou
 * @description 根据指定时间类别获取时间范围
 * @param {*} time 时间 "2021-07-10 10:00", "2021-07-10", "2021 WK27", "2021-06","2021"
 * @param {*} ctrlTimes 限制范围 ['2021-08-02 00:00:00', '2021-08-01 16:35:30']
 * @param {*} type 时间类型 0:hour, 1:day, 2:week, 3: mouth, 4:year
 * @returns 返回时间段 ['2021-08-02 00:00:00', '2021-08-09 00:00:00']
 */
export function getTimeChangeTimeRange(time, ctrlTimes, type) {
  let datetime = []
  try {
    let cst = new Date(ctrlTimes[0])
    let cet = new Date(ctrlTimes[1])
    let te, ts = null
    switch (type) {
      case '0':
        ts = new Date(time + ':00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd hh:mm:ss');
        }

        te = new Date(time + ':00')

        te.setHours(te.getHours() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = ctrlTimes[1]
        } else {
          // if (te.getMinutes() != 0) {
          //   datetime[1] = te.format('yyyy-MM-dd hh:00:00')
          // } else {
          datetime[1] = te.format('yyyy-MM-dd hh:mm:ss')
          // }
        }
        break;
      case '1':
        ts = new Date(time + ' 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + ' 00:00:00')
        te.setDate(te.getDate() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = ctrlTimes[1]
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      case '2':
        let ws = week_date(time)
        ts = new Date(ws[0] + ' 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(ws[1] + ' 00:00:00')
        te.setDate(te.getDate() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = ctrlTimes[1]
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      case '3':
        ts = new Date(time + '-01 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + '-01 00:00:00')
        te.setMonth(te.getMonth() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = ctrlTimes[1]
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      default:
        ts = new Date(time + '-01-01 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + '-01-01 00:00:00')
        te.setFullYear(te.getFullYear() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = ctrlTimes[1]
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }

    }
  } catch (error) {
    console.log(error)
  }
  return datetime
}

/**
 * @author Jason.Zou
 * @description 根据指定时间类别获取时间范围
 * @param {*} time  时间 "2021-07-10 10:00", "2021-07-10", "2021 WK27", "2021-06","2021"
 * @param {*} params 查询参数
 * @param {*} shiftTable {D: {
          end: 20,
          start: 8,
          isSpan: false,
          s_end: '20:00:00',
          s_start: '08:00:00'
        }}
 * @returns 返回时间段 ['2021-08-02 00:00:00', '2021-08-09 00:00:00']
 */
export function getTimeChangeTimeRangeNew(time, params, shiftTable) {
  let datetime = []
  try {
    let cst = new Date(params.S_StartDateTime)
    let cet = new Date(params.S_EndDateTime)
    let te, ts = null
    switch (params.S_DataType) {
      case '0':
        ts = new Date(time + ':00')
        te = new Date(time + ':00')
        let m = ts.getMinutes()
        //班次控制
        if (Array.isArray(params.S_Shift) && params.S_Shift.length === 1 && m !== 0) {
          //判断班别的开始时间还是结束时间
          if (shiftTable[params.S_Shift[0]].s_start === time.split(' ')[1] + ':00') {
            if (ts.getTime() <= cst.getTime()) {
              datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
            } else {
              datetime[0] = ts.format('yyyy-MM-dd hh:mm:ss');
            }
            if (te.getTime() > cet.getTime()) {
              datetime[1] = params.S_EndDateTime
            } else {
              te.setMinutes(60) //向前取
              datetime[1] = te.format('yyyy-MM-dd hh:mm:ss');
            }
          } else {//结束时间
            if (ts.getTime() <= cst.getTime()) {
              datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
            } else {
              ts.setMinutes(0)//向后取
              datetime[0] = ts.format('yyyy-MM-dd hh:mm:ss');
            }

            if (te.getTime() > cet.getTime()) {
              datetime[1] = params.S_EndDateTime
            } else {
              datetime[1] = te.format('yyyy-MM-dd hh:mm:ss')
            }
          }
        } else {
          if (ts.getTime() <= cst.getTime()) {
            datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
          } else {
            datetime[0] = ts.format('yyyy-MM-dd hh:mm:ss');
          }

          te.setHours(te.getHours() + 1);
          if (te.getTime() > cet.getTime()) {
            datetime[1] = params.S_EndDateTime
          } else {
            datetime[1] = te.format('yyyy-MM-dd hh:mm:ss')
          }
        }
        break;
      case '1':
        ts = new Date(time + ' 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + ' 00:00:00')
        te.setDate(te.getDate() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = params.S_EndDateTime
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      case '2':
        let ws = week_date(time)
        ts = new Date(ws[0] + ' 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(ws[1] + ' 00:00:00')
        te.setDate(te.getDate() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = params.S_EndDateTime
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      case '3':
        ts = new Date(time + '-01 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + '-01 00:00:00')
        te.setMonth(te.getMonth() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = params.S_EndDateTime
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
        break;
      default:
        ts = new Date(time + '-01-01 00:00:00')
        if (ts.getTime() <= cst.getTime()) {
          datetime[0] = cst.format('yyyy-MM-dd hh:mm:ss');
        } else {
          datetime[0] = ts.format('yyyy-MM-dd 00:00:00');
        }

        te = new Date(time + '-01-01 00:00:00')
        te.setFullYear(te.getFullYear() + 1);
        if (te.getTime() > cet.getTime()) {
          datetime[1] = params.S_EndDateTime
        } else {
          datetime[1] = te.format('yyyy-MM-dd 00:00:00')
        }
    }
  } catch (error) {
    console.log(error)
  }
  return datetime
}

/*
https://blog.csdn.net/weixin_43702272/article/details/131567125
来自网上的获取第几周方法 开始
*/
/* 获取一年中的第几周 */
/* 用法：
 const date = new Date("2021-07-01 08:00:00");
      let res = this.getYearWeek(
        date.getFullYear(),
        Number(date.getMonth()) + 1,
        date.getDate()
      );
      console.log(res)
*/
/**
 *
 * @param {*} a "2023" 年
 * @param {*} b "11" 月
 * @param {*} c "01" 日
 * @returns
 */
export function getYearWeek(a, b, c) {
  //a为年 b为月 c为日
  /*
      date1是当前日期
      date2是当年第一天
      d是当前日期是今年第多少天
      用d + 当前年的第一天的周差距的和在除以7就是本年第几周
  */
  var date1 = new Date(a, parseInt(b) - 1, c),
    date2 = new Date(a, 0, 1),
    d = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
  return Math.ceil((d + (date2.getDay() + 1 - 1)) / 7);
}
/**
 *
 * @param {*} weekstr "2021 WK27"
 * @returns
 */
function week_date(weekstr) {
  let year = weekstr.split(/\s/g)[0];
  let weekNo = (weekstr.split(/\s/g)[1]).replace(/[A-Za-z]/g, '');
  // 此年1号是星期几
  let oneday = new Date(year + "-01-01").getDay(); //0-6
  // 方便计算，当为星期天时为7
  if (oneday == 0) {
    oneday = 7;
  }

  let one_fistday;
  let one_lastday;
  // 如果1号刚好是星期一
  if (oneday == 1) {
    one_fistday = year + "-01-01";
    one_lastday = year + "-01-07";
  } else {
    let jj = 8 - oneday;
    one_fistday =
      year -
      1 +
      "-12-" +
      (31 - oneday + 2 > 9 ? 31 - oneday + 2 : "0" + (31 - oneday + 2));
    one_lastday = year + "-01-" + (jj > 9 ? jj : "0" + jj);
  }

  let fistday;
  let lastday;
  // 如果刚好是第一周
  if (weekNo == 1) {// 在原文档进行了修改
    fistday = addDate(one_fistday, 7);
    lastday = addDate(one_lastday, 7);
  } else {// 在原文档进行了修改
    fistday = addDate(one_lastday, (weekNo - 1) * 7 + 1);
    lastday = addDate(one_lastday, weekNo * 7);
  }
  return [fistday, lastday];
}
function addDate(date, days) {
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;

  return (
    d.getFullYear() +
    "-" +
    (m > 9 ? m : "0" + m) +
    "-" +
    (d.getDate() > 9 ? d.getDate() : "0" + d.getDate())
  );
}
/* 来自网上的获取第几周方法 结束 */

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function EnUsFormatData(val) {
  return !isNaN(val) ? val.toLocaleString('en-US', { minimumFractionDigits: 0 }) : val
}
