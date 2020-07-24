module.exports = {
	//测试环境时构建参数
  	dev: {
	    host: 'localhost',//域名
	    port: 8082,//端口
	    devtool: 'cheap-module-eval-source-map'//这是在打包文件时最快的生成source map的方法，生成的Source Map 会和打包后的JavaScript文件同行显示，没有列映射，和eval-source-map选项具有相似的缺点；对小到中型的项目中，eval-source-map是一个很好的选项，再次强调你只应该开发阶段使用它
  	},
  	//正式环境时构建参数
  	build: {
	    devtool: false,//不生成source-map
	    assetsPath: './'
  	}
};
