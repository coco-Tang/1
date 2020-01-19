/*
 * @Author: coco-Tang
 * @Date: 2019-09-26 17:38:50
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-06 10:45:30
 * @Description: 
 */

export const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1gb

/** 支持上传的音频类型 */
export const IMPORT_AUDIO_TYPE = ['mp3', 'wav', ''];

/** 支持上传的视频类型 */
export const IMPORT_VIDEO_TYPE = ['asx', 'asf', 'mpg', 'wmv', '3gp', 'mp4', 'mov', 'avi', 'flv', 'rmvb', ''];

/**
 * 字符串去尾 (性别库 -> 性别)
 *
 * @param {String} str
 *
 * @return {String} str
 */
export function removeLastLabel(str) {
  return str.slice(0, -1)
  // return LANGUAGE_LIBRARY_TYPE.reduce((prev, cur) => {
  //   cur = prev.push({
  //     label: cur.label.slice(0, -1),
  //     value: cur.value
  //   });
  //   return prev;
  // }, []);
}

export const getLabel = (label) => {
  switch (label) {
    case "语音检出库":
      return VOICE_TYPE
    case "语种库":
      return SEARCH_LANGUAGE_TYPE1
    case "性别库":
      return GENDER_TYPE1
    default:
      return []
  }
}

export const getValue = (label) => {
  const obj = LANGUAGE_LIBRARY_TYPE.find(item => item.label === label);
  return obj ? obj["value"] : ""
}

/* 语音类型 */
export const VOICE_TYPE = [
  {
    label: "有效音",
    value: "valid"
  },
  {
    label: "无效音",
    value: "invalid"
  }
]
export const VOICE_TYPE1 = [
  {
    label: "有效音",
    value: "valid"
  },
  {
    label: "无效音",
    value: "invalid"
  }
]


/* 所属集类型 */
export const UNION_TYPE = [
  {
    label: "测试集",
    value: true
  },
  {
    label: "训练集",
    value: false
  }
]

/* 性别类型 */
export const GENDER_TYPE = [
  {
    label: "不限",
    value: ""
  },
  {
    label: "男",
    value: "男"
  },
  {
    label: "女",
    value: "女"
  }
]

export const GENDER_TYPE1 = [
  // {
  //   label: "不限",
  //   value: ""
  // },
  {
    label: "男",
    value: "male"
  },
  {
    label: "女",
    value: "female"
  }
]

/* 语种类型 */
export const SEARCH_LANGUAGE_TYPE = [
  {
    value: "",
    label: "不限"
  },
  {
    value: "维语",
    label: "维语"
  },
  {
    value: "哈萨克语",
    label: "哈萨克语"
  },
  {
    value: "汉语",
    label: "汉语"
  },
  {
    value: "藏语",
    label: "藏语"
  },

  {
    value: "闽南语",
    label: "闽南语"
  },
  {
    value: "柯尔克孜语",
    label: "柯尔克孜语"
  },
  {
    value: "粤语",
    label: "粤语"
  },
  {
    value: "英语",
    label: "英语"
  },
  {
    value: "阿拉伯语",
    label: "阿拉伯语"
  },
  {
    value: "法语",
    label: "法语"
  },
  {
    value: "德语",
    label: "德语"
  },
  {
    value: "日语",
    label: "日语"
  },
  {
    value: "韩语",
    label: "韩语"
  },
  {
    value: "俄语",
    label: "俄语"
  },
  {
    value: "土耳其语",
    label: "土耳其语"
  },
  {
    value: "其他",
    label: "其他"
  }
]

export const SEARCH_LANGUAGE_TYPE1 = [
  {
    label: "不限",
    value: ""
  },
  {
    label: "哈萨克语",
    value: "hacs"
  },
  {
    label: "维语",
    value: "wewr"
  },
  {
    label: "汉语",
    value: "mand"
  },

  {
    label: "英语",
    value: "engl"
  },
  {
    label: "日语",
    value: "japa"
  },
  {
    label: "康巴藏语",
    value: "zaka"
  },
  {
    label: "藏语",
    value: "zala"
  },
  {
    label: "安多藏语",
    value: "zaan"
  },

  {
    label: "闽南语",
    value: "minn"
  },
  {
    label: "柯尔克孜语",
    value: "kerz"
  },
  {
    label: "粤语",
    value: "yueh"
  },
  {
    label: "阿拉伯语",
    value: "arab"
  },

  {
    label: "法语",
    value: "fren"
  },
  {
    label: "德语",
    value: "germ"
  },
  {
    label: "韩语",
    value: "kore"
  },
  {
    label: "俄语",
    value: "russ"
  },

  {
    label: "土耳其语",
    value: "turk"
  }
]

/* 语料库种类 */
export const LANGUAGE_LIBRARY_TYPE = [
  // {
  //   label: "语音检出库",
  //   value: "voiceDetection",
  //   options: VOICE_TYPE,
  //   defaultOption: "有效音"
  // },
  {
    label: "性别库",
    value: "gender",
    options: GENDER_TYPE1,
    defaultOption: "男"
  },
  {
    label: "语种库",
    value: "language",
    options: SEARCH_LANGUAGE_TYPE1,
    defaultOption: "英语"
  }
]



/* 上传语音/视频对话框中的语种 */
export const LANG = [
  {
    value: '自动识别',
    label: '自动识别'
  },
  // {
  //   label: '汉语',
  //   value: '汉语'
  // },
  // {
  //   label: '英语',
  //   value: '英语'
  // },
  {
    label: '维语',
    value: '维语'
  },
  {
    label: '哈萨克语',
    value: '哈萨克语'
  }
]

/* 处理内容 */
export const PROCESS_BITS = [
  {
    label: '有效音检测',
    value: '1'
  },
  //   {
  //     label: '语种检测',
  //     value: '2'
  //   },
  {
    label: '性别检测',
    value: '4'
  },
  {
    label: '声纹检测',
    value: '8'
  },
  //   {
  //     label: '固定音频',
  //     value: '16'
  //   },
  {
    label: '端点检测',
    value: '32'
  },
  {
    label: '拨号音检测',
    value: '64'
  },
  {
    label: '关键词检测',
    value: '128'
  },
  {
    label: '全文转写',
    value: '256'
  }
]

/* 上传语音格式 */
export const FMT = [
  {
    label: 'alaw',
    value: 'alaw'
  },
  {
    label: 'mulaw',
    value: 'mulaw'
  },
  {
    label: 'pcm',
    value: 'pcm'
  },
  {
    label: 'gsm_efr',
    value: 'gsm_efr'
  },
  {
    label: 'gsm_hr',
    value: 'gsm_hr'
  }
]