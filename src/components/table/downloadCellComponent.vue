<template>
    <div class="headerComponent" ref="childComponent">
      <!-- <div class="delete" ></div> -->
      <!-- <div class="collection" ></div> -->
      <div class="download" @click="download"></div>
    </div>
</template>

<script>
import {downloadurl} from '@/api/index.js'
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {

      }
    },
    methods: {

      download() {
        console.log('download')
        console.log(this.params.data)

        let url = downloadurl
        url += `"${this.params.data.callid}"]`
        console.log(url)
        window.location.href = url
      }
    },
    mounted() {
    }
  });
</script>

<style scoped lang="scss">
.headerComponent{
  display: flex;
  height: 40px;
  line-height: 40px;
  text-align: center;
  margin-top: 11px;
  // &:hover{
  //   .download{
  //     display: block !important;
  //   }
  // }
  .download{
    margin-left: 10px;
    min-width: 18px;
    width: 18px;
    height: 18px;
    display: none;
    background: url('../../static/images/下载默认.png');

    &:hover{
      background: url('../../static/images/下载选中.png');
    }
    
  }
}
  
</style>
<style lang="scss">
  .ag-row{
    &:hover{
      .headerComponent{
        .download{
          display: block !important;
        }
      }
    }
  }
</style>