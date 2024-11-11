import Vue from 'vue'
import App from './App'
import store from './store'
import router from './router/index.js'
import './plugins'
import '@/layouts/export'
import i18n from '@/language/index.js'
import permission from '@/directive/permission'
// import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/icon.css'
import '@/assets/scss/element-global.scss'


/**
 * @author Jason.zou 305043598@qq.com
 * @description 开发环境默认都使用mock，如果正式用于生产环境时，记得去掉
 */

/* if (process.env.NODE_ENV === 'development') {
  let { mockXHR } = require('@/utils/static')
  mockXHR()
} */

Vue.config.productionTip = false
Vue.use(permission)

new Vue({
  el: '#Cosmo',
  router,
  store,
  i18n,
  render: (h) => h(App),
})

/* sockjs-client 待起用 */

// window.onbeforeunload = function () {
//   sessionStorage.setItem('userId', store.getters['user/userId'] || sessionStorage.getItem('userId'))
// }
