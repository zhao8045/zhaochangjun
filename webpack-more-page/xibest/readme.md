# 使用 webpack 构建多页面应用

在一些场景下,webpack+vue2.x单页应用显然无法满足我们的需求,于是便有了使用 webpack构建多页面应用

## 文件结构

```javascript

├── build                       	构建服务和webpack配置
  ├──── build.js                  构建全量压缩包 (打包项目)
  ├──── setting.js                多页面入口配置
  ├──── style.js                  页面1对1抽取生成css文件
  ├──── utils.js                  工具类
  ├──── webpack.base.conf.js      webpack通用配置
  ├──── webpack.dev.conf.js       webpack开发环境配置
  ├──── webpack.prod.conf.js      webpack生产环境配置
├── config                      	webpack开发/生产环境部分配置
├── www                        		项目打包目录
├── package.json                	项目配置文件
├── src                         	项目目录
├──── common                    	多页面公用方法与css
├──── about                     	about页面
├──── home                      	home页面

```

## 思路

多页面应用,顾名思义:就是有多个页面

1.多个入口(entry),每个页面对应一个入口,理解为 js 资源.
2.多个 html 实例,webpack 使用[html-webpack-plugin]插件来生成 html 页面.
3.每个页面需要对应的 css 文件.webpack 使用[extract-text-webpack-plugin]抽取 css.

这样我们一个多页面应用该有的东西都具备了!



