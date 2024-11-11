import drag from './drag'
import leftDrag from './leftDrag'
import rightDrag from './rightDrag'
import topDrag from './topDrag'
import bottomDrag from './bottomDrag'

let install = function (Vue) {
/*   Vue.directive('drag', drag)
  Vue.directive('leftDrag', leftDrag)
  Vue.directive('bottomDrag', bottomDrag) */
  Vue.directive('rightDrag', rightDrag)
  Vue.directive('topDrag', topDrag)
}

if (window.Vue) {
/*   window['drag'] = drag
  window['leftDrag'] = leftDrag
  window['bottomDrag'] = bottomDrag */
  window['rightDrag'] = rightDrag
  window['topDrag'] = topDrag
  Vue.use(install); // eslint-disable-line
}

export default install
