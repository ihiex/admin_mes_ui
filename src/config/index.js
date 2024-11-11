/**
 * @description 3个子配置，通用配置|主题配置|网络配置导出
 */
let setting = require('./setting.config')
let theme = require('./theme.config')
let network = require('./net.config')
let pageSetting = require('./page.config')
module.exports = Object.assign({}, setting, theme, network, pageSetting)
