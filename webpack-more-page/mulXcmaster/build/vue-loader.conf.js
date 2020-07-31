/*vue-loader配置*/

'use strict'

const utils = require('./utils');//工具类方法
const config = require('../config');//config配置

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction ? config.build.productionSourceMap : config.dev.cssSourceMap

module.exports = {
  loaders: utils.cssLoaders({
    sourceMap: sourceMapEnabled,
    extract: isProduction
  }),
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
