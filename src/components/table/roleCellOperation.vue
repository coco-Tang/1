<!--
 * @Author: coco-Tang
 * @Date: 2019-10-16 17:28:46
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-25 12:06:11
 * @Description: 
 -->
<template>
  <div class="cellOperation" ref="childComponent">
    <el-button class="task-info-edit" @click="edit">编辑</el-button>
  </div>
</template>

<script>
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      parent: null
    };
  },
  methods: {
    edit() {
      console.log("%cedit -- this.params:", "color:green", this.params);
      this.parent.updateAuth.data = this.params.data;
      this.parent.updateAuth.isEdit = true;
      this.parent.$refs.c4.showDialog();
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