<template>
    <div class="cellCreator" ref="childComponent">
        <div class="creator">{{ this.params.data.appended.importinfo.importer }}</div>
    </div>
</template>

<script>
  import Vue from "vue";
  
  export default Vue.extend({
    data() {
      return {
      }
    },
    methods: {
    },
    mounted() {
    }
  });
</script>

<style scoped lang="scss">
  
</style>