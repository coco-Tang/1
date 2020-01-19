<template>
  <div class="transcribe" >
    <div  class="child child1 hidden" :class="{'show':rcobtn}">
      <div class="rendered" v-if="resdata.appended.trans">
        <div class="t_item">
          <div >
            <!-- {{transList[0].segments}} -->
            <div v-for="(item,index) in transList[0].segments">
              <!-- <div v-if="item.flag=='A'" v-bind:class="{ 'hidden' : hiddenSegments.caller }"> -->
              
              <!-- <div v-else-if="item.flag=='B'" v-bind:class="{ 'hidden' : hiddenSegments.callee }"> -->
              <!-- <div v-if="item.flag=='B'"  v-bind:class="{ 'hidden' : hiddenSegments.callee }">
                <div class="call">
                  <div class="top">
                    <div class="icon">
                      <span class="callName" :title="resdata.callee">V 路</span>
                    </div>
                    <div class="time111" :class="{hidden: !timeFlag}">{{tiemFormat(item.begin)}}～{{tiemFormat(item.end)}}</div>
                  </div>
                  <div class="bottom">
                    <div class="text" @click="textPlay(item,$event)"><span class="triangle"></span><div v-html="item.content" class="pathcontent" ></div></div>
                  </div>  
                </div>
              </div> -->
              <div  v-bind:class="{ 'hidden' : hiddenSegments.caller }">
                <div class="called">
                  <div class="top">
                    <div class="icon">
                      <!-- <span v-if="resdata.caller===null">未知</span> -->
                      <!-- <span class="callName" :title="resdata.caller" v-else>{{resdata.caller}}</span> -->
                      <span class="callName" :title="resdata.caller"></span>
                    </div>
                    <div class="time111" :class="{hidden: !timeFlag}">{{tiemFormat(item.begin)}}～{{tiemFormat(item.end)}}</div>
                  </div>
                  <div class="bottom" >
                    <div class="text" @click="textPlay(item,$event)"><span class="triangle"></span><div v-html="item.content" class="pathcontent" ></div></div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>


import {mapActions,mapGetters} from 'vuex'
import {updateAsrs,annotations,unpdateAnnotations} from '@/api/player.js'
// import {updateEdit,textMerge,getCallidData,textSplitting,signSegment,removeSign,exportTextGrid,annotation,getLanguage} from '@/api/ql.js'
// import hotkeys from 'hotkeys-js';
// import hotkeys from '@/hotkeys/dist/hotkeys.js';
import * as util from '@/utils/index'
export default {
  name: 'transcribe',
  data () {
    return {
      rcobtn:true,
      hiddenSegments:{
        caller: false,
        callee: false
      },
      wavesurfer:{},
      resdata:{},
      params:{},
      isplay: true,
      timeArr:{
        begintime:[],
        endtime:[],
        flag:[],
        filetag:[],
        index:[],
        text:[]
      },
      oldTimeArr:{},
      Interval:{
        displayTime:null,
        timeout:null,
        blurTime:null
      },
      cache:null,
      editFlag: false,
      callid: '',
      keyWord:{
        content: '',
        start: '',
        end: ''
      },
      selectIndex: '',
      disHandle: null,
      // IntervalFlag : false,
      syncRollFlag: false,
      timeFlag: false,
      flag: true,
      tableData: [],
      multipleSelection: null,
      genderOptions: [{
        label: '男',
        value: 1
      }, {
        label: '女',
        value: 2
      }, {
        label: '不确定',
        value: 0
      }],
      langOptions: [],
      genderTrans: ['不确定','男','女'],
      currentPlayingItems: [],
      oldTrans: '',
      newTrans: '',
      transList: []
    }
  },

  computed:{
    getComResdata() {
      return this.$store.state.video.resData
    },
  //   // getComParams() {
  //   //   return this.$store.state.params
  //   // },
    getComRcobtn() {
      return this.$store.state.player.rcobtn
    },
    getComIsplay() {
      // console.log('computed getComIsplay')
      // console.log(this.$store.state.player.isplay)
      // this.isplay = this.getisplay()
      return this.$store.state.player.isplay
    },
    getComWavesurfer() {
      return this.$store.state.player.wavesurfer
    },
  //   getComCallid() {
  //     return this.$store.state.ql.callid
  //   },
    getComkeyWord() {
      return this.$store.state.player.keyWord.start
    },
    getComAnnotation() {
      return this.$store.state.player.annotationData
    },
  //   getCompathChange() {
  //     return this.getpathChange()
  //   },
  //   // getComRangeIndex() {
  //   //   return this.getRangeIndex()
  //   // }
  },
  watch: {
    getComWavesurfer() {
      // this.rangeIndex = this.getRangeIndex()
      this.wavesurfer = this.getwavesurfer()

      console.log('getComWavesurfer')
      console.log(this.wavesurfer)
      // this.syncDisplay()
    },
    getComResdata() {
      console.log('this.getVideoResData()')
      console.log(this.getVideoResData())
      this.resdata = this.getVideoResData()
      this.callid = this.getVideoData().callid // 由于vuex中resdata的结构不一致, 所以callid不能由this.getVideoResData().callid得出
      // this.timeArrInit()
           // /tableData
      // console.log('transcribe')
      // console.log(this.resdata)

      
      // this.wavesurfer = this.getwavesurfer()
      // this.cache = 0

      // if(!this.resdata.annotation){
      //   return
      // }
      // this.setTable()
      this.transList = []
      if(this.resdata.appended.trans){
        if(this.resdata.appended.trans.vchannel){
          this.transList = this.resdata.appended.trans.vchannel
        }
      }else{
        this.transList = []
      }
      console.log('this.transList')
      console.log(this.transList)
      // this.syncDisplay()
      // console.log('getComResdata')
      // console.log(this.resdata)
      // console.log(this.timeArr)
    },
    getComRcobtn(){
      this.rcobtn = this.getrcobtn()
      console.log('%cwatch----getComRcobtn--this.rcobtn:', 'font-weight:700',this.rcobtn)
    },
  //   // getComParams(){
  //   //   this.params = this.getparams()
      
  //   //   console.log('$store.state.params')
  //   //   console.log(this.params)
  //   // },
    getComIsplay() {
      return
      this.isplay = this.getisplay()
      // this.isplay = this.$store.state.player.isplay
      // this.rangeIndex = this.getRangeIndex()

      // console.log('watch getComIsplay')
      // console.log(this.isplay)
      // if(!this.getVideoResData().kwdresult){
      if(!this.getVideoResData().appended.trans){
        return
      }
      this.syncDisplay()
      // console.log('$store.state.isplay')
      
    },
  //   getComCallid() {
  //     this.callid = this.getcallid()
  //     // console.log('getComCallid')
  //     // console.log(this.callid)
  //   },
    getComkeyWord() {
      this.keyWord = this.getkeyWord()
      this.showKeyWord()
    },
    getComAnnotation() {
      // setTable(this.getannotationData())
    }
  //   getCompathChange() {
  //     this.syncDisplay()
  //   },
  //   // getComRangeIndex() {
  //   //   this.rangeIndex = this.getRangeIndex()
  //   // }
  }, 
  methods: {
    ...mapActions(['VIDEO_RES_DATA','WAVESURFER_DATA','PARAMS_DATA','LCOBTN_DATA','ISPLAY','SYNCROLLFLAG','RCOBTN_DATA']),
    ...mapGetters(['getVideoResData','getwavesurfer','getisplay','getkeyWord','getrcobtn','getVideoData','getannotationData','gettimeFlag']),
    setLanguage() {
      this.langOptions = []
      getLanguage().then(res => {
        // console.log('getLanguage')
        // console.log(res)
        for(let k = 0; k < res.data.length; k++){
          this.langOptions.push({
            value: res.data[k].name,
            label: res.data[k].name
          })
        }
        // console.log(this.langOptions)
      })
    },
    renderHeader(createElement, { column }) {
      return createElement(
        'div',
        {
          class: 'headDelete',
 
          on: {
            click: this.deleteBatch
          },
        }
      );
    },
    textPlay(item,e) {
      // console.log('textPlay')
      // console.log('item')
      // console.log(item)
      this.$emit('childPlay', item.begin)
    },
    contentChanged(row) {
      // console.log('contentUpdate')
      // console.log(row)
      this.tableUpdate(row)
    },
    genderChanged(row) {
      // console.log('genderChanged')
      // console.log(row)
      this.tableUpdate(row)
    },
    langChanged(row) {
      // console.log('langChanged')
      // console.log(row)
      this.tableUpdate(row)
    },
    tableUpdate(row) {
      // console.log('tableUpdate')
      // console.log(row)
      let params = new URLSearchParams();
      params.append('callId',this.getVideoResData().callid)
      // params.append('start',row.start*1000)
      // params.append('end',row.end*1000)
      params.append('start',row.start)
      params.append('end',row.end)
      // params.append('lengthtime',row.duration*1000)
      // // params.append('speaker',this.ruleForm.speaker)
      // params.append('language',row.lang)
      // params.append('sex',row.gender)
      params.append('content',row.content)

      unpdateAnnotations(params,this.getVideoResData().callid).then(res => {
        console.log(res)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setTable() {
      
      this.tableData = []
      let data;
      console.log('setTable--this.resdata:', this.resdata)
      if (this.resdata) {
        if (this.resdata.appended.annotation) { // getData的VIDEO_RES_DATA所存
          data = this.resdata.appended.annotation.combiner.annotationlist;
        } else {                       // annotations中所存
          // data = this.resdata.combiner.annotationlist;
          // data = this.resdata.appended.annotation;
          return
        }
        data.map(el => {
          this.tableData.push({
            start: el.start,
            end: el.end,
            duration: el.end - el.start,
            content: el.content
          })
        })
      } else {
        console.error('this.resdata无数据')
      }
      
      
      console.log('setTable--this.tableData:', this.tableData)
    },
    timeSwitch(flag){
      this.timeFlag = flag
      console.log('this.timeFlag')
      console.log(this.timeFlag)
      
    },

    getSegments(){
      getCallidData(this.callid).then(res => {
        this.resdata = res.data
        this.VIDEO_RES_DATA(this.resdata)
        
      })
    },
    tiemFormat(value){
      var secondTime = parseInt(value);// 秒
      var minuteTime = 0;// 分
      var hourTime = 0;// 小时
      if(secondTime > 60) {//如果秒数大于60，将秒数转换成整数
          //获取分钟，除以60取整数，得到整数分钟
          minuteTime = parseInt(secondTime / 60);
          //获取秒数，秒数取佘，得到整数秒数
          secondTime = parseInt(secondTime % 60);
          //如果分钟大于60，将分钟转换成小时
          if(minuteTime > 60) {
              //获取小时，获取分钟除以60，得到整数小时
              hourTime = parseInt(minuteTime / 60);
              //获取小时后取佘的分，获取分钟除以60取佘的分
              minuteTime = parseInt(minuteTime % 60);
          }
      }
      var result = "" + parseInt(secondTime);

      if(minuteTime > 0) {
        result = "" + parseInt(minuteTime) + ":" + result;
      }
      if(hourTime > 0) {
        result = "" + parseInt(hourTime) + ":" + result;
      }
      return result;
    }
  },
  
  beforeCreate() {
    
  },
  created() {

    console.log('--------- transcribe created ----------')
    // this.setLanguage()


    //init
    this.resdata = this.getVideoResData()
    console.log('this.resdata:', this.resdata)
    this.wavesurfer = this.getwavesurfer()
    // this.callid = this.getcallid()
    // this.syncDisplay()
    this.rcobtn = this.getrcobtn()
    this.RCOBTN_DATA(this.getrcobtn())

    this.timeFlag = this.gettimeFlag()
  },
  beforeMount() {

  },
  mounted () {

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

.transcribe{
  .child{
    overflow-y: scroll;
        // padding-top: 5px;
    border: 1px solid #1f1f2f;
  }
  .child2{
    background-color: #fff;
    overflow: visible !important;
    .delete{
      width: 18px;
      height: 18px;
      background: url('../../static/images/删除默认.png');
      // background: url('../../static/images/删除选中.png');
      display: none;
      &:hover{
        background: url('../../static/images/删除选中.png');
      }
    }
  }
  
  .t_item{
    text-align: left;
    .called{
      display: flex;
      flex-direction: column;
      .top{
        display: flex;
        .icon{
          padding: 1px 3px;
          // color: #fff;
          border-radius: 15px;
          // background-color: #ffa6b5;
          text-align: center;
          margin: 10px 0 0 10px;
          .callName{
            width: 60px;
            text-overflow:ellipsis;
            overflow:hidden;
            display:block;
          }
        }
        .time{
          color: #666;
          margin: 10px 0 0 20px;
        }
        .sign{
          width: 24px;
          height: 24px;
          background: url("../../static/images/unExport.png") no-repeat;
          margin: 8px;
          // position: absolute;
          
        }
      }
      .bottom{
        // position: relative;
        display: flex;
        flex-direction: column;
        .text{
          // max-width: calc(100% - 80px - 60px);
          // max-width: calc(100% - 230px - 60px);
          max-width: calc(100% - 90px);
          align-self: baseline;
          // flex-grow: 2;
          color: #666;
          // margin-left: 78px;
          margin-left: 30px;
          background-color: #fff;
          padding: 5px;
          border-radius: 3px;
          box-shadow: 0 2px 10px 1px #ccc;
          line-height: 20px;
          // flex-shrink: 0;
          position: relative;
          -webkit-user-select:none;
          -moz-user-select:none;
          // user-modify: read-write-plaintext-only;
          // -webkit-user-modify: read-write-plaintext-only;
          &.selected{
            background-color: #a9ebf2;
            .triangle{
              background: url("../../static/images/左蓝.png") no-repeat;
            }
          }
          &.unExport{
            color: red;
          }
          .triangle{
            width: 8px;
            height: 8px;
            position: absolute;
            left: -8px;
            top: 5px;
            background: url("../../static/images/左白.png") no-repeat;
            background-size: 8px 8px;
          }
        }
        .text_select{
          margin-left: 58px;
          margin-top: 10px;
          display: flex;
          .icons{
            width: 18px;
            height: 18px;
            margin-right: 10px;
          }
        }
        .sign{
          width: 24px;
          height: 24px;
          background: url("../../static/images/unExport.png") no-repeat;
          margin: 8px;
          // position: absolute;
          
        }
      }
    }
    .call{
      display: flex;
      flex-direction: column;
      .top{
        display: flex;
        flex-direction: row-reverse;
        .icon{
          padding: 1px 3px;
          // color: #fff;
          border-radius: 15px;
          // background-color: #399adb;
          text-align: center;
          margin: 10px 0 0 10px;
          .callName{
            width: 60px;
            text-overflow:ellipsis;
            overflow:hidden;
            display:block;
          }
        }
        .time{
          color: #666;
          margin: 10px 0 0 20px;
        }
      }
      .bottom{
        display: flex;
        flex-direction: row-reverse;
        flex-wrap: wrap;
        .text{
          max-width: calc(100% - 90px);
          align-self: baseline;
          color: #666;
          margin-right: 70px;
          background-color: #fff;
          padding: 5px;
          border-radius: 3px;
          box-shadow: 0 2px 10px 1px #ccc;
          line-height: 20px;
          position: relative;
          -webkit-user-select:none;
          -moz-user-select:none;
          // user-modify: read-write-plaintext-only;
          // -webkit-user-modify: read-write-plaintext-only;
          &.selected{
            background-color: #a9ebf2;
            .triangle{
              background: url("../../static/images/右蓝.png") no-repeat;
            }
          }
          &.unExport{
            color: red;
          }
          .triangle{
            width: 8px;
            height: 8px;
            position: absolute;
            right: -8px;
            top: 5px;
            background: url("../../static/images/右白.png") no-repeat;
            background-size: 8px 8px;
          }
        }
        .text_select{
          margin-right: 58px;
          margin-top: 10px;
          display: flex;
          .icons{
            width: 18px;
            height: 18px;
            margin-right: 10px;
            // margin: 11px 0 0 10px;
          }
        }

        .sign{
          width: 24px;
          height: 24px;
          background: url("../../static/images/unExport.png") no-repeat;
          margin: 8px;
        }
      }
    }
  }
}

</style>
<style lang="scss">
  .transcribe{
    .child2{
      .el-table__row:hover{

        .delete{
          display: block !important;
        }
      }
    }
    .headDelete{

      width: 18px;
      height: 18px;
   
      background: url('../../static/images/删除默认.png');
      &:hover{
        background: url('../../static/images/删除选中.png');
      }
    }
    height: 100%;
    .child{
      height: 100%;
      overflow: scroll;
      overflow-x:hidden;
      overflow-y:auto;
    }
    .text{
      .pathcontent{
        word-wrap:break-word;
      }
    }
    .text_select{
      width: 230px;
      // line-height: 40px;
      align-items: center;
      .el-button{
        height: 24px;
        padding: 0px;
        border-color: #606266;
        background: #606266;
        color: #fff;
        span{
          height: 24px;
          display:inline-block;
          line-height: 22px;
          padding: 0 4px;
        }
        &:hover {
            background: #fff;
            border-color: #606266;
            color: #606266;
        }
      }
    }


    .tb-edit .el-input {
      display: none
    }
    .tb-edit .current-row .el-input {
      display: block
    }
    .tb-edit .current-row .el-select {
      display: block
    }
    .tb-edit .current-row .el-input+span {
      display: none
    }
    .tb-edit .current-row .el-select+span {
      display: none
    }

    .child::-webkit-scrollbar{/*滚动条整体样式*/
      height: 20px;
    }
    .child::-webkit-scrollbar-thumb{/*滚动条里面小方块*/
      background: #80828c;
    }
    .child::-webkit-scrollbar-button{

    }
    .child::-webkit-scrollbar-track{/*滚动条里面轨道*/
      background: #5e5f69;
    }

    .bottom.test{
      margin-top: -20px;
    }
  }
</style>
