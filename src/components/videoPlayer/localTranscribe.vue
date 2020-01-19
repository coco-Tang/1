<template>
  <div class="transcribe">
    <div class="child child1 hidden" :class="{'show':rcobtn}">
      <div class="rendered">
        <div class="t_item">
          <div v-if="resdata!=null">
            <div v-for="(item,index) in resdata">
              <div class="called">
                <div class="top">
                  <div class="icon">
                    <span>未知</span>
                  </div>
                  <div class="time">{{item.StartTime.toFixed(2)}}～{{item.EndTime.toFixed(2)}}</div>
                </div>
                <div class="bottom">
                  <div :data-num="index" @click="textPlay(item,$event)" v-bind:class="{ 'selected' : timeArr.flag[index] }" class="text"><span class="triangle"></span><div v-html="item.Text" class="pathcontent"></div></div>
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
        class="tb-edit" 
        highlight-current-row
        @current-change = "currentChange"
        @selection-change="handleSelectionChange"
        >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column label="序号" type="index" width="80">
        </el-table-column>
        <el-table-column  label="开始(S)"  width="90">
          <template slot-scope="scope">
            <span>{{scope.row.start/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="结束(S)"  width="90">
          <template slot-scope="scope">
            <span>{{scope.row.end/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="时长(S)"  width="90">
          <template slot-scope="scope">
            <span>{{scope.row.duration/1000}}</span>
          </template>
        </el-table-column>
        <el-table-column  label="标注内容" >
          <template slot-scope="scope">

            <el-input size="small" @blur="contentChanged(scope.row)" v-model="scope.row.content" placeholder="请输入内容"></el-input> <span class="ellipsis" :title="scope.row.content">{{scope.row.content}}</span>

          </template>
        </el-table-column>
        <el-table-column  label="性别"  width="120">
          <template slot-scope="scope">
            <el-select @change="genderChanged(scope.row)" v-model="scope.row.gender" placeholder="请选择">
              <el-option
                v-for="item in genderOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>

            </el-select><span class="ellipsis">{{genderTrans[scope.row.gender]}}</span>

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

            </el-select><span class="ellipsis">{{scope.row.lang}}</span>

          </template>
        </el-table-column>
        <el-table-column
           fixed="right" width="53" :render-header="renderHeader">
          <template slot-scope="scope">
            <div class="delete" @click="deleteRow(scope.$index, tableData)"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>


import {mapActions,mapGetters} from 'vuex'
// import {updateEdit,textMerge,getCallidData,textSplitting,signSegment,removeSign,exportTextGrid,annotation,getLanguage} from '@/api/ql.js'
// import hotkeys from 'hotkeys-js';
// import hotkeys from '@/hotkeys/dist/hotkeys.js';

export default {
  name: 'transcribe',
  data () {
    return {
      rcobtn:true,
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
      timeArr:{
        begintime:[],
        endtime:[],
        flag:[],
        filetag:[],
        index:[],
        text:[]
      },
      resdata: '',
      currentPlayingItems: []

    }
  },

  // computed:{
  //   getComResdata() {
  //     return this.$store.state.ql.resdata
  //   },
  //   // getComParams() {
  //   //   return this.$store.state.params
  //   // },
  //   getComRcobtn() {
  //     return this.$store.state.ql.rcobtn
  //   },
  //   getComIsplay() {
  //     return this.$store.state.ql.isplay
  //   },
  //   getComWavesurfer() {
  //     return this.$store.state.ql.wavesurfer
  //   },
  //   getComCallid() {
  //     return this.$store.state.ql.callid
  //   },
  //   getComkeyWord() {
  //     return this.$store.state.ql.keyWord.start
  //   },
  //   getCompathChange() {
  //     // return this.getpathChange()
  //   },
  //   getQlData(){
  //     return this.getNewqlData().dateFlag
  //   }
  // },
  // watch: {
  //   getComResdata() {
  //     // this.resdata = this.getresdata()

  //     this.timeArrInit()
  //     // this.timeArrInit()
  //          // /tableData
  //     // console.log('transcribe')
  //     // console.log(this.resdata)

  //     this.setTableData()
  //     // this.setTable()
  //     // console.log('getComResdata')
  //     // console.log(this.resdata)
  //     // console.log(this.timeArr)
  //     // this.syncDisplay()

  //   },
  //   getComRcobtn(){
  //     this.rcobtn = this.getrcobtn()
  //   },
  //   // getComParams(){
  //   //   this.params = this.getparams()
      
  //   //   console.log('$store.state.params')
  //   //   console.log(this.params)
  //   // },
  //   getComWavesurfer() {
  //     this.wavesurfer = this.getwavesurfer()
  //     // this.syncDisplay()
  //   },
  //   getComIsplay() {

  //     this.isplay = this.getisplay()
  //     this.syncDisplay()

  //     // console.log('$store.state.isplay')
  //     // console.log(this.isplay)
  //   },

  //   getComCallid() {
  //     // this.callid = this.getcallid()
  //     // console.log('getComCallid')
  //     // console.log(this.callid)
  //   },
  //   getComkeyWord() {
  //     // this.keyWord = this.getkeyWord()
  //     // this.showKeyWord()
  //   },
  //   getCompathChange() {
  //     this.syncDisplay()
  //   },
  //   getQlData() {
  //     // this.openDb()
  //   }
  // },  
  methods: {
    ...mapActions(['RES_DATA','WAVESURFER_DATA','PARAMS_DATA','LCOBTN_DATA','ISPLAY','SYNCROLLFLAG','RCOBTN_DATA','DB']),
    ...mapGetters(['getstate','getQlresdata','getwavesurfer','getparams','getrcobtn','getisplay','getcallid','getkeyWord','getpathChange','getAccount','getNewqlData','getdb']),
    openDb(){
      let db;
      let request = window.indexedDB.open('localFile')
      // console.log('open')
      // console.log(request)

      request.onerror = function (event) {
        // console.log('数据库打开报错');
      }


      request.onsuccess =  (event) => {
        db = request.result;
        // this.db = db
        // console.log('数据库打开成功');
        // console.log(this)
        this.DB(db)
        this.setTableData()
        
      }

      request.onupgradeneeded =  (event) => {
        db = event.target.result;
        var objectStore;
        if (!db.objectStoreNames.contains('fileTable')) {

          console.error('onupgradeneeded')
          objectStore = db.createObjectStore('fileTable', { keyPath: 'file' });

          objectStore.createIndex('file', 'file', {
            unique: true    
          });
          objectStore.createIndex('markTable', 'markTable');
          objectStore.createIndex('trans', 'trans');
          objectStore.createIndex('vad', 'vad');
        }
        // this.db = db
        // this.DB(db)
        // this.setTableData()
      }
      // console.log('localTrans')
      // console.log(db)

    },
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
    setTableData() {
      
      let db = this.getdb()
      let transaction = db.transaction(['fileTable'], 'readwrite').objectStore('fileTable')

      if(!this.getNewqlData().callid.name){
        return
      }

      let req = transaction.get(this.getNewqlData().callid.name)

      req.onerror = function(event) {
        // console.log('事务失败');
      };

      req.onsuccess = (event) =>{

        if (req.result && req.result.markTable) {
          // console.log('%c request','color: pink');
          // console.log(req);
          // console.log(req.result.markTable)
          
          this.setTable(req.result.markTable)
        } else {
          this.setTable('')
          // console.log('未获得数据记录');
        }
      };

    },
    setTable(data) {
      this.tableData = []


      for(let k = 0;k < data.length; k++){
        this.tableData.push({
          start: data[k].begintime,
          end: data[k].endtime,
          duration: data[k].lengthtime,
          content: data[k].content,
          gender: data[k].sex,
          lang: data[k].language
        })
      }

    },
    renderHeader(createElement, { column }) {
      return createElement(
        'div',
        {
          class: 'headDelete',
 
          on: {
            click: this.deletaBatch
          },
        }
      );
    },
    deletaBatch() {
      let arr = this.multipleSelection
      // console.log(arr)

      

      this.db = this.getdb()

      let transaction = this.db.transaction(['fileTable'], 'readwrite').objectStore('fileTable')

      let req = transaction.get(this.getNewqlData().callid.name)

      req.onerror = function(event) {
        // console.log('事务失败');
      };

      req.onsuccess = (event) => {
        

        if (req.result && req.result.markTable) {
          // console.log('request');
          // console.log(req);
          // console.log(req.result.markTable)


          const result = req.result.markTable.filter((v) =>{
            for(let k in arr){
              if(v.begintime === arr[k].start && v.endtime === arr[k].end){
                return false
              }
            }
            return true
          });
          // console.log(result)
          transaction.put({file: this.getNewqlData().callid.name,markTable:result})

          
          this.RES_DATA(new Date())
        } else {
          // console.log('未获得数据记录')
        }
      }

    },
    deleteRow(index, rows) {
      // console.log('deleteRow')
      // console.log(rows)
      // console.log(index)

      this.db = this.getdb()

      let transaction = this.db.transaction(['fileTable'], 'readwrite').objectStore('fileTable')

      let req = transaction.get(this.getNewqlData().callid.name)

      req.onerror = function(event) {
        // console.log('事务失败');
      };

      req.onsuccess = (event) => {
        

        if (req.result && req.result.markTable) {
          // console.log('request');
          // console.log(req);
          // console.log(req.result.markTable)
          req.result.markTable.splice(index,1)
          // console.log(req.result.markTable)

          transaction.put({file: this.getNewqlData().callid.name,markTable:req.result.markTable})

          
          this.RES_DATA(new Date())
        } else {
          // console.log('未获得数据记录')
        }
      }
    },
    currentChange(currentRow,oldCurrentRow) {
      if(!currentRow){
        return
      }

      this.Utils.waveRegion(this.wavesurfer,currentRow.start/1000,currentRow.end/1000,'rgba(0,180,0,.3)',false)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
      this.db = this.getdb()

      let transaction = this.db.transaction(['fileTable'], 'readwrite').objectStore('fileTable')

      let req = transaction.get(this.getNewqlData().callid.name)

      req.onerror = function(event) {
        // console.log('事务失败');
      };

      req.onsuccess = (event) => {
        

        if (req.result && req.result.markTable) {

          const result = req.result.markTable.map((v) =>{
            
              if(v.begintime === row.start && v.endtime === row.end){
                v.content = row.content
                v.sex = row.gender
                v.language = row.lang
                // console.log('if')
                // console.log(v)
              }
            return v
          });
          // console.log(result)
          transaction.put({file: this.getNewqlData().callid.name,markTable:result})

          
          this.RES_DATA(new Date())

        } else {
          // console.log('未获得数据记录')
        }
      }
    },

    timeArrInit () {

      this.timeArr.begintime = []
      this.timeArr.endtime = []
      this.timeArr.flag = []
      this.timeArr.text = []

      this.resdata = this.getQlresdata()
      let item = this.resdata

      for(let i=0;i<item.length;i++){
        this.timeArr.begintime.push(Number((item[i].StartTime).toFixed(2))*1000)
        this.timeArr.endtime.push(Number((item[i].EndTime).toFixed(2))*1000)
        this.timeArr.flag.push(false)
        this.timeArr.text.push(item[i].Text)            
      }
    
    },
    syncDisplaySwitch(flag) {
      this.syncRollFlag = flag
    },    
    syncDisplay () {
      // console.log("%c this.disHandle local","color:blue")
      // console.log(this.disHandle)
      if(!this.disHandle1){
        this.disHandle1 = (p) => {
          let timeMs = Math.floor(p*1000)
          // this.syncJudge(time)



          var nearestItem = 0;
          var longestItem = 0;
          var longestDuration = 0;
          var inItems = [];   // 时间范围包含当前播放时间的所有items
          var percent = 0;
          var nearestDistance = 100000000;
          var translist = this.resdata


          for (var i = 0, len = translist.length; i < len; i++) {

              var beginTime = (translist[i].StartTime).toFixed(2)*1000
              var endTime = (translist[i].EndTime).toFixed(2)*1000
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
              Array.forEach(this.currentPlayingItems,  (i) => {
                  document.querySelector(`.text[data-num="${i}"]`) ? document.querySelector(`.text[data-num="${i}"]`).classList.remove('selected') : ''

              });

              Array.forEach(inItems,  (i) => {
                  document.querySelector(`.text[data-num="${i}"]`) ? document.querySelector(`.text[data-num="${i}"]`).classList.add('selected') : ''
              });
              this.currentPlayingItems = inItems;
          }

          if(this.syncRollFlag){
            return
          }

          let fatherElement = document.querySelector('.child1')
          let selectElement = document.querySelectorAll('.text.selected')
          let fatherTop = fatherElement.offsetTop
          let selectTop = selectElement[0]?selectElement[0].offsetTop:null
          this.syncRoll(selectTop,fatherTop)
        }
      }
      

      // console.log(this.wavesurfer)
      // console.log(this.$store.state.ql.wavesurfer)

      if(this.isplay){
        this.wavesurfer.on('audioprocess',this.disHandle1)
      }else{
        // this.IntervalFlag = false
        this.wavesurfer.un('audioprocess',this.disHandle1)
      }
    },
    //同步播放区域判断
    syncJudge (time) {
      let timeArr = this.timeArr
      for(let i=0;i<timeArr.begintime.length;i++){

        this.$set(this.timeArr.flag,i,true)
        if(time <= (timeArr.begintime[i]-150) || time >= (timeArr.endtime[i]+150)){

          this.$set(this.timeArr.flag,i,false)
        }
      }
      this.timeArr = timeArr
    },
    //同步滚动
    //cache 没有selected块时 保持滚动高度
    syncRoll (selectTop,fatherTop) {

      if(this.syncRollFlag){
        return
      }
      let fatherElement = document.querySelector('.child1')
      let height = document.querySelector('.child1').offsetHeight
      let cache = this.cache

      if(!selectTop){
        fatherElement.scrollTop = cache
      }else if((selectTop-fatherTop)>(height/2) || (selectTop-fatherTop)<0){

        fatherElement.scrollTop = selectTop-fatherTop-height/2
        this.cache = fatherElement.scrollTop
      }

    },    
    textPlay (item,e) {

      // this.$emit('childPlay', 1,5+0.5)
      // return


      let begintime = Number((item.StartTime).toFixed(2))
      let endtime = Number((item.EndTime).toFixed(2))
      // console.log('begintime')
      // console.log(begintime)
      // console.log('endtime')
      // console.log(endtime)
      if(begintime - endtime == 0){
        // that.wavePlay(begintime,endtime+0.5)
        this.$emit('childPlay', begintime,endtime+0.5)
      }else{
        this.$emit('childPlay', begintime,endtime)
        // that.wavePlay(begintime,endtime)
        this.Utils.waveRegion(this.wavesurfer,begintime,endtime,'rgba(0,180,0,.3)')
      }

    },


    

  },
  
  beforeCreate() {
    
  },
  created() {
    // console.log('%c local created','color: green')
    // this.openDb()
    // this.setLanguage()

    // this.rcobtn = this.getrcobtn()
    // this.RCOBTN_DATA(this.getrcobtn())
  },
  beforeMount() {

  },
  mounted () {

    // document.querySelector(".transcribe .child1").onmousewheel = (e) => {
    //   // console.log(e)  
    //   this.syncRollFlag = true
    //   this.SYNCROLLFLAG(this.syncRollFlag)   
    // }
  },
  beforeUpdate () {

  },
  updated() {
    
  },
  activated() {
    // console.log('%c local activated','color: green')
    this.openDb()
  },
  deactivated() {

  },
  beforeDestroy() {

  },
  destroyed() {
    // console.log('%c local destroyed','color: green')
    // console.log('local destroyed')
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
          color: #fff;
          border-radius: 15px;
          background-color: #ffa6b5;
          text-align: center;
          margin: 10px 0 0 10px;
        }
        .time{
          color: #999;
          margin: 10px 0 0 20px;
        }
      }
      .bottom{
        display: flex;
        .text{
          // max-width: calc(100% - 80px - 60px);
          max-width: calc(100% - 230px - 60px);
          // flex-grow: 2;
          color: #666;
          margin-left: 58px;
          background-color: #fff;
          padding: 10px;
          border-radius: 3px;
          box-shadow: 0 2px 10px 1px #ccc;
          line-height: 20px;
          flex-shrink: 0;
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
          // width: 80px;
          // flex-grow: 1;
          margin-left: 10px;
          flex-shrink: 1;
          display: flex;
          .icons{
            width: 18px;
            height: 18px;
            // margin: 11px 0 0 10px;
            margin-right: 10px;
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
    .call{
      display: flex;
      flex-direction: column;
      .top{
        display: flex;
        flex-direction: row-reverse;
        .icon{
          padding: 1px 3px;
          color: #fff;
          border-radius: 15px;
          background-color: #399adb;
          text-align: center;
          margin: 10px 0 0 10px;
        }
        .time{
          color: #999;
          margin: 10px 0 0 20px;
        }
      }
      .bottom{
        display: flex;
        flex-direction: row-reverse;
        .text{
          max-width: calc(100% - 230px - 60px);
          // flex-grow: 2;
          color: #666;
          margin-right: 58px;
          background-color: #fff;
          padding: 10px;
          border-radius: 3px;
          box-shadow: 0 2px 10px 1px #ccc;
          line-height: 20px;
          flex-shrink: 0;
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
          // width: 80px;
          // flex-grow: 1;
          margin-left: 10px;
          flex-shrink: 1;
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

  .ellipsis{
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
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
        span{
          height: 24px;
          display:inline-block;
          line-height: 24px;
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


  }
</style>
