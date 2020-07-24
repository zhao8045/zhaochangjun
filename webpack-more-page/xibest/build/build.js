/*构建压缩包*/


'use strict';//严格模式
const ora = require('ora');//node loading模块（主要用来实现node.js命令行环境的loading效果，和显示各种状态的图标等）
const rm = require('rimraf');//node  rm -rf模块 （以包的形式包装rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除）
const chalk = require('chalk');//node console模块
const path = require('path');//node 路径模块（node.js路径处理模块path）
const webpack = require('webpack');//使用webpack
const config = require('./webpack.prod.conf');//引入webpack.prod.conf.js
const rmFile = path.resolve(__dirname, '../www');//返回一个相对于当前的工作目录的绝对路径
const spinner = ora('building for production...');//build start loading
spinner.start();//开始

rm(rmFile, function(err) {
  if (err) throw err;
  webpack(config, function(err, stats) {
    spinner.stop();//结束
    if (err) throw err;
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n'
    );

    if (stats.hasErrors()) {
      console.log(chalk.red('  打包失败 Build failed with errors.\n'));
      process.exit(1);
    }
    
    console.log(chalk.cyan('   打包完成 Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );
  });
});
