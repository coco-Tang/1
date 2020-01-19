/*
* @Author: cjq
* @Date:   2019-04-11 14:44:40
* @Last Modified by:   Administrator
* @Last Modified time: 2019-09-11 10:45:23
*/
import axios from '@/utils/axios'

// export function createTasks(query) {
//   return axios({
//     url: '/api/tasks',
//     method: 'post',
//     data: query
//   })
// }
export function createTasks(query) {
  return axios({
    url: '/api/query',
    params: query
  })
}
// export function getTasks(query) {
//   return axios({
//     url: '/api/query',
//     params: query
//   })
// }