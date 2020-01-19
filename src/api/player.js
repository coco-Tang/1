/*
* @Author: cjq
* @Date:   2019-03-25 15:41:54
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-29 10:01:29
*/
import Vue from 'vue'
import axios from 'axios'

import { QL_BASEURL } from '@/config'

let url = QL_BASEURL;
const service = axios.create({
  baseURL: url // api的base_url
})

export function getRecord(id,query) {
  return service({
    url: '/records/'+id+'',
    method: 'get',
    params: query
  })
}
// export function getHisRecord(query) {
//   return service({
//     url: '/records/'+query+'?tag=history',
//     method: 'get',
//     data: query
//   })
// }
export function getHisRecord(id,query) {
  return service({
    url: '/records/'+id+'',
    method: 'get',
    params: query
  })
}

export function correctnessMark(query,id) {
  return service({
    url: `/records/${id}/correctness-mark`,
    method: 'patch',
    data: query
  })
}

export function updateInfo(query,id) {
  return service({
    url: `/records/${id}/base-info`,
    method: 'patch',
    data: query
  })
}

export function annotations(query,id) {
  return service({
    url: `/records/${id}/annotations`,
    method: 'post',
    data: query
  })
}export function annotationsVerify(query,id) {
  return service({
    url: `/records/${id}/verify_annotations`,
    method: 'get',
    data: query
  })
}
export function delAnnotations(query,id) {
  return service({
    url: `/records/${id}/annotations`,
    method: 'delete',
    data: query
  })
}
export function getAnnotations(id) {
  return service({
    url: `/records/${id}/annotations`,
  })
}
export function unpdateAnnotations(query,id) {
  return service({
    url: `/records/${id}/annotations`,
    method: 'patch',
    data: query
  })
}
export function getVad(id,query) {
  return service({
    url: `/records/${id}/vads`,
    method: 'get',
    params: query
  })
}
export function getAsrs(id,query) {
  return service({
    url: `/records/${id}/asrs`,
    method: 'get',
    params: query
  })
}
export function updateAsrs(query,id) {
  return service({
    url: `/records/${id}/asr`,
    method: 'patch',
    data: query
  })
}
//在线转写
// export function updateAsrs(query) {
//   return service({
//     url: `/tool/asr`,
//     method: 'post',
//     data: query
//   })
// }
//记录调听人信息
export function listenersRecord(query,callId) {
  return service({
    url: `/records/${callId}/listeners`,
    method: 'post',
    data: query
  })
}
//获取音频
export function getAudio(callId,fileTag) {
  return service({
    url: `/records/${callId}/files?fileTag=${fileTag}`,
    method: 'get'
  })
}

export function exportWood(id) {
  return `${url}/records/${id}/info-to-word`
}
export function exportTextGrid(id) {
  return `${url}/records/${id}/textgrid`
}

export const url1 = url
