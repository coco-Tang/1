<template>
  <Hit :Arr="hitArr"></Hit>
</template>
<script>
import Hit from "./component";
export default {
  data() {
    return {
      hitArr: [
        {
          label: "关键词中标总数",
          name: "dispatcher_kwd_hit_total"
        },
        {
          label: "固定音频中标总数",
          name: "dispatcher_speechseg_hit_total"
        },
        {
          label: "声纹中标总数",
          name: "dispatcher_voiceprint_hit_total"
        },
        {
          label: "维语关键词中标总数",
          name: "dispatcher_wewrkwd_hit_total"
        },
        {
          label: "哈语关键词中标总数",
          name: "dispatcher_hasckwd_hit_total"
        }
      ]
    };
  },
  components: { Hit }
};
</script>



