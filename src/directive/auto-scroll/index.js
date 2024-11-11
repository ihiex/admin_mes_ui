/*
 * @Author: Jason.zou jason.zou1986@gmail.com
 * @Date: 2024-09-23 16:35:28
 * @LastEditors: Jason.zou jason.zou1986@gmail.com
 * @LastEditTime: 2024-09-23 16:37:14
 * @FilePath: \NewSFC_Web_UI\src\directive\auto-scroll\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import elTableScroll from './elTableScroll'

let install = function(Vue) {
  Vue.directive('elTableAutoScroll', elTableScroll)
}

if (window.Vue) {
  window['elTableAutoScroll'] = elTableScroll
  Vue.use(install); // eslint-disable-line
}

export default install
