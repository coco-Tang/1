<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-08-19 15:05:32
 * @Description: 播放器组件
 -->

<template>
  <!-- :class="{ 'hidden' : hidden }" -->
	<div class="quicklisten"
  
  >

    <mark-dialog @setAnnotation="callSetGetMark" ref="c2"></mark-dialog>
    <output-dialog @setAnnotation="callSetGetMark" ref="c3"></output-dialog>
		<div class="title">
			<ul>
				<li @click="copy" title="复制(ctrl+c)"><span></span></li>
        <li @click="cut" title="剪切(ctrl+x)"><span></span></li>
        <li @click="paste" title="粘贴(ctrl+v)"><span></span></li>
        <li @click="undo" title="撤销(ctrl+z)"><span></span></li>
        <li @click="redo" title="恢复(ctrl+r)"><span></span></li>
        <li @click="del" title="删除(delete)"><span></span></li>
        <li @click="amplitudeBig" title="信号增强(alt+7)"><span></span></li>
        <li @click="amplitudeSmall" title="信号减弱(alt+8)"><span></span></li>
        <li @click="zoomIn" title="放大(=)"><span></span></li>
        <li @click="zoomOut" title="缩小(-)"><span></span></li>
        <li @click="leftSelect" title="向前选中(shift+←)"><span></span></li>
        <li @click="rightSelect" title="向后选中(shift+→)"><span></span></li>
        <li @click="zoomFit" title="放大到全屏(alt+=)"><span></span></li>
        <li @click="cyclePlay" title="指定播放(alt+9)"><span></span></li>
        <li @click="myexport" title="保存片段(alt+s)"><span></span></li>
        <li @click="uploadSpeaker" title="上传到训练语音(alt+6)"><span></span></li>
        <li @click="save1" title="另存为(ctrl+shift+s)"><span></span></li>
        <!-- <li title="聚类(alt+1)"><span></span></li> -->
        <!-- <li title="自动剪辑(alt+2)"><span></span></li> -->
        <li @click="vad(true)" :class="{ 'on' : params.vad }" title="vad(alt+3)"><span></span></li>
        <!-- <li>
          <el-dropdown class="translate"  placement="bottom-start" trigger="click" title="转写">
            <span></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="英语">英语</el-dropdown-item>
              <el-dropdown-item command="汉语">汉语</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
         
        </li> -->
        <li @click="markHandle" title="标注(alt+5)"><span></span></li>
        <li @click="closeHanlde"><span></span></li>
			</ul>
		</div>
		<div class="wave" tabindex="-1" id="wave">     
      <div id="timeline"></div>
      <!-- <el-progress :class="{ 'hidden' : hideProgerss }" class="progerss"  :percentage="percentage"></el-progress> -->
      <div id="waveform"></div>
    </div>
    <div class="wave_controll">
      <ul>
        <li>播放速度:&nbsp;&nbsp;{{this.params.playRate*100}}%</li>
        <li @click="slowPlay" title="慢放(←)"><span></span></li>
        <li @click="previousRecord" title="上一条(↑)"><span></span></li>
        <li @click="playPause" :class="{ 'on' : params.playPausebutton }" title="播放/暂停(insert)"><span></span></li>
        <li @click="nextRecord" title="下一条(↓)"><span></span></li>
        <li @click="fastPlay" title="快放(→)"><span></span></li>
        <li @click="puasePlay" title="停止(alt+q)"><span></span></li>

        <li @click="toggleMute" :class="{ 'on' : params.toggleMutebutton }" class="sound"><span></span></li>
        <li>
          <input @mouseup="volumeBarHandle" v-model="params.volValue" type="range" min="0" max="1" value="0.8" step="0.01" />
        </li>
        <li>
          <el-select :disabled="pathDisabled" class="pathSelect" @change="pathHandle"  v-model="pathValue" placeholder="请选择">
            <el-option
              v-for="item in pathOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </li>
        <li>
          <el-button :disabled="this.getPlayerData().type==='local'||this.getPlayerData().type==='speaker'" class="outputVoice" @click="voiceOutputHandle">导出语料</el-button>
        </li>
        <li :class="{'hidden' : true}" title="上一段"><span></span></li>
        <li :class="{'hidden' : true}" title="下一段"><span></span></li>
        <li @click="foldHandle" title="展开/收起(alt+w)" :class="{ 'isfold' : foldFlag }"><span></span></li>
      </ul>
    </div>
    <div class="tcontent" :class="{ 'hidden' : foldFlag }">
      <el-button-group class="btn_group">
        <el-button type="primary" :class="{ 'on' : filemsg }" @click="tab('filemsg')" >文件信息</el-button>
        <el-button type="primary" :class="{ 'on' : targetres }" @click="tab('targetres')" :disabled="isEdited">命中结果</el-button>
      </el-button-group>
      <div class="rewrite_box">
        <el-button-group class="btn_group btn_group1">
          <el-button type="primary" :class="{ 'on' : trans }" @click="tabr('trans')" :disabled="isEdited">转写</el-button>
          <el-button type="primary" :class="{ 'on' : mark }" @click="tabr('mark')" :disabled="isEdited">标注</el-button>
        </el-button-group>
        <div :class="{ 'mask': true , 'hidden': !isEdited }"></div>
      </div>
    </div>
    <div :class="{ 'hidden' : foldFlag }" class="content">
      <div class="lcontent">
        <file-info @childPlay='wavePlay'></file-info>
      </div>
      <div class="rcontent">
        <component @childPlay='wavePlay'  @deleteAnnotation="childDelete"  ref="c1" :is="transcribeValue"></component>
        <div :class="{ 'mask': true , 'hidden': !isEdited }">
            <p class='center'>音频文件已被修改, 需要重新转写。</p>
        </div>
      </div>
    </div>
    <div class="bmenu" :class="{ 'hidden' : foldFlag }" >
      <ul>
        <li><el-checkbox :class="{ 'hidden' : !hideFold }" @change="timeCheckedHandle" v-model="timeChecked">显示时间</el-checkbox></li>
        <!-- <li><el-checkbox v-model="transChecked">显示翻译</el-checkbox></li> -->
        <li :class="{ 'hidden' : hideFold }"><el-checkbox @change="foldCheckedHandle" v-model="foldChecked">默认展开</el-checkbox></li>
        <li><el-checkbox @change="syncDisplay" v-model="vioceChecked">与声音同步</el-checkbox></li>
        <li class="outputBtn" :class="{ 'hidden' : !trans }"  @click="outWood">出材</li>
        <li class="outputBtn" :class="{ 'hidden' : trans }"  @click="textgrid">导出textgrid</li>
      </ul>
    </div>
	</div>
</template>
<script>
import WaveSurfer from '@/wavesurfer3/src/wavesurfer.js';
// import Editor from '@/utils/myEditor.js'
import Editor from '@/utils/editor.js'
// import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js'
// import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'
// import CursorPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js'
// import WaveSurfer from 'wavesurfer.js';
import TimelinePlugin from '@/wavesurfer3/src/plugin/timeline.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js'
import CursorPlugin from '@/wavesurfer3/src/plugin/cursor.js'
import interact from 'interactjs'
import {mapActions,mapGetters} from 'vuex'
// import wav from '@/static/demo (2).wav'
// import hotkeys from '@/hotkeys/dist/hotkeys.js';
import hotkeys from 'hotkeys-js';

import {getRecord,annotations,annotationsVerify,delAnnotations,getAnnotations,getVad,getAsrs,listenersRecord,getAudio,getHisRecord,exportWood,exportTextGrid} from '@/api/player.js'

import { uploadSpeakersVoices } from '@/api/speaker'
import {url1} from '@/api/player.js'

import fileInfo from './fileInfo'
import transcribe from './transcribe'
import localTranscribe from './localTranscribe'
import markDialog from '@/components/dialog/markDialog.vue'
import outputDialog from '@/components/dialog/outputDialog.vue'
// import audio from '@/static/demo (2).wav'

export default {
  name: 'quicklisten',
  components: {
    'file-info': fileInfo,
    'transcribe': transcribe,
    'localTranscribe': localTranscribe,
    'markDialog': markDialog,
    'outputDialog': outputDialog
	},
	data() {
		return {
      pathValue: 'all',
      pathOptions: [
        {
          value: 'all',
          label: '合路'
        },{
          value: 'A',
          label: 'A路'
        },{
          value: 'B',
          label: 'B路'
        }
      ],
      wavesurfer:{},
      params:{
        vad: false,
        pathA: false,
        pathB: false,
        playPausebutton: false,
        stopbutton: false,
        toggleMutebutton: true,
        zoomValue : 1,
        timeout: null,
        displayTime: null,
        vadTime: null,
        pathTime: null,
        blurTime: null,
        playTime: null,
        cache: 0,
        playRate: 1,
        oldTimeArr:{},
        timeArr:{
            begintime:[],
            endtime:[],
            flag:[],
            filetag:[],
            index:[],
            text:[]
        },
        pathData:[],
        editFlag:false,
        callid:null,
        volValue: 1
      },
      hidden: true,
      foldFlag: true,
      rectheight: 600,
      filemsg: true,
      targetres: false,
      isEdited: false,
      trans: true,
      mark: false,
      transcribeValue: 'localTranscribe',
      hideFold: true,
      timeChecked: false,
      transChecked: false,
      hideFold: true,
      vioceChecked: true,
      foldChecked: false,
      vadArr: [],
      asrsArr: [],
      volumeCached: 1,
      pathDisabled: true
    }
  },
  computed: {
    // getPlayerData:{
    //   get:function(){
    //     return this.getPlayerData().dateFlag;
    //   },
    //   set:function(newValue){
    //     this.getPlayerData().dateFlag = newValue;
    //   }
    // }
    getCallid() {
        return this.getPlayerData().dateFlag
    },
    getComPath() {
        return this.$store.state.player.pathFlag
    },
    getComResize() {
        return this.getResizeData().dateFlag
    },
    getComResizeLocal() {
        return this.getResizeLocalData().dateFlag
    },
    getRollFlag() {
        return this.getsyncRollFlag()
    }
  },
	watch: {
    getCallid() {

      this.reset()

      let div = document.querySelector(".quicklisten")

      if (this.getPlayerData().type==='ql') {
        this.hidden = false
        this.hotkeysbind()
        // this.wavesurfer.load(`http://192.168.1.242:9000/data/tmp/13146082867(北京市vs沈阳市)_主叫话单_13889220352_20171230004231_蓝胸鹑.wav`)
        // this.wavesurfer.load(`http://192.168.1.211:9000/data/tmp/helu-02434196276(李秋测试2)_主叫话单_082503415476_20170910210026_【汉】语_4-10-孔乙己-A.wav`)
        this.getData(this.getPlayerData().callid,this.getPlayerData().starttime)
        this.foldFlag = false
        this.hideFold = true
        this.resizemove = true
        this.pathDisabled = false

        this.transcribeValue = 'transcribe'

        let RESIZE_DATA = this.getResizeData()
        if ( this.isEqual(div,RESIZE_DATA) ) {
          return
        }
        this.setDomAttribute(div,RESIZE_DATA);


      }else if(this.getPlayerData().type==='his') {
        this.hidden = false
        this.hotkeysbind()
        this.getHisData(this.getPlayerData().callid,this.getPlayerData().starttime)
        this.foldFlag = false
        this.hideFold = true
        this.resizemove = true
        this.pathDisabled = false

        this.transcribeValue = 'transcribe'

        let RESIZE_DATA = this.getResizeData()
        if ( this.isEqual(div,RESIZE_DATA) ) {
          return
        }
        this.setDomAttribute(div,RESIZE_DATA);

      } else if (this.getPlayerData().type==='local') {
        this.hidden = false
        this.hotkeysbind()
        // this.wavesurfer.load(`http://192.168.1.242:9000/data/tmp/13146082867(北京市vs沈阳市)_主叫话单_13889220352_20171230004231_蓝胸鹑.wav`)
        this.wavesurfer.loadBlob(this.getPlayerData().callid)
        this.foldFlag = true
        this.resizemove = true
        this.pathDisabled = true

        this.transcribeValue = 'localTranscribe'

        let RESIZE_DATA = this.getResizeLocalData()
        if ( this.isEqual(div,RESIZE_DATA) ) {
          return
        }
        this.setDomAttribute(div,RESIZE_DATA);
        this.RES_DATA(new Date())

      } else if(this.getPlayerData().type==='speaker') {
        this.hidden = false
        this.hotkeysbind()
        // this.wavesurfer.load(`http://192.168.1.242:9000/data/tmp/13146082867(北京市vs沈阳市)_主叫话单_13889220352_20171230004231_蓝胸鹑.wav`)
        this.wavesurfer.load(this.getPlayerData().callid)
        this.foldFlag = true
        this.resizemove = false
        this.pathDisabled = true

        this.transcribeValue = 'localTranscribe'

        div.style.width = 'calc( 100% - 300px)'
        div.style.top = 'calc( 90% - 257px)'
        div.style.left = '240px'

        // document.querySelector('.quicklisten').style.height = '226px'
        document.querySelector('.quicklisten').style.height = '257px'
        document.querySelector('.quicklisten').classList.add("cursorDefault")
        this.RES_DATA(new Date())
        // interact.stop()

      } else if (this.getPlayerData().type==='des') {
        this.hidden = true
        this.wavesurfer.unAll()
        this.wavesurfer.destroy()
        this.wavesurfer = {}
      }
      this.filemsg = this.getlcobtn()
      this.targetres = !this.filemsg
    },
    getComPath() {
      console.log('path changed')
      console.log(this.getPathFlag())
      this.pathChanged()
    },
    getComResize() {
      //缩放重绘
      this.wavesurfer.drawer.fireEvent('redraw');
    },
    getComResizeLocal() {
      //缩放重绘
      this.wavesurfer.drawer.fireEvent('redraw');
    },
    getRollFlag() {
      this.vioceChecked = !this.getsyncRollFlag()
    }
	},
	methods: {
    ...mapActions(['PLAYER_DATA','RES_DATA','PATH_FLAG','WAVESURFER_DATA','ISPLAY','NEXT_RECORD','SYNCROLLFLAG','RANGE_INDEX','RESIZE_DATA','RESIZE_DATALOCAL','LCOBTN_DATA','RCOBTN_DATA','TIMEFLAG','REFRESHSLIDE','ANNOTATION_DATA']),
    ...mapGetters(['getPlayerData','getPathFlag','getResData','getsyncRollFlag','gettimeFlag','getNextRecord','getRangeIndex','getResizeData','getResizeLocalData','getAccount','getSpeakerId','getHistoryId','getlcobtn']),
    isEqual(div,{ width, height, top, left } = data) {
      return (parseInt(div.style.width) === parseInt(width)) && (parseInt(div.style.height) === parseInt(height)) && (parseInt(div.style.top) === parseInt(top)) && (parseInt(div.style.left) === parseInt(left))
    },
    setDomAttribute(domEL,{ width, height, top, left } = data) {
      domEL.style.width = width + 'px';
      domEL.style.height = height + 'px';
      domEL.style.top = top + 'px';
      domEL.style.left = left + 'px';
      domEL.setAttribute('data-x', left);
      domEL.setAttribute('data-y', top);
    },
    tab (str) {
      this.filemsg = false
      this.targetres = false
      this[str] = true
      this.filemsg ? this.lcobtn = true : this.lcobtn = false

      this.LCOBTN_DATA(this.lcobtn)
    },
    tabr (str) {
      this.trans = false
      this.mark = false
      this[str] = true
      this.trans ? this.rcobtn = true : this.rcobtn = false
      this.RCOBTN_DATA(this.rcobtn)
    },
    getHisData(callid,starttime) {
      let id = this.getHistoryId()
      let params = new URLSearchParams()
      params.append("taskId", id);
      params.append("startTime", starttime);

      getHisRecord(callid,params).then(res => {
        this.resdata = res.data
        this.RES_DATA(res.data) // getReocrd的返回结构比annotations多了层annotation, 所以getData后的RES_DATA与annotations后的RES_DATA所存的结构并不一致
        this.vadInit()
        this.asrsInit()
        this.loadAudio(`${url1}/records/${callid}/files?fileTag=combiner&startTime=${starttime}`)
        // this.loadAudio(this.getResData().files.c)
        let params = new URLSearchParams()
        params.append('callId',callid)
        params.append('user',this.getAccount())
        params.append('startTime',this.getPlayerData().starttime)
        
        return listenersRecord(params,callid)
      }).then(res => {
        console.log('listenersRecord')
        console.log(res)
      })
    },
    getData(callid,starttime) {
      getRecord(callid,{startTime:starttime}).then(res => {
        this.resdata = res.data
        // console.log('%cgetData--res:', 'color:blue', res)
        // console.log('%cgetData--this.rcobtn:', 'color:blue', this.rcobtn)
        this.RES_DATA(res.data) // getReocrd的返回结构比annotations多了层annotation, 所以getData后的RES_DATA与annotations后的RES_DATA所存的结构并不一致
        this.vadInit()
        this.asrsInit()
        // this.loadAudio(this.getResData().appended.files.combiner)
        this.loadAudio(`${url1}/records/${callid}/files?fileTag=combiner&startTime=${starttime}`)
        // this.loadAudio(audio)
        // this.loadAudio(this.getResData().files.c)
        let params = new URLSearchParams()
        params.append('callId',callid)
        params.append('user',this.getAccount())
        params.append('startTime',this.getPlayerData().starttime)
        
        return listenersRecord(params,callid)
      }).then(res => {
        console.log('listenersRecord')
        console.log(res)
      })
    },
    showWavesurfer (flag = false) {
      // Anytime you play a new track, reset the counter.
      // this.editCount = 0
      // this.opCount = 0
      //创建wavesurfer实例
      // this.wavesurfer = {}
      this.wavesurfer = this.newWavesurfer()

      // document.querySelector("#waveform").addEventListener('mousedown',(e)=>{
      //   if(this.wavesurfer.backend.buffer.numberOfChannels == 2){
      //     if(e.offsetY >= 180){
      //       return
      //     }
      //   }else{
      //     if(e.offsetY >= 100){
      //       return
      //     }
      //   }
          
      //   this.wavesurfer.clearRegions()       
      // })

      //加载完成即刻播放
      this.wavesurfer.on('ready', ()=> {
        // this.wavesurfer.playPause()
        this.wavesurfer.disableDragSelection()  
        this.wavesurfer.enableDragSelection({color: 'rgba(0, 180, 0, 0.3)'})


        this.ifPlay()
        this.wavePlay()
        this.ISPLAY(false)
        this.WAVESURFER_DATA(this.wavesurfer)
        this.wavesurfer.clearRegions()
        this.wavesurfer.zoom(this.params.zoomValue)
        // this.wavesurfer.setVolume(this.volumeCached)
        
        this.hideProgerss = true
        //音量记录
        console.log('this.volumeCached')
        console.log(this.volumeCached)
        this.wavesurfer.setVolume(this.volumeCached)
      })
      document.querySelector("#waveform").addEventListener('mousedown',(e)=>{
        if (this.wavesurfer.backend.buffer.numberOfChannels == 2) {
          if (e.offsetY >= 180) {
            return
          }
        } else {
          if (e.offsetY >= 100) {
            return
          }
        }     
        this.wavesurfer.clearRegions()
          
      })
      //   //音量记录
      //   this.wavesurfer.setVolume(this.volumeCached)

      //   if(this.params.vad){
      //     this.vad()
      //   } 
      // })

      this.e = Editor.Editor.init(this.wavesurfer)
      this.wheelInit()
    },
    newWavesurfer() {
      // console.log('wavesurfer created')
      let wavesurfer = WaveSurfer.create({
        container: '#waveform',
        cursorColor: '#f02314',
        audioRate:1,
        scrollParent: true,
        backend: 'WebAudio',
        barHeight: 1.5,
        waveColor     : '#43d996',
        progressColor : '#238b5c',
        loaderColor   : '#238b5c',
        hideScrollbar : false,
        autoCenter    : true,
        height: 120,
        splitChannels: true,
        responsive: true,
        // partialRender: true,

        // normalize: true,

        // fillParent: false,
        // partialRender: true,
        minPxPerSec: 1,
        // closeAudioContext: true,
        // interact:false,
        // forceDecode: true,
        plugins: [
          TimelinePlugin.create({
            container: '#timeline',
            fontSize: 14,
            primaryFontColor: "#9191a5",
            secondaryFontColor: "#9191a5",
            primaryColor: "#9191a5",
            secondaryColor: "#9191a5",
          }),
          RegionsPlugin.create({
            // plugin options ...
          }),
        ]
      })
      return wavesurfer
    },
    initWavesurferStatus () {
      let wavesurfer = this.wavesurfer
      if (wavesurfer.isMuted) {
        wavesurfer.toggleMute()
      }
    },
    asrsInit() {
      getAsrs(this.getResData().callid,{startTime:this.getResData().starttime}).then(res => {
        this.asrsArr = res.data
      })
    },
    vadInit() {
      getVad(this.getResData().callid,{startTime:this.getResData().starttime}).then(res => {
        this.vadArr = res.data
      })
    },
    vad (flag) {
      if (flag) {
        this.params.vad = !this.params.vad
      }
      console.log('vad')
      // let params = new URLSearchParams()
      // params.append('callid',this.callid)
      let vads = [],wavesurfer = this.wavesurfer,time = null
      this.vadHandle ? wavesurfer.un('audioprocess',this.vadHandle) : ''
      if (this.getPlayerData().type != 'ql') {
        console.log('local')
        return
      }
      
      // console.log('vad')
      // console.log(res)
      
      if (this.getPathFlag() == 'A') {
        vads = this.vadArr['achannel']
      } else if (this.getPathFlag() == 'B') {
        vads = this.vadArr['bchannel']
      } else {
        vads = this.vadArr['combiner']
      }

      // this.params.vad = !this.params.vad

      if (!this.params.vad) {
        if (Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2) {
          wavesurfer.clearRegions()
        }
          
      } else {
        let index = 0
        wavesurfer.clearRegions()
        for (let i=index; i<vads.length; i++) {
          this.Utils.waveRegion(wavesurfer,vads[i].begin,vads[i].end,'rgba(0,180,0,.3)',true)
        }
      }

      if (!this.vadHandle) {
        this.vadHandle = (p) => {      
          let res = this.vadJudge(vads,p)
          if(!res.result){
            wavesurfer.skip(res.skipTime)
          }
        }
      }
      
      if (this.params.vad) {
        this.vadHandle = (p) => {
        
          let res = this.vadJudge(vads,p)
          if (!res.result) {
            wavesurfer.skip(res.skipTime)
          }
        }
        wavesurfer.on('audioprocess',this.vadHandle)
      }
    },
    vadJudge (vads,time) {
        // console.log(time)

      if (!vads) {
        return {
          result: false
        }; 
      }


      for (let i=0; i<vads.length; i++) {
        if (time >= vads[i].begin && time <= vads[i].end) {
    
          return {
            result: true
          };
        } else if (time < vads[0].begin) {

          return {
            result: false,
            skipTime: (vads[0].begin - time)
          };
        } else if (i+1==vads.length) {

          return {
            // result: true
            result: false,
            skipTime: (vads[i].end + time)
          };
        } else if (time > vads[i].end && time <= vads[i+1].begin) {
          return {
            result: false,
            skipTime: (vads[i+1].begin - time)
          };
        }
      }
      return {
        result: true
      };    
    },
    loadAudio (data) {
      console.log(`this.wavesurfer.load(data)`)
      console.log(data)
      // console.log(typeof data)

      
      if (typeof data === 'string') {
        // data = data.replace('localhost:8099','/qlApi')
        // data = data.replace('192.168.1.16:9000','192.168.1.16:8099')
        this.wavesurfer.load(data)
        // getAudio('405','combiner').then(res=>{
        //   console.log('loadAudio')
        //   console.log(res)
        // })
      } else {
        this.wavesurfer.loadBlob(data)
      }
    },

    //分路切换
    pathHandle() {
      // console.log('pathHandle')

      this.PATH_FLAG(this.pathValue)
      // console.log(this.$store)
    },
    pathChanged() {
      let vol=this.wavesurfer.getVolume();
      let isPlay=this.wavesurfer.isPlaying();
      let cache = Math.floor(this.wavesurfer.getCurrentTime())
      let callId = this.getResData().callid

      this.wavesurfer.un('play')
      this.wavesurfer.un('pause')

      let playBackwardRate = this.wavesurfer.getPlaybackRate()
      // this.loadAudio('')

      if (this.getPathFlag() == 'all') {
        this.wavesurfer.un('audioprocess',this.vadHandle)
        // this.loadAudio(this.getResData().appended.files.combiner)
        // this.loadAudio(this.getResData().files.c)
        this.loadAudio(`${url1}/records/${callId}/files?fileTag=combiner&startTime=${this.getPlayerData().starttime}`)
      } else if (this.getPathFlag() == 'A') {
        this.wavesurfer.un('audioprocess',this.vadHandle)
        // console.log('this.getResData().appendedfiles.achannelFile')
        // console.log(this.getResData())
        // console.log(this.getResData().appended.files.achannel)
        // this.loadAudio(this.getResData().appended.files.achannel)
        // this.loadAudio(this.getResData().files.a)        
        this.loadAudio(`${url1}/records/${callId}/files?fileTag=aChannel&startTime=${this.getPlayerData().starttime}`)
        // this.loadAudio(audio)
      } else if (this.getPathFlag() == 'B') {
        this.wavesurfer.un('audioprocess',this.vadHandle)
        // console.log('this.getResData().appendedfiles.bchannelFile')
        // console.log(this.getResData())
        // console.log(this.getResData().appended.files.bchannel)
        // this.loadAudio(this.getResData().appended.files.bchannel)
        // this.loadAudio(this.getResData().files.b)
        this.loadAudio(`${url1}/records/${callId}/files?fileTag=bChannel&startTime=${this.getPlayerData().starttime}`)
      }

      if (this.test) {
        this.wavesurfer.un('ready', this.test)
      }
      
      this.test = () => {
        console.log('test')
        this.wavesurfer.setPlaybackRate(this.params.playRate)
        this.ifPlay()

        this.WAVESURFER_DATA(this.wavesurfer)

        if (isPlay) {
          this.wavesurfer.play(cache);
        } else {
          this.wavesurfer.play(cache,cache+.01);
        }
        if (this.params.vad) {
          this.wavesurfer.un('audioprocess',this.vadHandle)
          this.vad()
        }  

      }
      this.wavesurfer.on('ready', this.test);

    },
    stopPlay() {
      if (this.wavesurfer.isPlaying()) {
        this.wavePlay()
      }
    },
    clearCache() {
      if (this.test) {
        this.wavesurfer.un('ready',this.test)
      }
    },
    wavePlay(start,end) {
      let wavesurfer = this.wavesurfer
      if (start==null) {
        wavesurfer.playPause()
      } else {
        wavesurfer.play(start,end)
      }
    },
    ifPlay () {
      console.log('ifPlay')

      this.wavesurfer.un('play')
      this.wavesurfer.un('pause')

      this.wavesurfer.on('play',()=>{
        this.ISPLAY(true)
        // console.log('play')
        // console.log(this.$store)
        this.params.playPausebutton = true
      })      
      this.wavesurfer.on('pause',()=>{
        this.ISPLAY(false)
        // console.log('pause')
        // console.log(this.$store)
        this.params.playPausebutton = false
      })

    },
        //快捷键
    hotkeysbind() {
      hotkeys('right,left,-,=,insert,delete,alt+q,alt+9,alt+5,alt+3,alt+w,alt+6,ctrl+shift+s,ctrl+up,ctrl+down,ctrl+c,ctrl+v,ctrl+x,ctrl+z,ctrl+r,alt+-,alt+=,shift+right,shift+left,up,down,alt+7,alt+8,alt+2,alt+1,alt+s',{
          // scope: 'b',
        element: document.querySelector('#wave')
      },(event, handler) => {
          // Prevent the default refresh event under WINDOWS system
        event.preventDefault()


        let volume = 0
        // console.log(handler)
        switch(handler.key){
          case "right":
            this.fastPlay()
            console.log('you pressed →!');
            break;
          case "left":
            this.slowPlay()
            console.log('you pressed ←!');
            break;
          case "=":
            this.zoomIn()
            console.log('you pressed =!');
            break;
          case "-":
            this.zoomOut()
            console.log('you pressed -!');
            break;
          case "insert":
            this.playPause()
            console.log('you pressed insert!');
            break;
          case "ctrl+up":
            volume= this.wavesurfer.getVolume()
            // console.log(volume)
            volume < 0.9 ? this.wavesurfer.setVolume(volume + 0.1) : this.wavesurfer.setVolume(1)
            this.params.volValue = volume
            // console.log('you pressed ctrl+up!');
            // console.log(this.wavesurfer.getVolume());
            break;
          case "ctrl+down":
            volume = this.wavesurfer.getVolume()
            // console.log(volume)
            volume > 0.1 ? this.wavesurfer.setVolume(volume - 0.1) : this.wavesurfer.setVolume(0)
            this.params.volValue = volume
            // console.log('you pressed ctrl+down!');
            // console.log(this.wavesurfer.getVolume());
            break;
          case "ctrl+c":
            this.copy()
            console.log('you pressed ctrl+c!');
            break;
          case "ctrl+v":
            this.paste()
            console.log('you pressed ctrl+v!');
            break;
          case "ctrl+x":
            this.cut()
            console.log('you pressed ctrl+x!');
            break;
          case "ctrl+c":
            this.copy()
            console.log('you pressed ctrl+c!');
            break;
          case "ctrl+z":
            this.undo()
            console.log('you pressed ctrl+z!');
            break;
          case "ctrl+r":
            this.redo()
            console.log('you pressed ctrl+r!');
            break;
          case "delete":
            this.del()
            console.log('you pressed delete!');
            break;
          case "shift+right":
            this.rightSelect()
            console.log('you pressed shift+right!');
            break;
          case "shift+left": 
            this.leftSelect()
            console.log('you pressed shift+left!');
            break;
          case "alt+q":
            document.getElementById("stopbutton").click()
            console.log('you pressed alt+q!');
            break;
          case "alt+9":
            this.cyclePlay()
            console.log('you pressed alt+9!');
            break;
          case "alt+3":
            document.querySelector('#vad').click()
            break;
          case "alt+w":
            this.foldHandle()
            break;
          case "alt+s":
            this.myexport()
            console.log('you pressed alt+6!');
            break;
          case "ctrl+shift+s":
            this.save1()
            console.log('you pressed ctrl+shift+s!');
            break;
          case "alt+-":
            console.log('you pressed ctrl+-!')
            this.wavesurfer.zoom()
            this.params.zoomValue = 0
            break;
          case "alt+=":
            console.log('you pressed ctrl+=!')
            this.zoomFit()
            break;
          case "alt+5":
            this.markHandle()
            break;
          case "up":
            this.previousRecord()
            break;
          case "down":
            this.nextRecord()
            break;
          case "alt+7":
            this.amplitudeBig()
            break;
          case "alt+8":
            this.amplitudeSmall()
            break;
          case "alt+2":
            this.autoClip()
            break;
          case "alt+1":
            this.cluster()
            break;
          case "alt+6":
            this.uploadSpeaker()
            break;
              
        }


      });
        // hotkeys.setScope('b')
    },
    //file

    downLoad() {
      var blob = this.createWavBlob();
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.innerHTML = 'download';

      // 指定生成的文件名
      a.download = 'demo';
      a.click();
      window.URL.revokeObjectURL(a.href);
    },
    createWavBlob () {
      var buf = this.wavesurfer.backend.buffer;
      var data = this.interleave(this.audioData[0],this.audioData[1])
      var wav = this.encodeWAV(data, buf.sampleRate);
      var blob = new Blob([wav], {type: 'audio/wav'});
      return blob;
    },
    //双声道合并
    interleave(inputL, inputR){
      if(!inputR){
        this.channels = 1
        return inputL
      }
      this.channels = 2
      var length = inputL.length + inputR.length;
      var result = new Float32Array(length);
      
      var index = 0,
          inputIndex = 0;
      
      while (index < length){
        result[index++] = inputL[inputIndex];
        result[index++] = inputR[inputIndex];
        inputIndex++;
      }
      return result;
    },
    writeString (view, offset, string) {
      for (var i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    },
    floatTo16BitPCM (output, offset, input) {

      for (var i = 0; i < input.length; i++, offset += 2) {
        var s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);   
      }
    },
    encodeWAV (samples, sampleRate) {

      var writeString = this.writeString
      var floatTo16BitPCM = this.floatTo16BitPCM

      var buffer = new ArrayBuffer(44 + samples.length * 2);
      var view = new DataView(buffer);

      /* RIFF identifier */
      writeString(view, 0, 'RIFF');
      /* file length */
      view.setUint32(4, 32 + samples.length * 2, true);
      /* RIFF type */
      writeString(view, 8, 'WAVE');
      /* format chunk identifier */
      writeString(view, 12, 'fmt ');
      /* format chunk length */
      view.setUint32(16, 16, true);
      /* sample format (raw) */
      view.setUint16(20, 1, true);
      /* channel count */ //单双声道
      // view.setUint16(22, 2, true);
      // view.setUint16(22, 1, true);
      view.setUint16(22, this.channels, true);
      /* sample rate */
      view.setUint32(24, sampleRate, true);
      /* byte rate (sample rate * block align) */
      view.setUint32(28, sampleRate * 2, true);
      /* block align (channel count * bytes per sample) */
      view.setUint16(32, 2, true);
      /* bits per sample */
      view.setUint16(34, 16, true);
      /* data chunk identifier */
      writeString(view, 36, 'data');
      /* data chunk length */
      view.setUint32(40, samples.length * 2, true);

      floatTo16BitPCM(view, 44, samples);

      return view;
    },
    //top botton
    copy(flag=true) {
      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2 && flag){
        this.$message.error('请先选择一段波形');
        this.audioData = null
        return
      }

      if(this.loopFlag){
        this.wavesurfer.un('pause',this.loopHandle)
        this.loopFlag = false
      }
      this.stopPlay()
      this.audioData = this.e.copy()
    },
    cut() { 
      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2){
        this.$message.error('请先选择一段波形');
        return
      }

      if(this.loopFlag){
        this.wavesurfer.un('pause',this.loopHandle)
        this.loopFlag = false
      }
      this.stopPlay()
      let cutAll = this.e.cut() || false
      if(cutAll){
        this.$message.error('无法剪切全部区域');
      }
      // this.editCount++
      // this.opCount++
    },
    paste() {
      this.stopPlay()
      let overflow = this.e.paste() || false
      console.log(overflow)
      if(overflow){
        this.$message.error('内存溢出 无法粘贴');
      }
      // this.editCount++
      // this.opCount++
    },
    undo() {
      this.stopPlay()
      this.e.undo()
      // if (this.editCount) {
      //   this.editCount--
      // } else {
      //   this.editCount = 0
      // }
      // this.opCount++
    },
    redo() {
      this.stopPlay()
      this.e.redo()
      // this.editCount++
      // this.opCount++
    },
    del() {
      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2){
        this.$message.error('请先选择一段波形');
        return
      }

      if(this.loopFlag){
        this.wavesurfer.un('pause',this.loopHandle)
        this.loopFlag = false
      }
      this.stopPlay()
      let delAll = this.e.del() || false
      if(delAll){
        this.$message.error('无法删除全部区域');
      }
      // this.editCount++
      // this.opCount++
    },
    amplitudeBig() {
      this.operator(1/2)
    },
    amplitudeSmall() {
      this.operator(2)
    },
    operator(rate) {
      let buffer = this.wavesurfer.backend.buffer
      let data = buffer.getChannelData(0)
      let length = data.length
      let newdata = new Float32Array(length)
      for(let k = 0;k < data.length; k++){
        newdata[k] = data[k]/rate
      }
      if(buffer.numberOfChannels===2){
        let data1 = buffer.getChannelData(1)
        let newdata1 = new Float32Array(length)

        for(let k = 0;k < data1.length; k++){
          newdata1[k] = data1[k]/rate
        }
        this.wavesurfer.backend.buffer.copyToChannel(newdata1,1)
      }
      this.wavesurfer.backend.buffer.copyToChannel(newdata,0)
      this.wavesurfer.drawBuffer()
    },
    zoomIn() {
      if(this.params.zoomValue >= 100){
        return
      }
      this.params.zoomValue += 1
      this.wavesurfer.zoom(this.params.zoomValue)
    },
    zoomOut() {
      if(this.params.zoomValue <= 0){
        this.wavesurfer.zoom(0)
        return
      }
      this.params.zoomValue -= 1
      this.wavesurfer.zoom(this.params.zoomValue)
    },
    leftSelect() {
      let end = this.wavesurfer.getCurrentTime()
      this.Utils.waveRegion(this.wavesurfer,0,end,'rgba(0,180,0,.3)',true)
      this.copy(false)
      this.Utils.waveRegion(this.wavesurfer,0,end,'rgba(0,180,0,.3)',true)
    },
    rightSelect() {
      // console.log(this.wavesurfer.getDuration())
      let start = this.wavesurfer.getCurrentTime()
      let end = this.wavesurfer.getDuration()
      this.Utils.waveRegion(this.wavesurfer,start,end,'rgba(0,180,0,.3)',true)
      this.copy(false)
      this.Utils.waveRegion(this.wavesurfer,start,end,'rgba(0,180,0,.3)',true)
    },
    zoomFit() {
      let start = 0,end = 0

      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2){
        this.$message.error('请先选择一段波形');
        return
      }
      
      
      for(var k in this.wavesurfer.regions.list){

        let obj = this.wavesurfer.regions.list[k]
        start = obj.start
        end = obj.end
      }
      this.wavesurfer.zoomFit(start,end)
      this.params.zoomValue = this.wavesurfer.params.minPxPerSec
    },
    cyclePlay() {

      if(this.loopFlag){
        this.wavesurfer.un('pause',this.loopHandle)
        this.loopFlag = false
        this.wavePlay()
        return
      }
      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2){
        this.$message.error('请先选择一段波形');
        return
      }
      this.stopPlay()
      // if(this.params.vad){
      //   document.querySelector('#vad').click()
      // }
      for(var k in this.wavesurfer.regions.list){
        this.wavesurfer.regions.list[k].play()
        this.loopFlag = true

        this.loopHandle = ()=>{
          if(!this.wavesurfer.regions.list[k]){
            this.loopFlag = false
            return
          }
          this.wavesurfer.regions.list[k].play()
          this.loopFlag = true
        }
        this.wavesurfer.on('pause',this.loopHandle)
      }
    },
    myexport () {
      this.copy()
      if(!this.audioData){
        return
      }
      let d = new Date()
      var blob = this.createWavBlob();
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = `${d.getTime()}`;
      a.click();
      window.URL.revokeObjectURL(a.href);
    },
    uploadSpeaker() {
      console.log('uploadSpeaker')
      console.log(this.getSpeakerId())
      // if(this.getPlayerData().type!='speaker' || this.$route.path!='/speaker'){
      //   this.$message('请在声纹模块使用该功能');
      //   return
      // }
      if(!this.getSpeakerId()){
        this.$message('请选择声纹');
        return
      }

      this.audioData = this.e.save()
      let blob = this.createWavBlob();
      let id,fd = new FormData();
      id = this.getSpeakerId();
      //0 原始语音;  1 训练语音
      fd.append('fileType', 1)
      fd.append('files', blob);
      uploadSpeakersVoices(id, fd)
      .then(res => {
        if (res.status === 200) {
          this.REFRESHSLIDE(new Date())
          this.$message.success('上传成功')
        }
      })
      .catch(err => {
        console.error('uploadSpeakersVoices--err:', err)
        this.$message.error(err.response.data.msg)
      })
    },
    pathDownload(str) {
      console.log('pathDownload')
      console.log(str)
      var link = document.createElement('a');
      link.setAttribute("download", "");
      link.href = str;
      link.click();
      window.URL.revokeObjectURL(link.href);
    },
    save1() {
      let callId = this.getResData().callid
      if (this.getPathFlag() == 'all') {
        this.pathDownload(`${url1}/records/${callId}/files?fileTag=combiner&startTime=${this.getPlayerData().starttime}`)
      } else if (this.getPathFlag() == 'A') {       
        this.pathDownload(`${url1}/records/${callId}/files?fileTag=aChannel&startTime=${this.getPlayerData().starttime}`)
        // this.loadAudio(audio)
      } else if (this.getPathFlag() == 'B') {
        this.pathDownload(`${url1}/records/${callId}/files?fileTag=bChannel&startTime=${this.getPlayerData().starttime}`)
      }
    },
    save() {
      this.audioData = this.e.save()
      var blob = this.createWavBlob();
      var a = document.createElement('a');
      a.href = window.URL.createObjectURL(blob);
      a.download = 'demo';
      a.click();
      window.URL.revokeObjectURL(a.href);
    },
    wheelInit() {
      document.getElementById("waveform").onmousewheel = (e) => {
        // console.log(e)
        if(e.deltaY > 0){
          this.zoomOut()
        }else{
          this.zoomIn()
        }
      }
    },
    //bottom button
    slowPlay() {
      let playBackwardRate = this.wavesurfer.getPlaybackRate()
      if(this.wavesurfer.getPlaybackRate() == .5){
        this.$message({
        message: this.params.playRate+"倍",
        duration: 500
        })
        return
      }
    
      this.params.playRate = playBackwardRate - 0.25
      this.wavesurfer.setPlaybackRate(this.params.playRate)

      this.$message({
        message: this.params.playRate+"倍",
        duration: 500
      })
    },
    playPause() {
      if(this.loopFlag){
        this.wavesurfer.un('pause',this.loopHandle)
        this.loopFlag = false
      }
      this.wavePlay()
    },
    fastPlay() {
      let playBackwardRate = this.wavesurfer.getPlaybackRate()
    
      if(this.wavesurfer.getPlaybackRate() == 4){
        this.$message({
          message: this.params.playRate+"倍",
          duration: 500
        })
        return
      }

      this.params.playRate = playBackwardRate + 0.25
      this.wavesurfer.setPlaybackRate(this.params.playRate)

      this.$message({
        message: this.params.playRate+"倍",
        duration: 500
      })
    },
    puasePlay() {
      this.params.playPausebutton = false
      this.wavesurfer.stop();
      this.wavesurfer.play(0,.01);
      this.initWavesurferStatus();
    },   
    toggleMute() {
      if(this.params.toggleMutebutton){
        this.volumeCached = this.wavesurfer.getVolume()
        this.wavesurfer.setVolume(0)
        this.params.toggleMutebutton = false
        this.params.volValue = 0
      }else{
        // this.wavesurfer.setVolume(1)
        if(this.volumeCached==0) this.volumeCached = 1
        this.wavesurfer.setVolume(this.volumeCached)
        this.params.toggleMutebutton = true
        // document.getElementById("volButton").value = this.volumeCached
        this.params.volValue = this.volumeCached
      }
    },
    volumeBarHandle(e){
      // console.log('volumeBarHandle')
      // console.log(e)
      if(e.offsetX>=0 && e.offsetX<=80){
        this.params.toggleMutebutton = true
        this.wavesurfer.setVolume(e.offsetX/80)
      }else if(e.offsetX<0){
        this.params.toggleMutebutton = false
        this.wavesurfer.setVolume(0)
      }else{
        this.wavesurfer.setVolume(1)
        this.params.toggleMutebutton = true
      }
    },
    foldHandle() {
      if(this.getPlayerData().type==='speaker'){
        return
      }
      this.foldFlag = !this.foldFlag
      // this.CONTENTFOLD(this.foldFlag)
      if(this.foldFlag){
        document.querySelector('.quicklisten').style.height = '226px'
      }else{
        document.querySelector('.quicklisten').style.height = `${this.rectheight}px`
      }
    },
    previousRecord() {
      // if(!this.hideProgerss || !this.wavesurfer.isReady){
      //   return
      // }
      this.clearCache()

      if(this.getPlayerData().type==='local'){
        return 
      }
      let d = new Date()
      this.NEXT_RECORD({
        dateFlag: d,
        next: false,
        callid: this.getPlayerData().callid
      })
      // this.BILL_STATUS({     
      //   reset: true
      // })
    },
    nextRecord() {
      // if(!this.hideProgerss || !this.wavesurfer.isReady){
      //   return
      // }
      this.clearCache()
      
      if(this.getPlayerData().type==='local'){
        return 
      }
      console.log('nextRecord')
      console.log(this.getPlayerData())
      console.log(this.getPlayerData().starttime)
      let d = new Date()
      this.NEXT_RECORD({
        dateFlag: d,
        next: true,
        callid: this.getPlayerData().callid
      })

      // this.BILL_STATUS({     
      //   reset: true
      // })
    },

    closeHanlde() {	
      // document.querySelector('.pane').style.display = 'none' 
      let d = new Date()
      this.PLAYER_DATA({
        dateFlag: d,
        type: 'des',
        callid: ''
      })
    },
    interactInit() {
      console.log('interactInit')
      let _this = this
      interact('.quicklisten')
      .draggable({
        onmove: this.dragMoveListener,
        // ignoreFrom: '.content',
        allowFrom: '.title',
        restrict: {
          restriction: 'parent',
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },
        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },
        // minimum size
        restrictSize: {
          // min: { width: 760, height: 226 },
          min: { width: 760, height: 400 },
        },
        inertia: true,
      })
      .on('resizemove', function (event) {
        if(!_this.resizemove){
          return
        }
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // _this.rectheight = event.rect.height

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        // target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        // y += event.deltaRect.top;

        // target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        target.style.left = `${x}px`
        // target.style.top = `${y}px`

        target.setAttribute('data-x', x);
        // target.setAttribute('data-y', y);

        if(!_this.foldFlag){
          // y = (parseFloat(target.getAttribute('data-y')) || 0);
          _this.rectheight = event.rect.height
          target.style.height = event.rect.height + 'px';
          y += event.deltaRect.top;
          target.style.top = `${y}px`
          target.setAttribute('data-y', y);

        }
        // console.log('target')
        // console.log(target)
        let d = new Date()
        if(_this.getPlayerData().type==='ql'){
          _this.RESIZE_DATA({
            dateFlag: d,
            left: event.rect.left,
            top: event.rect.top,
            width: event.rect.width,
            height: event.rect.height,
          })
        }else if(_this.getPlayerData().type==='local'){
          _this.RESIZE_DATALOCAL({
            dateFlag: d,
            left: event.rect.left,
            top: event.rect.top,
            width: event.rect.width,
            height: event.rect.height,
          })
        }
        // console.log(_this.$store)
      });
    },
    dragMoveListener (event) {
      if(!this.resizemove){
        return
      }
      var target = event.target,
          // keep the dragged position in the data-x/data-y attributes
          x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
          y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      // translate the element
      // target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';
      target.style.left = `${x}px`
      target.style.top = `${y}px`

      // update the posiion attributes
      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);



      let d = new Date()
      if(this.getPlayerData().type==='ql'){
        this.RESIZE_DATA({
          dateFlag: d,
          left: x,
          top: y,
          width: this.getResizeData().width,
          height: this.getResizeData().height,
        })
      }else if(this.getPlayerData().type==='local'){
        this.RESIZE_DATALOCAL({
          dateFlag: d,
          left: x,
          top: y,
          width: this.getResizeLocalData().width,
          height: this.getResizeLocalData().height,
        })
      }


      // window.dragMoveListener = this.dragMoveListener;
    },

    reset() {


      document.querySelector('.quicklisten').classList.remove("cursorDefault")
      hotkeys.unbind('right,left,-,=,insert,delete,alt+q,alt+9,alt+5,alt+3,alt+w,alt+6,ctrl+shift+s,ctrl+up,ctrl+down,ctrl+c,ctrl+v,ctrl+x,ctrl+z,ctrl+r,alt+-,alt+=,shift+right,shift+left,up,down,alt+7,alt+8,alt+2,alt+1,alt+s')
      console.log('reset')
      console.log(this.wavesurfer)
      if(this.wavesurfer.destroy){
        this.volumeCached = this.wavesurfer.getVolume()
        
        if(this.wavesurfer.buffer){
          this.wavesurfer.zoom()
        }
        
        this.wavesurfer.unAll()
        this.wavesurfer.destroy()  
        console.log('this.wavesurfer')
        console.log(this.wavesurfer)

      }
      // this.rangeIndex = 0
      // this.RANGE_INDEX(this.rangeIndex)
      this.showWavesurfer()
      Object.defineProperty(window.WaveSurferAudioContext, 'sampleRate', {writable: true})
      window.WaveSurferAudioContext.sampleRate = 8000
      this.hideFold = false
      this.pathValue = 'all'
      this.PATH_FLAG(this.pathValue)
      if(this.params.vad){
        this.vad(true)
      }
      // this.source ? this.source.cancel() : ''
      // this.percentage = 0
    },

    resizeInit() {

      let width = document.body.clientWidth,
      height = document.body.clientHeight

      // this.RESIZE_DATA({
      //   dateFlag: '',
      //   left: width/2-380,
      //   top: height*0.9-480,
      //   width: 760,
      //   height: 490,
      // })

      if((width/2)<760){
        this.RESIZE_DATA({
          dateFlag: '',
          left: width/2-380,
          // top: height*0.9-580,
          top: 250,
          width: 760,
          height: 490,
        })
      }else{
        this.RESIZE_DATA({
          dateFlag: '',
          left: width/2-width/4,
          top: height/2-height/4,
          width: width/2,
          height: height/2,
        })
      }
      
      this.RESIZE_DATALOCAL({
        dateFlag: '',
        left: 240,
        top: height*0.9-226,
        width: width-300,
        height: 226,
      })
    
    },

    childDelete(params, id) {
      delAnnotations(params, id)
        .then(res => {
          if (res.status === 200) {
            this.callGetMark(id)
          }
        })
        .catch(err => {
          console.error('delAnnotations--err:', err)
          this.$message.error(err.response.data.msg)
        })
    },
    timeCheckedHandle() {
      this.timeFlag = !this.gettimeFlag()
      this.$refs.c1.timeSwitch(this.timeFlag)
      this.TIMEFLAG(this.timeFlag)
    },
    foldCheckedHandle() {

    },
    syncDisplay() {
      this.syncRollFlag = !this.getsyncRollFlag()
      this.$refs.c1.syncDisplaySwitch(this.syncRollFlag)
      this.SYNCROLLFLAG(this.syncRollFlag)
    },
    outWood() {
      const form = document.createElement('form')
      form.action = exportWood(this.getResData().callid)
      form.method = 'get'
      form.style.display = 'none'
      const button = document.createElement('input')
      button.type = 'submit'
      form.appendChild(button)
      const button1 = document.createElement('input')
      button1.type = 'text'
      button1.name = 'startTime'
      button1.value = `${this.getPlayerData().starttime}`
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    textgrid() {
      if(this.resdata.annotationItem===''){
        return
      }

      const form = document.createElement('form')
      form.action = exportTextGrid(this.getResData().callid)
      form.method = 'get'
      form.style.display = 'none'
      const button = document.createElement('input')
      button.type = 'submit'
      form.appendChild(button)
      const button1 = document.createElement('input')
      button1.type = 'text'
      button1.name = 'startTime'
      button1.value = `${this.getPlayerData().starttime}`
      form.appendChild(button1)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    voiceOutputHandle() {
      this.$refs.c3.showDialog(this.resdata)
    },
    markHandle() {
      let start = 0,end = 0

      if(Object.getOwnPropertyNames(this.wavesurfer.regions.list).length!=2){
        return
      }
      
      
      for(var k in this.wavesurfer.regions.list){

        // console.log(this.wavesurfer.regions.list[k])
        let obj = this.wavesurfer.regions.list[k]
        start = (obj.start).toFixed(2)*1000
        end = (obj.end).toFixed(2)*1000

      }
      if(this.getPlayerData().type==='ql'){
        // let params = new URLSearchParams()
        // params.append('callId',this.getcallid())
        // params.append('begintime',start)
        // params.append('endtime',end)
        // annotations(this.getcallid(),params).then(res => {
        //   // console.log(res)
        //   if(res.data === '该时间段可正常标注'){
            this.$refs.c2.showDialog(start,end)
      //     }    
      //   })
      // }else if(this.getNewqlData().type==='local'){
      //   this.$refs.c2.showDialog(start,end)
      }
    },
    callSetGetMark(params) {
      annotations(params, this.getResData().callid).then(res => {

        this.RES_DATA(res.data)
      }).catch(err => {
        this.$message.error('该时间段已标注')
      })
    },
    callGetMark(callid) {
      getRecord(callid)
        .then(res => {
          this.resdata = res.data
          this.RES_DATA(this.resdata)
          console.log('callGetMark--> getAnnotations--res:', res)
        })
        .catch(err => {
          console.error('callGetMark--> getAnnotations--err:', err)
        })
    }
	},
	beforeCreate() {},
	created() {},
	beforeMount() {},
	mounted() {
		this.interactInit()
    this.resizeInit()

		// this.showWavesurfer()
		// Object.defineProperty(window.WaveSurferAudioContext, 'sampleRate', {writable: true})
        //   window.WaveSurferAudioContext.sampleRate = 8000
		// this.wavesurfer.load(`http://192.168.1.242:9000/data/tmp/13146082867(北京市vs沈阳市)_主叫话单_13889220352_20171230004231_蓝胸鹑.wav`)
	},
	beforeUpdate() {},
	updated() {},
  activated() {},
  deactivated() {},
  beforeDestroy() {},
  destroyed() {}
};
</script>
<style scoped lang="scss">
	.hidden{
  	display: none;
	}
	.quicklisten{
		position: absolute;
		border: 1px solid #000;
		width: 800px;
		height: 600px;

    display: flex;
    flex-direction: column;
    box-sizing:border-box;

    &.cursorDefault{
      cursor: default;
    }
		#wave{
	    border-top: 1px solid #1f1f2f;
	    border-bottom: 1px solid #1f1f2f;   
	  }
	  #timeline{
	    background-color: #202027;
	    border-top: 1px solid #595964;
      height: 21px;
	  }
	  #waveform{
	    border-bottom: 1px solid #595964;
	    position: relative;
	  }
	  


		.title{
	    width: 100%;
	    flex-basis:70px;
	    background-color: #55565f;
	    line-height: 40px;
	    text-align: left;
	    flex-shrink: 0;

	    color: white;
	    text-indent: 15px;
	    ul{
        // border-top: 1px solid #1f1f2f;
        border-top: 1px solid #1f1f2f;
        box-shadow:0px 1px 0px 0px #848590 inset;
        margin-top: 30px;
	      display: flex;
	      // line-height: 40px;
	      align-items: center;
	      height: 40px;
	      padding-left: 15px;
	      li{
	        width: 24px;
	        height: 24px;
	        // margin-right: 5px;
	        position: relative;
	        cursor: default;

	        &:hover{
	          background: #414249;
	          // background: #28292d;
	          border: 1px solid #16161a;
	        }
	        &:active{
	          background: #28292d;
	          border: 1px solid #16161a;
	        }
	        span{
	          width: 14px;
	          height: 14px;
	          display: block;
	          position: absolute;
	          left: 50%;
	          top: 50%;
	          transform: translate(-50%,-50%);
	        }

	        &:nth-child(1) span{
	          background: url("../../static/images/Sprites.png") -3px -1px no-repeat;
	        }
	        &:nth-child(2) span{
	          background: url("../../static/images/Sprites.png") -32px -1px no-repeat;
	        }
	        &:nth-child(3) span{
	          background: url("../../static/images/Sprites.png") -63px -1px no-repeat;
	        }
	        &:nth-child(4) span{
	          background: url("../../static/images/Sprites.png") -93px -1px no-repeat;
	        }
	        &:nth-child(5) span{
	          background: url("../../static/images/Sprites.png") -123px -1px no-repeat;
	        }
	        &:nth-child(6){
	          margin-right: 10px;
	          span{
	            background: url("../../static/images/Sprites.png") -151px -1px no-repeat;
	          }
	          &:after{
	            content: "";
	            width: 1px;
	            height: 20px;
	            background-color: #1f1f2f;
	            position: absolute;
	            right: -9px;
	            top: 2px;
	          }
	        } 
	        &:nth-child(7){
	          margin-left: 10px;
	            span{
	            background: url("../../static/images/Sprites.png") -183px -1px no-repeat;
	          }
	        } 
	        &:nth-child(8) span{
	          background: url("../../static/images/Sprites.png") -213px -1px no-repeat;
	        }
	        &:nth-child(9) span{
	          background: url("../../static/images/Sprites.png") -243px -1px no-repeat;
	        }
	        &:nth-child(10) span{
	          background: url("../../static/images/Sprites.png") -273px -1px no-repeat;
	        }
	        &:nth-child(11) span{
	          background: url("../../static/images/Sprites.png") -303px -1px no-repeat;
	        }
	        &:nth-child(12) span{
	          background: url("../../static/images/Sprites.png") -333px -1px no-repeat;
	        }
	        &:nth-child(13) span{
	          background: url("../../static/images/Sprites.png") -363px -1px no-repeat;
	        }
	        &:nth-child(14){
	          margin-right: 10px;
	          span{
	            background: url("../../static/images/Sprites.png") -391px -1px no-repeat;
	          }
	          &:after{
	            content: "";
	            width: 1px;
	            height: 20px;
	            background-color: #1f1f2f;
	            position: absolute;
	            right: -9px;
	            top: 2px;
	          }
	        } 
	        &:nth-child(15){
	          margin-left: 10px;
	          span{
	            background: url("../../static/images/Sprites.png") -423px -1px no-repeat;
	          }
	        } 
	        &:nth-child(16) span{
	          background: url("../../static/images/Sprites.png") -453px -1px no-repeat;
	        }
	        &:nth-child(17){
	          margin-right: 10px;
	          span{
	            background: url("../../static/images/Sprites.png") -483px -1px no-repeat;
	          }   
	          &:after{
	            content: "";
	            width: 1px;
	            height: 20px;
	            background-color: #1f1f2f;
	            position: absolute;
	            right: -9px;
	            top: 2px;
	          }
	        } 
	        // &:nth-child(18){
	        //   margin-left: 10px;
	        //   span{
	        //     background: url("../../static/images/Sprites.png") -513px -0px no-repeat;
	        //   }
	        // } 
	        // &:nth-child(19) span{
	        //   background: url("../../static/images/Sprites.png") -543px -1px no-repeat;
	        // }
	        &:nth-child(18) {
	          width: 36px;
	          //margin-right: 10px;
            margin-left: 10px;

	          &.on{
	            background: #28292d;
	            border: 1px solid #16161a;
	          }

	          span{
	            background: url("../../static/images/Sprites.png") -573px -1px no-repeat;
	            width: 26px;
	          }   
	          &:after{
	            content: "";
	            width: 1px;
	            height: 20px;
	            background-color: #1f1f2f;
	            position: absolute;
	            right: -9px;
	            top: 2px;
	          }
	        }

	        // &:nth-child(21){
	        //   margin-left: 10px;

	        //   span{
	        //     width: 24px;
	        //     height: 24px;
	        //     // padding: 5px;
	        //     // background: url("../../static/images/Sprites.png") -603px -1px no-repeat;
	        //     background: url("../../static/images/Sprites.png") -600px 4px no-repeat;
	        //   }
	        // } 

          &:nth-child(19){
            margin-left: 15px;
          }
	        &:nth-child(19) span{
	          background: url("../../static/images/Sprites.png") -633px -1px no-repeat;
	        }
	        &:nth-child(20){
	          margin-left: auto;
            position: relative;
            top: -35px;
            right: 2px;
	          span{
	            background: url("../../static/images/Sprites.png") -782px -1px no-repeat;
	          }
	          &:hover{
	            span{
	              background: url("../../static/images/Sprites.png") -812px -1px no-repeat;
	            }
	          }
	        }
	      }
	    }
	    .closeBtn{
	      font-size: 20px;
	      font-weight: 700;
	      position: absolute;
	      right: 10px;
	      top: 10px;
	      color: #fff;
	    }
		}
		.wave{
	    width: 100%;
	    // height: 128px;
	    flex-basis:128px;
	    background-color: #000;
	    flex-shrink: 0;
	    position: relative;
	    .progerss{
	      position: absolute;
	      height: 18px;
	      width: 100%;
	      top:50%;
	      left:50%;
	      transform:translate(-50%, -50%);
	      .hide{
	        display: none;
	      }
	    }
	  }
	  .wave_controll{

	    border-top: 1px solid #595964;
	    border-bottom: 1px solid #1f1f2f;
	    width: 100%;
	    flex-basis:40px;
	    background-color: #43444d;
	    flex-shrink: 0;
	    ul{
	      display: flex;
	      flex-direction: row;
	      height: 40px;
	      // line-height: 40px;
	      align-items: center;
	      padding-left: 8px;
	      li{
	        width: 24px;
	        height: 24px;
	        position: relative;
	        margin-right: 8px;

	        background: url("../../static/images/Sprites.png") -873px -35px no-repeat;
	        &:hover{
	          background: url("../../static/images/Sprites.png") -903px -35px no-repeat;
	        }
	        &:active{
	          background: url("../../static/images/Sprites.png") -933px -35px no-repeat;
	        }

	        span{
	          width: 14px;
	          height: 14px;
	          display: block;
	          position: absolute;
	          left: 50%;
	          top: 50%;
	          transform: translate(-50%,-50%);
	        }

	        &:nth-child(1){
	          width: 110px;
	          height: 30px;
	          line-height: 30px;
	          text-align: center;
	          font-size: 12px;
	          color: #fff;
	          background: none;
	          background-color: #363741;
	          border: 1px solid #031b1b;
	        }  
	        &:nth-child(2){
	          span{
	            background: url("../../static/images/Sprites.png") -664px -41px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -994px -41px no-repeat;
	            }
	          }
	        } 
	        &:nth-child(3){
	          span{
	            background: url("../../static/images/Sprites.png") -691px -41px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -1021px -41px no-repeat;
	            }
	          }
	        } 
	        &:nth-child(4){
	          span{
	            background: url("../../static/images/Sprites.png") -720px -41px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -1050px -41px no-repeat;
	            }
	          }

	          &.on span{
	            background: url("../../static/images/暂停按钮.png") -5px -5px no-repeat;
	          }

	        } 
	        &:nth-child(5){
	          span{
	            background: url("../../static/images/Sprites.png") -751px -40px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -1081px -40px no-repeat;
	            }
	          }
	        } 
	        &:nth-child(6){
	          span{
	            background: url("../../static/images/Sprites.png") -782px -40px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -1112px -40px no-repeat;
	            }
	          }
	        } 
	        &:nth-child(7){
	          span{
	            background: url("../../static/images/Sprites.png") -811px -40px no-repeat;
	          } 
	          &:active{
	            span{
	              background: url("../../static/images/Sprites.png") -1141px -40px no-repeat;
	            }
	          }
	        } 

	        &:nth-child(10){
	          margin-left: 8px;
	          margin-right: 16px;
	          width: 100px;
	          // width: 68px;
	          // border: 1px solid #16161a;
	          
	          background: none;
	          // background-color: #6f7079;
	          // text-align: center;
	          // line-height: 22px;
	          // color: #fff;
	          // font-size: 12px;
	          box-sizing:border-box;
	        }

	        &:nth-child(8){
	          background: none;
	          span{
	            width: 18px;
	            background: url("../../static/images/静音.png") no-repeat;
	          }
	          &.on{
	            span{
	              width: 18px;
	              background: url("../../static/images/Sprites.png") -843px -40px no-repeat;
	            }
	          }
	          
	        }
	        &:nth-child(9){
	          width: 80px;
	          background: none;
	          input{
	            -webkit-appearance: none;
	            -moz-appearance: none;
	            -ms-appearance: none;
	            width: 80px;
	            height: 2px;
	            background-color: #bbbbbb;
	            position: absolute;
	            left: 0;
	            top: 12px;


	            &::-webkit-slider-thumb{
	              -webkit-appearance: none;
	            }
	            &::-moz-range-trackpseduo{
	              -moz-appearance: none;
	            }
	            &::-ms-track { 
	              width: 100%; 
	              cursor: pointer; 
	              background: transparent; /* Hides the slider so custom styles can be added */ 
	              border-color: transparent; color: transparent; 
	            }
	            &:focus{
	              outline: none;
	            }
	            &::-webkit-slider-thumb{
                -webkit-appearance: none;
                height: 9px;
                width: 9px;
                margin-top: -1px; 
                background: #bbb; 
                border-radius: 50%; 
                border: solid 0.125em rgba(205, 224, 230, 0.5);    
	            } 
	            &::-moz-range-thumb{
                -moz-appearance: none;
                height: 6px;
                width: 6px;
                margin-top: -1px; 
                background: #bbb; 
                border-radius: 50%; 
                border: solid 0.125em rgba(205, 224, 230, 0.5);    
	            }  
	            &::-ms-track{
                -moz-appearance: none;
                height: 6px;
                width: 6px;
                margin-top: -1px; 
                background: #bbb; 
                border-radius: 50%; 
                border: solid 0.125em rgba(205, 224, 230, 0.5);    
	            } 
	          }
	        }
	        &:nth-child(11){
	          width: 80px;
	          
	        }
          &:nth-child(12){
            span{
              width: 17px;
              background: url("../../static/images/上一段.png") no-repeat;
            }
            
          }
	        &:nth-child(13){
	          span{
	            width: 17px;
	            background: url("../../static/images/下一段.png") no-repeat;
	          }
	        }

	        &:nth-child(14){
	          margin-left: auto;
	          background: none;
	          span{
	            width: 17px;
	            background: url("../../static/images/Sprites.png") -693px -1px no-repeat;
	          }
	          &.isfold{
	            span{
	              width: 17px;
	              background: url("../../static/images/Sprites.png") -663px -1px no-repeat;
	            }
	          }
	        }
	      }
	      
	    }
	  }
    .tcontent{
      border-top: 1px solid #848590;
      flex-basis:40px;
      width: 100%;
      flex-shrink: 0;
      // border: 1px solid #000;
      line-height: 40px;
      display: flex;
      align-items: flex-end;
      background-color: #55565f;
      .btn_group{
        width: 300px;
        padding-left: 10px;
        height: 26px;
        flex-grow: 0;
        .el-button {
          background-image: none;
        }
        .el-button.el-button--primary::after {
          display: none;
        }
        &.btn_group1{
          padding-left: 0px;
          top: 1px;
          position: relative;
          // margin-left: -1px;
        }
        .btn{
          font-size: 16px;
        }
        .filemsg{
          width: 120px;
          height: 24px;
          line-height: 24px;
          padding: 0;
        }
        .targetres{
          width: 120px;
          height: 24px;
          line-height: 24px;
          padding: 0;
        }
      }
      .rewrite_box{
        display: flex;
        flex-grow: 1;
        
      }
    }
    .content{
      width: 100%;
      // height: 397px;
      height: 100%;
      flex-shrink: 1;
      flex-grow: 1;
      display: flex;
      background-color: #55565f;
      // min-height: 0;
      overflow: hidden;
      // overflow: auto;
      .lcontent{
        background-color: #767783;
        width: 280px;
        // height: calc(100% - 40px);
        height: 100%;
        margin: 0 10px 0 10px;
        flex-shrink: 0;
        // border-radius: 5px;
        // box-shadow: 1px 1px 10px 1px #eee;
        border: 1px solid #1f1f2f;

        overflow: auto;
      }
      .rcontent{
          position: relative;
        flex-grow:1;
        // height: calc(100% - 40px);
        height: 100%;
        background-color: #c9cad5;
        // overflow: scroll;
        // overflow-x:hidden;
        // overflow-y:auto;
        overflow: hidden;
        // box-shadow: 2px 2px 4px 2px #ddd inset;
        // border: 1px solid #1f1f2f;
      }
    }
    .bmenu{
      height: 40px;
      background-color: #55565f;
      ul{
        display: flex;
        justify-content: flex-end;
        line-height: 40px;
        padding-right: 20px;
        li{
          color: #fff;
          padding: 0 10px;
          &.outputBtn{
            font-size:12px;
            color: #D4D5E3;
            height: 20px;
            margin-top: 10px;
            line-height: 18px;
            box-sizing:border-box;
            border: 1px solid rgba(0,0,0,0);

            &:hover{
              background: #414249;
              // background: #28292d;
              border: 1px solid #16161a;
            }
            &:active{
              background: #28292d;
              border: 1px solid #16161a;
            }
          }
        }
      }
    }
	}
</style>
<style lang="scss">
  .quicklisten{
    .vadCancel{
      position: absolute;
      top: calc(56% + 30px);
      // top: 70%;
      left: 50%;
      transform:translate(-50%,-50%);
      z-index: 2001;
      height: auto;
      &.el-button{
        padding: 6px 10px !important;
      }
    }
    .el-progress{
      width: 60% !important;
    }
    .el-progress__text{
      color: #fff;
    }
    .outputVoice{
      &.el-button{
        background: #6f7079 !important;
        box-shadow: none !important;
      }
    }
  }

  .pathSelect{
    .el-input__inner{
      color: #fff;
      background-color: #6f7079;
      border: none !important;
    }
  }

  wave::-webkit-scrollbar {/*滚动条整体样式*/
    height: 20px;
  }
  wave::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background: #80828c;
  }
  wave::-webkit-scrollbar-button{
    // background: #43444d;
  }
  ::-webkit-scrollbar-button:horizontal:increment {
    background: url("../../static/images/Sprites.png") -718px 2px no-repeat;
    background-color: #43444d;
  }

  ::-webkit-scrollbar-button:horizontal:decrement {
    background: url("../../static/images/Sprites.png") -748px 2px no-repeat;
    background-color: #43444d;
  }

  wave::-webkit-scrollbar-track {/*滚动条里面轨道*/
    background: #5e5f69;
  }
  .lcontent::-webkit-scrollbar,.rcontent::-webkit-scrollbar {/*滚动条整体样式*/
    height: 20px;
  }
  .lcontent::-webkit-scrollbar-thumb,.rcontent::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    background: #80828c;
  }
  .lcontent::-webkit-scrollbar-button,.rcontent::-webkit-scrollbar-button{

  }
  .lcontent::-webkit-scrollbar-track,.rcontent::-webkit-scrollbar-track{/*滚动条里面轨道*/
    background: #5e5f69;
  }
  .quicklisten{
    .translate{
      &.el-dropdown{
        width: 24px;
        height: 24px;
        top: -1px;
        left: -16px;
      }
    }
    .wave_controll{
      .el-select{
        .el-input__inner{
          height: 22px !important;  
          font-size: 12px;   
        }
        .el-input__suffix{
            .el-input__icon{
            line-height: 1 ;
          }
        }
        
      }
    }
    
    .el-input__inner{
      height: 22px;
      // width: 100px;
    }

    line-height: 1.5;
    font-size: 14px;
    .btn_group .el-button{
      width: 68px;
      height: 26px;
      padding: 0;
      background-color: #55565f;
      color: #fff;
     
      
      position: relative;
      top: 1px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #1f1f2f;
      margin-right: 0;
      &.on{
        background-color: #767783;
        border: 1px solid #1f1f2f;
        border-bottom: none;
      }
    }
    .rewrite_box{
      .btn_group .el-button{
        top: 0;
        border-bottom: none;
        z-index: 1;
        &.on{
          background-color: #c9cad5;
          color: #000; 
        }
        &:nth-child(2).on{
          background-color: #fff;
        }
      }
    }
    .wave{
      &:focus {
        outline: none;
      }
    }
    .bmenu{
      .el-checkbox{
        color: #fff;
      }
      .el-checkbox__label{
        font-size: 12px;
        color: #D4D5E3;
      }
    }
  }
  
</style>