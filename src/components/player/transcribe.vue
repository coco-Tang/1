<template>
  <div class="transcribe" id="transcribe" >
    <div  class="child child1 hidden" :class="{'show':rcobtn}">
      <!-- <div class="rendered" v-if="resdata.combineflag==1 && resdata.appended.trans">
        <div class="t_item">
          <div >
            <div v-for="(item,index) in transList[0].segments">
              <div class="called">
                <div class="top">
                  <div class="icon">
                    <span class="callName" :title="resdata.caller">主叫</span>
                  </div>
                  <div class="time" :class="{hidden: !timeFlag}">{{tiemFormat(item.begin)}}～{{tiemFormat(item.end)}}</div>
                </div>
                <div class="bottom" :class="{test: !timeFlag}">
                  <div :data-num="index" @click="textPlay(item,$event)" @dblclick="edit(item,$event)" v-bind:class="{ 'selected' : timeArr.flag[index],'unExport': item.sign }" class="text"><span class="triangle"></span><div v-html="item.content" class="pathcontent" @blur="blur(item,$event)"></div></div>
                  <div class="text_select hidden">
                    <el-button @click="confirm(item,$event)" type="primary">保存</el-button>
                    <el-button @click="cancel(item,$event)" type="primary">取消</el-button>
                    <el-button @click="unExportSign(item,index,$event)" v-text="item.sign===1?'导出':'不导出'" type="primary">不导出</el-button>
                  </div>                  
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="rendered" v-if="resdata.appended.trans">
        <div class="t_item">
          <div >
            <!-- {{transList[0].segments}} -->
            <div v-for="(item,index) in transList[0].segments">
              <!-- <div v-if="item.flag=='A'" v-bind:class="{ 'hidden' : hiddenSegments.caller }"> -->
              
              <!-- <div v-else-if="item.flag=='B'" v-bind:class="{ 'hidden' : hiddenSegments.callee }"> -->
              <div v-if="item.flag=='B'"  v-bind:class="{ 'hidden' : hiddenSegments.callee }">
                <div class="call">
                  <div class="top">
                    <div class="icon">
                      <!-- <span v-if="resdata.callee===null">未知</span> -->
                      <!-- <span class="callName" :title="resdata.callee" v-else>{{resdata.callee}}</span> -->
                      <span class="callName" :title="resdata.callee">B 路</span>
                    </div>
                    <div class="time" :class="{hidden: !timeFlag}">{{tiemFormat(item.begin)}}～{{tiemFormat(item.end)}}</div>
                  </div>
                  <div class="bottom" :class="{test: !timeFlag}">
                    <div v-on:click="textPlay(item,$event)" v-on:dblclick="edit(item,$event)" :data-num="index" v-bind:class="{ 'selected' : timeArr.flag[index],'unExport': item.sign }" class="text"><span class="triangle"></span><div v-html="item.content" class="pathcontent" v-on:blur="blur(item,$event)"></div></div>
                    <div class="text_select hidden">
                      <el-button @click="confirm(item,$event)" type="primary">保存</el-button>
                      <el-button @click="cancel(item,$event)" type="primary">取消</el-button>
                      <el-button @click="unExportSign(item,index,$event)" v-text="item.sign===1?'导出':'不导出'" type="primary">不导出</el-button>
                    </div>
                  </div>  
                </div>
              </div>
              <div v-else v-bind:class="{ 'hidden' : hiddenSegments.caller }">
                <div class="called">
                  <div class="top">
                    <div class="icon">
                      <!-- <span v-if="resdata.caller===null">未知</span> -->
                      <!-- <span class="callName" :title="resdata.caller" v-else>{{resdata.caller}}</span> -->
                      <span class="callName" :title="resdata.caller">A 路</span>
                    </div>
                    <div class="time" :class="{hidden: !timeFlag}">{{tiemFormat(item.begin)}}～{{tiemFormat(item.end)}}</div>
                  </div>
                  <div class="bottom" :class="{test: !timeFlag}">
                    <div v-on:click="textPlay(item,$event)" v-on:dblclick="edit(item,$event)" :data-num="index" v-bind:class="{ 'selected' : timeArr.flag[index],'unExport': item.sign }" class="text"><span class="triangle"></span><div v-html="item.content" class="pathcontent" v-on:blur="blur(item,$event)"></div></div>
                    <div class="text_select hidden">
                      <el-button @click="confirm(item,$event)" type="primary">保存</el-button>
                      <el-button @click="cancel(item,$event)" type="primary">取消</el-button>
                      <el-button @click="unExportSign(item,index,$event)" v-text="item.sign===1?'导出':'不导出'" type="primary">不导出</el-button>
                    </div>
                  </div>  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="child child2 hidden" :class="{'show':!rcobtn}">

      <el-table
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        height="100%"
        class="tb-edit" 
        highlight-current-row
        @current-change = "currentChange"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="45">
        </el-table-column>
        <el-table-column label="序号" type="index" width="50">
        </el-table-column>
        <el-table-column  label="标注内容" >
          <template slot-scope="scope">
            <el-input size="small" @blur="contentChanged(scope.row)" v-model="scope.row.content" placeholder="请输入内容"></el-input> <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="开始(S)"  width="70">
          <template slot-scope="scope">
            <span>{{scope.row.start/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="结束(S)"  width="70">
          <template slot-scope="scope">
            <span>{{scope.row.end/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="时长(S)"  width="70">
          <template slot-scope="scope">
            <span>{{scope.row.duration/1000}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column  label="性别"  width="120">
          <template slot-scope="scope">
            <el-select @change="genderChanged(scope.row)" v-model="scope.row.gender" placeholder="请选择">
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select><span>{{genderTrans[scope.row.gender]}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="语种"  width="120">
          <template slot-scope="scope">
            <el-select v-model="scope.row.lang" @change="langChanged(scope.row)" placeholder="请选择">
              <el-option
                v-for="item in langOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select><span>{{scope.row.lang}}</span>
          </template>
        </el-table-column> -->
        <el-table-column width="53"
         :render-header="renderHeader">
          <template slot-scope="scope">
            <div class="delete" @click="deleteRow(scope.row)"></div>
          </template>
        </el-table-column>
      </el-table>
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
      return this.$store.state.player.resData
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
      this.resdata = this.getResData()
      this.callid = this.getPlayerData().callid // 由于vuex中resdata的结构不一致, 所以callid不能由this.getResData().callid得出
      // this.timeArrInit()
           // /tableData
      // console.log('transcribe')
      // console.log(this.resdata)

      
      this.wavesurfer = this.getwavesurfer()
      this.cache = 0

      // if(!this.resdata.annotation){
      //   return
      // }
      this.setTable()
      this.transList = []
      if(this.resdata.appended.trans){
        if(this.resdata.appended.trans.combiner){
          this.transList = this.resdata.appended.trans.combiner
        }else if(this.resdata.appended.trans.achannel){
          this.transList = this.resdata.appended.trans.achannel
        }else if(this.resdata.appended.trans.bchannel){
          this.transList = this.resdata.appended.trans.bchannel
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
      this.isplay = this.getisplay()
      // this.isplay = this.$store.state.player.isplay
      // this.rangeIndex = this.getRangeIndex()

      // console.log('watch getComIsplay')
      // console.log(this.isplay)
      // if(!this.getResData().kwdresult){
      if(!this.getResData().appended.trans){
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
      setTable(this.getannotationData())
    }
  //   getCompathChange() {
  //     this.syncDisplay()
  //   },
  //   // getComRangeIndex() {
  //   //   this.rangeIndex = this.getRangeIndex()
  //   // }
  }, 
  methods: {
    ...mapActions(['RES_DATA','WAVESURFER_DATA','PARAMS_DATA','LCOBTN_DATA','ISPLAY','SYNCROLLFLAG','RCOBTN_DATA']),
    ...mapGetters(['getResData','getwavesurfer','getisplay','getkeyWord','getrcobtn','getPlayerData','getannotationData','gettimeFlag']),
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
    deleteBatch() {
      console.log('delete all')
      console.log(this.multipleSelection)
      if (!this.multipleSelection) {
        this.$message.error('请选中需要删除的标注')
        return
      }
      let arr = this.multipleSelection,
          markRangeArr = [];
      arr.map(el => {
        markRangeArr.push(el.start + '_' + el.end)
      })

      let params = new URLSearchParams()
      params.append('ids', markRangeArr.join(','))
      params.append('startTime',this.getResData().starttime)
      console.warn('arr.join:', markRangeArr.join(','))
      this.$emit('deleteAnnotation', params, this.callid)
    },
    deleteRow(row) {
      console.log('deleteRow--row:', row)
      let markRange = row.start + '_' + row.end

      let params = new URLSearchParams()
      params.append('ids', markRange)
      params.append('startTime',this.getResData().starttime)

      this.$emit('deleteAnnotation', params, this.callid)
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
      params.append('callId',this.getResData().callid)
      // params.append('start',row.start*1000)
      // params.append('end',row.end*1000)
      params.append('start',row.start)
      params.append('end',row.end)
      // params.append('lengthtime',row.duration*1000)
      // // params.append('speaker',this.ruleForm.speaker)
      // params.append('language',row.lang)
      // params.append('sex',row.gender)
      params.append('content',row.content)
      params.append('startTime',this.getResData().starttime)

      unpdateAnnotations(params,this.getResData().callid).then(res => {
        console.log(res)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    setTable1(annoData) {
      if(annoData){
        this.tableData = []
        let data;
        data = annoData.combiner.annotationlist;
        data.map(el => {
          this.tableData.push({
            start: el.start,
            end: el.end,
            duration: el.end - el.start,
            content: el.content
          })
        })
      }else{
        this.tableData = []
        let data;
        console.log('setTable--this.resdata:', this.resdata)
        if (this.resdata) {
          if (this.resdata.appended.annotation) { // getData的RES_DATA所存
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
      }
      
      console.log('setTable--this.tableData:', this.tableData)
    },
    setTable() {
      
      this.tableData = []
      let data;
      console.log('setTable--this.resdata:', this.resdata)
      if (this.resdata) {
        if (this.resdata.appended.annotation) { // getData的RES_DATA所存
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
    syncDisplaySwitch(flag) {

      this.syncRollFlag = flag    
    },    
    syncDisplay () {
      // console.log('syncDisplay')

      // this.wavesurfer = this.getwavesurfer()
      // console.log('this.isplay')
      // console.log(this.isplay)
      // console.log('this.rangeIndex')
      // console.log(this.rangeIndex)
      if(!this.disHandle){
        this.disHandle = (p) => {
          var timeMs = p
          // var timeMs = Math.floor(p*1000)
          // console.log('disHandle',timeMs)
          var nearestItem = 0;
          var longestItem = 0;
          var longestDuration = 0;
          var inItems = [];   // 时间范围包含当前播放时间的所有items
          var percent = 0;
          var nearestDistance = 100000000;
          // var translist = this.resdata.appended.trans.combiner.segments
          var translist = this.transList[0].segments
          // console.log(translist)
          for (var i = 0, len = translist.length; i < len; i++) {

              var beginTime = translist[i].begin
              var endTime = translist[i].end
              if(timeMs > beginTime && timeMs < endTime) {
                  inItems.push(i);
                  if(endTime - beginTime > longestDuration) {
                      longestDuration = endTime - beginTime;
                      longestItem = i;
                  }
              }
              var distance = timeMs - beginTime;
              if (distance < 0) {
                  break;
              }
              if (distance < nearestDistance) {
                  nearestItem = i;
                  percent = beginTime / timeMs;
              }
          }
          if ( inItems !== this.currentPlayingItems) {
            this.currentPlayingItems.forEach((i) => {
              document.querySelector(`#transcribe .text[data-num="${i}"]`) ? document.querySelector(`#transcribe .text[data-num="${i}"]`).classList.remove('selected') : ''

            });

            inItems.forEach((i) => {
              document.querySelector(`#transcribe .text[data-num="${i}"]`) ? document.querySelector(`#transcribe .text[data-num="${i}"]`).classList.add('selected') : ''
            });
            this.currentPlayingItems = inItems;
          }

          if(this.syncRollFlag){
            return
          }

          let fatherElement = document.querySelector('#transcribe .child1')
          let selectElement = document.querySelectorAll('#transcribe .text.selected')
          let fatherTop = fatherElement.offsetTop
          let selectTop = selectElement[0]?selectElement[0].offsetTop:null

          this.syncRoll(selectTop,fatherTop)
        }

      }
      // console.log(this.wavesurfer)
      // console.log()
      if(this.isplay){
        this.wavesurfer.on('audioprocess',this.disHandle)
      }else{
        this.wavesurfer.un('audioprocess',this.disHandle)
      }

    },
    //同步滚动
    //cache 没有selected块时 保持滚动高度
    syncRoll (selectTop,fatherTop) {
      // console.log(selectTop)
      // console.log(fatherTop)

      // if(this.syncRollFlag){
      //   return
      // }
      let fatherElement = document.querySelector('#transcribe .child1')
      let height = document.querySelector('#transcribe .child1').offsetHeight
      let cache = this.cache

      // console.log('selectTop')
      // console.log(selectTop)
      // console.log('fatherTop')
      // console.log(fatherTop)
      // console.log('cache')
      // console.log(cache)

      if(!selectTop){
        fatherElement.scrollTop = cache
      }else if((selectTop-fatherTop)>(height/2) || (selectTop-fatherTop)<0){

        fatherElement.scrollTop = selectTop-fatherTop-height/2
        this.cache = fatherElement.scrollTop
      }

    },
    //点击转写播放
    textPlay (item,e) {

      console.log('textPlay')
      console.log('item')
      console.log(item)
      let timeout = this.Interval.timeout
      let that = this
      if(timeout){
        // console.log("timeout");
        clearTimeout(timeout);
      }
      
      //编辑时不触发点击播放事件
      let div = e.currentTarget
      if(div.querySelector('#transcribe .pathcontent').getAttribute('contentEditable')){
        return
      }

      this.Interval.timeout = setTimeout(function(){
        console.log('textPlay')
        console.log(that)
        console.log(that.wavesurfer)
        let begintime = item.begin
        let endtime = item.end
        // console.log(endtime)
        if(begintime - endtime == 0){
          // that.wavePlay(begintime,endtime+0.5)
          that.$emit('childPlay', begintime,endtime+0.5)
        }else{
          that.$emit('childPlay', begintime,endtime)
          // that.wavePlay(begintime,endtime)
          // this.Utils.waveRegion(that.wavesurfer,begintime,endtime,'rgba(0,180,0,.3)')
          util.waveRegion(that.wavesurfer,begintime,endtime,'rgba(0,180,0,.3)')
        }

        
      },300)
    },
    //编辑转写结果
    //editFlag：是否在编辑 用于编辑前后的播放状态记录
    edit (item,e) {
      // this.hotkeysbind()


      hotkeys.setScope('a')

      // console.log('hotkeys.getScope()')
      // console.log(hotkeys.getScope())

      let timeout = this.Interval.timeout
      if(timeout){
        clearTimeout(timeout);
      }
      if(this.wavesurfer.isPlaying()){
        this.editFlag = true
        this.$emit('childPlay')
      }

      let div = e.currentTarget
      // console.log('div')
      // console.log(e)
      // console.log(e.currentTarget)

      let childs = document.querySelectorAll('#transcribe .pathcontent')

      // console.log(childs)
      // console.log(childs[0].parentNode)
      // console.log(childs[0].parentNode.nextSibling)
      // console.log(childs[0].parentNode.nextSibling.nextSibling)
      for(var i=0;i<childs.length;i++){
        childs[i].removeAttribute("contentEditable")
        childs[i].parentNode.nextSibling.classList.add('hidden')
      }
      div.querySelector('#transcribe .pathcontent').setAttribute("contentEditable","true")
      div.nextSibling.classList.remove('hidden')
      div.querySelector('#transcribe .pathcontent').focus()

      this.oldTrans = div.querySelector('#transcribe .pathcontent').innerText
      // if(item.sign===1){
      //   // div.nextSibling.nextSibling.nextSibling.nextSibling.classList.add('hidden')
      //   div.parentNode.previousElementSibling.querySelector('.sign').classList.add('hidden')
      // }

    },
    //确认上传转写修改
    //
    confirm (item,e) {

      // hotkeys.deleteScope('a')
      hotkeys.setScope('b')

      if(this.Interval.blurTime){
        clearTimeout(this.Interval.blurTime)
      }

      let div = e.currentTarget
      div.parentNode.classList.add('hidden')
      div.parentNode.previousSibling.querySelector('#transcribe .pathcontent').removeAttribute("contentEditable")
      // if(item.sign===1){
      //   // div.parentNode.nextSibling.nextSibling.classList.remove('hidden')

        
      //   div.parentNode.parentNode.previousElementSibling.querySelector('.sign').classList.remove('hidden')
      // }

      let index = div.parentNode.previousSibling.getAttribute('data-num')
      this.newTrans = div.parentNode.previousSibling.querySelector('#transcribe .pathcontent').innerHTML
      if(this.editFlag){
        this.editFlag = false
        this.$emit('childPlay')
      }
      this.upload(index)
      this.uploadMessage()
    },
    //取消上传转写修改
    //
    cancel (item,e) {

      console.log('cancel')
      // console.log(item)

      // hotkeys.deleteScope('a')
      hotkeys.setScope('b')
      
      if(this.Interval.blurTime){
        clearTimeout(this.Interval.blurTime)
      }

      let div = e.currentTarget
      div.parentNode.classList.add('hidden')
      div.parentNode.previousSibling.querySelector('#transcribe .pathcontent').removeAttribute("contentEditable")
      // if(item.sign===1){
      //   // div.parentNode.nextSibling.nextSibling.classList.remove('hidden')
        
      //   div.parentNode.parentNode.previousElementSibling.querySelector('.sign').classList.remove('hidden')
      // }

      let index = div.parentNode.previousSibling.getAttribute('data-num')
      div.parentNode.previousSibling.querySelector('#transcribe .pathcontent').innerHTML = this.oldTrans

      if(this.editFlag){
        this.$emit('childPlay')
        this.editFlag = false
      }
      this.cancelMessage()

    },
    //失去焦点时自动上传转写修改
    //
    blur (item,e) {

      // console.log('blur')
      // console.log(item)
      // console.log(e)
      // return
      // hotkeys.deleteScope('a')

      hotkeys.setScope('b')

      if(!e.sourceCapabilities){
        if(this.editFlag){
          this.$emit('childPlay')
          this.editFlag = false
        }
        return
      }

      // console.log(this)
      let div = e.currentTarget
      // console.log('blur')
      // console.log(div)
      // console.log(div.parentNode)
      // console.log(div.parentNode.nextSibling)
      // console.log(div.parentNode.nextSibling.nextSibling)
      this.Interval.blurTime = setTimeout(() => {

        div.removeAttribute("contentEditable")
        div.parentNode.nextSibling.classList.add('hidden')
        // if(item.sign===1){
        //   // div.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.classList.remove('hidden')
        //   div.parentNode.parentNode.previousElementSibling.querySelector('.sign').classList.remove('hidden')
        // }
        // console.log('blur')
        let index = div.parentNode.getAttribute('data-num')
        this.oldTrans = div.innerHTML
        // console.log(index)
        // console.log(div.innerHTML)
        // this.upload(index)
        if(this.editFlag){
          this.$emit('childPlay')
          this.editFlag = false
        }
        this.uploadMessage()
        this.upload(index)
      }, 300)
    },
    //编辑转写结果上传
    upload (index) {
      // updateEdit(this.getcallid,params)
       
      // let filetag = this.timeArr.filetag[index]
      // let upindex = this.timeArr.index[index]
      // let text = this.timeArr.text[index]

      console.log('upload')
      // console.log(this.resdata.appendedtrans.combinersegments[0].segments)
      // console.log(this.resdata.appendedtrans.combinersegments[0].segments[index])
      console.log(index)
      let params = new URLSearchParams()
      params.append('callId',this.getResData().callid)
      params.append('flag','combiner')
      params.append('languageName',this.getResData().languagename)
      // params.append('start',this.resdata.appendedtrans.combinersegments[0].segments[index].begin)
      // params.append('end',this.resdata.appendedtrans.combinersegments[0].segments[index].end)
      params.append('start',this.transList[0].segments[index].begin)
      params.append('end',this.transList[0].segments[index].end)
      params.append('content',this.newTrans)
      params.append('startTime',this.getResData().starttime)
      // if(this.oldTimeArr.text[index]===text){
      //   return
      // }
      // params.append('updatebeforecontent',this.oldTimeArr.text[index])
      // params.append('updateaftercontent',text)
      // params.append('updatecontent',utils.diff(this.oldTimeArr.text[index],text))

      // console.log('updateEdit')
      // console.log(updateEdit)
      // console.log(this.getcallid())
      // updateEdit(this.getcallid(),params).then(res=>{
      //   this.oldTimeArr.text[index] = text
      //   // console.log('updateEdit')
      //   // console.log(res)
      // })
      updateAsrs(params,this.getResData().callid).then(res => {
        console.log(res)
      })
    },
    uploadMessage () {
      this.$message({
        message: '上传成功',
        type: 'success',
        duration: 2000
      })
    },
    cancelMessage () {
      this.$message({
        message: '取消上传',
        type: 'warning',
        duration: 2000
      })
    },
    showKeyWord () {
      let transcribe = document.querySelector('#transcribe')
      let ser = new RegExp(this.keyWord.content,"g")
     
      // console.log('showKeyWord')
      // console.log(ser)
      // console.log(this.keyWord)

      // var div = transcribe.querySelector('[data-num="2"]')
      // 
      // let items = this.resdata.appendedtrans.combinersegments[0].segments
      let items = this.transList[0].segments
      // console.log('items')
      // console.log(items)

       //清除高亮
      if(this.selectIndex && items[this.selectIndex]){
        items[this.selectIndex].content = items[this.selectIndex].content.replace(/<span style='color:#ff00cc'>/g, "")
        items[this.selectIndex].content = items[this.selectIndex].content.replace(/<\/span>/g, "")
      }
      

      //转写关键词高亮
      for(let i=0;i<items.length;i++){
        let start = items[i].begin
        let end = items[i].end
        // console.log(start)
        // console.log(end)
        if(this.keyWord.start >= start && this.keyWord.end <= end){
          // let div = transcribe.querySelector(`[data-num=\"${i}\"]`)
          
          items[i].content = items[i].content.replace(ser, "<span style='color:#ff00cc'>"+this.keyWord.content+"</span>")
          this.selectIndex = i
          return
        }
      }
      this.selectIndex = ''
    },
    currentChange(currentRow,oldCurrentRow) {

      // console.log('currentRow')
      // console.log(currentRow)
      // console.log('oldCurrentRow')
      // console.log(oldCurrentRow)
      if(!currentRow){
        return
      }

      this.Utils.waveRegion(this.wavesurfer,currentRow.start,currentRow.end,'rgba(0,180,0,.3)',false)

    },

    getSegments(){
      getCallidData(this.callid).then(res => {
        this.resdata = res.data
        this.RES_DATA(this.resdata)
        
      })
    },
    unExportSign(v,i,e) {

      console.log('exportSign')
      console.log(v)
      console.log(i)
      console.log(this.timeArr)

      hotkeys.setScope('b')

      if(this.Interval.blurTime){
        clearTimeout(this.Interval.blurTime)
      }

      if(v.sign){
        this.exportSign(v,i,e)
        return
      }

      let params = new URLSearchParams()
      params.append('callId',this.getResData().callid)
      params.append('start',this.transList[0].segments[i].begin)
      params.append('end',this.transList[0].segments[i].end)
      // params.append('position',i)
      params.append('flag','combiner')
      params.append('languageName',this.getResData().languagename)
      params.append('content',this.newTrans)
      params.append('startTime',this.getResData().starttime)
      params.append('noExport',true)

      updateAsrs(params,this.getResData().callid).then(res => {
        let div = e.target
        console.log(div)
        console.log(div.parentNode)
        console.log(div.parentNode.previousElementSibling)
        div.parentNode.classList.add('hidden')

        div.parentNode.previousElementSibling.querySelector('#transcribe .pathcontent').removeAttribute("contentEditable")

        if(this.editFlag){
          this.$emit('childPlay')
          this.editFlag = false
        }
        this.$message({
          message: res.data,
          duration: 2000
        })
        this.getSegments()
      })
    },
    exportSign(v,i,e){
      console.log(v)
      console.log(e)


      let params = new URLSearchParams()
      params.append('callId',this.getResData().callid)
      params.append('start',this.transList[0].segments[i].begin)
      params.append('end',this.transList[0].segments[i].end)
      // params.append('position',i)
      params.append('flag','combiner')
      params.append('languageName',this.getResData().languagename)
      params.append('content',this.newTrans)
      params.append('startTime',this.getResData().starttime)
      params.append('noExport',false)

      updateAsrs(params,this.getResData().callid).then(res => {
        let div = e.target
        div.parentNode.classList.add('hidden')

        div.parentNode.previousElementSibling.querySelector('#transcribe .pathcontent').removeAttribute("contentEditable")

        if(this.editFlag){
          this.$emit('childPlay')
          this.editFlag = false
        }
        this.$message({
          message: res.data,
          duration: 2000
        })
        this.getSegments()
      })

      // removeSign(this.callid,params).then(res => {
      //   let div = e.target
      //   div.parentNode.classList.add('hidden')

      //   div.parentNode.previousElementSibling.querySelector('#transcribe .pathcontent').removeAttribute("contentEditable")

      //   if(this.editFlag){
      //     this.$emit('childPlay')
      //     this.editFlag = false
      //   }
      //   this.$message({
      //     message: res.data,
      //     duration: 2000
      //   })
      //   this.getSegments()
      // })


    },
    //"00:00:00:020"
    //let arr = "00:00:00:020".split(':')
    // tiemFormat(str) {
    //   return
    //   let arr = str.split(':')
    //   let nstr = ''
    //   let m,s,ms
    //   nstr = `${(arr[0]-0)*60+(arr[1]-0)}:${arr[2]-0}:${arr[3]-0}`
    //   m = (arr[0]-0)*60+(arr[1]-0) 
    //   if(m < 10){
    //     m = `0${m}`
    //   }
    //   s = arr[2]-0
    //   if(s < 10){
    //     s = `0${2}`
    //   }
    //   ms = arr[3]-0
    //   if(ms < 10){
    //     ms = `00`
    //   }else if(ms <100){
    //     ms = `0${Math.round(ms/10)}`
    //   }else{
    //     ms = `${Math.round(ms/10)}`
    //   }
    //   return nstr = `${m}:${s}:${ms}`
    // }
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
    this.resdata = this.getResData()
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
    document.querySelector("#transcribe .child1").onmousewheel = (e) => {
      // console.log(e)  
      this.syncRollFlag = true
      this.SYNCROLLFLAG(this.syncRollFlag)   
    }
    console.error("transcribe")
    
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
          margin-left: 78px;
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
