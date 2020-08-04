/*入口配置与html生成配置*/

'use strict';//严格模式

const path = require('path');//引入node路径模块
const utils = require('./utils');//工具类方法
const config = require('../config');//config配置
const vueLoaderConfig = require('./vue-loader.conf');//vue-loader配置
const VueLoaderPlugin = require('vue-loader/lib/plugin');//vue-loader插件
const { entryList, pageList } = require('./setting.js');//引入setting.js 入口配置方法,与html生成配置

module.exports = {
  entry: entryList(),//入口生成配置
  output: {
	filename: '[name].[hash].js',//使用占位符来确保每个文件具有唯一的名称
    path: config.build.assetsRoot, //所有输出文件的目标路径，必须是绝对路径
	publicPath: process.env.NODE_ENV === 'production'? config.build.assetsPublicPath: config.dev.assetsPublicPath // 输出解析文件的目录，url 相对于 HTML 页面
  },
  resolve: { // 解析模块请求的选项
    extensions: ['.js', '.json', ".vue"],// 使用的扩展名
    alias: {// 模块别名列表
	  'vue': 'vue/dist/vue.min.js',
      '@': utils._resolve('../src'),
      'common': utils._resolve('../src/common')
    }
  },
  module: {
    rules: [ // 模块规则（配置 loader、解析器等选项）
	  {
		test: /\.(htm|html)$/i,// 对 html后缀名进行处理
		loader: 'html-withimg-loader',//用html-withimg-loader处理在html中引入图片的问题
		include: utils._resolve('../src') //只处理src文件夹中的html文件
	  },
	  {
		test: /\.vue$/, // 对 vue后缀名进行处理
		loader: 'vue-loader',//用vue-loader
		options: vueLoaderConfig //vue-loader配置
	  },
      { 
      	test: /\.js$/,// 对 js 后缀名进行处理
      	use: 'babel-loader', //用bable-loader对es6、es7语法编译转换
      	include: [utils._resolve('../src'), utils._resolve('node_modules/webpack-dev-server/client')] //只处理src文件夹和node_modules/webpack-dev-server/client中的js文件
      }, 
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,// 对 图片文件 后缀名进行处理
        loader: 'url-loader',
        options: {
          limit: 10000,//文件大小限制，小于这个时将会用base64位图片打包处理
          name: utils.assetsPath('img/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,// 对 视频、音频文件 后缀名进行处理
        loader: 'url-loader',
        options: {
          limit: 10000,//文件大小限制
          name: utils.assetsPath('media/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,// 对 字体图标文件 后缀名进行处理
        loader: 'url-loader',
        options: {
        // limit: 10000,//文件大小限制(加上限制正式环境会显示不出来)
          name: utils.assetsPath('fonts/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      }
    ]
  },
  node: {
	  //阻止webpack因为Vue源包含它而注入无用的setImmediate polyfill（尽管它只有在是本机的情况下才使用）
	  //阻止webpack向对客户端没有意义的节点注入本机模块模拟数据
	  setImmediate: false,
	  dgram: 'empty',
	  fs: 'empty',
	  net: 'empty',
	  tls: 'empty',
	  child_process: 'empty'
  },
  plugins: [new VueLoaderPlugin(),...pageList()]// 附加插件列表
};
