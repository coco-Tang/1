<template>
    <div class="headerComponent" ref="childComponent">
      <!-- <div class="delete" ></div> -->
      <!-- <div class="collection" ></div> -->
      <div class="download" @click="download"></div>
    </div>
</template>

<script>

import {downloadurl} from '@/api/index.js'
  // import Vue from "vue";

  // export default Vue.extend({

  export default{
    data() {
      return {

      }
    },
    methods: {
      download() {
        // console.log(this.params) 
        // console.log(this.params.api.getSelectedRows()) 

        let url = downloadurl, data = this.params.api.getSelectedRows()



        if(data.length === 0){
          return
        }
        
        for(let k in data){
          url += `"${data[k].callid}",`
        }
        url = url.replace(/,$/,']')
        window.location.href = url
      }
    },
    mounted() {
    }
  };
</script>

<style scoped lang="scss">
.headerComponent{
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-top: 11px;
  .delete{
    min-width: 18px;
    width: 18px;
    height: 18px;
    background: url('../../static/images/删除默认.png');

    &:hover{
      background: url('../../static/images/删除选中.png');
    }
    
  }
  .download{
    margin-left: 10px;
    min-width: 18px;
    width: 18px;
    height: 18px;
    background: url('../../static/images/下载默认.png');

    &:hover{
      background: url('../../static/images/下载选中.png');
    }
    
  }
}
  
</style>