<template>
    <div class="cellFileName" ref="childComponent">
        <div class="fileName">{{ fileName }}</div>
    </div>
</template>

<script>
  import Vue from "vue";
  
  export default Vue.extend({
    data() {
      return {
          fileName: ''
      }
    },
    methods: {
    },
    mounted() {
        let arr = this.params.data.appended.importinfo.fileName.split('/')
        this.fileName = arr[arr.length-1]
    }
  });
</script>

<style scoped lang="scss">
  
</style>