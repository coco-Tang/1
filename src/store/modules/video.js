/*
* @Author: Administrator
* @Date:   2019-09-02 14:24:05
* @Last Modified by:   Administrator
* @Last Modified time: 2019-09-11 13:47:54
*/
export const VIDEO_DATA = 'VIDEO_DATA'
export const VIDEO_RESIZE_DATA = 'VIDEO_RESIZE_DATA'
export const VIDEO_RES_DATA = 'VIDEO_RES_DATA'

const video = {
	state:{
		videoData: {
			dateFlag: new Date(0),
			type: '', 
			callid: '',
		},
		resize:{
			left: 'calc( 50% - 380px)',
			top: 'calc( 90% - 800px)',
			width: '760',
			height: '800',
			dateFlag: ''
		},
		resData: {
			appended:{}
		},
	},
	mutations:{
		[VIDEO_DATA](state,obj) {
			state.videoData.dateFlag = obj.dateFlag
			state.videoData.type = obj.type
			state.videoData.callid = obj.callid
		},
		[VIDEO_RESIZE_DATA](state,obj) {
			state.resize.dateFlag = obj.dateFlag
	    state.resize.left = obj.left
	    state.resize.top = obj.top
	    state.resize.width = obj.width
	    state.resize.height = obj.height
		},
	  [VIDEO_RES_DATA](state, data) {
	  	state.resData = data
	  }
	},
	actions:{
		VIDEO_DATA({commit},obj){
			commit(VIDEO_DATA,obj)
		},
		VIDEO_RESIZE_DATA({commit}, obj) {
		  commit(VIDEO_RESIZE_DATA, obj)
		},
		VIDEO_RES_DATA({commit}, data) {
		  commit(VIDEO_RES_DATA, data)
		}
	},
	getters:{
		getVideoData:(state) => state.videoData,
		getVideoResizeData:(state) => state.resize,
		getVideoResData:(state) => state.resData,
	}
}

export default video
