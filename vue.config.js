/*
* @Author: cjq
* @Date:   2019-03-12 10:00:08
* @Last Modified by:   Administrator
* @Last Modified time: 2020-01-08 09:32:48
*/
module.exports = {
  publicPath: './',
  outputDir: 'frontend-dist',
  assetsDir: './',
  devServer: {
    port: 1234,
    proxy: {
      '/ulang': {
        target: 'http://192.168.1.101:8080', // 正式环境
        changeOrigin: true,
        // autoRewrite: true,
        // cookieDomainRewrite: true,
        pathRewrite: {
          '^/ulang': ''
        },
        onProxyRes: function (proxyRes, req, res) {

        }
      },
      '/qlApi': {
        target: 'http://192.168.1.101:9999',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/qlApi': ''
        }
      },
      '/upFile': {
          target: 'http://192.168.1.242:10011',
          changeOrigin: true,
          autoRewrite: true,
          pathRewrite: {
              '^/upFile': ''
          }
      },
      '/api/v1': {
        target: 'http://192.168.1.238:17000/api/v1',
        changeOrigin: true,
        autoRewrite: true,
        pathRewrite: {
          '^/api/v1': ''
        }
      }
    }
  }
}