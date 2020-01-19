<template>
    <div class="cellProcessFlag" ref="childComponent">
        <div class="processFlag" :title='processFlag'>{{ processFlag }}</div>
    </div>
</template>

<script>
  import Vue from "vue";
  
  export default Vue.extend({
    data() {
      return {
        processFlag: null,
      }
    },
    methods: {
      restore(flags) {
        let mapping = {
            'char' : ['有效音检测', '语种检测', '性别检测', '声纹检测', '固定音频检测', '端点检测', '拨号音检测', '关键词检测', '全文转写'],
            'code' : [1, 2, 4, 8, 16, 32, 64, 128, 256]
        }
        let arr = []
        mapping['code'].map((e,i) => {
            if (flags & e) {
                arr.push(mapping['char'][i])
            }
        })
        return arr.join(', ')
      },
    },
    mounted() {
      this.processFlag = this.restore(this.params.data.appended.importinfo.processFlag)
    }
  });
</script>

<style scoped lang="scss">
  
</style>