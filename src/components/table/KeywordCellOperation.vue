<!--
 * @Author: coco-Tang
 * @Date: 2019-10-16 17:28:46
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-10-18 17:43:52
 * @Description: 
 -->
<template>
  <div class="cellOperation" ref="childComponent">
    <el-button class="task-info-edit" @click="edit" :disabled="isOnline">编辑</el-button>
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
  computed: {
    isOnline() {
      return this.params.data && this.params.data.onlineState;
    }
  },
  methods: {
    edit() {
      console.log("%cedit -- this.params:", "color:green", this.params);
      this.parent.updateMsg.data = this.params.data;
      this.parent.updateMsg.isEdit = true;
      this.parent.$refs.c1.showDialog();
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