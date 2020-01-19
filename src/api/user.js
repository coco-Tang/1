/*
* @Author: cjq
* @Date:   2019-04-12 15:11:32
* @Last Modified by:   Administrator
* @Last Modified time: 2019-11-01 18:23:05
*/
import axios from '@/utils/axios'

export function getUsers(query) {
  return axios({
    url: '/api/users',
    method: 'get',
    params: query
  })
}

export function createUsers(query) {
  return axios({
    url: '/api/users',
    method: 'post',
    data: query
  })
}

export function updateUsers(query, id) {
  return axios({
    url: `/api/users/${id}`,
    method: 'PATCH',
    data: query
  })
}

export function deleteUsers(query) {
  return axios({
    url: `/api/users`,
    method: 'delete',
    data: query
  })
}

export function pwdUpdateUsers(query) {
  return axios({
    url: '/api/users',
    method: 'patch',
    data: query
  })
}

export function resetUsers(query) {
  return axios({
    url: `/api/users/${query}`,
    method: 'patch',
  })
}

export function resetPwd(query) {
  return axios({
    url: `/api/users/${query}/reset-password`,
    method: 'post',
  })
}

export function getRoles(query) {
  return axios({
    url: '/api/roles_pers',
    method: 'get',
    params: query
  })
}

export function createRoles(query) {
  return axios({
    url: '/api/roles',
    method: 'post',
    data: query
  })
}

export function updateRoles(query, id) {
  return axios({
    url: `/api/roles/${id}`,
    method: 'PATCH',
    data: query
  })
}

export function deleteRoles(query) {
  return axios({
    url: `/api/roles`,
    method: 'delete',
    data: query
  })
}