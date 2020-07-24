/*正式环境配置*/

'use strict';//严格模式
const path = require('path');//node 路径模块（node.js路径处理模块path）
const webpack = require('webpack');//使用webpack
const merge = require('webpack-merge');//引入 webpack-merge 插件，区分生成环境和开发环境

const HtmlWebpackPlugin = require('html-webpack-plugin');//引入在html文件中自动插入css、js文件的插件
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//引入css代码压缩插件
const CopyWebpackPlugin = require('copy-webpack-plugin');//引入文件拷贝插件

const baseConf = require('./webpack.base.conf');//引入webpack.base.conf.js
const prodConfig = require('../config').build;//引入config.js的build参数
const { assetsPath } = require('./utils');//引入utils.js的assetsPath方法
const { entryList } = require('./setting');//引入setting.js的entryList方法
const { rulesList, stylePlugins } = require('./style');//style.js的rulesList、stylePlugins方法

const prodConf = merge(baseConf, {
	//正式环境出口
	output: {
	    publicPath: '',//表示资源的发布地址，当配置过该属性后，打包文件中所有通过相对路径引用的资源都会被配置的路径所替换。
	    filename: assetsPath('/js/[name].[chunkhash].js')
	},
  	devtool: prodConfig.devtool,//生成source-map（使调试更容易）
  	module: {
    	rules: [...rulesList()]
  	},
  	plugins: [
  		new webpack.DefinePlugin({
	      'process.env': require('../config/prod.env')
	    }),
	    new webpack.optimize.UglifyJsPlugin({ //使用js压缩插件
		    parallel: true,
		    compress: {
		        warnings: false
		    }
	    }),
	    new OptimizeCSSPlugin(),//使用css压缩插件
	    new webpack.HashedModuleIdsPlugin(),//插件根据模块的相对路径生成一个hash作为模块id, 建议用于生产环境
	    new webpack.optimize.ModuleConcatenationPlugin(),//这是webpack3的特性，是启用作用域提升，作用是让代码文件更小、运行的更快
		new CopyWebpackPlugin([{ //静态资源输出,将src目录下的common文件夹复制到www目录下
		    from: path.resolve(__dirname, "../src/common/js"),
		    to: 'common/js',
		    ignore: ['.*']
		}]),
	    new webpack.optimize.CommonsChunkPlugin({//这个插件提取的公共包，每次是会重新打包的（Etag会不同），无论是节约打包时间，还是对浏览器缓存的利用都不是好的方案。最佳方案：DllPlugin
	      	name: 'common',
	      	minChunks: 2
	    }),
	    ...stylePlugins
	]
});
module.exports = prodConf;
