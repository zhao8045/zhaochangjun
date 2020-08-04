/*css文件生成*/

'use strict';//严格模式

const path = require('path');//node 路径模块
const ExtractTextPlugin = require('extract-text-webpack-plugin');//引入能把css文件提取出来的插件
const { entryFiles } = require('./setting.js');//引入setting.js入口配置 方法和入口文件

//多个css文件插件ExtractTextPlugin实例
const plugins = [];
entryFiles.map((v,k) => {
  plugins.push(
    new ExtractTextPlugin({
      filename: `css/${v}.[contenthash].css`,
      allChunks: false
    })
  );
});

module.exports = {
  //使用正则匹配到每个页面对应style文件夹下的css/less文件,并配置loader来进行解析.从而实现html<->css的1对1转换
  rulesList: () => {
    const rules = [];
    entryFiles.map((v, k) => {
      rules.push({
        test: new RegExp(`src(\\\\|\/)${v}(\\\\|\/).*\.(css|less)$`),
        use: plugins[k].extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      });
    });
    return rules;
  },
  stylePlugins: plugins//插件实例
};
