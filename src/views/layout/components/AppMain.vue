<template>
  <!-- <section class="app-main" style="min-height: 100%"> -->
    <!-- <transition name="fade" mode="out-in"> -->
      <!-- <keep-alive> -->
        <!-- <router-view></router-view> -->
      <!-- </keep-alive> -->
    <!-- </transition> -->
  <!-- </section> -->
  <div class="app-main">
    <!-- <router-view></router-view> -->
    <keep-alive include="monitor">
      <router-view/>
    </keep-alive>
    
  </div>
</template>

<script>
export default {
  name: 'AppMain',
  // computed: {
    // cachedViews() {
      // return this.$store.state.tagsView.cachedViews
    // }
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  // }
}
</script>

<style lang="scss" scoped>
  .app-main{
    width: 100%;
    // height: auto;
    height: calc(100% - 60px);
    background-color: #dfe0eb;
    // height: 100%;
    display: flex;
    padding: 10px;
  }
</style>