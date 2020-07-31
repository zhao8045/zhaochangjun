// use 'strict'

const path = require('path')

module.exports = {
	//测试环境时构建参数
  	dev: {
		assetsSubDirectory: 'static',
		assetsPath: '/',
		// secure: false,  // 如果是https接口，需要配置这个参数
		proxyTable: {
			'/api': {
				target: 'http://192.168.0.15:8080/', // 后端接口地址
				// target: 'http://192.168.0.140:32450/', // 后端接口地址
				// target: 'http://26t13m1315.wicp.vip:32451/', // 后端接口地址
				// target: 'https://www.gzchain.org.cn/managersvc/', // 后端接口地址
				changeOrigin: true, //允许跨域
				pathRewrite: { // 路径重写，
					'^/api': '/' // 这里理解成用‘/api’代替target里面的地址，比如我要调用'http://127.0.0.1:8080/TransServlet'，直接写‘/api/TransServlet’即可
				}
			}
		},
		
	    host: 'localhost',//域名
	    port: 8082,//端口
		autoOpenBrowser: false,//自动用默认的浏览器打开开发的网页
		errorOverlay: true,//浏览器页面上显示错误
		notifyOnErrors: true,
		poll: false,
	    devtool: 'cheap-module-eval-source-map',//这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它
		cacheBusting: true,
		cssSourceMap: true
  	},
  	//正式环境时构建参数
  	build: {
		assetsRoot: path.resolve(__dirname, '../www'),//返回一个相对于当前的工作目录的绝对路径
	    assetsSubDirectory: './', //static
		assetsPath: './',
		productionSourceMap: true,
		devtool: false,//不生成source-map
		productionGzip: false,
		productionGzipExtensions: ['js', 'css'],
		bundleAnalyzerReport: process.env.npm_config_report
  	}
};
