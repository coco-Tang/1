/*
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-16 14:18:39
 * @Description: 
 */
import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Layout from '../views/layout/Layout'
// import testChild from '../views/test/TestChild'
// import Test from '../views/test/Test'

Vue.use(Router)

export const asyncRoutes = [{
  path: '/',
  component: Layout,
  // redirect: 'login',
  children: [
    // {
    //   path: 'dashboard',
    //   // component: import('../views/dashboard/index'),
    //   component: () => import( webpackChunkName: "about"  '../views/dashboard/index'),
    //   name: 'dashboard',
    //   meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    // },
    // {
    //   path: 'test',
    //   // component: import('../views/test/Test'),
    //   // component: Test,
    //   component: () => import('../views/test/Test'),
    //   name: 'test',
    //   meta: { title: 'test', icon: 'test', noCache: true },
    //   children: [{
    //     path: 'testChild',
    //     // component: import('../views/test/TestChild'),
    //     // component: testChild,
    //     component: () => import('../views/test/TestChild'),
    //     name: 'testChild',
    //     meta: { title: 'testChild', icon: 'testChild', noCache: true }
    //   }]
    // },
    {
      path: 'keyword',
      component: () => import('../views/resources/keyword'),
      name: 'keyword',
      meta: { title: '关键词', name: 'res_keywords', icon: 'keyword', noCache: true, role: '5' }
    }, {
      path: 'speaker',
      component: () => import('../views/resources/speaker'),
      name: 'speaker',
      meta: { title: '对象声纹', name: 'res_speakers', icon: 'speaker', noCache: true, role: '6' }
    }, {
      path: 'search',
      component: () => import('../views/application/search'),
      name: 'search',
      meta: { title: '话单检索', name: 'search_condition', icon: 'search', noCache: true, role: '8' }
    }, {
      path: 'history',
      component: () => import('../views/application/history'),
      name: 'history',
      meta: { title: '历史检索', name: 'history', icon: 'history', noCache: true, role: '46-5' }
    }, {
      path: 'importVoice',
      component: () => import('../views/application/importVoice'),
      name: 'importVoice',
      meta: { title: '导入语音', name: 'importVoice', icon: 'importVoice', noCache: true, role: '11' }
    }, {
      path: 'importList',
      component: () => import('../views/application/importList'),
      name: 'importList',
      meta: { title: 'importList', name: 'importList', icon: 'importList', noCache: true, role: '11-1' }
    }, {
      path: 'user',
      component: () => import('../views/system/userManagement'),
      name: 'user',
      meta: { title: '用户管理', name: 'user', icon: 'user', noCache: true, role: '1' }
    }, {
      path: 'role',
      component: () => import('../views/system/RoleManage'),
      name: 'role',
      meta: { title: '权限管理', name: 'role', icon: 'role', noCache: true, role: '8' }
    }, {
      path: 'log',
      component: () => import('../views/system/log'),
      name: 'log',
      meta: { title: '日志管理', name: 'log', icon: 'log', noCache: true, role: '13' }
    },{
      path: 'monitor',
      component: () => import('../views/monitor/monitor'),
      name: 'monitor',
      meta: { title: '实时预警', name: 'monitor', icon: 'monitor', noCache: true, role: '13' }
    }, {
      path: 'statistics',
      component: () => import('../views/statistics'),
      name: 'statistics',
      // meta: { title: 'statistics', name: 'statistics', icon: 'statistics', noCache: true, role: '46' },
      meta: { title: 'statistics', name: 'statistics', icon: 'statistics', noCache: true },
      redirect: { name: 'call' },
      children: [
        {
          path: 'call',
          component: () => import('../views/statistics/CallHandlerStat'),
          name: 'call',
          meta: { title: '处理量统计', name: 'call', icon: 'call', noCache: true, role: '46' }
        },
        {
          path: 'machine',
          component: () => import('../views/statistics/MachStat'),
          name: 'machine',
          meta: { title: '机器统计', name: 'machine', icon: 'machine', noCache: true, role: '47' }
        }
      ]
    }, {
      path: 'train',
      component: () => import('../views/train'),
      name: 'train',
      // meta: { title: 'statistics', name: 'statistics', icon: 'statistics', noCache: true, role: '46' },
      meta: { title: 'train', name: 'train', icon: 'train', noCache: true },
      redirect: { name: 'library' },
      children: [
        {
          path: 'library',
          component: () => import('../views/train/languageLibrary'),
          name: 'library',
          meta: { title: '语料库管理', name: 'library', icon: 'library', noCache: true, role: '999'}
        },
        {
          path: 'task',
          component: () => import('../views/train/trainTask'),
          name: 'task',
          meta: { title: '任务管理', name: 'task', icon: 'task', noCache: true, role: '998' }
        },
        {
          path: 'model',
          component: () => import('../views/train/trainModel'),
          name: 'model',
          meta: { title: '任务管理', name: 'model', icon: 'model', noCache: true, role: '997' }
        }
      ]
    }, {
      path: 'video',
      component: () => import('../views/application/video/videoSearch'),
      name: 'videoSearch',
      meta: { title: '视频检索', name: 'video_search', icon: 'search', noCache: true, role: '4' }
    }, {
      path: 'importVideo',
      component: () => import('../views/application/video_import/importVideo'),
      name: 'importVideo',
      meta: { title: '导入视频', name: 'importVideo', icon: 'search', noCache: true, role: '49' }
    }, {
      path: 'importListVideo',
      component: () => import('../views/application/video_import/importListVideo'),
      name: 'importListVideo',
      meta: { title: 'importListVideo', name: 'importListVideo', icon: 'search', noCache: true, role: '50' }
    }]
  // route level code-splitting
  // this generates a separate chunk (about.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  // component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
}];

export default new Router({
  routes: [
    { path: '/login', name: 'login', component: () => import('../views/login/index'), meta: { title: '登录' } },
    { path: '/404', name: 'notFound', component: () => import('../views/errorPage/404'), meta: { title: '404' } },
    ...asyncRoutes,
    // { path: '*', redirect: '/404' },
  ]
})
