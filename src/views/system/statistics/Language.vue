<template>
  <Language :Arr="languageArr"></Language>
</template>
<script>
import Language from "./component";
export default {
  data() {
    return {
      languageArr: [
        {
          label: "英语总数",
          name: "dispatcher_engl_total"
        },
        {
          label: "哈语总数",
          name: "dispatcher_hasc_total"
        },
        {
          label: "沪语总数",
          name: "dispatcher_huyu_total"
        },
        {
          label: "日语总数",
          name: "dispatcher_japa_total"
        },
        {
          label: "韩语总数",
          name: "dispatcher_kore_total"
        },
        {
          label: "汉语总数",
          name: "dispatcher_mand_total"
        },
        {
          label: "粤语总数",
          name: "dispatcher_yueh_total"
        },
        {
          label: "维语总数",
          name: "dispatcher_wewr_total"
        },
        {
          label: "其他语种总数",
          name: "dispatcher_other_lang_total"
        }
      ]
    };
  },
  components: { Language }
};
</script>



