import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'// svg component

// register globally
Vue.component('SvgIcon', SvgIcon)

let req = require.context('./svg', false, /\.svg$/)
let requireAll = requireContext => requireContext.keys().map(requireContext)
requireAll(req)
