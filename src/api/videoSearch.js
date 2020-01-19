/*
* @Author: Administrator
* @Date:   2019-09-11 11:18:34
* @Last Modified by:   Administrator
* @Last Modified time: 2019-09-11 11:19:11
*/
import axios from '@/utils/axios'


export function createVideoTasks(query) {
  return axios({
    url: '/api/video-query',
    params: query
  })
}
