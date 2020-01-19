/*
 * @Author: coco-Tang
 * @Date: 2019-12-03 09:25:46
 * @LastEditors  : coco-Tang
 * @LastEditTime : 2020-01-16 15:26:58
 * @Description: 
 */
const W = window;
const MAIN_CONFIG = W.MAIN_CONFIG;
if (!MAIN_CONFIG) { console.error('主配置文件 MAIN_CONFIG.js 不存在，请检查!'); }


// ---------------------------- 开发环境判断 ----------------------------
export const ENV = { is_dev: process.env.NODE_ENV === 'development' };
export function IS_DEV() { return MAIN_CONFIG.__DEV__; }
W.IS_DEV = IS_DEV;

// ---------------------------- 接口根地址 ----------------------------
export const BASEURL = MAIN_CONFIG.BASEURL;
export const QL_BASEURL = MAIN_CONFIG.QL_BASEURL;
export const PROMETHEUS_BASEURL = MAIN_CONFIG.PROMETHEUS_BASEURL;
export const IMPORT_MEDIA_BASEURL = MAIN_CONFIG.IMPORT_MEDIA_BASEURL;

// ---------------------------- 必有配置的加载检查 ----------------------------
const api_config_arr = [BASEURL, QL_BASEURL, PROMETHEUS_BASEURL, PROMETHEUS_BASEURL, IMPORT_MEDIA_BASEURL];
if (!api_config_arr.every((i) => i)) {
  console.error('【MAIN_CONFIG】 API PREFIX 加载错误，请检查配置文件', api_config_arr);
}
