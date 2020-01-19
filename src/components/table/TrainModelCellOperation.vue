<!--
 * @Author: coco-Tang
 * @Date: 2019-10-16 17:28:46
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-27 17:43:43
 * @Description: 
 -->
<template>
  <div class="cellOperation" ref="childComponent">
    <el-button class="task-info-edit" @click="download">下载</el-button>
    <el-button class="task-info-edit" @click="del">删除</el-button>
  </div>
</template>

<script>
import Vue from "vue";
import { use_iframe_download } from "@/utils";

export default Vue.extend({
  data() {
    return {
      parent: null
    };
  },
  methods: {
    download() {
      use_iframe_download(this.params.data.url);
    },
    del() {
      this.parent.deleteConfirm(this.params.data.id);
    }
  },
  mounted() {
    this.parent = this.params.context.componentParent;
  }
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