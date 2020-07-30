/*测试环境配置*/

'use strict';//严格模式
const path = require('path');//node 路径模块
const webpack = require('webpack');//使用webpack
const merge = require('webpack-merge');//引入 webpack-merge 插件，区分生成环境和开发环境
const notifier = require('node-notifier');//引入节点通知模块

const HtmlWebpackPlugin = require('html-webpack-plugin');//引入生成html文件插件（在html文件中自动引入js、css文件）
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');//编译提示插件

const baseConf = require('./webpack.base.conf');//引入webpack.base.conf.js
const devConfig = require('../config').dev;//引入config下index.js的dev方法

const devConf = merge(baseConf, {
	//测试环境出口
  output: {
    publicPath: '',
    filename: '[name].[hash].js'
  },
  devtool: devConfig.devtool,//生成source-map（使调试更容易）
  devServer: {
  	contentBase: "./",// 配置DevServer服务器的文件根目录，默认为当前执行目录，一般不必设置它，除非有额外的文件需要被DevServer服务。我们设在当前目录即可
	historyApiFallback:false,//如果为true所有跳转将指向index.html（这会导致任何请求都会返回index.html文件，这用于只有一个HTML文件的单页应用。）
    clientLogLevel: 'info',//配置在客户端的日志等级，这会影响到你在控制台里看到的日志内容。clientLogLevel 是枚举类型，可取如下之一的值 none | error | warning | info。 默认为 info 级别，即输出所有类型的日志，设置成 none 可以不输出任何日志。
//  https:true,//DevServer 默认使用 HTTP 协议服务，它也能通过 HTTPS 协议服务, 有些情况下你必须使用 HTTPS
    inline: true,//用来支持DevServer自动刷新的配置（源文件改变时自动刷新页面）
    hot: true,//是否启用模块热替换功能，DevServer默认的行为是在发现源代码被更新后会通过自动刷新整个页面来做到实现预览，开启模块热替换功能后在不刷新整个页面的情况下通过用新模块替换老模块来实现实时预览
    open: false,//用于在 DevServer 启动且第一次构建完时自动用你系统上默认的浏览器去打开要开发的网页。 同时还提供 devServer.openPage 配置项用于打开指定 URL 的网页。
    host: devConfig.host,//配置DevServer服务器监听的地址。如果你想要局域网中其他设备访问你本地的服务，可以在启动的时候带上--host 0.0.0.0.host的默认值是127.0.0.1即只有本地可以访问
    port: devConfig.port,//配置DevServer服务监听的端口，默认使用8080端口。如果8080端口已经被其他程序占有就使用8081....
    compress: true,//配置是否启用 gzip 压缩，默认为 false。
    overlay: {//浏览器页面上显示错误
      errors: true,//错误提示
      warnings: false//警告提示
    },
    quiet: true//配置属性和devServer.stats属于同一类型的配置属性当它被设置为true的时候，控制台只输出第一次编译的信息，当你保存后再次编译的时候不会输出任何内容，包括错误和警告
  },
  module: {
    rules: [
      {
        test: /\.css$/,// 对 css 后缀名进行处理
        use: [
          'style-loader',//编译后用style-loader来提取css文件
          {
            loader: 'css-loader',//用css-loader去编译css文件
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',//用postcss-loader自动为不同的浏览器添加对应的前缀
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.less$/,// 对 less 后缀名进行处理
        use: [
          'style-loader',//编译后用style-loader来提取less文件
          {
            loader: 'css-loader',//用css-loader去编译less文件
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',//用less-loader去转换less文件为css文件
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',//用postcss-loader自动为不同的浏览器添加对应的前缀
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new FriendlyErrorsPlugin({
      //编译成功提示！
      compilationSuccessInfo: {
        messages: [`Your application is running here: http://${devConfig.host}:${devConfig.port}`]
      },
      //编译出错！
      onErrors: function(severity, errors) {
        if (severity !== 'error') {
          return;
        }
        const error = errors[0];
        const filename = error.file.split('!').pop();
        //编译出错时,右下角弹出错误提示！
        notifier.notify({
          title: 'mu-cli',
          message: severity + ': ' + error.name,
          subtitle: filename || ''
        });
      }
    })
  ]
});
module.exports = devConf;
