/*
* @Author: cjq
* @Date:   2019-04-10 09:50:15
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-19 11:32:27
*/
import router from '@/router/router.js'
import store from '@/store/store.js'
import {from_current_top_scroll_to} from '@/utils'

const LOGIN_ROUTE_NAME = 'login';

/**
 * 未登录时，路由的处理函数
 *
 * @param {Route} to
 * @param {NextFn} next
 */
function no_login_handler(to, next) {
  if (to.name === LOGIN_ROUTE_NAME) {
    next();
    console.log('跟路由没有登录')
  } else {
    console.log('to.name', to.name)
    next({ name: LOGIN_ROUTE_NAME });
  }
}

/**
 * 进入根路径时的处理函数 (不同角色的用户，根路径进入的页面也不同)
 *
 * @param {Route} to
 * @param {NextFn} next
 * @param {ULANG.UserEntity} user_info
 */
function enter_root_route(to, next, user_info) {
  const user_type = user_info.category;//本系统中根路径页面相同，不生效
  // 1. 角色1
  if (user_type === USER_TYPE.ROLE1) {
    next({ name: 'home-index' });
    // 2. 角色2
  } else if (user_type === USER_TYPE.ROLE2) {
    next({ name: 'guide-index' });
    // 其他角色 (跳到登录页面)
  } else {
    Token.logout(); // 不清除可能还会进入这个 case 导致死循环
    no_login_handler(to, next);
  }
}

/**
 * 路由守卫函数
 * 特殊页面:
 *   - login(登录页面): 未登录或者查询不到用户数据，会进入该页面，进入该页面不需权限
 *   - error(错误页面 404): 页面无权限或者未定义的路由会进入该页面，进入该页面不需权限
 *   - root(根路由): 每个角色的根路由不一样，需要进行特殊处理，进入有权限的页面的优先级最高的那个页面
 *
 * @export
 * @param {Route} to
 * @param {Route} from
 * @param {NextFn} next
 * @param {*} user_info
 * @returns
 */
export default function can_enter_the_page(to, from, next, user_info) {
  // return next(); // 测试、开发时用，不进行权限和是否登录验证
  const is_dev = process.env.NODE_ENV === 'development';

  // 1. 没有登录，或登录过期|| !Token.get()
  if (!user_info ) {
    console.log('没有登录进入到此处，执行no_login_handler')
    no_login_handler(to, next);
    return;
  }

  // 2. 错误页面无需判断，直接可进入
  if (to.name === 'notFound') {
    next();
    return;
  }

  // 3. 登录了，判断用户信息中是否有进入目标页面的权限
  // 3.1 已登录了，进不了登录界面
  if (to.name === LOGIN_ROUTE_NAME) {
    next()
    return;
  }
  // 3.2 对进入 / 根路径的处理
  if (to.path === '/') {
    enter_root_route(to, next, user_info);
    return;
  }
  // 3.3 其他路由，判断是否有进入权限 (走到这一步的路由都需要配置权限)
  if (to.meta && to.meta.role) {
    next();
  } else {
    if (is_dev) {
      console.warn('【无权限进入该页面】 需要权限: ', to.meta.role);
    }
    // 无权限进入
    next({ name: 'notFound', replace: true });
  }
}



// ---------------------------------------- 路由钩子 ----------------------------------------
router.beforeEach(async (to, from, next) => {
//   document.title = (to.meta || {}).title || '语音识别系统';
  can_enter_the_page(to, from, next, store.getters['getAccount']);
});

router.afterEach((to, from) => {
  if (to.name !== from.name) {
    from_current_top_scroll_to(0, 0); // 滚动到顶部
  }
});

// let auth, acconut

// router.beforeEach((to, from, next) => {
//   // console.error('router')
//   // console.log(router)
//   // console.log(store)
//   // console.log('to')
//   // console.log(to)
//   // console.log(to.meta)
//   // console.log('router from')
//   // console.log(from)
//   // console.log('acconut')
//   // console.log(acconut)
//   // console.log('to.meta.role')
//   // console.log(to.meta.role)
//   // console.log('auth[to.name]')
//   // console.log(auth[to.name])

//   if(acconut === undefined && to.path != '/login'){
//     router.replace({path: '/login'})
//     // return console.log('nologin')
//   }
//   if(to.meta.role === undefined && from.path!='/'){
//   	next()
//   }else if(auth == undefined){
//     router.replace({path: '/'})
//   }else if(to.meta.role === auth[to.name]){
//   	// console.log('to.meta.role',to.meta.role)
//   	// console.log('auth[to.name]',auth[to.name])
//   	next() 
//   }else{
//   	console.log('权限不足')
//   	// console.log(from)
//   	router.replace({path: from.path})
//     // next() 
//   }
// })

// // console.log(store)
// auth = store.state.account.auth
// acconut = store.state.account
// // acconut = 'admin'