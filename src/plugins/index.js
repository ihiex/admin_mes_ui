/*
 * @Author: Jason.zou jason.zou1986@gmail.com
 * @Date: 2024-03-13 09:25:15
 * @LastEditors: Jason.zou jason.zou1986@gmail.com
 * @LastEditTime: 2024-08-22 16:38:26
 * @FilePath: \NewSFC_Web_UI\src\plugins\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/* 公共引入,勿随意修改 */
import Vue from 'vue'
import './element'
import './support'
import '@/styles/vab.scss'
import '@/remixIcon'
import '@/colorfulIcon'
import '@/config/permission'
import '@/utils/errorLog'
import './vabIcon'
import VabPermissions from 'jason-layouts/Permissions'
import Vab from '@/utils/vab'
import VabCount from 'zx-count'
import ZDrag from '@/directive/z-drag'
import ace from 'ace-builds' //代码编辑器
import { getMoneyFormat } from '@/utils'
import Print from 'vue-print-nb-element'
import './go'
import store from '@/store'
import elTableAutoScroll from '@/directive/auto-scroll'

Vue.use(Vab)
Vue.use(VabPermissions)
Vue.use(VabCount)
Vue.use(ZDrag)
Vue.use(ace)
Vue.use(Print)
Vue.use(elTableAutoScroll)


//如有必要可以将这些全局的方法移置vab.js
Vue.filter('FormatNumber', function (value) {
  // 返回处理后的值
  return getMoneyFormat(value)
})

Vue.filter('AddPerCent', function (value) {
  // 返回处理后的值
  if (isNaN(value) || value === '' || value === null) {
    return value
  }
  return value + '%'
})

Vue.directive(
  'loadMore', {
  bind(el, binding) {
    var p = 0
    var t = 0
    var down = true
    var selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () { //判断是否向下滚动
      p = this.scrollTop
      if (t < p) { down = true }
      else { down = false } t = p //判断是否到底
      const sign = 3
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign && down) { binding.value() }
    })
  }
}
)
//服务器图片url
Vue.prototype.$baseUrl = process.env.NODE_ENV !== 'production' ? '/api/' : process.env.VUE_APP_BASE_URL + '/'

// upload header info
Vue.prototype.$requestHeaders = {
  'Accept-Language': localStorage.getItem('language') ? localStorage.getItem('language') : 'CN',
  'line-id': store.getters['stationSet/currentLine'] ? store.getters['stationSet/currentLine'].ID : '',
  'line-name': encodeURIComponent(store.getters['stationSet/currentLine'] ? store.getters['stationSet/currentLine'].Description : ''),
  'station-id': store.getters['stationSet/currentStation'] ? store.getters['stationSet/currentStation'].ID : '',
  'station-name': encodeURIComponent(store.getters['stationSet/currentStation'] ? store.getters['stationSet/currentStation'].Description : ''),
  'employee-id': store.getters['user/userId'],// ? store.getters['stationSet/currentStation'].ID : ''
  'current-login-ip': store.getters['user/currentLoginIp'],// ? store.getters['stationSet/currentStation'].ID : '' current-login-ip
  'page-uuid': store.getters['pages/pageUuid'],
  'Authorization': store.getters['user/accessToken'],//getAccessToken()
}

//日期格式化
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };
  "".substring()
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substring(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substring(("" + o[k]).length)));
  return fmt;
}
