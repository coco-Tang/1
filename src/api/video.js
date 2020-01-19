/*
* @Author: Administrator
* @Date:   2019-09-11 10:44:04
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-29 10:07:59
*/
import axios from 'axios'
import { QL_BASEURL } from '@/config'

const service = axios.create({
  baseURL: QL_BASEURL // api的base_url
})


export function getVideoRecord(id,query) {
  return service({
    url: '/records/'+id+'',
    method: 'get',
    params: query
  })
}