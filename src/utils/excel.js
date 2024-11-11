import * as XLSX from 'xlsx'
import { Message } from 'element-ui';

/*
js-xlsx（xlsx.full.min.js）
转换插件
XLSX.utils.sheet_to_csv：生成CSV格式
XLSX.utils.sheet_to_txt：生成纯文本格式
XLSX.utils.sheet_to_html：生成HTML格式
XLSX.utils.sheet_to_json：输出JSON格式
*/

/**
 * @author Jason.zou 305043598@qq.com
 *
 * @param {} json key为sheet名称，value为json数组
 * @param {} type 文件后缀名
 * @param {} headers 指定表头顺序 key为sheet名称，value为表头数组
 * @returns
 */
// 单元格的合并参考 https://www.cnblogs.com/liuxianan/p/js-excel.html
export default function getDownLoadData(json, type, headers, merges, cols) {
  if (toString.call(json) !== '[object Object]') return null

  try {
    Object.keys(json).forEach(key => {
      if (key.length > 30) {
        let k = key.slice(0, 30)
        json[k] = JSON.parse(JSON.stringify(json[key]))
        delete json[key]
        if(headers){
          headers[k] = JSON.parse(JSON.stringify(headers[key]))
          delete headers[key]
        }
        if(merges){
          merges[k] = JSON.parse(JSON.stringify(merges[key]))
          delete merges[key]
        }
      }
    })

    var SheetNames = Object.keys(json)
    var excelJson = {};
    var outputPos = {};
    var tmpdata = {};//用来保存转换后excel的数据
    SheetNames.forEach(key => {
      tmpdata[key] = []
      excelJson[key] = [{}, ...json[key]]
      var keyMap = json[key][0] ? (headers && Array.isArray(headers[key]) && headers[key].length > 0) ? headers[key] : Object.keys(json[key][0]) : []
      for (var k of keyMap) {
        excelJson[key][0][k] = k;
      }

      /*
      设置单元格对象 用tmpdata存放
      说明：
      每一个单元格是一个对象（Cell Object），主要有t、v、r、h、w等字段（详见这里）：
      t：表示内容类型，s表示string类型，n表示number类型，b表示boolean类型，d表示date类型，等等
      v：表示原始值；
      f：表示公式，如B2+B3；
      h：HTML内容
      w：格式化后的内容
      r：富文本内容rich text
      s: 样式;
      如：
       var styleBase = {
          font: {
              sz: 12,
              bold: true,
              color: {
                  rgb: '00104E8B'
              }
          },
          border: {
              top: { style: 'thin' },
              bottom: { style: 'thin' },
              left: { style: 'thin' },
              right: { style: 'thin' }
          },
          alignment: {
              vertical: 'center',
              horizontal: 'center'
          }
      };
      等等
      */
      //转sheet对象
      excelJson[key].map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
      }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[key][v.position] = {
        v: v.v //单元格对象
      });

      //获取key,比如表格从A1到D10, 用于excel中的填充
      outputPos[key] = Object.keys(tmpdata[key]);
    })

    var tmpWB = {
      SheetNames: [],
      Sheets: {}
    }

    //Workbook对象字段说明
    /*
    说明：
    Custprops:,
    Deps: ,
    Directory:,
    Props:,
    SSF:,
    Strings:[],
    Styles: {Fills: [], CellXf:[]}, //样式
    themes:{}, //主题
    Workbook: {}
    sheet['!ref']：表示所有单元格的范围，例如从A1到F8则记录为A1:F8；
    sheet[!merges]：存放一些单元格合并信息，是一个数组，每个数组由包含s和e构成的对象组成，s表示开始，e表示结束，r表示行，c表示列；
    如：
    [
        {e:{c:5,r:0}, s: {c:0,r:0}}, //表示A1到F1单元格合并
        {e:{c:5, r:9}, s:{c:0, r:9}} //表示A10到F10单元格合并
    ]
     '!cols': [ //设置列宽
        { wch: 10 }, // 第一列 10 相当于默认宽度大小
        { wch: 20 }, // 第二列
        { wch: 80 }  // 第三列
    ],
    */
    /*
     '!merges': [
              {e:{c:3 表示合并四列, r:0 表示从第几行开始},s:{c:0 表示从第几列开始, r:1 表示合并两行}}, //第一个合并数据
              {e:{c:5, r:9},s:{c:0, r:9}} //第二个合并数据
            ] //单元格合并
    */
    //  调整行高 可以结合使用 SheetJS库
    SheetNames.forEach(res => {
      tmpWB.SheetNames.push(res);
      tmpWB.Sheets[res] = Object.assign({}, tmpdata[res], {
        '!ref': (outputPos[res][0] ? outputPos[res][0] : 'A1') + ':' + (outputPos[res][outputPos[res].length - 1] ? outputPos[res][outputPos[res].length - 1] : 'B1'), //设置填充区域
        '!merges': merges ? merges[res] : [], //单元格合并
        '!cols': cols ? cols[res] : []
      })
    })
    // debugger
    //     console.log(tmpWB)

    // return;

    //导出的二进制对象
    var tmpDown = new Blob([s2ab(XLSX.write(tmpWB,
      { bookType: (type == undefined ? 'xlsx' : type), bookSST: false, type: 'binary' }//这里的数据是用来定义导出的格式类型
    ))], {
      type: ""
    });

    //创建二进制对象写入转换好的字节流
    var href = URL.createObjectURL(tmpDown); //创建对象超链接
    setTimeout(function () { //延时释放
      URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
    return href
  } catch (error) {
    Message({
      message: error.toString(),
      type: 'error',
      showClose: true,
      duration: 1000 * 5
    })
    return null
  }
}

function s2ab(s) { //字符串转字符流
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

// 将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
  let s = '',
    m = 0
  while (n > 0) {
    m = n % 26 + 1
    s = String.fromCharCode(m + 64) + s
    n = (n - m) / 26
  }
  return s
}


/*
注：读文件可以用以下方式
<el-upload class="upload-demo" action="#" :multiple="false" :auto-upload="false" :on-change="handleChange"
      :show-file-list="false" accept=".xlsx,.xls">
    <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
handleChange(file, fileList) {
  readFile(file.raw, ['Ship date'], '-').then(res => {
        console.log(res)
  },error=>{
    console.log(error)
  })
}
或：
<input ref="fileTemp" type="file" accept=".xlsx,.xls" @change="getImportFile" />
getImportFile() {
  if (this.$refs.fileTemp && !this.$refs.fileTemp.files[0]) return false;
  const selectedFile = this.$refs.fileTemp.files[0];
  this.readFile(selectedFile,['Ship date'], '-' ,data => {
    console.log(data)
  });
}
*/
/**
 * 读取excel文件转成JSON数据格式
 * @param {*} file excel文件
 * @param {*} dateFields 需要格式化的excel表格日期型 数组型
 * @param {*} format 时间格式化字符
 * @param {*} cb 回调方法返回数据
 */
export function readFileToCallBack(file, dateFields, format, cb) {
  let reader = new FileReader();
  reader.onload = function (e) {
    let tableData = {}
    let wb = XLSX.read(e.target.result, { type: "binary" }); // 读取文件
    wb.SheetNames.forEach(wbSheetName => {
      const wbSheet = wb.Sheets[wbSheetName];
      // 解析文件 {defval: ''}=>防止单元格为空的时解析出来的结果缺少相应的key
      let selectFileData = XLSX.utils.sheet_to_json(wbSheet, { defval: "" });
      if (!selectFileData.length) {
        console.log(`上传的文件数据为空！`);
        return false;
      }
      //对获取到的对象数组进行操作
      for (let i = 0; i < selectFileData.length; i++) {
        // delete selectFileData[i].__EMPTY;
        //操作时间，Excel会将时间类型转换成 文本类型，需要反相转成时间
        dateFields.forEach(key => {
          if (typeof selectFileData[i][key] === 'number') {
            selectFileData[i][key] = formatDate(selectFileData[i][key], format)
          }
        })
      }
      // console.log(selectFileData);
      tableData[wbSheetName] = JSON.parse(JSON.stringify(selectFileData))
    })
    cb(tableData)
  };
  reader.readAsBinaryString(file);
}
/**
  * 读取excel文件转成JSON数据格式
 * @param {*} file excel文件
 * @returns 异步方式返回
 * @param {*} dateFields 需要格式化的excel表格 对应的（日期型）列名 --- 数组
 * @param {*} format 时间格式化字符
 * @returns
 */
export function readFile(file, dateFields, format) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    try {
      reader.onload = function (e) {
        let tableData = {}
        let wb = XLSX.read(e.target.result, { type: "binary" }); // 读取文件
        wb.SheetNames.forEach(wbSheetName => {
          const wbSheet = wb.Sheets[wbSheetName];
          // 解析文件 {defval: ''}=>防止单元格为空的时解析出来的结果缺少相应的key
          let selectFileData = XLSX.utils.sheet_to_json(wbSheet, { defval: "" });
          if (!selectFileData.length) {
            console.log(`上传的文件数据为空！`);
            return false;
          }
          //对获取到的对象数组进行操作
          if (dateFields) {
            for (let i = 0; i < selectFileData.length; i++) {
              // delete selectFileData[i].__EMPTY;
              //操作时间，Excel会将时间类型转换成 文本类型，需要反相转成时间
              dateFields.forEach(key => {
                if (typeof selectFileData[i][key] === 'number') {
                  selectFileData[i][key] = formatDate(selectFileData[i][key], format)
                }
              })
            }
          }
          tableData[wbSheetName] = JSON.parse(JSON.stringify(selectFileData))
        })
        resolve(tableData)
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      reject(error)
    }
  })
}

export function readFileToCSV(file, dateFields, format) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    try {
      reader.onload = function (e) {
        let tableData = {}
        let wb = XLSX.read(e.target.result, { type: "binary" }); // 读取文件
        wb.SheetNames.forEach(wbSheetName => {
          const wbSheet = wb.Sheets[wbSheetName];
          // 解析文件 {defval: ''}=>防止单元格为空的时解析出来的结果缺少相应的key
          let selectFileData = XLSX.utils.sheet_to_csv(wbSheet, { defval: "" });
          if (!selectFileData.length) {
            console.log(`上传的文件数据为空！`);
            return false;
          }
          //对获取到的对象数组进行操作
          if (dateFields) {
            for (let i = 0; i < selectFileData.length; i++) {
              // delete selectFileData[i].__EMPTY;
              //操作时间，Excel会将时间类型转换成 文本类型，需要反相转成时间
              dateFields.forEach(key => {
                if (typeof selectFileData[i][key] === 'number') {
                  selectFileData[i][key] = formatDate(selectFileData[i][key], format)
                }
              })
            }
          }
          tableData[wbSheetName] = selectFileData//JSON.parse(JSON.stringify(selectFileData))
        })
        resolve(tableData)
      };
      reader.readAsBinaryString(file);
    } catch (error) {
      reject(error)
    }
  })
}


//转换时间
function formatDate(numb, format) {
  //第二种写法，上一种写法会导致时间 +-1天
  let time = new Date(
    (numb - 25567) * 24 * 3600000 -
    5 * 60 * 1000 -
    43 * 1000 -
    24 * 3600000 -
    8 * 3600000
  );

  let year = time.getFullYear() + "";
  let month = time.getMonth() + 1 + "";
  let date = time.getDate() + "";
  if (format && format.length === 1) {
    return year + format + month + format + date;
  }
  return (
    year +
    (month < 10 ? "0" + month : month) +
    (date < 10 ? "0" + date : date)
  );

}


