/*多页面入口配置与 html 页面生成*/


const fs = require('fs');//node 文件操作模块
const path = require('path');//node 路径模块
const entryFiles = fs.readdirSync(path.resolve(__dirname, '../src'));//使用node.js 的文件操作模块来获取src文件夹下的文件夹名称 ->[about,common,home,index]
const HtmlWebpackPlugin = require('html-webpack-plugin');//在html文件中自动引入js、css文件的插件
const { _resolve } = require('./utils');//工具类提取_resolve方法
const rFiles = entryFiles.filter(v => v != 'common');//入口文件过滤common文件夹(因为common文件夹我们用来存放多页面之间公用的方法与css,所以不放入入口进行构建!)


module.exports = {
  //构建webpack入口
  entryList: () => {
    const entryList = {};
    rFiles.map(v => {
      entryList[v] = _resolve(`../src/${v}/${v}.js`);
    });
    return entryList;
  },
  
  //src文件夹下的文件夹名称 ->[about,common,home]
  entryFiles: entryFiles,
  
  //使用html-webpack-plugin生成多个html页面.=>[home.html,about.html]
  pageList: () => {
    const pageList = [];
    rFiles.map(v => {
      pageList.push(
        new HtmlWebpackPlugin({
          template: _resolve(`../src/${v}/${v}.html`),//来源html
          filename:_resolve(`../www/${v}.html`),//生成的html
          favicon: './src/common/favicon.ico', // 添加favicon小图标
          chunks: ['common', v],//需要引入的Chunk，不配置就会引入所有页面的资源
          
          //压缩配置
          minify: {
			collapseWhitespace: true,//合并空格
			removeAttributeQuotes: true,//去除属性引号
			removeComments: true,//去除Html注释
			removeEmptyAttributes: true//去除空的属性
          },
          chunksSortMode: 'dependency'
        })
      );
    });
    return pageList;
  }
};
