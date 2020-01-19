<!--
 * @Author: coco-Tang
 * @Date: 2019-11-19 16:44:32
 * @LastEditors: coco-Tang
 * @LastEditTime: 2019-11-29 15:05:21
 * @Description: 
 -->
<template>
  <div class="flex">
    <span class="title">{{label}}</span>
    <el-select v-model="value" placeholder="请选择" @change="getValue">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
  </div>
</template>
<script>
import Bus from "./Bus";
export default {
  data() {
    return {
      value: "男"
    };
  },
  props: {
    options: {
      type: Array,
      default: () => {}
    },
    label: { type: String, default: "" }
  },
  methods: {
    getValue() {
      const label = this.label;
      Bus.$emit("value", [label, this.value]);
      this.$emit("value", this.value);
    }
  }
};
</script>
<style lang="scss" scoped>
.flex {
  .el-select {
    margin: 0 10px !important;
  }
}
.quicklisten {
  .flex {
    .el-select {
      margin: 0 !important;
    }
  }
}
</style>