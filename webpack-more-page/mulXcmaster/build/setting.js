/*多页面入口配置与 html 页面生成*/

'use strict';//严格模式

const path = require('path');//node 路径模块
const fs = require('fs');//node 文件操作模块
const utils = require('./utils');//工具类方法
const HtmlWebpackPlugin = require('html-webpack-plugin');//在html文件中自动引入js、css文件的插件

const entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home,index]
const rFiles = entryFiles.filter(v => v != 'common');//入口文件过滤掉common文件夹(因为common文件夹我们用来存放多页面之间公用的方法与css等资源,所以不放入入口进行构建!)


module.exports = {
  //构建webpack入口
  entryList: () => {
    const entryList = {};
    rFiles.map(v => {
      entryList[v] = utils._resolve(`../src/${v}/${v}.js`);
    });
    return entryList;
  },
  
  //src文件夹下的文件夹名称 ->[about,common,home,index]
  entryFiles: entryFiles,
  
  //使用html-webpack-plugin生成多个html页面.=>[home.html,about.html,index.html]
  pageList: () => {
    const pageList = [];
    rFiles.map(v => {
      pageList.push(
        new HtmlWebpackPlugin({
          template: utils._resolve(`../src/${v}/${v}.html`),//来源html
          filename: utils._resolve(`../www/${v}.html`),//生成的html
          favicon: './src/common/favicon.ico', // 添加favicon小图标
          chunks: ['manifest','vendor','common', v],//需要引入的Chunk，不配置就会引入所有页面的资源
          //压缩配置
          minify: {
			removeComments: true,//去除Html注释
          	collapseWhitespace: true,//合并空格
			removeAttributeQuotes: true,//去除属性引号
			removeEmptyAttributes: true//去除空的属性
          },
          chunksSortMode: 'dependency'
        })
      );
    });
    return pageList;
  }
};
