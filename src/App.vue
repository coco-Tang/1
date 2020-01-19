<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/"><el-button type="primary">home</el-button></router-link> |
      <router-link to="/about"><el-button type="primary">about</el-button></router-link>
    </div> -->
    <router-view/>
  </div>
  
</template>
<script>
  console.log('app.vue')
  console.log = () => {}
</script>
<style lang="scss">
@import 'style/index.scss';
	#app{
		width: 100%;
		height: 100%;
	}
</style>
