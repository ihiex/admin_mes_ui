// import '../style/common.scss'
import '../style/common-split.scss'
import MesQuery from '@/components/Mes-Query'
import showDefectCode from '../common/showDefectCode'
import RightInfo from '../common/rightInfo'
import RightInfoSplit from '../common/rightInfoSplit'
import {
  SetConfirmPO,
  SetScanSN,
  GetDefect,
  GetPageInitialize,
} from '@/api/application.js'
import ZColumn from 'z-layouts/ZColumn.vue'
import ZRow from 'z-layouts/ZRow.vue'
import PrintButton from '@/views/application/common/printButton.vue'
import SerialButton from '@/views/application/common/serialButton.vue'
import ErrorQC from '@/views/application/common/errorQC.vue'

export default {
  components: {
    MesQuery,
    showDefectCode,
    RightInfo,
    ZRow,
    ZColumn,
    RightInfoSplit,
    PrintButton,
    SerialButton,
    ErrorQC
  },

  data() {
    return {
      query: {
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_POID: null, //工单
        S_UnitStatus: 1,
        S_SN: '',
        S_DefectID: null, //不良代码
        DefectCode: '',
        S_URL: this.$route.path
      },
      unitStatus: {},
      target: 0, //工单明细目标值
      completed: 0, //工单明细当前值
      isUnfold: true,
      hintInfos: [],
      rejectQuantity: 0, //不良数量
      quantity: 0, //过站数量
      scrapQuantity: 0, //报废数量
      BOMtableData: [],
      craftTableData: [],
      pOrderDesc: '',
      defectTable: [],
      progress: 0,
      snDisabled: false,
      disabledConfirm: false,
      isDisable: false,
      isShowInfo: false,
      IsCheckPO: false,
      IsCheckPN: true,
      IsLegalPage: false,
      ApplicationType: '',
      color: '',
      colorValue: '',
      paneLengthPercent: 64,
      paneLengthPercent1: 28,
      paneLengthPercent2: 75,
      isPrint: false,
      socketAddress: '',
      isConnectPrint: false,
      serialMsg: {},
      comItem: {
        AutoStation: '0',  //是否开始com口，1开始，0关闭
        FAIL: 'FAIL', //请求失败 发送的数据
        PASS: 'PASS', //请求成功 发送的数据
        Port: 'COM1', //端口
        COM_BaudRate: "9600", //校验位
        COM_DataBits: "8", //数据位
        COM_Parity: "None", //
        COM_StopBits: "1", //停止位
      },
      dangerWarning: 0,
      SNList: [],
      isRunning: false
    }
  },
  watch: {
    'query.S_PartFamilyTypeID': function (val, oval) {
      this.GetDefect(val)
    },
    target: function (val, oval) {
      this.progress = val ? parseFloat(((this.completed / val) * 100).toFixed(3)) : 0
    },
    completed: function (val, oval) {
      this.progress = val ? parseFloat(((val / this.target) * 100).toFixed(3)) : 0
    },
    'query.S_UnitStatus': function (val, oval) {
      this.$set(this.query, 'S_DefectID', '')
      this.$set(this.query, 'DefectCode', '')
    },
    hintInfos: function (val, oval) {
      if (val[0].result === 'error') {
        this.dangerWarning = 1;
      } else if (val[0].result === 'success') {
        this.dangerWarning = 2;
      } else {
        this.dangerWarning = 0;
      }
    }
  },
  created() {
    this.GetPageInitialize()
  },
  mounted() {

  },
  methods: {

    initSerial() {
      //init serial
      this.$refs.SerialButton.init({
        baudRate: this.comItem.COM_BaudRate,
        dataBits: this.comItem.COM_DataBits,
        stopBits: this.comItem.COM_StopBits,
        parity: this.comItem.COM_Parity,
        bufferSize: '1024',
        flowControl: 'None',
      }, this.comItem.Port, this.socketAddress)
    },
    handleSerialRead(str) {
      console.log(str)
    },
    handleSerialLog(data) {
      // console.log(data)
      this.hintInfos.unshift(data)
    },
    handleStatusMsg(data) {
      // console.log(data)
      // this.serialMsg = data
      this.hintInfos.unshift({
        msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: ${data.message}`,
        result: data.flag ? 'success' : "error",
      });
    },
    //printer about start
    handleSocketError(data) {
      // console.log(data)
      this.hintInfos.unshift(data)
    },
    handleSocketMsg(data) {
      // console.log(data)
      this.hintInfos.unshift(data)
    },
    handleConnectPrint(bool) {
      this.isConnectPrint = bool
    },
    //print about end

    handlePartItem(val) {
      this.color = val.color
      this.colorValue = val.colorValue
    },
    handleClickMsg(msg) {
      const input = document.createElement('input');
      document.body.appendChild(input);
      input.setAttribute('value', msg);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message({
          message: this.$t('CopySuccess'),
          type: 'success'
        });
      }
      document.body.removeChild(input);
    },
    GetPageInitialize() {
      GetPageInitialize({ S_URL: this.$route.path }).then((res) => {
        try {
          let data = res.ResData[0];
          if (res.Success && data) {
            this.ApplicationType = data.ApplicationType;
            let pn = data.IsCheckPN
            let po = data.IsCheckPO
            let page = data.IsLegalPage
            this.IsCheckPN = pn === '1' ? true : false
            this.IsCheckPO = po === '1' ? true : false
            this.IsLegalPage = page === '1' ? true : false
            this.isPrint = data.IsPrint === '1';

            this.$set(this.query, 'S_IsCheckCardID', data.IsCheckCardID)
            this.$set(this.query, 'S_CardIDPattern', data.CardIDPattern)


            this.socketAddress = data.PrintIPPort ? data.PrintIPPort : this.$store.getters['user/currentLoginIp'] + ':45210';
            if (!this.IsLegalPage) {
              this.$message({
                message: this.$t('TheSelectedPageDoesNotMatchTheSite'),
                type: 'warning',
                showClose: true,
              })
            }
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        } catch (error) {
          this.IsCheckPN = false
          this.IsCheckPO = false
          this.IsLegalPage = false
          this.ApplicationType = false
        }
      })
    },
    handleDefectConfirm(val) {
      this.$set(this.query, 'S_DefectID', val.ids)
      this.$set(this.query, 'DefectCode', val.labels)
    },
    GetDefect(val) {
      this.defectTable = []
      GetDefect({ S_PartFamilyTypeID: val }).then((res) => {
        if (res.Success) {
          res.ResData &&
            res.ResData.forEach((el, index) => {
              this.defectTable.push({ ...el, index })
            })
        }
      })
    },
    handleReset() {
      this.$confirm(
        this.$t('cleanTheDataDoYouWantToContinue'),
        this.$t('hint'),
        {
          confirmButtonText: this.$t('confirm'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning',
        }
      )
        .then(() => {
          this.rejectQuantity = 0
          this.quantity = 0
          this.scrapQuantity = 0
        })
        .catch(() => { })
    },
    UnitStateClickItem(val) {
      this.unitStatus = val
      if (val.ID == 2 || val.ID == 3) {
        this.$refs.showDefectCode.show(this.defectTable)
      }
    },
    handleClearShowHint(e) {
      e = e || window.Event
      this.hintInfos = []
      e.target.style.display = 'none'
    },
    handleContextMenu(event) {
      event = event || window.Event
      event.preventDefault()
      let rightMenu = document.querySelector('#HintMenu')
      //2.设置右键行为
      rightMenu.style.display = 'none' //重置已经block的菜单
      rightMenu.style.display = 'block'
      rightMenu.style.left = event.clientX + 'px'
      rightMenu.style.top = event.clientY + 'px'
    },
    handleShowHintMouse(e) {
      e = e || window.Event
      if (e.button == 2) {
        e.target.addEventListener('contextmenu', this.handleContextMenu)
      }
    },
    /* 扫描 */
    /*  handleSNEnter(val) {
       if (!val) return
       this.snDisabled = true
       SetScanSN(this.query, false, true).then(
         (res) => {
           try {
             if (res.Success) {
               this.hintInfos.unshift({
                 msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg}`,
                 result: 'success',
               })
               if (this.query.S_UnitStatus == 1) {
                 this.quantity++
               } else if (this.query.S_UnitStatus == 2) {
                 this.rejectQuantity++
               } else if (this.query.S_UnitStatus == 3) {
                 this.scrapQuantity++
               }
               let data = res.ResData
               this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
               this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
             } else {
               this.hintInfos.unshift({
                 msg: res.ResultMsg,
                 result: 'error',
               })
             }
           } catch (err) {
             this.hintInfos.unshift({
               msg: err,
               result: 'error',
             })
           } finally {
             this.handleFinally(res.Sounds)
             this.snDisabled = false
             this.$set(this.query, 'S_SN', '')
             this.$nextTick(function () {
               this.$refs.snInput.focus()
             })
           }
         },
         (error) => {
           document.querySelector('#NGPlay').play()
           this.snDisabled = false
           this.$nextTick(function () {
             this.$refs.snInput.focus()
           })
           this.$set(this.query, 'S_SN', '')
           this.hintInfos.unshift({
             msg: res.ResultMsg,
             result: 'error',
           })
           this.handleShowQCError()
         }
       )
     }, */

    /* 队列模式 */
    handleSNEnterQueue(val) {
      // debugger
      if (!val) return
      this.SNList.push(val)
      this.$set(this.query, 'S_SN', '')
      if (this.SNList.length > 0 && !this.isRunning) {
        this.isRunning = true
        this.handleSNEnter(this.SNList.shift())
      }
    },
    handleSNEnter(val) {
      // if (!val) return
      // this.snDisabled = true
      let params = JSON.parse(JSON.stringify(this.query))
      params.S_SN = val

      SetScanSN(params, false, true).then(
        (res) => {
          try {
            if (res.Success) {
              this.hintInfos.unshift({
                msg: `${new Date().format('yyyy-MM-dd hh:mm:ss')}: SN: ${val} ${res.ResultMsg}`,
                result: 'success',
              })
              if (this.query.S_UnitStatus == 1) {
                this.quantity++
              } else if (this.query.S_UnitStatus == 2) {
                this.rejectQuantity++
              } else if (this.query.S_UnitStatus == 3) {
                this.scrapQuantity++
              }
              let data = res.ResData
              this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
              this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
            } else {
              this.hintInfos.unshift({
                msg: res.ResultMsg,
                result: 'error',
              })
            }
          } catch (err) {
            this.hintInfos.unshift({
              msg: err,
              result: 'error',
            })
          } finally {
            this.handleFinally(res.Sounds)
            // this.snDisabled = false
            // this.$set(this.query, 'S_SN', '')
            this.$nextTick(function () {
              this.$refs.snInput.focus()
            })
          }
        },
        (error) => {
          document.querySelector('#NGPlay').play()
          this.isRunning = false;
          // this.snDisabled = false
          this.$nextTick(function () {
            this.$refs.snInput.focus()
          })
          // this.$set(this.query, 'S_SN', '')
          this.hintInfos.unshift({
            msg: res.ResultMsg,
            result: 'error',
          })
          this.handleShowQCError()
        }
      )
    },
    handleFinally(sounds) {
      if (sounds === 'OK') {
        if (this.query.S_UnitStatus == '2') {
          document.querySelector('#QCNGPlay').play()
        } else if (this.query.S_UnitStatus == '3') {
          document.querySelector('#SCRAPPlay').play()
        } else {
          document.querySelector('#OKPlay').play()
        }
      } else if (sounds === 'RE') {
        document.querySelector('#REPlay').play()
      } else {
        this.handleShowQCError()
        document.querySelector('#NGPlay').play()
      }

      if (this.SNList.length > 0) {
        this.handleSNEnter(this.SNList.shift())
      } else {
        this.isRunning = false;
      }
    },
    handleShowQCError() {
      if (this.query.S_UnitStatus == '2') {
        this.$refs.ErrorQC.show('NG', this.hintInfos[0])
      } else if (this.query.S_UnitStatus == '3') {
        this.$refs.ErrorQC.show('SCRAP', this.hintInfos[0])
      }
    },
    handleQueryReset() {
      this.disabledConfirm = false
      this.isDisable = false
      this.isShowInfo = false
      this.snDisabled = false
      this.$set(this.query, 'S_SN', '')
    },
    /* 确定 */
    handleConfirm(query, isShowLoading) {
      let params = {}
      for (let key in query) {
        if (Array.isArray(query[key])) {
          params[key] = query[key].join(',')
        } else {
          params[key] = query[key]
        }
      }
      this.BOMtableData = []
      this.craftTableData = []
      SetConfirmPO(params, true)
        .then((res) => {
          if (res.Success) {
            this.disabledConfirm = true
            this.isDisable = true
            this.isShowInfo = true
            let data = res.ResData
            this.BOMtableData = data ? data.mesProductStructures : []
            this.pOrderDesc = this.BOMtableData[0] ? this.BOMtableData[0].ParentPartNumber : ''
            // this.craftTableData = data ? data[1] : []
            data.RouteDataDiagram1 && data.RouteDataDiagram1.forEach((element) => {
              let obj = this.craftTableData.find(
                (r) => r.StationTypeID === element.StationTypeID
              )
              if (obj) {
                if (obj.children) {
                  obj.children.push(element)
                } else {
                  obj.children = [element]
                }
              } else {
                this.craftTableData.push(element)
              }
            })
            this.completed = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].currentCount : 0
            this.target = data.ProductionOrderQTY ? data.ProductionOrderQTY[0].prodCount : 0
          } else {
            this.hintInfos.unshift({
              msg: res.ResultMsg,
              result: 'error',
            })
          }
        })
    },
  },
}
