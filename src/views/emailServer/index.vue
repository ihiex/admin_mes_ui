<template>
  <div class="email_multi_server">
    <h1 style="color: aliceblue;">
      Please don`t close this page
    </h1>

    <el-form ref="ruleForm" :rules="rules" :model="param" label-width="100px">
      <el-form-item label="起始时间" prop="startTime">
        <el-date-picker v-model="param.startTime" format="yyyy/MM/dd HH:mm:ss" value-format="yyyy/MM/dd HH:mm:ss"
          type="datetime" placeholder="起始时间" style="width: 100%;" :disabled="isLock">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="时间间隔" prop="timeStep">
        <el-time-picker v-model="param.timeStep" value-format="HH:mm:ss" placeholder="时间间隔" style="width: 100%;"
          :disabled="isLock">
        </el-time-picker>
      </el-form-item>
      <el-form-item label="标题">
        <el-input v-model="param.Subject" placeholder="标题" clearable :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item label="MovePath">
        <el-input v-model.trim="param.MovePath" placeholder="MovePath" clearable :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item label="ProfileName" prop="ProfileName">
        <el-input v-model.trim="param.ProfileName" placeholder="ProfileName" clearable :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item label="根路径" prop="rootPath">
        <el-input v-model.trim="param.rootPath" placeholder="根路径" clearable :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item label="接收地址" prop="Recipients">
        <el-input v-model.trim="param.Recipients" placeholder="多个邮件接收地址以逗号分割" type="textarea" clearable :rows="3"
          :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item label="内容">
        <el-input v-model="param.Body" placeholder="内容" type="textarea" clearable :rows="5"
          :disabled="isLock"></el-input>
      </el-form-item>
      <el-form-item style="text-align: right;">
        <el-button type="primary" :disabled="isLock" @click="handleStartServe('ruleForm')">开启服务</el-button>
        <el-button type="warning" :disabled="!isLock" @click="handlePauseServe">暂停服务</el-button>
      </el-form-item>
    </el-form>

    <div style="height: 30%; overflow: auto; ">
      <div style="padding: 10px 0; color: aliceblue;">
        {{ serverStart }}
      </div>
      <div v-for="(item, index) in showMessage" :key="index" style="padding: 10px 0; color: aliceblue;"
        :style="{ color: item.includes('发送失败') ? '#c91313' : 'aliceblue' }">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from '@/api/user.js'
import {
  multiServerForm,
  appId,
  tokenGrantType,
  appSecret,
  emailServerConfig
} from '@/config'
import { resetRouter } from '@/router/index.js'
import { encryptedData } from '@/utils/encrypt.js'
import { getShift, getUserShift } from '@/utils'
import getDownLoadData from '@/utils/excel.js'
import { SendEmail } from '@/api/report.js'
import { GetUPH } from '@/api/report.js'
import { getFormatData, handleExport } from './common.js'



/* 邮件服务 */
export default {
  name: 'EmailServer',

  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.goToEmailServer()
    })
  },
  data() {
    return {
      devServer: Object.keys(emailServerConfig.serve),
      query: {
        S_StartDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'), //shift.sTime,
        S_EndDateTime: new Date().format('yyyy-MM-dd hh:mm:ss'),
        S_DataType: '0', //时间类别
        S_PartFamilyTypeID: null, //料号类别
        S_PartFamilyID: null, //料号组
        S_PartID: null, //料号
        S_ProductionOrderID: null, //工单
        S_StationTypeID: null, //工站类型
        S_StationID: null, //工站
        S_LineID: null, //产线
        // S_Shift: this.$store.getters['user/userShiftTable'], //班次
        S_Shift: '', //班次
        S_DataLevel: 5, //数据层级 -- 5 byColor
        YieldLevel: 1, //良率层级
        IsCombineYield: 0, //良率合并
      },
      count: 0,
      form: multiServerForm,
      tokenData: {
        grant_type: tokenGrantType,
        appid: appId,
        secret: appSecret,
      },
      params: {
        "FilePaths": [],
        "ProfileName": emailServerConfig.ProfileName,
        "MovePath": emailServerConfig.MovePath,
        "Recipients": emailServerConfig.emailAddress,
        "Body": emailServerConfig.content,
        "Subject": emailServerConfig.title
      },
      files: {},
      timer: null,
      showMessage: [],
      serverStart: "",
      isSend: true,
      param: {
        startTime: new Date().format('yyyy/MM/dd hh:00:00'),
        timeStep: '02:00:00',
        Body: emailServerConfig.content,
        Subject: emailServerConfig.title,
        Recipients: emailServerConfig.emailAddress.join(','),
        MovePath: emailServerConfig.MovePath,
        rootPath: emailServerConfig.rootPath,
        ProfileName: emailServerConfig.ProfileName
      },
      isLock: false,
      rules: {
        startTime: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        timeStep: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        Recipients: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        rootPath: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        ProfileName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
      },
      timer1: null
    }
  },

  watch: {
    count(val, oval) {
      if (val === this.devServer.length) {
        let arr = []
        Object.values(this.files).forEach(value => {
          value && arr.push(`${this.param.rootPath}${value}`)
        })
        this.$set(this.params, 'FilePaths', arr)
        this.count = 0
        let _this = this

        //当返回数据为空时 不发送
        if (arr.length == 0) {
          _this.isSend = true
          return
        }
        // 延后发送
        if (_this.timer1) {
          clearTimeout(_this.timer1)
          _this.timer1 = null
        }
        _this.timer1 = setTimeout(() => {
          _this.handleSend(_this.params)
          _this.isSend = true
        }, 1000 * 60 * 5);
      }

    },
    showMessage(val, oval) {
      if (val.length > 1000) {
        this.showMessage.splice(0, this.showMessage.length / 2)
      }
    }
  },
  mounted() {
    let _this = this;
    _this.goToEmailServer()
    let p = localStorage.getItem('EmailServer_p')
    if (p) {
      let param = JSON.parse(p)
      Object.keys(param).forEach(key => {
        if (key !== 'startTime') {
          _this.$set(_this.param, key, param[key])
        }
      })
    }

  },
  beforeDestroy() {
    resetRouter()
    this.$store.dispatch('user/resetAccessToken')
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  methods: {
    handlePauseServe() {
      this.isLock = false
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
        this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 服务已暂停')
      }
    },
    startServe() {
      let _this = this
      _this.serverStart = '服务已开启。'
      _this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 服务已开启')

      let time = new Date(_this.param.startTime)
      let step = new Date(`2000/01/01 ${_this.param.timeStep}`)

      if (time.getTime() < +new Date()) {
        time = new Date();
      }

      _this.timer = setInterval(() => {

        let start = +new Date() >= time.getTime()

        if (start && _this.isSend && +new Date() >= +new Date(_this.param.startTime)) {
          _this.isSend = false

          // 设置获取数据时间段
          let et = new Date()
          et.setHours(et.getHours() - step.getHours())
          et.setMinutes(et.getMinutes() - step.getMinutes())
          et.setSeconds(et.getSeconds() - step.getSeconds())
          _this.$set(_this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss'))
          _this.$set(_this.query, 'S_StartDateTime', et.format('yyyy-MM-dd hh:00:00'))
          console.log(_this.query)

          //时间间隔
          time.setHours(time.getHours() + step.getHours())
          time.setMinutes(time.getMinutes() + step.getMinutes())
          time.setSeconds(time.getSeconds() + step.getSeconds())

          _this.handleServerSwitch()
          console.log('start task')
        }
      }, 1000);
    },
    handleStartServe(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$set(this.params, 'Subject', this.param.Subject)
          this.$set(this.params, 'Body', this.param.Body)
          let arr = [];
          this.param.Recipients?.split(',')?.forEach(item => {
            arr.push(item.trim())
          })
          this.$set(this.params, 'Recipients', arr)
          this.$set(this.params, 'ProfileName', this.param.ProfileName)
          this.$set(this.params, 'MovePath', this.param.MovePath)

          localStorage.setItem('EmailServer_p', JSON.stringify(this.param))

          this.isLock = true
          this.startServe()
          console.log(this.params)
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSend(data) {
      this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 开始发送......')
      SendEmail(data).then(res => {
        if (res.Success) {
          this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 发送成功')
        } else {
          this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 发送失败 ' + res.ResultMsg)
        }
      }).catch(error => {
        this.showMessage.push(new Date().format('yyyy/MM/dd hh:mm:ss') + ': 发送失败 ' + JSON.stringify(error))
      })
    },

    goToEmailServer() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true) //标记为公共页面
    },

    getShiftText(shift) {
      if (shift.length == 1) {
        return shift[0] == 'D' ? 'DayShift' : 'NightShift'
      } else {
        return 'AllShift'
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
                // this.$set(this.query, 'S_Shift', this.$store.getters['user/userShiftTable'])
                this.handleSearch(key, true)
              }, error => {
                this.count++
                this.files[key] = null
              })
            }, error => {
              this.count++
              this.files[key] = null
            }).catch(error => {
              this.count++
              this.files[key] = null
            })
        }
      }, error => {
        this.count++
        this.files[key] = null
      })
    },

    handleServerSwitch() {
      this.devServer.forEach(key => {
        this.handleGetToken(this.tokenData, key)
      })
    },

    handleSearch(key, noShow) {
      /*  let shift = getShift(this.$store.getters['user/shiftTable'])
       this.$set(this.query, 'S_StartDateTime', shift.sTime)
       this.$set(this.query, 'S_EndDateTime', new Date().format('yyyy-MM-dd hh:mm:ss')) */

      let params = {}
      for (let k in this.query) {
        if (Array.isArray(this.query[k])) {
          params[k] = this.query[k].join(',')
        } else {
          params[k] = this.query[k]
        }
      }
      GetUPH(params, true, key).then((res) => {
        let data = res.ResData;
        if (res.Success && data) {
          let result = getFormatData(data, this.query.S_DataLevel)
          this.files[key] = handleExport(result.dataList, result.tableHead, key.split('_').pop())
        } else {
          this.files[key] = null
        }
        this.count++
        console.log(this.count)
      }, error => {
        this.files[key] = null
        this.count++
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.email_multi_server {
  padding: 20px 30px;
  box-sizing: border-box;
  position: relative;
  background-color: #222;
  height: 100%;
  overflow: hidden;
}

::v-deep {
  .el-form {
    .el-form-item {
      .el-form-item__label {
        color: #fff
      }
    }
  }
}
</style>
