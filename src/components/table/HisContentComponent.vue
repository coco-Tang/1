<template>
    <div class="HisContentComponent" ref="childComponent">
      <!-- <div class="keywords" v-if="this.params.data.queryParams.keywords.length">关键词&nbsp;:
        <ul>
          <li v-for="item in this.keywordsarr"><bdi>{{item.name}}</bdi>({{item.count}})</li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.queryParams.speakers.length">声纹&nbsp;:
        <ul>
          <li v-for="item in this.speakersarr"><bdi>{{item.name}}</bdi>({{item.count}})</li>
        </ul>
      </div> -->
      <!-- <div class="speechsegs" v-if="this.params.data.queryParams.speechseghits">固定音频&nbsp;:
        <ul>
          <li v-for="item in this.speechsegsarr"><bdi>{{item.name}}</bdi>({{item.count}}个)</li>
        </ul>
      </div> -->
      <div class="keywords" v-if="this.params.data.queryParams.keywords">关键词&nbsp;:
        <ul>
          <li v-for="item in this.keywordsarr"><bdi>{{item}}</bdi></li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.queryParams.speakers">声纹&nbsp;:
        <ul>
          <li v-for="item in this.speakersarr"><bdi>{{item}}</bdi></li>
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
      arrHashFilter (arr) {
        var result = [], hash = {};
        for (var i = 0; i<arr.length ; i++) {

          let elem = arr[i]
          if (!hash[elem]) {

            hash[elem] = {
              count: 1,
              name: elem,
            }
          }else{
            hash[elem].count++
            // arr[i].score > hash[elem].score ? hash[elem].score = arr[i].score : ''
          }
        }
        return hash;
      },
      dataInit() {
        let data = this.params.data.queryParams
        if(data.keywords){
          // this.keywordsarr = this.arrHashFilter(data.keywords)
          this.keywordsarr = data.keywords
        }
        if(data.speakers){

            // this.speakersarr = this.arrHashFilter(data.speakers)
          this.speakersarr = data.speakers
        }
        // if(data.speechseghits){
        //   if(data.speechseghits.combiner){
        //     this.speechsegsarr = this.arrHashFilter(data.speechseghits.combiner,'speechsegid')
        //   }else if(data.speechseghits.achannel || data.speechseghits.bchannel){
        //     // this.speechsegsarr = this.arrHashFilter(data.speechseghits.achannel.concat(data.speechseghits.bchannel),'speechsegid')
        //   }
        // }
      }
    },
    created() {

      this.dataInit()    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.HisContentComponent{
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