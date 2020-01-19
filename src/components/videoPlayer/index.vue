<!--
 * @Author: coco-Tang
 * @Date: 2019-08-12 17:20:31
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-08-16 09:52:56
 * @Description: 播放器组件
 -->

<template>
  <!-- :class="{ 'hidden' : hidden }" -->
	<div class="quicklisten1"
  
  >

    <!-- <mark-dialog @setAnnotation="callSetGetMark" ref="c2"></mark-dialog> -->
		<div class="title">
			<ul>
				<!-- <li @click="copy" title="复制(ctrl+c)"><span></span></li>
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
        <li @click="save" title="另存为(ctrl+shift+s)"><span></span></li>
        <li @click="vad(true)" :class="{ 'on' : params.vad }" title="vad(alt+3)"><span></span></li>
        <li @click="markHandle" title="标注(alt+5)"><span></span></li> -->
        <li @click="closeHanlde"><span></span></li>
			</ul>
		</div>
		<!-- <div class="wave" tabindex="-1" id="wave">     
      <div id="timeline"></div>
      <div id="waveform"></div>
    </div> -->
    <!-- <video style="background:#000;object-fit:fill" src="@/static/Videezy_Slideshow_08_Preview.mp4" height="426" controls></video> -->
    <!-- <video style="background:#000;object-fit:contain" src="@/static/Videezy_Slideshow_08_Preview 00_00_00-00_00_33~1.mp4" height="426" controls></video> -->
    <video autoplay style="background:#000;object-fit:contain" :src=videoSrc height="426" controls></video>
    <!-- <video src="@/static/mov_bbb.mp4" controls></video> -->
    <!-- <div class="wave_controll">
      <ul>
        <li>播放速度:&nbsp;&nbsp;{{this.params.playRate*100}}%</li>
        <li @click="slowPlay" title="慢放(←)"><span></span></li>
        <li @click="previousRecord" title="上一条(shift+↑)"><span></span></li>
        <li @click="playPause" :class="{ 'on' : params.playPausebutton }" title="播放/暂停(insert)"><span></span></li>
        <li @click="nextRecord" title="下一条(shift+↓)"><span></span></li>
        <li @click="fastPlay" title="快放(→)"><span></span></li>
        <li @click="puasePlay" title="停止(alt+q)"><span></span></li>
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
        <li @click="toggleMute" :class="{ 'on' : params.toggleMutebutton }" class="sound"><span></span></li>
        <li>
          <input @mouseup="volumeBarHandle" v-model="params.volValue" type="range" min="0" max="1" value="0.8" step="0.01" />
        </li>
        <li :class="{'hidden' : true}" title="上一段"><span></span></li>
        <li :class="{'hidden' : true}" title="下一段"><span></span></li>
        <li @click="foldHandle" title="展开/收起(alt+w)" :class="{ 'isfold' : foldFlag }"><span></span></li>
      </ul>
    </div> -->
    <div class="tcontent" :class="{ 'hidden' : foldFlag }">
      <el-button-group class="btn_group">
        <el-button type="primary" :class="{ 'on' : filemsg }" @click="tab('filemsg')" >文件信息</el-button>
        <el-button type="primary" :class="{ 'on' : targetres }" @click="tab('targetres')" :disabled="isEdited">命中结果</el-button>
      </el-button-group>
      <div class="rewrite_box">
        <el-button-group class="btn_group btn_group1">
          <el-button type="primary" :class="{ 'on' : trans }" @click="tabr('trans')" :disabled="isEdited">转写</el-button>
          <!-- <el-button type="primary" :class="{ 'on' : mark }" @click="tabr('mark')" :disabled="isEdited">标注</el-button> -->
        </el-button-group>
        <div :class="{ 'mask': true , 'hidden': !isEdited }"></div>
      </div>
    </div>
    <div :class="{ 'hidden' : foldFlag }" class="content">
      <div class="lcontent">
        <file-info @childPlay='wavePlay'></file-info>
      </div>
      <div class="rcontent">
        <component @childPlay='wavePlay' ref="c1" :is="transcribeValue"></component>
        <div :class="{ 'mask': true , 'hidden': !isEdited }">
            <p class='center'>音频文件已被修改, 需要重新转写。</p>
        </div>
      </div>
    </div>
    <div class="bmenu" :class="{ 'hidden' : foldFlag }" >
      <ul>
        <li><el-checkbox :class="{ 'hidden' : !hideFold }" @change="timeCheckedHandle" v-model="timeChecked">显示时间</el-checkbox></li>
        <!-- <li><el-checkbox v-model="transChecked">显示翻译</el-checkbox></li> -->
        <li :class="{ 'hidden' : hideFold }"><el-checkbox v-model="foldChecked">默认展开</el-checkbox></li>
        <!-- <li><el-checkbox @change="syncDisplay" v-model="vioceChecked">与声音同步</el-checkbox></li> -->
        <li class="outputBtn" :class="{ 'hidden' : !trans }"  @click="outWood">出材</li>
        <!-- <li class="outputBtn" :class="{ 'hidden' : trans }"  @click="textgrid">导出textgrid</li> -->
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

import {annotations,annotationsVerify,delAnnotations,getAnnotations,getVad,getAsrs,listenersRecord,getAudio,getHisRecord,exportWood,exportTextGrid} from '@/api/player.js'

import { getVideoRecord } from '@/api/video'
import { uploadSpeakersVoices } from '@/api/speaker'
import {url1} from '@/api/player.js'

import fileInfo from './fileInfo'
import transcribe from './transcribe'
import localTranscribe from './localTranscribe'
import markDialog from '@/components/dialog/markDialog.vue'
// import audio from '@/static/demo (2).wav'

export default {
  name: 'quicklisten1',
  components: {
    'file-info': fileInfo,
    'transcribe': transcribe,
    'localTranscribe': localTranscribe,
    'markDialog': markDialog
	},
	data() {
		return {
      pathValue: 'all',
      pathOptions: [
        {
          value: 'all',
          label: '展示合路'
        },{
          value: 'A',
          label: '展示A路'
        },{
          value: 'B',
          label: '展示B路'
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
      pathDisabled: true,
      videoSrc: ''
    }
  },
  computed: {
    // getVideoData:{
    //   get:function(){
    //     return this.getVideoData().dateFlag;
    //   },
    //   set:function(newValue){
    //     this.getVideoData().dateFlag = newValue;
    //   }
    // }
    getCallid() {
        console.log('getCallid')
        console.log(this.getVideoData())
        return this.getVideoData().dateFlag
    },
    getComPath() {
        return this.$store.state.player.pathFlag
    },
    getComResize() {
        return this.getVideoResizeData().dateFlag
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

      // this.reset()
      let div = document.querySelector(".quicklisten1")
      if (this.getVideoData().type==='ql') {
        this.hidden = false
        // this.hotkeysbind()
        this.getData(this.getVideoData().callid)
        this.foldFlag = false
        this.hideFold = true
        this.resizemove = true
        this.pathDisabled = false

        this.transcribeValue = 'transcribe'

        let RESIZE_DATA = this.getVideoResizeData()
        if ( this.isEqual(div,RESIZE_DATA) ) {
          return
        }
        this.setDomAttribute(div,RESIZE_DATA);

      }else if (this.getVideoData().type==='des') {
        this.hidden = true
        // this.wavesurfer.destroy()
      } else if (this.getVideoData().type === 'impVideoList') {
        this.hidden = false
        this.getData(this.getVideoData().callid)
        this.foldFlag = false
        this.hideFold = true
        this.resizemove = true
        this.pathDisabled = false
        this.transcribeValue = 'transcribe'

        let RESIZE_DATA = this.getVideoResizeData()
        if ( this.isEqual(div,RESIZE_DATA) ) {
          return
        }
        this.setDomAttribute(div,RESIZE_DATA);
      }

    },
    getComPath() {
      console.log('path changed')
      console.log(this.getPathFlag())
      // this.pathChanged()
    },
    getComResize() {
      //缩放重绘
      // this.wavesurfer.drawer.fireEvent('redraw');
    },
    getComResizeLocal() {
      //缩放重绘
      // this.wavesurfer.drawer.fireEvent('redraw');
    },
    getRollFlag() {
      this.vioceChecked = !this.getsyncRollFlag()
    }
	},
	methods: {
    ...mapActions(['PLAYER_DATA','RES_DATA','PATH_FLAG','WAVESURFER_DATA','ISPLAY','NEXT_RECORD','SYNCROLLFLAG','RANGE_INDEX','RESIZE_DATA','RESIZE_DATALOCAL','LCOBTN_DATA','RCOBTN_DATA','TIMEFLAG','REFRESHSLIDE','ANNOTATION_DATA','VIDEO_DATA','VIDEO_RESIZE_DATA','VIDEO_RES_DATA']),
    ...mapGetters(['getVideoData','getPathFlag','getsyncRollFlag','gettimeFlag','getNextRecord','getRangeIndex','getResizeData','getResizeLocalData','getAccount','getSpeakerId','getHistoryId','getVideoData','getVideoResizeData','getVideoResData']),
    isEqual(div,{ width, height, top, left } = data) {
      return (parseInt(div.style.width) === parseInt(width)) && (parseInt(div.style.height) === parseInt(height)) && (parseInt(div.style.top) === parseInt(top)) && (parseInt(div.style.left) === parseInt(left))
    },
    setDomAttribute(domEL,{ width, height, top, left } = data) {
      console.log('setDomAttribute')
      console.log(domEL)
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
    getData(callid) {
      let params = new URLSearchParams()
      params.append("recordType", "video")

      getVideoRecord(callid,params).then(res => {
        this.resdata = res.data
        // console.log('%cgetData--res:', 'color:blue', res)
        // console.log('%cgetData--this.rcobtn:', 'color:blue', this.rcobtn)
        this.VIDEO_RES_DATA(res.data) // getReocrd的返回结构比annotations多了层annotation, 所以getData后的RES_DATA与annotations后的RES_DATA所存的结构并不一致
        // this.vadInit()
        this.videoSrc = res.data.files.v
        this.asrsInit()
        // this.loadAudio(this.getVideoResData().appended.files.combiner)
        // this.loadAudio(`${url1}/records/${callid}/files?fileTag=combiner`)
        // this.loadAudio(audio)
        // this.loadAudio(this.getVideoResData().files.c)
        let params = new URLSearchParams()
        params.append('callId',callid)
        params.append('user',this.getAccount())
        params.append("recordType", "video")
        
        return listenersRecord(params,callid)
      }).then(res => {
        console.log('listenersRecord')
        console.log(res)
      })
    },
    asrsInit() {
      let params = new URLSearchParams()
      params.append("recordType", "video")
      getAsrs(this.getVideoResData().callid,params).then(res => {
        this.asrsArr = res.data
      })
    },

    closeHanlde() {	
      let video = document.querySelector('video')
      video.pause()
      let d = new Date()
      this.VIDEO_DATA({
        dateFlag: d,
        type: 'des',
        callid: ''
      })
    },
    interactInit() {
      console.log('interactInit')
      let _this = this
      interact('.quicklisten1')
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
        if(_this.getVideoData().type==='ql'){
          _this.VIDEO_RESIZE_DATA({
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
      if(this.getVideoData().type==='ql'){
        this.VIDEO_RESIZE_DATA({
          dateFlag: d,
          left: x,
          top: y,
          width: this.getVideoResizeData().width,
          height: this.getVideoResizeData().height,
        })
      }


      // window.dragMoveListener = this.dragMoveListener;
    },

    reset() {


      document.querySelector('.quicklisten1').classList.remove("cursorDefault")
      hotkeys.unbind('right,left,-,=,insert,delete,alt+q,alt+9,alt+5,alt+3,alt+w,alt+6,ctrl+shift+s,ctrl+up,ctrl+down,ctrl+c,ctrl+v,ctrl+x,ctrl+z,ctrl+r,alt+-,alt+=,shift+right,shift+left,shift+up,shift+down,alt+7,alt+8,alt+2,alt+1,alt+s')
      
      if(this.wavesurfer.destroy){
        this.volumeCached = this.wavesurfer.getVolume()
        
        console.log('this.wavesurfer.unAll()')
        this.wavesurfer.unAll()
        this.wavesurfer.destroy()  

      }
      // this.rangeIndex = 0
      // this.RANGE_INDEX(this.rangeIndex)
      this.showWavesurfer()
      Object.defineProperty(window.WaveSurferAudioContext, 'sampleRate', {writable: true})
      window.WaveSurferAudioContext.sampleRate = 8000
      this.hideFold = false
      this.pathValue = 'all'
      if(this.params.vad){
        this.vad(true)
      }
      // this.source ? this.source.cancel() : ''
      // this.percentage = 0
    },

    resizeInit() {

      let width = document.body.clientWidth,
      height = document.body.clientHeight
      if((width/2)<760){
        this.VIDEO_RESIZE_DATA({
          dateFlag: '',
          left: width/2-380,
          top: height*0.9-600,
          width: 760,
          height: 600,
        })
      }else{
        this.VIDEO_RESIZE_DATA({
          dateFlag: '',
          left: width/2-width/4,
          top: height/2-height/4,
          width: width/2,
          height: height/2,
        })

      }

      // this.VIDEO_RESIZE_DATA({
      //   dateFlag: '',
      //   left: width/2-380,
      //   top: height*0.9-800,
      //   width: 760,
      //   height: 800,
      // })
      
    
    },

    timeCheckedHandle() {
      this.timeFlag = !this.gettimeFlag()
      this.$refs.c1.timeSwitch(this.timeFlag)
      this.TIMEFLAG(this.timeFlag)
    },
    outWood() {
      const form = document.createElement('form')
      form.action = exportWood(this.getVideoResData().callid)
      form.method = 'get'
      form.style.display = 'none'
      const button = document.createElement('input')
      const button1 = document.createElement('input')
      button.type = 'submit'
      button1.value = 'video'
      button1.name = 'recordType'
      form.appendChild(button)
      form.appendChild(button1)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
    },
    textgrid() {
      if(this.resdata.annotationItem===''){
        return
      }

      const form = document.createElement('form')
      form.action = exportTextGrid(this.getVideoResData().callid)
      form.method = 'get'
      form.style.display = 'none'
      const button = document.createElement('input')
      button.type = 'submit'
      form.appendChild(button)
      document.body.appendChild(form)
      form.submit()
      document.body.removeChild(form)
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
      if(this.getVideoData().type==='ql'){
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
    wavePlay(start) {
      document.querySelector("video").currentTime = start
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
	.quicklisten1{
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
	  }
	  #waveform{
	    border-bottom: 1px solid #595964;
	    position: relative;
	  }
	  


		.title{
	    width: 100%;
	    flex-basis:40px;
	    background-color: #55565f;
	    line-height: 40px;
	    text-align: left;
	    flex-shrink: 0;

	    color: white;
	    text-indent: 15px;
	    ul{
	      display: flex;
	      // line-height: 40px;
	      align-items: center;
	      height: 40px;
	      padding-left: 15px;
	      li{
	        width: 24px;
	        height: 24px;
	        margin-right: 5px;
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


	        &:nth-child(1){
	          margin-left: auto;
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

	        &:nth-child(8){
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

	        &:nth-child(9){
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
	        &:nth-child(10){
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
	          span{
	            width: 17px;
	            background: url("../../static/images/上一段.png") no-repeat;
	          }
	          
	        }
	         &:nth-child(12){
	          span{
	            width: 17px;
	            background: url("../../static/images/下一段.png") no-repeat;
	          }
	        }

	        &:nth-child(13){
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
      overflow: hidden;
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
  .quicklisten1{
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
  .quicklisten1{
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