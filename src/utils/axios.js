/*
* @Author: cjq
* @Date:   2019-03-12 14:49:01
* @Last Modified by:   Administrator
* @Last Modified time: 2020-01-10 10:23:48
*/
import axios from 'axios'
import store from '../store/store'
import { Message } from 'element-ui'
import Vue from 'vue'
import router from '@/router/router.js'
import { BASEURL } from '@/config'

let url = BASEURL;
const service = axios.create({
  baseURL: url, // api的base_url,
  withCredentials: true,
  timeout: 1000 * 12
})

service.interceptors.request.use(config => {
    // console.log('request config')
    // console.log(config)
    if (store.state.token.authtoken) {
        config.headers.Authorization = store.state.token.authtoken;
    }
    return config
}, error => {
    Promise.reject(error)
})
  

service.interceptors.response.use(response => {
	return response;
},
async (error) => {
    if (error.response.status === 401) {
        if(store.state.token.refreshtoken){
            let res = await getrefreshToken(store.state.token.refreshtoken);
            store.commit('AUTH_TOKEN', res.data.accessToken)
            store.commit('REFRESH_TOKEN', res.data.refreshToken)
            error.config.baseURL = ''
            return service.request(error.config);
        }
        else{
            // return Promise.reject(error)
            Message.error('您的本次登录凭证已过期, 请重新登录!');
            router.replace({path: '/login'})
        }
        
    }
    return Promise.reject(error)
});

function getrefreshToken (token) {
    return service({
        url: '/api/users/token',
        method: 'GET',
        params: {
           refreshToken: token 
        }
    }).catch(error => {
        if (error.response.status === 402){
            Message.error('您的本次登录凭证已过期, 请重新登录!');
            router.replace({path: '/login'})
        }else{
            Message.error(error.response.data.msg)
        }
        return Promise.reject()
        
    })
};


export default service
export const url1 = url