/*
* @Author: Administrator
* @Date:   2019-08-29 09:23:26
* @Last Modified by:   Administrator
* @Last Modified time: 2019-08-29 09:28:51
*/
export const AUTH_TOKEN = 'AUTH_TOKEN'
export const REFRESH_TOKEN = 'REFRESH_TOKEN'
export const REMOVE_TOKEN = 'REMOVE_TOKEN'

const token = {
	state:{
		authtoken: null,
		refreshtoken: null
	},
	mutations:{
		[AUTH_TOKEN](state, obj){
			state.authtoken = obj
		},
		[REFRESH_TOKEN](state, obj){
			state.refreshtoken = obj
		},
		[REMOVE_TOKEN](state) {
			state.authtoken = null
		}
	},
	actions:{
		AUTH_TOKEN({commit}, data){
			commit(AUTH_TOKEN, data)
		},
		REFRESH_TOKEN({commit}, data){
			commit(REFRESH_TOKEN, data)
		}
	},
	getters:{
		getAuthToken:(state) => state.authtoken,
		getRefreshToken:(state) => state.refreshtoken
	}
}

export default token