/*
* @Author: cjq
* @Date:   2019-05-22 14:18:24
* @Last Modified by:   cjq
* @Last Modified time: 2019-05-22 14:26:55
*/
import axios from '@/utils/axios'

export function getLog(query) {
	return axios({
  	url: 'api/logs',
		method: 'GET',
		params: query
	})
}