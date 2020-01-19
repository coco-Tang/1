<template>
  <div class="remarkDialog">
  <!-- 	<el-button type="text" @click="dialogVisible = myMessage">点击打开 Dialog</el-button> -->

		<el-dialog
      :before-close="closeDialog"
		  
      title="备注"
		  :visible.sync="dialogVisible"
		  width="460px">
      <el-form label-position="left" :model="ruleForm"  ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="备注" prop="remark">
          <el-input
            maxlength='500'
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            resize="none"
            v-model="ruleForm.remark">
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

export default {
  name: 'phoneDialog',
  data () {
    return {
      dialogVisible: false,
      ruleForm: {
        remark: ''
      },

    }
  },
  // props: ['myMessage']
  props: {
  	updateMsg:Object
  },
  methods: {

    showDialog() {
      this.dialogVisible = true


      if(this.updateMsg.ifUpdate){

        this.ruleForm.remark = this.updateMsg.data.remark   
        
      }
    },

    uploadFile() {
      let params = new URLSearchParams();
      params.append('remark',this.ruleForm.remark)
      params.append('spyid',this.updateMsg.data.spyid)
      params.append('callid',this.updateMsg.data.callid)


      this.$emit('setRemark',params)
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

      this.ruleForm.remark = ''
      

      this.updateMsg.ifUpdate = false
      this.dialogVisible = false

    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .remarkDialog{

  }
	.el-button{
		padding: 10px;
	}
	.el-select{
		margin-top: 10px;
	}
 
</style>