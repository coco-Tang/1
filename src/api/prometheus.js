/*
 * @Author: coco-Tang
 * @Date: 2020-01-17 13:48:31
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-19 16:06:08
 * @Description: 
 */
import axios from 'axios'

import { PROMETHEUS_BASEURL } from '@/config'

const service = axios.create({
  baseURL: PROMETHEUS_BASEURL // api的base_url
})

// 请求钩子
let startTime = 0;
service.interceptors.request.use((config) => {
  startTime = new Date().getTime();
  return config;
},
  (error) => {
    return Promise.reject(error);
  },
);

// 响应钩子
service.interceptors.response.use((response) => {
  const loadTime = new Date().getTime() - startTime;
  const responseData = response.data; // 响应数据

  if (loadTime > 10000) {
    console.warn(`本次加载时间为 ${loadTime / 1000}s`, `api: ${response.request.responseURL}`);
    Message.error('网络超时！');
  }

  if (responseData.status !== "success") {
    Message.error('网络错误！');
  }

  return response;
},
  (error) => {
    return Promise.reject(error);
  },
);

function formatResult(result, type = 0) {
  if (result.length) {

    let total = parseInt(result[0].value[1], 10);

    if (type) {
      total = total / 3600;
    }

    return total > 10000
      ? (total / 10000).toFixed(1) + "万"
      : total % 1 === 0
        ? total
        : total.toFixed(1);

  } else {
    return "-";
  }
}

export async function querySummary(query, type) {
  return await service({
    url: '/api/v1/query',
    method: 'GET',
    params: query
  }).then(res => {
    const {
      data: { result }
    } = res.data;
    return formatResult(result, type);
  }).catch(err => {
    console.warn(err)
    return "-"
  })
}

export async function queryDistrib(query, instance) {
  return await service({
    url: '/api/v1/query',
    method: 'GET',
    params: query
  }).then(res => {
    const {
      data: { result }
    } = res.data;
    let resultData = [];
    for (let item of result) {
      resultData.push({
        name: item.metric[instance],
        value: +item.value[1]
      });
    }
    return resultData.sort((a, b) => {
      return a.value > b.value;
    });
  }).catch(err => {
    console.warn(err)
    return []
  })
}

export function queryInstant(query, instantQueryLength) {
  let date = new Date();
  let endDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    0,
    0,
    0
  );
  date.setTime(
    endDate.getTime() - 24 * 60 * 60 * 1000 * instantQueryLength
  );

  return service({
    url: '/api/v1/query_range',
    method: 'GET',
    params: {
      query,
      start: date.toISOString(),
      end: endDate.toISOString(),
      step: 3600 // per hour
    }
  }).then(res => {
    let {
      data: { result }
    } = res.data;
    if (!result.length) return {
      min: date.getTime(),
      max: endDate.getTime(),
      data: []
    };
    let values = result[0].values;
    let data = [];
    for (let i = 0; i < values.length; i++) {
      let [t, v] = values[i];
      data[i] = [t * 1000, parseInt(v, 10)];
    }

    return {
      min: date.getTime(),
      max: endDate.getTime(),
      data: data
    };
  }).catch(err => {
    console.warn(err)
    return {
      min: date.getTime(),
      max: endDate.getTime(),
      data: []
    }
  })
}