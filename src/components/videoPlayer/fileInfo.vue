<template>
  <div class="fileInfo">
    <div >
      <ul v-if="resdata.callid" class="lcontent-list hidden" :class="{'show':lcobtn}">
        <!-- 合路主被叫 -->
        <li>语种&nbsp;:&nbsp;<el-select filterable v-model="languagevalue" @change="baseChanged()">
              
            <el-option
              v-for="item in languageoptions"        
              :key="item.value"
              :label="item.label"
              :value="item.value">
              <span>{{ item.label }}</span>
            </el-option>
            
          </el-select>
          
        </li>
        <li class="list-group-item">性别&nbsp;:&nbsp;<el-select v-model="gendervalue" filterable @change="baseChanged()">
            <el-option
              v-for="item in genderoptions"           
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </li>
        <!-- <li class="list-group-item">状态&nbsp;:&nbsp;<el-select v-model="status" filterable @change="baseChanged()"> -->
        <li class="list-group-item short">识别正确性&nbsp;:&nbsp;<el-select v-model="status" filterable @change="baseChanged()">
            <el-option
              v-for="item in statusOptions"           
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </li>
        <li class="list-group-item">级别&nbsp;:&nbsp;<el-select v-model="billLevel" filterable @change="baseChanged()">
            <el-option
              v-for="item in billLevelOptions"           
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled">
            </el-option>
          </el-select>
        </li>
        <li>时间&nbsp;:&nbsp;{{dataFormat(resdata.starttime)}}</li>
        <!-- <li>时长&nbsp;:&nbsp;{{Utils.formatTime(resdata.endtime - resdata.starttime)}}</li> -->
        <li>时长&nbsp;:&nbsp;{{Utils.formatTime(resdata.callsecs)}}</li>
        <li>有效时长&nbsp;:&nbsp;{{resdata.vprresult.v ? Utils.formatTime(resdata.vprresult.v.vadsecs) : ""}}</li>
        <!-- <li>主叫&nbsp;:&nbsp;{{resdata.caller}}</li>
        <li>被叫&nbsp;:&nbsp;{{resdata.callee}}</li> -->
        <!-- <li>来源平台&nbsp;:&nbsp;优浪</li> -->
        <li>来源平台&nbsp;:&nbsp;{{setPlatform()}}</li>
        
      </ul>
      <!-- <div v-if="resdata.kwdresult" class="lcontent-list hidden" :class="{'show':!lcobtn}"> -->
      <div v-if="resdata.appended" class="lcontent-list hidden" :class="{'show':!lcobtn}">


        <div class="radioGroup">
          <el-radio-group v-model="radio" size="mini" @change = "radioChange">
            <el-radio-button label="keywords">关键词({{keywordsList.length}})</el-radio-button>
            <el-radio-button label="speakers">声纹({{speakersList.length}})</el-radio-button>
            <el-radio-button label="speechsegs">固定音频({{speechsegsList.length}})</el-radio-button>
          </el-radio-group>
        </div>

        <div class="list-group-item1 hidden" :class="{'show': keywordsRadio}">
          <!-- <span >
            <ul class="keyword-list">
              <li :class="{'targetWords_selected': index===selectIndex}" @click="showKeyWords(index)" v-for="(item,index) in keywordsList" :data-num="index">
                <el-select @change="markChanged(item,index,'keyword')" v-model="keywordsValue[index]" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    :disabled="item.disabled">
                  </el-option>
                </el-select>
                <span><bdi>{{item.keyword}}</bdi>&nbsp;&nbsp;{{(item.begin).toFixed(2)}}-{{(item.end).toFixed(2)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
              </li>
            </ul>
          </span> -->
          <!-- <span v-if="data1">
            <el-collapse v-model="activeNames" >
              <el-collapse-item :title="groupName(item)" :key="item.keyword"  v-for="(item,index1) in data1" > 
                <div v-for="(item,index) in item.data" >
                  
                  <el-select @change="markChanged(item,null,'keyword')" v-model="item.veracitymark" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled">
                    </el-option>
                  </el-select>
                  <span :class="{'item_selected': item.selected}" @click="showKeyWords(item)">&nbsp;&nbsp;{{(item.begin).toFixed(2)}}-{{(item.end).toFixed(2)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </span> -->
          <span v-if="data1">
            <el-collapse v-model="activeNames">
              <el-collapse-item v-for="(item,index1) in data1" :key='index1' :name='index1+1'> 
                <template slot='title'>
                  <div v-html='groupName(item)'></div>
                </template>
                <div v-for="(item,index) in item.data" :key='index'>
                  
                  <el-select @change="markChanged(item,null,'keyword')" v-model="item.veracitymark" placeholder="请选择">
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                      :disabled="item.disabled">
                    </el-option>
                  </el-select>
                  <span :class="{'item_selected': item.selected}" @click="showKeyWords(item)">&nbsp;&nbsp;{{(item.begin).toFixed(2)}}-{{(item.end).toFixed(2)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
                </div>
              </el-collapse-item>
            </el-collapse>
          </span>
        </div>
        <div class="list-group-item1 hidden" :class="{'show': speechsegsRadio}">
          <span v-if="resdata.speechsegs!=null">
            <ul class="speechseg-list" >
              <li :class="{'targetWords_selected': index===selectIndex1}" v-for="(item,index) in resdata.speechsegs" @click="showSpeechsegs(index)">
                <el-select @change="markChanged(item,index,'speechsegs')" v-model="speechsegsValue[index]" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <span>{{item.name}}({{pathTrans[item.filetag]}})&nbsp;|&nbsp;{{toMinutes(item.begin/1000)}}-{{toMinutes(item.end/1000)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
              </li>
            </ul> 
          </span>
        </div>
        <div class="list-group-item1 hidden" :class="{'show': speakersRadio}">
          <span >
            <ul class="wave-list">
              <li v-for="(item,index) in speakersList" >
                <!-- <el-select @change="markChanged(item,index,'speakers')" v-model="speakersValue[index]" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select> -->
                <span><bdi>{{item.speakerid}}</bdi>&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
              </li>
            </ul> 
          </span>
        </div>
        <div class="list-group-item1 hidden" :class="{'show': speechsegsRadio}">
          <!-- <span v-if="resdata.speechsegs!=null"> -->
            <ul class="speechseg-list" >
              <li :class="{'targetWords_selected': index===selectIndex}" v-for="(item,index) in speechsegsList" @click="showSpeechsegs(index)">
                <el-select @change="markChanged(item,index,'speechsegs')" v-model="speechsegsValue[index]" placeholder="请选择">
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                <!-- <span>{{item.name}}({{pathTrans[item.filetag]}})&nbsp;|&nbsp;{{toMinutes(item.begin/1000)}}-{{toMinutes(item.end/1000)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span> -->
                <span><bdi>{{item.speechsegid}}</bdi>&nbsp;|&nbsp;{{toMinutes(item.begin)}}-{{toMinutes(item.end)}}&nbsp;|&nbsp;<span class="green">{{(item.score).toFixed(2)}}</span></span>
              </li>
            </ul> 
          <!-- </span> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import {mapActions,mapGetters} from 'vuex'
// import {getLanguageName,updateCallInfo,setLanguageName,updateCallName,deleteKtLanguageName,taggingBidMessage} from '@/api/ql.js'
// import {changecallstatus} from '@/api/index.js'
import {correctnessMark,updateInfo} from '@/api/player.js'
import languageDialog from './languageDialog'
import { SEARCH_LANGUAGE_TYPE } from "@/constant";

export default {
  name: 'fileInfo',
  data () {
    return {
      wavesurfer:{},
      lcobtn:true,
      resdata:{},
      callid: '',
      selectIndex: '',
      selectIndex1: '',
      // callerlanguagevalue: '',
      // calleelanguagevalue: '',
      // oldcallerlanguagevalue: '',
      // oldcalleelanguagevalue: '',
      languagevalue: '',
      languageoptions:SEARCH_LANGUAGE_TYPE,

      // callergendervalue: '',
      // calleegendervalue: '',
      // oldcallergendervalue: '',
      // oldcalleegendervalue: '',

      gendervalue: '',
      genderoptions: [{
        value: '男',
        label: '男',
        disabled: false
      }, {
        value: '女',
        label: '女',
        disabled: false
      }, {
        value: '不确定',
        label: '不确定',
        disabled: false
      }],
      // status: null,
      // statusOptions: [{
      //   value: null,
      //   label: '未处理',
      //   disabled: true
      // },{
      //   value: '2',
      //   label: '正确'
      // }, {
      //   value: '3',
      //   label: '错误'
      // }, {
      //   value: '4',
      //   label: '不确定'
      // }],
      status: null,
      statusOptions: [{
        value: null,
        label: '未处理',
        disabled: true
      },{
        value: 'right',
        label: '正确'
      }, {
        value: 'wrong',
        label: '错误'
      }, {
        value: 'uncertain',
        label: '不确定'
      }],
      billLevel: 0,
      billLevelOptions: [{
          value: 0,
          label: '一般'
        }, {
          value: 1,
          label: '严重'
        }, {
          value: 2,
          label: '紧急'
        }, {
          value: 9,
          label: '排除'
        }],
      // genderoptionsdafult: [{
      //   value: 1,
      //   label: '男',
      //   disabled: false
      // }, {
      //   value: 2,
      //   label: '女',
      //   disabled: false
      // }, {
      //   value: 3,
      //   label: '男和女',
      //   disabled: false
      // }],

      countlang:[],
      parentMsg: true,
      newlanguage: '',

      options: [{
        value: null,
        label: '未标注',
        disabled: true
      }, {
        value: '2',
        label: '正确'
      }, {
        value: '3',
        label: '错误'
      }, {
        value: '5',
        label: '不确定'
      }],
      keywordsValue: [],
      speakersValue: [],
      // options: [{
      //   value: 'unmarked',
      //   label: '未标注'
      // }, {
      //   value: 'right',
      //   label: '正确'
      // }, {
      //   value: 'wrong',
      //   label: '错误'
      // }, {
      //   value: 'uncertain',
      //   label: '不确定'
      // }],
      
      speechsegsValue: [],
      radio: 'keywords',
      keywordsRadio: true,
      speakersRadio: false,
      speechsegsRadio: false,
      //0、未知 1、合路 2、A路 3、B路 4、C路
      pathTrans: ['未知','合路','A路','B路','C路'],
      genderTrans: ['','','男','女','男和女','不确定','机器变声'],
      keywordsList: [],
      speakersList: [],
      speechsegsList: [],
      data1: [],
      activeNames: ['1']
    }
  },
  components: {
    'languageDialog': languageDialog
  },
  computed:{
    getComWavesurfer() {
      console.log('fileInfo getComWavesurfer')
      return this.$store.state.video.wavesurfer
    },
    getComLcobtn() {
      return this.$store.state.player.lcobtn
    },
    getComResdata() {
      console.log('getComResdata')
      return this.$store.state.video.resData
    },
    // getComCallid() {
    //   return this.$store.state.ql.callid
    // },
    // getComParams(){
    //   return this.$store.state.ql.params
    // }
    // getComLanguageName() {
    //   return this.$store.state.languageName
    // }
  },
  watch: {
    getComWavesurfer() {
      // console.log('fileInfo watch getComWavesurfer')
      // this.wavesurfer = this.getwavesurfer()
      // console.log(this.wavesurfer)
    },
    getComLcobtn(){
      this.lcobtn = this.getlcobtn()
    },
    getComResdata(){
      if(this.getVideoData().type==='local' || this.getVideoData().type==='speaker'){
        this.resdata = {
          callid: false
        }
        return
      }

      this.resdata = this.getVideoResData()
      this.callid = this.resdata.callid

      this.gendervalue = this.resdata.gender
      this.languagevalue = this.resdata.languagename
      this.billLevel = this.resdata.appended.calllevel
      this.status = this.resdata.appended.veracitymark

      // console.log('getComResdata')
      // console.log(this.resdata)
      // console.log('this.gendervalue')
      // console.log(this.gendervalue)
      // console.log('this.languagevalue')
      // console.log(this.languagevalue)
      // console.log('this.status')
      // console.log(this.status)

      // console.log('fileInfo')
      // console.log(this.resdata)

      // this.status = this.resdata.status
      // this.billLevel = this.resdata.billLevel

      // if(!this.getVideoResData().kwdresult){
      //   return
      // }

      // getLanguageName().then(res => {
        this.setTargets()
      // })
      this.setPlatform()
      
    },
    // getComCallid() {
    //   this.callid = this.getcallid()
    // },
    // getComParams(){
    //   this.params = this.getparams()
    // }
  }, 
  methods: {
    ...mapActions(['VIDEO_RES_DATA','WAVESURFER_DATA','PARAMS_DATA','LCOBTN_DATA','COUNTLANG','KEYWORD','BILL_STATUS']),
    ...mapGetters(['getwavesurfer','getVideoResData','getVideoData','getlcobtn','getPlatform']),
    dataFormat(t) {
      return new Date(Number(`${t}000`)).format("yyyy-MM-dd hh:mm:ss")
    },
    showKeyWords (item) {
      // console.log('showKeyWords')
      // console.log(item)
      this.$emit('childPlay', item.begin)
    },
    radioChange() {
      this.keywordsRadio = false
      this.speakersRadio = false
      this.speechsegsRadio = false
      this[`${this.radio}Radio`] = true
    },
    groupName(item) {
      // return `<bdi>${item.keyword}</bdi> - ${item.data.length}条`
      return `<span class='title-text'><bdi>${item.keyword}</bdi></span><span class='title-count'> - ${item.data.length}条</span>`
    },
    keywordsGroup() {
      this.data1 = []
      if(!this.resdata.appended.kwdhits){
        return
      }
      let data = this.resdata.appended.kwdhits.vchannel
      for(let k in data){
        data[k].selected = false
      }
      this.keywordsList = data
      let hash = {}
      // let data1 = data.reduce(function(item,next){
      //   hash[next.keyword] ? '' : hash[next.keyword] = true && item.push(next)
      //   return item
      // }, [])
      data = data.reduce(function(item,next){
        if(hash[next.keyword]){
          item[next.keyword].push(next)
        }else{
          hash[next.keyword] = true
          item[next.keyword] = []
          item[next.keyword].push(next)
        }

        return item
      }, [])
      console.log('keywordsGroup')
      console.log(data)
      for(let k in data){
        this.data1.push({
          keyword: k,
          data: data[k]
        })
      }
      console.log(this.data1)

    },
    setTargets() {
      this.keywordsValue = []
      this.speakersValue = []
      this.speechsegsValue = []
      this.keywordsList = []
      this.speakersList = []
      this.speechsegsList = []
      // if(this.resdata.appended.kwdhits){
      //   if(this.resdata.appended.kwdhits.combiner){
      //     this.keywordsList = this.resdata.appended.kwdhits.combiner
      //   }else if(this.resdata.appended.kwdhits.achannel){
      //     this.keywordsList = this.resdata.appended.kwdhits.achannel
      //   }
      // }

      // for(let k = 0;k < this.keywordsList.length;k++){
      //   this.keywordsValue.push((this.keywordsList[k].veracitymark))
      // }
      this.keywordsGroup()
      if(this.resdata.appended.speakerhits){
        if(this.resdata.appended.speakerhits.vchannel){
          this.speakersList = this.resdata.appended.speakerhits.vchannel
        }
      }
      if(this.resdata.appended.speechseghits){
        if(this.resdata.appended.speechseghits.vchannel){
          this.speechsegsList = this.resdata.appended.speechseghits.vchannel
        }
      }
      for(let k = 0;k < this.speechsegsList.length;k++){
        this.speechsegsValue.push((this.speechsegsList[k].veracitymark))
      }
    },
    setPlatform() {
      // console.log('getComResdata')
      // console.log(this.resdata)
      // console.log(this.getPlatform())
      let data = this.getPlatform()
      for(let i=0;i<data.length;i++){
        if(data[i].value == this.resdata.platformid){
          return data[i].label
        }
      }
      return this.resdata.platformid
    },
    statusChanged() {

      let d = new Date()
      this.BILL_STATUS({
        dateFlag: d,
        status: this.status
      })
      let params = new URLSearchParams()
      params.append('callid',this.callid)
      params.append('spyid',100)
      params.append('status',this.status)
      params.append('billLevel',this.billLevel)
      params.append("recordType", "video")

      changecallstatus(params).then(res => {
        console.log(res)
      })
    },
    baseChanged() {
      console.log('baseChanged')
      console.log('this.billLevel')
      console.log(this.billLevel)
      console.log('this.status')
      console.log(this.status)
      console.log(typeof this.status)
      let d = new Date()
      this.BILL_STATUS({
        dateFlag: d,
        level: this.billLevel,
        gender: this.gendervalue,
        status: this.status,
        // segments: this.billLevel,
        language: this.languagevalue,
      })

      let params = new URLSearchParams()
      params.append('callid',this.callid)
      params.append('language',this.languagevalue)
      params.append('gender',this.gendervalue)
      params.append('callLevel',this.billLevel)
      // params.append('veracityMark',this.status)
      if(this.status=="null" || this.status==null){
      }else{
        params.append('veracityMark',this.status)
      }
      params.append("recordType", "video")

      updateInfo(params,this.callid).then(res => {
        console.log('baseChanged')
        console.log(res)
      })
    },
    toMinutes(s) {
      return this.Utils.toMinutes(s)
    },
    markChanged(item,index,type){
      // console.log('markChanged')
      // console.log('item')
      // console.log(item)
      // console.log('index')
      // console.log(index)
      // console.log('type')
      // console.log(type)

      let params = new URLSearchParams()
      params.append('type',type)
      params.append('keyId',`${item.keyword}-${parseInt((item.begin)*1000)}`)
      params.append("recordType", "video")
      if(type == 'keyword'){
        params.append('value',item.veracitymark)
      }else{
        params.append('value',this.keywordsValue[index])
      }
      
      correctnessMark(params,this.getVideoResData().callid).then(res => {
        console.log(res)
      })
    }

  },
  
  beforeCreate() {
    
  },
  created() {

  },
  beforeMount() {
    // console.log('beforeMount')
    // console.log(this)
  },
  mounted () {
    
  
    // this.gendervalue = this.genderTrans[this.gendervalue]
    
  },
  beforeUpdate () {

  },
  updated() {

  },
  activated() {

  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.delete_icon{
  display: none;
  float: right;
}
.deleteOverall{
  text-align: center;
}

.fileInfo{
  background-color: #767783;
  margin-left: 8px;
  color: #fff;
  
  ul.lcontent-list{
    li{
      height: 25px;
      margin-top: 5px;
      // &:nth-child(7){
      //   padding-top: 10px;
      //   .line{
      //     width: 210px;
      //     height: 1px;
      //     background-color: #666;
      //   }
      // }

    }
  }
  div.lcontent-list{
    .green{
      color: #7fef7c;
    }
    .radioGroup{
      margin: 10px 0 15px 0;
    }
    .keyword-list,.speechseg-list{
      display: flex;
      flex-wrap: wrap;
      li{
        display: flex;
        margin-bottom: 10px;
        span{
          display: inline-block;
          // white-space:nowrap;
          word-break:break-all;
        }
        color: #fff;
        text-decoration: underline;
        margin-top: 0;
        margin-right: 10px;
        &.targetWords_selected{
          position: relative;
          // color: #3c99de;
          color: #ffdc6d;
        }
        &.targetWords_selected:after{
          content: "";
          background: url("../../static/images/点.png") no-repeat;
          // background-size: .18rem .18rem;
          position: absolute;
          width: 18px;
          height: 18px;
          right: 0px;
          // top: 0;
          top: -12px;
        }
      }
      
    }
    .wave-list{
      display: flex;
      flex-wrap: wrap;
      max-height: 250px;
      overflow: auto;
      li{
        color: #fff;
        margin-top: 0;
        margin-right: 10px;
        
      }
    } 
  }
}

</style>
<style lang="scss">

.fileInfo{

  .list-group-item1{
    .el-select{
      margin-right: 8px;
    }
    .el-input__inner{
      color: #000;
      background-color: #bcbfc9;
      border: 1px solid #000 !important;
    }
    .el-input__icon{
      color: #323330 !important;
    }
    .item_selected{
      color: #ffdc6d;
    }
  }
  .el-input,.el-input__inner{
    width: 146px;
    height: 22px;
  }
  .el-select__caret{
    line-height: 22px;
  }

  div.lcontent-list{
    .el-input,.el-input__inner{
      width: 90px;
    }
  }
  .el-radio-button:first-child .el-radio-button__inner{
    border-left: 1px solid #1e1e2f;
  }
  .el-radio-button__inner{
    background-color: #43454d;
    color: #8f9198;
    border-color: #1e1e2f;
    box-shadow: none;
    
  }
  .el-radio-button__orig-radio:checked+.el-radio-button__inner{
    background-color: #6f7179;
    border-color: #1e1e2f;
    // border: 1px solid #1e1e2f;
    color: #fff;
    box-shadow: none;
  }

  .el-radio-button__inner:hover {
    color: #6f7179;
  }

  .el-radio-button--mini .el-radio-button__inner{
    padding: 7px 10px;
  }
  li.short{
    .el-input,.el-input__inner,.el-select{
      width: 103px;
    }
  }
  .title-text {
    color: #fff;
  }
  .title-count {
    color: #ccc;
  }
  .el-cascader-menu__item--extensible:after, .el-icon-arrow-right:before {
    color: #ccc;
  }

}
  
</style>