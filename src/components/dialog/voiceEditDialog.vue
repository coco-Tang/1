<template>
  <div class="voiceEditDialog">
  <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->

		<el-dialog
      :before-close="closeDialog"
		  
      title="编辑"
		  :visible.sync="dialogVisible"
		  width="460px">
      <el-form label-position="left" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="批次名称" prop="batchName">
          <el-input
            placeholder="请输入内容"
            v-model="ruleForm.batchName"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            placeholder="请输入内容"
            v-model="ruleForm.remark"
            clearable>
          </el-input>
        </el-form-item>
        
      </el-form>
		  
		  <span slot="footer" class="dialog-footer">
        <el-button type="primary" class="checked" @click="uploadFile">确 定</el-button>
		    <el-button @click="resetForm">取 消</el-button>
		  </span>
		</el-dialog>
  </div>
</template>

<script>
import {mapActions,mapGetters} from 'vuex'

export default {
  name: 'phoneDialog',
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        batchName: '',
        remark: ''
      },
      rules: {
        batchName: [
          { required: false, message: '请输入批次名称', trigger: 'blur' },
          // { trigger: 'blur',validator: this.validateDep }
        ],
        remark: [        
          { required: false, message: '请输入备注', trigger: 'blur' },
        ]

      },

    }
  },
  // props: ['myMessage']
  props: {
  	updateMsg:Object
  },
  methods: {
    ...mapGetters(['getAccount']),
    showDialog() {
        alert(777)
      this.dialogVisible = true
      this.ruleForm.batchName = this.updateMsg.data.name   
      this.ruleForm.remark = this.updateMsg.data.remark   
    },

    uploadFile() {

      // let _valid = false
      // this.$refs['ruleForm'].validate((valid) => {
      //   console.log(valid)
      //   if (valid) {
      //     _valid = true
      //   } else {
      //     _valid = false
      //   }
      // })

      // if(!_valid){
      //   return
      // }
      if(this.updateMsg.data.name === this.ruleForm.batchName && this.updateMsg.data.remark === this.ruleForm.remark){
        return this.closeDialog()
      }

      let params = new URLSearchParams();

      params.append('name',(this.ruleForm.batchName).trim())
      // params.append('operator',this.getAccount())
      params.append('id',this.updateMsg.data.id)
      params.append('remark',this.ruleForm.remark || '')
      params.append('opreater',this.updateMsg.data.opreater)


      this.$emit('setEdit',params)
      this.closeDialog()


      // speechsegCreate(params).then(res => {
      //   console.log(res)
      // })
    },
    handleChange() {

    },
    resetForm() {
    
      this.closeDialog()
    },
    closeDialog() {
      this.$refs['ruleForm'].resetFields()

      this.ruleForm.batchName = ''
      

      this.updateMsg.ifUpdate = false
      this.dialogVisible = false

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .voiceEditDialog{

  }
	.el-button{
		padding: 10px;
	}
	.el-select{
		margin-top: 10px;
	}
 
</style>