<template>
  <div class="login-container">
    <div class="login_nav">
      <!-- v-if="process.env.VUE_APP_PROJECT_NAME.includes('DG-S1X')" -->
      <!--   <div style="position: relative; top: -8px;">
        <el-button type="text" style="font-size: 12px;" @click="goToEmailServer">
          {{ $t('EmailServer') }}
        </el-button>
      </div> -->
      <div style="position: relative; top: -8px;">
        <el-button type="text" style="font-size: 12px;" @click="goToMultiObjectDashboard">
          {{ $t('MultiObjectDashboard') }}
        </el-button>
      </div>
      <div style="position: relative; top: -8px">
        <el-button type="text" style="font-size: 12px;" @click="goToMultiServer">
          {{ $t('MultiServerDashboardPage') }}
        </el-button>
      </div>
      <div class="login_language">
        <Language style="font-size: 23px">
          <span style="font-size: 16px; margin-right: 5px">
            {{ $t('languageSwitch') }}
          </span>
        </Language>
      </div>
    </div>
    <el-form ref="form" :model="form" :rules="rules" class="login-form" label-position="left" @submit.native.prevent>
      <div class="title">hello !</div>
      <div class="title-tips">{{ $t('WelcomeTo') }} {{ waterMark }} {{ title }} !</div>
      <!-- 用户名 -->
      <el-form-item style="margin-top: 40px; width: 380px" prop="username">
        <span class="svg-container svg-container-admin">
          <vab-icon :icon="['fas', 'user']" />
        </span>
        <el-input ref="UserName" v-model.trim="form.username" v-focus :placeholder="$t('pleaseEnterUserName')"
          autocomplete="off" tabindex="1" type="text" @keypress.native.enter="handleLogin" />
      </el-form-item>
      <!-- 密码 -->
      <el-form-item prop="password" style="width: 380px">
        <z-password v-model="form.password" tabindex="2" :placeholder="$t('pleaseEnterPassword')"
          @keypress.native.enter="handleLogin"></z-password>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item style="width: 380px" prop="vcode">
        <el-input ref="verificationCode" v-model.trim="form.vcode" :placeholder="$t('pleaseEnterVerificationCode')"
          tabindex="3" type="text" style="width: 260px; margin-right: 10px" @keypress.native.enter="handleLogin" />
        <img class="captcha_img" :src="captchaImg" alt="#" @click="handleCaptcha" />
      </el-form-item>
      <!-- 工站 -->
      <el-form-item v-if="options.length" style="margin-buttom: 40px; width: 380px">
        <el-select v-model="station" filterable :placeholder="$t('SelectConfigurationSite')" tabindex="4"
          value-key="pseudonym" style="width: 100%" clearable @change="handleStationChange">
          <el-option v-for="item in options" :key="item.pseudonym" :label="item.pseudonym" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-button :loading="loading" class="login-btn" type="primary" :disabled="lsLoading" @click="handleLogin">
        {{ $t('login') }}
      </el-button>
      <div v-if="options.length" style="margin-top: 5px" class="station_info">
        <span>{{ $t('Station') }}:</span>
        {{ stationInfo ? stationInfo.station : '--' }}
      </div>
      <div v-if="options.length" style="padding-bottom: 5px" class="station_info">
        <span>{{ $t('Line') }}:</span>
        {{ stationInfo ? stationInfo.line : '--' }}
      </div>
    </el-form>
  </div>
</template>

<script>
import { isPassword } from '@/utils/validate'
import { Captcha, getToken } from '@/api/user.js'
import Language from '@/layouts/components/Language'
import IndexDB from 'indexdbforvue2'
let { indexedDBName, indexedDBVersion } = require('@/config')
import { encryptedData } from '@/utils/encrypt.js'
import ZPassword from 'z-password'
import { appSecret, appId, tokenGrantType } from '@/config'

/*
 登录
*/

export default {
  name: 'Login',
  components: {
    Language,
    ZPassword
  },
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  data() {
    let validateusername = (rule, value, callback) => {
      if ('' == value) {
        callback(new Error(this.$t('userNameCannotBeEmpty')))
      } else {
        callback()
      }
    }
    let validatePassword = (rule, value, callback) => {
      if (!isPassword(value)) {
        callback(new Error(this.$t('passwordCannotBeEmpty')))
      } else {
        callback()
      }
    }
    return {
      lsLoading: false,
      checked: false,
      nodeEnv: process.env.NODE_ENV,
      title: this.$baseTitle,
      captchaImg: '',
      form: {
        username: '',
        password: '',
        vcode: '', //验证码
        vkey: '', //验证码key
        appId: 'system', //应用AppId和应用密钥AppSecret获取凭据token与正确授权的url才能调用接口访问数据
        systemCode: 'openauth', //系统编码
        I_LineID: 0,
        I_StationID: 0,
      },
      rules: {
        username: [
          {
            required: true,
            trigger: 'blur',
            validator: validateusername,
          },
        ],
        password: [
          {
            required: true,
            trigger: 'blur',
            validator: validatePassword,
          },
        ],
        vcode: [
          {
            required: false,
            trigger: 'blur',
            message: this.$t('verificationCodeCannotBeEmpty'),
          },
        ],
      },
      loading: false,
      redirect: undefined,
      db: new IndexDB(indexedDBName, indexedDBVersion, 't_station'),
      stationInfo: null,
      station: this.$store.getters['stationSet/activeConfigManage'],
      options: [],
      waterMark: process.env.VUE_APP_PROJECT_NAME ? process.env.VUE_APP_PROJECT_NAME : ''
    }
  },
  watch: {
    $route: {
      //获取重定向时的页面
      handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
      },
      immediate: true,
    },
    'stationInfo.line': function (val, oval) {
      this.$store.dispatch('stationSet/setLineDesc', val)
      this.handleSetStation()
    },
    'stationInfo.station': function (val, oval) {
      this.$store.dispatch('stationSet/setStationDesc', val)
      this.handleSetStation()
    },
  },
  created() {
    document.body.style.overflow = 'hidden'
    this.handleCaptcha()
    let that = this
    that.lsLoading = true
    setTimeout(() => {
      that.db.getByKey('lineAndStation').then((res) => {
        if (res.success && res.data) {
          that.options = res.data.stationList
          that.station = JSON.stringify(that.station) == '{}' ? that.options[0] : that.station
          let l = JSON.stringify(that.station) == '{}' ? that.options[0].line : that.station.line
          let s = JSON.stringify(that.station) == '{}' ? that.options[0].station : that.station.station
          that.$store.dispatch('stationSet/setCurrentLine', l)
          that.$store.dispatch('stationSet/setCurrentStation', s)
          that.stationInfo = {
            line: l ? l.Description : '--',
            station: s ? s.Description : '--',
          }
          that.$set(that.form, 'I_LineID', l ? l.ID : null)
          that.$set(that.form, 'I_StationID', s ? s.ID : null)
        }
      })
      that.lsLoading = false
    }, 500)
  },
  beforeDestroy() {
    document.body.style.overflow = 'auto'
  },
  methods: {
    goToMultiObjectDashboard() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true) //标记为公共页面
      this.$router.push({ path: '/multiObjectDashboard' })
    },
    goToEmailServer() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true) //标记为公共页面
      this.$router.push({ path: '/emailServer' })
    },
    handleSetStation() {
      let list = []
      for (let key in this.stationInfo) {
        if (key == 'line') {
          list.push({ title: this.$t('Line'), desc: this.stationInfo[key] })
        } else {
          list.push({ title: this.$t('Station'), desc: this.stationInfo[key] })
        }
      }
      this.$store.dispatch('stationSet/setAnnouncement', list)
    },
    handleStationChange(val) {
      this.$set(this.form, 'I_LineID', val.line ? val.line.ID : null)
      this.$set(this.form, 'I_StationID', val.station ? val.station.ID : null)
      this.$store.dispatch('stationSet/setCurrentLine', val.line)
      this.$store.dispatch('stationSet/setCurrentStation', val.station)
      this.$store.dispatch('stationSet/setActiveConfigManage', val)

      this.stationInfo = {
        line: val.line ? val.line.Description : '--',
        station: val.station ? val.station.Description : '--',
      }
    },
    goToMultiServer() {
      sessionStorage.setItem('isPublicPage', true)
      this.$store.dispatch('user/setIsPublicPage', true) //标记为公共页面
      this.$router.push({ path: '/MultiServerDashboardPage' })
    },
    handleGetTemporaryToken() {
      getToken(
        {
          grant_type: tokenGrantType,
          appid: appId,
          secret: appSecret,
        }
      ).then((res) => {
        if (res.Success) {
          this.$store.dispatch(
            'user/setTemporaryToken',
            `Bearer ${res.ResData.AccessToken}`
          )
        }
      })
    },
    //验证码
    handleCaptcha() {
      this.handleGetTemporaryToken()
      this.$set(this.form, 'vcode', '')
      Captcha().then((res) => {
        if (res.Success) {
          this.captchaImg = `data:image/png;base64,${res.ResData.Img}`
          this.$set(this.form, 'vkey', res.ResData.Key)
        }
      })
    },
    handleCheckedChange(val) {
      this.$store.dispatch('user/setIsAutoLogin', val)
    },

    handleLogin() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          let params = JSON.parse(JSON.stringify(this.form))
          params.password = encryptedData(params.password)
          this.$store
            .dispatch('user/login', params)
            .then((res) => { //返回的是设置好的url
              // this.$store.dispatch('user/setUserTokenName', this.form.username)
              //设置成非公共页面
              sessionStorage.setItem('isPublicPage', false)
              this.$store.dispatch('user/setIsPublicPage', false)
              let routerPath = (this.redirect === '/404' || this.redirect === '/401') ? this.$store.getters['user/asyncPath'] : this.redirect;
              //跳转密码修改
              if (this.form.password === '12345678') {
                let that = this;
                setTimeout(function () {
                  that.$router.push('/modifyPasswordResetLogin').catch(() => { })
                }, 2000)
              }
              //登录成功后的跳转
              this.$router.push(routerPath).catch(() => { })
              this.loading = false
            })
            .catch((error) => {
              this.loading = false
            })
        } else {
          return false
        }
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.station_info {
  span {
    color: #888;
  }
}

.login-container {
  height: 100vh;
  // background: url('~@/assets/login_images/background.png') center center fixed
  //   no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;

  .login_nav {
    position: absolute;
    z-index: 100;
    top: 0;
    text-align: right;
    // border: 1px solid blue;
    line-height: 40px;
    box-sizing: border-box;
    margin: 10px;
    padding: 10px;
    width: 100vw;
    font-size: 16px;

    &>div {
      display: inline-block;
      margin: 0 10px;
      cursor: pointer;
    }

    .login_language {
      // border: 1px solid red;

      // padding: 10px 20px;
      // margin-right: 40px;
    }
  }

  .title {
    font-size: 54px;
    font-weight: 500;
    color: rgba(14, 18, 26, 1);
  }

  .title-tips {
    margin-top: 29px;
    font-size: 26px;
    font-weight: 400;
    color: rgba(14, 18, 26, 1);
    text-overflow: ellipsis;
    white-space: nowrap;
    user-select: none;
  }

  .login-btn {
    display: inherit;
    width: 380px;
    height: 60px;
    margin-top: 5px;
    border: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  .login-form {
    position: relative;
    max-width: 100%;
    margin: calc((100vh - 425px) / 2) -90% 10%;
    overflow: hidden;
    user-select: none;

    .password_tips {
      color: #aaa;
      padding: 15px 0;
    }

    .forget-password {
      width: 100%;
      margin-top: 40px;
      text-align: left;

      .forget-pass {
        width: 129px;
        height: 19px;
        font-size: 20px;
        font-weight: 400;
        color: rgba(92, 102, 240, 1);
      }
    }
  }

  .tips {
    margin-bottom: 10px;
    font-size: $base-font-size-default;
    color: $base-color-white;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .title-container {
    position: relative;

    .title {
      margin: 0 auto 40px auto;
      font-size: 34px;
      font-weight: bold;
      color: $base-color-blue;
      text-align: center;
    }
  }

  .svg-container {
    position: absolute;
    top: 14px;
    left: 15px;
    z-index: $base-z-index;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  .show-password {
    position: absolute;
    top: 14px;
    right: 25px;
    font-size: 16px;
    color: #d7dee3;
    cursor: pointer;
    user-select: none;
  }

  ::v-deep {
    .el-form-item {
      padding-right: 0;
      margin: 20px 0;
      color: #454545;
      background: transparent;
      border: 1px solid #222;
      border-radius: 2px;

      &__content {
        min-height: $base-input-height;
        line-height: $base-input-height;
      }

      &__error {
        position: absolute;
        top: 100%;
        left: 18px;
        font-size: $base-font-size-small;
        line-height: 18px;
        color: $base-color-red;
      }

      .captcha_img {
        cursor: pointer;
        position: relative;
        top: 10px;
      }
    }

    .el-input {
      box-sizing: border-box;

      input {
        height: 58px;
        padding-left: 45px;
        font-size: $base-font-size-default;
        line-height: 58px;
        color: $base-font-color;
        background: #f6f4fc;
        border: 0;
        caret-color: $base-font-color;
      }
    }
  }
}
</style>
