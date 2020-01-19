import { Message } from 'element-ui';
import { login, userInfo, getPlatforms } from "@/api/index.js";
import { REMOVE_TOKEN } from '@/store/modules/token';
import { stat } from 'fs';

/*
* @Author: cjq
* @Date:   2019-03-20 14:00:01
* @Last Modified by:   Administrator
* @Last Modified time: 2019-09-26 16:06:23
*/
export const LOGIN = 'LOGIN';
export const USER_INFO = 'USER_INFO';
export const AUTH = 'AUTH';
export const ACCOUNT = 'ACCOUNT';
export const PLATFORM = 'PLATFORM';
export const PERMISSION = 'PERMISSION';

const account = {
	state: {
		auth:[],
		// auth: {
		// 	// sys_userManagement: null,  	//1  用户管理
			
		// 	// mycase_man: null,						//3  案件管理
		// 	// res_speechseg: null,     		//4  固定音频	
		// 	// res_keywords: null,       	//5  关键词
		// 	// res_speakers: null,      		//6  声纹	
			
		// 	// search_condition: null,			//8  检索
			
		// 	// search_importVoice: null,		//11 导入语音
		// 	// search_count: null,       	//12  状态监测
		// 	// sys_log: null,     					//13  日志管理
		// 	sys_searchQueue: null,      //14  搜索队列
		// 	mon_list: null,							//20 实时预警
		// 	// search_defraud: null,       //21 诈骗
		// 	phone: null,           //26 话单检索
		// 	// res_phoneThreat: null,     //27 威胁号码库管理
		// 	// statistics: null,     //46 推送统计
		// 	call: null,     //46 推送统计

			
			
		// 	user: null,      		        //1  用户管理	
		// 	res_timeslice: null,  	    //2  时间窗管理
		// 	history: null,      		    //3  历史检索
		// 	videoSearch: null,      		//4  视频检索
		// 	keyword: null,       				//5  关键词
		// 	speaker: null,      				//6  对象声纹	
		// 	res_language: null,      		//7  语种预警管理	
		// 	role: null,      		        //8  权限管理	
		// 	sys_prioManagement: null,		//10  处理量统计
		// 	log: null,      		        //13  日志管理	
		// 	importVoice: null,      		//11  导入语音	
		// 	importVideo: null,      		//12  导入视频	
			
		// },
		account: '',
		userInfo: null,
		platform: []
	},
	mutations: {
		[AUTH](state, auth) {
			state.auth = auth;
			// state.auth.sys_userManagement = obj.userManagement
			//   state.auth.res_timeslice = obj.timeslice
			//   state.auth.mycase_man = obj.mycase
			//   state.auth.res_speechseg = obj.speechseg
			//   state.auth.res_keywords = obj.keywords
			//   state.auth.res_speakers = obj.speakers
			//   state.auth.res_language = obj.language
			//   state.auth.search_condition = obj.condition
			//   state.auth.sys_prioManagement = obj.prio
			//   state.auth.search_importVoice = obj.importVoice
			//   state.auth.search_count = obj.count
			//   state.auth.sys_log = obj.log
			//   state.auth.sys_searchQueue = obj.searchQueue
			//   state.auth.mon_list = obj.monitor
			//   state.auth.search_defraud = obj.defraud
			//   state.auth.res_phone = obj.phone
			//   state.auth.res_phoneThreat = obj.phoneThreat
			//   
			// state.auth.search = obj.search
			// state.auth.keyword = obj.keyword
			// state.auth.speaker = obj.speaker
			// state.auth.user = obj.user
			// state.auth.role = obj.role
			// state.auth.call = obj.statistics
			// state.auth.log = obj.log
			// state.auth.Dispatch = obj.Dispatch
			// state.auth.Hit = obj.Hit
			// state.auth.Language = obj.Language
			// state.auth.Gender = obj.Gender
			// state.auth.importVoice = obj.importVoice
			// state.auth.history = obj.history
			// state.auth.importList = obj.importList
			// state.auth.machine = obj.machine
			// state.auth.videoSearch = obj.videoSearch
			// state.auth.importVideo = obj.importVideo
			// state.auth.importListVideo = obj.importListVideo
		},
		[ACCOUNT](state, data) {
			state.account = data
		},
		[PLATFORM](state, data) {
			state.platform = data
		},
		[USER_INFO](state, data) {
			state.userInfo = data;
		}
	},
	actions: {
		async LOGIN({ dispatch, commit }, params) {
			// 1. 发送登录请求
			const { status, data, headers } = await login(params);

			// 2. 没有数据或请求失败均为登录失败，清除掉有可能保存了的 token
			if (status!==200 || !data || !data.accessToken) {
				commit(REMOVE_TOKEN);
				return { status };
			}
			
			// 3.存储登录凭证及用户信息
			const { username, accessToken, refreshToken } = data;
			dispatch('AUTH_TOKEN', accessToken);
			dispatch('REFRESH_TOKEN', refreshToken);
			dispatch('ACCOUNT',username);

			// 4.拉取用户权限和平台数据
			dispatch('USER_INFO', { username });
			dispatch('PLATFORM');
			return { status, data, headers }
		},
		async USER_INFO({ dispatch }, params) {
			const { status, data } = await userInfo(params)
			let permissionArr = data
				.reduce((cur, prev) => {
					prev = cur.push(
						prev.permissions.map(item => {
							return item.id + "";
						})
					);
					return cur;
				}, [])
				.flat();
			console.log(
				"Array.from(new Set(permissionArr))",
				Array.from(new Set(permissionArr))
			);
			dispatch('AUTH', Array.from(new Set(permissionArr)));
		},
		AUTH({ commit }, data) {
			commit(AUTH, data)
		},
		ACCOUNT({ commit }, data) {
			commit(ACCOUNT, data)
		},
		PLATFORM({ commit }) {
			getPlatforms().then(res => {
				let arr = res.data.reduce((pre, cur) => {
					cur = pre.push({ label: cur.name, value: cur.code });
					return pre;
				}, []);
				arr.push({
					value: "",
					label: "全部",
					disbaled: false
				});
				commit(PLATFORM, arr);
			});
		}
	}
}

export default account