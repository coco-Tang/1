<template>
    <div class="targetComponent" ref="childComponent">

<!--       <div class="keywords" v-if="this.params.data.keywords">关键词&nbsp;:
        <ul>
          <li v-for="item in this.params.data.keywords">{{item.keyword}}</li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.speakers">声纹&nbsp;:
        <ul>
          <li v-for="item in this.params.data.speakers">{{item.name}}</li>
        </ul>
      </div>
      <div class="speechsegs" v-if="this.params.data.speechsegs">固定音频&nbsp;:
        <ul>
          <li v-for="item in this.params.data.speechsegs">{{item.name}}</li>
        </ul>
      </div> -->
      <div class="keywords" v-if="this.params.data.appended.kwdhits">关键词&nbsp;:
        <ul>
          <li v-for="item in this.keywordsarr"><bdi>{{item.name}}</bdi>({{item.count}}个)</li>
        </ul>
      </div>
      <div class="speakers" v-if="this.params.data.appended.speakerhits">声纹&nbsp;:
        <ul>
          <li v-for="item in this.speakersarr"><bdi>{{item.name}}</bdi>({{item.count}}个)</li>
        </ul>
      </div>
      <div class="speechsegs" v-if="this.params.data.appended.speechseghits">固定音频&nbsp;:
        <ul>
          <li v-for="item in this.speechsegsarr"><bdi>{{item.name}}</bdi>({{item.count}}个)</li>
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
      arrHashFilter (arr,tag) {
        var result = [], hash = {};
        for (var i = 0; i<arr.length ; i++) {

          let elem = arr[i][tag]
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
        let data = this.params.data.appended
        // console.log('targetComponent --  params.data:', this.params.data)
        if(data.kwdhits){
          if(data.kwdhits.vchannel){
            this.keywordsarr = this.arrHashFilter(data.kwdhits.vchannel,'keyword')
          }else if(data.kwdhits.achannel || data.kwdhits.bchannel){
            // this.keywordsarr = this.arrHashFilter(data.kwdhits.achannel.concat(data.kwdhits.bchannel),'keyword')
          }
        }
        if(data.speakerhits){
          if(data.speakerhits.vchannel){
            this.speakersarr = this.arrHashFilter(data.speakerhits.vchannel,'speakerid')
          }else if(data.speakerhits.achannel || data.speakerhits.bchannel){
            // this.speakersarr = this.arrHashFilter(data.speakerhits.achannel.concat(data.speakerhits.bchannel),'speakerid')
          }
        }
        if(data.speechseghits){
          if(data.speechseghits.vchannel){
            this.speechsegsarr = this.arrHashFilter(data.speechseghits.vchannel,'speechsegid')
          }else if(data.speechseghits.achannel || data.speechseghits.bchannel){
            // this.speechsegsarr = this.arrHashFilter(data.speechseghits.achannel.concat(data.speechseghits.bchannel),'speechsegid')
          }
        }
      }
    },
    created() {
      // console.log('targetComponent')
      // console.log(this.params)
      // console.log(this.params.data.appended)
      
      // this.params.data.appended.kwdhits = {
      //   achannel:['你好','你好','你好','啊','啊'],
      //   bchannel:['你好','你好','你好','啊','啊'],
      //   combiner:'',
      // }
      this.dataInit()
      // data.speakerhits.combiner ? this.speakersarr = this.Utils.arrHashFilter(data.speakerhits.combiner) : ''
      // data.speechseghits.combiner ? this.speechsegsarr = this.Utils.arrHashFilter(data.speechseghits.combiner) : ''
    },
    mounted() {
      
    }
  });
</script>

<style scoped lang="scss">
.targetComponent{
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