let { Random } = require('mockjs')
let { join } = require('path')
let fs = require('fs')

/**
 * @author Jason.zou 305043598@qq.com
 * @description 随机生成图片url。
 * @param width
 * @param height
 * @returns {string}
 */
function handleRandomImage(width = 50, height = 50) {
  return `https://picsum.photos/${width}/${height}?random=${Random.guid()}`
}

/**
 * @author Jason.zou 305043598@qq.com
 * @description 处理所有 controller 模块，npm run serve时在node环境中自动输出controller文件夹下Mock接口，请勿修改。
 * @returns {[]}
 */
function handleMockArray() {
  let mockArray = []
  let getFiles = (jsonPath) => {
    let jsonFiles = []
    let findJsonFile = (path) => {
      let files = fs.readdirSync(path)
      files.forEach((item) => {
        let fPath = join(path, item)
        let stat = fs.statSync(fPath)
        if (stat.isDirectory() === true) findJsonFile(item)
        if (stat.isFile() === true) jsonFiles.push(item)
      })
    }
    findJsonFile(jsonPath)
    jsonFiles.forEach((item) => mockArray.push(`./controller/${item}`))
  }
  getFiles('mock/controller')
  return mockArray
}
module.exports = {
  handleRandomImage,
  handleMockArray,
}
