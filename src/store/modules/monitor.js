/*
* @Author: Administrator
* @Date:   2019-10-15 09:48:04
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-20 11:20:31
*/
export const MONITOR_DATA = 'MONITOR_DATA'
export const MONITOR_CONDITION = 'MONITOR_CONDITION'

const monitor = {
	state:{
		result:{

		},
		condition:{

		}
	},
	mutations:{
		[MONITOR_DATA](state, obj){
			state.result = obj
		},
		[MONITOR_CONDITION](state, obj){
			state.condition = obj
		}
	},
	actions:{
		MONITOR_DATA({commit}, data){
			commit(MONITOR_DATA, data)
		},
		MONITOR_CONDITION({commit}, data){
			commit(MONITOR_CONDITION, data)
		}
	},
	getters:{
		getMonitorData:(state) => state.result,
		getMonitorCondition:(state) => state.condition
	}
}

export default monitor