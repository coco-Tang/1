/*
 * @Author: coco-Tang
 * @Date: 2019-09-27 13:48:12
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-09-27 13:51:02
 * @Description: 
 */
export const getCookie = name => {
  let arr,
    reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
  else return null;
}

export const setCookie = val => {

}