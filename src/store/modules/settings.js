/*
 * @Author: coco-Tang
 * @Date: 2019-09-04 17:04:03
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-09-09 15:56:08
 * @Description: 
 */
export const UPDATELEVELOPTIONS = 'UPDATELEVELOPTIONS'

const settings = {
  state: {
    levelOptions: [
      {
        value: 1,
        label: "系统管理员"
      },
      {
        value: 2,
        label: "管理员"
      },
      {
        value: 3,
        label: "运维"
      },
      {
        value: 4,
        label: "普通用户"
      }
    ]
  },
  mutations: {
    [UPDATELEVELOPTIONS](state, data) {
      state.levelOptions.push({ value: state.levelOptions.length + 1, label: data });
    }
  },
  getters: {
    levelOptions: state => state.levelOptions
  }
}

export default settings