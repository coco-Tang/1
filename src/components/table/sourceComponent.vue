<template>
    <div class="sourceComponent" ref="childComponent">
      <div class="keywords" v-if="this.params.data.keywords">关键词&nbsp;:
        <ul>
          <!-- <li v-for="item in this.params.data.keywords">{{item}}({{this.params.data.keywords.length}}个)</li> -->
          <li v-for="item in this.params.data.keywords">{{item}}</li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.speakersNames">声纹&nbsp;:
        <ul>
          <!-- <li v-for="item in this.params.data.speakers">{{item}}({{this.params.data.speakers.length}}个)</li> -->
          <li v-for="item in this.params.data.speakersNames">{{item}}</li>
        </ul>
      </div>
      <div class="speechsegs" v-if="this.params.data.speechsegsNames">固定音频&nbsp;:
        <ul>
          <!-- <li v-for="item in this.params.data.speechsegs">{{item}}({{this.params.data.speechsegs.length}}个)</li> -->
          <li v-for="item in this.params.data.speechsegsNames">{{item}}</li>
        </ul>
      </div>
      <div class="voice" v-if="this.params.data.searchvoice">文件&nbsp;:
        <ul>
          <li>{{this.params.data.searchvoice.filename}}</li>
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
        video: ''
      }
    },
    methods: {

    },
    created() {
      // console.error('this.params')
      // console.log(this.params)
      this.params.data.keywords ? this.keywordsarr = this.Utils.arrHashFilter(this.params.data.keywords) : ''
      this.params.data.speakers ? this.speakersarr = this.Utils.arrHashFilter(this.params.data.speakers) : ''
      this.params.data.speechsegs ? this.speechsegsarr = this.Utils.arrHashFilter(this.params.data.speechsegs) : ''

      // console.log(this.keywordsarr)
      // console.log(this.speakersarr)
      // console.log(this.speechsegsarr)
    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.sourceComponent{
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
  .voice{
    color: red;
    display: flex; 
  }

}
  
</style>