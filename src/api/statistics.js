/*
 * @Author: coco-Tang
 * @Date: 2019-06-06 15:36:28
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-06-06 17:20:32
 * @Description: 统计数据接口
 */
import axios from '@/utils/axios'

// 状态监测 获取统计数据; query参数 range = 1, 3, 7, 30, 0分别对应当天/最近3天/最近1周/最近1月/所有时间
export function getNonMachineStatistics(query) {
	return axios({
		url: 'statistics/statistic.do',
		method: 'GET',
		withCredentials: true,
		params: query
	})
}
// 状态监测 获取机器的统计数据
export function getMachineStatistics(query) {
	return axios({
		url: 'statistics/machinestatistic.do',
		method: 'GET',
		withCredentials: true,
	})	
}