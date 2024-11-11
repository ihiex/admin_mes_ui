/**
 * @author Jason.zou 305043598@qq.com
 * @description 代码生成机
 */
let viewGenerator = require('zx-templates/view/prompt')
let curdGenerator = require('zx-templates/curd/prompt')
let componentGenerator = require('zx-templates/component/prompt')
let mockGenerator = require('zx-templates/mock/prompt')
let vuexGenerator = require('zx-templates/vuex/prompt')
module.exports = (plop) => {
  plop.setGenerator('view', viewGenerator)
  plop.setGenerator('curd', curdGenerator)
  plop.setGenerator('component', componentGenerator)
  plop.setGenerator('mock&api', mockGenerator)
  plop.setGenerator('vuex', vuexGenerator)
}
