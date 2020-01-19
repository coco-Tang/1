<!--
 * @Author: coco-Tang
 * @Date: 2019-10-16 17:28:46
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-18 17:43:34
 * @Description: 
 -->
<template>
  <div class="cellOperation" ref="childComponent">
    <el-button class="task-info-edit" @click="cancelTask" :disabled="disCancel">取消</el-button>
    <el-button class="task-info-edit" @click="deleteTask" :disabled="disDelete">删除</el-button>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      parent: null,
      state: null,
      disCancel: true,
      disDelete: true
    };
  },
  computed: {
    // isOnline() {
    //   return this.params.data && this.params.data.onlineState;
    // }
  },
  methods: {
    cancelTask() {
      // console.log("%cedit -- this.params:", "color:green", this.params);
      // this.parent.updateMsg.data = this.params.data;
      // this.parent.updateMsg.isEdit = true;
      // this.parent.$refs.compSpeaker.showDialog();
      // this.$emit('cancelTask',this.params.data.id)
      this.$parent.$parent.cancelTask(this.params.data.id)
    },
    deleteTask() {
      // this.$emit('deleteTask',this.params.data.id)
      this.$parent.$parent.deleteTask(this.params.data.id)
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    // console.log('this.params.data.state')
    // console.log(this.params.data)
    // console.log(this.params.data.state)
    this.parent = this.params.context.componentParent;
    this.state = this.params.data.state
    if(this.state == "created" || this.state == "waiting" ||this.state == "submitted" || this.state == "running" ){
      this.disCancel = false
    }else{
      this.disCancel = true
    }

    if(this.state == "completed" || this.state == "failed"){
      this.disDelete = false
    }else{
      this.disDelete = true
    }
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
});
</script>

<style scoped lang="scss">
.cellOperation {
  display: flex;
  height: 40px;
  align-items: center;

  .task-info-edit,
  .task-process-start {
    // padding: 3px;
    padding: 0 10px;
    height: 30px;
  }
  button:nth-of-type(2) {
    margin-left: 6px;
    // background: pink;
  }
}
</style>
