<template>
    <div class="speakersHitComponent" ref="childComponent">

      <div class="speakers" v-if="this.params.data.speakersHit">
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
    created() {
      this.params.data.speakersHit ? this.arr = this.Utils.arrHashFilter(this.params.data.speakersHit) : ''

    },
    methods: {
      
    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.speakersHitComponent{
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