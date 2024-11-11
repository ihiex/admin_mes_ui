<template>
  <div v-loading="oneEvent" class="output_multi_server">
    <!--  <div class="multiserver_title">
      ProjectName: {{ title }}
    </div> -->
    <div style="height: inherit;">
      <OutputBar ref="OutputBar" style="height: 100%;" ></OutputBar>
      <!-- @LastCarousel="handleLastCarousel" -->
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/user.js'
import OutputBar from '@/components/chart/OutputBar'
import { GetUPHMultiServer } from '@/api/report.js'
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

/* 多服务器看板 */
export default {
  name: 'MultiServerDashboardPage',
  components: {
    OutputBar
  },
  data() {
    let shift = getShift(this.$store.getters['user/shiftTable'])
    return {
      title: "",
      devServer: Object.keys(multiServer),
      objData: {},
      query: {
        S_StartDateTime: shift.sTime,
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
      lastFlag: false
    }
  },
  watch: {
   /*  title: function (val, oval) {
      if (val) {
        this.$emit('OutputTitle', val)
      }
    } */
  },
  mounted() {
    // this.handleServerSwitch()
  },
  async beforeDestroy() {
    resetRouter()
    this.$store.dispatch('user/resetAccessToken')
  },
  methods: {
    setAutoPlay(bool) {
      this.$refs.OutputBar.setAutoPlay(bool)
    },
    handleLastCarousel() {
      if (this.lastFlag) {
        this.lastFlag = false;
        this.$emit('completeOutputOnce')
      }
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

      this.title = key.split('_').pop()
      this.$refs.OutputBar.show(this.objData[key].data, this.objData[key].dataLevel, this.objData[key].shift, this.objData[key].endTime, this.query)
      let nKey = this.devServer[++this.index]
      if (!nKey) {
        this.lastFlag = true;
        this.handleGetToken(this.tokenData, this.devServer[0])
      } else {
        this.handleGetToken(this.tokenData, nKey)
      }
    },

    handleGetToken(data, key) {
      // this.loading = true
      getToken(data, key).then((res) => {
        if (res.Success) {
          this.$store.dispatch(
            'user/setTemporaryToken',
            `Bearer ${res.ResData.AccessToken}`
          )
          let params = JSON.parse(JSON.stringify(this.form))
          this.$set(params, 'password', encryptedData(params.password))
          this.$store
            .dispatch('user/loginNoKey', { userInfo: params, api: key })
            .then(() => {
              this.$store.dispatch('user/getUserInfo', key).then(() => {
                // this.loading = false
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
      let params = {}
      for (let key in this.query) {
        if (Array.isArray(this.query[key])) {
          params[key] = this.query[key].join(',')
        } else {
          params[key] = this.query[key]
        }
      }
      GetUPHMultiServer(params, key, noShow).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          this.objData[key] = { data, dataLevel: this.query.S_DataLevel, shift: this.query.S_Shift, endTime: this.query.S_EndDateTime }
          //只加载一次
          if (this.oneEvent) {
            this.$refs.OutputBar.show(this.objData[key].data, this.objData[key].dataLevel, this.objData[key].shift, this.objData[key].endTime, this.query)
            this.title = key.split('_').pop()
            this.oneEvent = false;
          }
        }
      })
    },
  },
}
</script>

<style lang="scss">
.output_multi_server {
  height: inherit;
  // padding: 50px;
  box-sizing: border-box;
  position: relative;
  background-color: #fff;

  .multiserver_title {
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
