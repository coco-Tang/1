import axios from '@/utils/axios'

// export function bulkImport(query) {
//   return axios({
//     url: '/api/import-voice-batches',
//     method: 'POST',
//     data: query
//   })
// }
// export function getBatchImportedData(query) {
//   return axios({
//     url: '/api/import-voice-batches',
//     method: 'GET',
//     params: query
//   })
// }
// export function getSpecificImportedData(batchId, query) {
//   return axios({
//     url: `/api/import-voice-batches/${batchId}`,
//     method: 'GET',
//     params: query
//   })
// }


// zmh & pc 的新接口 , 共包含 3 部分

/*
 * Part I
 * 音/视频 (共用)
 * shared methods
 */

// 获取任务列表信息
export function getAllTasks(query) {
    return axios({
        url: `/api/import-tasks`,
        method: 'get',
        params: query
    })
}

// 新建任务
export function newTask(fd) {
    return axios({
        url: `/api/import-tasks`,
        method: 'post',
        data: fd
    })
}

// 编辑任务
export function modTask(fd) {
    return axios({
        url: `/api/import-tasks`,
        method: 'patch',
        data: fd
    })
}

// 删除任务
export function delTasks(fd) {
    return axios({
        url: `/api/import-tasks`,
        method: 'delete',
        data: fd
    })
}

// 开始处理任务
export function processTask(taskId, query) {
    return axios({
        url: `/api/import-tasks/${taskId}`,
        method: 'patch',
        params: query
    })
}

// 获取处理的 语音 or 视频 结果数
export function getTaskMediaCount(taskId, query) {
    return axios({
        url: `/api/import-tasks/${taskId}`,
        method: 'get',
        params: query
    })
}


/*
 * Part II
 * 音频 (专用)
 * type: 1
 * Media --> Voice
 */


// 获取语音(列表)信息
export function getTaskVoices(query, taskId) {
    return axios({
        url: `/api/import-tasks/${taskId}/voices`,
        method: 'get',
        params: query
    })
}

// 详情页 导入(补充上传)语音 -- zmh只是负责保存信息; pc的是专门负责保存文件
export function uploadVoices(fd, taskId) {
    return axios({
        url: `/api/import-tasks/${taskId}/voices`,
        method: 'post',
        data: fd
    })
}

// 删除语音信息 -- 同上, 删除实际文件仍需调用pc的方法
export function deleteVoicesInfo(fd, taskId) { // 已改动, 增加taskId
    return axios({
        url: `/api/import-tasks/${taskId}/voices`,
        method: 'delete',
        data: fd
    })
}



/*
 * Part III
 * 视频 (专用)
 * type: 2
 * Media --> Video
 */

 // 获取视频(列表)信息
export function getTaskVideos(query, taskId) {
    return axios({
        url: `/api/import-tasks/${taskId}/voices`, // videos java不让改
        method: 'get',
        params: query
    })
}

// 详情页 导入(补充上传)视频 -- zmh只是负责保存信息; pc的是专门负责保存文件
export function uploadVideos(fd, taskId) {
    return axios({
        url: `/api/import-tasks/${taskId}/voices`, // videos
        method: 'post',
        data: fd
    })
}

// 删除视频信息 -- 同上, 删除实际文件仍需调用pc的方法
export function deleteVideosInfo(fd, taskId) { // 已改动, 增加taskId
    return axios({
        url: `/api/import-tasks/${taskId}/voices`, // videos
        method: 'delete',
        data: fd
    })
}