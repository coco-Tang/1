<template>
    <div class="progressComponent" ref="childComponent">
      <el-progress :percentage="percent" :show-text="true"></el-progress>
    </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        percent: 0
      }
    },
    computed: {
      getTaskProgress(){
        return this.params.data.percent
      },  
    },
    watch: {
      getTaskProgress(){
        this.percent = this.params.data.percent
      }
    },
    methods: {
      mydelete() {
        console.log('collection')
        console.log(this.params.data)
        console.log(this.params.data.number)
        // console.log() 
        this.params.data.mydelete = !this.params.data.mydelete
        // return false
      },

    },
    mounted() {
      this.percent = this.params.data.percent
    }
  });
</script>

<style scoped lang="scss">
.progressComponent{
  // display: flex;
  // height: 40px;
  // line-height: 40px;
  // text-align: center;
  // margin-top: 11px;

}
  
</style>
<style lang="scss">
  .el-progress{
    top: 17px;
  }
</style>