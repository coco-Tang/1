/*
* @Author: cjq
* @Date:   2019-04-11 14:43:44
* @Last Modified by:   cjq
* @Last Modified time: 2019-06-21 17:10:34
*/
import axios from '@/utils/axios'

//获取声纹
export function getSpeakers(query) {
	return axios({
		url: '/api/speakers',
		method: 'get',
		params: query
	})
}
//新建声纹
export function createSpeakers(query) {
	return axios({
		url: '/api/speakers',
		method: 'post',
		data: query
	})
}
//上传声纹
export function uploadSpeakers(query,id) {
	return axios({
		url: `/api/speakers/${id}/voices`,
		method: 'post',
		data: query,
		headers: {'Content-Type': 'multipart/form-data'},
	})
}
//删除声纹
export function deleteSpeakers(query) {
	return axios({
		url: `/api/speakers`,
		method: 'delete',
		params: query
	})
}
//上线声纹
export function onlineSpeakers(query) {
	return axios({
		url: `/api/speakers/online`,
		method: 'post',
		data: query
	})
}
//下线声纹
export function offlineSpeakers(query) {
	return axios({
		url: `/api/speakers/offline`,
		method: 'post',
		data: query
	})
}
//训练声纹
export function trainSpeakers(query) {
	return axios({
		url: `/api/speakers/train`,
		method: 'post',
		data: query
	})
}
//修改声纹
export function updateSpeakers(query,id) {
	return axios({
		url: `/api/speakers/${id}`,
		method: 'patch',
		data: query
	})
}