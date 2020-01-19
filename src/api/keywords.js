/*
* @Author: cjq
* @Date:   2019-04-13 17:45:53
* @Last Modified by:   Administrator
* @Last Modified time: 2019-10-31 09:42:15
*/
import axios from '@/utils/axios'

//获取关键词
export function getKeywords(query) {
	return axios({
		url: '/api/keywords',
		method: 'GET',
		params: query
	})
}
//关键词上线
export function keywordOnline(query) {
	return axios({
		url: '/api/keywords/online',
		method: 'POST',
		params: query
	})
}
//关键词下线
export function keywordOffline(query) {
	return axios({
		url: '/api/keywords/offline',
		method: 'POST',
		params: query
	})
}
//关键词新建
export function keywordCreate(query) {
	return axios({
		url: '/api/keywords',
		method: 'POST',
		params: query
	})
}
//关键词更新
export function keywordUpdate(id,query) {
	return axios({
		url: `/api/keywords/${id}`,
		method: 'PATCH',
		data: query
	})
}
//关键词删除
export function keywordDelete(query) {
	return axios({
		url: '/api/keywords',
		method: 'DELETE',
		params: query
	})
}
// //获取关键词
// export function getSpeakers(query) {
// 	return axios({
// 		url: '/api/speakers',
// 		method: 'GET',
// 		data: query
// 	})
// }
//获取关键词支持语种
export function keywordLanguage(query) {
	return axios({
		url: '/api/keywords/languages',
		method: 'GET',
		data: query
	})
}