/*工具类方法*/

'use strict'

const path = require('path');//node 路径模块
const config = require('../config');//config配置
const ExtractTextPlugin = require('extract-text-webpack-plugin');//提取CSS插件
const packageConfig = require('../package.json');//依赖

exports._resolve=function(_path){
	return path.resolve(__dirname, _path) //返回一个相对于当前的工作目录的绝对路径
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ? config.build.assetsSubDirectory : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path) //将路径片段进行拼接
}

exports.cssLoaders = function (options) {
  options = options || {}
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  //生成要与提取文本插件一起使用的加载程序字符串
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]
    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
	
	//指定该选项时提取CSS
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        publicPath: '../',
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

//为独立样式文件生成加载程序（在.vue之外）
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }
  return output
}

//创建通知程序回调
exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')
  return (severity, errors) => {
    if (severity !== 'error') return
    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()
    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
