<template>
  <div v-loading="oneEvent" class="mainMultiServer">
    <div class="multiServerTitle" @click="test">ProjectName: {{ ProjectName }} </div>
    <div style="height: calc(100vh - 100px);">
      <div
        style="position: relative; height: 40px; line-height: 40px; color: black; font-size: 24px; font-weight: 800;">
        <span style="padding-left: 10px;">{{ title }} {{ getShiftText(query.S_Shift) }}</span>
        <span style="position: absolute; right: 10px;"> {{ query.S_EndDateTime }} </span>
      </div>
      <div style="height: calc(100% - 40px);">
        <OutputV2Common ref="OutputV2Common" size="mini" style="height: 100%;" @setTitle="setTitle"
          @LastCarousel="handleLastCarousel"></OutputV2Common>
      </div>
    </div>
  </div>
</template>

<script>
import { getToken, login } from '@/api/user.js'
import OutputV2Common from '@/views/report/production/DG/output_v2/common/OutputV2Common.vue'
import { GetUPHCum } from '@/api/report.js'
import {
  multiServer,
  multiServerForm,
  appId,
  tokenGrantType,
  appSecret,
} from '@/config'
import { resetRouter } from '@/router/index.js'
import { encryptedData } from '@/utils/encrypt.js'
import { getShift, getUserShift } from '@/utils'
import { getData } from '@/views/report/production/DG/output_v2/common/dataFormat.js'

/* 多服务器看板 */
export default {
  name: 'MultiServerDashboardPage',
  components: {
    OutputV2Common
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.goToMultiServer()
    })
  },
  data() {
    return {
      title: "",
      devServer: Object.keys(multiServer),
      objData: {},
      query: {
        S_StartDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'), //shift.sTime,
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
        S_DataLevel: 4, //数据层级
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      index: 0,
      form: multiServerForm,
      temporaryToken: '',
      oneEvent: true,
      tokenData: {
        grant_type: tokenGrantType,
        appid: appId,
        secret: appSecret,
      },
      bigLoop: 0,
      ProjectName: ""
    }
  },

  mounted() {
    this.handleServerSwitch()
  },
  beforeDestroy() {
    resetRouter()
    this.$store.dispatch('user/resetAccessToken')
  },
  methods: {
    goToMultiServer() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true) //标记为公共页面
    },
    test() {
      console.log(this.objData)
    },
    setTitle(val) {
      this.title = val
    },
    getShiftText(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
      }
    },
    handleLastCarousel() {

      this.title = ''
      let shift = getShift(this.$store.getters['user/shiftTable'])
      let s = getUserShift(this.$store.getters['user/shiftTable']);
      this.$set(this.query, 'S_StartDateTime', shift.sTime)
      this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
      this.$set(this.query, 'S_Shift', s)

      let key = this.devServer[this.index];
      if (this.index >= this.devServer.length) {
        this.index = 0;
        key = this.devServer[this.index];
      }

      this.ProjectName = key.split('_').pop()
      this.$refs?.OutputV2Common?.setData?.(this.objData[key], this.query, true)

      let nKey = this.devServer[++this.index]
      if (!nKey) {
        this.handleGetToken(this.tokenData, this.devServer[0])
      } else {
        this.handleGetToken(this.tokenData, nKey)
      }
    },

    handleGetToken(data, key) {
      getToken(data, key).then((res) => {
        if (res.Success) {
          this.$store.dispatch(
            'user/setTemporaryToken',
            `Bearer ${res?.ResData?.AccessToken}`
          )
          //登录
          let params = JSON.parse(JSON.stringify(this.form))
          this.$set(params, 'password', encryptedData(params.password))
          this.$store
            .dispatch('user/loginNoKey', { userInfo: params, api: key })
            .then(() => {
              this.$store.dispatch('user/getUserInfo', key).then(() => {
                // this.loading = false
                this.$set(this.query, 'S_Shift', this.$store.getters['user/userShiftTable'])
                this.handleSearch(key, true)
              })
            })
            .catch(() => {
              // this.loading = false
            })
        }
      })
    },
    handleServerSwitch() {
      this.devServer.forEach(key => {
        this.handleGetToken(this.tokenData, key)
      })
      this.oneEvent && this.index++
    },

    handleSearch(key, noShow) {
      let shift = getShift(this.$store.getters['user/shiftTable'])
      this.$set(this.query, 'S_StartDateTime', shift.sTime)
      !this.objData[key] && (this.objData[key] = { header: {}, list: {} })

      let params = {}
      for (let k in this.query) {
        if (Array.isArray(this.query[k])) {
          params[k] = this.query[k].join(',')
        } else {
          params[k] = this.query[k]
        }
      }

      GetUPHCum(params, noShow, key).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          let obj = getData(data, params?.S_DataLevel)
          this.objData[key] = obj

          if (this.oneEvent) {
            this.ProjectName = key.split('_').pop(); //固定位置
            this.$refs?.OutputV2Common?.setData?.(obj, params, true)
            this.oneEvent = false
          }
        }
      }).catch(error => {
        // this.oneEvent = false
      })
    },

  }
}
</script>

<style lang="scss">
.mainMultiServer {
  padding: 50px;
  box-sizing: border-box;
  position: relative;

  .multiServerTitle {
    position: absolute;
    margin: 0 auto;
    height: 40px;
    top: 0;
    left: calc(100vw / 2 - 80px);
    z-index: 100;
    line-height: 40px;
    margin-top: 10px;
    font-size: 1.1rem;
    font-weight: 700;
    text-shadow: 3px 3px 3px rgb(173, 170, 170);
    padding: 0 10px;
    background-color: transparent;
  }
}
</style>
