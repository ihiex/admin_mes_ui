/**
 * @author Jason.zou 305043598@qq.com
 * @description 判读是否为外链
 * @param path
 * @returns {boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 校验密码是否小于6位
 * @param str
 * @returns {boolean}
 */
export function isPassword(str) {
  return str.length >= 6
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否为数字
 * @param value
 * @returns {boolean}
 */
export function isNumber(value) {
  let reg = /^[0-9]*$/
  return reg.test(value)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是名称
 * @param value
 * @returns {boolean}
 */
export function isName(value) {
  let reg = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/
  return reg.test(value)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否为IP
 * @param ip
 * @returns {boolean}
 */
export function isIP(ip) {
  let reg =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/
  return reg.test(ip)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是传统网站
 * @param url
 * @returns {boolean}
 */
export function isUrl(url) {
  let reg =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是小写字母
 * @param str
 * @returns {boolean}
 */
export function isLowerCase(str) {
  let reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是大写字母
 * @param str
 * @returns {boolean}
 */
export function isUpperCase(str) {
  let reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是大写字母开头
 * @param str
 * @returns {boolean}
 */
export function isAlphabets(str) {
  let reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是字符串
 * @param str
 * @returns {boolean}
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是数组
 * @param arg
 * @returns {arg is any[]|boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是端口号
 * @param str
 * @returns {boolean}
 */
export function isPort(str) {
  let reg =
    /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是手机号
 * @param str
 * @returns {boolean}
 */
export function isPhone(str) {
  let reg = /^1\d{10}$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是身份证号(第二代)
 * @param str
 * @returns {boolean}
 */
export function isIdCard(str) {
  let reg =
    /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否是邮箱
 * @param str
 * @returns {boolean}
 */
export function isEmail(str) {
  let reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否中文
 * @param str
 * @returns {boolean}
 */
export function isChina(str) {
  let reg = /^[\u4E00-\u9FA5]{2,4}$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否为空
 * @param str
 * @returns {boolean}
 */
export function isBlank(str) {
  return (
    str == null ||
    false ||
    str === '' ||
    str.trim() === '' ||
    str.toLocaleLowerCase().trim() === 'null'
  )
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否为固话
 * @param str
 * @returns {boolean}
 */
export function isTel(str) {
  let reg =
    /^(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/
  return reg.test(str)
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 判断是否为数字且最多两位小数
 * @param str
 * @returns {boolean}
 */
export function isNum(str) {
  let reg = /^\d+(\.\d{1,2})?$/
  return reg.test(str)
}
