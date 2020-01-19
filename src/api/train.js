/*
 * @Author: coco-Tang
 * @Date: 2019-11-22 10:44:23
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-26 17:20:11
 * @Description: 优化训练接口
 */
import axios from '@/utils/axios'
import { formatParams } from "@/utils"
const api = {
  libUrl: "/api/lib-voices",
  taskUrl: "/api/lib-voices",
  modelUrl: "/api/models"
}

export function queryLibraryVoices(query) {
  return axios({
    url: `${api.libUrl}`,
    method: 'GET',
    params: query
  })
}

export function addLibraryVoices(query) {
  return axios({
    url: `${api.libUrl}`,
    method: 'POST',
    data: formatParams(query)
  })
}

export function delLibraryVoices(id) {
  return axios({
    url: `${api.libUrl}/${id}`,
    method: 'DELETE'
  })
}

export function getTrainTask(query) {
  return axios({
    url: `/api/train-tasks`,
    method: 'GET',
    params: query
  })
}

export function createTrainTask(query) {
  return axios({
    url: `/api/train-tasks`,
    method: 'POST',
    params: query
  })
}


export function queryModels(query) {
  return axios({
    url: `${api.modelUrl}`,
    method: 'GET',
    params: query
  })
}

export function addModels(query) {
  return axios({
    url: `${api.modelUrl}`,
    method: 'POST',
    data: formatParams(query)
  })
}

export function delModels(id) {
  return axios({
    url: `${api.modelUrl}/${id}`,
    method: 'DELETE'
  })
}

