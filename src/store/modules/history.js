/*
* @Author: cjq
* @Date:   2019-06-27 14:34:03
* @Last Modified by:   Administrator
* @Last Modified time: 2019-12-04 11:22:10
*/
export const HISTORY_DATA = 'HISTORY_DATA'
export const HIS_SWITCH = 'HIS_SWITCH'
export const HIS_CONDITION = 'HIS_CONDITION'
export const HISTORY_ID = 'HISTORY_ID'
export const HIS_DETAIL_DATA = 'HIS_DETAIL_DATA'
export const CLEAR_TIMER = 'CLEAR_TIMER'

const history = {
	state:{
		result:{

		},
		switch: false,//true 结果列表；false 任务列表
		condition: {},
		id: null,
		detailData:{

		},
		clearTimer: false
	},
	mutations:{
		[HISTORY_DATA](state, obj){
			state.result = obj
		},
		[HIS_SWITCH](state, obj){
			state.switch = obj
		},
		[HIS_CONDITION](state, obj){
			state.condition = obj
		},
		[HISTORY_ID](state, obj){
			state.id = obj
		},
		[HIS_DETAIL_DATA](state, obj){
			state.detailData = obj
		},
		[CLEAR_TIMER](state, obj){
			state.clearTimer = obj
		}
	},
	actions:{
		HISTORY_DATA({commit}, data){
			commit(HISTORY_DATA, data)
		},
		HIS_SWITCH({commit}, data){
			commit(HIS_SWITCH, data)
		},
		HIS_CONDITION({commit}, data){
			commit(HIS_CONDITION, data)
		},
		HISTORY_ID({commit}, data){
			commit(HISTORY_ID, data)
		},
		HIS_DETAIL_DATA({commit}, data){
			commit(HIS_DETAIL_DATA, data)
		},
		CLEAR_TIMER({commit}, data){
			commit(CLEAR_TIMER, data)
		}
	},
	getters:{
		getHistoryData:(state) => state.result,
		getHistorySwitch:(state) => state.switch,
		getHistoryCondition:(state) => state.condition,
		getHistoryId:(state) => state.id,
		getHistoryDetail:(state) => state.detailData,
		getClearTimer:(state) => state.clearTimer
	}
}

export default history