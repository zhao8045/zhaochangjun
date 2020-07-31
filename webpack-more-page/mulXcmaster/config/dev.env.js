'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  API: '"/api"',
  NODE_ENV: '"development"'
})