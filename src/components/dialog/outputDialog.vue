<template>
  <div class="outputDialog">
		<el-dialog
      :before-close="closeDialog"
		  title="导出语料"
		  :visible.sync="dialogVisible"
		  width="420px">
		  <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="语音">
          <el-checkbox-group @change="channelChanged" v-model="checkList">
            <el-checkbox label="A路"></el-checkbox>
            <el-checkbox label="B路"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="语料库" prop="a">
          <el-select v-model="voiceValue" @change="toogleLibrary" placeholder="请选择">
            <el-option
              v-for="item in voiceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属集" prop="b">
          <el-select v-model="setValue" placeholder="请选择">
            <el-option
              v-for="item in setOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <choice-item ref="choice" v-model="ruleForm.type" :options="choiceOptions"  @value="getChoiceValue"></choice-item>
          <!-- <el-select v-model="typeValue" placeholder="请选择">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select> -->
        </el-form-item>


      </el-form>
		  <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="confirmDialogMark('ruleForm')">确 定</el-button>
		    <el-button @click="resetForm">取 消</el-button>    
		  </span>
		</el-dialog>
  </div>
</template>

<script>
// import {getUser,getCase} from '@/api/index.js'
// import {getSpeaker,getLanguage} from '@/api/ql.js'
import {mapActions,mapGetters} from 'vuex'
import {addLibraryVoices} from '@/api/train.js'
import {VOICE_TYPE1,SEARCH_LANGUAGE_TYPE1 ,GENDER_TYPE1,LANGUAGE_LIBRARY_TYPE} from "@/constant";
import ChoiceItem from "@/views/train/components/ChoiceItem";

export default {
  name: 'outputDialog',
  data () {
    return {
      ruleForm:{
        account: '',
        speaker: '',
        speakerOptions: [],
        lang: '',
        langOptions: [],
        gender: '',
        genderOptions: [
          {
            value: 0,
            label: '不确定'
          },{
            value: 1,
            label: '男'
          },{
            value: 2,
            label: '女'
          }
        ],
        duration: {
          start: null,
          end: null
        },

        remark: '',
        type: 'valid'

      },
      rules: {
        type: [
          { required: true, message: '请选择类型', trigger: 'blur' }
        ]
      },
    	checkList: [],
      category: 0,
      categoryOptions: [{
        value: 0,
        label: '正常'
      },{
        value: 1,
        label: '排除'
      },{
        value: 2,
        label: '诈骗'
      }],
      datasource: ['000000'],
      datasourceOptions: [
        {
          value: '000000',
          label: '不限'
        },
        {
          value: '100',
          label: '优浪'
        },
        {
          value: '923',
          label: '十所'
        },
      ],
      dialogVisible: false,
      file: {},
      threshold: 60,
      telrules: '*',
      code: '',
      name: '',
      remark: '',
      formatStart: 0,
      formatEnd: 0,
      formatTime: 0,
      checkList: [],
      voiceValue: 'gender',
      voiceOptions: [
        // {
        //   value: 'voiceDetection',
        //   label: '语音检出库'
        // },
        {
          value: 'gender',
          label: '性别库'
        },{
          value: 'language',
          label: '语种库'
        }
      ],
      setValue: true,
      setOptions: [
        {
          value: false,
          label: '训练集'
        },{
          value: true,
          label: '测试集'
        }
      ],
      // typeValue: 0,
      // typeOptions: [
      //   {
      //     value: 0,
      //     label: '有效无效音'
      //   },{
      //     value: 1,
      //     label: '性别'
      //   },{
      //     value: 2,
      //     label: '语种'
      //   }
      // ],
      sourceType: 'call',
      choiceLable: "语音",
      choiceOptions:GENDER_TYPE1,
      choiceValue: 'valid',
      data: {},
      typeValue: 'valid',
      channel: 'combiner'
    }
  },
  // props: ['myMessage']
  props: {
  	updateMsg:Object
  },
  components: {
    "choice-item": ChoiceItem
  },
  methods: {
    ...mapGetters(['getResData','getPlayerData','getNewqlData']),
    channelChanged(value) {
      console.log('channelChanged')
      console.log(value)
      if(value.length == 0 || value.length == 2){
        this.channel = 'combiner'
      }else if(value[0] == 'A路'){
        this.channel = 'a'
      }else{
        this.channel = 'b'
      }
    },  
    getChoiceValue(value) {
      console.log("getChoiceValue",value)
      this.typeValue = value
      this.ruleForm.type = value
    },
    toogleLibrary(value) {
      // console.log()
      this.$refs["choice"].value = "";


      this.typeValue = ''
      this.ruleForm.type = ''
      
      switch (value) {
        case "gender":
          this.choiceLable = "性别";
          this.choiceOptions = GENDER_TYPE1;
          this.choiceValue = "male";
          break;
        case "language":
          this.choiceLable = "语种";
          this.choiceOptions = SEARCH_LANGUAGE_TYPE1;
          this.choiceValue = "wewr";
          break;
        default:
          this.choiceLable = "语音";
          this.choiceOptions = VOICE_TYPE1;
          this.choiceValue = "valid";
      }
    },

    showDialog(data) {
      // this.ruleForm.duration.start = start
      // this.ruleForm.duration.end = end

      // this.formatStart = (start/1000).toFixed(2)
      // this.formatEnd = (end/1000).toFixed(2)
      // this.formatTime = (end/1000 - start/1000).toFixed(2)
      console.log('outputDialog')
      console.log(data)
      console.log(this.choiceValue)
      this.data = data
      this.dialogVisible = true

      
    },

    confirmDialogMark(formName) {

      let _valid = false
      this.$refs[formName].validate((valid) => {
        if (valid) {
          _valid = true
        } else {  
          _valid = false
        }
      })

      if(!_valid){
        return 
      }

      // if(this.getPlayerData().type==='ql'){
      //   let params = new URLSearchParams();
      //   params.append('callId',this.getResData().callid)
      //   params.append('start',this.ruleForm.duration.start)
      //   params.append('end',this.ruleForm.duration.end)
      //   // params.append('lengthtime',this.ruleForm.duration.end-this.ruleForm.duration.start)
      //   // params.append('speaker',this.ruleForm.speaker)
      //   // params.append('language',this.ruleForm.lang)
      //   // params.append('sex',this.ruleForm.gender)
      //   params.append('content',this.ruleForm.remark)
      //   params.append('startTime',this.getResData().starttime)
      //   this.$emit('setAnnotation',params)
      // }
      // let params = new URLSearchParams()
      // params.append('callId',this.data.callid)
      // params.append('type',this.voiceValue)
      // params.append('typeValue',this.typeValue)
      // params.append('isTest',this.setValue)
      // params.append('channel',this.channel)
      // params.append('sourceType',this.sourceType)
      let params = {
        'callId':this.data.callid,
        'type':this.voiceValue,
        'typeValue':this.typeValue,
        'isTest':this.setValue,
        'channel':this.channel,
        'sourceType':this.sourceType,
      }

      addLibraryVoices(params).then(res=>{
        console.log('addLibraryVoices')
        console.log(res)
        this.$message.success('导出成功');

      }).catch(err => {
        this.$message.error(err.response.data.msg);
      });

      


      this.closeDialog()

    },
    handleChange() {

    },
    resetForm() {
    
      this.closeDialog()
    },
    closeDialog() {
      // this.ruleForm.speaker = ''
      // this.ruleForm.lang = ''
      // this.ruleForm.gender = ''
      // this.ruleForm.remark = ''
      // this.ruleForm.type = 'valid'
      

      // this.updateMsg.ifUpdate = false
      this.dialogVisible = false

    },
   
  },
  beforeCreate() {
    
  },
  created() {
    // this.ruleForm.account = this.getAccount()
    // this.account = this.getAccount()
    // this.setSpeaker()
    // this.setLanguage()
    // console.log('created')
    // console.log(this.langOptions)
    
  },
  beforeMount() {
    // console.log('beforeMount')
    // console.log(this.langOptions)
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
  .outputDialog{

  }
	.el-button{
		padding: 10px;
	}
	.el-select{
		// margin-top: 10px;
	}
 
</style>