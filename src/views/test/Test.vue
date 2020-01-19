<template>
  <div class="test">
    test
    <router-view/>
    <!-- <component :is="currentRole"></component> -->
  </div>
</template>

<script>
// import { mapGetters } from 'vuex'
// import adminDashboard from './admin'
// import editorDashboard from './editor'

export default {
  name: 'test',
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
  .test{
    width: 100%;
    height: 100%;
    background-color: #777;
    display: flex;
    flex-direction: column;
  }
</style>