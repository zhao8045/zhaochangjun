# 说明文档

------------------------
# 使用 webpack 构建多页面应用

在一些场景下,webpack+vue2.x单页应用显然无法满足我们的需求,于是便有了使用 webpack构建多页面应用

# 思路

多页面应用,顾名思义:就是有多个页面

1.多个入口(entry),每个页面对应一个入口,理解为 js 资源.
2.多个 html 实例,webpack 使用[html-webpack-plugin]插件来生成 html 页面.
3.每个页面需要对应的 css 文件.webpack 使用[extract-text-webpack-plugin]抽取 css.

这样我们一个多页面应用该有的东西都具备了!

# 目录结构
------------------------

```bash
├── build                         	# 项目构建(webpack)相关配置
│	├──── build.js                  构建全量压缩包 (打包项目)
│	├──── setting.js                多页面入口配置
│	├──── style.js                  页面1对1抽取生成css文件
│	├──── utils.js                  工具类
│	├──── webpack.base.conf.js      webpack通用配置
│	├──── webpack.dev.conf.js       webpack开发环境配置
│	├──── webpack.prod.conf.js      webpack生产环境配置
├── config                        	# 项目开发环境配置
├── src                           	# 源码目录
│	├──── common                    多页面公用方法与css
│	├──── about                     about页面
│	├──── home                      home页面
│	├──── index                     index页面
├── www                        	  	# 编译生成文件目录
├── .babelrc          				# ES6语法编译配置
├── .gitignore        				# git忽略文件
├── npm_run_build.bat        		# 打包编译快捷工具
├── npm_run_dev.bat     			# 启动服务快捷工具
├── package.json                   	# 项目依赖
├── package-lock.json 				# 项目依赖
├── .postcss.config.js     			# css前缀
└── README.md         				# 项目文档
```

# 构建（Build Setup）

```bash
# 进入项目目录
cd project

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖（会有各种诡异的 bug）。可以通过如下设置淘宝镜像的方式解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 [http://localhost:8082](http://localhost:8082)

# 发布

```bash
# 构建生产环境
npm run build
```