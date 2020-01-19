/*
 * @Author: coco-Tang
 * @Date: 2019-10-16 10:40:29
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-17 10:03:21
 * @Description: 
 */
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import '@/permission.js'
import ElementUI, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import "ag-grid-enterprise/main";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

import "@/style/eleButton.scss";

Vue.use(ElementUI, { zIndex: 8000 })
Vue.config.productionTip = false

// ---------------------------------------- 错误处理 ----------------------------------------
// 收集错误信息，写入 localStorage，以便定位错误
window.onerror = (event, source, fileno, columnNumber, error) => {
  const error_data = {
    title: document.getElementsByTagName('title')[0].innerText,
    error_event: event,
    script_url: source,
    line_number: fileno,
    column_number: columnNumber,
    error_detail: (error && error.message) || '',
    error_stack: (error && error.stack) || '',
    user_agent: window.navigator.userAgent,
    location_href: window.location.href
  };
  const event_string = String(error_data.error_event || '');

  if (event_string === 'ResizeObserver loop limit exceeded') { return; }

  const SCRIPT_ERROR = 'Unexpected token <'; // 脚本错误 (一般是服务器中的前端代码更新了，浏览器缓存中的 js 代码由于不一致而报错)
  const CHUNK_ERROR = 'chunk';

  if (event_string.indexOf(SCRIPT_ERROR) !== -1 || event_string.indexOf(CHUNK_ERROR) !== -1) {
    Message({ type: 'error', showClose: true, duration: 0, message: '发现新版本，请使用 CTRL + F5 刷新网页' });
  }
};

//全局注册一个供显示自定义标签的数字输入框
Vue.component('InputNumber', require('./components/input-number').default)

// 挂载一些方法
import * as Util from '@/utils'
Vue.prototype.Utils = Util

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

