/*
* @Author: cjq
* @Date:   2019-03-12 15:02:05
* @Last Modified by:   Administrator
* @Last Modified time: 2019-08-29 09:08:16
*/
import axios from '@/utils/axios'
import { formatParams } from '@/utils'
// console.log('api.js')

export function platform() {
	return axios({
  	url: '/api/platforms',
		method: 'GET'
	})
}

export function getData(query) {
  return axios({
    url: '/api/objects',
    method: 'post',
    data: query
  })
}
//登录
export function login(query) {
	return axios({
    url: '/login',
		method: 'POST',
		data: formatParams(query)
	})
}
//获取用户信息
export function userInfo(params) {
	return axios({
		url: '/api/roles/pers',
		method: 'GET',
		params
	})
}
//登出
export function logout() {
	return axios({
        url: '/logout',
		method: 'POST'
	})
}
//获取用户权限
export function getAccount(query) {
	return axios({
		url: '/user/findByAccount.do',
		method: 'POST',
		data: query
	})
}
//获取平台
export function getPlatforms(query) {
	return axios({
		url: '/api/platforms',
		method: 'get',
		data: query
	})
}

//获取用户角色
export function getRoles() {
	return axios({
		url: '/api/roles',
		method: 'GET'
	})
}

//获取权限列表
export function getAuth() {
	return axios({
		url: '/api/pers',
		method: 'GET'
	})
}

//获取权限菜单
export function getPermissions(params) {
  return axios({
		url: `/api/roles_pers`,
		method: 'GET',
		params
	})
}


