<template>
    <div class="keywordsHitComponent" ref="childComponent">

      <div class="keywords" v-if="this.params.data.keywordsHit">
<!--         <ul>
          <li v-for="item in this.params.data.keywordsHit">{{item.name}}({{(item.score).toFixed(2)}}&nbsp;分)</li>
        </ul>  -->       
        <ul>
          <li v-for="item in this.arr">{{item.name}}({{item.count}}个&nbsp;,&nbsp;{{(item.score).toFixed(2)}}&nbsp;分)</li>
        </ul>
      </div>

    </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        arr: []
      }
    },
    methods: {
      
    },
    created() {
      this.params.data.keywordsHit ? this.arr = this.Utils.arrHashFilter(this.params.data.keywordsHit) : ''
      

    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.keywordsHitComponent{
  ul{
    color: #000;
    display: flex;
    li{
      margin: 0 5px;
    }
  }
  display: flex;
  .langname{
    color: red;
    display: flex;
    margin-right: 10px;  
  }
  .keywords{
    color: red;
    display: flex;
    margin-right: 10px;  
  }
  .speakers{
    color: red;
    display: flex;
    margin-right: 10px;  
  }
  .speechsegs{
    color: red;
    display: flex; 
  }

}
  
</style>