/*
* @Author: Administrator
* @Date:   2019-10-14 14:36:24
* @Last Modified by:   Administrator
* @Last Modified time: 2019-10-14 15:24:14
*/
import axios from '@/utils/axios'

export function createMonitors(query) {
  return axios({
    url: '/api/monitors',
    method: 'post',
    data: query
  })
}
export function getMonitors(query) {
  return axios({
    url: '/api/monitors',
    method: 'get',
    params: query
  })
}
export function getMonitorResults(query) {
  return axios({
    url: '/api/monitors/results',
    method: 'get',
    params: query
  })
}