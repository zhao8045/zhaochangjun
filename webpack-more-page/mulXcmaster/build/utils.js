/*工具类方法*/

const path = require('path');//node 路径模块
const prodConfig = require('../config').build;//引用build参数

module.exports = {
  _resolve: _path => path.resolve(__dirname, _path),//返回一个相对于当前的工作目录的绝对路径
  assetsPath: _path => path.posix.join(prodConfig.assetsPath, _path)//将路径片段进行拼接
};
