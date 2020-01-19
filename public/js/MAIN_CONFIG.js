/*
 * @Author: coco-Tang
 * @Date: 2019-10-23 10:01:24
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-19 16:09:14
 * @Description: 
 */
; (function (name, definition, context) {
  if ((typeof module !== 'undefined') && module.exports)
    module.exports = definition() // node 环境
  else if ((typeof context['define'] === 'function') && (context['define']['amd'] || context['define']['cmd']))
    define(definition)            // amd cmd 规范环境，如 seajs requirejs
  else
    context[name] = definition()  // 浏览器环境
})('MAIN_CONFIG', function () {

  return {
    // ---------------------------- api prefix ----------------------------
    BASEURL: 'http://192.168.1.101:8080',
    QL_BASEURL: 'http://192.168.1.101:9999',
    PROMETHEUS_BASEURL: 'http://192.168.1.102:9090',
    IMPORT_MEDIA_BASEURL: 'http://172.17.0.144:50000',

    // ---------------------------- other ----------------------------
    __DEV__: false, // 是否为开发环境

  }

}, this);
