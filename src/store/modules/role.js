/*
 * @Author: coco-Tang
 * @LastEditors: coco-Tang
 * @Description: 用户角色 
 * @Date: 2019-04-15 15:09:11
 * @LastEditTime: 2019-09-17 15:15:33
 */

import { getRoles, getAuth } from "@/api/index.js";
export const ROLE = 'ROLE';
export const AUTHLIST = 'AUTHLIST';
const roles = {
  state: {
    roles: [],
    authList: []
  },
  getters: {
    getRoles: state => state.roles,
    getAuthList: state => state.authList
  },
  mutations: {
    [ROLE](state, data) {
      console.log('ROLE', data)
      state.roles = data.reduce((pre, cur) => {
        cur = pre.push({ label: cur.name, value: cur.id });
        return pre;
      }, []);
    },
    [AUTHLIST](state, data) {

      state.authList = data.reduce((pre, cur) => {
        cur = pre.push({ label: cur.name, key: cur.id });
        return pre;
      }, []);
      console.log('state.authList', state.authList)
    }
  },
  actions: {
    ROLE({ commit }) {
      getRoles().then(response => {
        console.log('async getRoles', response.data)
        commit(ROLE, response.data);
      }).catch(error => {
        console.warn(error);
      })
    },
    AUTHLIST({ commit }) {
      getAuth().then(response => {
        console.log('async AUTHLIST', response.data)
        commit(AUTHLIST, response.data);
      }).catch(error => {
        console.warn(error);
      })
    }
  }
}

export default roles
