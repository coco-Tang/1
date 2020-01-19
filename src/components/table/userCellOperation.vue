<!--
 * @Author: coco-Tang
 * @Date: 2019-10-16 17:28:46
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-12-02 17:43:54
 * @Description: 
 -->
<template>
  <div class="cellOperation" ref="childComponent">
    <el-button class="task-info-edit" @click="edit">编辑</el-button>
    <el-button class="task-info-edit" @click="reset">重置</el-button>
  </div>
</template>

<script>
import Vue from "vue";
import { confirm_message } from "@/utils";

export default Vue.extend({
  data() {
    return {
      parent: null
    };
  },
  methods: {
    edit() {
      console.log("%cedit -- this.params:", "color:green", this.params);
      this.parent.updateMsg.data = this.params.data;
      this.parent.updateMsg.isEdit = true;
      this.parent.$refs.compUser.showDialog();
    },
    async reset() {
      const status = await confirm_message("确定重置密码？");
      if (status) {
        this.parent.resetPassword(this.params.data);
      }
    }
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.parent = this.params.context.componentParent;
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
  }
  button:nth-of-type(2) {
    margin-left: 6px;
    // background: pink;
  }
}
</style>