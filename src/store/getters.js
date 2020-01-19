/*
 * @Author: coco-Tang
 * @Date: 2019-10-08 16:10:18
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-09 10:03:40
 * @Description: 
 */
const getters = {
  getAuth: (state) => state.account.auth,
  getAccount: (state) => state.account.account,
  getPlatform: (state) => state.account.platform
}
export default getters