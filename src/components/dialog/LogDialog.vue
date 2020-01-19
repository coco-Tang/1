<!--
 * @Author: coco-Tang
 * @Date: 2019-11-28 09:34:50
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-04 16:59:45
 * @Description: 
 -->
<template>
  <div class="logDialog">
    <el-dialog :before-close="closeDialog" title="任务日志" :visible.sync="dialogVisible" width="620px">
      <el-input type="textarea" placeholder="请输入内容" :readonly="true" v-model="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "logDialog",
  data() {
    return {
      textarea: "",
      dialogVisible: false
    };
  },
  props: {
    updateMsg: Object
  },
  methods: {
    showDialog() {
      this.dialogVisible = true;
      this.textarea = this.updateMsg.data.log;
    },

    closeDialog() {
      this.dialogVisible = false;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<!-- <style scoped lang="scss">
.log {
  background-color: rgb(250, 250, 192);
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  min-height: 300px;
}
.el-button {
  padding: 10px;
}
.el-select {
  // margin-top: 10px;
}
</style> -->
<style lang="scss">
.logDialog {
  // background-color:rgb(250, 250, 192);
  // padding:10px;
  // border: 1px solid #ccc;
  // border-radius: 5px;
  // min-height: 300px;
  .el-textarea__inner {
    height: calc(80vh - 200px);
  }
  textarea {
    background-color: #f5f1e1;
    font-size: 12px;
    min-height: 300px !important;
  }
}
</style>