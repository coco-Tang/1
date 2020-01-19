<template>
  <Gender :Arr="genderArr"></Gender>
</template>
<script>
import Gender from "./component";
export default {
  data() {
    return {
      genderArr: [
        {
          label: "男性总数",
          name: "dispatcher_man_total"
        },
        {
          label: "女性总数",
          name: "dispatcher_woman_total"
        },
        {
          label: "男和女总数",
          name: "dispatcher_man_woman_total"
        },
        {
          label: "未知性别总数",
          name: "dispatcher_unknown_gender_total"
        },
        {
          label: "有效音总数",
          name: "dispatcher_valid_total"
        },
        {
          label: "无效音总数",
          name: "dispatcher_invalid_total"
        }
      ]
    };
  },
  components: { Gender }
};
</script>



