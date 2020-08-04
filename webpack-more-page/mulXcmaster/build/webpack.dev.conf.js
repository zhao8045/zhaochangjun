/*测试环境配置*/

'use strict';//严格模式

const utils = require('./utils');//工具类方法
const webpack = require('webpack');//使用webpack
const config = require('../config');//config配置
const merge = require('webpack-merge');//引入 webpack-merge 插件，区分生成环境和开发环境
const path = require('path');//node 路径模块
const baseWebpackConfig = require('./webpack.base.conf');//引入webpack.base.conf.js
const CopyWebpackPlugin = require('copy-webpack-plugin');//webpack 拷贝插件
const HtmlWebpackPlugin = require('html-webpack-plugin');//在html文件中自动引入js、css文件
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');//编译提示插件
const portfinder = require('portfinder');//自动获取端口

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const { rulesList, stylePlugins } = require('./style');//style.js的rulesList、stylePlugins方法

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
	// rules: [...rulesList()]
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  devtool: config.dev.devtool,//生成source-map（使调试更容易）
  devServer: {
	clientLogLevel: 'warning',//配置在客户端的日志等级，这会影响到你在控制台里看到的日志内容。clientLogLevel 是枚举类型，可取如下之一的值 none | error | warning | info。 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志。
    historyApiFallback:false,//如果为true所有跳转将指向index.html（这会导致任何请求都会返回index.html文件，这用于只有一个HTML文件的单页应用。）
	hot: true,//是否启用模块热替换功能，DevServer默认的行为是在发现源代码被更新后会通过自动刷新整个页面来做到实现预览，开启模块热替换功能后在不刷新整个页面的情况下通过用新模块替换老模块来实现实时预览
	contentBase: false, //配置DevServer服务器的文件根目录，默认为当前执行目录，一般不必设置它，除非有额外的文件需要被DevServer服务。我们设在当前目录即可，因为我们使用CopyWebpackPlugin)
  	compress: true,//配置是否启用 gzip 压缩，默认为 false。
    
  //  https:true,//DevServer 默认使用 HTTP 协议服务，它也能通过 HTTPS 协议服务, 有些情况下你必须使用 HTTPS
    inline: true,//用来支持DevServer自动刷新的配置（源文件改变时自动刷新页面）
    host: HOST || config.dev.host,//配置DevServer服务器监听的地址。如果你想要局域网中其他设备访问你本地的服务，可以在启动的时候带上--host 0.0.0.0.host的默认值是127.0.0.1即只有本地可以访问
    port: PORT || config.dev.port,//配置DevServer服务监听的端口，默认使用8080端口。如果8080端口已经被其他程序占有就使用8081....
    open: config.dev.autoOpenBrowser,//用于在 DevServer 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。 同时还提供 devServer.openPage 配置项用于打开指定 URL 的网页。
    overlay: config.dev.errorOverlay ? { warnings: false, errors: true } : false,//浏览器页面上显示错误
	publicPath: config.dev.assetsPublicPath,//输出解析文件的目录
	proxy: config.dev.proxyTable,//设置代理
    quiet: true,//配置属性和devServer.stats属于同一类型的配置属性,当它被设置为true的时候，控制台只输出第一次编译的信息，当你保存后再次编译的时候不会输出任何内容，包括错误和警告(友好错误提示所必需的)
	watchOptions: {
	  poll: config.dev.poll,
	}
  },
	
  plugins: [
    new webpack.DefinePlugin({
	  'process.env': require('../config/dev.env')
	}),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),//HMR在更新时在控制台中显示正确的文件名
	new webpack.NoEmitOnErrorsPlugin()
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
	if (err) {
	  reject(err)
	} else {
	  process.env.PORT = port // 发布e2e测试所需的新端口
	  devWebpackConfig.devServer.port = port // 将端口添加到devServer配置
	  // 添加 FriendlyErrorsPlugin插件
	  devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
		//编译成功提示！  
		compilationSuccessInfo: {
		  messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
		},
		onErrors: config.dev.notifyOnErrors ?
		  utils.createNotifierCallback() : undefined
	  }))

	  resolve(devWebpackConfig)
	}
  })
})
