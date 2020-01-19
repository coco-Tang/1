/*
* @Author: cjq
* @Date:   2019-06-27 11:07:13
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-06 10:38:17
*/
import axios from '@/utils/axios'
import axios1 from 'axios'

export function createHisTasks(query) {
  return axios({
    url: '/api/tasks',
    method: 'post',
    data: query
  })
}
export function getHisTasks(query) {
  return axios({
    url: '/api/tasks',
    method: 'get',
    params: query
  })
}
export function getHisResult(id,query) {
  return axios({
    url: `/api/tasks/${id}/results`,
    method: 'get',
    params: query
  })
}
export function taskCancel(id) {
  return axios({
    url: `/api/tasks/${id}/cancel`,
    method: 'post'
  })
}
export function taskDelete(id) {
  return axios({
    url: `/api/tasks/${id}`,
    method: 'delete'
  })
}

export function createHisTasks1(query) {
  return axios1({
    url: 'http://192.168.1.84:3000/createHisTasks',
    method: 'post',
    data: query
  })
}
export function getHisTasks1(query) {
  return axios1({
    url: 'http://192.168.1.84:3000/getHisTasks',
    method: 'post',
    data: query
  })
}
export function getHisResult1(query) {
  return axios1({
    url: 'http://192.168.1.84:3000/getHisResult',
    method: 'post',
    data: query
  })
}