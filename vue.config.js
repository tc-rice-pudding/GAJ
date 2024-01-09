const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/', //根路径
  publicPath: './',
  transpileDependencies: true,
})
