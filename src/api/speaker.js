/*
 * @Author: coco-Tang
 * @Date: 2019-07-05 17:59:44
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-19 20:18:31
 * @Description: 
 */
import ajax from '@/utils/axios'

// 获取声纹列表
export const getSpeakers = ({ start, limit, code, name }) =>
    ajax({
        url: `/api/speakers?start=${start}&limit=${limit}&code=${code}&name=${name}`
    })

// 创建声纹
export const newSpeaker = (fd) =>
    ajax({
        url: `/api/speakers`,
        method: 'post',
        data: fd
    })

// 上传声纹语音
export const uploadSpeakersVoices = (ids, fd, callback) =>
    ajax({
        url: `/api/speakers/${ids}/voices`,
        method: 'post',
        data: fd,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: callback
    })

// 删除声纹语音
export const delSpeakersVoices = (ids, fd) =>
    ajax({
        url: `/api/speakers/${ids}/voices`,
        method: 'delete',
        data: fd
    })

// 上线声纹
export const onlineSpeakers = (fd) =>
    ajax({
        url: `/api/speakers/online`,
        method: 'post',
        data: fd
    })

// 下线声纹
export const offlineSpeakers = (fd) =>
    ajax({
        url: `/api/speakers/offline`,
        method: 'post',
        data: fd
    })

// 训练声纹
export const trainSpeakers = (fd) =>
    ajax({
        url: `/api/speakers/train`,
        method: 'post',
        data: fd
    })

// 修改声纹
export const fixSpeaker = (id, fd) =>
    ajax({
        url: `/api/speakers`,
        method: 'patch',
        data: fd
    })

// 删除声纹
export const delSpeakers = (ids) =>
    ajax({
        url: `/api/speakers?speakerIds=${ids}`,
        method: 'delete'
    })

// 获取单个声纹
export const getSingleSpeaker = (id) =>
    ajax({
        url: `/api/speakers/${id}`
    })

// import axios from 'axios'

// const c2 = axios.create({
//     baseURL: process.env === "production" ? "" : `/ulang`
// })

// export default c2
