/*入口配置与html生成配置*/


'use strict';//严格模式
const path = require('path');//引入node路径模块
const webpack = require('webpack');//引入webpack
const HtmlWebpackPlugin = require('html-webpack-plugin');//引入生成html文件插件（在html文件中自动引入js、css文件）
const { _resolve, assetsPath } = require('./utils');//工具类提取_resolve,assetsPath方法
const { entryList, pageList } = require('./setting.js');//引入setting.js 入口配置方法,与html生成配置
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const baseConf = {
  entry: entryList(),//入口生成配置
  output: {
    path: _resolve('../www')//出口路径配置
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
	  'vue': 'vue/dist/vue.min.js',
      '@': _resolve('../src'),
      common: _resolve('../src/common')
    }
  },
  module: {
    rules: [
	  {
		test: /\.vue$/,
		loader: 'vue-loader'
	  },
      { 
      	test: /\.js$/,// 对 js 后缀名进行处理
      	use: 'babel-loader', //用bable-loader对es6、es7语法编译转换
      	include: _resolve('../src') //只处理src文件夹中的js文件
      }, 
      {
		test: /\.(htm|html)$/i,// 对 html后缀名进行处理
		loader: 'html-withimg-loader',//用html-withimg-loader处理在html中引入图片的问题
		  include: _resolve('../src') //只处理src文件夹中的html文件
		},
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,// 对 图片文件 后缀名进行处理
        loader: 'url-loader',
        options: {
          limit: 8,//文件大小限制，小于这个时将会用base64位图片打包处理
          name: assetsPath('img/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      },
      {
        test: /\.(woff2?|woff|eot|svg|ttf|otf)(\?.*)?$/,// 对 字体图标文件 后缀名进行处理
        loader: 'url-loader',
        options: {
//        limit: 8192,//文件大小限制(加上限制正式环境会显示不出来)
          name: assetsPath('fonts/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,// 对 视频、音频文件 后缀名进行处理
        loader: 'url-loader',
        options: {
          limit: 8,//文件大小限制
          name: assetsPath('media/[name].[hash:8].[ext]')// 打包生成文件的名字
        }
      }
    ]
  },
  plugins: [...pageList(),new VueLoaderPlugin()]//html生成配置
};
module.exports = baseConf;
