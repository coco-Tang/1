<template>
  <div class="testChild">
    testChild
    <!-- <component :is="currentRole"></component> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'testChild',
  // components: { adminDashboard, editorDashboard },
  data() {
    return {
      // currentRole: 'adminDashboard'
    }
  },
  computed: {
    // ...mapGetters([
    //   'roles'
    // ])
  },
  created() {
    // if (!this.roles.includes('admin')) {
    //   this.currentRole = 'editorDashboard'
    // }
  }
}
</script>
<style lang="scss" scoped>
  .testChild{
    width: 100%;
    height: 100%;
    background-color: #999;
  }
</style>