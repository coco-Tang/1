/*
* @Author: cjq
* @Date:   2017-12-04 11:07:48
* @Last Modified by:   Administrator
* @Last Modified time: 2020-01-13 17:50:13
*/
console.log('utils index')
import { MessageBox } from 'element-ui';

/**
* use_iframe_download function - 通过 iframe 下载文件
*
* @param {String} download_path 需下载文件的链接
* @return {Void}
*/
export function use_iframe_download(download_path) {
  const $iframe = document.createElement('iframe');

  $iframe.style.height = '0px';
  $iframe.style.width = '0px';
  document.body.appendChild($iframe);
  $iframe.setAttribute('src', download_path);

  setTimeout(() => { $iframe.remove(); }, 20000);
}

/** yymmddhhmmss(new Date) 2018-07-23 14:55:55 */
export function yymmddhhmmss(date_obj={}, delimiter = '-') {
  const yy = date_obj.getFullYear().toString();
  const mm = (date_obj.getMonth() + 1).toString();
  const dd = date_obj.getDate().toString();
  const hh = date_obj.getHours().toString();
  const MM = date_obj.getMinutes().toString();
  const ss = date_obj.getSeconds().toString();

  return yy + delimiter + (mm[1] ? mm : `0${mm[0]}`)
    + delimiter + (dd[1] ? dd : `0${dd[0]}`) + ' '
    + (hh[1] ? hh : `0${hh[0]}`) + ':' + (MM[1] ? MM : `0${MM[0]}`) + ':' + (ss[1] ? ss : `0${ss[0]}`);
}


let Diff = require('text-diff')
export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  }, {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }]


//时间格式转换
export function dateFormat() {

  Date.prototype.format = function (fmt) {
    var o = {
      "M+": this.getMonth() + 1,                 //月份 
      "d+": this.getDate(),                    //日 
      "h+": this.getHours(),                   //小时 
      "m+": this.getMinutes(),                 //分 
      "s+": this.getSeconds(),                 //秒 
      "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
      "S": this.getMilliseconds()             //毫秒 
    };
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
      }
    }
    return fmt;
  }
}
//秒转时分秒
export function formatTime(seconds) {
  return [
    parseInt(seconds / 60 / 60),
    parseInt(seconds / 60 % 60),
    parseInt(seconds % 60)
  ]
    .join(":")
    .replace(/\b(\d)\b/g, "0$1");
}
//两个日期之间的时间差
export function timeDuration(date1,date2) {
  var dateDiff = date2 - date1;
  return formatTime(dateDiff/1000);
}
//去重 label：obj的属性
export function dereplication(obj) {
  let hash = {}
  obj = obj.reduce(function (item, next) {
    hash[next.label] ? '' : hash[next.label] = true && item.push(next)
    return item
  }, [])
  return obj
}
//提示信息
export function messageBox(res, _this, time) {
  if (!res.status === 200) {
    _this.$message.error({
      message: res.statusText,
      dangerouslyUseHTMLString: true,
      duration: time || 3000
    })
  } else {
    _this.$message({
      message: res.statusText,
      dangerouslyUseHTMLString: true,
      type: 'success',
      duration: time || 3000
    })
  }
}
export function toSecond(str) {
  let arr = str.split(':')
  return (arr[0] - 0) * 3600 + (arr[1] - 0) * 60 + (arr[2] - 0) + (arr[3] - 0) * 0.001
}
export function toSeconds(str) {
  let arr = str.split(':')
  return (arr[0] - 0) * 3600 + (arr[1] - 0) * 60 + (arr[2] - 0)
}
export function toMinutes(s) {
  var t;
  if (s > -1) {
    var hour = Math.floor(s / 3600);
    var min = Math.floor(s / 60) % 60;
    var sec = s % 60;
    if (hour < 10) {
      t = '0' + hour + ":";
    } else {
      t = hour + ":";
    }

    if (min < 10) { t += "0"; }
    t += min + ":";
    if (sec < 10) { t += "0"; }
    t += sec.toFixed(2);
  }
  return t;

}
export function waveRegion(wavesurfer, start, end, color, clear) {
  // console.log(wavesurfer)
  // console.log('waveRegion')
  // console.log(start)
  // console.log(end)
  if (!clear) {
    wavesurfer.clearRegions()
  }

  wavesurfer.addRegion({
    start: start,
    end: end,
    color: color,
    drag: false
  })
}

export function getGender(num) {
  let res = ''
  switch (num) {
    case 0:
      res = '未知'
      break;
    case 1:
      res = '男'
      break;
    case 2:
      res = '女'
      break;
    case 3:
      res = '男男'
      break;
    case 4:
      res = '男女'
      break;
    case 5:
      res = '女男'
      break;
    case 6:
      res = '女女'
      break;
  }
  // console.log(typeof num)
  // console.log(res)
  return res
}

export function genderDisFormat(caller, callee) {
  let str = caller + callee
  let res = 0
  switch (str) {
    case '未知':
      res = 0
      break;
    case '男':
      res = 1
      break;
    case '女':
      res = 2
      break;
    case '男男':
      res = 3
      break;
    case '男女':
      res = 4
      break;
    case '女男':
      res = 5
      break;
    case '女女':
      res = 6
      break;
  }
  // console.log(typeof num)
  // console.log(res)
  return res
}

export function diff(stra, strb) {
  let diff = new Diff(); // options may be passed to constructor; see below
  let textDiff = diff.main(stra, strb); // produces diff array
  return diff.prettyHtml(textDiff)
}

export function arrHashFilter(arr, tag) {
  var result = [], hash = {};
  for (var i = 0; i < arr.length; i++) {

    let elem = arr[i][tag]
    if (!hash[elem]) {

      hash[elem] = {
        count: 1,
        name: elem,
        score: arr[i].score
      }
    } else {
      hash[elem].count++
      arr[i].score > hash[elem].score ? hash[elem].score = arr[i].score : ''
    }
  }
  return hash;
}


export function autosize(gridOptions) {
  var allColumnIds = [];
  gridOptions.columnApi.getAllColumns().forEach(function (column) {
    allColumnIds.push(column.colId);
  });
  gridOptions.columnApi.autoSizeColumns(allColumnIds);


}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}
export function confirmBox(_this, message, callback, params) {
  _this.$confirm(message, '提示', {
    confirmButtonText: '确 定',
    cancelButtonText: '取 消',
    type: 'warning'
  }).then(() => {
    callback(params)
  }).catch(() => {
    // this.$message({
    //   type: 'info',
    //   message: '已取消删除'
    // });         
  });
}

/**
 * 删除弹窗
 * @param message
 * @param title
 * @param type
 */
export async function confirm_message(message, title = '提示', type = 'warning', options = {}) {
  try {
    await MessageBox.confirm(message , title,
      Object.assign({}, { confirmButtonText: '确定', cancelButtonText: '取消', type }, options));

    return true;
  } catch (err) {
    return false;
  }
}

export function cellStatusJuge(data) {
  return !!(data)
}

/**
 * 返回数组中的不相同元素首次出现的索引
 *  
 * @param {Array} options 
 * 
 * @return {Array}
 */
export function get_ele_idx(options = []) {
  let filtData = [...new Set(options)];
  let len = options.length;
  let arr = [];

  if (!filtData.length) return;
  filtData.forEach(item => {
    let flag = false;
    for (let i = 0; i < len; i++) {
      if (item === options[i]) {
        arr.push({
          [item]: i
        })
        flag = true;
      }
      if (flag) {
        break;
      }
    }
  })

  return arr;
}

// 判断参数是否是其中之一
export function oneOf(value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true;
    }
  }
  return false;
}

export const options = {
  // "1": 1,
  "10s": 1,
  "1min": 1,
  "5min": 1,
  "15min": 3,
  "30min": 7,
  "1h": 14,
  "2h": 28,
  "6h": 86,
  "12h": 172,
  "1d": 345,
  "2d": 691,
  "1w": 2419,
  "2w": 4838,
  "4w": 9676,
  "8w": 19353,
  "1y": 126144,
  "2y": 252288
}

/**
 * 将对象中的键值对转换成URL参数
 *  
 * @param {Object} options 
 * 
 * @param {Object} type
 * 
 * @return {Object}
 */
export function formatParams(options = {}, type = "qs") {
  let params = type === "qs" ? new URLSearchParams() : type === "fd" ? new FormData() : {};
  Object.keys(options).forEach(item => { params.append(item, options[item]) });
  return params
}



/**
 * 滚动动画函数
 *
 * @export
 * @param {(HTMLElement | Window)} el
 * @param {number} [from=0]
 * @param {number} to
 * @param {number} [duration=500]
 */
export function scroll_to(el, from = 0, to, duration = 500) {
  function callback() {
    return window.setTimeout(callback, 1000 / 60);
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = (
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      callback
    );
  }

  const difference = Math.abs(from - to);
  const scroll_step = Math.ceil(difference / duration * 50);

  function scroll(start, end, step) {
    if (start === end) {
      return;
    }

    let d = (start + step > end) ? end : start + step;

    if (start > end) {
      d = (start - step < end) ? end : start - step;
    }

    if (el === window) {
      window.scrollTo(d, d);
    } else {
      el.scrollTop = d;
    }

    window.requestAnimationFrame(() => scroll(d, end, step));
  }

  scroll(from, to, scroll_step);
}

/**
 * 遍历滚动函数
 *
 * @export
 * @param {number} [target_top=0]
 * @param {number} [duration=500]
 */
export function from_current_top_scroll_to(target_top = 0, duration = 500) {
  const current_top = document.documentElement.scrollTop || document.body.scrollTop;

  scroll_to(window, current_top, target_top, duration);
}


