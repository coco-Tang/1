<template>
    <div class="cellCreateTime" ref="childComponent">
        <div class="createTime" :title='importTime'>{{ importTime }}</div>
    </div>
</template>

<script>
  import Vue from "vue";
  import * as utils from '@/utils/index'
  
  export default Vue.extend({
    data() {
      return {
        importTime: ''
      }
    },
    methods: {
    },
    mounted() {
      utils.dateFormat()
      this.importTime = new Date(this.params.data.appended.importinfo.importTime).format("yyyy-MM-dd hh:mm:ss")
    }
  });
</script>

<style scoped lang="scss">
  
</style>