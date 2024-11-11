/**
 * @author Jason.zou 305043598@qq.com
 * @description 公共布局及样式自动引入
 */

import Vue from 'vue'

let requireComponents = require.context('./components', true, /\.vue$/)
requireComponents.keys().forEach((fileName) => {
  let componentConfig = requireComponents(fileName)
  let componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})

let requireZxLayouts = require.context('jason-layouts', true, /\.vue$/)
requireZxLayouts.keys().forEach((fileName) => {
  let componentConfig = requireZxLayouts(fileName)
  let componentName = componentConfig.default.name
  Vue.component(componentName, componentConfig.default || componentConfig)
})
//批量入引scss
let requireThemes = require.context('@/styles/themes', true, /\.scss$/)
requireThemes.keys().forEach((fileName) => {
  require(`@/styles/themes/${fileName.slice(2)}`)
})
