<template>
  <div v-loading="loading" class="dashboard">
    <div class="header" @click="test">
      <el-select v-model="objKey" placeholder=""
        style="position: absolute; left: 100px; top: 6px; z-index: 101; width: 120px;">
        <el-option v-for="item in devServer" :key="item" :label="item.split('_').pop()" :value="item.split('_').pop()">
        </el-option>
      </el-select>
      <span>
        {{ titles[index] }}
      </span>
      <el-popover v-model="visible" style="position: absolute; left: 15px; top:0px;z-index: 101;" width="900"
        placement="bottom" trigger="click">
        <div>
          <query-condition v-model="params" :is-show-data-level="true"></query-condition>
          <div style="text-align: right; padding-top: 10px;">
            <el-switch v-model="isAuto" :active-text="$t('Auto')" :inactive-text="$t('UnAuto')"
              style="margin-right: 20px;">
            </el-switch>
            <el-button @click="handleReset">{{ $t('reset') }}</el-button>
            <el-button type="primary" @click="handleServerSwitch">{{ $t('query') }}</el-button>
          </div>
        </div>
        <el-button slot="reference" icon="el-icon-search" circle></el-button>
      </el-popover>
      <div style="position: absolute; right: 10px; font-size: 22px; top: 40px;">
        {{ params.S_EndDateTime }}
      </div>
    </div>
    <el-container>
      <el-aside width="49%" style="display: flex; position: relative;">
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
        <el-carousel indicator-position="none" style="height: 96%;width: 96%;" class="shadow_style" :autoplay="true"
          :interval="1000 * 5">
          <el-carousel-item v-for="(item, key) in targetOutput[titles[index]]"
            :id="ids + '_' + titles[index].replaceAll(/\/|\.|\(|\)|\+|\s/g, '_') + '_' + key.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')"
            :key="key" style="height: 100%;">
          </el-carousel-item>
        </el-carousel>
      </el-aside>

      <el-main id="M_header" v-loading="yLoading" indicator-position="none"
        style="margin: 0; padding: 0 5px 0 0; position: relative; display: flex;">
        <div class="top_input">
          <el-dropdown>
            <span class="el-dropdown-link">
              <i class="el-icon-arrow-down el-icon-setting"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <div style="width: 200px; padding-left: 15px;">
                <div>
                  <div style="display: inline-block; margin: 0 5px">Top:</div>
                  <el-input v-model="params.S_TopQTY" type="number" style="width: 150px"
                    @input="handleTopInput"></el-input>
                </div>
                <div style="margin-top: 5px;">
                  <div style="display: inline-block; margin: 0 5px">CumTarget:</div>
                  <el-input v-model="yieldCumTarget" type="number" style="width: 105px"
                    @input="handleCumTargetInput"></el-input>
                </div>
              </div>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div :id="ids + 'M_footer'" style="height: 96%;width: 98%;" class="shadow_style">
        </div>
      </el-main>
    </el-container>

    <div class="pn_button">
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-left" circle
        @click="handlePrev"></el-button>
      <el-button class="el-carousel__arrow" type="info" icon="el-icon-arrow-right" circle
        style="position: absolute; right: 20px" @click="handleNext"></el-button>
    </div>
  </div>
</template>

<script>
import { GetUPH, GetDefectYield } from '@/api/report.js'
// import { getData, setCircleData } from './data'
import { getData, setCircleData } from '@/views/report/production/dashboard/data' //20241031
import QueryCondition from '@/components/QueryCondition'
import { getShift, getUserShift, uuid } from '@/utils'
import {
  multiServer,
  multiServerForm,
  appId,
  tokenGrantType,
  appSecret,
} from '@/config'
import { getToken } from '@/api/user.js'
import { encryptedData } from '@/utils/encrypt.js'
import Mixin from './mixin'

export default {
  name: 'MultiObjectDashboard',
  components: {
    QueryCondition,
  },
  mixins: [Mixin],
  props: {
    ids: {
      type: String,
      default: () => {
        return uuid()
      }
    }
  },
  data() {
    let YieldTop = localStorage.getItem('YieldTop')
    let UPHTarget = localStorage.getItem('UPHTarget')
    let yieldCumTarget = localStorage.getItem('YieldCumTarget')
    return {
      visible: false,
      params: {
        S_StartDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0',
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        S_Shift: this.$store.getters['user/userShiftTable'], //班次
        S_DataLevel: 8, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //是否合并良率
        S_TopQTY: YieldTop ? YieldTop : 20
      },
      color: '#111',
      fontSize: 12,
      titleFontSize: 16,
      target: UPHTarget ? UPHTarget : 270,
      carouselData: {},
      outputData: {},
      targetOutput: {},
      titles: [],
      index: 0,
      time: null,
      byColorId: uuid(),
      isAuto: true,
      once: true,
      chartCxt: {},
      devServer: Object.keys(multiServer),
      tokenData: {
        grant_type: tokenGrantType,
        appid: appId,
        secret: appSecret,
      },
      form: multiServerForm,
      switchData: {},
      loading: true,
      dyId: '',
      yieldCumTarget: yieldCumTarget ? yieldCumTarget : 100,
      objKey: '',
      oneEvent: true,
      sTime: 30, //线切换时间 秒
      objIndex: 0,
      asyncUPH: {},
      // asyncYield: {},
      cacheParams: {},
      yLoading: true,
      processYield: {}
    }
  },
  watch: {
    index: function (val, oval) {
      let lineKey = this.titles[val];

      this.setData(lineKey)
      let yieldCumTarget = this.processYield[this.objKey]?.[lineKey]?.target || this.yieldCumTarget

      this.handleDefectChart(this.switchData?.[this.objKey]?.[lineKey], this.dyId, this.switchData[this.objKey]?.yieldCumActual?.[lineKey], yieldCumTarget, this.params.S_TopQTY, lineKey, Object.keys(this.carouselData?.[this.objKey]?.[lineKey] ?? {})?.[0])
    },
    objKey: function (val, oval) {
      this.handleObjChange(val)
    }
  },
  mounted() {
    this.goToMultiObjectDashboard();
    window.addEventListener('resize', this.handleResize())
    this.dyId = '#' + this.ids + 'M_footer';

    this.handleServerSwitch()
  },
  beforeDestroy() {
    this.destroyTimer()
    window.removeEventListener('resize', this.handleResize())
  },
  methods: {
    test() {
      console.log(this.switchData)
      console.log(this.devServer)
      console.log(this.targetOutput)
    },
    handleAsync() {
      let _this = this;
      let set = new Set()
      let time = setInterval(function () {
        Object.keys(_this.asyncUPH).forEach(key => {
          if (!_this.asyncUPH[key]/*  && !_this.asyncYield[key] */) {
            set.add(key)
          }
        })
        if (set.size === Object.keys(_this.devServer).length) {
          clearInterval(time)
          _this.objKey = Array.from(set)[0].split('_').pop();
          _this.handleSwitchLine()
          _this.loading = false
        }
      }, 1000)
    },

    // 项目切换
    handleSwitchObject() {
      let _this = this;
      if (_this.objIndex >= _this.devServer.length) {
        _this.objIndex = 0;
      }
      _this.objKey = _this.devServer[_this.objIndex++].split('_').pop()
    },
    // 手动切换项目
    async handleObjChange(val) {
      if (!val) return
      this.objIndex = this.devServer.findIndex(item => item.includes(this.objKey))
      this.objIndex++ //下次运行时
      this.index = 0

      await this.dataFormat(this.switchData[val]?.output, val)

      let lineKey = this.titles[this.index];
      let yieldCumTarget = this.processYield[this.objKey]?.[lineKey]?.target || this.yieldCumTarget
      this.handleDefectChart(this.switchData?.[val]?.[lineKey], this.dyId, this.switchData[val]?.yieldCumActual?.[lineKey], yieldCumTarget, this.params.S_TopQTY, lineKey, Object.keys(this.carouselData[val]?.[lineKey] ?? {})[0])
      this.handleRefreshData() //刷新下一项目数据

    },
    goToMultiObjectDashboard() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true)
    },
    handleServerSwitch(val) {
      this.visible = false
      val && (this.loading = true);
      this.devServer.forEach(key => {
        this.handleGetToken(this.tokenData, key)
      })
      this.handleAsync()
    },
    handleGetToken(data, key) {
      getToken(data, key).then((res) => {
        if (res.Success) {
          this.$store.dispatch(
            'user/setTemporaryToken',
            `Bearer ${res?.ResData?.AccessToken}`
          )
          let params = JSON.parse(JSON.stringify(this.form))
          this.$set(params, 'password', encryptedData(params.password))
          this.$store
            .dispatch('user/loginNoKey', { userInfo: params, api: key })
            .then(() => {
              this.$store.dispatch('user/getUserInfo', key).then(() => {
                this.handleQuery(key)
              })
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    },
    handleCumTargetInput(val) {
      if (isNaN(val)) return;

      localStorage.setItem('YieldCumTarget', val)
      let lineKey = this.titles[this.index];
      Object.values(this.processYield).forEach(value=>{
        if(!value.srcFlag){
          this.$set(value, 'target', parseFloat(val))
        }else{
          return
        }
      })


      this.handleDefectChart(this.switchData?.[this.objKey]?.[lineKey], this.dyId, this.switchData[this.objKey]?.yieldCumActual?.[lineKey], val, this.params.S_TopQTY, lineKey, Object.keys(this.carouselData?.[this.objKey]?.[lineKey] ?? {})?.[0]);
    },

    handleResize() {
      this.$nextTick(function () {
        Object.keys(this.chartCxt).forEach(key => {
          this.chartCxt?.[key]?.resize()
        })
      })
    },
    handlePrev() {
      if (this.index <= 0) {
        this.index = this.titles.length - 1
      } else {
        --this.index
      }
    },
    handleNext() {
      if (this.index >= this.titles.length - 1) {
        this.index = 0
      } else {
        ++this.index
      }
    },
    handleTopInput(val) {
      if (!val) return;
      localStorage.setItem('YieldTop', val)
      this.$set(this.params, 'S_TopQTY', val)
      let lineKey = this.titles[this.index]

      this.getDefectYield(this.cacheParams[lineKey], `/api_${this.objKey}`, lineKey)
    },
    //换线
    handleSwitchLine() {
      let that = this
      that.time && clearInterval(that.time)
      that.time = setInterval(function () {
        if (that.index >= that.titles.length - 1) {
          that.index = 0
          that.handleSwitchObject()
        } else {
          that.index++
        }
      }, 1000 * that.sTime)
    },

    destroyTimer() {
      if (this.time) {
        clearInterval(this.time)
        this.time = null
      }
    },

    handleRefreshData() {
      let that = this;
      if (that.isAuto) {
        let shift = getShift(that.$store.getters['user/shiftTable'])
        let s = getUserShift(that.$store.getters['user/shiftTable']);
        that.$set(that.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
        that.$set(that.params, 'S_Shift', s)
        that.$set(that.params, 'S_StartDateTime', shift.sTime)

        let index = that.devServer.findIndex(item => item.includes(that.objKey))
        if (index < 0 || ++index >= that.devServer.length) {
          index = 0
        }
        that.handleGetToken(that.tokenData, that.devServer[index])
      }
    },

    handleReset() {
      let shift = getShift(this.$store.getters['user/shiftTable'])
      let s = getUserShift(this.$store.getters['user/shiftTable']);
      this.$set(this.params, 'S_StartDateTime', shift.sTime)
      this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.params, 'S_DataType', '0')
      this.$set(this.params, 'S_PartFamilyTypeID', null) //料号类别
      this.$set(this.params, 'S_PartFamilyID', null) //料号组
      this.$set(this.params, 'S_PartID', null) //料号
      this.$set(this.params, 'S_ProductionOrderID', null) //工单
      this.$set(this.params, 'S_StationTypeID', null) //工站类型
      this.$set(this.params, 'S_StationID', null) //工站
      this.$set(this.params, 'S_LineID', null) //产线
      this.$set(this.params, 'S_Shift', s) //班次
      this.$set(this.params, 'S_DataLevel', 8) //
    },

    handleQuery(api) {
      this.visible = false
      // this.targetOutput = {}

      let shift = getShift(this.$store.getters['user/shiftTable'])
      let s = getUserShift(this.$store.getters['user/shiftTable'])
      this.$set(this.params, 'S_StartDateTime', shift.sTime)
      this.$set(this.params, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.params, 'S_Shift', s)
      // this.loading = true
      this.getData(api)
    },

    getData(api) {
      this.asyncUPH[api] = true
      let params = JSON.parse(JSON.stringify(this.params))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      GetUPH(params, true, api).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          let list = getData(data, params.S_DataLevel)

          Object.keys(list).forEach(key => {
            params.S_PartFamilyTypeID = [list[key]?.[0]?.PartFamilyTypeID]
            // params.S_StationTypeID = [list[key]?.[0]?.StationTypeID]
            params.S_LineID = [list[key]?.[0]?.LineID]
            this.cacheParams[key] = params
          })

          // 添加到缓存
          let key = api.split('_').pop()
          if (!this.switchData[key]) {
            this.switchData[key] = {}
          }
          this.$set(this.switchData[key], 'output', list);
        }
        this.asyncUPH[api] = false
      }, error => {
        this.asyncUPH[api] = false
      })
    },

    getDefectYield(param, api, lineKey) {
      if (!param) return;
      // this.asyncYield[api] = true
      let params = JSON.parse(JSON.stringify(param))
      Object.keys(params).forEach(key => {
        if (Array.isArray(params[key])) {
          this.$set(params, key, params[key].join(','))
        }
      })
      this.yLoading = true;
      GetDefectYield(params, api).then((res) => {
        let data = res.ResData
        if (res.Success && data) {
          let list = {
            yAxis: data[4] ? data[4].map((r) => r.DefectCodeDesc) : [],
            Data: data[4] ? data[4].map((r) => r.DefectRate) : [],
          }

          // 添加到缓存
          let key = api.split('_').pop()
          if (!this.switchData[key]) {
            this.switchData[key] = {}
          }

          this.$set(this.switchData[key], lineKey, list)
        }
        this.yLoading = false;
        // this.asyncYield[api] = false
      }, error => {
        // this.asyncYield[api] = false
        this.yLoading = false;
      })
    },

    dataFormat(obj, key) {
      this.titles = Object.keys(obj)
      let toObj = {};
      this.carouselData[key] = {}
      this.processYield[key] = {}
// debugger
      Object.keys(obj).forEach(k => {
        let o = {};
        let c = {};
        let to = {};
        obj[k].forEach(item => {
          // Process Yield
          if (!o.axis) {
            o.axis = []
          }
          if (!o.axis.includes(item.StationType)) {
            if (o.axis && Array.isArray(o.axis)) {
              o.axis.push(item.StationType)
            } else {
              o['axis'] = [item.StationType]
            }
            let y = item.sumOutput / item.sumInput * 100
            if (o.data && Array.isArray(o.data)) {
              o.data.push(y == 100 ? y + '' : y.toFixed(1))
            } else {
              o['data'] = [y == 100 ? y + '' : y.toFixed(1)]
            }
            o['srcFlag'] = item.YieldTarget ? true : false;
            o['target'] = item.YieldTarget || parseFloat(this.yieldCumTarget);
          }
          // carousel
          if (!c[item.StationType]) {
            c[item.StationType] = {}
            c[item.StationType]['Input'] = item.sumInput;
            c[item.StationType]['Output'] = item.sumOutput;
            let y = item.sumOutput / item.sumInput * 100
            c[item.StationType]['Yield'] = y == 100 ? y + '' : y.toFixed(1);
          }
          // target output
          if (to[item.StationType]) {
            if (item.type === 'UPHTarget' || item.type === 'Output' || item.type === 'UPHTargetByHour') {
              to[item.StationType][item.type] = item
            }
          } else {
            to[item.StationType] = {}
            //20241031添加
            if (item.type === 'UPHTarget' || item.type === 'Output' || item.type === 'UPHTargetByHour') {
              to[item.StationType][item.type] = item
            }
          }
        })
        this.processYield[key][k] = Object.assign({}, o)
        this.carouselData[key][k] = Object.assign({}, c)

        toObj[k] = Object.assign({}, to)
      })

      // target output
      // let flag = false
      Object.keys(toObj).forEach(key => {
        Object.keys(toObj[key]).forEach(k => {
          let yAxis = [], target = [], data = [], srcFlag = false;
          Object.keys(toObj[key][k].Output).forEach(kk => {
            if (new Date(kk) != 'Invalid Date' || kk.includes('WK')) {
              yAxis.push(kk)
              srcFlag = toObj[key][k].UPHTarget[kk] || toObj[key][k].UPHTargetByHour[kk] ? true : false
              let t = toObj[key][k].UPHTarget[kk] || toObj[key][k].UPHTargetByHour[kk] || parseInt(this.target)
              /*  let t = toObj?.[key]?.[k]?.UPHTarget?.[kk];
               flag = t ? true : false;
               target.push(t ? t : parseFloat(this.target)) */
              target.push(t)
              // target.push(300)
              data.push(toObj[key][k].Output[kk])
            }
          })
          toObj[key][k] = { yAxis, target, data, flag:srcFlag }
        })
      })
      this.targetOutput = JSON.parse(JSON.stringify(toObj))

      // outputStart + 计算CUMTarget
      this.outputData = {}
      if (!this.switchData[key]) {
        this.switchData[key] = {}
      }
      Object.keys(this.carouselData[key]).forEach(kk => {
        if (!this.outputData[kk]) {
          this.outputData[kk] = []
        }
        let sumInput = 0;
        let sumOutput = 0;

        Object.keys(this.carouselData[key][kk]).forEach(k => {
          let arr = [k]
          let o = this.carouselData[key][kk][k].Output
          let i = this.carouselData[key][kk][k].Input
          sumInput += i;
          sumOutput += o;

          arr.push(o)
          arr.push(i - o)
          this.outputData[kk].push(arr)
        })

        // 计算CUMTarget
        if (!this.switchData[key].yieldCumActual) {
          this.switchData[key].yieldCumActual = {}
        }
        let h = sumOutput / sumInput * 100;
        let yca = h == 100 ? h : h.toFixed(2)

        this.$set(this.switchData[key].yieldCumActual, kk, isNaN(yca) ? '--' : yca)
      })

      this.setData(this.titles[this.index])
    },

    setData(key) {
      let _this = this
      _this.$nextTick(function () {
        _this.targetOutput[key] && Object.keys(_this.targetOutput[key]).forEach(kk => {
          // debugger
          let id = _this.ids + '_' + _this.titles[_this.index].replaceAll(/\/|\.|\(|\)|\+|\s/g, '_') + '_' + kk.replaceAll(/\/|\.|\(|\)|\+|\s/g, '_')
          _this.handleUPHChart('#' + id, _this.targetOutput[key][kk], kk, _this.target)
        })
      })

      // if(this.isAuto){
      this.getDefectYield(this.cacheParams[key], `/api_${this.objKey}`, key)
      // }
    },
  },
}
</script>

<style lang="scss" scoped>
::v-deep {
  .el-carousel__container {
    height: 100%;
  }
}

.shadow_style {
  margin: auto;
  box-sizing: border-box;
  border-radius: 10px;
  box-shadow: 1px 1px 2px #eee, 0 0 25px #efefef, 0 0 5px var(--themeColor, $base-color-default);

  & div {
    height: 100%;
    width: 100%;
  }
}

.dashboard {
  display: flex;
  position: relative;
  background-color: #fff;
  min-width: 800px;
  height: 100vh;
  box-sizing: border-box;
  // padding: 5px 10px;

  .pn_button {
    position: absolute;
    top: 50%;
    z-index: 101;
    width: 96%;
    padding: 0 20px;
    display: none;

    .el-button {
      background-color: #eee;
      border: #eee;

      &:hover {
        background-color: #ccc;
        border: #ccc;
      }
    }
  }

  &:hover {
    .pn_button {
      display: block;
    }
  }

  // background: url('../../../../assets/dashboard/bg03.png') no-repeat;
  // background-size: cover;
  // background-color: rgba(2,123,207, 0.05);
  .target_input {
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 101;
  }

  .top_input {
    position: absolute;
    right: 25px;
    top: 25px;
    z-index: 101;
  }

  .header {
    width: 100%;
    position: absolute;
    text-align: center;
    font-size: 1.8rem;
    color: #222;
    // line-height: 94px;
    background-size: 100%;
    padding-top: 10px;
  }

  .el-container {
    // border: 1px solid red;
    padding-top: 50px;

    .el-aside {
      box-sizing: border-box;
      // overflow: hidden; #054d05, #9b1111
      // color: #066b06;
      // color: #ad2424;
    }


  }
}
</style>
