
import Vue from 'vue'

export default Vue.component('AnchoredHeading', {
  props: {
    level: {
      type: Number,
      required: true
    },
    text1: {
      type: String,
      default: () => { return '' },
    }
  },
  render: function (createElement) {
    return createElement(
      'h' + this.level,   // 标签名称
      this.level,
    )
  },
})

