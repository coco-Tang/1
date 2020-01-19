/*
 * @Author: coco-Tang
 * @Date: 2019-09-17 17:47:58
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-08 16:09:54
 * @Description: 
 */
import Vue from 'vue'
import Vuex from 'vuex'
import permission from './modules/permission'
import account from './modules/account'
import player from './modules/player'
import search from './modules/search'
import speaker from './modules/speaker'
import history from './modules/history'
import impMedia from './modules/impMedia'
import token from './modules/token'
import video from './modules/video'
import settings from './modules/settings'
import role from './modules/role'
import monitor from './modules/monitor'
import getters from './getters'

Vue.use(Vuex)


export default new Vuex.Store({
    state: {
        authtoken: null,
        refreshToken: null,
        baseUrl: null,
        qlBaseUrl: null
    },
    mutations: {

    },
    actions: {

    },
    getters,
    modules: {
        permission,
        account,
        player,
        search,
        speaker,
        history,
        impMedia,
        token,
        video,
        settings,
        role,
        monitor
    },
})
