module.exports = {
	//测试环境时构建参数
  	dev: {
  		// Paths
	    assetsSubDirectory: 'static',
	    assetsPublicPath: '/',
  		proxyTable: {
	    	'/api1': {
				target: 'https://jiudiansc.cc:8443/',	//设置你调用的接口域名和端口号 别忘了加http
//	      		target: 'http://192.168.0.33:8082/',	//设置你调用的接口域名和端口号 别忘了加http
				secure: false,//接受使用https
	        	changeOrigin: true,//允许跨域
	        	pathRewrite: {
	            	'^/api1': '/'	//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://192.168.0.52:8080/TransServlet'，直接写‘/api/TransServlet’即可
	        	}
	    	},
	    	'/api2': {
		        target: 'http://www.atm.ceo/',	
		        changeOrigin: true,
		        secure: false,
		        pathRewrite: {
		          '^/api2': '/'
		        }
	    	},
	    	'/api3': {
		        target: 'https://114.116.88.62/',	
		        changeOrigin: true,
		        secure: false,
		        pathRewrite: {
		          '^/api3': '/'
		        }
	    	},
	    	'/api4': {
		        target: 'https://114.116.68.154/',
		        changeOrigin: true,
		        secure: false,
		        pathRewrite: {
		          '^/api4': '/'
		        }
		    }
	    },
  		
	    host: 'localhost',//域名
	    port: 8081,//端口
	    autoOpenBrowser: true,//自动打开浏览器
	    errorOverlay: true,//浏览器页面上显示错误
    	notifyOnErrors: true,
	    poll: false,
	    devtool: 'cheap-module-eval-source-map'//这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它
  	},
  	//正式环境时构建参数
  	build: {
	    devtool: false,//不生成source-map
	    assetsPath: './'
  	}
};
