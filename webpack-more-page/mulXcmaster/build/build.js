/*构建压缩包*/

'use strict';//严格模式

require('./check-versions')();//版本检查
process.env.NODE_ENV = 'production'

const ora = require('ora');//node loading模块（主要用来实现node.js命令行环境的loading效果，和显示各种状态的图标等）
const rm = require('rimraf');//node -rm -rf模块（以包的形式包装-rm -rf命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除）
const path = require('path');//node 路径模块（node.js路径处理模块path）
const chalk = require('chalk');//node 颜色插件
const webpack = require('webpack');//使用webpack
const config = require('../config');//config配置
const webpackConfig = require('./webpack.prod.conf');//引入webpack.prod.conf.js

const spinner = ora('building for production...');//build start loading
spinner.start();//开始

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), function(err) {
  if (err) throw err;
  webpack(webpackConfig, function(err, stats) {
    spinner.stop();//结束
    if (err) throw err;
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,//如果您使用的是ts-loader，将此设置为true将在编译时显示TypeScript错误
        chunks: false,
        chunkModules: false
    }) + '\n\n')

    if (stats.hasErrors()) {
      console.log(chalk.red('  打包失败！ Build failed with errors.\n'));
      process.exit(1);
    }
    
    console.log(chalk.cyan('   打包完成！ Build complete.\n'));
    console.log(
      chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
          "  Opening index.html over file:// won't work.\n"
      )
    );
  });
});
