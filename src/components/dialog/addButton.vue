<template>
  <div class="addButton">
  	<el-dialog
      title="检索条件"
      :visible.sync="addButtonDialog"

      >
      <div class="addButtonDialog">
        <!-- <div class="title"></div> -->
        <ul>
          <!-- <li><el-checkbox-button plain>检索文件</el-checkbox-button></li> -->

          <li><el-checkbox-button plain v-model="buttonList.keyword">关键词</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.voiceprint">声纹对象</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.file">检索文件</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.language">语种</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.threshold">阈值</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.gender">性别</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.feature">号码特征</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.origin">来源平台</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.limit">结果上限</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.timewindow">时间窗</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.level">话单级别</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.duration">通话时长</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.timeselect">时间选择</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.speechseg">固定音频</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.number">号码筛选</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.caller">主叫归属地</el-checkbox-button></li>
          <li><el-checkbox-button plain v-model="buttonList.callee">被叫归属地</el-checkbox-button></li>

    
        </ul>  
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addButtonDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'addButton',
  data () {
    return {
      checkList:'',
      autoRecognizeValue:'',
      autoRecognize:'',
      addButtonDialog:false
    }
  },
  props: {
    myMessage: Boolean,
    buttonList:{}
  },
  methods:{
    addButtonHandle() {
      this.addButtonDialog = true
      // console.log('click')
      // console.log(this.buttonList)
    }
  },
  beforeCreate() {

  },
  created() {

  },
  beforeMount() {

  },
  mounted() {
     
  },
  beforeUpdate() {

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
  .addButtonDialog{
    ul{
      display: flex;
      flex-wrap: wrap;
      li{
        width: 80px;
        height: 80px;
        margin-right: 20px;
        margin-bottom: 20px;
        &:nth-child(4n){
          margin-right: 0;
        }
      }
    }
  }
</style>