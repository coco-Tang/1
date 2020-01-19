/*
* @Author: cjq
* @Date:   2019-03-22 13:42:16
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-04 09:34:14
*/
export const PLAYER = 'PLAYER'
export const PLAYER_DATA = 'PLAYER_DATA'
export const RANGE_INDEX = 'RANGE_INDEX'
export const RESIZE_DATA = 'RESIZE_DATA'
export const RESIZE_DATALOCAL = 'RESIZE_DATALOCAL'
export const LCOBTN_DATA = 'LCOBTN_DATA'
export const RCOBTN_DATA = 'RCOBTN_DATA'
export const RES_DATA = 'RES_DATA'
export const PATH_FLAG = 'PATH_FLAG'
export const WAVESURFER_DATA = 'WAVESURFER_DATA'
export const ISPLAY = 'ISPLAY'
export const SYNCROLLFLAG = 'SYNCROLLFLAG'
export const TIMEFLAG = 'TIMEFLAG'
export const NEXT_RECORD = 'NEXT_RECORD'
export const KEYWORD = 'KEYWORD'
export const BILL_STATUS = 'BILL_STATUS'
export const REFRESHSLIDE = 'REFRESHSLIDE'
export const ANNOTATION_DATA = 'ANNOTATION_DATA'

const player = {
	state:{
		playerData:{
			dateFlag: new Date(0),
			type: '', 
			callid: '',
			rangeIndex: 0,
			starttime: 0
		},
		// resize:{
		// 	left: 'calc( 50% - 380px)',
		// 	top: 'calc( 90% - 480px)',
		// 	width: '760',
		// 	height: '490',
		// 	dateFlag: ''
		// },
		// resizeLocal:{
		// 	left: '240',
		// 	top: 'calc( 90% - 226px)',
		// 	width: 'calc( 100% - 300px)',
		// 	height: '226',
		// 	dateFlag: ''
		// },
		resize:{
			left: 'calc( 50% - 380px)',
			// top: 'calc( 90% - 580px)',
			top: '250',
			width: '760',
			height: '490',
			dateFlag: ''
		},
		resizeLocal:{
			left: '240',
			top: 'calc( 90% - 257px)',
			width: 'calc( 100% - 300px)',
			height: '257',
			dateFlag: ''
		},

		lcobtn: true,
		rcobtn: true,
		resData: {
			appended:{}
		},
		pathFlag: 'all',
		wavesurfer:{},
		isplay: false,
		syncRollFlag: false,
		timeFlag: false,
		nextRecord:{
			dateFlag: '',
			next: true,
			callid: ''
		}, // true next,false previous
		keyWord:{
			content: '',
			start: '',
			end: ''
		},
		billStatus:{
			dateFlag: '',
			gender: '',
			level: '',
			status: '',
			segments: '',
			language: ''
		},
		refreshSlide: '',            //更新样本视图 存时间戳
		annotationData: ''
	},
	mutations:{
		[PLAYER_DATA](state,obj) {
			state.playerData.dateFlag = obj.dateFlag
			state.playerData.type = obj.type
			state.playerData.callid = obj.callid
			state.playerData.starttime = obj.starttime
		},
		[RANGE_INDEX](state, data) {
	    state.rangeIndex = data
	  },
	  [RESIZE_DATA](state, obj) {
	    state.resize.dateFlag = obj.dateFlag
	    state.resize.left = obj.left
	    state.resize.top = obj.top
	    state.resize.width = obj.width
	    state.resize.height = obj.height
	  },
	  [RESIZE_DATALOCAL](state, obj) {
	    state.resizeLocal.dateFlag = obj.dateFlag
	    state.resizeLocal.left = obj.left
	    state.resizeLocal.top = obj.top
	    state.resizeLocal.width = obj.width
	    state.resizeLocal.height = obj.height
	  },
	  [LCOBTN_DATA](state, data) {
	    state.lcobtn = data
	  },
	  [RCOBTN_DATA](state, data) {
	    state.rcobtn = data
	  },
	  [RES_DATA](state, data) {
	  	state.resData = data
	  },
	  [PATH_FLAG](state, data) {
	  	state.pathFlag = data
	  },
	  [WAVESURFER_DATA](state, data) {
	  	state.wavesurfer = data
	  },
	  [ISPLAY](state, data) {
	    state.isplay = data
	  },
	  [SYNCROLLFLAG](state, data) {
	    state.syncRollFlag = data
	  },
	  [TIMEFLAG](state, data) {
	    state.timeFlag = data
	  },
	  [NEXT_RECORD](state, obj) {
	    state.nextRecord.dateFlag = obj.dateFlag
	    state.nextRecord.next = obj.next
	    state.nextRecord.callid = obj.callid
	  },
	  [KEYWORD](state, obj) {
	    state.keyWord.start = obj.start
	    state.keyWord.end = obj.end
	    state.keyWord.content = obj.content
	  },
  	[BILL_STATUS](state, obj) {
	    if(obj.reset){
	      state.billStatus.gender = ''
	      state.billStatus.level = '' 
	      state.billStatus.status = ''
	      state.billStatus.language = ''
	    }else{
	      obj.dateFlag ? state.billStatus.dateFlag = obj.dateFlag : ''
	      obj.gender ? state.billStatus.gender = obj.gender : ''
	      // (obj.level || obj.level==0) ? state.billStatus.level = obj.level : ''
	      if(obj.level || obj.level==0){
	      	state.billStatus.level = obj.level
	      }
	      obj.status ? state.billStatus.status = obj.status : ''
	      // obj.segments ? state.billStatus.segments = obj.segments : ''
	      obj.language ? state.billStatus.language = obj.language : ''
	    }
	  },
	  [REFRESHSLIDE](state, data) {
	    state.refreshSlide = data
	  },
	  [ANNOTATION_DATA](state, data) {
	    state.annotationData = data
	  }
	},
	actions:{
		PLAYER_DATA({commit}, data) {
			commit(PLAYER_DATA, data)
		},
		RANGE_INDEX({commit}, data) {
		  commit(RANGE_INDEX, data)
		},
		RESIZE_DATA({commit}, obj) {
		  commit(RESIZE_DATA, obj)
		},
		RESIZE_DATALOCAL({commit}, obj) {
		  commit(RESIZE_DATALOCAL, obj)
		},
		LCOBTN_DATA({commit}, data) {
		  commit(LCOBTN_DATA, data)
		},
		RCOBTN_DATA({commit}, data) {
		  commit(RCOBTN_DATA, data)
		},
		RES_DATA({commit}, data) {
		  commit(RES_DATA, data)
		},
		PATH_FLAG({commit}, data) {
		  commit(PATH_FLAG, data)
		},
		WAVESURFER_DATA({commit}, data) {
		  commit(WAVESURFER_DATA, data)
		},
		ISPLAY({commit}, data) {
		  commit(ISPLAY, data)
		},
		SYNCROLLFLAG({commit}, data) {
		  commit(SYNCROLLFLAG, data)
		},
		TIMEFLAG({commit}, data) {
		  commit(TIMEFLAG, data)
		},
		NEXT_RECORD({commit}, obj) {
		  commit(NEXT_RECORD, obj)
		},
		KEYWORD({commit}, obj) {
		  commit(KEYWORD, obj)
		},
		BILL_STATUS({commit}, obj) {
		  commit(BILL_STATUS, obj)
		},
		REFRESHSLIDE({commit}, obj) {
		  commit(REFRESHSLIDE, obj)
		},
		ANNOTATION_DATA({commit}, obj) {
		  commit(ANNOTATION_DATA, obj)
		}
	},
	getters:{
		getPlayerData:(state) => state.playerData,
		getRangeIndex:(state) => state.rangeIndex,
		getResizeData:(state) => state.resize,
		getResizeLocalData:(state) => state.resizeLocal,
		getlcobtn:(state) => state.lcobtn,
		getrcobtn:(state) => state.rcobtn,
		getResData:(state) => state.resData,
		getPathFlag:(state) => state.pathFlag,
		getwavesurfer:(state) => state.wavesurfer,
		getisplay:(state) => state.isplay,
		getsyncRollFlag:(state) => state.syncRollFlag,
		gettimeFlag:(state) => state.timeFlag,
		getNextRecord:(state) => state.nextRecord,
		getkeyWord:(state) => state.keyWord,
		getBillStatus:(state) => state.billStatus,
		getrefreshSlide:(state) => state.refreshSlide,
		getannotationData:(state) => state.annotationData,

	}
}

export default player