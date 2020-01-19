/*
* @Author: cjq
* @Date:   2019-04-12 13:25:46
* @Last Modified by:   cjq
* @Last Modified time: 2019-04-12 13:30:14
*/
export const RESULT_DATA = 'RESULT_DATA'

const search = {
	state:{
		result:{

		}
	},
	mutations:{
		[RESULT_DATA](state, obj){
			state.result = obj
		}
	},
	actions:{
		RESULT_DATA({commit}, data){
			commit(RESULT_DATA, data)
		}
	},
	getters:{
		getResultData:(state) => state.result
	}
}

export default search