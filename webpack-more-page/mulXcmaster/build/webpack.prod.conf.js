/*正式环境配置*/

'use strict';//严格模式

const path = require('path');//node 路径模块
const utils = require('./utils');//工具类方法
const webpack = require('webpack');//使用webpack
const config = require('../config');//config配置
const merge = require('webpack-merge');//引入 webpack-merge 插件，区分生成环境和开发环境
const baseWebpackConfig = require('./webpack.base.conf');//引入webpack.base.conf.js
const CopyWebpackPlugin = require('copy-webpack-plugin');//webpack 拷贝插件
const HtmlWebpackPlugin = require('html-webpack-plugin');//在html文件中自动引入js、css文件
const ExtractTextPlugin = require('extract-text-webpack-plugin');//抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');//引入css代码压缩插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');//使用uglify-js进行js文件的压缩

const env = require('../config/prod.env')

const { rulesList, stylePlugins } = require('./style');//style.js的rulesList、stylePlugins方法

const webpackConfig = merge(baseWebpackConfig, {
	module: {
		rules: [...rulesList()]
	},
	devtool: config.build.productionSourceMap ? config.build.devtool : false,//生成source-map（使调试更容易）
	
	//正式环境出口
	output: {
		path: config.build.assetsRoot, //所有输出文件的目标路径，必须是绝对路径
	    filename: utils.assetsPath('/js/[name].[chunkhash].js')
	},
  	
  	plugins: [
		new webpack.DefinePlugin({
		  'process.env': env
		}),
		new UglifyJsPlugin({//使用js压缩插件
		  uglifyOptions: {
			compress: {
			  warnings: false
			}
		  },
		  sourceMap: config.build.productionSourceMap,
		  parallel: true
		}),
		// new ExtractTextPlugin({//使用抽离css样式插件
		//   filename: utils.assetsPath('css/[name].[contenthash].css'),
		//   allChunks: true,
		// }),
		...stylePlugins,//使用抽离css样式插件
		new OptimizeCSSPlugin({//使用css压缩插件
		  cssProcessorOptions: config.build.productionSourceMap
			? { safe: true, map: { inline: false } }
			: { safe: true }
		}),
		
	    
	    new webpack.HashedModuleIdsPlugin(),//插件根据模块的相对路径生成一个hash作为模块id, 建议用于生产环境
	    new webpack.optimize.ModuleConcatenationPlugin(),//这是webpack3的特性，是启用作用域提升，作用是让代码文件更小、运行的更快
		
		// new webpack.optimize.CommonsChunkPlugin({
		//   name: 'manifest',
		//   minChunks: Infinity
		// }),
		// new webpack.optimize.CommonsChunkPlugin({
		//   name: 'vendor',
		//   minChunks(module) {
		// 	return (
		// 	  module.resource &&
		// 	  /\.js$/.test(module.resource) &&
		// 	  module.resource.indexOf(
		// 		path.join(__dirname, '../node_modules')
		// 	  ) === 0
		// 	)
		//   }
		// }),
	    new webpack.optimize.CommonsChunkPlugin({//这个插件提取的公共包，每次是会重新打包的（Etag会不同），无论是节约打包时间，还是对浏览器缓存的利用都不是好的方案。最佳方案：DllPlugin
	      	name: 'common',
			// async: 'vendor-async',
			// children:true,
			minChunks:2
	    }),
		
		new CopyWebpackPlugin([{ //静态资源输出,将src目录下的common文件夹复制到www目录下
		    from: path.resolve(__dirname, "../src/common/js"),
		    to: 'common/js',
		    ignore: ['.*']
		}])
	]
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')
  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig;
