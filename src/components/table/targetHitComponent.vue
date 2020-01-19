<template>
    <div class="targetHitComponent" ref="childComponent">

      <div class="keywords" v-if="this.params.data.keywordsHit">关键词&nbsp;:
        <ul>
          <li v-for="item in this.keywordsarr">{{item.name}}({{item.count}}个)</li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.speakersHit">声纹&nbsp;:
        <ul>
          <li v-for="item in this.speakersarr">{{item.name}}({{item.count}}个)</li>
        </ul>
      </div>
      <div class="speechsegs" v-if="this.params.data.speechsegsHit">固定音频&nbsp;:
        <ul>
          <li v-for="item in this.speechsegsarr">{{item.name}}({{item.count}}个)</li>
        </ul>
      </div>


    </div>
</template>

<script>
  import Vue from "vue";

  export default Vue.extend({
    data() {
      return {
        keywordsarr: [],
        speakersarr: [],
        speechsegsarr: [],
      }
    },
    methods: {

    },
    created() {
      this.params.data.keywordsHit ? this.keywordsarr = this.Utils.arrHashFilter(this.params.data.keywordsHit) : ''
      this.params.data.speakersHit ? this.speakersarr = this.Utils.arrHashFilter(this.params.data.speakersHit) : ''
      this.params.data.speechsegsHit ? this.speechsegsarr = this.Utils.arrHashFilter(this.params.data.speechsegsHit) : ''


    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.targetHitComponent{
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