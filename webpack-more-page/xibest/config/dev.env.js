'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
	API_ROOT_ATM:'"/api1"',//ATM后台请求地址
	API_ROOT_ONB:'"/api2"',//ONB钱包登录请求地址
	API_ROOT_BCFir:'"/api3"',//ONB区块链请求地址
	API_ROOT_BCSec:'"/api4"',//ONB区块链请求地址
	NODE_ENV: '"development"'
})
